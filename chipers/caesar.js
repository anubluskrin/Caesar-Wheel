function caesarProcess(text, shift, mode){
  const s = mode === 'encrypt' ? shift : -shift;
  const steps = [];
  const result = text.replace(/[a-zA-Z]/g, ch => {
    const isUpper = ch === ch.toUpperCase();
    const base = isUpper ? 65 : 97;
    const code = ch.charCodeAt(0) - base;
    const shifted = ((code + s) % 26 + 26) % 26;
    const resultChar = String.fromCharCode(shifted + base);
    steps.push({ char: ch, shift: s >= 0 ? `+${s}` : `${s}`, resultChar });
    return resultChar;
  });
  return { result, steps };
}