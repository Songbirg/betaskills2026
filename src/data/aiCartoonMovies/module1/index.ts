import type { Module } from '@/types/course';

import Lesson1 from './lesson1-what-is-ai-assisted';
import Lesson2 from './lesson2-traditional-vs-ai';
import Lesson3 from './lesson3-benefits-of-ai';
import Lesson4 from './lesson4-ai-tools-overview';

const module1: Module = {
  id: 1,
  title: 'Module 1: Introduction to AI-Assisted Animation',
  description: 'Discover the fundamentals of AI-assisted cartoon movie making, compare traditional and AI-driven workflows, and explore the benefits and tools available for modern animation.',
  lessons: [
    {
      id: 1,
      title: 'What Is AI-Assisted Cartoon Movie Making?',
      duration: '25 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/1gy2qFLsinY',
      content: Lesson1
    },
    {
      id: 2,
      title: 'Traditional vs. AI-Driven Animation Workflows',
      duration: '30 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/IysJoiNIlYw',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Benefits of Using AI in Animation',
      duration: '20 minutes',
      type: 'video',
      content: Lesson3
    },
    {
      id: 4,
      title: 'Overview of Available AI Tools for Animation',
      duration: '35 minutes',
      type: 'video',
      content: Lesson4
    },
    {
      id: 5,
      title: 'Module 1 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What is a key advantage of using AI in animation production?',
            options: ['It eliminates planning', 'It speeds up drafts and iteration', 'It removes the need for editing', 'It guarantees perfect results'],
            correct: 1,
            explanation: 'AI helps generate drafts and iterate faster, but still requires review and creative control.'
          },
          {
            question: 'Which stage often benefits most from AI assistance?',
            options: ['Drafting concepts and assets', 'Ignoring quality control', 'Skipping story development', 'Avoiding collaboration'],
            correct: 0,
            explanation: 'AI is especially useful for creating initial drafts of scripts, concept art and prototypes.'
          },
          {
            question: 'Best practice when using AI outputs is to:',
            options: ['Publish immediately', 'Review and refine', 'Never combine with human work', 'Avoid testing'],
            correct: 1,
            explanation: 'Treat AI output as a draft and refine it with your own judgement.'
          },
          {
            question: 'In an AI-assisted workflow, what should remain under human control?',
            options: ['Creative direction and final decisions', 'All quality checks', 'File organization', 'Nothing—AI should decide everything'],
            correct: 0,
            explanation: 'Humans set intent, taste, story decisions, and quality standards.'
          },
          {
            question: 'What is a common risk when using AI-generated assets without review?',
            options: ['Inconsistent style and errors', 'Faster production', 'Better continuity automatically', 'Guaranteed originality'],
            correct: 0,
            explanation: 'AI outputs can vary between generations and may include mistakes or inconsistencies.'
          },
          {
            question: 'Which approach helps you get more consistent AI visuals across a project?',
            options: ['Use consistent prompts and references', 'Change tools every scene', 'Avoid saving settings', 'Never iterate'],
            correct: 0,
            explanation: 'Consistent prompts, references, and settings help maintain style continuity.'
          },
          {
            question: 'Why is AI most useful early in production?',
            options: ['It helps prototype quickly and explore options', 'It removes the need for a story', 'It eliminates revisions', 'It guarantees final-quality output'],
            correct: 0,
            explanation: 'AI is excellent for fast iteration and exploration during early drafting stages.'
          },
          {
            question: 'What should you do when AI output is close but not quite right?',
            options: ['Iterate with better prompts and refine manually', 'Delete the whole project', 'Publish it as-is', 'Stop using AI entirely'],
            correct: 0,
            explanation: 'Iteration plus targeted manual refinement is the standard workflow.'
          },
          {
            question: 'Which statement best describes AI in animation?',
            options: ['A tool that accelerates work when guided well', 'A replacement for all artists', 'A guarantee of perfect quality', 'A reason to skip planning'],
            correct: 0,
            explanation: 'AI accelerates tasks, but quality depends on guidance, review, and creative decisions.'
          },
          {
            question: 'What is an important non-technical consideration when using AI tools?',
            options: ['Licensing and usage rights', 'Only render resolution', 'Only font choices', 'Only keyboard shortcuts'],
            correct: 0,
            explanation: 'You should understand rights/licensing and how the tool’s output can be used commercially.'
          }
        ]
      }
    }
  ]
};

export default module1;
