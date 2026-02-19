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

// Interface stricte pour le payload (on remplace Record<string, any>)
interface UserUpdatePayload {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  roles: string[];
  isVerified: boolean;
  password?: string; // Optionnel : envoyé seulement si rempli
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
        setInitialData({
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          telephone: res.data.telephone || '',
          roles: res.data.roles,
          verified: res.data.verified ?? res.data.isVerified ?? false,
          password: '' 
        });
      })
      .catch(() => toast.error("Erreur de chargement de l'utilisateur"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleUpdate = async (formData: UserFormData) => {
    setUpdating(true);
    
    // Construction du payload typé
    const payload: UserUpdatePayload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      roles: formData.roles,
      isVerified: formData.verified,
    };

    // On n'ajoute le password que s'il y a une valeur saisie
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
      toast.error(error.response?.data?.['hydra:description'] || "Erreur lors de la modification");
    } finally {
      setUpdating(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col justify-center items-center p-20 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-bold italic uppercase tracking-tighter">Récupération des données...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      <Link href="/admin/utilisateurs" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold group transition-colors">
        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> 
        RETOUR AU DASHBOARD
      </Link>
      
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
        <header className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            Modifier l&apos;utilisateur
          </h1>
          <p className="text-gray-400 font-medium mt-2">ID: {id}</p>
        </header>

        {initialData && <UserForm initialData={initialData} onSubmit={handleUpdate} isLoading={updating} />}
      </div>
    </div>
  );
}