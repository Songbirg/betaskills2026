import type { Module } from '@/types/course';

import Lesson1 from './lesson1-trailers-teasers';
import Lesson2 from './lesson2-social-media';
import Lesson3 from './lesson3-analytics-marketing';

const module6: Module = {
  id: 6,
  title: 'Module 6: Distribution & Marketing',
  description: 'Learn AI-powered distribution and marketing strategies including trailer creation, social media promotion, and analytics-driven campaigns for successful cartoon movie launches.',
  lessons: [
    {
      id: 1,
      title: 'Creating AI-Generated Trailers and Teasers',
      duration: '35 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/r4TLoVXnkI4',
      content: Lesson1
    },
    {
      id: 2,
      title: 'Social Media Promotion with AI Content Creators',
      duration: '30 minutes',
      type: 'video',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Analytics-Driven Marketing Strategies',
      duration: '35 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/3z30ooy8AMA',
      content: Lesson3
    },
    {
      id: 4,
      title: 'Module 6 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What is a good use of AI in trailer creation?',
            options: ['Generate pacing variants and hooks', 'Skip editing completely', 'Ignore brand style', 'Avoid reviewing'],
            correct: 0,
            explanation: 'AI can help generate options quickly, but you still refine.'
          },
          {
            question: 'What should you measure to improve marketing?',
            options: ['Random guesses', 'Watch time and click-through rate', 'Only file names', 'Nothing'],
            correct: 1,
            explanation: 'Analytics like watch time and CTR help guide improvements.'
          },
          {
            question: 'Best approach to social media content is to:',
            options: ['Post once and stop', 'Test, measure, and iterate', 'Never change', 'Avoid captions'],
            correct: 1,
            explanation: 'Iteration based on results is key.'
          },
          {
            question: 'A trailer’s main goal is to:',
            options: ['Create curiosity and communicate tone quickly', 'Explain every plot detail', 'Replace the full movie', 'Avoid emotion'],
            correct: 0,
            explanation: 'Trailers are short: tone + hook + curiosity matter most.'
          },
          {
            question: 'When using AI for social posts, you should prioritize:',
            options: ['Consistency with brand style and message', 'Random style each post', 'No captions ever', 'Posting without review'],
            correct: 0,
            explanation: 'Consistency builds recognition and trust.'
          },
          {
            question: 'A good A/B test compares:',
            options: ['Two variations of one element (hook, thumbnail, caption)', 'Completely unrelated campaigns', 'Only file names', 'Nothing—testing is pointless'],
            correct: 0,
            explanation: 'A/B tests isolate changes to learn what improves results.'
          },
          {
            question: 'Which metric often indicates your video hook is working?',
            options: ['Higher early retention/watch time', 'More folders', 'Longer filenames', 'Lower resolution'],
            correct: 0,
            explanation: 'Retention/watch time shows whether the opening keeps attention.'
          },
          {
            question: 'A best practice when scaling marketing is to:',
            options: ['Double down on what data shows is working', 'Ignore analytics', 'Change everything daily', 'Stop posting'],
            correct: 0,
            explanation: 'Use performance data to scale winning formats and creatives.'
          },
          {
            question: 'AI tools can help distribution most by:',
            options: ['Generating multiple versions of creatives and captions quickly', 'Publishing without approval', 'Removing the need for strategy', 'Eliminating audience research'],
            correct: 0,
            explanation: 'They speed up variations; strategy and review still matter.'
          },
          {
            question: 'For analytics-driven marketing, you should track:',
            options: ['Traffic sources and conversion actions', 'Only titles', 'Only color choices', 'Nothing'],
            correct: 0,
            explanation: 'Knowing sources + conversions helps optimize spend and content.'
          }
        ]
      }
    }
  ]
};

export default module6;
