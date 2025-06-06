import * as bcrypt from 'bcrypt';

async function generateHash() {
  const plainPassword = 'admin123';
  const saltRounds = 10;
  
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Password:', plainPassword);
  console.log('Generated hash:', hashedPassword);
}

generateHash().catch(console.error);