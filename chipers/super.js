function runSuperEncrypt(text, mode, keys) {
  // mode: 'shared' | 'separate'
  // keys: { shared: "..." } atau { caesar, vigenere, xor }

  const caesarKey = mode === 'shared' ? deriveShift(keys.shared) : keys.caesar;
  const vigenereKey = mode === 'shared' ? keys.shared : keys.vigenere;
  const xorKey = mode === 'shared' ? keys.shared : keys.xor;

  const step1 = caesarEncrypt(text, caesarKey);
  const step2 = vigenereEncrypt(step1, vigenereKey);
  const step3 = xorEncrypt(step2, xorKey);
  const step4 = rsaEncrypt(step3, rsaPublicKey); // RSA key selalu terpisah, di-generate sendiri

  return { step1, step2, step3, step4 };
}