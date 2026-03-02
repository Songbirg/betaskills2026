import type { Module } from '@/types/course';

import Lesson1 from './lesson1-balancing-ai-human';
import Lesson2 from './lesson2-originality-plagiarism';

const module7: Module = {
  id: 7,
  title: 'Module 7: Ethical & Creative Considerations',
  description: 'Explore ethical and creative considerations when using AI, including balancing automation with human creativity and ensuring originality.',
  lessons: [
    {
      id: 1,
      title: 'Balancing AI Automation with Human Creativity',
      duration: '45 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: Lesson1
    },
    {
      id: 2,
      title: 'Ensuring Originality and Avoiding Plagiarism',
      duration: '40 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/2RGS8gbrQ_o',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Module 7 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What is the best way to balance AI automation with human creativity?',
            options: ['Let AI make all decisions', 'Use AI for drafts then refine with human judgement', 'Avoid AI completely', 'Only use AI for publishing'],
            correct: 1,
            explanation: 'AI works well for drafts and iteration; humans provide intent, taste, and final decisions.'
          },
          {
            question: 'Which practice helps ensure originality when using AI-generated assets?',
            options: ['Copy first output exactly', 'Use references and add unique creative direction', 'Never review outputs', 'Ignore licensing'],
            correct: 1,
            explanation: 'Originality improves when you guide outputs with your own intent and refine results.'
          },
          {
            question: 'To reduce plagiarism risk you should:',
            options: ['Publish raw output', 'Verify and refine in your own style', 'Never edit', 'Remove credits'],
            correct: 1,
            explanation: 'Review and refine outputs, verify originality, and ensure your final work reflects your own style and rights.'
          },
          {
            question: 'Why is human review important in AI-assisted creative work?',
            options: ['To maintain intent, quality, and ethics', 'To slow production down', 'Because AI cannot generate anything', 'To avoid learning new tools'],
            correct: 0,
            explanation: 'Human review ensures the work matches your intent and meets quality/ethical standards.'
          },
          {
            question: 'A practical way to reduce unintentional copying is to:',
            options: ['Combine multiple references and add original direction', 'Copy one reference exactly', 'Never change outputs', 'Avoid citing sources'],
            correct: 0,
            explanation: 'Blend influences and add your own decisions; don’t replicate a single source.'
          },
          {
            question: 'Which is a best practice for using AI in a professional pipeline?',
            options: ['Document prompts/settings and version outputs', 'Delete prompts after use', 'Never track changes', 'Avoid backups'],
            correct: 0,
            explanation: 'Documentation and versioning help repeat success and maintain consistency.'
          },
          {
            question: 'If AI output looks “generic,” you should:',
            options: ['Add more specific constraints and personal style direction', 'Use less detail', 'Stop refining', 'Publish anyway'],
            correct: 0,
            explanation: 'Specificity and your own style direction produces more original results.'
          },
          {
            question: 'Licensing considerations matter because:',
            options: ['They affect how you can legally use outputs commercially', 'They only affect file formats', 'They only matter for fonts', 'They are unrelated to AI'],
            correct: 0,
            explanation: 'You need rights to use content in published/commercial projects.'
          },
          {
            question: 'A healthy creative balance with AI is to:',
            options: ['Use AI for speed, and humans for story/taste/quality control', 'Use AI for everything and stop reviewing', 'Avoid human creativity', 'Avoid any iteration'],
            correct: 0,
            explanation: 'AI speeds up drafts; humans ensure meaning, coherence, and quality.'
          },
          {
            question: 'Which action best supports originality?',
            options: ['Develop a unique style guide and refine outputs to match it', 'Use default settings only', 'Never edit generated assets', 'Only copy trending looks'],
            correct: 0,
            explanation: 'Style guides and refinement help your work develop a unique identity.'
          }
        ]
      }
    }
  ]
};

export default module7;
