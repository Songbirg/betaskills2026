import type { Module } from '@/types/course';

import Lesson1 from './lesson1-ai-short-film-breakdown';
import Lesson2 from './lesson2-workflow-comparison';
import Lesson3 from './lesson3-best-practices';

const module8: Module = {
  id: 8,
  title: 'Module 8: Case Studies & Examples',
  description: 'Explore real-world applications of AI in cartoon movie making through case studies, workflow comparisons, and best practices for creating AI-driven content.',
  lessons: [
    {
      id: 1,
      title: 'Breakdown of an AI-Assisted Short Film',
      duration: '50 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/rX64Q8Qx6dg',
      content: Lesson1
    },
    {
      id: 2,
      title: 'Comparison: Traditional vs. AI Workflow Timelines',
      duration: '45 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/rX64Q8Qx6dg',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Lessons Learned and Best Practices',
      duration: '40 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/WXuK6gekU1Y',
      content: Lesson3
    },
    {
      id: 4,
      title: 'Module 8 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'Why are case studies useful when learning AI-assisted animation workflows?',
            options: ['They replace the need to practice', 'They show real examples of decisions, tools, and trade-offs', 'They only focus on theory', 'They guarantee the same results for everyone'],
            correct: 1,
            explanation: 'Case studies show real workflows, highlighting what worked, what didn’t, and why tool choices were made.'
          },
          {
            question: 'In a workflow comparison, what is a common advantage of AI-assisted pre-production?',
            options: ['No need for story or planning', 'Faster iteration on drafts and concepts', 'Automatic perfection without review', 'Eliminating the need for editing'],
            correct: 1,
            explanation: 'AI accelerates ideation and iteration by generating drafts quickly, which you then refine.'
          },
          {
            question: 'What is a best practice when adopting AI tools into a pipeline?',
            options: ['Change everything at once', 'Test small, measure impact, and keep quality control', 'Ignore team feedback', 'Use AI outputs without checking'],
            correct: 1,
            explanation: 'Introduce tools gradually, keep review checkpoints, and measure whether the tool improves speed or quality.'
          },
          {
            question: 'A key benefit of studying real examples is:',
            options: ['Understanding practical trade-offs and constraints', 'Avoiding any practice', 'Guaranteeing identical results', 'Skipping planning'],
            correct: 0,
            explanation: 'Real examples show what choices were made and why, under real constraints.'
          },
          {
            question: 'When comparing workflows, the most fair comparison looks at:',
            options: ['Time, cost, quality, and consistency', 'Only tools used', 'Only render resolution', 'Only how long the prompt was'],
            correct: 0,
            explanation: 'Workflows should be compared on multiple factors, not just speed or tool choice.'
          },
          {
            question: 'AI-assisted workflows still require quality control because:',
            options: ['Outputs can vary and introduce artifacts', 'AI never makes mistakes', 'It is slower than traditional', 'It removes creativity'],
            correct: 0,
            explanation: 'AI outputs can include artifacts or inconsistencies that need review.'
          },
          {
            question: 'A common best practice for consistency across scenes is to:',
            options: ['Use references/style guides and reuse prompts/settings', 'Change style every scene', 'Avoid documentation', 'Never iterate'],
            correct: 0,
            explanation: 'Consistency improves with references, guides, and repeatable settings.'
          },
          {
            question: 'In case studies, “lessons learned” usually help you:',
            options: ['Avoid common mistakes and plan better', 'Skip testing', 'Guarantee virality', 'Remove the need for editing'],
            correct: 0,
            explanation: 'They highlight pitfalls and strategies that improve future projects.'
          },
          {
            question: 'When adopting a new AI tool, a safe approach is to:',
            options: ['Pilot it on a small section before full rollout', 'Switch the whole pipeline overnight', 'Ignore feedback', 'Stop measuring results'],
            correct: 0,
            explanation: 'Pilots reduce risk and make it easier to measure impact.'
          },
          {
            question: 'A good takeaway from workflow comparisons is that:',
            options: ['AI is fastest for drafts; traditional methods often win for final control', 'AI always replaces traditional methods', 'Traditional is always slower and worse', 'Tools matter more than story'],
            correct: 0,
            explanation: 'AI helps drafts/iteration; final polish often needs traditional/manual control.'
          }
        ]
      }
    }
  ]
};

export default module8;
