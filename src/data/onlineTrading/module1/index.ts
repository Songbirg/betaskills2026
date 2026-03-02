import type { Module } from '@/types/course';
import Lesson1 from './lesson1-what-are-financial-markets';
import Lesson2 from './lesson2-types-of-financial-markets';
import Lesson3 from './lesson3-market-participants';
import Lesson4 from './lesson4-how-online-trading-works';
import Lesson5 from './lesson5-brokers-and-platforms';
import Lesson6 from './lesson6-market-hours-global-sessions';
import { quiz1 } from './quiz1';

const module1: Module = {
  id: 'module1',
  title: 'Introduction to Financial Markets',
  description: 'Understand how global financial markets operate, including market types, participants, online trading mechanisms, brokers, and global trading sessions.',
  order: 1,
  lessons: [
    {
      id: 'lesson1',
      title: 'What are financial markets?',
      description: 'Learn about financial markets as organized systems for trading financial instruments, their three primary functions, and the main types of markets.',
      order: 1,
      content: Lesson1,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/IL0Wp-TEyWQ'
    },
    {
      id: 'lesson2',
      title: 'Types of Financial Markets',
      description: 'Explore the different types of financial markets including stock, bond, money, forex, commodity, derivatives, and capital markets.',
      order: 2,
      content: Lesson2,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/T37YvxMTofc'
    },
    {
      id: 'lesson3',
      title: 'Market participants',
      description: 'Understand the roles of retail traders, institutions, hedge funds, and central banks in financial markets.',
      order: 3,
      content: Lesson3,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/4EKHi4wmoz4'
    },
    {
      id: 'lesson4',
      title: 'How Online Trading Works',
      description: 'Learn the key steps and mechanisms of online trading from account setup to withdrawal and tax considerations.',
      order: 4,
      content: Lesson4,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/PFyZv4OFfvs'
    },
    {
      id: 'lesson5',
      title: 'Role of Brokers and Trading Platforms',
      description: 'Discover how brokers and trading platforms facilitate market access through order execution, account management, research tools, and regulatory compliance.',
      order: 5,
      content: Lesson5,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/wnB9_jmDCpo'
    },
    {
      id: 'lesson6',
      title: 'Market Hours and Global Sessions',
      description: 'Understand the 24-hour trading day divided into London, New York, and Asia sessions, including session overlaps and their impact on liquidity.',
      order: 6,
      content: Lesson6,
      duration: '25 minutes',
      videoUrl: 'https://www.youtube.com/embed/9KMMkSwfA-c'
    }
  ],
  quiz: quiz1
};

export default module1;
