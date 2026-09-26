// ===== RC4: KSA (Key Scheduling Algorithm) + PRGA (Pseudo-Random Generation Algorithm) =====
// Membutuhkan shared/byte-utils.js (textToBytes, bytesToHex, hexToBytes, bytesToText) di-load sebelum file ini.

function rc4KSA(keyBytes, steps){
  const S = Array.from({length: 256}, (_, i) => i);
  let j = 0;
  for(let i = 0; i < 256; i++){
    j = (j + S[i] + keyBytes[i % keyBytes.length]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    if(i < 16 || i > 250){
      steps.push(`KSA i=${i}: j=${j} → swap S[${i}]↔S[${j}]`);
    } else if(i === 16){
      steps.push('... (240 langkah swap lainnya disingkat) ...');
    }
  }
  return S;
}

function rc4PRGA(S, length, steps){
  let i = 0, j = 0;
  const keystream = [];
  for(let n = 0; n < length; n++){
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    const K = S[(S[i] + S[j]) % 256];
    keystream.push(K);
    steps.push(`PRGA byte #${n+1}: i=${i} j=${j} → keystream=0x${K.toString(16).padStart(2,'0')}`);
  }
  return keystream;
}

function rc4Process(input, keyString, mode){
  const keyBytes = textToBytes(keyString);
  if(keyBytes.length === 0) return { result: '', steps: [] };

  const steps = [];
  steps.push(`--- Key Scheduling Algorithm (KSA) ---`);
  const S = rc4KSA(keyBytes, steps);

  const inputBytes = mode === 'encrypt' ? textToBytes(input) : hexToBytes(input);

  steps.push(`--- Pseudo-Random Generation Algorithm (PRGA) ---`);
  const keystream = rc4PRGA(S, inputBytes.length, steps);

  steps.push(`--- XOR pesan dengan keystream ---`);
  const outputBytes = inputBytes.map((b, idx) => {
    const r = b ^ keystream[idx];
    steps.push(`byte #${idx+1}: 0x${b.toString(16).padStart(2,'0')} XOR 0x${keystream[idx].toString(16).padStart(2,'0')} = 0x${r.toString(16).padStart(2,'0')}`);
    return r;
  });

  const result = mode === 'encrypt' ? bytesToHex(outputBytes) : bytesToText(outputBytes);
  return { result, steps };
}