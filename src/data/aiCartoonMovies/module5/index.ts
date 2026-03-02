import type { Module } from '@/types/course';

import Lesson1 from './lesson1-editing-software';
import Lesson2 from './lesson2-color-transitions';
import Lesson3 from './lesson3-special-effects';
import Lesson4 from './lesson4-rendering-optimization';

const module5: Module = {
  id: 5,
  title: 'Module 5: Post-Production',
  description: 'Master AI-powered post-production techniques including editing software, color correction, special effects, and rendering optimization for professional cartoon movie finishing.',
  lessons: [
    {
      id: 1,
      title: 'AI-Assisted Editing Software for Cartoon Movies',
      duration: '35 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/c38vtLw1nSk',
      content: Lesson1
    },
    {
      id: 2,
      title: 'Color Correction and Scene Transitions with AI',
      duration: '30 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/mVtszQH-gW4',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Special Effects and Final Touches Using AI',
      duration: '30 minutes',
      type: 'video',
      content: Lesson3
    },
    {
      id: 4,
      title: 'Rendering Optimization and Export Settings',
      duration: '25 minutes',
      type: 'video',
      content: Lesson4
    },
    {
      id: 5,
      title: 'Module 5 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What is a common use of AI in editing?',
            options: ['Removing backgrounds', 'Avoiding review', 'Skipping sound', 'Deleting exports'],
            correct: 0,
            explanation: 'AI can automate tasks like background removal and rough edits.'
          },
          {
            question: 'Why is color correction important?',
            options: ['To make scenes inconsistent', 'To keep a consistent look across scenes', 'To remove the need for lighting', 'To avoid transitions'],
            correct: 1,
            explanation: 'Consistent color keeps the film coherent.'
          },
          {
            question: 'AI upscaling should be checked for:',
            options: ['Artifacts and glitches', 'Font size', 'Nothing', 'Only duration'],
            correct: 0,
            explanation: 'Upscaling can introduce artifacts that need QC.'
          },
          {
            question: 'A good use of AI in post-production is:',
            options: ['Automating repetitive edits and cleanup', 'Skipping review completely', 'Deleting timelines automatically', 'Ignoring continuity'],
            correct: 0,
            explanation: 'AI helps automate repetitive tasks, but you still review and refine.'
          },
          {
            question: 'Why are scene transitions important in editing?',
            options: ['They help pacing and clarity between scenes', 'They replace the story', 'They remove the need for sound', 'They guarantee higher FPS'],
            correct: 0,
            explanation: 'Transitions affect pacing, clarity, and how the audience experiences the story flow.'
          },
          {
            question: 'When using AI to generate or enhance VFX, you should always:',
            options: ['Check for artifacts and continuity', 'Assume it is perfect', 'Never preview the result', 'Export immediately without review'],
            correct: 0,
            explanation: 'AI VFX can introduce artifacts; continuity checks prevent distracting mistakes.'
          },
          {
            question: 'Color consistency across scenes is best maintained by:',
            options: ['Using reference frames/LUTs and matching exposure', 'Changing grade style every shot', 'Avoiding any color correction', 'Only adjusting saturation randomly'],
            correct: 0,
            explanation: 'References/LUTs and exposure matching keep a cohesive look.'
          },
          {
            question: 'Rendering optimization typically aims to:',
            options: ['Reduce render time while keeping quality', 'Remove all lighting', 'Lower resolution without checking', 'Avoid exports'],
            correct: 0,
            explanation: 'Optimization balances speed and quality.'
          },
          {
            question: 'A best practice before final export is to:',
            options: ['Do a quality-control pass and test playback', 'Skip audio checks', 'Export only once without review', 'Change settings randomly'],
            correct: 0,
            explanation: 'QC catches issues early and prevents re-exports.'
          },
          {
            question: 'If AI tools introduce inconsistent frames, the best next step is to:',
            options: ['Regenerate with tighter constraints and fix key frames manually', 'Ignore it', 'Remove the scene', 'Never use AI again'],
            correct: 0,
            explanation: 'Tighten prompts/settings and manually correct the most visible frames.'
          }
        ]
      }
    }
  ]
};

export default module5;
