import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Get environment variables from app config or fall back to hardcoded values for development
const appConfig = Constants.expoConfig?.extra || {};

const supabaseUrl =
  appConfig?.SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://fhimlfeqiivrbdbmjymf.supabase.co";

const supabaseKey =
  appConfig?.SUPABASE_KEY ||
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaW1sZmVxaWl2cmJkYm1qeW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODUzMzEsImV4cCI6MjA4Mzk2MTMzMX0.bZ1vrHH2suTRej2fQpta7Z85qs7PP0EM6Z7dySA5vbQ";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const generateRecoveryKey = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
