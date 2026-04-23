export type Role = 'ADMIN' | 'GURU' | 'STAFF' | 'SISWA';
export type Major = 'TKJ' | 'DKV' | 'AK' | 'BC' | 'MPLB' | 'BD';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: Role;
  major?: Major; // For Siswa
  nisn?: string; // For Siswa
  avatar?: string;
}

export interface Student {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  major: Major;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO date
  checkIn: string; // ISO string
  type: 'KARYAWAN' | 'SISWA';
  status: 'HADIR' | 'ALFA' | 'IZIN' | 'SAKIT';
  studentId?: string; // If type is SISWA
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  difficulty: 'EASY' | 'HARD';
  major: Major | 'GENERAL';
}

export interface ExamResult {
  id: string;
  studentId: string;
  major: Major;
  score: number;
  date: string;
  answers: number[];
  difficulty: 'EASY' | 'HARD' | 'MIXED';
}
