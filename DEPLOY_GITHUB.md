# Guide de déploiement sur GitHub

## Prérequis

- Git installé sur votre machine
- Un compte GitHub
- Un dépôt GitHub créé (existant ou nouveau)

## Étapes pour pousser votre code sur GitHub

### 1. Initialiser Git (si ce n'est pas déjà fait)

```bash
git init
```

### 2. Configurer votre utilisateur Git (première fois uniquement)

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 3. Ajouter tous les fichiers au staging

```bash
git add .
```

### 4. Créer un commit avec vos modifications

```bash
git commit -m "Ajout de la modale de données compteur et amélioration de Google Maps"
```

### 5. Ajouter le dépôt distant (si ce n'est pas déjà fait)

Remplacez `username` par votre nom d'utilisateur GitHub et `repository` par le nom de votre dépôt :

```bash
git remote add origin https://github.com/username/repository.git
```

Si vous avez déjà configuré le remote, vous pouvez vérifier avec :

```bash
git remote -v
```

### 6. Pousser sur GitHub

Pour la première fois (crée la branche main) :

```bash
git push -u origin main
```

Pour les fois suivantes :

```bash
git push
```

## Si vous avez déjà un dépôt existant

Si vous avez déjà un dépôt avec des commits, il faut d'abord récupérer les changements distants :

```bash
# Récupérer les changements du dépôt distant
git pull origin main --rebase

# Puis pousser vos changements
git push origin main
```

## Résolution des conflits

Si vous avez des conflits, Git vous demandera de les résoudre manuellement :

1. Ouvrez les fichiers en conflit
2. Résolvez les conflits (supprimez les marqueurs `<<<<<<<`, `=======`, `>>>>>>>`)
3. Ajoutez les fichiers résolus :
   ```bash
   git add .
   ```
4. Continuez le rebase :
   ```bash
   git rebase --continue
   ```
5. Poussez vos changements :
   ```bash
   git push
   ```

## Commandes utiles

### Voir l'état de votre dépôt
```bash
git status
```

### Voir l'historique des commits
```bash
git log --oneline
```

### Créer une nouvelle branche
```bash
git checkout -b nom-de-la-branche
```

### Changer de branche
```bash
git checkout main
```

### Voir les branches
```bash
git branch
```

## Structure du projet

Votre projet contient maintenant :

- ✅ Modale de récupération des données compteur avec graphiques
- ✅ Affichage amélioré de Google Maps avec message informatif
- ✅ Pré-remplissage automatique des champs
- ✅ Gestion des erreurs élégante
- ✅ Build optimisé pour production

## Fichiers sensibles

Le fichier `.env` contenant vos clés API est déjà dans `.gitignore` et ne sera **pas** poussé sur GitHub.

**Important** : Ne partagez jamais vos clés API publiquement !

Pour votre déploiement en production, configurez les variables d'environnement directement sur votre plateforme d'hébergement (Vercel, Netlify, etc.).

## Déploiement sur Vercel (recommandé)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Connectez votre dépôt GitHub
3. Configurez les variables d'environnement dans les paramètres du projet :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY` (optionnel)
4. Vercel déploiera automatiquement à chaque push sur `main`

## Support

En cas de problème, vérifiez :
- Que vous êtes sur la bonne branche (`git branch`)
- Que vous avez bien configuré le remote (`git remote -v`)
- Que vous avez les droits d'écriture sur le dépôt
- Que votre token GitHub est valide (si vous utilisez HTTPS)

## Utilisation de SSH (alternative recommandée)

Pour éviter de taper votre mot de passe à chaque push, configurez SSH :

1. Générez une clé SSH :
   ```bash
   ssh-keygen -t ed25519 -C "votre.email@example.com"
   ```

2. Ajoutez la clé à votre agent SSH :
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. Copiez la clé publique :
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. Ajoutez-la à GitHub (Settings > SSH and GPG keys > New SSH key)

5. Changez l'URL du remote :
   ```bash
   git remote set-url origin git@github.com:username/repository.git
   ```

Maintenant vous pouvez pousser sans mot de passe !
