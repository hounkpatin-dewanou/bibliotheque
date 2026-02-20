'use client';

import { useState } from 'react';
import { 
  User, Mail, Phone, Shield, 
  CheckCircle2, Save, Loader2 
} from 'lucide-react';

export interface UserFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  roles: string[];
  verified: boolean;
  password?: string;
}

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  isLoading: boolean;
}

export default function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(initialData || {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    roles: ['ROLE_USER'],
    verified: false,
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, roles: [e.target.value] }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PRÉNOM */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1  uppercase tracking-wider">Prénom</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              required
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Ex: Jean"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-black"
            />
          </div>
        </div>

        {/* NOM */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1  uppercase tracking-wider">Nom</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              required
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: DUPONT"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-black"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1  uppercase tracking-wider">Email </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jean.dupont@exemple.com"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-black"
            />
          </div>
        </div>

        {/* TÉLÉPHONE */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1  uppercase tracking-wider">Téléphone</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="+229 00 00 00 00 00"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-black"
            />
          </div>
        </div>

        {/* MOT DE PASSE (Optionnel en edit) */}
        {!initialData && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 ml-1  uppercase tracking-wider">Mot de passe</label>
            <input 
              required={!initialData}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-black"
              placeholder='Entrez le mot de passe pour cet utilisateur'
            />
          </div>
        )}

        {/* RÔLE */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1  uppercase tracking-wider">Rôle</label>
          <div className="relative group">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors text-black" size={18} />
            <select 
              name="roles"
              value={formData.roles[0]}
              onChange={handleRoleChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer text-black"
            >
              <option value="ROLE_USER">Utilisateur</option>
              <option value="ROLE_ADMIN">Administrateur</option>
            </select>
          </div>
        </div>

        {/* VÉRIFIÉ */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl mt-auto">
          <input 
            type="checkbox"
            name="verified"
            id="verified"
            checked={formData.verified}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600 cursor-pointer text-black"
          />
          <label htmlFor="verified" className="text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-2">
            <CheckCircle2 size={18} className={formData.verified ? "text-emerald-500" : "text-gray-300"} />
            Compte vérifié
          </label>
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 className="animate-spin cursor-pointer" /> : <Save size={20} />}
          {initialData ? "Enregistrer les modifications" : "Créer l'utilisateur"}
        </button>
      </div>
    </form>
  );
}