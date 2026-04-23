import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, Role, Student, AttendanceRecord, ExamResult } from './types';

// Pages - We will create these next
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/app/Dashboard';
import AbsensiKaryawan from './pages/app/AbsensiKaryawan';
import AbsensiSiswa from './pages/app/AbsensiSiswa';
import RekapAbsensi from './pages/app/RekapAbsensi';
import StudentManagement from './pages/app/StudentManagement';
import UserManagement from './pages/app/UserManagement';
import UjianOnline from './pages/app/UjianOnline';
import ExamResults from './pages/app/ExamResults';

interface DatabaseContextType {
  currentUser: User | null;
  users: User[];
  students: Student[];
  attendance: AttendanceRecord[];
  examResults: ExamResult[];
  login: (username: string, password?: string, roleGroup?: 'STAFF' | 'SISWA') => Promise<boolean>;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  resetDatabase: () => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  submitExam: (result: Omit<ExamResult, 'id'>) => void;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const useDB = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDB must be used within DatabaseProvider');
  return context;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    if (saved) return JSON.parse(saved);
    // Initial Seed Data
    return [
      { id: '1', username: 'admin', password: 'password', name: 'Super Admin', role: 'ADMIN' },
      { id: '2', username: 'guru1', password: 'password', name: 'Bpk. Ahmad Suherman', role: 'GURU' },
      { id: '3', username: '121010', password: 'password123', name: 'Muhammad Fajri', role: 'SISWA', major: 'DKV', nisn: '121010' },
      { id: '4', username: '121020', password: 'password123', name: 'Ayra Queni', role: 'SISWA', major: 'MPLB', nisn: '121020' },
      { id: '5', username: '121030', password: 'password123', name: 'Andi Bassam', role: 'SISWA', major: 'DKV', nisn: '121030' },
      { id: '6', username: '121040', password: 'password123', name: 'Nayla Anggaraini', role: 'SISWA', major: 'MPLB', nisn: '121040' },
      { id: '7', username: '121050', password: 'password123', name: 'Elang Raylife', role: 'SISWA', major: 'BC', nisn: '121050' },
      { id: '8', username: '121060', password: 'password123', name: 'Bening Alitria Gunawan', role: 'SISWA', major: 'MPLB', nisn: '121060' },
      { id: '9', username: '121070', password: 'password123', name: 'Dheannova Aryo Dewantoro', role: 'SISWA', major: 'TKJ', nisn: '121070' },
    ];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    if (saved) return JSON.parse(saved);
    return [
      { id: '3', nis: '121010', nama: 'Muhammad Fajri', kelas: 'XII DKV 1', major: 'DKV' },
      { id: '4', nis: '121020', nama: 'Ayra Queni', kelas: 'XII MPLB 1', major: 'MPLB' },
      { id: '5', nis: '121030', nama: 'Andi Bassam', kelas: 'XII DKV 1', major: 'DKV' },
      { id: '6', nis: '121040', nama: 'Nayla Anggaraini', kelas: 'XII MPLB 1', major: 'MPLB' },
      { id: '7', nis: '121050', nama: 'Elang Raylife', kelas: 'XII BC 1', major: 'BC' },
      { id: '8', nis: '121060', nama: 'Bening Alitria Gunawan', kelas: 'XII MPLB 1', major: 'MPLB' },
      { id: '9', nis: '121070', nama: 'Dheannova Aryo Dewantoro', kelas: 'XII TKJ 1', major: 'TKJ' },
    ];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('examResults');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendance', JSON.stringify(attendance));
    localStorage.setItem('examResults', JSON.stringify(examResults));
    localStorage.setItem('current_user', JSON.stringify(currentUser));
  }, [users, students, attendance, examResults, currentUser]);

  const login = async (username: string, password?: string, targetRoleGroup?: 'STAFF' | 'SISWA') => {
    const user = users.find(u => {
      const matchUsername = u.username === username;
      const matchPassword = u.password === (password || '');
      
      let matchRole = true;
      if (targetRoleGroup === 'SISWA') {
        matchRole = u.role === 'SISWA';
      } else if (targetRoleGroup === 'STAFF') {
        matchRole = ['ADMIN', 'GURU', 'STAFF'].includes(u.role);
      }
      
      return matchUsername && matchPassword && matchRole;
    });

    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addUser = (user: User) => setUsers([...users, user]);
  const updateUser = (user: User) => setUsers(users.map(u => u.id === user.id ? user : u));
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const addStudent = (student: Student) => setStudents([...students, student]);
  const updateStudent = (student: Student) => setStudents(students.map(s => s.id === student.id ? student : s));
  const deleteStudent = (id: string) => setStudents(students.filter(s => s.id !== id));

  const resetDatabase = () => {
    localStorage.clear();
    window.location.reload();
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    setAttendance([...attendance, { ...record, id: Date.now().toString() }]);
  };

  const submitExam = (result: Omit<ExamResult, 'id'>) => {
    setExamResults([...examResults, { ...result, id: Date.now().toString() }]);
  };

  return (
    <DatabaseContext.Provider value={{ 
      currentUser, users, students, attendance, examResults,
      login, logout, addUser, updateUser, deleteUser,
      addStudent, updateStudent, deleteStudent, resetDatabase,
      markAttendance, submitExam
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/app" element={currentUser ? <AppLayout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="absensi-karyawan" element={<AbsensiKaryawan />} />
            <Route path="absensi-siswa" element={<AbsensiSiswa />} />
            <Route path="rekap" element={<RekapAbsensi />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="ujian" element={<UjianOnline />} />
            <Route path="results" element={<ExamResults />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DatabaseContext.Provider>
  );
}
