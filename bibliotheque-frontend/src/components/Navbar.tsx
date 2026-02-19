'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('accueil');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
    { name: 'Accueil', href: '#accueil' },
    { name: 'A propos', href: '#apropos' },
    { name: 'Bibliothèque', href: '#bibliotheque' },
    { name: 'Connexion', href: '/login' },
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
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
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
              isScrolled ? "text-slate-900" : "text-white"
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
        isActive ? "text-blue-600" : (isScrolled ? "text-slate-900" : "text-white")
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

            <Link
              href="/register"
              className={cn(
                "px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer",
                isScrolled 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
                  : "bg-white text-blue-600 hover:bg-slate-50"
              )}
            >
              S&apos;inscrire
            </Link>
          </div>

          {/* BOUTON MOBILE */}
          <button 
            className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-slate-900 h-8 w-8" />
            ) : (
              <Menu className={cn("h-8 w-8 transition-colors", isScrolled ? "text-slate-900" : "text-white")} />
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
              href="/register" 
              className="mt-4 bg-blue-600 text-white text-center py-4 rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}