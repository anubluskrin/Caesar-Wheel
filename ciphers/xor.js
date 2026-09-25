function textToBytes(text){
  return Array.from(text).map(ch => ch.charCodeAt(0) & 0xFF);
}
function bytesToHex(bytes){
  return bytes.map(b => b.toString(16).padStart(2,'0')).join('');
}
function hexToBytes(hex){
  const clean = hex.replace(/\s+/g,'');
  const bytes = [];
  for(let i=0; i<clean.length; i+=2){
    bytes.push(parseInt(clean.substr(i,2),16) || 0);
  }
  return bytes;
}
function bytesToText(bytes){
  return bytes.map(b => String.fromCharCode(b)).join('');
}
function toBinary8(n){
  return n.toString(2).padStart(8,'0');
}

function rc4KeySchedule(keyBytes){
  const S = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;

  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + keyBytes[i % keyBytes.length]) & 0xFF;
    [S[i], S[j]] = [S[j], S[i]];
  }

  return S;
}

function rc4Keystream(keyBytes, length){
  const S = rc4KeySchedule(keyBytes);
  const stream = [];
  let i = 0;
  let j = 0;

  for (let n = 0; n < length; n++) {
    i = (i + 1) & 0xFF;
    j = (j + S[i]) & 0xFF;
    [S[i], S[j]] = [S[j], S[i]];
    const k = S[(S[i] + S[j]) & 0xFF];
    stream.push(k);
  }

  return stream;
}

function xorProcess(input, key, mode){
  // mode: 'encrypt' (input=teks, output=hex) | 'decrypt' (input=hex, output=teks)
  const keyBytes = textToBytes(key);
  if(keyBytes.length === 0) return { result: '', steps: [] };

  const inputBytes = mode === 'encrypt' ? textToBytes(input) : hexToBytes(input);
  const keystream = rc4Keystream(keyBytes, inputBytes.length);
  const steps = [];

  const resultBytes = inputBytes.map((b, i) => {
    const k = keystream[i];
    const r = b ^ k;
    steps.push({
      index: i + 1,
      inputByte: toBinary8(b),
      keyByte: toBinary8(k),
      resultByte: toBinary8(r),
      resultHex: r.toString(16).padStart(2,'0')
    });
    return r;
  });

  const result = mode === 'encrypt' ? bytesToHex(resultBytes) : bytesToText(resultBytes);
  return { result, steps };
}