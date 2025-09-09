import React, { useState } from 'react';
import { X, List, Plus, Trash2 } from 'lucide-react';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playlistData: any) => void;
  videos: any[];
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, onSubmit, videos }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    selectedVideos: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const playlistData = {
      id: Date.now().toString(),
      ...formData,
      videoCount: formData.selectedVideos.length,
      createdDate: new Date().toISOString().split('T')[0]
    };

    onSubmit(playlistData);
    setFormData({
      name: '',
      description: '',
      category: '',
      selectedVideos: []
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleVideo = (videoId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedVideos: prev.selectedVideos.includes(videoId)
        ? prev.selectedVideos.filter(id => id !== videoId)
        : [...prev.selectedVideos, videoId]
    }));
  };

  const removeVideo = (videoId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedVideos: prev.selectedVideos.filter(id => id !== videoId)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <List className="h-6 w-6 mr-2 text-blue-600" />
              Create Video Playlist
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Leadership Fundamentals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="leadership">Leadership</option>
                  <option value="career">Career Development</option>
                  <option value="skills">Skill Building</option>
                  <option value="innovation">Innovation</option>
                  <option value="communication">Communication</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description of the playlist content and objectives"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Videos for Playlist
              </label>
              
              {/* Selected Videos */}
              {formData.selectedVideos.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Videos ({formData.selectedVideos.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                    {formData.selectedVideos.map(videoId => {
                      const video = videos.find(v => v.id === videoId);
                      return video ? (
                        <div key={videoId} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm text-gray-700">{video.title}</span>
                          <button
                            type="button"
                            onClick={() => removeVideo(videoId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Available Videos */}
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                <div className="p-3 bg-gray-50 border-b">
                  <h4 className="text-sm font-medium text-gray-700">Available Videos</h4>
                </div>
                <div className="p-2 space-y-2">
                  {videos.map(video => (
                    <div key={video.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={formData.selectedVideos.includes(video.id)}
                        onChange={() => toggleVideo(video.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{video.title}</p>
                        <p className="text-xs text-gray-500">{video.instructor}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {video.platform.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;