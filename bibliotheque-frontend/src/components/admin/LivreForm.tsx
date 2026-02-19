'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Save, ImageIcon, BookOpen, Hash, Upload, CheckCircle2, Circle } from 'lucide-react';
import { ILivre } from '@/types/livre';

interface LivreFormProps {
  initialData?: ILivre;
  onSubmit: (data: ILivre) => void;
  isSubmitting: boolean;
}

export default function LivreForm({ initialData, onSubmit, isSubmitting }: LivreFormProps) {
  const [formData, setFormData] = useState<ILivre>(initialData || {
    titre: '', auteur: '', genre: '', description: '',
    annee_publication: new Date().getFullYear(),
    nb_pages: 0, langue: 'Français', image: '', 
    nb_exemplaires: 1, estDisponible: true
  });

  const [imagePreview, setImagePreview] = useState<string>(formData.image || '');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Optionnel: Limite 2Mo
        alert("Image trop lourde !");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDispo = () => {
    setFormData(prev => ({ ...prev, estDisponible: !prev.estDisponible }));
  };

  return (
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(formData); }} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Section GAUCHE : Infos Générales */}
        <div className="lg:col-span-2 space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 border-b pb-4">
            <BookOpen size={22} className="text-blue-600"/> Contenu de l&apos;ouvrage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Titre du livre" name="titre" value={formData.titre} onChange={handleChange} required />
            <InputField label="Auteur" name="auteur" value={formData.auteur} onChange={handleChange} required />
          </div>
            
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Genre" name="genre" value={formData.genre} onChange={handleChange} />
            <InputField label="Langue" name="langue" value={formData.langue} onChange={handleChange} />
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Disponibilité</label>
              <button 
                type="button"
                onClick={toggleDispo}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all font-bold ${
                  formData.estDisponible 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {formData.estDisponible ? <CheckCircle2 size={18}/> : <Circle size={18}/>}
                {formData.estDisponible ? 'Disponible' : 'Indisponible'}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Description / Résumé</label>
            <textarea 
              name="description" 
              rows={5}
              value={formData.description} 
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-black"
              placeholder="Donnez la description du livre"
            />
          </div>
        </div>

        {/* Section DROITE : Technique & Image */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
             <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <Hash size={20} className="text-blue-600"/> Fiche Technique
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Année" name="annee_publication" type="number" value={formData.annee_publication} onChange={handleChange} />
              <InputField label="Pages" name="nb_pages" type="number" value={formData.nb_pages} onChange={handleChange} />
            </div>
            <InputField label="Exemplaires" name="nb_exemplaires" type="number" value={formData.nb_exemplaires} onChange={handleChange} />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <ImageIcon size={20} className="text-blue-600"/> Couverture
            </h2>
            
            <div className="relative group cursor-pointer">
              <div className={`aspect-[3/4] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                imagePreview ? 'border-blue-200' : 'border-gray-200 hover:border-blue-400'
              }`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-xs font-bold text-gray-400 uppercase">Cliquez pour uploader</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => window.history.back()} 
          className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all cursor-pointer"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Envoi...' : <><Save size={20}/> Créer l&apos;ouvrage</>}
        </button>
      </div>
    </form>
  );
}

// Typage strict des props pour InputField
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function InputField({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-black uppercase text-gray-400 ml-1">{label}</label>
      <input 
        {...props}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-700"
      />
    </div>
  );
}