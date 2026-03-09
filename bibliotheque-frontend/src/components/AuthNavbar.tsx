'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AuthNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  // Liens adaptés pour les pages de connexion/inscription
  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Bibliothèque', href: '/#bibliotheque' },
    { name: 'À propos', href: '/#apropos' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO - Toujours sombre ici car fond blanc */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10">
              <Image 
                src="/logo_wbg.png" 
                alt="Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tighter">
              Le Coin Lecture
            </span>
          </Link>

          {/* BOUTON RETOUR (Desktop) - Pour repartir à l'accueil facilement */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-[1px] bg-slate-200" />
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Retour au site
            </Link>
          </div>

          {/* TRIGGER MOBILE - La croix est gérée ici pour être toujours visible */}
          <button 
            className={cn(
              "md:hidden p-2 transition-all duration-300",
              isMobileMenuOpen ? "fixed right-6 top-6 z-[80] text-slate-900" : "relative z-[70] text-slate-900"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-9 w-9" /> : <Menu className="h-8 w-8" />}
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
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" /> Plateforme sécurisée HDH Tech
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer pour compenser la navbar fixed (évite que le contenu passe dessous) */}
      <div className="h-[73px]" />
    </>
  );
}