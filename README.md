# Gaming Room Studio — configurateur 3D

> Un configurateur de chambre gaming interactif en 3D, réalisé avec Three.js, JavaScript et CSS responsive.

[![Déploiement GitHub Pages](https://github.com/johannafoolchand/my-gaming-room/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/johannafoolchand/my-gaming-room/actions/workflows/deploy.yml)

**Démo en ligne :** https://johannafoolchand.github.io/my-gaming-room/

## Présentation

Gaming Room Studio permet de composer et personnaliser une chambre gaming directement dans le navigateur. La scène utilise Three.js : les meubles sont des objets 3D manipulables et non une simple image de fond.

## Fonctionnalités

- Scène 3D avec murs, sol, ouverture, éclairage et caméra orbitale
- Navigation dans la scène : rotation, zoom et retour à la vue initiale
- Catalogue d'objets 3D : lit, bureau, fauteuil, canapé, écrans, PC, console, clavier, casque, lampe, LED, plante, affiche, étagère et tapis
- Ajout, sélection, déplacement, duplication, rotation, mise à l'échelle, recoloration et suppression des objets
- Ambiances prédéfinies, couleur des murs, finition du sol et réglages de l'éclairage LED
- Sélection d'un jeu pour personnaliser l'aperçu affiché sur les écrans
- Sauvegarde locale de plusieurs configurations dans le navigateur
- Export de la configuration au format JSON
- Interface responsive pour ordinateur et mobile

## Technologies

| Technologie | Utilisation |
| --- | --- |
| HTML5 | Structure et contrôles de l'interface |
| CSS3 | Mise en page responsive et direction artistique |
| JavaScript ES modules | Logique applicative et interactions |
| Three.js | Scène, caméra, géométries, matériaux et éclairage 3D |
| OrbitControls | Rotation et zoom de la caméra |
| localStorage | Sauvegarde des configurations dans le navigateur |
| Playwright | Tests automatisés desktop et mobile |
| GitHub Actions | Tests et déploiement continu |
| GitHub Pages | Hébergement de la démonstration |

## Architecture

L'application est volontairement légère : aucun bundler n'est nécessaire. Three.js et OrbitControls sont chargés via un import map depuis jsDelivr.

```text
my-gaming-room/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── tests/
│   └── studio.spec.js
├── index.html
├── styles.css
├── app.js
├── package.json
├── playwright.config.js
└── README.md
```

## Lancer le projet en local

Prérequis : Python 3, Node.js et npm.

```bash
git clone https://github.com/johannafoolchand/my-gaming-room.git
cd my-gaming-room
python3 -m http.server 8000
```

Ouvrir ensuite http://localhost:8000.

Pour exécuter les tests automatisés :

```bash
npm install
npx playwright install chromium
npm test
```

Les tests vérifient le chargement du moteur 3D, l'ajout d'objets, la personnalisation, la sauvegarde locale et les contrôles sur une fenêtre mobile.

## Limites connues

- Les meubles sont actuellement construits à partir de géométries Three.js procédurales. Ce ne sont pas encore des modèles 3D photoréalistes issus d'une bibliothèque de mobilier.
- Les visuels de jeux affichés sur les écrans sont des aperçus graphiques générés localement ; ils ne reproduisent pas les jaquettes officielles ni des captures de gameplay.
- Les configurations sont enregistrées dans le stockage local du navigateur. Elles ne sont pas synchronisées entre appareils.
- Le chargement de Three.js dépend de l'accès au CDN jsDelivr.

## Déploiement

Chaque push sur `main` déclenche le workflow GitHub Actions `.github/workflows/deploy.yml`, qui publie le site sur GitHub Pages. La source de publication du dépôt doit être configurée sur **GitHub Actions**.

## Compétences démontrées

- Développement front-end en JavaScript moderne
- Intégration d'une scène 3D avec Three.js
- Manipulation d'objets 3D et gestion des interactions pointeur
- Gestion d'état et persistance côté navigateur
- Conception d'une interface responsive
- Tests end-to-end avec Playwright
- Intégration continue et déploiement continu avec GitHub Actions

---

Projet conçu et développé par [Johanna Foolchand](https://github.com/johannafoolchand).
