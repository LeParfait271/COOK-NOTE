const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const styleDoc = "docs/visual-references/RECIPE_IMAGE_STYLE.md";
const workflowDoc = "docs/recipe-creation-workflow.md";
const rulesDoc = "COOK_NOTE_RULES.md";
const references = [
  "docs/visual-references/recipe-images/day/window-left-filet-mignon.jpg",
  "docs/visual-references/recipe-images/day/window-left-focaccia.jpg",
  "docs/visual-references/recipe-images/day/window-right-tian.jpg",
  "docs/visual-references/recipe-images/night/window-left-balsamique.jpg",
  "docs/visual-references/recipe-images/night/window-right-brochettes-lotte.jpg",
  "docs/visual-references/recipe-images/night/window-right-sauce-moutardes.jpg"
];

function fail(message) {
  console.error(`Kit visuel invalide: ${message}`);
  process.exitCode = 1;
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`fichier manquant: ${relativePath}`);
    return null;
  }
  return fs.readFileSync(absolutePath);
}

function jpegDimensions(buffer) {
  if (!buffer || buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2 || offset + length + 2 > buffer.length) return null;
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    ) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }
    offset += length + 2;
  }
  return null;
}

const style = read(styleDoc)?.toString("utf8") || "";
const workflow = read(workflowDoc)?.toString("utf8") || "";
const rules = read(rulesDoc)?.toString("utf8") || "";

if (!workflow.includes(styleDoc)) fail(`le workflow ne reference pas ${styleDoc}`);
if (!rules.includes(styleDoc)) fail(`les regles ne referencent pas ${styleDoc}`);
if (!style.includes("sans attendre de validation utilisateur")) {
  fail("le kit doit autoriser l integration sans validation utilisateur");
}
if (!workflow.includes("sans attendre de validation utilisateur")) {
  fail("le workflow doit autoriser l integration sans validation utilisateur");
}
if (!rules.includes("sans attendre de validation utilisateur")) {
  fail("les regles doivent autoriser l integration sans validation utilisateur");
}
[
  "premiere paire conforme du lot pour validation",
  "attendre sa validation",
  "premiere paire a ete validee par l'utilisateur",
  "montrer le visuel et attendre validation utilisateur"
].forEach((fragment) => {
  if (style.includes(fragment) || workflow.includes(fragment) || rules.includes(fragment)) {
    fail(`ancienne validation utilisateur encore presente: ${fragment}`);
  }
});

const hashes = new Set();
for (const relativePath of references) {
  const buffer = read(relativePath);
  if (!buffer) continue;
  const docPath = relativePath.replace("docs/visual-references/", "");
  if (!style.includes(docPath)) fail(`reference absente du rapport: ${docPath}`);
  const dimensions = jpegDimensions(buffer);
  if (!dimensions) {
    fail(`JPEG illisible: ${relativePath}`);
    continue;
  }
  const ratio = dimensions.width / dimensions.height;
  if (Math.abs(ratio - 16 / 9) > 0.02) {
    fail(`format non 16:9: ${relativePath} (${dimensions.width}x${dimensions.height})`);
  }
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  if (hashes.has(hash)) fail(`reference dupliquee dans le kit: ${relativePath}`);
  hashes.add(hash);
}

const dayCount = references.filter((x) => x.includes("/day/")).length;
const nightCount = references.filter((x) => x.includes("/night/")).length;
const leftCount = references.filter((x) => x.includes("window-left-")).length;
const rightCount = references.filter((x) => x.includes("window-right-")).length;
if (dayCount !== 3 || nightCount !== 3) fail(`attendu 3 jour et 3 nuit, obtenu ${dayCount}/${nightCount}`);
if (leftCount !== 3 || rightCount !== 3) fail(`attendu 3 fenetres gauche et 3 droite, obtenu ${leftCount}/${rightCount}`);

if (!process.exitCode) {
  console.log("Validation kit visuel OK (3 jour, 3 nuit, 3 gauche, 3 droite).");
}
