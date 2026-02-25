import type { Course, Module } from '@/types/course';
import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';
import { module4 } from './module4';
import { lesson1OverviewOfSmartAssistants } from './module5/lesson1-overview-of-smart-assistants';

const now = new Date().toISOString();

const module5: Module = {
  id: 5,
  title: 'Smart Assistants & Voice Control',
  description: 'Learn how smart assistants like Google Assistant, Alexa, and Siri work, and how to use them to control and automate smart home devices.',
  lessons: [lesson1OverviewOfSmartAssistants]
};

const smartHomeAutomation: Course = {
  id: 'smart-home-automation',
  title: 'Smart Home Automation: Design, Installation & Maintenance',
  description: 'This course provides a step-by-step introduction to the world of smart home automation. It equips learners with the knowledge and skills to plan, install, configure, troubleshoot, and maintain smart home systems including lighting, security, climate control, voice assistants, and connected appliances.',
  thumbnail: '/images/courses/smart-home-automation.jpg',
  instructor: {
    id: 'betaskilltutor',
    first_name: 'Beta Skill',
    last_name: 'Tutor',
    email: 'betaskilltraining@gmail.com'
  },
  duration: '10 weeks',
  level: 'Intermediate',
  category: 'Technology',
  is_free: false,
  price: 750,
  currency: 'ZAR',
  students: 1850,
  rating: 4.7,
  status: 'approved',
  created_at: now,
  updated_at: now,
  available: true,
  modules: [module1, module2, module3, module4, module5]
};

export default smartHomeAutomation;
