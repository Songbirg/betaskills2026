import type { Course } from '@/types/course';
import module1 from './module1';
import module2 from './module2';
import module3 from './module3';
import module4 from './module4';
import module5 from './module5';
import module6 from './module6';
import module7 from './module7';
import module8 from './module8';

const aiCartoonMoviesCourse: Course = {
  id: 'ai-cartoon-movies',
  title: 'AI-Assisted Cartoon Movie Making',
  description: 'Master the art of creating animated films using AI tools. Learn how to leverage artificial intelligence for scriptwriting, character design, animation, voice acting, editing, and distribution to produce professional-quality cartoon movies efficiently.',
  thumbnail: '/images/courses/ai-cartoon-movies.jpg',
  category: 'Film & Broadcasting',
  level: 'Intermediate',
  duration: '8-10 weeks',
  is_free: false,
  price: 290,
  currency: 'ZAR',
  students: 0,
  rating: 4.9,
  instructor: {
    id: 'ai-cartoon-movies-instructor',
    first_name: 'Creative AI',
    last_name: 'Production Team',
    email: 'creative@betaskills.com'
  },
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  available: true,
  modules: [module1, module2, module3, module4, module5, module6, module7, module8],
  learningObjectives: [
    'Understand the fundamentals of AI-assisted animation and its applications',
    'Use AI tools for story development, pre-production and planning',
    'Create characters and environments using generative AI',
    'Produce animation using AI-assisted voice, motion and editing tools',
    'Apply post-production workflows (editing, sound, color and rendering)',
    'Publish and market animated content using modern distribution strategies',
    'Work ethically and maintain creative authenticity when using AI'
  ]
};

export default aiCartoonMoviesCourse;
