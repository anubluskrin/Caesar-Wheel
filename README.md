# Kriptoasik

An interactive web suite for learning classical and modern cryptography, featuring Caesar Cipher, Vigenere Cipher, DES, RC4, and a layered "Super Encryption" mode that chains all four together. Every tool displays a step-by-step process log alongside the result, so users can see exactly how each algorithm transforms the message.

This project extends [Caesar Wheel](https://github.com/anubluskrin/Caesar-Wheel) into a multi-page cryptography toolkit.

## Features

- Five cryptography tools in one site: Caesar, Vigenere, DES, RC4, and Super Encryption
- Caesar Cipher visualized as a spinning dual-disc wheel, draggable to set the shift value
- Step-by-step process log for every algorithm, shown in both technical notation and plain-language explanation
- Super Encryption chains Caesar, Vigenere, DES, and RC4 in sequence, with a shared-key or per-stage-key option
- Consistent navigation and visual theme shared across all pages
- Fully client-side, no backend or database
- No build step, no external frameworks or libraries

## Usage

### Caesar (`/`)
1. Drag the inner disc (or use the `<` `>` buttons) to set the shift.
2. Type the message into the input box.
3. Toggle Encode or Decode.
4. Run the process to see a per-letter log, then read the result.

### Vigenere (`/vigenere`)
1. Enter a keyword.
2. Type the plaintext.
3. Run the process to see each letter shifted by the corresponding key letter. Non-alphabetic characters pass through without consuming a key position.

### DES (`/des`)
1. Enter a key (truncated or padded to 8 characters / 64 bits).
2. The message is encrypted in 8-byte blocks with PKCS5 padding, ECB mode.
3. The log shows the key schedule (16 subkeys), all 16 Feistel rounds per block, and the final permutation.
4. Output is hexadecimal; decryption expects hex input.

### RC4 (`/rc4`)
1. Enter a key.
2. The log shows the Key Scheduling Algorithm (KSA) and Pseudo-Random Generation Algorithm (PRGA) stages, followed by the XOR of the message with the keystream.
3. Output is hexadecimal; decryption expects hex input.

### Super Encryption (`/super`)
1. Choose a key mode: a single shared key derived for all four stages, or separate keys per stage (Caesar shift, Vigenere key, RC4 key, DES key).
2. Encryption runs Caesar, then Vigenere, then DES, then RC4, with each intermediate stage shown.
3. Decryption automatically reverses the order: RC4, DES, Vigenere, Caesar.

## Run locally

No dependencies or build step. `vercel.json` relies on server-level rewrites for the clean URLs (`/vigenere`, `/des`, `/rc4`, `/super`), so a static server is recommended over opening `index.html` directly:

```bash
npx serve .
# or
python3 -m http.server 5500
```

Then open `http://localhost:<port>/` in a browser.

## How it works

**Caesar**
```
encrypt:  C = (P + n) mod 26
decrypt:  P = (C - n) mod 26
```
`P` = plaintext letter position, `C` = ciphertext letter position, `n` = shift value.

**Vigenere**
```
encrypt:  C[i] = (P[i] + K[i mod len(K)]) mod 26
decrypt:  P[i] = (C[i] - K[i mod len(K)]) mod 26
```
Non-alphabetic characters pass through unchanged.

**DES**
64-bit blocks, 56-bit key schedule (PC1, sixteen rotations, PC2), 16 rounds of the Feistel function (expansion, XOR with subkey, S-box substitution, P permutation), initial and final permutation, ECB mode with PKCS5 padding.

**RC4**
KSA initializes and permutes a 256-byte state array using the key. PRGA then generates a keystream byte by byte, which is XORed with the plaintext or ciphertext.

**Super Encryption**
```
encrypt:  RC4( DES( Vigenere( Caesar( P ) ) ) )
decrypt:  Caesar⁻¹( Vigenere⁻¹( DES⁻¹( RC4⁻¹( C ) ) ) )
```

## Project structure

```
index.html          Caesar Cipher Wheel (home page)
vigenere.html        Vigenere Cipher
des.html              DES
rc4.html              RC4
super.html            Super Encryption
vercel.json           URL rewrites for /vigenere, /des, /rc4, /super

ciphers/
  caesar.js           Caesar Cipher logic
  vigenere.js         Vigenere Cipher logic
  des.js              Full DES implementation (IP/FP/E/P/PC1/PC2/S-boxes, key schedule)
  rc4.js              RC4 implementation (KSA + PRGA)
  super.js            Orchestrates all four ciphers for Super Encryption

shared/
  nav.js              Shared navigation component
  theme.css           Shared visual theme
  process-log.js      Terminal-style process log renderer
  byte-utils.js        Text / byte / hex conversion utilities
```

## Tech

HTML, SVG, CSS, vanilla JavaScript, no frameworks or libraries. Deployed as a static site on Vercel.

## Disclaimer

This project is built for educational purposes, to make classical and modern ciphers easy to follow step by step. The implementations here are not hardened for real-world use and should not be used to protect sensitive data. For production needs, use a vetted cryptography library such as the Web Crypto API or libsodium.

## License

Free to use and modify.
