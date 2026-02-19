interface StatsProps {
  stats: { nbLivres: number; nbUtilisateurs: number; nbEmpruntsEnCours: number };
}

export default function StatsSection({ stats }: StatsProps) {
  const data = [
    { label: "Livres", value: stats.nbLivres, color: "text-blue-600" },
    { label: "Membres", value: stats.nbUtilisateurs, color: "text-amber-600" },
    { label: "Emprunts", value: stats.nbEmpruntsEnCours, color: "text-emerald-600" },
  ];

  return (
    <section id="bibliotheque" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {data.map((item, index) => (
          <div key={index} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white text-center">
            <p className={`text-6xl font-black ${item.color} mb-2`}>{item.value}</p>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}