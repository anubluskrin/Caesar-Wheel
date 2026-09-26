function deriveShift(keyText){
  let sum = 0;
  for(const ch of keyText) sum += ch.charCodeAt(0);
  return sum % 26;
}

function resolveKeys(keyConfig){
  if(keyConfig.mode === 'shared'){
    return {
      caesarShift: deriveShift(keyConfig.shared),
      vigenereKey: keyConfig.shared,
      rc4Key: keyConfig.shared,
      desKey: keyConfig.shared // desProcess otomatis potong/pad jadi 8 karakter
    };
  }
  return {
    caesarShift: Number(keyConfig.caesar),
    vigenereKey: keyConfig.vigenere,
    rc4Key: keyConfig.rc4,
    desKey: keyConfig.des
  };
}

function runSuperEncrypt(text, keyConfig){
  const { caesarShift, vigenereKey, rc4Key, desKey } = resolveKeys(keyConfig);

  const s1 = caesarProcess(text, caesarShift, 'encrypt').result;
  const s2 = vigenereProcess(s1, vigenereKey, 'encrypt').result;
  const s3 = rc4Process(s2, rc4Key, 'encrypt').result;       // hex string
  const s4 = desProcess(s3, desKey, 'encrypt').result;        // hex string

  return {
    result: s4,
    stages: [
      { label: 'Teks Asli', value: text },
      { label: '1. Setelah Caesar', value: s1 },
      { label: '2. Setelah Vigenère', value: s2 },
      { label: '3. Setelah RC4 (hex)', value: s3 },
      { label: '4. Setelah DES — hasil akhir (hex)', value: s4 }
    ]
  };
}

function runSuperDecrypt(cipherText, keyConfig){
  const { caesarShift, vigenereKey, rc4Key, desKey } = resolveKeys(keyConfig);

  const s1 = desProcess(cipherText, desKey, 'decrypt').result; // hex -> hex (RC4 masih dalam bentuk hex)
  const s2 = rc4Process(s1, rc4Key, 'decrypt').result;
  const s3 = vigenereProcess(s2, vigenereKey, 'decrypt').result;
  const s4 = caesarProcess(s3, caesarShift, 'decrypt').result;

  return {
    result: s4,
    stages: [
      { label: 'Cipher Masuk', value: cipherText },
      { label: '1. Setelah DES⁻¹ (hex)', value: s1 },
      { label: '2. Setelah RC4⁻¹', value: s2 },
      { label: '3. Setelah Vigenère⁻¹', value: s3 },
      { label: '4. Setelah Caesar⁻¹ — teks asli', value: s4 }
    ]
  };
}