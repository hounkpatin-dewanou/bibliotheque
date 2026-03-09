# Plateforme de Gestion de Bibliothèque

Bienvenue sur le dépôt du projet de gestion de bibliothèque. Cette application est une solution complète permettant de gérer des ouvrages, des utilisateurs et des emprunts, développée dans un délai de 48 heures.

---

## Fonctionnalités principales

### Espace Usager (Rôle : ROLE_USER)

-   **Recherche de livres :** Moteur de recherche dynamique par titre avec filtrage en temps réel.
-   **Demandes d'emprunt :** Système de réservation instantané pour les ouvrages disponibles.
-   **Sécurité :** Accès protégé par un Layout Next.js (Route Groups) et gestion de session via JWT.

### Espace Administration (Rôle : ROLE_ADMIN)

-   **Tableau de Bord :** Vue d'ensemble des statistiques (nombre de livres, membres actifs, emprunts en cours).
-   **Gestion des Membres :** Consultation, modification des rôles, vérification des comptes et suppression.
-   **Gestion du Catalogue :** CRUD complet des livres avec gestion de l'upload d'images.

---

## Stack Technique**​**

-   **Backend :** Symfony 7 + API Platform + SwaggerUI
-   **Frontend :** Next.js 14 (App Router) + Tailwind CSS
-   **Sécurité :** Authentification JWT (LexikJWTAuthenticationBundle)
-   **Base de données :** MySQL

---

## Installation et Lancement ~| Utilisez votre CMD ou Git Bash sera encore mieux

### 1. Prérequis

-   PHP 8.2+
-   Composer
-   Node.js 18+ & npm
-   Un serveur MySQL local (ex: XAMPP, Laragon, WAMP)

### 2. Clonage du projet

git clone https://github.com/hounkpatin-dewanou/bibliotheque.gitcd bibliotheque

### 3. Configuration du Backend (Symfony)

cd bibliotheque-backend

# Installation des dépendances

composer install

# Copier le fichier .env et renommez-le en .env.local et configurez toutes vos variables d'environnement

*Note sur le .env :* La configuration par défaut utilise : `DATABASE_URL="mysql://root:@127.0.0.1:3306/bibliotheque?serverVersion=mariadb-10.4.32&charset=utf8mb4"`

# Génération des clés JWT (Plus rapide et simple avec Git Bash)

Générer la clé privée :Tapez cette commande dans votre terminal: openssl genrsa -out config/jwt/private.pem -aes256 4096

# Tapez "librairie123" quand on vous demande la passphrase

Générer la clé publique :Tapez cette commande dans votre terminal: openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem

# Tapez encore "librairie123"

# Création de la base de données et des tables

php bin/console doctrine:database:createphp bin/console doctrine:migrations:migrate

# Lancement du serveur

symfony serve Symfony tourne sur: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### 4. Configuration du Frontend (Next.js)

cd ../bibliotheque-frontend

# Installation des dépendances

npm install

# Configuration de l'environnement

# Lancement du projet

npm run dev

Le backend et le frontend tournent maintenant, vous pouvez vous diriger sur le lien du frontend: [http://localhost:3000/](http://localhost:3000/) pour suivre les travaux

---

## Sécurité & Permissions

L'application utilise des Route Groups Next.js pour segmenter les accès :

-   Le dossier `(usager)` contient un `layout.tsx` qui vérifie le ROLE_USER dans le token JWT.
-   Le dossier `admin` contient la logique de protection pour le ROLE_ADMIN.

---

## Configuration Mail (Dev)

Le projet utilise Gmail en mode développement pour l'envoi de mails, avec une désactivation de la vérification SSL pour faciliter les tests locaux :  
`MAILER_DSN=gmail://votre-email@gmail.com:votre-mot-de-passe-app@default?verify_peer=0`

---

**Développé dans le cadre d'une évaluation technique - 2026**