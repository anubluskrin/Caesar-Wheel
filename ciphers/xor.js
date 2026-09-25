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

function xorProcess(input, key, mode){
  // mode: 'encrypt' (input=teks, output=hex) | 'decrypt' (input=hex, output=teks)
  const keyBytes = textToBytes(key);
  if(keyBytes.length === 0) return { result: '', steps: [] };

  const inputBytes = mode === 'encrypt' ? textToBytes(input) : hexToBytes(input);
  const steps = [];

  const resultBytes = inputBytes.map((b, i) => {
    const k = keyBytes[i % keyBytes.length];
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