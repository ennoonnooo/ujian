import React, { useState } from 'react';
import { useDB } from '../../App';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  Search,
  Users2,
  Key
} from 'lucide-react';
import { motion } from 'motion/react';
import { Major } from '../../types';

export default function StudentManagement() {
  const { students, addStudent, updateStudent, deleteStudent, addUser, updateUser, users } = useDB();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    nis: '',
    nama: '',
    kelas: '',
    major: 'TKJ' as Major,
    password: 'password123' // Default password for new students
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = formData.id || Date.now().toString();
    
    const studentData = {
      id: studentId,
      nis: formData.nis,
      nama: formData.nama,
      kelas: formData.kelas,
      major: formData.major
    };

    const userData = {
      id: `user-${studentId}`,
      username: formData.nis, // Use NIS as username for login
      password: formData.password,
      name: formData.nama,
      role: 'SISWA' as const,
      major: formData.major,
      nisn: formData.nis
    };

    if (formData.id) {
      updateStudent(studentData);
      updateUser(userData);
    } else {
      addStudent(studentData);
      addUser(userData);
    }

    setShowModal(false);
    setFormData({ id: '', nis: '', nama: '', kelas: '', major: 'TKJ', password: 'password123' });
  };

  const handleDelete = (student: any) => {
    deleteStudent(student.id);
    // Note: deleteUser logic would follow if needed, but for persistence we'll keep it simple
  };

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">Manajemen Data Siswa</h1>
          <p className="text-gray-500 font-medium">Setiap siswa yang didaftarkan otomatis mendapatkan akun login (Username = NIS).</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium text-sm w-64"
            />
          </div>
          <button 
            onClick={() => {
              setFormData({ id: '', nis: '', nama: '', kelas: '', major: 'TKJ', password: 'password123' });
              setShowModal(true);
            }} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Siswa
          </button>
        </div>
      </div>

      <div className="glass-card bg-white border-none shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">NIS (Username)</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Kelas & Jurusan</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">Data siswa belum tersedia.</td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 font-mono text-xs font-bold text-gray-400 tracking-widest">{student.nis}</td>
                  <td className="px-8 py-6 font-bold text-gray-900">{student.nama}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-primary">Kelas {student.kelas}</span>
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       <span className="text-xs font-black uppercase text-gray-400">{student.major}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          const userAccount = users.find(u => u.username === student.nis);
                          setFormData({ 
                            ...student, 
                            password: userAccount?.password || 'password123' 
                          } as any);
                          setShowModal(true);
                        }}
                        className="p-2 text-primary hover:bg-orange-50 rounded-lg transition-all"
                      >
                       <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                      >
                       <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card border-none bg-white p-10 space-y-8"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 font-sans">{formData.id ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
              <p className="text-gray-500 font-medium">NIS akan digunakan sebagai username login.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">NIS (Username)</label>
                  <input 
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({...formData, nis: e.target.value})}
                    placeholder="Contoh: 121010"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    placeholder="Masukkan nama..."
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Kelas</label>
                  <input 
                    required
                    value={formData.kelas}
                    onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                    placeholder="Contoh: XII TKJ 1"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Jurusan</label>
                  <select 
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value as Major})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  >
                    <option value="TKJ">TKJ</option>
                    <option value="DKV">DKV</option>
                    <option value="AK">AK</option>
                    <option value="BC">BC</option>
                    <option value="MPLB">MPLB</option>
                    <option value="BD">BD</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Key size={12} /> Password Login Siswa
                </label>
                <input 
                  required
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-900 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary py-4 rounded-2xl shadow-xl shadow-orange-500/20"
                >
                  {formData.id ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
