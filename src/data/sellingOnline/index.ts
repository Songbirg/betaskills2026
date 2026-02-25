import type { Course } from '@/types/course';
import { module1 } from './module1';
import module2 from './module2';
import { module3 } from './module3';
import { module4 } from './module4';
import { module5 } from './module5';
import { module6 } from './module6';
import { module7 } from './module7';
import { module8 } from './module8';
import { module9 } from './module9';
import { module10 } from './module10';

export const sellingOnlineCourse: Course = {
  id: 'selling-online',
  title: 'Online Selling: From Setup to Scale',
  description: 'This course teaches learners how to sell products or services online successfully. Students will learn how to choose what to sell, set up online stores or marketplace listings, attract customers, close sales, manage fulfillment, and scale profitably using data, automation, and marketing strategies.',
  thumbnail: '/images/courses/selling-online.jpg',
  category: 'Business',
  level: 'Beginner',
  duration: '12 weeks',
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
    module8,
    module9,
    module10
  ],
  learningObjectives: [
    'Identify profitable online selling opportunities',
    'Set up and optimize online sales channels',
    'Create high-converting product listings and offers',
    'Drive traffic and generate sales using digital marketing',
    'Manage orders, payments, and customer service',
    'Analyze performance and scale an online business'
  ],
  instructor: {
    id: 'selling-online-instructor',
    first_name: 'Online Business',
    last_name: 'Expert Team',
    email: 'business@betaskills.com'
  }
};

export default sellingOnlineCourse;
