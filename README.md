# Anne_so_vrac_front

Application frontend du projet Anne_so_vrac, développée avec React et Vite.

## Prérequis
- Node.js >= 18
- npm ou yarn

## Installation

Après avoir cloné le dépôt, il est nécessaire d'installer les dépendances pour générer le dossier `node_modules` :
```bash
cd Anne_so_vrac_front
npm install
```

## Lancement du projet

Pour démarrer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (par défaut).

## Structure principale
- `src/` : Code source React
  - `Components/` : Composants réutilisables
  - `Contexts/` : Contexts React (auth, panier...)
  - `Pages/` : Pages principales
  - `Services/` : Appels API
  - `assets/` : Images et ressources statiques

## Fonctionnalités
- Authentification utilisateur
- Catalogue produits, panier, commandes
- Interface d'administration
- Paiement et historique de commandes

## Développement
- React, Vite, Context API
- CSS modules

## Contribution
Les contributions sont les bienvenues !

## Licence
Projet privé.
