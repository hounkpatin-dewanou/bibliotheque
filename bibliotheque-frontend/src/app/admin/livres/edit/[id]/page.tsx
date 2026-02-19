'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import LivreForm from '@/components/admin/LivreForm';
import { ILivre } from '@/types/livre';

export default function EditLivre({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [livre, setLivre] = useState<ILivre | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // 1. Charger les données et harmoniser les champs pour le formulaire
  useEffect(() => {
    const fetchLivre = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/livres/${id}`);
        const data = res.data;
        
        setLivre({
          ...data,
          // Harmonisation pour que LivreForm lise bien les valeurs
          annee_publication: data.annee_publication ?? data.anneePublication,
          nb_pages: data.nb_pages ?? data.nbPages,
          nb_exemplaires: data.nb_exemplaires ?? data.nbExemplaires,
          image: data.image || ''
        });
      } catch {
        setNotification({ type: 'error', msg: "Livre introuvable dans la base." });
      } finally {
        setLoading(false);
      }
    };
    fetchLivre();
  }, [id]);

  // 2. Soumission avec conversion pour le Backend Symfony (API Platform)
  const handleSubmit = async (updatedData: ILivre) => {
    try {
      setIsSubmitting(true);
      setNotification(null);

      // On prépare un payload "universel" (CamelCase pour Symfony / API Platform)
      const payload = {
        titre: updatedData.titre,
        auteur: updatedData.auteur,
        genre: updatedData.genre,
        description: updatedData.description,
        langue: updatedData.langue,
        estDisponible: updatedData.estDisponible,
        image: updatedData.image, // Base64 si modifiée, URL si inchangée
        // Champs critiques qui ne passaient pas :
        anneePublication: updatedData.annee_publication,
        nbPages: updatedData.nb_pages,
        nbExemplaires: updatedData.nb_exemplaires
      };

      await axiosInstance.patch(`/livres/${id}`, payload, {
        headers: { 
          'Content-Type': 'application/merge-patch+json',
          'Accept': 'application/ld+json'
        }
      });
      
      setNotification({ type: 'success', msg: "Modifications enregistrées avec succès !" });
      
      setTimeout(() => {
        router.push('/admin/livres');
        router.refresh();
      }, 1500);

    } catch (err: unknown) {
      let errorMsg = "Erreur de connexion au serveur.";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ 'hydra:description'?: string }>;
        errorMsg = axiosError.response?.data?.['hydra:description'] || axiosError.message;
      }
      setNotification({ type: 'error', msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-500 font-medium italic">Synchronisation des données...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed top-10 right-10 z-[100] flex items-center gap-4 px-8 py-5 rounded-3xl shadow-2xl border-2 transform transition-all animate-in slide-in-from-top-10 ${
          notification.type === 'success' 
          ? 'bg-white border-emerald-500 text-emerald-700' 
          : 'bg-white border-red-500 text-red-700'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {notification.type === 'success' ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg">{notification.type === 'success' ? 'Succès !' : 'Erreur'}</span>
            <p className="font-medium text-sm opacity-80">{notification.msg}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/admin/livres" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all font-bold group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Gestion des stocks
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-100">
            <Edit3 size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Édition</h1>
            <p className="text-gray-500 font-medium italic">ID de référence : <span className="text-blue-600 font-mono">#{id}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[3rem] border-4 border-gray-50 shadow-inner">
        {livre && (
          <LivreForm 
            initialData={livre} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        )}
      </div>
    </div>
  );
}