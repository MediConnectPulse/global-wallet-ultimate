import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, generateRecoveryKey } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import Constants from "expo-constants";

const AuthContext = createContext<any>(null);
const ADMIN_MOBILE = "+919992385580";
const SESSION_TIMEOUT_HOURS = 24;

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const generateDeviceId = () => {
    try {
      return Application.androidId || Application.applicationId || "unknown-device";
    } catch {
      return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  };

  const loadUser = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      const sessionTimestamp = await AsyncStorage.getItem("sessionTimestamp");
      const deviceId = await AsyncStorage.getItem("deviceId");

      if (!id) {
        setIsLoading(false);
        return;
      }

      if (sessionTimestamp) {
        const sessionTime = parseInt(sessionTimestamp);
        const currentTime = Date.now();
        const sessionAge = currentTime - sessionTime;
        const timeoutMs = SESSION_TIMEOUT_HOURS * 60 * 60 * 1000;

        if (sessionAge > timeoutMs) {
          await logout();
          setIsLoading(false);
          return;
        }
      }

      if (id) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (data) {
          const currentDeviceId = generateDeviceId();

          if (data.device_id && data.device_id !== currentDeviceId) {
            await logout();
            setIsLoading(false);
            return;
          }

          if (!data.device_id && deviceId) {
            await supabase
              .from("users")
              .update({ device_id: deviceId })
              .eq("id", id);
          }

          setUser(data);

          await AsyncStorage.setItem("sessionTimestamp", Date.now().toString());
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (mobile: string, pin: string) => {
    try {
      const formatted = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
      const deviceId = generateDeviceId();

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("mobile_number", formatted)
        .eq("pin_code", pin)
        .single();

      if (data) {
        const currentDeviceId = generateDeviceId();

        if (data.device_id && data.device_id !== currentDeviceId) {
          return {
            success: false,
            error: "Account linked to another device. Please contact support.",
          };
        }

        if (!data.device_id) {
          await supabase
            .from("users")
            .update({ device_id: currentDeviceId })
            .eq("id", data.id);
        }

        await AsyncStorage.setItem("userId", data.id);
        await AsyncStorage.setItem("deviceId", currentDeviceId);
        await AsyncStorage.setItem("sessionTimestamp", Date.now().toString());

        setUser(data);
        return { success: true };
      }
      return { success: false };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (
    mobile: string,
    pin: string,
    referralCode: string,
    fullName: string,
  ) => {
    try {
      const formattedMobile = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
      const recoveryKey = generateRecoveryKey();
      const deviceId = generateDeviceId();

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
            device_id: deviceId,
            wallet_balance: 0,
          },
        ])
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      await AsyncStorage.setItem("userId", data.id);
      await AsyncStorage.setItem("deviceId", deviceId);
      await AsyncStorage.setItem("sessionTimestamp", Date.now().toString());

      setUser(data);
      return { success: true, recoveryKey };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const resetPin = async (mobile: string, recoveryKey: string, newPin: string) => {
    try {
      const formatted = mobile.startsWith("+91") ? mobile : `+91${mobile}`;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("mobile_number", formatted)
        .eq("recovery_key", recoveryKey)
        .single();

      if (error || !data) {
        return { success: false, error: "Invalid mobile number or recovery key" };
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ pin_code: newPin })
        .eq("id", data.id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("sessionTimestamp");
      await AsyncStorage.removeItem("deviceId");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const checkSessionTimeout = async () => {
    const sessionTimestamp = await AsyncStorage.getItem("sessionTimestamp");
    if (sessionTimestamp) {
      const sessionTime = parseInt(sessionTimestamp);
      const currentTime = Date.now();
      const sessionAge = currentTime - sessionTime;
      const timeoutMs = SESSION_TIMEOUT_HOURS * 60 * 60 * 1000;

      if (sessionAge > timeoutMs) {
        await logout();
        return true;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        signup,
        resetPin,
        setUser,
        checkSessionTimeout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
