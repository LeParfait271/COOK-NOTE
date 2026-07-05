const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const LOCKED_PARENT_ART = Object.freeze({
  'assets/dark/recipe-accompagnements_maitre-dark.jpg': '878893e9b2806a5c531957e19ef9b75332149d503aa9112a4c72a779043a2c8f',
  'assets/dark/recipe-apero_maitre-dark.jpg': '3cf91cfac73356805a39f1ce6622a550dd456f01913b682b386051023ec4fa59',
  'assets/dark/recipe-bases_salees_maitre-dark.jpg': '9376bb5db80fcbb096353783354a0a1642fe813578ae26fee4092f102543e094',
  'assets/dark/recipe-biscuits_gouters_maitre-dark.jpg': '2e899e7988ff577ec5c2892fa0ab01b34f8da11ef3e75c4564faf9b7f580d28a',
  'assets/dark/recipe-chantilly_maitre-dark.jpg': '7546d3304affa5a3b179a87937e10c4195bc7a7740f5e5e2d15da964a9976731',
  'assets/dark/recipe-cookies_sucres_maitre-dark.jpg': '8ed9f53699888928ef1aebd36f75a2ed6d9f8cd114e3da9fabad55fd92edb35b',
  'assets/dark/recipe-coulis_maitre-dark.jpg': 'ea012784309fc84d063fcd8ea92e6e4f824b8ad67b6b07cad76322f488251238',
  'assets/dark/recipe-cremes_maitre-dark.jpg': '2da5b9359323bf4d76e1280ba5f556756d563c3601a408b27fb0b8b9ff9a823d',
  'assets/dark/recipe-crudites_maitre-dark.jpg': '09344aea1f1739de6c3ccb4ba053ca7c18b4bfcb27f3eae21add6d6c8dde8d41',
  'assets/dark/recipe-desserts_cuillere_maitre-dark.jpg': '014f5f6776347266e889417d383afeaf7da91db86207de5080c3ce00c682c573',
  'assets/dark/recipe-desserts_maitre-dark.jpg': 'e845d9e1aad0e0b3b78488b1ab638442b8db0c470fe42d29d84e1b846c1c5f4e',
  'assets/dark/recipe-elements_base_maitre-dark.jpg': '49ba8b25973256c8be18669209b6207856059e84e5f1cdaa96f6661b46586fb7',
  'assets/dark/recipe-entrees_maitre-dark.jpg': 'c4728d6199ad00465d7464b3b2416069f8a2e7d3bef7b6cddd0e0ec0ee9e18c0',
  'assets/dark/recipe-pates_bases_maitre-dark.jpg': 'f683960ad52b90587ea3f24dd6087d062e1077cce2e39a7be422299bf7b978f0',
  'assets/dark/recipe-petit_dejeuner_maitre-dark.jpg': 'a507fcd6d6a253b3cb1adf02433969cfe697d280381a62411e018628373e470c',
  'assets/dark/recipe-plats_maitre-dark.jpg': 'eb719e667f63f17b17fcdf5db8b240409b9b1d2da823b3226b12f4277dd3be39',
  'assets/dark/recipe-sauces_assaisonnements_maitre-dark.jpg': '95832576017a6193667b76e59655aad8aaaf60eccf5b74b77c2bc99ac825215c',
  'assets/dark/recipe-sauces_maitre-dark.jpg': 'd66eecb4c5b4de64be003a069915921a575d762db6b0ba0610b2a15e1b51d6de',
  'assets/dark/recipe-tartes_maitre-dark.jpg': 'bfba42253f5f200ebe01b8c5fdf636429771d5e629fd5aa0f1744e997bc0c4bb',
  'assets/dark/recipe-tomates_maitre-dark.jpg': '19e6ed9bded2ae23760c6eac537b47a567283648b0e68b38085b355ceecdc9ed',
  'assets/day/recipe-accompagnements_maitre-day.jpg': '6e13de33059bbb39b9164a67eaaeae0b11c1fe5eee9dc00a61483228120be52f',
  'assets/day/recipe-apero_maitre-day.jpg': '270e9f702396e156ded335f279954d94f4b8968334d94a2840949fc1d89079cf',
  'assets/day/recipe-bases_salees_maitre-day.jpg': '9d26483c55c5fd6c55bf7b5d8ffbafca27a6bfd5ac4cf0cc29da7d0a3b89d9d6',
  'assets/day/recipe-biscuits_gouters_maitre-day.jpg': '5c3c218d4c62db79b735cd61f5ec36ef290a7be5084558559d7de697e6266f85',
  'assets/day/recipe-chantilly_maitre-day.jpg': '6c7f730754da803ac6cb23dff10e2c707395326e97940840095a55409f808adb',
  'assets/day/recipe-cookies_sucres_maitre-day.jpg': '7a8ab5776ca23c9285a639a4a4793d32594f9cc884e21435da82e067722c69b8',
  'assets/day/recipe-coulis_maitre-day.jpg': '64ebb6ebaa6dfeb7723a7347c87adfebab24baa2485eb7c4250d2f48d523b398',
  'assets/day/recipe-cremes_maitre-day.jpg': '7cf4d581c91569e0075ca5297ffb3ababc6852b8192d778891be4ded366e53cb',
  'assets/day/recipe-crudites_maitre-day.jpg': '915e399decc682fb51849bf45a50b15d0b1b05a3f3fc260ff55f9c77617f3320',
  'assets/day/recipe-desserts_cuillere_maitre-day.jpg': 'b9354113539dc7c49cac5b677cb3b2985940a8e5d79cc190f65771a732fa0b11',
  'assets/day/recipe-desserts_maitre-day.jpg': '156dea843de42e3d7012d3a59e54cec6adb9359a8a605b4d695fd649141ce04b',
  'assets/day/recipe-elements_base_maitre-day.jpg': 'e248aac0563fb34fa13f7c1efacad74e758a54d987c9a46001e95add35d8de34',
  'assets/day/recipe-entrees_maitre-day.jpg': 'c6aa47909152a9f4d92a6d2947946141335c501a9d10fd54bd6152b064dae633',
  'assets/day/recipe-pates_bases_maitre-day.jpg': '583337662af8333751f41001635d3f5a9a5419bca6b2b209bd5715d7b509f2aa',
  'assets/day/recipe-petit_dejeuner_maitre-day.jpg': 'af372441c370b78333be3d690c33c06e75c1aeb63c3b4ccca5c7e5211122e19f',
  'assets/day/recipe-plats_maitre-day.jpg': 'ef282d4a73a791ae2f06c2d35365e57de5308dc2cdd85fb4b98b6530f475aa78',
  'assets/day/recipe-sauces_assaisonnements_maitre-day.jpg': 'f971d5772d82889b581a060c7f5f9c3c1bd2c96795e22099f6ae06d01f198c17',
  'assets/day/recipe-sauces_maitre-day.jpg': 'e4f2e84b574a9837ecf4c56116bc29d55de3a9b6425dd1e65f1fe7e2f4a56bb5',
  'assets/day/recipe-tartes_maitre-day.jpg': '0fc96d112465e9789fa74990d19f9ec7919fde4765acf245c45753a710cad8ab',
  'assets/day/recipe-tomates_maitre-day.jpg': '2a24ad324f14265802f9331773be7fb8dba0be0d0ad67d76fadd107c007bcb30',
  'assets/recipe-card-images/parent_accompagnements_moon.jpg': 'fde1bf1fdd731522afae7889077fd1f5d208397e469111bac030929e1f3b0603',
  'assets/recipe-card-images/parent_apero_moon.jpg': '1a42a08b71c2c040ad07aa8e08020d89238251a8a669d1b59b4214037d973126',
  'assets/recipe-card-images/parent_base_moon.jpg': 'bf3580fcc2ead802fe1a5e4814fb7dc3638552ff06b5b0905fb96919bd8d0cb9',
  'assets/recipe-card-images/parent_desserts_moon.jpg': '7538751a251cbfdcd9eab56230526bd1504af5a7674c669ce4f428799920eb0d',
  'assets/recipe-card-images/parent_entrees_moon.jpg': '238cd9d13cc9faff2f2a9f04fd19cc32279abeee909c17732bd223b5017806ee',
  'assets/recipe-card-images/parent_petit_dejeuner_moon.jpg': '28108045500a4da52541c499eec40f666fc1970a038985bc82f6ba1436d49bec',
  'assets/recipe-card-images/parent_plats_moon.jpg': '8d95463a45a2e5c81f76924a82446b48e92e8ab05eb267a150ff586567dfdaa9',
  'assets/recipe-card-images/parent_sauces_moon.jpg': '9fe25b4fcc57c544582c99da07d90de61447cd741daa21e0bb351a9c1472a25f',
  'assets/recipe-images/parent_accompagnements_moon.png': '3a5668da91bad375643ab290a50a1b0779199dbbf4e6846daa6583d83d3c9daa',
  'assets/recipe-images/parent_apero_moon.png': 'cd10272ef4ffd25872d1a94f8a85027d05dfa7efa5c123130a9d8e9baef47c8a',
  'assets/recipe-images/parent_base_moon.png': 'bc716f28644db19f6eb967433639c3bbb1196ccdaa28e84065432bcc650b4ba3',
  'assets/recipe-images/parent_desserts_moon.png': 'c78ce4b9f00045fa379a600750be40d7ff6be07799d788905782c5e3869e8bd7',
  'assets/recipe-images/parent_entrees_moon.png': '2fc3651d74c6a216dd26098a3687a24177aa6738be50b366f7137879839c0d9c',
  'assets/recipe-images/parent_petit_dejeuner_moon.png': '8f1b421bfde9305bcacdf935d1c61d67834e94ca0cd62e0e141a36bcd3a9482d',
  'assets/recipe-images/parent_plats_moon.png': 'd7b9a7659f84e3e2f63e4a8f4b3b62a2b8d54bc8a1c4a8b82f097013f0bae465',
  'assets/recipe-images/parent_sauces_moon.png': 'c97cdb04180219bc1b3e44441632fd8b561b0c4ff1cf9ba5fb4f733ffdd12602',
  'assets/recipe-images-optimized/parent_accompagnements_moon.jpg': '7bdbc1194a3560b85c024d77790a69047be081683b30a0421fd156c1640d385a',
  'assets/recipe-images-optimized/parent_apero_moon.jpg': '7b63ae12728f64b3024f26d2aa7bb5b342b426cb8a5fd92158f1ca535735148b',
  'assets/recipe-images-optimized/parent_base_moon.jpg': '46535d9e1d7d56db6fffe11d7e56d0bf9f6176375df98b44f5848cf9cd2b12e2',
  'assets/recipe-images-optimized/parent_desserts_moon.jpg': '395ec32485682952e6f22adbac8b0241802d815a280f3a952357c823eaadde59',
  'assets/recipe-images-optimized/parent_entrees_moon.jpg': 'e8bbb2d5e8985226ccecf37a1435e42dd8e5f1a4e62678abe1ef6895ffed1bc9',
  'assets/recipe-images-optimized/parent_petit_dejeuner_moon.jpg': '29e783f9bc953187a446252f5c2dca464e12ecdce09190672675b39150e98608',
  'assets/recipe-images-optimized/parent_plats_moon.jpg': '5ee0fa8093b55dc0de3116c97b9fdda306d3f55395e99618863ea3307d4438b8',
  'assets/recipe-images-optimized/parent_sauces_moon.jpg': '02269369f0245bce62f0ccfcbd24be96b4ae0627cf5c25181a44afde44193124'
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
