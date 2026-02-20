'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import LivreForm from '@/components/admin/LivreForm';
import { ILivre } from '@/types/livre';
import axios from 'axios'; 


export default function CreateLivrePage() {
  const router = useRouter();
  
  // États pour la gestion des retours utilisateur
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  
const handleCreate = async (data: ILivre) => {
  setSubmitting(true);
  try {
const formData = new FormData();
formData.append('titre', data.titre);
formData.append('auteur', data.auteur); 
formData.append('genre', data.genre || '');
formData.append('description', data.description || '');
formData.append('annee_publication', String(data.annee_publication));
formData.append('nb_pages', String(data.nb_pages));
formData.append('langue', data.langue || 'Français');
formData.append('nb_exemplaires', String(data.nb_exemplaires));
formData.append('estDisponible', String(data.estDisponible));

    // Gestion de l'image
    if (data.image && data.image.startsWith('data:image')) {
      const res = await fetch(data.image);
      const blob = await res.blob();
      // On l'appelle bien 'image_file' pour correspondre au Controller
      formData.append('image_file', blob, 'image.jpg');
    }

    await axios.post('http://localhost:8000/api/livres/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setMessage({ type: 'success', text: "L'ouvrage est créé !" });
    setTimeout(() => router.push('/admin/livres'), 1500);
  } catch (err) {
    console.error("Erreur Axios:", err);
    setMessage({ type: 'error', text: "Erreur serveur lors de l'envoi." });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      {/* Navigation & Titre */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Ajouter un ouvrage
          </h1>
          <p className="text-gray-500">Remplissez les informations pour enrichir la bibliothèque.</p>
        </div>
      </div>

      {/* Zone de Messages Flash */}
      {message && (
        <div className={`flex items-center gap-3 p-5 rounded-2xl border animate-in slide-in-from-top-4 duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-red-50 border-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{message.text}</p>
        </div>
      )}

      {/* Formulaire */}
      <div className={submitting ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
        <LivreForm onSubmit={handleCreate} isSubmitting={submitting} />
      </div>

      {/* Overlay de chargement pendant la création */}
      {submitting && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="font-black text-gray-800">Création en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
}