import { supabase } from '../../../supabaseClient';
import { Video, Playlist } from './types';

export const fetchVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      playlists(name)
    `);

  if (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
  return data as Video[];
};

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      videos(id)
    `);

  if (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
  return data as Playlist[];
};

export const deleteVideo = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};
