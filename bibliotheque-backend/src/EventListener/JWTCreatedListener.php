<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use App\Entity\Utilisateur;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();

        // On vérifie que c'est bien notre entité Utilisateur
        if (!$user instanceof Utilisateur) {
            return;
        }

        // On ajoute les données personnalisées au payload du token
        $payload = $event->getData();
        $payload['prenom'] = $user->getPrenom();
        $payload['roles'] = $user->getRoles();

        $event->setData($payload);
    }
}
