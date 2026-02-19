<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\ApiResource;
use App\Controller\RegistrationController;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/register',
            controller: RegistrationController::class,
            name: 'app_register',
            input: RegistrationInput::class, // On précise l'input explicitement
            read: false,
        )
    ]
)]
class RegistrationInput
{
    public string $email;
    public string $password;
    public string $nom;
    public string $prenom;
}
