import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, generateRecoveryKey } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<any>(null);
const ADMIN_MOBILE = "+919992385580";

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const id = await AsyncStorage.getItem("userId");
    if (id) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setUser(data);
    }
    setIsLoading(false);
  };

  const login = async (mobile: string, pin: string) => {
    const formatted = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("mobile_number", formatted)
      .eq("pin_code", pin)
      .single();
    if (data) {
      await AsyncStorage.setItem("userId", data.id);
      setUser(data);
      return { success: true };
    }
    return { success: false };
  };

  const signup = async (
    mobile: string,
    pin: string,
    referralCode: string,
    fullName: string,
  ) => {
    const formattedMobile = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
    const recoveryKey = generateRecoveryKey();

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: fullName,
          mobile_number: formattedMobile,
          pin_code: pin,
          recovery_key: recoveryKey,
          referred_by_code: referralCode,
          subscription_status: "free",
          is_admin: formattedMobile === ADMIN_MOBILE,
        },
      ])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    await AsyncStorage.setItem("userId", data.id);
    setUser(data);
    return { success: true, recoveryKey };
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, signup, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
