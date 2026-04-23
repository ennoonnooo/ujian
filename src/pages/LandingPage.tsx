import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MAJORS, LOCATION_CITY } from '../constants';
import { GraduationCap, MapPin, ArrowRight, BookOpen, Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            SP
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight">SMK PRIMA UNGGUL</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{LOCATION_CITY}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="btn-primary flex items-center gap-2"
        >
          Masuk <ArrowRight size={18} />
        </button>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-1.5 bg-orange-100 text-primary text-sm font-semibold rounded-full">
            Pendaftaran Dibuka 2026/2027
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Ciptakan Masa Depan <span className="text-primary italic">Digital</span> Anda.
          </h2>
          <p className="text-lg text-gray-600 max-w-lg">
            SMK Prima Unggul adalah pusat keunggulan pendidikan vokasi di Kota Tangerang yang berfokus pada teknologi, bisnis, dan industri kreatif.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={() => navigate('/login')} className="btn-primary px-10 py-4 text-lg">Mulai Sekarang</button>
            <div className="flex items-center gap-3 px-6 py-4 border border-gray-200 rounded-xl font-semibold">
              <Users className="text-primary" />
              <span>3000+ Alumni</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="aspect-square bg-orange-500/10 rounded-full absolute -top-10 -left-10 w-full h-full -z-10 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60" 
            alt="Students" 
            className="rounded-3xl shadow-2xl object-cover w-full aspect-[4/5]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
             { icon: GraduationCap, label: 'Alumni', val: '5.2k+' },
             { icon: BookOpen, label: 'Materi', val: '320+' },
             { icon: Clock, label: 'Pengalaman', val: '15 Thn' },
             { icon: MapPin, label: 'Lokasi', val: 'Kota TNG' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm mx-auto flex items-center justify-center text-primary">
                <stat.icon />
              </div>
              <p className="font-black text-2xl">{stat.val}</p>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Majors */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h3 className="text-orange-600 font-bold tracking-widest uppercase text-sm">Program Keahlian</h3>
          <h4 className="text-4xl font-extrabold">6 Jurusan Unggulan Kami</h4>
          <p className="text-gray-500">Persiapkan diri Anda untuk bersaing di dunia industri global dengan kurikulum berbasis praktik terkini.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(MAJORS).map(([key, info], i) => (
            <motion.div 
              key={key}
              whileHover={{ y: -10 }}
              className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-primary font-black text-xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {key}
              </div>
              <h5 className="text-xl font-bold mb-3">{info.name}</h5>
              <p className="text-gray-500 text-sm leading-relaxed">{info.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">SP</div>
            <span className="font-bold">SMK Prima Unggul</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 SMK Prima Unggul Kota Tangerang. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
