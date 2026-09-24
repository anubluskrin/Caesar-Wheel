function vigenereProcess(text, key, mode){
  // mode: 'encrypt' | 'decrypt'
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if(cleanKey.length === 0) return { result: text, steps: [] };

  let result = '';
  const steps = [];
  let keyIndex = 0;

  for(const ch of text){
    if(/[a-zA-Z]/.test(ch)){
      const isUpper = ch === ch.toUpperCase();
      const base = isUpper ? 65 : 97;
      const charCode = ch.toUpperCase().charCodeAt(0) - 65;

      const keyChar = cleanKey[keyIndex % cleanKey.length];
      const keyCode = keyChar.charCodeAt(0) - 65;

      const shift = mode === 'encrypt' ? keyCode : -keyCode;
      const resultCode = ((charCode + shift) % 26 + 26) % 26;
      const resultChar = String.fromCharCode(resultCode + base);

      steps.push({
        char: ch,
        keyChar: keyChar,
        charCode: charCode,
        keyCode: keyCode,
        shift: mode === 'encrypt' ? `+${keyCode}` : `-${keyCode}`,
        resultChar: resultChar
      });

      result += resultChar;
      keyIndex++;
    } else {
      result += ch; // karakter non-huruf dilewati apa adanya, tidak konsumsi index kunci
    }
  }

  return { result, steps };
}