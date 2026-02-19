Plateforme de Gestion de Bibliothèque
Bienvenue sur le dépôt du projet de gestion de bibliothèque. Cette application est une solution complète permettant de gérer des ouvrages, des utilisateurs et des emprunts.

Fonctionnalités principales
Espace Usager (Rôle : ROLE_USER)
•	Recherche de livres : Moteur de recherche dynamique par titre avec filtrage en temps réel.
•	Demandes d'emprunt : Système de réservation instantané pour les ouvrages disponibles.
•	Sécurité : Accès protégé par un Layout Next.js (Route Groups) et gestion de session via JWT.
Espace Administration (Rôle : ROLE_ADMIN)
•	Tableau de Bord : Vue d'ensemble des statistiques (nombre de livres, membres actifs, emprunts en cours).
•	Gestion des Membres : Consultation, modification des rôles, vérification des comptes et suppression.
•	Gestion du Catalogue : CRUD complet des livres avec gestion de l'upload d'images.
________________________________________
Stack Technique
•	Backend : Symfony 7 + API Platform + SwaggerUI
•	Frontend : Next.js 14 (App Router) + Tailwind CSS
•	Sécurité : Authentification JWT (LexikJWTAuthenticationBundle)
•	Base de données : MySQL / MariaDB
________________________________________
Installation et Lancement
1. Prérequis
•	PHP 8.2+
•	Composer
•	Node.js 18+ & npm
•	Un serveur MySQL local (ex: XAMPP, Laragon, WAMP)
2. Clonage du projet
Bash
git clone https://github.com/hounkpatin-dewanou/bibliotheque.git
cd bibliotheque
3. Configuration du Backend (Symfony)
Bash
cd bibliotheque-backend

# Installation des dépendances
composer install

# Génération des clés JWT
php bin/console lexik:jwt:generate-keypair

# Création de la base de données et des tables
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Lancement du serveur
symfony serve -d
Note sur le .env : La configuration par défaut utilise : DATABASE_URL="mysql://root:@127.0.0.1:3306/bibliotheque?serverVersion=mariadb-10.4.32&charset=utf8mb4"
4. Configuration du Frontend (Next.js)
Bash
cd ../bibliotheque-frontend

# Installation des dépendances
npm install

# Configuration de l'environnement
# Créer un fichier .env.local et ajouter :
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Lancement du projet
npm run dev
________________________________________
Sécurité & Permissions
L'application utilise des Route Groups Next.js pour segmenter les accès :
•	Le dossier (usager) contient un layout.tsx qui vérifie le ROLE_USER dans le token JWT.
•	Le dossier admin contient la logique de protection pour le ROLE_ADMIN.
________________________________________
Configuration Mail (Dev)
Le projet utilise Gmail en mode développement pour l'envoi de mails, avec une désactivation de la vérification SSL pour faciliter les tests locaux : MAILER_DSN=gmail://votre-email@gmail.com:votre-mot-de-passe-app@default?verify_peer=0
