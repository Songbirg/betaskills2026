import type { Module } from '@/types/course';
import Lesson1 from './lesson1-risk-to-reward-ratio';
import Lesson2 from './lesson2-position-sizing';
import Lesson3 from './lesson3-capital-preservation';
import Lesson4 from './lesson4-drawdown-management';
import Lesson5 from './lesson5-trading-psychology-basics';
import Lesson6 from './lesson6-avoiding-overtrading';
import Lesson7 from './lesson7-emotional-discipline';
import { quiz6 } from './quiz6';

const module6: Module = {
  id: 'module6',
  title: 'Risk Management (Core Module)',
  description: 'Protect capital and survive long-term through proper risk-to-reward ratios, position sizing, capital preservation, drawdown management, and mastering trading psychology.',
  order: 6,
  lessons: [
    {
      id: 'lesson1',
      title: 'Risk-to-Reward Ratio',
      description: 'Learn to measure potential profit against potential loss, establishing favorable ratios that ensure long-term profitability even with moderate win rates.',
      order: 1,
      content: Lesson1,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/aKZsireNBIM'
    },
    {
      id: 'lesson2',
      title: 'Position Sizing',
      description: 'Master the process of determining capital allocation per trade based on account size, risk tolerance, and stop-loss distance to prevent catastrophic losses.',
      order: 2,
      content: Lesson2,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/9UucETfb_lk'
    },
    {
      id: 'lesson3',
      title: 'Capital Preservation',
      description: 'Focus on protecting your original capital base through strict risk management, diversification, conservative sizing, and psychological discipline.',
      order: 3,
      content: Lesson3,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/xlnkyr1uggE'
    },
    {
      id: 'lesson4',
      title: 'Drawdown Management',
      description: 'Develop strategies to monitor, limit, and recover from equity declines, including setting drawdown limits and adjusting position sizes dynamically.',
      order: 4,
      content: Lesson4,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/9yqJjM5oUfM'
    },
    {
      id: 'lesson5',
      title: 'Trading Psychology Basics',
      description: 'Understand mental and emotional factors in trading including fear, greed, discipline, patience, and cognitive biases that affect decision-making.',
      order: 5,
      content: Lesson5,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/YfhHuqUMz3U'
    },
    {
      id: 'lesson6',
      title: 'Avoiding Overtrading',
      description: 'Prevent excessive transaction frequency through trade limits, mandatory justification, cooldown periods, and focusing on high-probability setups only.',
      order: 6,
      content: Lesson6,
      duration: '25 minutes',
      videoUrl: 'https://www.youtube.com/embed/8qusuhCtXjE'
    },
    {
      id: 'lesson7',
      title: 'Emotional Discipline',
      description: 'Maintain rational decision-making amid volatility by recognizing triggers, following predefined rules, practicing detachment, and using mindfulness techniques.',
      order: 7,
      content: Lesson7,
      duration: '25 minutes',
      videoUrl: 'https://www.youtube.com/embed/xit--BDzu2Q'
    }
  ],
  quiz: quiz6
};

export default module6;
