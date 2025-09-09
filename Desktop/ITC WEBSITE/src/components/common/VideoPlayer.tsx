import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Heart,
  Share2,
  Clock,
  Eye,
  Star,
  User
} from 'lucide-react';

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    description: string;
    url: string;
    platform: 'youtube' | 'vimeo';
    videoId: string;
    thumbnail: string;
    instructor?: string;
    duration?: string;
    views?: number;
    rating?: number;
    category?: string;
    uploadDate?: string;
  };
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  autoplay = false, 
  showControls = true,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getEmbedUrl = () => {
    const baseParams = autoplay ? '?autoplay=1' : '';
    if (video.platform === 'youtube') {
      return `https://www.youtube.com/embed/${video.videoId}${baseParams}&controls=${showControls ? 1 : 0}`;
    } else if (video.platform === 'vimeo') {
      return `https://player.vimeo.com/video/${video.videoId}${baseParams}`;
    }
    return '';
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would control the iframe player
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would control the iframe player volume
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-[1.02] ${className}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
              <Play className="absolute inset-0 w-6 h-6 text-white m-auto" />
            </div>
            <p className="text-white font-semibold">Loading video...</p>
          </div>
        </div>
      )}

      {/* Video Player Container */}
      <div 
        ref={playerRef}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Iframe */}
        <div className="relative aspect-video bg-black">
          <iframe
            ref={iframeRef}
            src={getEmbedUrl()}
            title={video.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
          
          {/* Custom Overlay Controls */}
          {showControls && (
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transform hover:scale-110 transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button onClick={togglePlayPause} className="hover:text-purple-400 transition-colors">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button className="hover:text-purple-400 transition-colors">
                      <SkipBack className="h-5 w-5" />
                    </button>
                    <button className="hover:text-purple-400 transition-colors">
                      <SkipForward className="h-5 w-5" />
                    </button>
                    <button onClick={toggleMute} className="hover:text-purple-400 transition-colors">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <div className="w-20 bg-white/20 rounded-full h-1">
                      <div 
                        className="bg-white h-1 rounded-full"
                        style={{ width: `${volume}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm">
                      {formatDuration(currentTime)} / {video.duration || '0:00'}
                    </span>
                    <button className="hover:text-purple-400 transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                    <button onClick={toggleFullscreen} className="hover:text-purple-400 transition-colors">
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Video Information */}
      <div className="p-6">
        {/* Header with Title and Actions */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white line-clamp-2 flex-1 mr-4 group-hover:text-purple-300 transition-colors duration-300">
            {video.title}
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-red-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-blue-400 rounded-xl transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 z-10">
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    Copy Link
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    Share on Social
                  </button>
                </div>
              )}
            </div>
            
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-purple-400 rounded-xl transition-all duration-300"
              title="Open in new tab"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Video Meta Information */}
        <div className="flex items-center space-x-6 mb-4 text-sm text-gray-400">
          {video.views && (
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{formatViews(video.views)} views</span>
            </div>
          )}
          
          {video.duration && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{video.duration}</span>
            </div>
          )}
          
          {video.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{video.rating}/5</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              video.platform === 'youtube' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <span className="uppercase">{video.platform}</span>
          </div>
        </div>

        {/* Instructor Information */}
        {video.instructor && (
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Instructor</p>
              <p className="font-semibold text-white">{video.instructor}</p>
            </div>
          </div>
        )}
        
        {/* Description */}
        {video.description && (
          <div className="mb-4">
            <p className="text-gray-300 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
              {video.description}
            </p>
          </div>
        )}

        {/* Category Tag */}
        {video.category && (
          <div className="flex items-center justify-between">
            <span className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
              {video.category}
            </span>
            
            {video.uploadDate && (
              <span className="text-xs text-gray-500">
                Uploaded {video.uploadDate}
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
            <Play className="h-5 w-5" />
            <span>Watch Now</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 px-6 py-3 rounded-2xl font-semibold transition-all duration-300">
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500/20 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-500/20 rounded-full animate-float animation-delay-1000 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default VideoPlayer;