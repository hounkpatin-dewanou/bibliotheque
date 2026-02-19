'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Book, Users, MessageSquare, BarChart3, Menu, X, LogOut 
} from 'lucide-react';

const menuItems = [
  { label: 'Accueil', href: '/admin', icon: <Home size={20} />, color: 'bg-blue-500/20 text-blue-400' },
  { label: 'Gestion Livres', href: '/admin/livres', icon: <Book size={20} />, color: 'bg-green-500/20 text-green-400' },
  { label: 'Gestion Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={20} />, color: 'bg-blue-400/20 text-blue-300' },
  { label: 'Demandes Emprunt', href: '/admin/emprunts', icon: <MessageSquare size={20} />, color: 'bg-purple-500/20 text-purple-400' },
  { label: 'Statistiques', href: '/admin/stats', icon: <BarChart3 size={20} />, color: 'bg-orange-500/20 text-orange-400' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 text-white">
        {isOpen ? <X /> : <Menu />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#1f1f1f] text-[#e3e3e3] flex flex-col transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-2">
          <span className="text-xl font-medium">LCL Compte</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-colors ${isActive ? 'bg-[#37393b] text-white' : 'hover:bg-[#2d2e30]'}`}>
                <div className={`p-2 rounded-full ${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 text-xs text-gray-500 space-y-4">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="flex items-center gap-2 hover:text-white transition-colors">
            <LogOut size={16} /> Déconnexion
          </button>
          <div className="flex gap-4 border-t border-gray-800 pt-4">
            <span>Confidentialité</span>
            <span>Conditions</span>
          </div>
        </div>
      </aside>
    </>
  );
}