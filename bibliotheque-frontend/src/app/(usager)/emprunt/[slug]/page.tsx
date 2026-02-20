'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Loader2, 
  Calendar, 
  BookOpen, 
  ArrowLeft, 
  Send, 
  Layers, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Hash
} from 'lucide-react';
import Navbar from '@/components/user/NavbarUsager';
import axiosInstance from '@/lib/axios';
import axios, { AxiosError } from 'axios';

interface LivreData {
  id: number;
  titre: string;
  auteur: string;
  genre: string;
  annee_publication: number;
  image: string;
  description: string;
  nb_pages: number;
  langue: string;
  nb_exemplaires: number;
}

interface ApiUserResponse {
  'hydra:member': Array<{
    id: number;
    email: string;
  }>;
}

interface ApiError {
  detail?: string;
  message?: string;
}

interface UtilisateurMember {
  "@id": string;
  id: number;
  email: string;
}

interface UtilisateurCollection {
  "hydra:member": UtilisateurMember[];
}

interface Utilisateur {
  id: number;
  email: string;
}

interface HydraResponse {
  "hydra:member": Utilisateur[];
  "hydra:totalItems"?: number;
}

interface DecodedToken {
  username?: string;
  email?: string;
  roles?: string[];
  exp?: number;
}

interface ApiError {
  detail?: string;
  title?: string;
}

interface ApiError {
  detail?: string;
}

