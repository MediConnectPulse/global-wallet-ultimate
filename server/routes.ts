import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const PREMIUM_FEE = 299;
const T1_REWARD = 50;
const T2_REWARD = 25;

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.params.id)
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/expenses/:userId", async (req, res) => {
    try {
      const { filter } = req.query;
      let query = supabase
        .from("expenses")
        .select("*")
        .eq("user_id", req.params.userId)
        .order("created_at", { ascending: false });

      const now = new Date();
      if (filter === "daily") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        query = query.gte("created_at", startOfDay.toISOString());
      } else if (filter === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        query = query.gte("created_at", startOfWeek.toISOString());
      } else if (filter === "monthly") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        query = query.gte("created_at", startOfMonth.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const { user_id, category, amount, description } = req.body;
      const { data, error } = await supabase
        .from("expenses")
        .insert({ user_id, category, amount, description })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/expenses/:id", async (req, res) => {
    try {
      const { category, amount, description } = req.body;
      const { data, error } = await supabase
        .from("expenses")
        .update({ category, amount, description })
        .eq("id", req.params.id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", req.params.id);
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/referrals/:userId", async (req, res) => {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("referral_code")
        .eq("id", req.params.userId)
        .single();

      const { data: directReferrals } = await supabase
        .from("users")
        .select("id, mobile, is_premium, created_at")
        .eq("referred_by", req.params.userId);

      const { data: rewards } = await supabase
        .from("rewards")
        .select("*")
        .eq("user_id", req.params.userId);

      const t1Total = rewards?.filter(r => r.tier === "T1").reduce((sum, r) => sum + r.amount, 0) || 0;
      const t2Total = rewards?.filter(r => r.tier === "T2").reduce((sum, r) => sum + r.amount, 0) || 0;
      const bonusTotal = rewards?.filter(r => r.tier === "BONUS").reduce((sum, r) => sum + r.amount, 0) || 0;

      res.json({
        referralCode: user?.referral_code,
        directReferrals: directReferrals || [],
        rewards: {
          t1: t1Total,
          t2: t2Total,
          bonus: bonusTotal,
          total: t1Total + t2Total + bonusTotal,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/upgrade", async (req, res) => {
    try {
      const { userId } = req.body;

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*, referred_by")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const { error: updateError } = await supabase
        .from("users")
        .update({ 
          is_premium: true, 
          premium_activated_at: new Date().toISOString() 
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      if (user.referred_by) {
        await supabase.from("rewards").insert({
          user_id: user.referred_by,
          from_user_id: userId,
          tier: "T1",
          amount: T1_REWARD,
          cycle_id: "current",
        });

        const { data: parent } = await supabase
          .from("users")
          .select("referred_by")
          .eq("id", user.referred_by)
          .single();

        if (parent?.referred_by) {
          const { data: parentReferrals } = await supabase
            .from("users")
            .select("id")
            .eq("referred_by", parent.referred_by)
            .eq("is_premium", true);

          if (parentReferrals && parentReferrals.length > 0) {
            await supabase.from("rewards").insert({
              user_id: parent.referred_by,
              from_user_id: userId,
              tier: "T2",
              amount: T2_REWARD,
              cycle_id: "current",
            });
          }
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const { data: users } = await supabase.from("users").select("*");
      const { data: rewards } = await supabase.from("rewards").select("*");

      const totalUsers = users?.length || 0;
      const premiumUsers = users?.filter(u => u.is_premium).length || 0;
      const freeUsers = totalUsers - premiumUsers;
      const activeReferrers = users?.filter(u => {
        const referredCount = users.filter(r => r.referred_by === u.id).length;
        return referredCount > 0;
      }).length || 0;

      const grossRevenue = premiumUsers * PREMIUM_FEE;
      const totalRewardsDistributed = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;
      const netRevenue = grossRevenue - totalRewardsDistributed;

      const userReferralCounts = users?.map(u => ({
        ...u,
        referralCount: users.filter(r => r.referred_by === u.id && r.is_premium).length,
      })).sort((a, b) => b.referralCount - a.referralCount).slice(0, 3) || [];

      res.json({
        totalUsers,
        premiumUsers,
        freeUsers,
        activeReferrers,
        grossRevenue,
        totalRewardsDistributed,
        netRevenue,
        topPerformers: userReferralCounts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/bonus", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const { data, error } = await supabase.from("rewards").insert({
        user_id: userId,
        from_user_id: null,
        tier: "BONUS",
        amount,
        cycle_id: "current",
      }).select().single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
