import { Module } from '../../types';
import lesson1 from './lesson1-manual-vs-computerized';
import lesson2 from './lesson2-bookkeeping-software';
import lesson3 from './lesson3-advantages-limitations';
import lesson4 from './lesson4-data-security-backups';
import { quiz9 } from './quiz9';

const module9: Module = {
  id: 'module9',
  title: 'Computerised Bookkeeping',
  description: 'Understanding computerised bookkeeping systems, software options, advantages, limitations, and data security practices.',
  lessons: [lesson1, lesson2, lesson3, lesson4],
  quiz: quiz9,
  order: 9,
};

export default module9;
