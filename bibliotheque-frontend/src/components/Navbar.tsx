'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from "framer-motion";

/**
 * Utilitaire pour fusionner les classes Tailwind proprement
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('accueil');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 1. GESTION DU SCROLL : On détecte la position pour le style de la barre
  useEffect(() => {
    const handleScroll = () => {
      // Si on a scrollé de plus de 20px, on active l'état "scrolled"
      setIsScrolled(window.scrollY > 20);
    };
    
    // On l'exécute une fois au montage pour éviter le bug du refresh
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. OBSERVATEUR DE SECTIONS : Pour allumer les liens au scroll
  useEffect(() => {
    const sections = ['accueil', 'apropos', 'bibliotheque'];
    const observerOptions = { root: null, rootMargin: '-40% 0px', threshold: 0 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 3. LOCK DU SCROLL : Empêche de scroller la page quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'À propos', href: '#apropos' },
    { name: 'Bibliothèque', href: '#bibliotheque' },
    { name: 'Connexion', href: '/login' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4',
          // Correction du fond : On ajoute un backdrop-blur pour la modernité
          isScrolled 
            ? 'bg-white backdrop-blur-md shadow-sm py-3 border-b border-slate-100' 
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="relative h-10 w-10 md:h-12 md:w-12"
            >
              <Image 
                src="/logo_wbg.png" 
                alt="Le Coin Lecture" 
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <span className={cn(
              "font-black text-xl md:text-2xl tracking-tighter transition-colors duration-300",
              isScrolled ? "text-slate-900" : "text-white"
            )}>
              Le Coin Lecture
            </span>
          </Link>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group relative text-white font-bold tracking-widest transition-colors duration-300",
                    isActive ? "text-blue-600" : (isScrolled ? "text-slate-600" : "text-white")
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-[2px] bg-blue-600 transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              );
            })}

            <Link
              href="/register"
              className={cn(
                "px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer rounded-full",
                isScrolled 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" 
                  : "bg-white text-blue-600 hover:shadow-white/20 hover:shadow-xl"
              )}
            >
              S&apos;inscrire
            </Link>
          </div>

          {/* TRIGGER MOBILE - On force le texte en noir et une position fixe quand c'est ouvert */}
<button 
  className={cn(
    "md:hidden p-2 transition-all duration-300",
    isMobileMenuOpen ? "fixed right-6 top-6 z-[100] text-slate-900" : "relative z-[70]"
  )}
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
>
  {isMobileMenuOpen 
    ? <X className="h-9 w-9" /> 
    : <Menu className={cn("h-8 w-8", isScrolled ? "text-slate-900" : "text-white")} />
  }
</button>
        </div>
      </nav>

      {/* MENU MOBILE MODERNE AVEC ANIMATION */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            
            {/* Panneau latéral */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[85%] bg-white p-8 pt-24 shadow-2xl flex flex-col"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between group py-4 border-b border-slate-50"
                    >
                      <span className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                        {link.name}
                      </span>
                      <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-auto space-y-6"
              >
                <Link 
                  href="/register"
                  className="block w-full py-4 bg-blue-600 text-white text-center rounded-2xl font-bold text-lg shadow-xl shadow-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Créer un compte
                </Link>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" /> Plateforme sécurisée HDH Tech
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}