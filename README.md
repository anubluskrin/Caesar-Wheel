# Caesar Cipher Wheel

An interactive web tool for encrypting and decrypting messages with the Caesar Cipher, visualized as a spinning dual-disc wheel like an old-school manual cipher device.

**Live demo:** _add your deployed URL here_

## Features

- Drag-to-rotate inner disc to set the shift value (snaps to the nearest letter)
- Nudge buttons to step the shift up/down
- Encode and decode modes, updated in real time
- Single self-contained HTML file, no build step
- Responsive, touch-friendly, respects `prefers-reduced-motion`

## Usage

1. Drag the inner disc (or use the `‹` `›` buttons) to set the shift.
2. Type your message into the input box.
3. Toggle **Encode** to encrypt or **Decode** to decrypt.
4. The result updates automatically.

## Run locally

No dependencies or build step just open the file:

```bash
index.html
```

## How it works

```
encrypt:  C = (P + n) mod 26
decrypt:  P = (C - n) mod 26
```

`P` = plaintext letter position, `C` = ciphertext letter position, `n` = shift value set by the wheel. Non-alphabetic characters pass through unchanged.

## Tech

HTML, SVG, CSS, vanilla JavaScript, no frameworks or libraries.

## License

Free to use and modify.
