'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Trash2, Mail, 
  Phone, Shield, User, CheckCircle2, 
  CircleDashed, BookOpen, Loader2, Fingerprint 
} from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  roles: string[];
  telephone?: string;
  verified: boolean;
  emprunts: string[];
}

export default function DetailUtilisateur({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/utilisateurs/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const deleteUser = async () => {
    if (!user || !confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/utilisateurs/${id}`);
      router.push('/admin/utilisateurs?deleted=true');
    } catch (err) {
      setLoading(false);
      alert("Erreur de suppression.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-black" size={40} />
      <p className="text-sm uppercase tracking-widest font-bold">Chargement</p>
    </div>
  );

  if (!user) return <div className="p-20 text-center font-bold">Utilisateur introuvable.</div>;

  const isAdmin = user.roles.includes('ROLE_ADMIN');

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* HEADER / ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <Link href="/admin/utilisateurs" className="group flex items-center gap-2 text-black hover:text-black transition-colors text-xs font-bold uppercase tracking-widest mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour
          </Link>
          <h1 className="text-6xl font-black tracking-tighter text-black uppercase leading-none">
            {user.prenom}<br />{user.nom}
          </h1>
        </div>

        <div className="flex gap-2">
          <Link 
            href={`/admin/utilisateurs/edit/${id}`}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase hover:bg-gray-800 transition-all"
          >
            <Edit size={14} /> Modifier
          </Link>
          <button 
            onClick={deleteUser}
            className="flex items-center gap-2 border border-gray-200 text-black px-6 py-3 rounded-full text-xs font-bold uppercase hover:border-red-500 hover:text-red-500 transition-all cursor-pointer"
          >
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* STATUTS (Gaucher) */}
        <div className="md:col-span-4 space-y-4">
            
            <div className="p-6 border border-gray-100 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-black">Vérification</span>
                    {user.verified ? <CheckCircle2 size={16} className="text-black" /> : <CircleDashed size={16} className="text-black" />}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-black">Rôle</span>
                    <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
                        {isAdmin ? 'Admin' : 'Membre'}
                    </span>
                </div>
            </div>
        </div>

        {/* DETAILS (Droitier) */}
        <div className="md:col-span-8 space-y-10">
          
          <section className="grid grid-cols-1 gap-8">
            <div className="group">
                <label className="text-[10px] font-black uppercase text-black tracking-widest block mb-2">Adresse Email</label>
                <div className="flex items-center gap-3 text-xl font-bold border-b border-transparent group-hover:border-gray-100 pb-2 transition-all text-black">
                    <Mail size={18} className="text-black" />
                    {user.email}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <label className="text-[10px] font-black uppercase text-black tracking-widest block mb-2">Téléphone</label>
                    <div className="flex items-center gap-3 text-lg font-bold text-black">
                        <Phone size={18} className="text-black" />
                        {user.telephone || "—"}
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-black tracking-widest block mb-2">ID</label>
                    <div className="flex items-center gap-3 text-lg font-bold text-black">
                        <Fingerprint size={18} className="text-black" />
                        #{user.id}
                    </div>
                </div>
            </div>
          </section>

          {/* CARD EMPRUNTS */}
          <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <BookOpen size={24} className="text-black" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-black tracking-widest">Activité</p>
                    <p className="text-xl font-black text-black">{user.emprunts.length} Livres empruntés</p>
                </div>
            </div>
            <div className="hidden sm:block text-black">
                <Link href="#" className="text-xs font-bold underline decoration-2 underline-offset-4 hover:text-gray-600" >Voir l&apos;historique</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}