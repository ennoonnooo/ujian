import React from 'react';
import { useDB } from '../../App';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Clock, 
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { KKM_VALUE } from '../../constants';

export default function Dashboard() {
  const { currentUser, students, users, attendance, examResults } = useDB();

  const welcomeMessage = () => {
    switch (currentUser?.role) {
      case 'ADMIN': return 'Kelola operasional sekolah Anda dari sini.';
      case 'GURU': return 'Pastikan absensi hari ini sudah terisi.';
      case 'SISWA': return 'Sudah siapkah kamu untuk ujian hari ini?';
      default: return 'Semoga harimu menyenangkan!';
    }
  };

  const getStats = () => {
    if (currentUser?.role === 'ADMIN') {
      return [
        { label: 'Total Siswa', val: students.length, color: 'bg-blue-500', icon: GraduationCap },
        { label: 'Tipe User', val: Array.from(new Set(users.map(u => u.role))).length, color: 'bg-primary', icon: Users },
        { label: 'Absensi Hari Ini', val: attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length, color: 'bg-green-500', icon: Calendar },
      ];
    }
    if (currentUser?.role === 'SISWA') {
      const myResults = examResults.filter(r => r.studentId === currentUser.id);
      const avgScore = myResults.length > 0 
        ? Math.round(myResults.reduce((acc, curr) => acc + curr.score, 0) / myResults.length) 
        : 0;
      
      return [
        { label: 'Ujian Selesai', val: myResults.length, color: 'bg-primary', icon: FileText },
        { label: 'Rata-rata Nilai', val: avgScore, color: avgScore >= KKM_VALUE ? 'bg-green-500' : 'bg-red-500', icon: TrendingUp },
        { label: 'Min. Kelulusan', val: KKM_VALUE, color: 'bg-gray-400', icon: AlertCircle },
      ];
    }
    return [
      { label: 'Absensi Anda', val: 'Hadir', color: 'bg-green-500', icon: Clock },
      { label: 'Siswa Diampu', val: students.length, color: 'bg-primary', icon: Users },
    ];
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-black text-gray-900 leading-tight">Dashboard Utama</h1>
        <p className="text-gray-500 font-medium">{welcomeMessage()}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass-card border-none bg-white shadow-xl flex items-center justify-between overflow-hidden relative"
          >
            <div className="space-y-1 relative z-10">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-gray-900">{stat.val}</p>
            </div>
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <stat.icon size={28} />
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-5 rounded-full`}></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Info Box */}
        <div className="p-8 bg-primary rounded-[2.5rem] text-white shadow-2xl shadow-orange-500/30 flex flex-col justify-center items-start gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold">Informasi Sekolah</h3>
            <p className="opacity-90 leading-relaxed font-medium">
              Selamat datang di sistem manajemen pendidikan SMK Prima Unggul. Pastikan semua data yang dimasukkan sudah sesuai dengan jadwal pelajaran Kota Tangerang.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
              Lihat Pengumuman
            </button>
          </div>
          <GraduationCap size={200} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
        </div>

        {/* Activity Feed */}
        <div className="p-8 glass-card border-gray-100 space-y-6">
          <h3 className="text-xl font-bold">Aktivitas Terakhir</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Cek Presensi Berhasil</p>
                  <p className="text-xs text-gray-400 font-medium">Melakukan absensi mandiri pada jam 07:15 WIB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
