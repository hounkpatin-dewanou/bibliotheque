'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'; 

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('accueil');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  // On vérifie si on est bien côté client
  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decodedPayload = JSON.parse(atob(payloadBase64));
          // On n'appelle le state que si la valeur est différente pour éviter les renders inutiles
          if (decodedPayload.username) {
            setUserEmail(decodedPayload.username);
          }
        }
      } catch (e) {
        console.error("Erreur décodage token", e);
      }
    }
  };

  loadUser();
}, []); // S'exécute une seule fois au montage


  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Au cas où des infos users sont stockées
    router.push('/login');
  };

  useEffect(() => {
  const sections = ['accueil', 'apropos', 'bibliotheque'];
  
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Déclenche le changement quand la section est au milieu de l'écran
    threshold: 0
  };

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach((id) => {
    const element = document.getElementById(id);
    if (element) observer.observe(element);
  });

  return () => observer.disconnect();
}, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Désactiver le scroll du corps quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Bibliothèque', href: '#bibliotheque' },
    { name: 'Recherche', href: '#recherche' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-500 ease-in-out px-6 py-4',
          isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* LOGO avec next/image */}
          <Link href="/recherche" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/logo_wbg.png" 
                alt="Le Coin Lecture" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={cn(
              "font-bold text-2xl tracking-tighter transition-colors duration-300",
              isScrolled ? "text-slate-900" : "text-slate-900"
            )}>
              Le Coin Lecture
            </span>
          </Link>

          {/* LIENS DESKTOP */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
  // On vérifie si la section est active (ex: "#apropos" devient "apropos")
  const isActive = activeSection === link.href.replace('#', '');
  
  return (
    <Link
      key={link.name}
      href={link.href}
      className={cn(
        "relative text-lg font-semibold transition-colors duration-300 py-2 hover:text-blue-600",
        // Couleur bleue si actif, sinon blanc/noir selon le scroll
        isActive ? "text-blue-600" : (isScrolled ? "text-slate-900" : "text-slate-900")
      )}
    >
      {link.name}
      {/* La barre qui se souligne de gauche à droite */}
      <span className={cn(
        "absolute bottom-0 left-0 h-[3px] transition-all duration-300 ease-out bg-blue-600",
        // Si actif, largeur 100%, sinon 0% (et 100% au survol group-hover)
        isActive ? "w-full" : "w-0 group-hover:w-full"
      )} />
    </Link>
  );
})}
{/* --- SECTION PROFIL UTILISATEUR --- */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center transition-all border-2 cursor-pointer overflow-hidden",
                  isScrolled ? "border-slate-200 bg-slate-50" : "border-slate-300 bg-white/20 backdrop-blur-sm"
                )}
              >
                <User className={cn(isScrolled ? "text-slate-600" : "text-slate-900")} size={24} />
              </button>

              {/* CARD DROPDOWN */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Connecté en tant que</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{userEmail}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-bold text-sm"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Mon Dashboard
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm cursor-pointer"
                    >
                      <LogOut size={18} />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
          

          {/* BOUTON MOBILE */}
          <button 
            className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-slate-900 h-8 w-8" />
            ) : (
              <Menu className={cn("h-8 w-8 transition-colors", isScrolled ? "text-slate-900" : "text-slate-900")} />
            )}
          </button>
        </div>
        
      </nav>

      {/* MENU MOBILE MODERNE (Overlay) */}
      <div className={cn(
        "fixed inset-0 z-[60] md:hidden transition-all duration-500",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop flou */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Panneau */}
        <div className={cn(
          "absolute right-0 top-0 h-full w-[80%] bg-white shadow-2xl transition-transform duration-500 p-8 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex justify-end mb-8">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 cursor-pointer">
              <X className="h-8 w-8 text-slate-900" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer border-b border-slate-100 pb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/emprunts" 
              className="mt-4 bg-blue-600 text-slate-900 text-center py-4 rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Emprunter
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}