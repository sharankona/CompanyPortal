import * as bcrypt from 'bcrypt';

async function comparePasswords() {
  const plainPassword = 'admin123';
  const hashedPassword = '$2b$10$hACwQ5HInSKYuX5c1xCagennsF/QchuCfWzwDIm7EyA.5xOu5gJ2a';
  
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);
  
  const result = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Comparison result:', result);
  
  // Let's also generate a new hash for this password to see if it matches the pattern
  const newHash = await bcrypt.hash(plainPassword, 10);
  console.log('New hashed password:', newHash);
  
  // Verify the new hash
  const verifyNewHash = await bcrypt.compare(plainPassword, newHash);
  console.log('New hash verification:', verifyNewHash);
}

comparePasswords().catch(console.error);