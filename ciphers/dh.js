// Diffie-Hellman: Alice & Bob sepakat kunci rahasia tanpa pernah mengirim kuncinya langsung

function generateDHParams(bits){
  // p = bilangan prima besar (modulus publik), g = generator publik (angka kecil, biasanya 2 atau 5)
  const p = generatePrime(bits);
  const g = 2n;
  return { p, g };
}

function dhKeyExchange(bits){
  const { p, g } = generateDHParams(bits);

  // masing-masing pihak pilih kunci privat rahasia sendiri (angka acak, tidak pernah dikirim)
  const a = (randomBigInt(Math.max(4, bits - 2)) % (p - 2n)) + 1n; // privat Alice
  const b = (randomBigInt(Math.max(4, bits - 2)) % (p - 2n)) + 1n; // privat Bob

  // masing-masing hitung & kirim kunci publik
  const A = modPow(g, a, p); // publik Alice = g^a mod p
  const B = modPow(g, b, p); // publik Bob   = g^b mod p

  // masing-masing hitung kunci rahasia bersama dari kunci publik lawan + kunci privat sendiri
  const secretFromAlice = modPow(B, a, p); // Alice: B^a mod p
  const secretFromBob   = modPow(A, b, p); // Bob:   A^b mod p
  // secretFromAlice === secretFromBob, itulah intinya DH

  const steps = [
    { label: 'Sepakati parameter publik', detail: `p (prima) = ${p}, g (generator) = ${g}` },
    { label: 'Alice pilih kunci privat', detail: `a = ${a} (rahasia, tidak dikirim)` },
    { label: 'Bob pilih kunci privat', detail: `b = ${b} (rahasia, tidak dikirim)` },
    { label: 'Alice hitung & kirim kunci publik', detail: `A = g^a mod p = ${A}` },
    { label: 'Bob hitung & kirim kunci publik', detail: `B = g^b mod p = ${B}` },
    { label: 'Alice hitung rahasia bersama', detail: `K = B^a mod p = ${secretFromAlice}` },
    { label: 'Bob hitung rahasia bersama', detail: `K = A^b mod p = ${secretFromBob}` },
    { label: 'Verifikasi', detail: secretFromAlice === secretFromBob ? 'Kedua pihak dapat kunci sama ✔' : 'MISMATCH — seharusnya tidak terjadi' }
  ];

  return { p, g, a, b, A, B, sharedSecret: secretFromAlice, steps };
}

// kunci rahasia (angka besar) diturunkan jadi string kunci XOR
function deriveXorKeyFromSecret(secretBigInt){
  const hex = secretBigInt.toString(16);
  // ambil tiap 2 karakter hex jadi 1 byte karakter kunci
  let key = '';
  for(let i = 0; i < hex.length; i += 2){
    const byte = parseInt(hex.substr(i, 2).padEnd(2, '0'), 16);
    key += String.fromCharCode(byte === 0 ? 1 : byte); // hindari byte 0
  }
  return key.slice(0, 16) || 'K'; // batasi panjang wajar
}

function dhProcess(text, dhResult, mode){
  const xorKey = deriveXorKeyFromSecret(dhResult.sharedSecret);
  const xorResult = xorProcess(text, xorKey, mode); // reuse fungsi dari ciphers/xor.js
  return { result: xorResult.result, xorSteps: xorResult.steps, xorKey };
}