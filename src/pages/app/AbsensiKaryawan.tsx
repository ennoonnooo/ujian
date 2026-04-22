import React, { useState } from 'react';
import { useDB } from '../../App';
import { motion } from 'motion/react';
import { UserCheck, MapPin, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LOCATION_CITY } from '../../constants';

export default function AbsensiKaryawan() {
  const { currentUser, markAttendance, attendance } = useDB();
  const today = new Date().toISOString().split('T')[0];
  const hasAbsen = attendance.find(a => a.userId === currentUser?.id && a.date === today && a.type === 'KARYAWAN');

  const handleAbsen = () => {
    markAttendance({
      userId: currentUser!.id,
      date: today,
      checkIn: new Date().toLocaleTimeString('id-ID'),
      type: 'KARYAWAN',
      status: 'HADIR'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">Absensi Mandiri</h1>
        <p className="text-gray-500 font-medium">Klik tombol di bawah untuk melakukan presensi harian karyawan & staff.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 glass-card bg-white border-none shadow-2xl space-y-8 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center ring-8 ring-primary/5">
            <UserCheck size={40} />
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest uppercase">Waktu Digital</p>
            <p className="text-5xl font-black text-gray-900">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-sm font-bold text-gray-500 flex items-center justify-center gap-2">
              <MapPin size={14} className="text-primary" /> {LOCATION_CITY}
            </p>
          </div>

          <div className="pt-6">
            {hasAbsen ? (
              <div className="bg-green-50 text-green-600 p-6 rounded-3xl border border-green-100 space-y-2">
                <CheckCircle2 size={32} className="mx-auto" />
                <p className="font-black text-lg">Sudah Absen Hari Ini</p>
                <p className="text-sm font-medium opacity-80">Check-in pukul {hasAbsen.checkIn}</p>
              </div>
            ) : (
              <button 
                onClick={handleAbsen}
                className="btn-primary w-full py-5 text-xl"
              >
                Absen Sekarang
              </button>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="p-8 bg-gray-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold mb-4">Informasi Penting</h3>
            <ul className="space-y-4 text-sm opacity-80 font-medium list-disc pl-5">
              <li>Absensi hanya diperbolehkan satu kali dalam sehari.</li>
              <li>Pastikan GPS/Lokasi perangkat telah diaktifkan untuk akurasi data.</li>
              <li>Waktu presensi mengikuti Waktu Indonesia Barat (WIB).</li>
            </ul>
            <ShieldAlert size={120} className="absolute -right-8 -bottom-8 opacity-5 -rotate-12" />
          </div>

          <div className="p-8 glass-card border-gray-100 bg-white">
            <h3 className="text-lg font-bold mb-6">Status Kehadiran Minggu Ini</h3>
            <div className="flex justify-between">
              {['S', 'S', 'R', 'K', 'J'].map((day, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${i < 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i < 3 ? <CheckCircle2 size={18} /> : day}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{day}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
