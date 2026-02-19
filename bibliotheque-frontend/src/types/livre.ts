export interface ILivre {
  id?: number;
  titre: string;
  auteur: string;
  genre: string;
  description: string;
  annee_publication: number;
  nb_pages: number;
  langue: string;
  image: string;
  nb_exemplaires: number;
  estDisponible: boolean;
}