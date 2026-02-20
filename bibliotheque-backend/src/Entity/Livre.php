<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\LivreRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LivreRepository::class)]
#[ApiResource( // Affichage des utilisateurs sur le serveur Swagger UI
    paginationEnabled: false,
    order: ['id' => 'DESC']    // <--- CELA METTRA "L'ANOMALIE" EN HAUT
)]
class Livre
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    private ?string $auteur = null;

    #[ORM\Column]
    private ?bool $estDisponible = null;

    /**
     * @var Collection<int, Emprunt>
     */
    #[ORM\OneToMany(targetEntity: Emprunt::class, mappedBy: 'livre')]
    private Collection $emprunts;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(length: 100)]
    private ?string $genre = null;

    #[ORM\Column]
    private ?int $annee_publication = null;

    #[ORM\Column]
    private ?int $nb_pages = null;

    #[ORM\Column(length: 50)]
    private ?string $langue = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\Column]
    private ?int $nb_exemplaires = null;

    // ... (garder les propriétés et le début de la classe)

    public function setAnneePublication(int $annee_publication): static
    {
        $this->annee_publication = $annee_publication;
        return $this;
    }

    // Alias pour éviter les erreurs de mapping si le front envoie "annee_publication"
    public function setAnnee_publication(int $annee_publication): static
    {
        return $this->setAnneePublication($annee_publication);
    }

    public function setNbPages(int $nb_pages): static
    {
        $this->nb_pages = $nb_pages;
        return $this;
    }

    // Alias pour "nb_pages"
    public function setNb_pages(int $nb_pages): static
    {
        return $this->setNbPages($nb_pages);
    }

    public function setImage(string $image): static
{
    // 1. Si c'est du Base64 (Nouvelle image sélectionnée)
    if (str_starts_with($image, 'data:image')) {

        // Chemin ABSOLU vers le dossier public du frontend
        // On remonte depuis src/Entity (3 niveaux : Entity -> src -> racine -> bibliotheque-frontend)
        $uploadDir = __DIR__ . '/../../../bibliotheque-frontend/public/images/livres/';

        // 2. GESTION DE L'EXTENSION
        preg_match('/data:image\/(?<extension>.*?);base64,(?<data>.*)/', $image, $match);
        $extension = $match['extension'] ?? 'jpg';
        $data = base64_decode($match['data']);

        // 3. NOMMAGE STRICT : livre + ID (ou 'temp' si nouvel objet sans ID encore)
        $fileName = 'livre' . ($this->id ?? 'new') . '.' . $extension;
        $fullPath = $uploadDir . $fileName;

        // 4. SUPPRESSION DE L'ANCIEN FICHIER
        // On supprime si le fichier existe déjà (même si l'extension est différente)
        if ($this->image) {
            $oldFileName = basename($this->image);
            $oldFilePath = $uploadDir . $oldFileName;
            if (file_exists($oldFilePath) && is_file($oldFilePath)) {
                unlink($oldFilePath);
            }
        }

        // 5. ENREGISTREMENT
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        file_put_contents($fullPath, $data);

        // Stockage du chemin relatif pour la DB
        $this->image = '/images/livres/' . $fileName;

    } else {
        // Si c'est une URL simple (pas de changement d'image), on garde la valeur actuelle
        $this->image = $image;
    }

    return $this;
}

    public function setNbExemplaires(int $nb_exemplaires): static
    {
        $this->nb_exemplaires = $nb_exemplaires;
        return $this;
    }

    // Alias pour "nb_exemplaires"
    public function setNb_exemplaires(int $nb_exemplaires): static
    {
        return $this->setNbExemplaires($nb_exemplaires);
    }

    public function __construct()
    {
        $this->emprunts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getAuteur(): ?string
    {
        return $this->auteur;
    }

    public function setAuteur(string $auteur): static
    {
        $this->auteur = $auteur;

        return $this;
    }

    public function isEstDisponible(): ?bool
    {
        return $this->estDisponible;
    }

    public function setEstDisponible(bool $estDisponible): static
    {
        $this->estDisponible = $estDisponible;

        return $this;
    }

    /**
     * @return Collection<int, Emprunt>
     */
    public function getEmprunts(): Collection
    {
        return $this->emprunts;
    }

    public function addEmprunt(Emprunt $emprunt): static
    {
        if (!$this->emprunts->contains($emprunt)) {
            $this->emprunts->add($emprunt);
            $emprunt->setLivre($this);
        }

        return $this;
    }

    public function removeEmprunt(Emprunt $emprunt): static
    {
        if ($this->emprunts->removeElement($emprunt)) {
            // set the owning side to null (unless already changed)
            if ($emprunt->getLivre() === $this) {
                $emprunt->setLivre(null);
            }
        }

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(string $genre): static
    {
        $this->genre = $genre;

        return $this;
    }

    public function getAnneePublication(): ?int
    {
        return $this->annee_publication;
    }


    public function getNbPages(): ?int
    {
        return $this->nb_pages;
    }


    public function getLangue(): ?string
    {
        return $this->langue;
    }

    public function setLangue(string $langue): static
    {
        $this->langue = $langue;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function getNbExemplaires(): ?int
    {
        return $this->nb_exemplaires;
    }

}
