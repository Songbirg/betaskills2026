import type { Module } from '@/types/course';
import Lesson1 from './lesson1-fear-vs-greed';
import Lesson2 from './lesson2-discipline-patience';
import Lesson3 from './lesson3-loss-acceptance';
import Lesson4 from './lesson4-revenge-trading';
import Lesson5 from './lesson5-building-routines';
import Lesson6 from './lesson6-journaling-trades';
import { quiz8 } from './quiz8';

const module8: Module = {
  id: 'module8',
  title: 'Trading Psychology',
  description: 'Master the mental side of trading through understanding fear vs greed, discipline & patience, loss acceptance, avoiding revenge trading, building routines, and journaling trades.',
  order: 8,
  lessons: [
    {
      id: 'lesson1',
      title: 'Fear vs Greed',
      description: 'Understand the two dominant emotional forces in trading and learn to recognize triggers and control impulses for sustainable performance.',
      order: 1,
      content: Lesson1,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/eP5Vx-wTo70'
    },
    {
      id: 'lesson2',
      title: 'Discipline & Patience',
      description: 'Master the foundational psychological pillars that enforce consistent adherence to strategies and cultivate tolerance for waiting optimal setups.',
      order: 2,
      content: Lesson2,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/sdkLHLgPhM8'
    },
    {
      id: 'lesson3',
      title: 'Loss Acceptance',
      description: 'Embrace inevitable setbacks as normal costs of participation and develop emotional resilience for rational decision-making.',
      order: 3,
      content: Lesson3,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/YphQWn4SLcs'
    },
    {
      id: 'lesson4',
      title: 'Revenge Trading',
      description: 'Recognize and prevent the destructive emotional response where losses trigger impulsive trades aimed at quick recovery.',
      order: 4,
      content: Lesson4,
      duration: '25 minutes',
      videoUrl: 'https://www.youtube.com/embed/aXQ9Of5rmqs'
    },
    {
      id: 'lesson5',
      title: 'Building Trading Routines',
      description: 'Establish structured daily and weekly habits that reinforce discipline, enhance decision-making, and promote consistent performance.',
      order: 5,
      content: Lesson5,
      duration: '30 minutes',
      videoUrl: 'https://www.youtube.com/embed/8slT1k7fzks'
    },
    {
      id: 'lesson6',
      title: 'Journaling Trades',
      description: 'Develop a systematic practice of recording transactions with rationale, outcomes, emotions, and lessons for continuous improvement.',
      order: 6,
      content: Lesson6,
      duration: '25 minutes',
      videoUrl: 'https://www.youtube.com/embed/np_VVAE09YA'
    }
  ],
  quiz: quiz8
};

export default module8;
