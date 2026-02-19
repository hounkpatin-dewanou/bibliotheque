<?php

namespace App\EventListener;

use App\Entity\Utilisateur;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsEntityListener(event: Events::prePersist, entity: Utilisateur::class)]
#[AsEntityListener(event: Events::preUpdate, entity: Utilisateur::class)]
class PasswordHasherListener
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function prePersist(Utilisateur $user): void
    {
        $this->hashPassword($user);
    }

    public function preUpdate(Utilisateur $user): void
    {
        $this->hashPassword($user);
    }

    private function hashPassword(Utilisateur $user): void
    {
        if ($user->getPassword()) {
            $hashedPassword = $this->hasher->hashPassword($user, $user->getPassword());
            $user->setPassword($hashedPassword);
        }
    }

    private function hash(Utilisateur $user): void
    {
        $plainPassword = $user->getPassword();

        // On ne hache que si un nouveau mot de passe est fourni et n'est pas vide
        if ($plainPassword !== null && trim($plainPassword) !== '') {
            // Si le mot de passe ne ressemble pas déjà à un hash (sécurité)
            if (!str_starts_with($plainPassword, '$2y$')) {
                $user->setPassword($this->hasher->hashPassword($user, $plainPassword));
            }
        } else {
            // Si on est en mise à jour et que le mot de passe est vide,
            // Doctrine ne doit pas toucher à la colonne (on ne fait rien)
        }
    }
}
