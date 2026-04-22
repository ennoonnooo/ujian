import React, { useState } from 'react';
import { useDB } from '../../App';
import { 
  BarChart3, 
  Calendar, 
  Filter, 
  Download, 
  UserCheck, 
  FileSpreadsheet
} from 'lucide-react';

export default function RekapAbsensi() {
  const { attendance, students, users } = useDB();
  const [filterType, setFilterType] = useState<'SISWA' | 'KARYAWAN'>('SISWA');

  const filteredAttendance = attendance.filter(a => a.type === filterType);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">Rekapitulasi Absensi</h1>
          <p className="text-gray-500 font-medium">Laporan lengkap kehadiran harian warga sekolah.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => setFilterType('SISWA')}
            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${filterType === 'SISWA' ? 'bg-primary text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Siswa
          </button>
          <button 
            onClick={() => setFilterType('KARYAWAN')}
            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${filterType === 'KARYAWAN' ? 'bg-primary text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Karyawan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Hadir Tepat Waktu', val: filteredAttendance.filter(a => a.status === 'HADIR').length, color: 'text-green-500' },
          { label: 'Izin / Sakit', val: filteredAttendance.filter(a => ['IZIN', 'SAKIT'].includes(a.status)).length, color: 'text-orange-500' },
          { label: 'Tanpa Keterangan', val: filteredAttendance.filter(a => a.status === 'ALFA').length, color: 'text-red-500' },
          { label: 'Total Rekapan', val: filteredAttendance.length, color: 'text-gray-900' },
        ].map((stat, i) => (
          <div key={i} className="p-8 glass-card border-none bg-white shadow-xl space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="glass-card bg-white border-none shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black text-gray-900 text-lg flex items-center gap-3">
            <FileSpreadsheet className="text-primary" />
            Detail Log Absensi {filterType}
          </h3>
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            <Download size={16} /> Export Excel
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Identitas</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Info Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">Belum ada data absensi tercatat untuk tipe ini.</td>
                </tr>
              ) : filteredAttendance.map((record) => {
                const identity = filterType === 'SISWA' 
                  ? students.find(s => s.id === record.studentId)
                  : users.find(u => u.id === record.userId);

                return (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-sm">{record.checkIn}</span>
                        <span className="text-xs text-gray-400 font-bold">{record.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                          {identity?.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-800">{identity?.name || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${record.status === 'HADIR' ? 'bg-green-100 text-green-600' : 
                          record.status === 'ALFA' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}
                      `}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <UserCheck size={14} className="text-primary" />
                        Portal Digital • Tangerang Selatan
                      </div>
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
