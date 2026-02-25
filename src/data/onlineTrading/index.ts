import type { Course } from '@/types/course';
import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';
import { module4 } from './module4';
import { module5 } from './module5';
import { module6 } from './module6';
import { module7 } from './module7';
import { module8 } from './module8';

export const onlineTradingCourse: Course = {
  id: 'online-trading',
  title: 'Online Trading – Financial Markets',
  description: 'This course provides a structured foundation in financial markets and online trading. Learners will understand how markets function, how to analyse assets, manage risk, and execute trades using modern trading platforms. The course balances theory, market mechanics, and practical trading application.',
  thumbnail: '/images/courses/online-trading.jpg',
  category: 'Business',
  level: 'Beginner',
  duration: '8-12 weeks',
  is_free: false,
  price: 290,
  currency: 'ZAR',
  students: 0,
  rating: 0,
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  available: true,
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
    module7,
    module8
  ],
  learningObjectives: [
    'Understand how global financial markets operate',
    'Identify different types of financial markets and instruments',
    'Execute trades using online trading platforms',
    'Analyze assets using technical and fundamental analysis',
    'Manage trading risk effectively',
    'Develop and implement trading strategies'
  ],
  instructor: {
    id: 'online-trading-instructor',
    first_name: 'Financial Markets',
    last_name: 'Expert Team',
    email: 'trading@betaskills.com'
  }
};

export default onlineTradingCourse;
