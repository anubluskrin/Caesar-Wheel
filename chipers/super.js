function deriveShift(keyText){
  let sum = 0;
  for(const ch of keyText) sum += ch.charCodeAt(0);
  return sum % 26;
}

function resolveKeys(keyConfig){
  return {
    caesarShift: keyConfig.mode === 'shared' ? deriveShift(keyConfig.shared) : Number(keyConfig.caesar),
    vigenereKey: keyConfig.mode === 'shared' ? keyConfig.shared : keyConfig.vigenere,
    xorKey: keyConfig.mode === 'shared' ? keyConfig.shared : keyConfig.xor
  };
}

function runSuperEncrypt(text, keyConfig, rsaKeys){
  const { caesarShift, vigenereKey, xorKey } = resolveKeys(keyConfig);

  const s1 = caesarProcess(text, caesarShift, 'encrypt').result;
  const s2 = vigenereProcess(s1, vigenereKey, 'encrypt').result;
  const s3 = xorProcess(s2, xorKey, 'encrypt').result;      // hex string
  const s4 = rsaProcess(s3, rsaKeys, 'encrypt').result;      // blok angka

  return {
    result: s4,
    stages: [
      { label: 'Teks Asli', value: text },
      { label: '1. Setelah Caesar', value: s1 },
      { label: '2. Setelah Vigenère', value: s2 },
      { label: '3. Setelah XOR (hex)', value: s3 },
      { label: '4. Setelah RSA — hasil akhir', value: s4 }
    ]
  };
}

function runSuperDecrypt(cipherText, keyConfig, rsaKeys){
  const { caesarShift, vigenereKey, xorKey } = resolveKeys(keyConfig);

  const s1 = rsaProcess(cipherText, rsaKeys, 'decrypt').result;   // hex string
  const s2 = xorProcess(s1, xorKey, 'decrypt').result;
  const s3 = vigenereProcess(s2, vigenereKey, 'decrypt').result;
  const s4 = caesarProcess(s3, caesarShift, 'decrypt').result;

  return {
    result: s4,
    stages: [
      { label: 'Cipher Masuk', value: cipherText },
      { label: '1. Setelah RSA⁻¹', value: s1 },
      { label: '2. Setelah XOR⁻¹', value: s2 },
      { label: '3. Setelah Vigenère⁻¹', value: s3 },
      { label: '4. Setelah Caesar⁻¹ — teks asli', value: s4 }
    ]
  };
}