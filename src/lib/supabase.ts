import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://holhqptfeanzfhynkygj.supabase.co";

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "sb_publishable_rcE9Csvha87AnDCSXwvQtg_leiTtyOc";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
