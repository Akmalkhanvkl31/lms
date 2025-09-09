import React from 'react';
import { FaPlay, FaTrash, FaEye, FaYoutube, FaVimeo, FaList } from 'react-icons/fa';
import { Video, Playlist } from './types';

const getPlatformIcon = (platform?: string): JSX.Element => {
  switch (platform) {
    case 'youtube': return <FaYoutube className="platform-icon youtube" />;
    case 'vimeo': return <FaVimeo className="platform-icon vimeo" />;
    default: return <FaPlay className="platform-icon default" />;
  }
};

interface VideoCardProps {
  video: Video;
  onDelete: (id: number) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete }) => (
  <div className="video-card">
    <div className="video-thumbnail">
      <img 
        src={video.thumbnail_url || '/images/default-video-thumbnail.jpg'} 
        alt={video.title}
        className="thumbnail-image"
      />
      <div className="video-overlay">
        <button className="play-button">
          <FaPlay />
        </button>
      </div>
      <div className="platform-badge">
        {getPlatformIcon(video.platform)}
      </div>
    </div>
    
    <div className="video-content">
      <h3 className="video-title">{video.title}</h3>
      <p className="video-description">{video.description}</p>
      
      <div className="video-meta">
        <div className="meta-item">
          <span className="meta-label">Instructor:</span>
          <span className="meta-value">{video.instructor || 'N/A'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Views:</span>
          <span className="meta-value">{video.view_count || 0}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Playlist:</span>
          <span className="meta-value">{video.playlists?.name || 'None'}</span>
        </div>
      </div>

      {video.tags && video.tags.length > 0 && (
        <div className="video-tags">
          {video.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>

    <div className="video-actions">
      <button 
        className="btn-icon btn-view"
        onClick={() => window.open(video.url, '_blank')}
        title="Watch Video"
      >
        <FaEye />
      </button>
      <button 
        className="btn-icon btn-delete"
        onClick={() => onDelete(video.id)}
        title="Delete Video"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => (
  <div className="playlist-card">
    <div className="playlist-header">
      <div className="playlist-icon">
        <FaList />
      </div>
      <div className="playlist-info">
        <h3 className="playlist-name">{playlist.name}</h3>
        <p className="playlist-description">{playlist.description}</p>
      </div>
    </div>
    
    <div className="playlist-stats">
      <div className="stat-item">
        <span className="stat-number">{playlist.videos?.length || 0}</span>
        <span className="stat-label">Videos</span>
      </div>
      <div className="stat-item">
        <span className="stat-category">{playlist.category || 'General'}</span>
      </div>
    </div>

    <div className="playlist-actions">
      <button className="btn-sm btn-primary">
        View Playlist
      </button>
    </div>
  </div>
);
