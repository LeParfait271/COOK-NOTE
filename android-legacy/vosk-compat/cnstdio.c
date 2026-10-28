// Compatibilite Android 5 pour Vosk (mode mains libres).
//
// libvosk.so (vosk-android) est compile pour Android 6+ : il importe les
// variables stdin, stdout et stderr, qui n'existent dans la libc d'Android
// qu'a partir de l'API 23. Avant, ce sont des macros sur __sF[]. Cette
// bibliotheque fournit les trois variables ; scripts/build-vosk-android-compat.ps1
// l'ajoute comme dependance (DT_NEEDED) de libvosk.so, et CookVoice la charge
// avant Vosk (sous Android 5, le lieur ne cherche pas seul dans le dossier de l'appli).
#include <stdio.h>

#undef stdin
#undef stdout
#undef stderr

FILE *stdin = &__sF[0];
FILE *stdout = &__sF[1];
FILE *stderr = &__sF[2];
