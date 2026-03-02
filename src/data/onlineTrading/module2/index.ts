import type { Module } from '@/types/course';
import Lesson1 from './lesson1-stocks-vs-cfds';
import Lesson2 from './lesson2-forex-pairs';
import Lesson3 from './lesson3-commodities';
import Lesson4 from './lesson4-indices';
import Lesson5 from './lesson5-cryptocurrency-basics';
import Lesson6 from './lesson6-leverage-and-margin';
import { quiz2 } from './quiz2';

const module2: Module = {
  id: 'module2',
  title: 'Trading Instruments Explained',
  description: 'Understand what you are actually trading, including stocks, CFDs, forex pairs, commodities, indices, cryptocurrencies, and the concepts of leverage and margin.',
  order: 2,
  lessons: [
    {
      id: 'lesson1',
      title: 'Stocks vs CFDs',
      description: 'Learn the key differences between owning stocks directly and trading CFDs, including ownership rights, leverage, costs, market access, and risk profiles.',
      order: 1,
      content: Lesson1,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/PFZgCCnKt58'
    },
    {
      id: 'lesson2',
      title: 'Forex Pairs (Majors, Minors, Exotics)',
      description: 'Explore the classifications of forex pairs including majors with high liquidity, minors for diversification, and exotics with higher volatility.',
      order: 2,
      content: Lesson2,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/RMADDeFVkBA'
    },
    {
      id: 'lesson3',
      title: 'Commodities (Gold, Oil)',
      description: 'Understand gold as a safe-haven asset and oil as a volatile energy commodity, including their supply-demand dynamics and trading characteristics.',
      order: 3,
      content: Lesson3,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/CJEm99cp0Os'
    },
    {
      id: 'lesson4',
      title: 'Indices (S&P 500, NASDAQ, JSE Top 40)',
      description: 'Discover how indices track market performance through weighted averages, including major benchmarks and their trading applications.',
      order: 4,
      content: Lesson4,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/y-RGEos-lus'
    },
    {
      id: 'lesson5',
      title: 'Cryptocurrency Trading Basics',
      description: 'Learn the fundamentals of trading digital assets including exchanges, wallets, order types, volatility management, and risk controls.',
      order: 5,
      content: Lesson5,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/Zoz9gvhLgpM'
    },
    {
      id: 'lesson6',
      title: 'Leverage and Margin Explained',
      description: 'Understand how leverage amplifies trading positions and margin requirements, including margin calls, risk management, and broker variations.',
      order: 6,
      content: Lesson6,
      duration: '30 minutes'
    }
  ],
  quiz: quiz2
};

export default module2;
