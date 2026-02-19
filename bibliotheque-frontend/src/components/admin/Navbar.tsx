'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, HelpCircle, Grid } from 'lucide-react';

const menuItems = [
  { label: 'Accueil', href: '/admin' },
  { label: 'Livres', href: '/admin/livres' },
  { label: 'Utilisateurs', href: '/admin/utilisateurs' },
  { label: 'Emprunts', href: '/admin/emprunts' },
  { label: 'Stats', href: '/admin/stats' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-2 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Gauche : Menu Mobile + Logo */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-blue-600 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/admin" className="text-[22px] text-blue-600 font-medium flex items-center gap-2 hover:text-blue-700 transition-colors">
            <span className="text-blue-600 font-bold">LCL</span> Compte
          </Link>
        </div>

        {/* Centre : Navigation Desktop */}
        <div className="hidden lg:flex items-center bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === item.href 
                ? 'bg-blue-100 text-blue-600 shadow-md' 
                : 'text-blue-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Droite : Icons + Profil */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full hidden sm:block transition-colors">
            <HelpCircle size={24} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full hidden sm:block transition-colors">
            <Grid size={24} />
          </button>
          <div className="h-10 w-10 bg-blue-600 rounded-full border-2 border-gray-200 flex items-center justify-center text-white font-bold ml-2 shadow-md">
            A
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white absolute top-full left-0 w-full border-b border-gray-200 p-4 flex flex-col gap-2 shadow-lg">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="p-3 text-blue-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
            >
              {item.label}
          </Link>
        ))}
        </div>
      )}
    </nav>
  );
}
