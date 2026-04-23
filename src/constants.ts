import { Question, Major } from './types';

export const MAJORS: Record<Major, { name: string; desc: string }> = {
  TKJ: { name: 'Teknik Komputer Jaringan', desc: 'Mempelajari infrastruktur jaringan dan hardware komputer.' },
  DKV: { name: 'Desain Komunikasi Visual', desc: 'Mempelajari seni grafis dan komunikasi kreatif visual.' },
  AK: { name: 'Akuntansi', desc: 'Mempelajari pencatatan keuangan dan analisis data finansial.' },
  BC: { name: 'Broadcasting', desc: 'Mempelajari produksi konten televisi, radio, dan media digital.' },
  MPLB: { name: 'Manajemen Perkantoran Layanan Bisnis', desc: 'Mempelajari tata kelola administrasi dan layanan bisnis modern.' },
  BD: { name: 'Bisnis Digital', desc: 'Mempelajari pemasaran online dan operasional bisnis e-commerce.' }
};

// Generating 30 questions for each major
const generateQuestions = (major: Major): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= 30; i++) {
    const isHard = i % 3 === 0;
    questions.push({
      id: `${major}-${i}`,
      major: major,
      difficulty: isHard ? 'HARD' : 'EASY',
      text: `Pertanyaan ${major} Ke-${i}: ${isHard ? 'Analisis mendalam mengenai' : 'Dasar-dasar dari'} materi kompetensi keahlian ${major} pada bab ${Math.ceil(i/5)}?`,
      options: [
        `Opsi A: Jawaban Benar untuk soal ${i}`,
        `Opsi B: Jawaban Salah pertama`,
        `Opsi C: Jawaban Salah kedua`,
        `Opsi D: Jawaban Salah ketiga`
      ],
      correctAnswer: 0
    });
  }
  return questions;
};

export const EXAM_QUESTIONS: Record<Major, Question[]> = {
  TKJ: generateQuestions('TKJ'),
  DKV: generateQuestions('DKV'),
  AK: generateQuestions('AK'),
  BC: generateQuestions('BC'),
  MPLB: generateQuestions('MPLB'),
  BD: generateQuestions('BD')
};

export const KKM_VALUE = 50;
export const LOCATION_CITY = "Kota Tangerang";
