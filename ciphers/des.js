// ===== Tabel standar DES =====
const DES_IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
const DES_FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
const DES_E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
const DES_P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
const DES_PC1 = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
const DES_PC2 = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
const DES_SHIFTS = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];

const DES_SBOX = [
[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],
[[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],
[[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],
[[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],
[[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],
[[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],
[[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],
[[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]
];

// ===== helper bit-level =====
function desPermute(bits, table){ return table.map(pos => bits[pos - 1]); }
function desXor(a, b){ return a.map((v, i) => v ^ b[i]); }
function desShiftLeft(bits, n){ return bits.slice(n).concat(bits.slice(0, n)); }
function desBytesToBits(bytes){
  const bits = [];
  for(const b of bytes) for(let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  return bits;
}
function desBitsToBytes(bits){
  const bytes = [];
  for(let i = 0; i < bits.length; i += 8){
    let byte = 0;
    for(let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    bytes.push(byte);
  }
  return bytes;
}
function desBitsToHex(bits){
  return desBitsToBytes(bits).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== key schedule: 1 kunci 64-bit -> 16 subkey 48-bit =====
function desGenerateSubkeys(keyBytes){
  const keyBits = desBytesToBits(keyBytes);
  const permuted = desPermute(keyBits, DES_PC1); // 56 bit
  let C = permuted.slice(0, 28);
  let D = permuted.slice(28, 56);
  const subkeys = [];
  for(let round = 0; round < 16; round++){
    C = desShiftLeft(C, DES_SHIFTS[round]);
    D = desShiftLeft(D, DES_SHIFTS[round]);
    subkeys.push(desPermute(C.concat(D), DES_PC2));
  }
  return subkeys;
}

// ===== fungsi Feistel f(R, subkey) =====
function desFeistel(R, subkey){
  const expanded = desPermute(R, DES_E); // 32 -> 48 bit
  const xored = desXor(expanded, subkey);
  let sOutput = [];
  for(let i = 0; i < 8; i++){
    const block = xored.slice(i * 6, i * 6 + 6);
    const row = (block[0] << 1) | block[5];
    const col = (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4];
    const val = DES_SBOX[i][row][col];
    for(let b = 3; b >= 0; b--) sOutput.push((val >> b) & 1);
  }
  return desPermute(sOutput, DES_P); // 32 bit
}

// ===== proses 1 blok 64-bit, 16 ronde Feistel =====
// Setiap langkah dicatat sebagai { tech, simple } — lihat catatan di bagian atas rc4.js.
function desProcessBlock(blockBytes, subkeys, steps, blockIndex){
  const bits = desBytesToBits(blockBytes);
  const permuted = desPermute(bits, DES_IP);
  let L = permuted.slice(0, 32);
  let R = permuted.slice(32, 64);

  steps.push({
    tech: `--- Blok ${blockIndex}: Initial Permutation, lalu 16 ronde Feistel ---`,
    simple: `Blok pesan #${blockIndex} (8 karakter) diacak urutan bitnya, lalu dibagi dua: bagian Kiri (L) dan bagian Kanan (R). Kedua bagian ini akan saling "menyilang" sebanyak 16 kali.`
  });

  for(let round = 0; round < 16; round++){
    const f = desFeistel(R, subkeys[round]);
    const newR = desXor(L, f);
    L = R;
    R = newR;
    steps.push({
      tech: `Blok ${blockIndex} Ronde ${String(round + 1).padStart(2,'0')}: L=${desBitsToHex(L)}  R=${desBitsToHex(R)}`,
      simple: `Ronde ${round + 1} dari 16 — bagian Kanan diolah pakai kunci ronde ini (dicampur & disubstitusi), lalu hasilnya digabung-XOR dengan bagian Kiri yang lama. Setelah itu: Kiri baru = Kanan lama, Kanan baru = hasil XOR tadi. → Kiri sekarang: ${desBitsToHex(L)}  Kanan sekarang: ${desBitsToHex(R)}`
    });
  }

  const preOutput = R.concat(L); // swap terakhir
  const output = desPermute(preOutput, DES_FP);
  const outBytes = desBitsToBytes(output);

  steps.push({
    tech: `Blok ${blockIndex} selesai (Final Permutation) → ${desBitsToHex(output)}`,
    simple: `Blok #${blockIndex} sudah melewati 16 ronde. Kiri & Kanan digabung kembali dan bitnya diacak sekali lagi → hasil akhir blok ini: ${desBitsToHex(output)}`
  });

  return outBytes;
}

// ===== enkripsi/dekripsi ECB + padding PKCS5 =====
function desProcess(text, keyString, mode){
  let keyBytes = textToBytes(keyString).slice(0, 8);
  while(keyBytes.length < 8) keyBytes.push(0);
  const subkeys = desGenerateSubkeys(keyBytes);
  const steps = [];

  steps.push({
    tech: `--- Key schedule: kunci 64-bit → 16 subkey 48-bit (PC1 + rotasi + PC2) ---`,
    simple: `Kunci yang kamu masukkan diolah menjadi 16 "kunci ronde" yang berbeda-beda — satu kunci dipakai di tiap dari 16 ronde di bawah.`
  });

  if(mode === 'encrypt'){
    let bytes = textToBytes(text);
    const finalPad = 8 - (bytes.length % 8);
    for(let i = 0; i < finalPad; i++) bytes.push(finalPad);

    steps.push({
      tech: `Padding PKCS5: +${finalPad} byte nilai 0x${finalPad.toString(16).padStart(2,'0')} agar panjang kelipatan 8`,
      simple: `Karena DES memproses pesan per 8 karakter, pesan ditambah ${finalPad} karakter "pengisi" di akhir supaya panjangnya pas kelipatan 8.`
    });

    let outBytes = [];
    for(let i = 0; i < bytes.length; i += 8){
      const block = bytes.slice(i, i + 8);
      outBytes = outBytes.concat(desProcessBlock(block, subkeys, steps, i / 8 + 1));
    }
    return { result: bytesToHex(outBytes), steps };
  } else {
    const bytes = hexToBytes(text);
    const reversedSubkeys = subkeys.slice().reverse();

    steps.push({
      tech: `Dekripsi: subkey dipakai terbalik (ronde 16 → 1)`,
      simple: `Untuk membongkar pesan, 16 kunci ronde tadi dipakai dengan urutan terbalik — seperti memutar rekaman mundur.`
    });

    let outBytes = [];
    for(let i = 0; i < bytes.length; i += 8){
      const block = bytes.slice(i, i + 8);
      outBytes = outBytes.concat(desProcessBlock(block, reversedSubkeys, steps, i / 8 + 1));
    }
    const padLen = outBytes[outBytes.length - 1];
    if(padLen >= 1 && padLen <= 8) outBytes = outBytes.slice(0, outBytes.length - padLen);

    steps.push({
      tech: `Padding PKCS5 dibuang: ${padLen} byte terakhir`,
      simple: `${padLen} karakter "pengisi" yang ditambahkan saat enkripsi dibuang kembali, menyisakan pesan aslinya.`
    });

    return { result: bytesToText(outBytes), steps };
  }
}