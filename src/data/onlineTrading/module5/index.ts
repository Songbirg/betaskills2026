import type { Module } from '@/types/course';
import Lesson1 from './lesson1-candlestick-charts';
import Lesson2 from './lesson2-trends';
import Lesson3 from './lesson3-support-resistance';
import Lesson4 from './lesson4-chart-patterns';
import Lesson5 from './lesson5-indicators';
import { quiz5 } from './quiz5';

const module5: Module = {
  id: 'module5',
  title: 'Technical Analysis',
  description: 'Use charts to analyse price movement through candlestick patterns, trend identification, support and resistance levels, chart patterns, and technical indicators.',
  order: 5,
  lessons: [
    {
      id: 'lesson1',
      title: 'Candlestick Charts',
      description: 'Master the visual language of candlestick charts including body and shadow interpretation, bullish and bearish candles, doji patterns, hammers, engulfing patterns, and reversal signals.',
      order: 1,
      content: Lesson1,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/AOz1YPOKvEs'
    },
    {
      id: 'lesson2',
      title: 'Trends (Uptrend, Downtrend, Sideways)',
      description: 'Learn to identify and trade the three primary trend types: uptrends with higher highs and lows, downtrends with lower highs and lows, and sideways consolidation phases.',
      order: 2,
      content: Lesson2,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/1gOiHcbFygI'
    },
    {
      id: 'lesson3',
      title: 'Support & Resistance',
      description: 'Understand key price levels where buying and selling interest concentrates, including horizontal levels, trendlines, psychological levels, role reversals, and breakout validation.',
      order: 3,
      content: Lesson3,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/WtunB3RhqBk'
    },
    {
      id: 'lesson4',
      title: 'Chart Patterns',
      description: 'Recognize and trade major chart formations including Head and Shoulders reversals, Double Top/Bottom patterns, and Triangle consolidations with proper confirmation and targets.',
      order: 4,
      content: Lesson4,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/aRlWle9smww'
    },
    {
      id: 'lesson5',
      title: 'Indicators',
      description: 'Apply essential technical indicators including Moving Averages for trend direction, RSI for momentum, MACD for convergence/divergence, and Bollinger Bands for volatility analysis.',
      order: 5,
      content: Lesson5,
      duration: '35 minutes',
      videoUrl: 'https://www.youtube.com/embed/xv_Zwf1-8L8'
    }
  ],
  quiz: quiz5
};

export default module5;
