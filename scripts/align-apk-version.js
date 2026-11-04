// `npm run apk:version` : aligne la version de l'APK sur celle du site
// (SITE_VERSION de app.js), comme l'exige le build de publication :
// gradle.properties, ANDROID_LEGACY_APK_VERSION et downloads/android-latest-version.json.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const write = (file, text) => fs.writeFileSync(path.join(ROOT, file), text, 'utf8');
const fail = message => { console.error(message); process.exit(1); };

const site = (read('app.js').match(/const SITE_VERSION = 'v(\d+)\.(\d{2})';/) || []).slice(1);
if (site.length !== 2) fail('SITE_VERSION introuvable dans app.js.');
const name = `${site[0]}.${site[1]}`;
const code = Number(site[0]) * 1000 + Number(site[1]);

const swap = (file, pattern, replacement) => {
  const text = read(file);
  if (!pattern.test(text)) fail(`${file} : version APK introuvable.`);
  write(file, text.replace(pattern, replacement));
};
swap('android-legacy/gradle.properties', /^cookNoteAndroidVersion=\d+\.\d{2}$/m, `cookNoteAndroidVersion=${name}`);
swap('app.js', /const ANDROID_LEGACY_APK_VERSION = '\d+\.\d{2}';/, `const ANDROID_LEGACY_APK_VERSION = '${name}';`);
swap('downloads/android-latest-version.json', /"versionCode": \d+/, `"versionCode": ${code}`);
swap('downloads/android-latest-version.json', /"versionName": "\d+\.\d{2}"/, `"versionName": "${name}"`);
console.log(`Version APK alignee sur le site : ${name} (code ${code}). Reconstruire l'APK pour la publier.`);
