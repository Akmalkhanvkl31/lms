import { useState, useEffect, useCallback } from 'react';
import { Video, Playlist } from './types';
import { fetchVideos, fetchPlaylists, deleteVideo as apiDeleteVideo } from './api';

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [videosData, playlistsData] = await Promise.all([fetchVideos(), fetchPlaylists()]);
      setVideos(videosData);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddVideo = useCallback((videoData: Partial<Video>) => {
    setVideos(prev => [...prev, { ...videoData, id: Date.now() } as Video]);
    loadData();
  }, [loadData]);

  const handleAddPlaylist = useCallback((playlistData: Partial<Playlist>) => {
    setPlaylists(prev => [...prev, { ...playlistData, id: Date.now() } as Playlist]);
    loadData();
  }, [loadData]);

  const handleDeleteVideo = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await apiDeleteVideo(id);
        setVideos(prev => prev.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  }, []);

  return {
    videos,
    playlists,
    loading,
    loadData,
    handleAddVideo,
    handleAddPlaylist,
    handleDeleteVideo,
  };
};
