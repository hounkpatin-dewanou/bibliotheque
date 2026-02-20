'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Trash2, Mail, 
  Calendar, Clock, Book, User, CheckCircle2, 
  CircleDashed, Loader2, Fingerprint, XCircle,
  Hash, BookOpen, Info,
  ArrowRight
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast, Toaster } from 'react-hot-toast';

// --- TYPAGE ---
interface Livre {
  id: number;
  titre: string;
  auteur: string;
}

interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
}

interface Emprunt {
  id: number;
  dateDebut: string;
  dateFinPrevue: string;
  dateRetourEffective: string | null;
  nbExemplaires: number;
  accordee: boolean | null;
  usager: Utilisateur; // On va forcer l'objet complet
  livre: Livre;        // On va forcer l'objet complet
}

export default function DetailEmprunt({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [emprunt, setEmprunt] = useState<Emprunt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpruntComplet = async () => {
      try {
        setLoading(true);
        // 1. Récupérer l'emprunt
        const resEmp = await axiosInstance.get(`/emprunts/${id}`);
        const empData = resEmp.data;

        // 2. Extraire les IDs pour les jointures (si ce sont des IRIs ou des objets partiels)
        const uId = typeof empData.usager === 'string' ? empData.usager.split('/').pop() : empData.usager.id;
        const lId = typeof empData.livre === 'string' ? empData.livre.split('/').pop() : empData.livre.id;

        // 3. Récupérer les détails de l'usager et du livre en parallèle
        const [resUser, resLivre] = await Promise.all([
          axiosInstance.get(`/utilisateurs/${uId}`),
          axiosInstance.get(`/livres/${lId}`)
        ]);

        setEmprunt({
          ...empData,
          usager: resUser.data,
          livre: resLivre.data
        });
      } catch (err) {
        console.error("Erreur de récupération:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpruntComplet();
  }, [id]);

  const deleteEmprunt = async () => {
  if (!confirm(`Voulez-vous vraiment supprimer cet enregistrement d'emprunt ?`)) return;
  
  try {
    setLoading(true); // Active l'overlay de chargement
    await axiosInstance.delete(`/emprunts/${id}`);
    
    toast.success("ARCHIVE SUPPRIMÉE");
    
    // On attend un peu que l'utilisateur voit le toast avant de rediriger
    setTimeout(() => {
      router.push('/admin/emprunts');
    }, 1000);
    
  } catch (err) {
    setLoading(false);
    toast.error("ERREUR : Impossible de supprimer ce dossier");
  }
};

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-black" size={40} />
      <p className="text-sm uppercase tracking-widest font-bold text-black">Analyse du registre</p>
    </div>
  );

  if (!emprunt) return <div className="p-20 text-center font-bold">Emprunt introuvable.</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      {/* HEADER / ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <Link href="/admin/emprunts" className="group flex items-center gap-2 text-black hover:text-black transition-colors text-xs font-bold uppercase tracking-widest mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Liste des emprunts
          </Link>
          <div className="flex items-center gap-3 mb-2">
             <span className="bg-black text-white text-[10px] px-2 py-1 rounded font-black uppercase">Fiche Emprunt</span>
             <span className="text-gray-400 font-bold text-sm">#{emprunt.id}</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-black uppercase leading-tight">
            Détails de<br />l&apos;opération
          </h1>
        </div>

        <div className="flex gap-2">
          <Link 
            href={`/admin/emprunts/edit/${id}`}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase hover:bg-gray-800 transition-all shadow-lg"
          >
            <Edit size={14} /> Gérer / Modifier
          </Link>
          <button 
            onClick={deleteEmprunt}
            className="flex items-center gap-2 border border-gray-200 text-black px-6 py-3 rounded-full text-xs font-bold uppercase hover:border-red-500 hover:text-red-500 transition-all cursor-pointer"
          >
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* COLONNE GAUCHE : STATUTS ET RÉSUMÉ */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest block text-black">État actuel</label>
               {emprunt.dateRetourEffective ? (
                 <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase text-xs">
                   <CheckCircle2 size={18} /> Livre retourné
                 </div>
               ) : emprunt.accordee === false ? (
                 <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs">
                   <XCircle size={18} /> Emprunt refusé
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-amber-600 font-bold uppercase text-xs">
                   <CircleDashed size={18} className="animate-spin-slow" /> En cours / Attente
                 </div>
               )}
            </div>

            <div className="pt-6 border-t border-gray-200 space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black  text-black uppercase">Validation</span>
                 <span className={`text-[10px] font-bold text-black px-2 py-1 rounded ${emprunt.accordee ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200'}`}>
                   {emprunt.accordee ? 'APPROUVÉ' : emprunt.accordee === false ? 'REFUSÉ' : 'EN ATTENTE'}
                 </span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase text-black">Exemplaires</span>
                 <span className="text-sm font-black text-black">{emprunt.nbExemplaires}</span>
               </div>
            </div>
          </div>

          <div className="p-6 border border-gray-100 rounded-[2rem] flex items-center gap-4">
            <div className="bg-black p-3 rounded-xl text-white">
               <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 text-black">Date de début</p>
              <p className="text-sm font-bold text-black">{new Date(emprunt.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : LES DEUX PARTIES (LIVRE ET USAGER) */}
        <div className="md:col-span-8 space-y-8">
          
          {/* SECTION LIVRE */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} className="text-black" />
                <h2 className="text-lg font-black uppercase tracking-tighter text-black">Ouvrage Concerné</h2>
             </div>
             <Link href={`/admin/livres/show/${emprunt.livre.id}`} className="group block p-8 border border-gray-100 rounded-[3rem] hover:border-black transition-all">
                <div className="flex justify-between items-start text-black">
                   <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1 text-black">Titre du livre</p>
                      <h3 className="text-2xl font-black group-hover:text-blue-600 transition-colors uppercase italic text-black">{emprunt.livre.titre}</h3>
                      <p className="text-gray-500 font-bold mt-1">par {emprunt.livre.auteur}</p>
                   </div>
                   <ArrowRight size={24} className="rotate-180 group-hover:opacity-100 transition-all" />
                </div>
             </Link>
          </section>

          {/* SECTION USAGER */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-black" />
                <h2 className="text-lg font-black uppercase tracking-tighter text-black">Information Lecteur</h2>
             </div>
             <Link href={`/admin/utilisateurs/show/${emprunt.usager.id}`} className="group block p-8 border border-gray-100 rounded-[3rem] hover:border-black transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1 text-black">Nom Complet</p>
                      <p className="text-xl font-black uppercase text-black">{emprunt.usager.prenom} {emprunt.usager.nom}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1 text-black">Contact Email</p>
                      <p className="text-black text-sm font-bold flex items-center gap-2"><Mail size={14}/> {emprunt.usager.email}</p>
                   </div>
                </div>
                <div className="mt-4 flex justify-end">
                   <span className="text-[10px] font-bold uppercase underline underline-offset-4 group-hover:text-blue-600 text-black">Voir la fiche profil complète</span>
                </div>
             </Link>
          </section>

          {/* DATES CLÉS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
             <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex flex-col justify-between h-32">
                <p className="text-[10px] font-black uppercase opacity-60">Retour prévu le</p>
                <div className="flex items-center justify-between">
                   <p className="text-xl font-black">{new Date(emprunt.dateFinPrevue).toLocaleDateString()}</p>
                   <Clock size={24} />
                </div>
             </div>
             <div className={`p-6 rounded-[2rem] flex flex-col justify-between h-32 border-2 ${emprunt.dateRetourEffective ? 'border-emerald-500 bg-emerald-50' : 'border-dashed border-gray-200 text-gray-300'}`}>
                <p className="text-[10px] font-black uppercase text-black">Retour effectif</p>
                <div className="flex items-center justify-between">
                   <p className="text-xl font-black text-black">{emprunt.dateRetourEffective ? new Date(emprunt.dateRetourEffective).toLocaleDateString() : "NON RENDU"}</p>
                   {emprunt.dateRetourEffective ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Info size={24} />}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}