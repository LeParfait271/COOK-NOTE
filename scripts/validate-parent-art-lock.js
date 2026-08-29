const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const LOCKED_PARENT_ART = Object.freeze({
  'assets/theme/dark/categories/accompagnements_maitre.jpg': 'b68cff07d1cd48140d8e93fa51f18cee5d09ad36232ab7a9573fdc5d6bfa0b43',
  'assets/theme/dark/categories/apero_maitre.jpg': '70c04be4b976009f552581f9d18b04053388a6ee64026a9004144a80c5eb9cf1',
  'assets/theme/dark/recipes/coulis_maitre.jpg': 'c0c4e2c55cd1149f855a0378e25bf16b63be2a2e2fca81a0194e23478ec62240',
  'assets/theme/dark/categories/desserts_maitre.jpg': '39b821f36baa4eee3c9c8b344761940f308711999526661a1ed319a607f77e7f',
  'assets/theme/dark/categories/elements_base_maitre.jpg': '3d293d55bafd70223ce8c1a55da2abfc373ec08305952fc3328a9b83089f84ef',
  'assets/theme/dark/categories/entrees_maitre.jpg': 'f3ee66ecbac1bf85667d4fe477d7f4c8db83677021c744a6d65dda12e78288db',
  'assets/theme/dark/categories/petit_dejeuner_maitre.jpg': 'cc2c60752e0819115997c1469ff1560e68618c21e9e2b1e5d9e2e62a76f58793',
  'assets/theme/dark/categories/plats_maitre.jpg': '6f185c21ca61ee1153f8a4d2a855992497b274efee4c2fc6285e40e3195c09ec',
  'assets/theme/dark/categories/sauces_maitre.jpg': 'f63982d12f3914a0fa8afd0144a64d4251a0ab212eafac99100f1c523b74d422',
  'assets/theme/day/recipes/coulis_maitre.jpg': 'ef48f9020a6b6d001d3fbae6e583951591ba6a8e6d6e92695c91742f6ac281e8',
  'assets/recipes/cards/accompagnements_maitre.jpg': 'fde1bf1fdd731522afae7889077fd1f5d208397e469111bac030929e1f3b0603',
  'assets/recipes/cards/apero_maitre.jpg': '1a42a08b71c2c040ad07aa8e08020d89238251a8a669d1b59b4214037d973126',
  'assets/recipes/cards/elements_base_maitre.jpg': 'bf3580fcc2ead802fe1a5e4814fb7dc3638552ff06b5b0905fb96919bd8d0cb9',
  'assets/recipes/cards/desserts_maitre.jpg': '7538751a251cbfdcd9eab56230526bd1504af5a7674c669ce4f428799920eb0d',
  'assets/recipes/cards/entrees_maitre.jpg': '238cd9d13cc9faff2f2a9f04fd19cc32279abeee909c17732bd223b5017806ee',
  'assets/recipes/cards/petit_dejeuner_maitre.jpg': '28108045500a4da52541c499eec40f666fc1970a038985bc82f6ba1436d49bec',
  'assets/recipes/cards/plats_maitre.jpg': '8d95463a45a2e5c81f76924a82446b48e92e8ab05eb267a150ff586567dfdaa9',
  'assets/recipes/cards/sauces_maitre.jpg': '9fe25b4fcc57c544582c99da07d90de61447cd741daa21e0bb351a9c1472a25f',
  'assets/recipes/masters/accompagnements_maitre.png': '3a5668da91bad375643ab290a50a1b0779199dbbf4e6846daa6583d83d3c9daa',
  'assets/recipes/masters/apero_maitre.png': 'cd10272ef4ffd25872d1a94f8a85027d05dfa7efa5c123130a9d8e9baef47c8a',
  'assets/recipes/masters/elements_base_maitre.png': 'bc716f28644db19f6eb967433639c3bbb1196ccdaa28e84065432bcc650b4ba3',
  'assets/recipes/masters/desserts_maitre.png': 'c78ce4b9f00045fa379a600750be40d7ff6be07799d788905782c5e3869e8bd7',
  'assets/recipes/masters/entrees_maitre.png': '2fc3651d74c6a216dd26098a3687a24177aa6738be50b366f7137879839c0d9c',
  'assets/recipes/masters/petit_dejeuner_maitre.png': '8f1b421bfde9305bcacdf935d1c61d67834e94ca0cd62e0e141a36bcd3a9482d',
  'assets/recipes/masters/plats_maitre.png': 'd7b9a7659f84e3e2f63e4a8f4b3b62a2b8d54bc8a1c4a8b82f097013f0bae465',
  'assets/recipes/masters/sauces_maitre.png': 'c97cdb04180219bc1b3e44441632fd8b561b0c4ff1cf9ba5fb4f733ffdd12602',
  'assets/recipes/heroes/accompagnements_maitre.jpg': '7bdbc1194a3560b85c024d77790a69047be081683b30a0421fd156c1640d385a',
  'assets/recipes/heroes/apero_maitre.jpg': '7b63ae12728f64b3024f26d2aa7bb5b342b426cb8a5fd92158f1ca535735148b',
  'assets/recipes/heroes/elements_base_maitre.jpg': '46535d9e1d7d56db6fffe11d7e56d0bf9f6176375df98b44f5848cf9cd2b12e2',
  'assets/recipes/heroes/desserts_maitre.jpg': '395ec32485682952e6f22adbac8b0241802d815a280f3a952357c823eaadde59',
  'assets/recipes/heroes/entrees_maitre.jpg': 'e8bbb2d5e8985226ccecf37a1435e42dd8e5f1a4e62678abe1ef6895ffed1bc9',
  'assets/recipes/heroes/petit_dejeuner_maitre.jpg': '29e783f9bc953187a446252f5c2dca464e12ecdce09190672675b39150e98608',
  'assets/recipes/heroes/plats_maitre.jpg': '5ee0fa8093b55dc0de3116c97b9fdda306d3f55395e99618863ea3307d4438b8',
  'assets/recipes/heroes/sauces_maitre.jpg': '02269369f0245bce62f0ccfcbd24be96b4ae0627cf5c25181a44afde44193124'
});

const errors = [];

function fileHash(relativePath) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(path.join(ROOT, relativePath)))
    .digest('hex');
}

Object.entries(LOCKED_PARENT_ART).forEach(([relativePath, expectedHash]) => {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${relativePath}: image parent verrouillee absente.`);
    return;
  }

  const actualHash = fileHash(relativePath);
  if (actualHash !== expectedHash) {
    errors.push(`${relativePath}: image parent verrouillee modifiee (${actualHash}).`);
  }
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation images parents verrouillees OK (${Object.keys(LOCKED_PARENT_ART).length} images).`);