export default function FormulaireEmprunt() {
  const params = useParams();
  const router = useRouter();
  
  const [livre, setLivre] = useState<LivreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quantite, setQuantite] = useState(1);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const decodeId = (slug: string | string[] | undefined): string | null => {
    if (!slug || Array.isArray(slug)) return null;
    try {
      return atob(slug).replace('lcl-book-', '');
    } catch (e) {
      return null;
    }
  };

  const bookId = decodeId(params?.slug);

  useEffect(() => {
    if (!bookId) {
      router.push('/recherche');
      return;
    }

    const fetchLivre = async () => {
      try {
        const res = await axiosInstance.get<LivreData>(`/livres/${bookId}`);
        setLivre(res.data);
      } catch (err) {
        console.error("Erreur récupération livre:", err);
        router.push('/recherche');
      } finally {
        setLoading(false);
      }
    };

    fetchLivre();
  }, [bookId, router]);

  const [dates, setDates] = useState({ debut: '', fin: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    setStatusMsg({ type: 'error', text: "Session manquante." });
    return;
  }

  setSubmitting(true);
  setStatusMsg(null);

  try {
    // 1. Décodage du Token
    const payloadBase64 = token.split('.')[1];
    const decodedToken = JSON.parse(atob(payloadBase64)) as DecodedToken;
    const userEmail = decodedToken.username || decodedToken.email;

    // 2. Appel API avec Header explicite pour éviter les surprises
    const response = await axiosInstance.get('/utilisateurs', {
      headers: { 'Accept': 'application/ld+json' }
    });
    
    // 3. Extraction ultra-flexible des données
    // On cherche dans hydra:member, sinon dans member, sinon on prend le body direct
    const rawData = response.data;
    const membres = rawData["hydra:member"] || rawData["member"] || (Array.isArray(rawData) ? rawData : null);

    if (!membres || !Array.isArray(membres)) {
      console.error("Structure reçue inconnue :", rawData);
      throw new Error("Le format de réponse de l'API est invalide.");
    }

    // 4. Recherche de l'utilisateur
    const currentUser = membres.find((u: Utilisateur) => u.email === userEmail);

    if (!currentUser) {
      throw new Error(`Utilisateur ${userEmail} non trouvé dans la liste.`);
    }

    // 5. Envoi du POST
    const payload = {
      livre: `/api/livres/${bookId}`,
      usager: `/api/utilisateurs/${currentUser.id}`,
      dateDebut: dates.debut,
      dateFinPrevue: dates.fin,
      nbExemplaires: quantite,
      accordee: null
    };

    await axiosInstance.post('/emprunts', payload);
    
    setStatusMsg({ type: 'success', text: "Demande enregistrée !" });
    setTimeout(() => router.push('/dashboard'), 2000);

  } catch (err) {
    let errorMsg = "Erreur système.";
    if (axios.isAxiosError<ApiError>(err)) {
      errorMsg = err.response?.data?.detail || err.message;
    } else if (err instanceof Error) {
      errorMsg = err.message;
    }
    setStatusMsg({ type: 'error', text: errorMsg });
  } finally {
    setSubmitting(false);
  }
};

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500 font-bold animate-pulse">Préparation de votre lecture...</p>
      </div>
    </div>
  );

  if (!livre) return null;

  return (
    <div className="min-h-screen flex bg-white">
      {/* --- SECTION GAUCHE : VISUEL DU LIVRE (STYLE REGISTER) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <Image 
          src={livre.image} 
          alt={livre.titre} 
          fill 
          className="object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between text-white">
          <Link href="/recherche" className="flex items-center gap-2 group w-fit">
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-2" />
            <span className="text-sm font-bold uppercase tracking-widest">Retour au catalogue</span>
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                {livre.genre}
              </span>
              <h1 className="text-6xl font-black leading-tight tracking-tighter">
                {livre.titre}
              </h1>
              <p className="text-2xl text-slate-300 font-light italic">par {livre.auteur}</p>
            </div>

            <p className="text-slate-400 text-lg max-w-xl leading-relaxed line-clamp-4">
              {livre.description}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Globe className="text-blue-500 h-5 w-5" /> 
                <span className="text-sm font-medium text-slate-300">Langue: {livre.langue}</span>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="text-blue-500 h-5 w-5" /> 
                <span className="text-sm font-medium text-slate-300">{livre.nb_pages} pages</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">
            <div className="h-[1px] w-12 bg-slate-700" />
            <span>Le Coin Lecture • {livre.annee_publication}</span>
          </div>
        </div>
      </div>

      {/* --- SECTION DROITE : FORMULAIRE D'EMPRUNT --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50/50 mt-16 lg:mt-0">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Confirmer l&apos;emprunt</h2>
            <p className="text-slate-500 font-medium">Une fois validée, vous pourrez récupérer votre ouvrage.</p>
          </div>

          {/* MESSAGES D'ÉTAT */}
          {statusMsg && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {statusMsg.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              <span className="text-sm font-bold">{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Champ Quantité */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 ml-1">Combien d&apos;exemplaires ?</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="number" 
                  min="1" 
                  max={livre.nb_exemplaires}
                  value={quantite}
                  onChange={(e) => setQuantite(parseInt(e.target.value))}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700 shadow-sm font-bold"
                  required 
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">
                Stock disponible : {livre.nb_exemplaires} unité(s)
              </p>
            </div>

            {/* Récapitulatif Date */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 ml-1">Date de réservation</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  disabled 
                  value={new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle2 size={16} />
                <span className="text-xs font-black uppercase">Validation Admin requise</span>
              </div>
              <p className="text-xs text-blue-600/80 leading-relaxed font-medium">
                En cliquant sur confirmer, votre demande est envoyée à l&apos;administration. Vous serez notifié dès que l&apos;emprunt sera accordé.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-700 uppercase">Date de début</label>
    <input 
      type="date" 
      required
      className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 font-bold"
      onChange={(e) => setDates({...dates, debut: e.target.value})}
    />
  </div>
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-700 uppercase">Retour prévu</label>
    <input 
      type="date" 
      required
      className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 font-bold"
      onChange={(e) => setDates({...dates, fin: e.target.value})}
    />
  </div>
</div>

            <button 
              type="submit" 
              disabled={submitting || livre.nb_exemplaires === 0}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>Confirmer ma demande <Send size={16} /></>
              )}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-slate-400 text-xs font-medium">
              <Link href="/recharche" className="text-blue-600 font-bold hover:underline">Retour Bibliothèque</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}