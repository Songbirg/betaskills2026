import type { Module } from '@/types/course';

import Lesson1 from './lesson1-ai-voice-acting';
import Lesson2 from './lesson2-animation-tools';
import Lesson3 from './lesson3-motion-animation';
import Lesson4 from './lesson4-music-sound';

const module4: Module = {
  id: 4,
  title: 'Module 4: Animation Production',
  description: 'Master AI-powered animation production techniques including voice acting, motion capture, frame interpolation, and music composition for professional cartoon movie making.',
  lessons: [
    {
      id: 1,
      title: 'AI Voice Acting & Dialogue Generation',
      duration: '35 minutes',
      type: 'video',
      content: Lesson1
    },
    {
      id: 2,
      title: 'AI Animation Tools and Techniques',
      duration: '30 minutes',
      type: 'video',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Motion & Animation with AI',
      duration: '40 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/RWaWoQWI4ks',
      content: Lesson3
    },
    {
      id: 4,
      title: 'Music & Sound Effects with AI',
      duration: '35 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/TUPmS-_kBt4',
      content: Lesson4
    },
    {
      id: 5,
      title: 'Module 4 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What is a best practice when using AI voice tools?',
            options: ['Ignore licensing', 'Keep character voices consistent and review outputs', 'Never review', 'Publish raw prototypes'],
            correct: 1,
            explanation: 'Consistency and review are key; licensing also matters.'
          },
          {
            question: 'Which area often needs extra quality control in AI motion?',
            options: ['Hands and contact points', 'File names', 'Nothing', 'Only the title'],
            correct: 0,
            explanation: 'Hands/contact points commonly need refinement.'
          },
          {
            question: 'AI audio generation should be checked for:',
            options: ['Loudness and consistency', 'Only duration', 'Nothing', 'Fonts'],
            correct: 0,
            explanation: 'Keep loudness and space consistent across scenes.'
          },
          {
            question: 'When using AI voice acting, you should prioritize:',
            options: ['Clear pronunciation and consistent tone', 'Random voice changes per line', 'No script', 'Avoid listening to outputs'],
            correct: 0,
            explanation: 'Voice needs to match the character and remain consistent across scenes.'
          },
          {
            question: 'A good workflow for AI-generated dialogue is to:',
            options: ['Generate, review, then edit timing and emotion', 'Generate and publish immediately', 'Avoid human review', 'Never iterate'],
            correct: 0,
            explanation: 'Review and adjust timing/emotion to fit the scene and character intent.'
          },
          {
            question: 'AI motion tools can help most with:',
            options: ['Rapid motion drafts and tests', 'Replacing all animation direction', 'Eliminating cleanup', 'Guaranteeing perfect hands'],
            correct: 0,
            explanation: 'They accelerate motion exploration but still need cleanup and direction.'
          },
          {
            question: 'Frame interpolation is mainly used to:',
            options: ['Create smoother motion by adding in-between frames', 'Reduce audio noise', 'Write dialogue', 'Color grade scenes'],
            correct: 0,
            explanation: 'Interpolation generates intermediate frames to smooth animation and increase frame rate.'
          },
          {
            question: 'A key risk in AI-generated music is:',
            options: ['Inconsistent mood or levels across scenes', 'Too many folders', 'Higher font size', 'Guaranteed perfect mastering'],
            correct: 0,
            explanation: 'You must check mood, mixing levels, and continuity from scene to scene.'
          },
          {
            question: 'What is a best practice for Foley/sound effects generation?',
            options: ['Sync effects to visuals and check timing', 'Ignore timing', 'Use random sounds', 'Never preview with video'],
            correct: 0,
            explanation: 'Timing and sync are critical so sounds match on-screen action.'
          },
          {
            question: 'Before exporting audio for the final edit, you should:',
            options: ['Normalize/level-check and test on different devices', 'Only change the title', 'Skip any listening', 'Avoid any mastering'],
            correct: 0,
            explanation: 'Level checks and device testing help ensure consistent playback quality.'
          }
        ]
      }
    }
  ]
};

export default module4;
