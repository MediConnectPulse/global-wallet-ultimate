import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// ARCHITECT NOTE: PASTE YOUR REAL KEYS HERE
const supabaseUrl = "https://fhimlfeqiivrbdbmjymf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaW1sZmVxaWl2cmJkYm1qeW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODUzMzEsImV4cCI6MjA4Mzk2MTMzMX0.bZ1vrHH2suTRej2fQpta7Z85qs7PP0EM6Z7dySA5vbQ";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const generateRecoveryKey = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
