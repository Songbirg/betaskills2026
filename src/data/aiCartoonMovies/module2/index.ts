import type { Module } from '@/types/course';

import Lesson1 from './lesson1-story-ideas-themes';
import Lesson2 from './lesson2-mood-boards';
import Lesson3 from './lesson3-script-drafts';
import Lesson4 from './lesson4-iterative-editing';

const module2: Module = {
  id: 2,
  title: 'Module 2: Pre-Production with AI',
  description: 'Learn how to leverage AI tools for story development, mood board creation, scriptwriting, and iterative refinement in animation pre-production.',
  lessons: [
    {
      id: 1,
      title: 'Generating Story Ideas and Themes with AI',
      duration: '25 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/aiplWtjWiHc',
      content: Lesson1
    },
    {
      id: 2,
      title: 'AI-Powered Mood Boards for Animation',
      duration: '30 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/V_NTqKZm7lc',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Using AI for Script Drafts and Dialogue Generation',
      duration: '35 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/R5pB2DXLlmc',
      content: Lesson3
    },
    {
      id: 4,
      title: 'Iterative Editing and Refinement with AI Feedback',
      duration: '30 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/R5pB2DXLlmc',
      content: Lesson4
    },
    {
      id: 5,
      title: 'Module 2 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What is a primary benefit of using AI for pre-production?',
            options: ['It eliminates planning', 'It speeds up ideation and drafts', 'It prevents revisions', 'It removes the need for a story'],
            correct: 1,
            explanation: 'AI helps generate drafts quickly so you can iterate faster during pre-production.'
          },
          {
            question: 'What should you include in prompts for mood boards to get better results?',
            options: ['Random words', 'Specific style and lighting details', 'Only one adjective', 'No context at all'],
            correct: 1,
            explanation: 'Specific details guide the AI toward consistent visuals.'
          },
          {
            question: 'Best practice for AI-generated scripts is to:',
            options: ['Publish immediately', 'Review and rewrite for voice and logic', 'Never edit', 'Avoid human input'],
            correct: 1,
            explanation: 'AI drafts need human refinement for voice, tone and story coherence.'
          },
          {
            question: 'When using AI to generate story ideas, what is the best starting point?',
            options: ['A clear theme or premise', 'No direction at all', 'Only character names', 'Only the ending'],
            correct: 0,
            explanation: 'A clear theme/premise helps the AI generate ideas that fit your intended story.'
          },
          {
            question: 'What is a good way to evaluate multiple AI story outputs?',
            options: ['Compare against your goals and audience', 'Pick the longest one', 'Pick the first one always', 'Avoid comparing at all'],
            correct: 0,
            explanation: 'Use your story goals and audience needs to select and refine the best option.'
          },
          {
            question: 'Why are mood boards valuable in animation pre-production?',
            options: ['They define visual tone and style references', 'They replace the script', 'They remove the need for characters', 'They guarantee final animation quality'],
            correct: 0,
            explanation: 'Mood boards align the team on tone, color, lighting, and visual inspiration.'
          },
          {
            question: 'What should you do to maintain consistency across AI-generated mood board images?',
            options: ['Reuse prompt structure and reference images', 'Use totally new styles each time', 'Avoid describing lighting', 'Never save prompts'],
            correct: 0,
            explanation: 'Consistency improves when prompts, references, and constraints stay stable.'
          },
          {
            question: 'Which is a best practice for AI-assisted dialogue writing?',
            options: ['Match dialogue to character voice and revise for natural flow', 'Use the AI text unchanged', 'Remove subtext and emotion', 'Avoid reading it aloud'],
            correct: 0,
            explanation: 'Dialogue should reflect character voice and be revised for realism and pacing.'
          },
          {
            question: 'Iteration in pre-production is mainly about:',
            options: ['Refining ideas through feedback and revisions', 'Never changing drafts', 'Skipping review to save time', 'Final rendering settings'],
            correct: 0,
            explanation: 'Iteration improves the story and visuals through repeated refinement.'
          },
          {
            question: 'A safe workflow for AI-generated scripts includes:',
            options: ['Versioning drafts and tracking changes', 'Deleting all earlier drafts', 'Avoiding feedback', 'Only writing the final scene'],
            correct: 0,
            explanation: 'Keeping versions helps you compare options and avoid losing strong earlier ideas.'
          }
        ]
      }
    }
  ]
};

export default module2;
