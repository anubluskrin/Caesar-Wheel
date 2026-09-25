// function deriveShift(keyText){
//   let sum = 0;
//   for(const ch of keyText) sum += ch.charCodeAt(0);
//   return sum % 26;
// }

// function resolveKeys(keyConfig){
//   return {
//     caesarShift: keyConfig.mode === 'shared' ? deriveShift(keyConfig.shared) : Number(keyConfig.caesar),
//     vigenereKey: keyConfig.mode === 'shared' ? keyConfig.shared : keyConfig.vigenere,
//     rc4Key: keyConfig.mode === 'shared' ? keyConfig.shared : (keyConfig.rc4 || keyConfig.xor)
//   };
// }

// function runSuperEncrypt(text, keyConfig, rsaKeys){
//   const { caesarShift, vigenereKey, rc4Key } = resolveKeys(keyConfig);

//   const s1 = caesarProcess(text, caesarShift, 'encrypt').result;
//   const s2 = vigenereProcess(s1, vigenereKey, 'encrypt').result;
//   const s3 = rc4Process(s2, rc4Key, 'encrypt').result;      // hex string
//   const s4 = rsaProcess(s3, rsaKeys, 'encrypt').result;      // blok angka

//   return {
//     result: s4,
//     stages: [
//       { label: 'Teks Asli', value: text },
//       { label: '1. Setelah Caesar', value: s1 },
//       { label: '2. Setelah Vigenère', value: s2 },
//       { label: '3. Setelah RC4 (hex)', value: s3 },
//       { label: '4. Setelah RSA — hasil akhir', value: s4 }
//     ]
//   };
// }

// function runSuperDecrypt(cipherText, keyConfig, rsaKeys){
//   const { caesarShift, vigenereKey, rc4Key } = resolveKeys(keyConfig);

//   const s1 = rsaProcess(cipherText, rsaKeys, 'decrypt').result;   // hex string
//   const s2 = rc4Process(s1, rc4Key, 'decrypt').result;
//   const s3 = vigenereProcess(s2, vigenereKey, 'decrypt').result;
//   const s4 = caesarProcess(s3, caesarShift, 'decrypt').result;

//   return {
//     result: s4,
//     stages: [
//       { label: 'Cipher Masuk', value: cipherText },
//       { label: '1. Setelah RSA⁻¹', value: s1 },
//       { label: '2. Setelah RC4⁻¹', value: s2 },
//       { label: '3. Setelah Vigenère⁻¹', value: s3 },
//       { label: '4. Setelah Caesar⁻¹ — teks asli', value: s4 }
//     ]
//   };
// }

/**
 * Super Encryption Module
 * Urutan Enkripsi: Caesar -> Vigenère -> DES -> RC4
 * Urutan Dekripsi: RC4 -> DES -> Vigenère -> Caesar
 */

function deriveShift(keyText) {
    let sum = 0;
    for (const ch of keyText) sum += ch.charCodeAt(0);
    return sum % 26;
}

function resolveKeys(keyConfig) {
    return {
        caesarShift: keyConfig.mode === 'shared' ? deriveShift(keyConfig.shared) : Number(keyConfig.caesar),
        vigenereKey: keyConfig.mode === 'shared' ? keyConfig.shared : keyConfig.vigenere,
        desKey: keyConfig.mode === 'shared' ? keyConfig.shared : keyConfig.des,
        rc4Key: keyConfig.mode === 'shared' ? keyConfig.shared : keyConfig.rc4
    };
}

function runSuperEncrypt(text, keyConfig) {
    const { caesarShift, vigenereKey, desKey, rc4Key } = resolveKeys(keyConfig);

    // 1. Caesar
    const s1 = typeof caesarProcess === 'function' 
        ? caesarProcess(text, caesarShift, 'encrypt').result 
        : (typeof encryptCaesar === 'function' ? encryptCaesar(text, caesarShift) : text);

    // 2. Vigenère
    const s2 = typeof vigenereProcess === 'function' 
        ? vigenereProcess(s1, vigenereKey, 'encrypt').result 
        : (typeof encryptVigenere === 'function' ? encryptVigenere(s1, vigenereKey) : s1);

    // 3. DES
    const s3 = typeof desProcess === 'function' 
        ? desProcess(s2, desKey, 'encrypt').result 
        : (typeof encryptDES === 'function' ? encryptDES(s2, desKey) : s2);

    // 4. RC4
    const s4 = typeof rc4Process === 'function' 
        ? rc4Process(s3, rc4Key, 'encrypt').result 
        : (typeof encryptRC4 === 'function' ? encryptRC4(s3, rc4Key) : s3);

    return {
        result: s4,
        stages: [
            { label: 'Teks Asli', value: text },
            { label: '1. Setelah Caesar', value: s1 },
            { label: '2. Setelah Vigenère', value: s2 },
            { label: '3. Setelah DES (hex)', value: s3 },
            { label: '4. Setelah RC4 (hex) — hasil akhir', value: s4 }
        ]
    };
}

function runSuperDecrypt(cipherText, keyConfig) {
    const { caesarShift, vigenereKey, desKey, rc4Key } = resolveKeys(keyConfig);

    // 1. RC4^-1
    const s1 = typeof rc4Process === 'function' 
        ? rc4Process(cipherText, rc4Key, 'decrypt').result 
        : (typeof decryptRC4 === 'function' ? decryptRC4(cipherText, rc4Key) : cipherText);

    // 2. DES^-1
    const s2 = typeof desProcess === 'function' 
        ? desProcess(s1, desKey, 'decrypt').result 
        : (typeof decryptDES === 'function' ? decryptDES(s1, desKey) : s1);

    // 3. Vigenère^-1
    const s3 = typeof vigenereProcess === 'function' 
        ? vigenereProcess(s2, vigenereKey, 'decrypt').result 
        : (typeof decryptVigenere === 'function' ? decryptVigenere(s2, vigenereKey) : s2);

    // 4. Caesar^-1
    const s4 = typeof caesarProcess === 'function' 
        ? caesarProcess(s3, caesarShift, 'decrypt').result 
        : (typeof decryptCaesar === 'function' ? decryptCaesar(s3, caesarShift) : s3);

    return {
        result: s4,
        stages: [
            { label: 'Cipher Masuk', value: cipherText },
            { label: '1. Setelah RC4⁻¹', value: s1 },
            { label: '2. Setelah DES⁻¹', value: s2 },
            { label: '3. Setelah Vigenère⁻¹', value: s3 },
            { label: '4. Setelah Caesar⁻¹ — teks asli', value: s4 }
        ]
    };
}