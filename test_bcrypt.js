import * as bcrypt from 'bcryptjs';

// Test script to verify bcrypt functionality
async function testBcrypt() {
  const password = 'test123';

  console.log('Testing bcrypt functionality...');

  // Test hash generation
  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash(password, 10);

  console.log('Hash 1:', hash1);
  console.log('Hash 2:', hash2);
  console.log('Hashes are different:', hash1 !== hash2);

  // Test comparison
  const compare1 = await bcrypt.compare(password, hash1);
  const compare2 = await bcrypt.compare(password, hash2);
  const compareFalse = await bcrypt.compare('wrong', hash1);

  console.log('Compare with hash1:', compare1);
  console.log('Compare with hash2:', compare2);
  console.log('Compare with wrong password:', compareFalse);

  // Test known hash
  const knownHash = '$2b$10$abcdefghijklmnopqrstuv';
  try {
    const compareKnown = await bcrypt.compare('test', knownHash);
    console.log('Compare with known hash:', compareKnown);
  } catch (error) {
    console.log('Error with known hash:', error.message);
  }
}

testBcrypt().catch(console.error);
