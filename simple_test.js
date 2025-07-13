const bcrypt = require('bcryptjs');

async function testBcrypt() {
  const password = 'test123';

  console.log('Testing bcrypt functionality...');

  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash(password, 10);

  console.log('Hash 1:', hash1);
  console.log('Hash 2:', hash2);
  console.log('Hashes are different:', hash1 !== hash2);

  const compare1 = await bcrypt.compare(password, hash1);
  const compare2 = await bcrypt.compare(password, hash2);
  const compareFalse = await bcrypt.compare('wrong', hash1);

  console.log('Compare with hash1:', compare1);
  console.log('Compare with hash2:', compare2);
  console.log('Compare with wrong password:', compareFalse);
}

testBcrypt().catch(console.error);
