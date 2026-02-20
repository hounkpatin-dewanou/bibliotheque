'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react'; // Pour un bouton dynamique
import axiosInstance from '@/lib/axios';

export default function Page() {
  // 1. On déclare l'état des stats ICI
  const [stats, setStats] = useState({ 
    nbLivres: 0, 
    nbUtilisateurs: 0, 
    nbEmpruntsEnCours: 0 
  });
  // 2. On récupère les données depuis ton API Symfony
  useEffect(() => {
    axiosInstance.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Erreur API:", err));
  }, []);
  return (
    <main className="relative">
      <Navbar />

      <section id="accueil" className="relative h-screen w-full flex  items-center justify-center overflow-hidden">
  {/* Background Image optimisée avec Next.js */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/bibliotheque-bg.jpg"
      alt="Fond Le Coin Lecture"
      fill
      priority
      className="object-cover"
      quality={90}
    />
    {/* Overlay pour la lisibilité du texte */}
    <div className="absolute inset-0 bg-black/50" />
  </div>

  {/* Contenu Texte */}
  <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
      Le Coin Lecture
    </h1>
    
    <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
      Dans sa mission de valorisation du patrimoine littéraire et de démocratisation du savoir, 
      <span className="font-semibold text-white"> Le Coin Lecture</span> facilite l&apos;accès à une collection 
      diversifiée, garantissant une immersion totale au cœur de la connaissance et de la culture.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link 
        href="/register" 
        className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/20 cursor-pointer"
      >
        Inscription maintenant
      </Link>
    </div>
  </div>
      </section>

      <section id="apropos" className="min-h-[80vh] bg-white flex items-center">
  <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-stretch">
    
    {/* CÔTÉ GAUCHE : CONTENU TEXTUEL ÉPURÉ */}
    <div className="flex flex-col justify-center px-8 md:px-24 py-20 space-y-8 bg-gray-50/50">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
        À propos de nous
      </h2>
      
      <div className="space-y-6 text-slate-600 text-lg leading-relaxed max-w-xl">
        <p>
          Pour accompagner chaque lecteur dans sa quête de savoir, 
          <span className="font-bold text-slate-900 decoration-blue-500 decoration-2 underline-offset-4"> Le Coin Lecture </span> 
          déploie un portail numérique innovant garantissant l&apos;efficacité et la fluidité 
          dans l&apos;accès à nos ressources documentaires.
        </p>
        <p>
          Notre mission principale est la promotion de la culture et la valorisation du patrimoine 
          écrit. À travers cette plateforme, nous mettons à disposition une solution digitale 
          automatique permettant la consultation et la gestion simplifiée des emprunts pour tous nos usagers.
        </p>
        <p>
          Le deuxième pilier de notre engagement est la <strong>Bibliothèque Numérique Durable</strong>. 
          Elle offre un accès permanent aux œuvres majeures tout en assurant une préservation 
          optimale de la mémoire bibliographique pour les générations futures.
        </p>
      </div>
    </div>

    {/* CÔTÉ DROIT : IMAGE AVEC CARTE DE STATS CENTRALE (Style Image Fournie) */}
    <div className="relative min-h-[500px] w-full flex items-center justify-center">
      {/* Background Image avec un flou léger pour le focus */}
      <Image
        src="/apropos-bg.jpg"
        alt="Espace Le Coin Lecture"
        fill
        className="object-cover grayscale-[20%]"
      />
      
      {/* Overlay dégradé pour la profondeur */}
      <div className="absolute inset-0 bg-blue-900/10" />

      {/* CARTE STATISTIQUE CENTRALE TRANSPARENTE */}
<div className="relative z-10 w-full max-w-lg mx-auto px-6">
  <div className="bg-white/5 p-12 text-center backdrop-blur-md shadow-xl rounded-2xl border border-white/10">
    
    {/* Affichage des statistiques en colonnes ou ligne */}
    <div className="flex flex-col gap-10">
      
      {/* Stat 1 : Livres */}
      <div className="space-y-1">
        <p className="text-7xl font-black text-white leading-none tracking-tighter">
          {stats.nbLivres}
        </p>
        <p className="text-blue-300 font-bold uppercase tracking-[0.2em] text-sm">
          Livres
        </p>
      </div>

      {/* Séparateur discret */}
      <div className="h-[1px] w-1/3 bg-white/20 mx-auto" />

      {/* Stats secondaires : Utilisateurs et Emprunts */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-3xl font-bold text-white">{stats.nbUtilisateurs}</p>
          <p className="text-blue-200/70 text-xs uppercase font-semibold">Membres</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white">{stats.nbEmpruntsEnCours}</p>
          <p className="text-blue-200/70 text-xs uppercase font-semibold">Emprunts</p>
        </div>
      </div>

    </div>
  </div>
</div>
    </div>

  </div>
</section>
      
      {/* --- SECTION BIBLIOTHÈQUE --- */}
<section id="bibliotheque" className="min-h-screen bg-slate-50 py-24 px-6 md:px-12">
  <div className="max-w-7xl mx-auto space-y-16">
    
    {/* EN-TÊTE DE SECTION */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
          La Bibliothèque
        </h2>
        <p className="text-slate-500 text-lg max-w-md">
          Explorez notre fonds documentaire et trouvez votre prochaine lecture parmi des milliers d&apos;ouvrages.
        </p>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="relative w-full md:w-96 group">
        <input 
          type="text" 
          placeholder="Rechercher un titre, un auteur..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md text-slate-700"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* GRILLE DE LIVRES STATIQUE */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Tableau de données statiques pour les livres */}
  {[
    {
      id: "0001",
      title: "L'Enfant Noir",
      author: "Camara Laye",
      category: "Classique",
      image: "/book1.jpg", 
    },
    {
      id: "0002",
      title: "Sous l'orage",
      author: "Seydou Badian",
      category: "Roman",
      image: "/book2.jpg",
    },
    {
      id: "0003",
      title: "Une si longue lettre",
      author: "Mariama Bâ",
      category: "Littérature",
      image: "/book3.jpg",
    },
    {
      id: "0004",
      title: "Le Devoir de violence",
      author: "Yambo Ouologuem",
      category: "Histoire",
      image: "/book4.jpg",
    },
  ].map((book) => (
    <div 
      key={book.id} 
      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
    >
      {/* Zone Image */}
      <div className="relative h-80 w-full bg-slate-100">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge de disponibilité */}
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
          Disponible
        </div>
      </div>

      {/* Zone Infos */}
      <div className="p-6 space-y-3">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
          {book.category}
        </p>
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-slate-500 text-sm italic">
          Par {book.author}
        </p>
        
        <div className="pt-5 flex items-center justify-between border-t border-slate-50">
          <span className="text-[10px] text-slate-400 font-bold font-mono bg-slate-50 px-2 py-1 rounded">
            ID: #{book.id}
          </span>
          <button className="text-blue-600 font-extrabold text-xs uppercase tracking-tighter hover:text-blue-800 flex items-center gap-1 transition-all">
            Détails 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

    {/* MESSAGE SI VIDE (Optionnel) */}
    <div className="text-center py-12">
      <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors">
        Connectez-vous pour faire vos emprunts
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  </div>
</section>

{/* --- FOOTER FINAL SIMPLE --- */}
<footer className="bg-white border-t border-slate-100 py-12">
  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
    
    {/* LOGO & NOM */}
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110">
                    <Image 
                      src="/logo_wbg.png" 
                      alt="Le Coin Lecture" 
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
      <span className="font-bold text-slate-900 tracking-tight text-lg">
        Le Coin Lecture
      </span>
    </div>

    {/* COPYRIGHT CENTRAL */}
    <p className="text-slate-400 text-sm font-medium">
      © 2026 Le Coin Lecture. Tous droits réservés.
    </p>

    {/* LIENS SECONDAIRES */}
    <div className="flex gap-8 text-sm font-semibold text-slate-500">
      <a href="#" className="hover:text-blue-600 transition-colors cursor-pointer">Confidentialité</a>
      <a href="#" className="hover:text-blue-600 transition-colors cursor-pointer">Conditions</a>
    </div>
    
  </div>
</footer>
    </main>
  );
}