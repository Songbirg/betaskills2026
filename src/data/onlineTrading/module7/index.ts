import type { Module } from '@/types/course';
import Lesson1 from './lesson1-scalping';
import Lesson2 from './lesson2-day-trading';
import Lesson3 from './lesson3-swing-trading';
import Lesson4 from './lesson4-position-trading';
import Lesson5 from './lesson5-trend-following';
import Lesson6 from './lesson6-breakout-strategy';
import Lesson7 from './lesson7-reversal-strategy';
import { quiz7 } from './quiz7';

const module7: Module = {
  id: 'module7',
  title: 'Trading Strategies',
  description: 'Develop structured trading systems through scalping, day trading, swing trading, position trading, trend-following, breakout, and reversal strategies.',
  order: 7,
  lessons: [
    {
      id: 'lesson1',
      title: 'Scalping',
      description: 'Learn high-frequency short-term trading that profits from tiny price movements through numerous quick trades held for seconds to minutes.',
      order: 1,
      content: Lesson1,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/wqOSKxlCcAY'
    },
    {
      id: 'lesson2',
      title: 'Day Trading',
      description: 'Master intraday trading by buying and selling financial instruments within the same trading day to avoid overnight risks.',
      order: 2,
      content: Lesson2,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/edfHZq5lrTA'
    },
    {
      id: 'lesson3',
      title: 'Swing Trading',
      description: 'Capture short- to medium-term price movements by holding positions for several days to weeks using technical analysis.',
      order: 3,
      content: Lesson3,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/LJF3frcDgRM'
    },
    {
      id: 'lesson4',
      title: 'Position Trading',
      description: 'Understand long-term trading that captures major trends by holding positions for weeks, months, or years based on fundamental analysis.',
      order: 4,
      content: Lesson4,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/ks1y-wy8XJ4'
    },
    {
      id: 'lesson5',
      title: 'Trend-Following Strategy',
      description: 'Learn to capture sustained directional price movements by entering positions aligned with the prevailing trend.',
      order: 5,
      content: Lesson5,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/uQP2z4OXMRo'
    },
    {
      id: 'lesson6',
      title: 'Breakout Strategy',
      description: 'Identify and trade significant price movements when assets breach established support or resistance levels.',
      order: 6,
      content: Lesson6,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/DKohGRr18ZA'
    },
    {
      id: 'lesson7',
      title: 'Reversal Strategy',
      description: 'Master contrarian trading by identifying and trading potential turning points where momentum shifts from up to down or vice versa.',
      order: 7,
      content: Lesson7,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/4cT8WTyxhYY'
    }
  ],
  quiz: quiz7
};

export default module7;
