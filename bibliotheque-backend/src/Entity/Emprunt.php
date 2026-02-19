<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EmpruntRepository;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource] // Affichage des utilisateurs sur le serveur Swagger UI
#[ORM\Entity(repositoryClass: EmpruntRepository::class)]
class Emprunt
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $dateDebut = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $dateFinPrevue = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $dateRetourEffective = null;

    #[ORM\ManyToOne(inversedBy: 'emprunts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $usager = null;

    #[ORM\ManyToOne(inversedBy: 'emprunts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Livre $livre = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateDebut(): ?\DateTimeImmutable
    {
        return $this->dateDebut;
    }

    public function setDateDebut(\DateTimeImmutable $dateDebut): static
    {
        $this->dateDebut = $dateDebut;

        return $this;
    }

    public function getDateFinPrevue(): ?\DateTimeImmutable
    {
        return $this->dateFinPrevue;
    }

    public function setDateFinPrevue(\DateTimeImmutable $dateFinPrevue): static
    {
        $this->dateFinPrevue = $dateFinPrevue;

        return $this;
    }

    public function getDateRetourEffective(): ?\DateTimeImmutable
    {
        return $this->dateRetourEffective;
    }

    public function setDateRetourEffective(?\DateTimeImmutable $dateRetourEffective): static
    {
        $this->dateRetourEffective = $dateRetourEffective;

        return $this;
    }

    public function getUsager(): ?Utilisateur
    {
        return $this->usager;
    }

    public function setUsager(?Utilisateur $usager): static
    {
        $this->usager = $usager;

        return $this;
    }

    public function getLivre(): ?Livre
    {
        return $this->livre;
    }

    public function setLivre(?Livre $livre): static
    {
        $this->livre = $livre;

        return $this;
    }
}
