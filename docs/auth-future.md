# Authentification future Cook Note

Objectif : permettre un jour a l'utilisateur de retrouver ses notes personnelles si le navigateur est perdu, sans transformer Cook Note en service qui collecte un profil.

## Principes non negociables

- Connexion optionnelle uniquement.
- Google Sign-In via OIDC/PKCE, sans mot de passe Cook Note.
- Aucune conservation de nom, email, avatar, contacts ou profil Google.
- Identifiant interne derive du `sub` Google avec un secret serveur :
  `sha256("google:" + sub + ":" + SERVER_AUTH_PEPPER)`.
- Les notes restent le seul contenu synchronisable.
- Les exports, favoris et notes locales continuent de fonctionner sans compte.

## Donnees cote serveur

Table minimale envisagee :

- `user_id_hash`
- `encrypted_payload`
- `schema_version`
- `updated_at`

Pas de colonne email, pas de nom public, pas de photo, pas de tracking d'usage.

## Chiffrement des notes

La version la plus etanche reste a valider avant implementation :

- Option stricte : chiffrement WebCrypto cote navigateur, cle de recuperation affichee une fois a l'utilisateur. Le serveur ne voit que du texte chiffre.
- Option confort : chiffrement serveur avec cle d'application, plus simple mais moins etanche si la base et la cle fuient ensemble.

La mise a jour ne doit pas etre codee tant que ce choix n'est pas tranche.

## Integration future

- Ajouter une couche `syncProvider` separee du stockage local actuel.
- Garder `localStorage` comme source immediate.
- Synchroniser seulement apres action explicite de connexion.
- Prevoir une migration de schema versionnee pour les notes.
