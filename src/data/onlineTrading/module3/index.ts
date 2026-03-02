import type { Module } from '@/types/course';
import Lesson1 from './lesson1-market-orders-limit-orders';
import Lesson2 from './lesson2-pending-orders';
import Lesson3 from './lesson3-stop-loss-take-profit';
import Lesson4 from './lesson4-slippage';
import Lesson5 from './lesson5-liquidity';
import Lesson6 from './lesson6-pips-lots-spreads';
import { quiz3 } from './quiz3';

const module3: Module = {
  id: 'module3',
  title: 'Market Mechanics & Order Types',
  description: 'Learn how trades are executed, including different order types, risk management tools, execution concepts, and fundamental trading measurements.',
  order: 3,
  lessons: [
    {
      id: 'lesson1',
      title: 'Market Orders vs Limit Orders',
      description: 'Understand the fundamental difference between market orders that execute immediately and limit orders that control price, including their strategic applications.',
      order: 1,
      content: Lesson1,
      duration: '25 minutes'
    },
    {
      id: 'lesson2',
      title: 'Pending Orders',
      description: 'Learn about buy stops, sell stops, buy limits, and sell limits for automated strategic execution at predetermined price levels.',
      order: 2,
      content: Lesson2,
      duration: '30 minutes'
    },
    {
      id: 'lesson3',
      title: 'Stop-Loss & Take-Profit',
      description: 'Master essential risk management tools that automatically close positions to limit losses or secure gains, including fixed and trailing strategies.',
      order: 3,
      content: Lesson3,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/s1ERtcbKgbY'
    },
    {
      id: 'lesson4',
      title: 'Slippage',
      description: 'Understand the difference between expected and actual execution prices, including causes, impacts, and strategies to minimize slippage.',
      order: 4,
      content: Lesson4,
      duration: '25 minutes'
    },
    {
      id: 'lesson5',
      title: 'Liquidity',
      description: 'Explore how liquidity affects execution quality, transaction costs, and trading efficiency across different instruments and timeframes.',
      order: 5,
      content: Lesson5,
      duration: '30 minutes'
    },
    {
      id: 'lesson6',
      title: 'Pips, Lots, and Spreads',
      description: 'Learn fundamental trading measurements including pip values, lot sizes, and spread costs for accurate position sizing and risk calculation.',
      order: 6,
      content: Lesson6,
      duration: '30 minutes'
    }
  ],
  quiz: quiz3
};

export default module3;
