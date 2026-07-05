const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const LOCKED_PARENT_ART = Object.freeze({
  'assets/dark/recipe-accompagnements_maitre-dark.jpg': '719bf75d01ccb4bd3d21be7b0ebb003eebb6d2d41ffef4bf5c4b7cac257affee',
  'assets/dark/recipe-apero_maitre-dark.jpg': '0e1c395f3d626783412abd877eac67dcc06f30e27f82ceb6f10c67bc32c3716b',
  'assets/dark/recipe-bases_salees_maitre-dark.jpg': '9376bb5db80fcbb096353783354a0a1642fe813578ae26fee4092f102543e094',
  'assets/dark/recipe-biscuits_gouters_maitre-dark.jpg': '2e899e7988ff577ec5c2892fa0ab01b34f8da11ef3e75c4564faf9b7f580d28a',
  'assets/dark/recipe-chantilly_maitre-dark.jpg': '7546d3304affa5a3b179a87937e10c4195bc7a7740f5e5e2d15da964a9976731',
  'assets/dark/recipe-cookies_sucres_maitre-dark.jpg': '8ed9f53699888928ef1aebd36f75a2ed6d9f8cd114e3da9fabad55fd92edb35b',
  'assets/dark/recipe-coulis_maitre-dark.jpg': 'ea012784309fc84d063fcd8ea92e6e4f824b8ad67b6b07cad76322f488251238',
  'assets/dark/recipe-cremes_maitre-dark.jpg': '2da5b9359323bf4d76e1280ba5f556756d563c3601a408b27fb0b8b9ff9a823d',
  'assets/dark/recipe-crudites_maitre-dark.jpg': '09344aea1f1739de6c3ccb4ba053ca7c18b4bfcb27f3eae21add6d6c8dde8d41',
  'assets/dark/recipe-desserts_cuillere_maitre-dark.jpg': '014f5f6776347266e889417d383afeaf7da91db86207de5080c3ce00c682c573',
  'assets/dark/recipe-desserts_maitre-dark.jpg': '9f58ff1212e7db1fe90ebf280dbfa5877482065a840f99240510388d7f1f3b32',
  'assets/dark/recipe-elements_base_maitre-dark.jpg': '312957e02bc551dee1939169f88640c3efe4f6b3752eca4ec432acea105d18bc',
  'assets/dark/recipe-entrees_maitre-dark.jpg': 'db40db4bff0100b181c5e36a71027e8950c3b53a4751c9a2a24a10a501382bf9',
  'assets/dark/recipe-pates_bases_maitre-dark.jpg': 'f683960ad52b90587ea3f24dd6087d062e1077cce2e39a7be422299bf7b978f0',
  'assets/dark/recipe-petit_dejeuner_maitre-dark.jpg': 'd0e6b0a77c07a51e42e618ec0844969dffef356dab000f63a97271e288d2be5e',
  'assets/dark/recipe-plats_maitre-dark.jpg': '25407cb098d48dafa7dfd82d26e1e48d96bbdc7e583b1968c6e7efeb403f4c8d',
  'assets/dark/recipe-sauces_assaisonnements_maitre-dark.jpg': '95832576017a6193667b76e59655aad8aaaf60eccf5b74b77c2bc99ac825215c',
  'assets/dark/recipe-sauces_maitre-dark.jpg': '74af81dbc5adb5d621e3ab490890a852d118525ca62c16d57efffe3dd60befa3',
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
  'assets/recipe-card-images/parent_accompagnements_moon.jpg': 'a86ae0da68cb1c58e3ad0f8ff7e49b0f73195ea3e8ce7ef6b659bc523bc2e304',
  'assets/recipe-card-images/parent_apero_moon.jpg': '71c812ea74df3d48aa25796a57ea90546eb2246746bc29ff35a9acda4b0afc6a',
  'assets/recipe-card-images/parent_base_moon.jpg': '470463ed3f0f42d8e1ddb4709f07894ad931730ea54a6128f2f716dae4b2008e',
  'assets/recipe-card-images/parent_desserts_moon.jpg': '2f30168f26440126b73800f4417f2b17f35a8c00f3be510f96566254c30269e2',
  'assets/recipe-card-images/parent_entrees_moon.jpg': 'f133abf3bf5fac2ebd6730658532f23b5930c176d86f66be49a72689f60e10d7',
  'assets/recipe-card-images/parent_petit_dejeuner_moon.jpg': '8439d0505381aca41a33aeb0dca2cdbf480fb7f2cd974af75341a89152e3e520',
  'assets/recipe-card-images/parent_plats_moon.jpg': 'fa9f25626b882f05b9bbd479ce09542e52601f43d941a99c50d4b9de30dd1ff9',
  'assets/recipe-card-images/parent_sauces_moon.jpg': '8da438de755a3da5837fa5b7ebf0bf4108e47a1795524e5584d38b6e2bc2d8e9',
  'assets/recipe-images/parent_accompagnements_moon.png': '9b835eb36af8f51f3b0aece63fc7021bd3efbd813a959aa1f30ff3d788fb401a',
  'assets/recipe-images/parent_apero_moon.png': '342717635818ec021643ba6726bcba7826c4cf5db5951217e667624d5e0cc962',
  'assets/recipe-images/parent_base_moon.png': '1c9b1e1c4157ad48d85439c5513b39a3aafda11181d45afc7e71eb7093aca3e1',
  'assets/recipe-images/parent_desserts_moon.png': 'fade9f5f2579b5985d889fd72a8468ddc2aa8151a2c501328f7dea6e8c15f84d',
  'assets/recipe-images/parent_entrees_moon.png': '39ee8e31015111696f15f05b907e851f802304530c283cbebed44946e1afe058',
  'assets/recipe-images/parent_petit_dejeuner_moon.png': 'f193a7806d40e4d1bb3228085fb5bf1c50ce45ffb51b00e1915a91122c19b15b',
  'assets/recipe-images/parent_plats_moon.png': 'fb83854d84acdb3539a5fe05907ad99ecd80fb5b899fe825e76d4b378d140874',
  'assets/recipe-images/parent_sauces_moon.png': '12fe349e51c6b79560680be2e26a80ee1d9eb3c1e612f82a6d6090d85ab0803d',
  'assets/recipe-images-optimized/parent_accompagnements_moon.jpg': '5772bdd28edda043645cb3cfd6a42a2ad1e8754e1d7aa35825769a95b705343d',
  'assets/recipe-images-optimized/parent_apero_moon.jpg': '267398811219a11009ddb3d8a233295852d7caa82ae326ca6dc837c215d72753',
  'assets/recipe-images-optimized/parent_base_moon.jpg': '064cb16805c4bdc2a976c22d1dc3f55025f34c12d4f2d1f9383d1a67dda84d24',
  'assets/recipe-images-optimized/parent_desserts_moon.jpg': '22234baaed4f0226463076923ca87bf9d08577ca7b62b34bc2d3609e56f0d423',
  'assets/recipe-images-optimized/parent_entrees_moon.jpg': 'b064389ee87824eba65f414b5f988acc9f360991f9a4c7685ce1fa622912e81f',
  'assets/recipe-images-optimized/parent_petit_dejeuner_moon.jpg': '4028bc0b2b2ec68dbe388b351e7b1f09ad8b257ea0e5fb1686db92c9ab6e25df',
  'assets/recipe-images-optimized/parent_plats_moon.jpg': 'e780af96c084e81bfd2ea8afd232305b68a7e554e6cfb7a057f9a5eb0e4e181d',
  'assets/recipe-images-optimized/parent_sauces_moon.jpg': '6ef07b67d3dc3887fc3b2c17c3154e0b8b0c8e2cf5b43467c94bc31b37b19562'
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
