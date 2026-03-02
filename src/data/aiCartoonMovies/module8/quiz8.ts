
import { Quiz } from '../../../types/course';

export const quiz8: Quiz = {
  id: 8,
  title: 'Module 8 Quiz: Case Studies & Examples',
  questions: [
    {
      question: 'Why are case studies useful when learning AI-assisted animation workflows?',
      options: [
        'They replace the need to practice',
        'They show real examples of decisions, tools, and trade-offs',
        'They only focus on theory',
        'They guarantee the same results for everyone'
      ],
      correct: 1,
      explanation: 'Case studies show real workflows, highlighting what worked, what didn’t, and why certain tool choices were made.'
    },
    {
      question: 'In a workflow comparison, what is a common advantage of AI-assisted pre-production?',
      options: [
        'No need for story or planning',
        'Faster iteration on drafts and concepts',
        'Automatic perfection without review',
        'Eliminating the need for editing'
      ],
      correct: 1,
      explanation: 'AI can accelerate ideation and iteration by generating drafts quickly, which you then refine.'
    },
    {
      question: 'What is a best practice when adopting AI tools into a production pipeline?',
      options: [
        'Change everything at once',
        'Test small, measure impact, and keep quality control',
        'Ignore team feedback',
        'Use AI outputs without checking'
      ],
      correct: 1,
      explanation: 'Introduce tools gradually, keep review checkpoints, and measure whether the tool actually improves speed or quality.'
    }
  ]
};
