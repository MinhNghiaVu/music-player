import dotenv from "dotenv";

dotenv.config();

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const getSupabaseConfig = (): SupabaseConfig => {
  const url = process.env["VITE_SUPABASE_URL"];
  const anonKey = process.env["VITE_SUPABASE_ANON_KEY"];

  if (!url) {
    throw new Error('VITE_SUPABASE_URL is not set in environment variables');
  }

  if (!anonKey) {
    throw new Error('VITE_SUPABASE_ANON_KEY is not set in environment variables');
  }

  return { url, anonKey };
};

const supabaseConfig = getSupabaseConfig();

export default supabaseConfig;