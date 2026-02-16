// server/index.ts
import express from "express";

// server/routes.ts
import { createServer } from "node:http";
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL || "";
var supabaseKey = process.env.SUPABASE_KEY || "";
var supabase = createClient(supabaseUrl, supabaseKey);
var PREMIUM_FEE = 299;
var T1_REWARD = 50;
var T2_REWARD = 25;
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", req.params.id).single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/expenses/:userId", async (req, res) => {
    try {
      const { filter } = req.query;
      let query = supabase.from("expenses").select("*").eq("user_id", req.params.userId).order("created_at", { ascending: false });
      const now = /* @__PURE__ */ new Date();
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/expenses", async (req, res) => {
    try {
      const { user_id, category, amount, description } = req.body;
      const { data, error } = await supabase.from("expenses").insert({ user_id, category, amount, description }).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/expenses/:id", async (req, res) => {
    try {
      const { category, amount, description } = req.body;
      const { data, error } = await supabase.from("expenses").update({ category, amount, description }).eq("id", req.params.id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/expenses/:id", async (req, res) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/referrals/:userId", async (req, res) => {
    try {
      const { data: user } = await supabase.from("users").select("referral_code").eq("id", req.params.userId).single();
      const { data: directReferrals } = await supabase.from("users").select("id, mobile, is_premium, created_at").eq("referred_by", req.params.userId);
      const { data: rewards } = await supabase.from("rewards").select("*").eq("user_id", req.params.userId);
      const t1Total = rewards?.filter((r) => r.tier === "T1").reduce((sum, r) => sum + r.amount, 0) || 0;
      const t2Total = rewards?.filter((r) => r.tier === "T2").reduce((sum, r) => sum + r.amount, 0) || 0;
      const bonusTotal = rewards?.filter((r) => r.tier === "BONUS").reduce((sum, r) => sum + r.amount, 0) || 0;
      res.json({
        referralCode: user?.referral_code,
        directReferrals: directReferrals || [],
        rewards: {
          t1: t1Total,
          t2: t2Total,
          bonus: bonusTotal,
          total: t1Total + t2Total + bonusTotal
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/upgrade", async (req, res) => {
    try {
      const { userId } = req.body;
      const { data: user, error: userError } = await supabase.from("users").select("*, referred_by").eq("id", userId).single();
      if (userError) throw userError;
      const { error: updateError } = await supabase.from("users").update({
        is_premium: true,
        premium_activated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", userId);
      if (updateError) throw updateError;
      if (user.referred_by) {
        await supabase.from("rewards").insert({
          user_id: user.referred_by,
          from_user_id: userId,
          tier: "T1",
          amount: T1_REWARD,
          cycle_id: "current"
        });
        const { data: parent } = await supabase.from("users").select("referred_by").eq("id", user.referred_by).single();
        if (parent?.referred_by) {
          const { data: parentReferrals } = await supabase.from("users").select("id").eq("referred_by", parent.referred_by).eq("is_premium", true);
          if (parentReferrals && parentReferrals.length > 0) {
            await supabase.from("rewards").insert({
              user_id: parent.referred_by,
              from_user_id: userId,
              tier: "T2",
              amount: T2_REWARD,
              cycle_id: "current"
            });
          }
        }
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const { data: users } = await supabase.from("users").select("*");
      const { data: rewards } = await supabase.from("rewards").select("*");
      const totalUsers = users?.length || 0;
      const premiumUsers = users?.filter((u) => u.is_premium).length || 0;
      const freeUsers = totalUsers - premiumUsers;
      const activeReferrers = users?.filter((u) => {
        const referredCount = users.filter((r) => r.referred_by === u.id).length;
        return referredCount > 0;
      }).length || 0;
      const grossRevenue = premiumUsers * PREMIUM_FEE;
      const totalRewardsDistributed = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;
      const netRevenue = grossRevenue - totalRewardsDistributed;
      const userReferralCounts = users?.map((u) => ({
        ...u,
        referralCount: users.filter((r) => r.referred_by === u.id && r.is_premium).length
      })).sort((a, b) => b.referralCount - a.referralCount).slice(0, 3) || [];
      res.json({
        totalUsers,
        premiumUsers,
        freeUsers,
        activeReferrers,
        grossRevenue,
        totalRewardsDistributed,
        netRevenue,
        topPerformers: userReferralCounts
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/bonus", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const { data, error } = await supabase.from("rewards").insert({
        user_id: userId,
        from_user_id: null,
        tier: "BONUS",
        amount,
        cycle_id: "current"
      }).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import * as fs from "fs";
import * as path from "path";
var app = express();
var log = console.log;
function setupCors(app2) {
  app2.use((req, res, next) => {
    const origins = /* @__PURE__ */ new Set();
    if (process.env.REPLIT_DEV_DOMAIN) {
      origins.add(`https://${process.env.REPLIT_DEV_DOMAIN}`);
    }
    if (process.env.REPLIT_DOMAINS) {
      process.env.REPLIT_DOMAINS.split(",").forEach((d) => {
        origins.add(`https://${d.trim()}`);
      });
    }
    const origin = req.header("origin");
    const isLocalhost = origin?.startsWith("http://localhost:") || origin?.startsWith("http://127.0.0.1:");
    if (origin && (origins.has(origin) || isLocalhost)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Credentials", "true");
    }
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
}
function setupBodyParsing(app2) {
  app2.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      }
    })
  );
  app2.use(express.urlencoded({ extended: false }));
}
function setupRequestLogging(app2) {
  app2.use((req, res, next) => {
    const start = Date.now();
    const path2 = req.path;
    let capturedJsonResponse = void 0;
    const originalResJson = res.json;
    res.json = function(bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
      if (!path2.startsWith("/api")) return;
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    });
    next();
  });
}
function getAppName() {
  try {
    const appJsonPath = path.resolve(process.cwd(), "app.json");
    const appJsonContent = fs.readFileSync(appJsonPath, "utf-8");
    const appJson = JSON.parse(appJsonContent);
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}
function serveExpoManifest(platform, res) {
  const manifestPath = path.resolve(
    process.cwd(),
    "static-build",
    platform,
    "manifest.json"
  );
  if (!fs.existsSync(manifestPath)) {
    return res.status(404).json({ error: `Manifest not found for platform: ${platform}` });
  }
  res.setHeader("expo-protocol-version", "1");
  res.setHeader("expo-sfv-version", "0");
  res.setHeader("content-type", "application/json");
  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.send(manifest);
}
function serveLandingPage({
  req,
  res,
  landingPageTemplate,
  appName
}) {
  const forwardedProto = req.header("x-forwarded-proto");
  const protocol = forwardedProto || req.protocol || "https";
  const forwardedHost = req.header("x-forwarded-host");
  const host = forwardedHost || req.get("host");
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;
  log(`baseUrl`, baseUrl);
  log(`expsUrl`, expsUrl);
  const html = landingPageTemplate.replace(/BASE_URL_PLACEHOLDER/g, baseUrl).replace(/EXPS_URL_PLACEHOLDER/g, expsUrl).replace(/APP_NAME_PLACEHOLDER/g, appName);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
function configureExpoAndLanding(app2) {
  const templatePath = path.resolve(
    process.cwd(),
    "server",
    "templates",
    "landing-page.html"
  );
  const landingPageTemplate = fs.readFileSync(templatePath, "utf-8");
  const appName = getAppName();
  log("Serving static Expo files with dynamic manifest routing");
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    if (req.path !== "/" && req.path !== "/manifest") {
      return next();
    }
    const platform = req.header("expo-platform");
    if (platform && (platform === "ios" || platform === "android")) {
      return serveExpoManifest(platform, res);
    }
    if (req.path === "/") {
      return serveLandingPage({
        req,
        res,
        landingPageTemplate,
        appName
      });
    }
    next();
  });
  app2.use("/assets", express.static(path.resolve(process.cwd(), "assets")));
  app2.use(express.static(path.resolve(process.cwd(), "static-build")));
  log("Expo routing: Checking expo-platform header on / and /manifest");
}
function setupErrorHandler(app2) {
  app2.use((err, _req, res, next) => {
    const error = err;
    const status = error.status || error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });
}
(async () => {
  setupCors(app);
  setupBodyParsing(app);
  setupRequestLogging(app);
  configureExpoAndLanding(app);
  const server = await registerRoutes(app);
  setupErrorHandler(app);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`express server serving on port ${port}`);
    }
  );
})();
