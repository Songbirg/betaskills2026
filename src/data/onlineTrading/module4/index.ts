import type { Module } from '@/types/course';
import Lesson1 from './lesson1-economic-indicators';
import Lesson2 from './lesson2-central-bank-policies';
import Lesson3 from './lesson3-earnings-reports';
import Lesson4 from './lesson4-geopolitical-risk';
import Lesson5 from './lesson5-reading-economic-calendar';
import { quiz4 } from './quiz4';

const module4: Module = {
  id: 'module4',
  title: 'Fundamental Analysis',
  description: 'Understand how news and economics move markets through economic indicators, central bank policies, earnings reports, geopolitical events, and economic calendars.',
  order: 4,
  lessons: [
    {
      id: 'lesson1',
      title: 'Economic Indicators',
      description: 'Learn about critical economic statistics including GDP, inflation (CPI), interest rates, and unemployment that measure economic health and influence financial markets.',
      order: 1,
      content: Lesson1,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/F_WYiVESz1A'
    },
    {
      id: 'lesson2',
      title: 'Central Bank Policies',
      description: 'Understand the strategic actions and tools employed by central banks like the SARB, including inflation targeting, interest rate policy, and open market operations.',
      order: 2,
      content: Lesson2,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/vUvIzshYyv8'
    },
    {
      id: 'lesson3',
      title: 'Earnings Reports (Stocks)',
      description: 'Master the key components of corporate earnings reports including revenue, EPS, profit margins, balance sheet highlights, and forward guidance that drive stock prices.',
      order: 3,
      content: Lesson3,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/4VHBLuCtXhU'
    },
    {
      id: 'lesson4',
      title: 'Geopolitical Risk',
      description: 'Explore how political events, conflicts, trade disputes, and policy shifts create market uncertainty and influence investment decisions in emerging markets.',
      order: 4,
      content: Lesson4,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/Mh5badECwgQ'
    },
    {
      id: 'lesson5',
      title: 'Reading an Economic Calendar',
      description: 'Learn to interpret economic calendars effectively, understanding event importance, timing, forecasts, and actual releases to anticipate market volatility and prepare trading strategies.',
      order: 5,
      content: Lesson5,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/hj0x7AnrQNU'
    }
  ],
  quiz: quiz4
};

export default module4;
