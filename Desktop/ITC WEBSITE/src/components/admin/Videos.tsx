import React, { useState } from 'react';
import { FaPlus, FaList } from 'react-icons/fa';
import VideoModal from './VideoModal';
import PlaylistModal from './PlaylistModal';
import { useVideos } from './videos/hooks';
import { VideoCard, PlaylistCard } from './videos/components';
import './Videos.css';

const Videos: React.FC = () => {
  const {
    videos,
    playlists,
    loading,
    handleAddVideo,
    handleAddPlaylist,
    handleDeleteVideo,
  } = useVideos();
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists'>('videos');

  if (loading) {
    return <div className="videos-loading">Loading videos...</div>;
  }

  return (
    <div className="videos-container">
      <div className="videos-header">
        <div className="header-content">
          <h1 className="page-title">Video Library</h1>
          <p className="page-subtitle">Manage educational videos and playlists</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsPlaylistModalOpen(true)}>
            <FaList /> New Playlist
          </button>
          <button className="btn-primary" onClick={() => setIsVideoModalOpen(true)}>
            <FaPlus /> Add Video
          </button>
        </div>
      </div>

      <div className="videos-tabs">
        <button 
          className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos ({videos.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists ({playlists.length})
        </button>
      </div>

      {activeTab === 'videos' && (
        <div className="videos-grid">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} onDelete={handleDeleteVideo} />
          ))}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="playlists-grid">
          {playlists.map(playlist => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      {((activeTab === 'videos' && videos.length === 0) || 
        (activeTab === 'playlists' && playlists.length === 0)) && (
        <div className="empty-state">
          <div className="empty-icon">
            {activeTab === 'videos' ? '🎬' : '📋'}
          </div>
          <h3>No {activeTab} found</h3>
          <p>
            {activeTab === 'videos' 
              ? 'Add your first video to build your library' 
              : 'Create your first playlist to organize videos'
            }
          </p>
          <button 
            className="btn-primary" 
            onClick={() => activeTab === 'videos' ? setIsVideoModalOpen(true) : setIsPlaylistModalOpen(true)}
          >
            <FaPlus /> 
            {activeTab === 'videos' ? 'Add Video' : 'Create Playlist'}
          </button>
        </div>
      )}

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSubmit={handleAddVideo}
      />

      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSubmit={handleAddPlaylist}
        videos={videos}
      />
    </div>
  );
};

export default Videos;
