# Preparation Android moderne Cook Note

Ce document fixe la frontiere entre le site/PWA et l'APK Android Legacy. Il ne
declenche aucune reconstruction Android.

## Etat de la preparation

- Le site reste la source d'experience : cache PWA versionne, catalogue charge a
  la demande, module cuisine charge a la demande et ressources hors-ligne
  explicites.
- L'APK Legacy reste gele sur sa derniere release validee (`4.58`). Ses assets,
  son catalogue et son cycle de rebuild ne sont pas modifies par une release
  site-only.
- Une future application Android moderne devra consommer une URL de release
  site versionnee et exposer un pont minimal : ouverture de recette, partage,
  retour au catalogue et signal de disponibilite hors-ligne.

## Contrats a conserver

1. Ne jamais partager le dossier de build ou les assets generes entre Legacy et
   le futur wrapper moderne.
2. Ne jamais publier un APK moderne comme remplacement du lien Legacy sans
   validation separee : version, signature, hash, installation et parcours
   hors-ligne.
3. Garder le precache PWA autonome : l'ouverture d'une fiche ou du mode cuisine
   ne doit pas dependre d'un pont Android.
4. Traiter le wrapper moderne comme un lot distinct avec son propre manifeste,
   ses tests appareil et son approbation de publication.

## Prochaine etape autorisee

Produire un prototype dans un dossier Android dedie uniquement après validation
du choix de wrapper et demande explicite de rebuild. Cette etape ne doit pas
modifier `android-legacy/`, le fichier APK stable ni le lien de telechargement
public.
