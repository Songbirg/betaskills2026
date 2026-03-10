import type { Course } from '@/types/course';
import module1 from './module1';
import module2 from './module2';
import module3 from './module3';
import module4 from './module4';
import module5 from './module5';

const bookkeepingCourse: Course = {
  id: 'bookkeeping',
  title: 'Bookkeeping Fundamentals',
  description: 'A comprehensive foundation in bookkeeping, covering theoretical principles, practical applications, and real-world business scenarios. Suitable for beginners, entrepreneurs, students, and entry-level accounting staff.',
  category: 'Business',
  level: 'Beginner',
  duration: '40 hours',
  is_free: false,
  price: 2999,
  currency: 'ZAR',
  students: 0,
  rating: 4.8,
  instructor: {
    id: 'bookkeeping-instructor',
    first_name: 'Financial Training',
    last_name: 'Institute',
    email: 'info@financialtraining.co.za'
  },
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  available: true,
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5
  ]
};

export default bookkeepingCourse;
