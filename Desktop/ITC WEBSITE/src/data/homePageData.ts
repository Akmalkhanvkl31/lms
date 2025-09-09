import { 
  Sparkles, 
  Users, 
  Zap, 
  Target,
  Globe,
  BookOpen,
  TrendingUp,
  Star
} from 'lucide-react';
import { Video } from '../types';

export const featuredVideos: Video[] = [
  {
    id: '1',
    title: 'CEO Interactive Session - Leadership Fundamentals',
    description: 'An engaging session with industry leaders discussing the fundamentals of leadership and career development.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube' as const,
    videoId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    instructor: 'Mr. Rajesh Kumar',
    uploadDate: '2024-07-19',
    tags: ['leadership', 'career', 'ceo']
  },
  {
    id: '2',
    title: 'Industry Veterans Talk - Career Pathways',
    description: 'Learn from experienced professionals about different career opportunities and how to prepare for them.',
    url: 'https://vimeo.com/123456789',
    platform: 'vimeo' as const,
    videoId: '123456789',
    thumbnail: 'https://vumbnail.com/123456789.jpg',
    instructor: 'Ms. Priya Sharma',
    uploadDate: '2024-07-18',
    tags: ['career', 'industry', 'veterans']
  },
  {
    id: '3',
    title: 'Innovation Workshop - Creative Thinking',
    description: 'Develop your creative thinking skills and learn how to approach problems with innovative solutions.',
    url: 'https://www.youtube.com/watch?v=example123',
    platform: 'youtube' as const,
    videoId: 'example123',
    thumbnail: 'https://img.youtube.com/vi/example123/maxresdefault.jpg',
    instructor: 'Dr. Sarah Wilson',
    uploadDate: '2024-07-17',
    tags: ['innovation', 'creative thinking', 'workshop']
  },
  {
    id: '4',
    title: 'Communication Skills Masterclass',
    description: 'Master the art of effective communication in both personal and professional settings.',
    url: 'https://vimeo.com/987654321',
    platform: 'vimeo' as const,
    videoId: '987654321',
    thumbnail: 'https://vumbnail.com/987654321.jpg',
    instructor: 'Prof. Michael Chen',
    uploadDate: '2024-07-16',
    tags: ['communication', 'skills', 'masterclass']
  }
];

export const features = [
  {
    icon: Sparkles,
    title: 'Interactive Learning',
    description: 'Engage with educational 3D theatres and immersive learning experiences.',
    gradient: 'from-purple-400 to-pink-400'
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description: 'Learn from industry veterans and successful professionals.',
    gradient: 'from-blue-400 to-cyan-400'
  },
  {
    icon: Zap,
    title: 'Skill Development',
    description: 'Build essential skills through hands-on projects and assessments.',
    gradient: 'from-green-400 to-teal-400'
  },
  {
    icon: Target,
    title: 'Career Guidance',
    description: 'Discover your passion and prepare for your future career path.',
    gradient: 'from-orange-400 to-red-400'
  }
];

export const highlights = [
  {
    title: 'Educational 3D Theatres',
    description: 'Immersive learning experiences that bring education to life through cutting-edge technology.',
    icon: Globe,
    color: 'text-purple-400'
  },
  {
    title: 'Teacherless Classroom Model',
    description: 'Self-directed learning approach that empowers students to take control of their educational journey.',
    icon: BookOpen,
    color: 'text-blue-400'
  },
  {
    title: 'Industry Collaborations',
    description: 'Partnerships with leading companies providing real-world exposure and networking opportunities.',
    icon: TrendingUp,
    color: 'text-green-400'
  },
  {
    title: 'Content Creator Program',
    description: 'Nurturing 100,000 content creators contributing to industry growth and innovation.',
    icon: Star,
    color: 'text-yellow-400'
  }
];

export const galleryImages = [
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=600'
];
