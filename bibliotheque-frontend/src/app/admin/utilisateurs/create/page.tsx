'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import UserForm, { UserFormData } from '@/components/admin/UserForm';
import { toast, Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';

interface ApiPlatformError {
  'hydra:description'?: string;
}

// On définit une interface pour le payload de mise à jour
// Toutes les propriétés sont optionnelles pour le PATCH
interface UserUpdatePayload {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  roles?: string[];
  isVerified?: boolean;
  password?: string;
}

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [initialData, setInitialData] = useState<UserFormData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/utilisateurs/${id}`)
      .then(res => {
        // Typage strict ici
        const data = res.data;
        setInitialData({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone || '',
          roles: data.roles,
          verified: data.verified ?? data.isVerified ?? false,
          password: '' 
        });
      })
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleUpdate = async (formData: UserFormData) => {
    setUpdating(true);
    
    // Utilisation de l'interface spécifique 
    const payload: UserUpdatePayload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      roles: formData.roles,
      isVerified: formData.verified,
    };

    // Ajout conditionnel du mot de passe
    if (formData.password && formData.password.trim() !== '') {
      payload.password = formData.password;
    }

    try {
      await axiosInstance.patch(`/utilisateurs/${id}`, payload, {
        headers: { 'Content-Type': 'application/merge-patch+json' }
      });
      
      toast.success("Profil mis à jour avec succès !");
      setTimeout(() => router.push('/admin/utilisateurs'), 1500);
    } catch (err) {
      const error = err as AxiosError<ApiPlatformError>;
      toast.error(error.response?.data?.['hydra:description'] || "Erreur lors de la modif");
    } finally {
      setUpdating(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-gray-400 animate-pulse font-bold uppercase tracking-widest text-xs">Chargement</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      <Link href="/admin/utilisateurs" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold group transition-colors">
        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> 
        RETOUR À LA LISTE
      </Link>
      
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
        <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase italic tracking-tighter">
          Modifier <span className="text-blue-600">le membre</span>
        </h1>
        {initialData && <UserForm initialData={initialData} onSubmit={handleUpdate} isLoading={updating} />}
      </div>
    </div>
  );
}