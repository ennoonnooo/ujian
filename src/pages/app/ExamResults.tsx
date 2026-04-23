import React, { useState } from 'react';
import { useDB } from '../../App';
import { 
  Trophy, 
  Search, 
  Filter, 
  GraduationCap, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';
import { KKM_VALUE, MAJORS } from '../../constants';

export default function ExamResults() {
  const { examResults, students } = useDB();
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'EASY' | 'HARD' | 'MIXED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = examResults.filter(result => {
    const student = students.find(s => s.id === result.studentId);
    const matchesMajor = selectedMajor === 'ALL' || result.major === selectedMajor;
    const matchesStatus = statusFilter === 'ALL' 
      ? true 
      : statusFilter === 'PASS' ? result.score >= KKM_VALUE : result.score < KKM_VALUE;
    const matchesDifficulty = difficultyFilter === 'ALL' || result.difficulty === difficultyFilter;
    const matchesSearch = student?.nama.toLowerCase().includes(searchTerm.toLowerCase()) || student?.nis.includes(searchTerm);
    
    return matchesMajor && matchesStatus && matchesSearch && matchesDifficulty;
  });

  const getStudentInfo = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">Hasil Ujian Online</h1>
          <p className="text-gray-500 font-medium">Monitoring nilai dan kelulusan siswa SMK Prima Unggul.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           {/* Search */}
           <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium text-sm w-48"
            />
          </div>

          {/* Major Filter */}
          <select 
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm shadow-sm"
          >
            <option value="ALL">Semua Jurusan</option>
            {Object.keys(MAJORS).map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm shadow-sm"
          >
            <option value="ALL">Semua Status</option>
            <option value="PASS">Lulus (≥ {KKM_VALUE})</option>
            <option value="FAIL">Remedial (&lt; {KKM_VALUE})</option>
          </select>

          {/* Difficulty Filter */}
          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm shadow-sm"
          >
            <option value="ALL">Semua Tingkat</option>
            <option value="EASY">EASY</option>
            <option value="HARD">HARD</option>
            <option value="MIXED">MIXED</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 glass-card border-none bg-white shadow-xl space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rata-rata Nilai</p>
          <p className="text-4xl font-black text-primary">
            {filteredResults.length > 0 
              ? Math.round(filteredResults.reduce((acc, r) => acc + r.score, 0) / filteredResults.length) 
              : 0}
          </p>
        </div>
        <div className="p-8 glass-card border-none bg-white shadow-xl space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Siswa Lulus</p>
          <p className="text-4xl font-black text-green-500">
            {filteredResults.filter(r => r.score >= KKM_VALUE).length}
          </p>
        </div>
        <div className="p-8 glass-card border-none bg-white shadow-xl space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tingkat Kelulusan</p>
          <p className="text-4xl font-black text-indigo-500">
            {filteredResults.length > 0 
              ? Math.round((filteredResults.filter(r => r.score >= KKM_VALUE).length / filteredResults.length) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      <div className="glass-card bg-white border-none shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black text-gray-900 text-lg flex items-center gap-3">
            <Trophy className="text-primary" />
            Peringkat Nilai Siswa
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Siswa</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Jurusan</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Nilai Akhir</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Tanggal Ujian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-medium">Data hasil ujian tidak ditemukan.</td>
                </tr>
              ) : filteredResults.sort((a,b) => b.score - a.score).map((result) => {
                const student = getStudentInfo(result.studentId);
                const isPass = result.score >= KKM_VALUE;

                return (
                  <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                          {student?.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{student?.nama || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">NIS: {student?.nis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest text-center">
                          {result.major}
                        </span>
                        <span className={`text-[9px] font-black uppercase text-center ${result.difficulty === 'HARD' ? 'text-red-400' : 'text-blue-400'}`}>
                          • {result.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-2xl font-black ${isPass ? 'text-green-500' : 'text-red-500'}`}>
                        {result.score}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                      `}>
                         {isPass ? <TrendingUp size={12} /> : <AlertCircle size={12} />}
                         {isPass ? 'LULUS' : 'REMEDIAL'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-400 font-bold">
                       {new Date(result.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
