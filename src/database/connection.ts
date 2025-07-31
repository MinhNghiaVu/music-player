import { createClient } from '@supabase/supabase-js';
import supabaseConfig from './config';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

const connection = {
  /**
   * Initializes the Supabase connection
   */
  initialize: async () => {
    try {
      // Test the connection by fetching server time
      const { data, error } = await supabase.rpc('now');
      
      if (error) {
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
      
      console.log(`Supabase connected at: ${data}`);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error occurred during Supabase initialization');
      }
      return false;
    }
  },

  /**
   * Gets the Supabase client instance
   */
  getClient: () => supabase,

  /**
   * Closes the Supabase connection
   */
  close: async () => {
    // Note: Supabase doesn't have a disconnect method
    console.log('Supabase connection remains open (no explicit close needed)');
  }
};

export default connection;