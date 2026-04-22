import React, { useState } from 'react';
import { useDB } from '../../App';
import { motion } from 'motion/react';
import { Search, Filter, ClipboardCheck, GraduationCap, ChevronRight } from 'lucide-react';

export default function AbsensiSiswa() {
  const { students, markAttendance, attendance } = useDB();
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const today = new Date().toISOString().split('T')[0];

  const filteredStudents = students.filter(s => {
    const matchesMajor = selectedMajor === 'ALL' || s.major === selectedMajor;
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm);
    return matchesMajor && matchesSearch;
  });

  const handleMark = (studentId: string, status: 'HADIR' | 'ALFA' | 'IZIN' | 'SAKIT') => {
    // Check if already marked
    const exists = attendance.find(a => a.studentId === studentId && a.date === today);
    if (!exists) {
      markAttendance({
        userId: 'SYSTEM',
        date: today,
        checkIn: new Date().toLocaleTimeString('id-ID'),
        type: 'SISWA',
        status: status,
        studentId: studentId
      });
    }
  };

  const getStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === today)?.status;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">Absensi Siswa</h1>
          <p className="text-gray-500 font-medium">Lakukan pencatatan presensi siswa SMK Prima Unggul harian.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Nama / NIS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm w-64 shadow-sm"
            />
          </div>
          <select 
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm shadow-sm"
          >
            <option value="ALL">Semua Jurusan</option>
            <option value="TKJ">TKJ</option>
            <option value="DKV">DKV</option>
            <option value="AK">Akuntansi</option>
            <option value="BC">Broadcasting</option>
            <option value="MPLB">MPLB</option>
            <option value="BD">Bisnis Digital</option>
          </select>
        </div>
      </div>

      <div className="glass-card bg-white border-none shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Siswa</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Jurusan & Kelas</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Aksi Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-medium">Berdasarkan pencarian, tidak ada data siswa.</td>
                </tr>
              ) : filteredStudents.map((student) => {
                const currentStatus = getStatus(student.id);
                return (
                  <tr key={student.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-primary font-black">
                          {student.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{student.nama}</p>
                          <p className="text-xs text-gray-400 font-medium">NIS: {student.nis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-black uppercase">{student.major}</span>
                        <span className="text-sm font-bold text-gray-500">Kelas {student.kelas}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {currentStatus ? (
                        <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs shadow-sm
                          ${currentStatus === 'HADIR' ? 'bg-green-500 text-white' : 
                            currentStatus === 'ALFA' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}
                        `}>
                          <ClipboardCheck size={14} />
                          {currentStatus}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => handleMark(student.id, 'HADIR')} className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-xs hover:bg-green-500 hover:text-white transition-all">Hadir</button>
                          <button onClick={() => handleMark(student.id, 'IZIN')} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-xs hover:bg-orange-500 hover:text-white transition-all">Izin</button>
                          <button onClick={() => handleMark(student.id, 'SAKIT')} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-500 hover:text-white transition-all">Sakit</button>
                          <button onClick={() => handleMark(student.id, 'ALFA')} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all">Alfa</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
