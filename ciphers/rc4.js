// ===== RC4: KSA (Key Scheduling Algorithm) + PRGA (Pseudo-Random Generation Algorithm) =====
// Membutuhkan shared/byte-utils.js (textToBytes, bytesToHex, hexToBytes, bytesToText) di-load sebelum file ini.
//
// Setiap langkah dicatat sebagai { tech, simple }:
//   tech   -> notasi teknis asli (untuk yang sudah paham istilah kripto)
//   simple -> narasi bahasa awam (untuk pemula) menjelaskan APA yang terjadi
// Logika enkripsi/dekripsi TIDAK berubah — ini murni menambah keterangan.

function rc4KSA(keyBytes, steps){
  const S = Array.from({length: 256}, (_, i) => i);
  let j = 0;

  steps.push({
    tech: `--- Key Scheduling Algorithm (KSA) ---`,
    simple: `TAHAP 1 — Mengacak 256 "kotak kartu": kita punya 256 kotak bernomor 0–255, lalu kunci yang kamu masukkan dipakai untuk menukar-nukar isinya sampai urutannya acak.`
  });

  for(let i = 0; i < 256; i++){
    j = (j + S[i] + keyBytes[i % keyBytes.length]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    if(i < 16 || i > 250){
      steps.push({
        tech: `KSA i=${i}: j=${j} → swap S[${i}]↔S[${j}]`,
        simple: `Kotak #${i} ditukar isinya dengan kotak #${j}.`
      });
    } else if(i === 16){
      steps.push({
        tech: '... (240 langkah swap lainnya disingkat) ...',
        simple: '... (proses tukar-menukar ini diulang 240 kali lagi, disingkat agar log tidak kepanjangan) ...'
      });
    }
  }
  return S;
}

function rc4PRGA(S, length, steps){
  let i = 0, j = 0;
  const keystream = [];

  steps.push({
    tech: `--- Pseudo-Random Generation Algorithm (PRGA) ---`,
    simple: `TAHAP 2 — Menghasilkan angka acak: dari 256 kotak yang sudah diacak tadi, kita ambil satu angka acak untuk tiap huruf pesan. Deretan angka ini disebut "keystream".`
  });

  for(let n = 0; n < length; n++){
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    const K = S[(S[i] + S[j]) % 256];
    keystream.push(K);
    steps.push({
      tech: `PRGA byte #${n+1}: i=${i} j=${j} → keystream=0x${K.toString(16).padStart(2,'0')}`,
      simple: `Angka acak ke-${n+1}: ${K} (heksadesimal: 0x${K.toString(16).padStart(2,'0')})`
    });
  }
  return keystream;
}

function rc4Process(input, keyString, mode){
  const keyBytes = textToBytes(keyString);
  if(keyBytes.length === 0) return { result: '', steps: [] };

  const steps = [];
  const S = rc4KSA(keyBytes, steps);

  const inputBytes = mode === 'encrypt' ? textToBytes(input) : hexToBytes(input);

  const keystream = rc4PRGA(S, inputBytes.length, steps);

  steps.push({
    tech: `--- XOR pesan dengan keystream ---`,
    simple: `TAHAP 3 — Menggabungkan pesan dengan angka acak: tiap byte pesan digabung dengan angka acak yang sesuai lewat operasi XOR (bandingkan bit demi bit — beda jadi 1, sama jadi 0). Karena XOR bisa dibalik, proses yang sama persis dipakai untuk membongkar pesan kembali.`
  });

  const outputBytes = inputBytes.map((b, idx) => {
    const r = b ^ keystream[idx];
    const printable = (mode === 'encrypt' && b >= 32 && b < 127) ? ` ('${String.fromCharCode(b)}')` : '';
    steps.push({
      tech: `byte #${idx+1}: 0x${b.toString(16).padStart(2,'0')} XOR 0x${keystream[idx].toString(16).padStart(2,'0')} = 0x${r.toString(16).padStart(2,'0')}`,
      simple: `Karakter ke-${idx+1}${printable}: nilai ${b} digabung-XOR dengan angka acak ${keystream[idx]} → hasil: ${r} (0x${r.toString(16).padStart(2,'0')})`
    });
    return r;
  });

  const result = mode === 'encrypt' ? bytesToHex(outputBytes) : bytesToText(outputBytes);
  return { result, steps };
}