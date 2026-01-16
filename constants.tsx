
import React from 'react';
import { Level, Subject } from './types';

export const LEVELS: { id: Level; label: string; icon: string; color: string }[] = [
  { id: 'SD', label: 'Sekolah Dasar (SD)', icon: '🎒', color: 'bg-red-500' },
  { id: 'SMP', label: 'Menengah Pertama (SMP)', icon: '🏫', color: 'bg-blue-600' },
  { id: 'SMA', label: 'Menengah Atas (SMA)', icon: '🎓', color: 'bg-gray-800' },
];

export const SUBJECT_CATEGORIES: { title: string; subjects: Subject[] }[] = [
  {
    title: 'Mata Pelajaran Umum',
    subjects: ['Bahasa Indonesia', 'PKN', 'IPS', 'IPA'],
  },
  {
    title: 'Mata Pelajaran Agama & Organisasi',
    subjects: ['Kemuhammadiyahan', 'Ke-NU-an', 'Fikih', 'Aqidah Akhlak'],
  },
];
