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