'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, HelpCircle, Grid, LogOut, User } from 'lucide-react';

const menuItems = [
  { label: 'Accueil', href: '/admin' },
  { label: 'Livres', href: '/admin/livres' },
  { label: 'Utilisateurs', href: '/admin/utilisateurs' },
  { label: 'Emprunts', href: '/admin/emprunts' },
  { label: 'Stats', href: '/admin/stats' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login'); // Ajuste le chemin selon ta route de login
  };

  // Fonction pour vérifier si le lien est actif (gestion des sous-pages)
  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

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
                isActive(item.href) 
                ? 'bg-blue-100 text-blue-600 shadow-sm' 
                : 'text-blue-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Droite : Icons + Profil */}
        <div className="flex items-center gap-2 relative">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full hidden sm:block transition-colors">
            <HelpCircle size={24} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full hidden sm:block transition-colors">
            <Grid size={24} />
          </button>
          
          {/* Bouton Profil avec Initiales */}
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="h-10 w-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold ml-2 shadow-md hover:bg-blue-700 transition-all cursor-pointer overflow-hidden"
          >
            A
          </button>

          {/* Carte de déconnexion (Dropdown) */}
          {showProfile && (
            <>
              {/* Overlay pour fermer en cliquant ailleurs */}
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfile(false)}></div>
              
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in zoom-in duration-200">                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                >
                  <LogOut size={18} /> Se déconnecter
                </button>
              </div>
            </>
          )}
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
              className={`p-3 rounded-xl transition-colors font-medium ${
                isActive(item.href) ? 'bg-blue-50 text-blue-700' : 'text-blue-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}