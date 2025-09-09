export interface Video {
  id: number;
  title: string;
  description?: string;
  url: string;
  platform?: 'youtube' | 'vimeo' | 'other';
  video_id?: string;
  thumbnail_url?: string;
  instructor?: string;
  view_count?: number;
  playlist_id?: number;
  playlists?: { name: string };
  tags?: string[];
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  category?: string;
  videos?: Array<{ id: number }>;
}
