<h1>Plateforme de Gestion de Bibliothèque</h1>

<p>
    Bienvenue sur le dépôt du projet de gestion de bibliothèque. Cette application est une solution complète permettant de gérer des ouvrages, des utilisateurs et des emprunts, développée dans un délai de 48 heures.
</p>

<hr />

<h2>Fonctionnalités principales</h2>

<h3>Espace Usager (Rôle : ROLE_USER)</h3>
<ul>
    <li><strong>Recherche de livres :</strong> Moteur de recherche dynamique par titre avec filtrage en temps réel.</li>
    <li><strong>Demandes d'emprunt :</strong> Système de réservation instantané pour les ouvrages disponibles.</li>
    <li><strong>Sécurité :</strong> Accès protégé par un Layout Next.js (Route Groups) et gestion de session via JWT.</li>
</ul>

<h3>Espace Administration (Rôle : ROLE_ADMIN)</h3>
<ul>
    <li><strong>Tableau de Bord :</strong> Vue d'ensemble des statistiques (nombre de livres, membres actifs, emprunts en cours).</li>
    <li><strong>Gestion des Membres :</strong> Consultation, modification des rôles, vérification des comptes et suppression.</li>
    <li><strong>Gestion du Catalogue :</strong> CRUD complet des livres avec gestion de l'upload d'images.</li>
</ul>

<hr />

<h2>Stack Technique</h2>
<ul>
    <li><strong>Backend :</strong> Symfony 7 + API Platform + SwaggerUI</li>
    <li><strong>Frontend :</strong> Next.js 14 (App Router) + Tailwind CSS</li>
    <li><strong>Sécurité :</strong> Authentification JWT (LexikJWTAuthenticationBundle)</li>
    <li><strong>Base de données :</strong> MySQL </li>
</ul>

<hr />

<h2>Installation et Lancement ~| Utilisez votre CMD ou Git Bash sera encore mieux</h2>

<h3>1. Prérequis</h3>
<ul>
    <li>PHP 8.2+</li>
    <li>Composer</li>
    <li>Node.js 18+ & npm</li>
    <li>Un serveur MySQL local (ex: XAMPP, Laragon, WAMP)</li>
</ul>

<h3>2. Clonage du projet</h3>
<pre>
git clone https://github.com/hounkpatin-dewanou/bibliotheque.git
cd bibliotheque
</pre>

<h3>3. Configuration du Backend (Symfony)</h3>
<pre>
cd bibliotheque-backend

# Installation des dépendances
composer install

# Copier le fichier .env et renommez-le en .env.local et configurez toutes vos variables d'environnement
<p><em>Note sur le .env :</em> La configuration par défaut utilise : <code>DATABASE_URL="mysql://root:@127.0.0.1:3306/bibliotheque?serverVersion=mariadb-10.4.32&charset=utf8mb4"</code></p>

# Génération des clés JWT (Plus rapide et simple avec Git Bash)
Générer la clé privée :
Tapez cette commande dans votre terminal: openssl genrsa -out config/jwt/private.pem -aes256 4096
# Tapez "librairie123" quand on vous demande la passphrase
Générer la clé publique :
Tapez cette commande dans votre terminal: openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
# Tapez encore "librairie123"

# Création de la base de données et des tables
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Lancement du serveur
symfony serve 
Symfony tourne sur: http://127.0.0.1:8000/
</pre>

<h3>4. Configuration du Frontend (Next.js)</h3>
<pre>
cd ../bibliotheque-frontend

# Installation des dépendances
npm install

# Configuration de l'environnement

# Lancement du projet
npm run dev

Le backend et le frontend tournent maintenant, vous pouvez vous diriger sur le lien du frontend: http://localhost:3000/ pour suivre les travaux
</pre>

<hr />

<h2>Sécurité & Permissions</h2>
<p>L'application utilise des Route Groups Next.js pour segmenter les accès :</p>
<ul>
    <li>Le dossier <code>(usager)</code> contient un <code>layout.tsx</code> qui vérifie le ROLE_USER dans le token JWT.</li>
    <li>Le dossier <code>admin</code> contient la logique de protection pour le ROLE_ADMIN.</li>
</ul>

<hr />

<h2>Configuration Mail (Dev)</h2>
<p>
    Le projet utilise Gmail en mode développement pour l'envoi de mails, avec une désactivation de la vérification SSL pour faciliter les tests locaux :<br />
    <code>MAILER_DSN=gmail://votre-email@gmail.com:votre-mot-de-passe-app@default?verify_peer=0</code>
</p>

<hr />

<p align="center">
    <strong>Développé dans le cadre d'une évaluation technique - 2026</strong>
</p>
