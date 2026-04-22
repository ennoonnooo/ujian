import React, { useState } from 'react';
import { useDB } from '../../App';
import { 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  UserCog, 
  Search,
  BadgeCheck
} from 'lucide-react';
import { User, Role } from '../../types';
import { motion } from 'motion/react';

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser, currentUser } = useDB();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    password: '',
    name: '',
    role: 'GURU'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      updateUser(formData as User);
    } else {
      addUser({ 
        ...formData, 
        id: Date.now().toString() 
      } as User);
    }
    setShowModal(false);
    setFormData({ username: '', password: '', name: '', role: 'GURU' });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">User Management</h1>
          <p className="text-gray-500 font-medium">Kelola akses akun Guru, Tenaga Kependidikan, dan Admin.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium text-sm w-64"
            />
          </div>
          <button 
            onClick={() => {
              setFormData({ username: '', password: '', name: '', role: 'GURU' });
              setShowModal(true);
            }} 
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={20} /> Tambah User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <motion.div 
            key={user.id}
            layout
            className="p-8 glass-card border-none bg-white shadow-xl space-y-6 relative group"
          >
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-primary font-black text-xl shadow-inner uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => {
                    setFormData(user);
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-orange-50 rounded-lg transition-all"
                >
                  <UserCog size={18} />
                </button>
                {user.id !== currentUser?.id && (
                  <button 
                    onClick={() => deleteUser(user.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1">{user.name}</h3>
                <p className="text-sm font-medium text-gray-400 tracking-wide">@{user.username}</p>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                ${user.role === 'ADMIN' ? 'bg-indigo-500 text-white' : 'bg-primary text-white'}
              `}>
                <BadgeCheck size={12} />
                {user.role}
              </div>
            </div>

            {user.role === 'ADMIN' && (
              <ShieldCheck className="absolute top-4 right-4 text-indigo-500 opacity-20" size={64} />
            )}
          </motion.div>
        ))}
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
              <h3 className="text-2xl font-black text-gray-900">{formData.id ? 'Edit User' : 'Tambah User Baru'}</h3>
              <p className="text-gray-500 font-medium">Buat kredensial login untuk staff sekolah.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="GURU">GURU</option>
                    <option value="STAFF">TENAGA KEPENDIDIKAN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                <input 
                  type="password"
                  required={!formData.id}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-900 transition-all">Batal</button>
                <button type="submit" className="flex-1 btn-primary py-4 rounded-2xl">Simpan Akun</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
