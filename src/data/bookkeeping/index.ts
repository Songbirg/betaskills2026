import type { Course } from '@/types/course';
import module1 from './module1';
import module2 from './module2';
import module3 from './module3';
import module4 from './module4';
import module5 from './module5';
import module6 from './module6';
import module7 from './module7';
import module8 from './module8';
import module9 from './module9';
import module10 from './module10';
import module11 from './module11';

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
  status: 'approved',
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
    module10,
    module11
  ]
};

export default bookkeepingCourse;
