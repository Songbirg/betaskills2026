import type { Module } from '@/types/course';

import Lesson1 from './lesson1-character-concepts';
import Lesson2 from './lesson2-blending-ai-human';
import Lesson3 from './lesson3-world-environments';
import Lesson4 from './lesson4-consistency-style';

const module3: Module = {
  id: 3,
  title: 'Module 3: Character & World Design',
  description: 'Master AI-powered character creation, world building, and techniques for maintaining visual consistency across your animated projects.',
  lessons: [
    {
      id: 1,
      title: 'AI-Generated Character Concepts for Animation',
      duration: '30 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/8N_kiJMP4Z8',
      content: Lesson1
    },
    {
      id: 2,
      title: 'Blending AI with Human Touch-Up (Photoshop/Illustrator)',
      duration: '35 minutes',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/n-oa73pAIXs',
      content: Lesson2
    },
    {
      id: 3,
      title: 'Creating Worlds and Environments with AI',
      duration: '30 minutes',
      type: 'video',
      content: Lesson3
    },
    {
      id: 4,
      title: 'Maintaining Consistency and Style Across Designs',
      duration: '35 minutes',
      type: 'video',
      content: Lesson4
    },
    {
      id: 5,
      title: 'Module 3 Quiz',
      duration: '10 minutes',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What is a good practice for keeping characters consistent across scenes?',
            options: ['Change style each scene', 'Use a reference sheet/style guide', 'Avoid prompts', 'Never review outputs'],
            correct: 1,
            explanation: 'A reference sheet/style guide helps maintain consistent design choices.'
          },
          {
            question: 'Why should you keep prompts and seeds when generating environments?',
            options: ['To reproduce the same style later', 'To reduce creativity', 'To avoid iteration', 'To remove review'],
            correct: 0,
            explanation: 'Keeping prompt/seed lets you regenerate assets consistently.'
          },
          {
            question: 'AI outputs should be treated as:',
            options: ['Final without edits', 'Drafts to refine', 'Always perfect', 'Not usable at all'],
            correct: 1,
            explanation: 'AI outputs are best used as drafts you refine for quality and style.'
          },
          {
            question: 'What is a helpful step before generating character designs with AI?',
            options: ['Define a style target and character traits', 'Skip all planning', 'Only choose a font', 'Avoid references'],
            correct: 0,
            explanation: 'Clear traits and a style target lead to stronger, more consistent character generations.'
          },
          {
            question: 'Which technique helps keep a character’s look stable across multiple generations?',
            options: ['Use reference images and consistent descriptors', 'Change model settings every time', 'Avoid any constraints', 'Only generate once'],
            correct: 0,
            explanation: 'References and consistent descriptors help the model preserve key features.'
          },
          {
            question: 'World-building references should include:',
            options: ['Color palette, lighting, and architecture cues', 'Only random keywords', 'Only the final render settings', 'Nothing—references reduce quality'],
            correct: 0,
            explanation: 'References define the look and feel of environments and help consistency.'
          },
          {
            question: 'What is the main reason to create a style guide for an animated project?',
            options: ['To keep designs cohesive across scenes and artists', 'To slow production down', 'To avoid iteration', 'To remove character variety'],
            correct: 0,
            explanation: 'A style guide keeps the project cohesive and reduces rework.'
          },
          {
            question: 'When blending AI output with Photoshop/Illustrator, a common goal is to:',
            options: ['Fix details and unify the final style', 'Increase randomness', 'Remove all textures', 'Avoid any editing'],
            correct: 0,
            explanation: 'Manual touch-up improves polish and consistency and corrects AI artifacts.'
          },
          {
            question: 'If environment generations vary too much, you should:',
            options: ['Tighten prompts and reuse references', 'Stop saving prompts', 'Change style every scene', 'Ignore differences'],
            correct: 0,
            explanation: 'Tighter prompts and consistent references reduce variation.'
          },
          {
            question: 'A practical way to ensure consistency across assets is to:',
            options: ['Name, organize, and version your outputs', 'Delete everything after exporting', 'Avoid folders', 'Only keep final exports'],
            correct: 0,
            explanation: 'Organization and versioning makes it easier to maintain and reuse consistent assets.'
          }
        ]
      }
    }
  ]
};

export default module3;
