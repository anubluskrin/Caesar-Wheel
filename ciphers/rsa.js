function generateRSAKeys(bits){
  let p, q, n, phi;
  do {
    p = generatePrime(bits);
    q = generatePrime(bits);
  } while(p === q);

  n = p * q;
  phi = (p - 1n) * (q - 1n);

  // e standar 65537, fallback ke prima kecil kalau phi terlalu kecil untuk itu
  let e = 65537n;
  if(e >= phi || gcd(e, phi) !== 1n){
    e = 3n;
    while(gcd(e, phi) !== 1n) e += 2n;
  }

  const d = modInverse(e, phi);

  return { p, q, n, phi, e, d };
}

function rsaProcess(text, keys, mode){
  // mode: 'encrypt' (teks -> daftar angka hasil, dipisah spasi)
  //       'decrypt' (daftar angka dipisah spasi -> teks)
  const { n, e, d } = keys;
  const steps = [];

  if(mode === 'encrypt'){
    const chars = Array.from(text);
    const results = chars.map(ch => {
      const M = BigInt(ch.charCodeAt(0));
      if(M >= n) throw new Error(`Karakter "${ch}" (kode ${M}) >= n. Perbesar bit kunci.`);
      const C = modPow(M, e, n);
      steps.push({ char: ch, M: M.toString(), formula: `${M}^${e} mod ${n}`, C: C.toString() });
      return C.toString();
    });
    return { result: results.join(' '), steps };
  } else {
    const blocks = text.trim().split(/\s+/).filter(Boolean);
    const chars = blocks.map(numStr => {
      const C = BigInt(numStr);
      const M = modPow(C, d, n);
      const ch = String.fromCharCode(Number(M));
      steps.push({ char: ch, C: C.toString(), formula: `${C}^${d} mod ${n}`, M: M.toString() });
      return ch;
    });
    return { result: chars.join(''), steps };
  }
}