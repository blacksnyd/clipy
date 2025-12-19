# Clipy

Plateforme web de partage de vidéos (upload, lecture, recherche, notation et commentaires) construite pour un examen de développeur web intermédiaire. Le repo contient un front React/Vite et une API Express + MySQL avec authentification JWT, gestion d’upload et extraction de métadonnées via ffmpeg.

## Fonctionnalités principales
- Authentification : inscription/connexion, JWT stocké côté client.
- Vidéos : upload vidéo + image de couverture, extraction de durée via ffmpeg, édition/suppression par l’auteur.
- Catalogue : catégories, pagination, recherche texte, filtrage.
- Interaction : notation (ratings), commentaires, moyenne affichée sur les cartes.
- Modération basique : validation des payloads (Zod), limites de taille d’upload (50 Mo), messages d’erreur clairs.

## Stack technique
- Front : React 19 + Vite, React Router, Tailwind/DaisyUI, CKEditor pour l’éditeur riche, @smastrom/react-rating pour les étoiles.
- Back : Node/Express, MySQL2, JWT, bcrypt, multer + fluent-ffmpeg, validation Zod, morgan, CORS.
- Base de données : script `createDB.sql` (tables users, categories, videos, ratings, comments).

## Structure du projet
- `front_end/` : SPA React (pages `Homepage`, `DetailVideo`, composants `CardVideo`, `SearchBar`, modales CRUD, formulaires d’auth`).
- `back_end/` : API REST (`/api/auth`, `/api/videos`, `/api/categories`, `/api/comments`, `/api/reviews`), middlewares d’upload et de validation.
- `createDB.sql` : création du schéma MySQL (users, categories, videos, ratings, comments).

## Pré-requis
- Node.js ≥ 18, npm.
- MySQL 8 (ou compatible).
- ffmpeg installé sur la machine (requis pour la durée des vidéos).

## Étapes détaillées d’installation et de lancement
1) Cloner puis créer la base :
```bash
mysql -u root -p < createDB.sql
```
2) Back-end :
```bash
cd back_end
cp .env.example .env    # ou crée .env à partir du bloc ci-dessous
npm install
npm run dev             # ou npm start
```
3) Front-end :
```bash
cd front_end
npm install
npm run dev             # Vite sur http://localhost:5173
```
4) Vérifier : API sur `http://localhost:3000/api`, front sur `http://localhost:5173`, dossier d’upload accessible via `http://localhost:3000/uploads/<fichier>`.

## Configuration environnement (back_end/.env)
Exemple minimal :
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clipy_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=change-me
```

## Flux utilisateur type
1. Inscription/connexion pour obtenir un token JWT.
2. Création d’une vidéo : upload `video` + `cover`, titre, description riche, catégorie.
3. Consultation et recherche : barre de recherche + filtres catégorie/pagination.
4. Interaction : laisser une note et un commentaire sur une vidéo, voir la moyenne.
5. Gestion auteur : édition/suppression uniquement par le propriétaire (contrôle token côté API).

## Fonctionnalités principales côté front
- Pages : `Homepage` (liste + recherche + pagination), `DetailVideo` (lecture, notes, commentaires).
- Composants clés : `CardVideo` (affiche cover, durée, moyenne), `SearchBar`, `Pagination`, modales `ModalCreate/ModalUpdate`, formulaires `Login`/`Register`.
- Services front (`src/services/*.js`) : appels HTTP vers l’API (auth, vidéos, catégories, commentaires, reviews), client Axios configuré.
- UX : CKEditor pour description riche, rating interactif avec @smastrom/react-rating, feedbacks d’erreur côté formulaire.

## Fonctionnalités principales côté back
- Authentification : `auth.controller`/`auth.service` (inscription, connexion, génération/validation JWT, hash bcrypt).
- Vidéos : `videos.controller`/`videos.service` (upload multer pour `video` + `cover`, durée via fluent-ffmpeg, CRUD, filtrage catégorie/recherche, pagination).
- Interactions : `comments.controller`, `reviews.controller` (commentaires + notes, calcul moyenne).
- Catégories : `categories.controller` (liste/CRUD basique).
- Middlewares : `auth.middleware` (vérif token), `handle_upload.middleware` (gestion erreurs Multer, limite 50 Mo), validations Zod (`auth.validation`, `videos.validation`).
- Statique : exposition des fichiers envoyés via `/uploads`.

## Endpoints API (extraits)
- Auth : `POST /api/auth/register`, `POST /api/auth/login`.
- Vidéos : `GET /api/videos` (query recherche, catégorie, page), `GET /api/videos/:id`, `POST /api/videos` (protégé, upload), `PUT /api/videos/:id`, `DELETE /api/videos/:id`.
- Commentaires : `GET /api/comments/:videoId`, `POST /api/comments/:videoId` (protégé).
- Notes : `GET /api/reviews/:videoId`, `POST /api/reviews/:videoId` (protégé).
- Catégories : `GET /api/categories`, `POST /api/categories` (selon droits choisis).

## Scripts utiles
- Back : `npm run dev` (nodemon), `npm start`.
- Front : `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.

## Points à mentionner à l’oral
- Sécurité : hashing bcrypt, vérification JWT côté routes protégées, validation Zod, limites d’upload (50 Mo) et messages d’erreur contextualisés.
- Expérience utilisateur : formulaires réutilisables, modales de création/édition, CKEditor pour la description, recherche instantanée + pagination.
- Architecture : séparation front/back, services dédiés (videos, reviews, comments), statique `/uploads`, couches controllers/services.
- Démo rapide : inscription → login → upload vidéo+cover → voir durée auto → noter/commenter depuis la page détail.

## Pistes d’amélioration (pour montrer du recul)
- Ajouter des tests (unitaires sur services, e2e sur routes) et lint CI.
- Gérer le stockage des vidéos sur S3/Cloud + CDN, et un transcodage/miniatures.
- Mettre en place un rate limiting, cache pour les listes, pagination côté API sur commentaires.
- Rôles/permissions (admin/modérateur), oubli de mot de passe.
