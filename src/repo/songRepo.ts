// CRUD for songs to update database
import { supabase } from "@/integrations/supabase/client";

export const createSong = async (
  song: <'songs'>,
): Promise<Tables<'songs'>> => {
  const { data, error } = await supabase
    .from('songs')
    .insert(song)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error creating song: ${error.message}`);
  }

  return data;
}
)