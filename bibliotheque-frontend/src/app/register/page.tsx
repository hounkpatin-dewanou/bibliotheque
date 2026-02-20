'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatusMsg(null);

  if (formData.password !== formData.confirmPassword) {
    setStatusMsg({ type: 'error', text: "Les mots de passe ne correspondent pas." });
    return;
  }

  setIsLoading(true);
  try {
    const {...dataToSend } = formData;
    
    // On appelle /api/register (une fois que Symfony le reconnaîtra)
    await axiosInstance.post('/register', dataToSend);
    
    setStatusMsg({ type: 'success', text: "Inscription réussie ! Un email de validation vous a été envoyé." });
    
    // On ne redirige pas tout de suite pour qu'il puisse lire le message de succès
    setTimeout(() => {
  router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
}, 2000);

  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error("Erreur d'inscription", error);
    
    // Message élégant selon l'erreur
    const errorText = error.response?.status === 404 
      ? "Le serveur d'inscription est introuvable (404). Vérifiez le Backend."
      : (error.response?.data?.message || "Une erreur est survenue.");
      
    setStatusMsg({ type: 'error', text: errorText });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex bg-white">
      {/* SECTION GAUCHE : LE VISUEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <Image 
          src="/register-bg.jpg" 
          alt="Bibliothèque inspirante" 
          fill 
          className="object-cover opacity-40 scale-105 hover:scale-100 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between text-white">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/logo_wbg.png" 
                alt="Le Coin Lecture" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tighter">Le Coin Lecture</span>
          </Link>

          <div className="space-y-6">
            <blockquote className="text-5xl font-extralight leading-tight italic">
              &quot;La lecture est une amitié.&quot;
            </blockquote>
            <div className="flex items-center gap-4 text-blue-400">
              <div className="h-[1px] w-12 bg-blue-400" />
              <p className="font-bold uppercase tracking-widest text-sm text-white">Marcel Proust</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-blue-500 h-5 w-5" /> Accès illimité au catalogue
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-blue-500 h-5 w-5" /> Réservations prioritaires
            </div>
          </div>
        </div>
      </div>

      {/* SECTION DROITE : LE FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50/50">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Créer un compte</h2>
            <p className="text-slate-500 font-medium">Rejoignez notre communauté de lecteurs passionnés.</p>
          </div>

          {/* ZONE DE MESSAGE D'ERREUR/SUCCÈS ÉLÉGANTE */}
          {statusMsg && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {statusMsg.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              <span className="text-sm font-bold">{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Prénom</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Jean"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700 shadow-sm"
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nom</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Dupont"
                    className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700 shadow-sm"
                    onChange={(e) => setFormData({...formData, nom: e.target.value})} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Adresse Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="email" 
                  placeholder="nom@exemple.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700 shadow-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700 shadow-sm"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirmation</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-700 shadow-sm"
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                    required 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>Inscription en cours...</>
              ) : (
                <>S&apos;inscrire</>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Déjà inscrit ? <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors underline-offset-4 hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}