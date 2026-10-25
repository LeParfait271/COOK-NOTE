// Compare l'encodeur QR natif Android (QrCode.java) a la librairie QR du site,
// module par module, sur des textes, versions (1 a 40) et masques varies.
// Demande un JDK : celui de `npm run android:legacy:setup` ou JAVA_HOME.
// Hors du check (la CI n'a pas de JDK) : a lancer apres toute modification de
// QrCode.java avec `npm run test:android-qr`.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const QRCode = require(path.join(ROOT, 'assets/vendor/qrcode.min.js'));
const WORK = path.join(ROOT, 'tmp', 'android-qr-test');

function findJdkBin() {
  const candidates = [
    process.env.JAVA_HOME && path.join(process.env.JAVA_HOME, 'bin'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'CookNoteAndroidTools', 'jdk', 'temurin-17', 'bin')
  ].filter(Boolean);
  const exe = process.platform === 'win32' ? '.exe' : '';
  const found = candidates.find(dir => fs.existsSync(path.join(dir, `javac${exe}`)));
  if (!found) {
    console.error('JDK introuvable : lancez npm run android:legacy:setup ou definissez JAVA_HOME.');
    process.exit(1);
  }
  return { javac: path.join(found, `javac${exe}`), java: path.join(found, `java${exe}`) };
}

const DUMP_SOURCE = `package fr.cooknote.legacy;

public final class QrDump {
    public static void main(String[] args) throws Exception {
        java.io.BufferedReader in = new java.io.BufferedReader(new java.io.InputStreamReader(System.in, "UTF-8"));
        StringBuilder out = new StringBuilder();
        String line;
        while ((line = in.readLine()) != null) {
            String[] parts = line.split("\\t", 3);
            QrCode qr = QrCode.encode(parts[2].getBytes("UTF-8"), Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
            out.append(qr.version).append(' ').append(qr.mask).append(' ');
            for (int y = 0; y < qr.size; y++) for (int x = 0; x < qr.size; x++) out.append(qr.isDark(x, y) ? '1' : '0');
            out.append('\\n');
        }
        System.out.print(out);
    }
}
`;

const { javac, java } = findJdkBin();
fs.rmSync(WORK, { recursive: true, force: true });
fs.mkdirSync(WORK, { recursive: true });
const dumpPath = path.join(WORK, 'QrDump.java');
fs.writeFileSync(dumpPath, DUMP_SOURCE, 'utf8');
execFileSync(javac, ['-encoding', 'UTF-8', '-d', path.join(WORK, 'classes'),
  path.join(ROOT, 'android-legacy/app/src/main/java/fr/cooknote/legacy/QrCode.java'), dumpPath], { stdio: 'inherit' });

const texts = ['A', 'https://cook-note.pages.dev/'];
for (let count = 1; count <= 30; count += 1) {
  texts.push(`https://cook-note.pages.dev/#courses=${Array.from({ length: count }, (_, index) => `recette_numero_${index}${index % 3 ? '*2' : ''}`).join(',')}`);
}
texts.push(`Éé àç œ – “citations” ${'x'.repeat(300)}`);
const cases = [];
texts.forEach(text => {
  cases.push([-1, -1, text]);
  for (let mask = 0; mask < 8; mask += 3) cases.push([-1, mask, text]);
});
for (let version = 1; version <= 40; version += 1) cases.push([version, version % 8, `version ${version}`]);

const expected = cases.map(([version, mask, text]) => {
  const options = { errorCorrectionLevel: 'M' };
  if (version > 0) options.version = version;
  if (mask >= 0) options.maskPattern = mask;
  const qr = QRCode.create([{ data: text, mode: 'byte' }], options);
  let bits = '';
  for (let y = 0; y < qr.modules.size; y += 1) for (let x = 0; x < qr.modules.size; x += 1) bits += qr.modules.get(y, x) ? '1' : '0';
  return `${qr.version} ${qr.maskPattern} ${bits}`;
});
const actual = execFileSync(java, ['-cp', path.join(WORK, 'classes'), 'fr.cooknote.legacy.QrDump'], {
  input: `${cases.map(entry => entry.join('\t')).join('\n')}\n`,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024
}).trim().split('\n');

const failures = expected.filter((line, index) => line !== actual[index]).length;
if (failures) {
  console.error(`QR Android: ${failures} difference(s) sur ${cases.length} cas.`);
  process.exit(1);
}
console.log(`QR Android OK (${cases.length} cas identiques a la librairie du site).`);
