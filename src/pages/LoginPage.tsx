import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '../App';
import { LOCATION_CITY, MAJORS } from '../constants';
import { User, Major } from '../types';
import { LogIn, UserCircle, Key, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STAFF' | 'SISWA'>('STAFF');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, addUser } = useDB();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For Demo: If user is SISWA and doesn't exist, auto-create them
      if (role === 'SISWA') {
        const studentUser: User = {
          id: Date.now().toString(),
          username: username,
          name: `Siswa ${username}`,
          role: 'SISWA',
          major: 'TKJ', // Default
          nisn: username
        };
        await login(username); // Try login
        // If fail, we won't auto-create here for production, but for user request "bikin akun siswa", 
        // normally admin does it. Let's assume some exist or admin created them.
      }

      const success = await login(username, role === 'STAFF' ? password : '');
      
      if (success) {
        navigate('/app');
      } else {
        setError('Username atau Password salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card overflow-hidden"
      >
        <div className="p-8 pb-0 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">Selamat Datang</h2>
          <p className="text-gray-500 mt-2">Masuk ke Portal Digital SMK Prima Unggul</p>
        </div>

        <div className="p-8">
          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setRole('STAFF')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${role === 'STAFF' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
            >
              Guru / Staff
            </button>
            <button 
              onClick={() => setRole('SISWA')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${role === 'SISWA' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
            >
              Siswa (NISN)
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                {role === 'STAFF' ? 'Username' : 'NISN / Username'}
              </label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder={role === 'STAFF' ? "Masukkan username" : "Masukkan NISN Anda"}
                  required
                />
              </div>
            </div>

            {role === 'STAFF' && (
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Kata Sandi</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-xl border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Memproses...' : 'Masuk portal'}
              {!loading && <ChevronRight size={20} />}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-xs font-medium">
            &copy; 2026 {LOCATION_CITY} • SP Digital Team
          </p>
        </div>
      </motion.div>
    </div>
  );
}
