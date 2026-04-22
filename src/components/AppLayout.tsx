import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useDB } from '../App';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut, 
  GraduationCap, 
  FileText,
  UserCircle
} from 'lucide-react';

export default function AppLayout() {
  const { currentUser, logout } = useDB();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutDashboard, roles: ['ADMIN', 'GURU', 'STAFF', 'SISWA'] },
    { label: 'Absensi Mandiri', path: '/app/absensi-karyawan', icon: UserCheck, roles: ['ADMIN', 'GURU', 'STAFF'] },
    { label: 'Absensi Siswa', path: '/app/absensi-siswa', icon: ClipboardList, roles: ['ADMIN', 'GURU'] },
    { label: 'Ujian Online', path: '/app/ujian', icon: FileText, roles: ['SISWA'] },
    { label: 'Rekap Absensi', path: '/app/rekap', icon: ClipboardList, roles: ['ADMIN', 'GURU'] },
    { label: 'Data Siswa', path: '/app/students', icon: GraduationCap, roles: ['ADMIN'] },
    { label: 'User Management', path: '/app/users', icon: Settings, roles: ['ADMIN'] },
  ];

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              SP
            </div>
            <div>
              <h1 className="font-extrabold text-sm leading-tight uppercase tracking-tighter">SMK Prima Unggul</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Portal Digital</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.filter(item => item.roles.includes(currentUser.role)).map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all
                ${isActive 
                  ? 'bg-orange-50 text-primary' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-orange-100">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{currentUser.name}</p>
              <p className="text-[10px] text-gray-400 uppercase font-black">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {currentUser.role === 'SISWA' ? `Halo, ${currentUser.name} 👋` : `Selamat Datang, ${currentUser.name}`}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p className="text-xs text-gray-400 font-medium tracking-wide">Tangerang Selatan, ID</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={24} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
