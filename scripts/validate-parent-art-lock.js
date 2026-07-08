const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const LOCKED_PARENT_ART = Object.freeze({
  'assets/theme/dark/categories/accompagnements_maitre.jpg': '878893e9b2806a5c531957e19ef9b75332149d503aa9112a4c72a779043a2c8f',
  'assets/theme/dark/categories/apero_maitre.jpg': '3cf91cfac73356805a39f1ce6622a550dd456f01913b682b386051023ec4fa59',
  'assets/theme/dark/recipes/bases_salees_maitre.jpg': 'f0848e9884e2d6de49a91b6b57fd5a3887e06ae592f640e8df93b13124a7862b',
  'assets/theme/dark/recipes/biscuits_gouters_maitre.jpg': '2e899e7988ff577ec5c2892fa0ab01b34f8da11ef3e75c4564faf9b7f580d28a',
  'assets/theme/dark/recipes/chantilly_maitre.jpg': 'edb97a5b176e92b9e593e8b19c50eb0d1e12570b7728f9740c83084dfca1a315',
  'assets/theme/dark/recipes/cookies_sucres_maitre.jpg': '8ed9f53699888928ef1aebd36f75a2ed6d9f8cd114e3da9fabad55fd92edb35b',
  'assets/theme/dark/recipes/coulis_maitre.jpg': 'c0c4e2c55cd1149f855a0378e25bf16b63be2a2e2fca81a0194e23478ec62240',
  'assets/theme/dark/recipes/cremes_maitre.jpg': '2da5b9359323bf4d76e1280ba5f556756d563c3601a408b27fb0b8b9ff9a823d',
  'assets/theme/dark/recipes/crudites_maitre.jpg': 'a7fba93621537db7788e3292235b7138988097ac794e9ff1aeff94e2ff99ebcb',
  'assets/theme/dark/recipes/desserts_cuillere_maitre.jpg': '014f5f6776347266e889417d383afeaf7da91db86207de5080c3ce00c682c573',
  'assets/theme/dark/categories/desserts_maitre.jpg': 'e845d9e1aad0e0b3b78488b1ab638442b8db0c470fe42d29d84e1b846c1c5f4e',
  'assets/theme/dark/categories/elements_base_maitre.jpg': '49ba8b25973256c8be18669209b6207856059e84e5f1cdaa96f6661b46586fb7',
  'assets/theme/dark/categories/entrees_maitre.jpg': 'c4728d6199ad00465d7464b3b2416069f8a2e7d3bef7b6cddd0e0ec0ee9e18c0',
  'assets/theme/dark/recipes/pates_bases_maitre.jpg': 'e4e6e7030ad62bae9473f7bf74d9c735aa07d9077ab43d33196f104402e2c9da',
  'assets/theme/dark/categories/petit_dejeuner_maitre.jpg': 'a507fcd6d6a253b3cb1adf02433969cfe697d280381a62411e018628373e470c',
  'assets/theme/dark/categories/plats_maitre.jpg': 'eb719e667f63f17b17fcdf5db8b240409b9b1d2da823b3226b12f4277dd3be39',
  'assets/theme/dark/recipes/sauces_assaisonnements_maitre.jpg': 'b0405ab6a3240d640312a9b8e2803c0910d9b26813bd7af141138334cd728a7b',
  'assets/theme/dark/categories/sauces_maitre.jpg': 'd66eecb4c5b4de64be003a069915921a575d762db6b0ba0610b2a15e1b51d6de',
  'assets/theme/dark/recipes/tartes_maitre.jpg': 'bfba42253f5f200ebe01b8c5fdf636429771d5e629fd5aa0f1744e997bc0c4bb',
  'assets/theme/dark/recipes/tomates_maitre.jpg': 'f3bc3b7254295e9355ebca19d45205e89c786a8682493e7e15c182a1ca8f711b',
  'assets/theme/day/recipes/bases_salees_maitre.jpg': '9d26483c55c5fd6c55bf7b5d8ffbafca27a6bfd5ac4cf0cc29da7d0a3b89d9d6',
  'assets/theme/day/recipes/biscuits_gouters_maitre.jpg': '5c3c218d4c62db79b735cd61f5ec36ef290a7be5084558559d7de697e6266f85',
  'assets/theme/day/recipes/chantilly_maitre.jpg': '6c7f730754da803ac6cb23dff10e2c707395326e97940840095a55409f808adb',
  'assets/theme/day/recipes/cookies_sucres_maitre.jpg': '7a8ab5776ca23c9285a639a4a4793d32594f9cc884e21435da82e067722c69b8',
  'assets/theme/day/recipes/coulis_maitre.jpg': '64ebb6ebaa6dfeb7723a7347c87adfebab24baa2485eb7c4250d2f48d523b398',
  'assets/theme/day/recipes/cremes_maitre.jpg': '7cf4d581c91569e0075ca5297ffb3ababc6852b8192d778891be4ded366e53cb',
  'assets/theme/day/recipes/crudites_maitre.jpg': '915e399decc682fb51849bf45a50b15d0b1b05a3f3fc260ff55f9c77617f3320',
  'assets/theme/day/recipes/desserts_cuillere_maitre.jpg': 'b9354113539dc7c49cac5b677cb3b2985940a8e5d79cc190f65771a732fa0b11',
  'assets/theme/day/recipes/pates_bases_maitre.jpg': '583337662af8333751f41001635d3f5a9a5419bca6b2b209bd5715d7b509f2aa',
  'assets/theme/day/recipes/sauces_assaisonnements_maitre.jpg': 'f971d5772d82889b581a060c7f5f9c3c1bd2c96795e22099f6ae06d01f198c17',
  'assets/theme/day/recipes/tartes_maitre.jpg': '0fc96d112465e9789fa74990d19f9ec7919fde4765acf245c45753a710cad8ab',
  'assets/theme/day/recipes/tomates_maitre.jpg': '2a24ad324f14265802f9331773be7fb8dba0be0d0ad67d76fadd107c007bcb30',
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
