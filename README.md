# Kriptoasik

**Language:** [English](#english) | [Bahasa Indonesia](#bahasa-indonesia)
demo [here !](https://caesar-wheel.vercel.app)

---

## English

An interactive web suite for learning classical and modern cryptography, featuring Caesar Cipher, Vigenere Cipher, DES, RC4, and a layered "Super Encryption" mode that chains all four together. Every tool displays a step-by-step process log alongside the result, so users can see exactly how each algorithm transforms the message.

This project extends [Caesar Wheel](https://github.com/anubluskrin/Caesar-Wheel) into a multi-page cryptography toolkit.

---

### Features

- Five cryptography tools in one site: Caesar, Vigenere, DES, RC4, and Super Encryption
- Caesar Cipher visualized as a spinning dual-disc wheel, draggable to set the shift value
- Step-by-step process log for every algorithm, shown in both technical notation and plain-language explanation
- Super Encryption chains Caesar, Vigenere, DES, and RC4 in sequence, with a shared-key or per-stage-key option
- Consistent navigation and visual theme shared across all pages
- Fully client-side, no backend or database
- No build step, no external frameworks or libraries

---

### Usage

**Caesar (`/`)**
1. Drag the inner disc (or use the `<` `>` buttons) to set the shift.
2. Type the message into the input box.
3. Toggle Encode or Decode.
4. Run the process to see a per-letter log, then read the result.

**Vigenere (`/vigenere`)**
1. Enter a keyword.
2. Type the plaintext.
3. Run the process to see each letter shifted by the corresponding key letter. Non-alphabetic characters pass through without consuming a key position.

**DES (`/des`)**
1. Enter a key (truncated or padded to 8 characters / 64 bits).
2. The message is encrypted in 8-byte blocks with PKCS5 padding, ECB mode.
3. The log shows the key schedule (16 subkeys), all 16 Feistel rounds per block, and the final permutation.
4. Output is hexadecimal; decryption expects hex input.

**RC4 (`/rc4`)**
1. Enter a key.
2. The log shows the Key Scheduling Algorithm (KSA) and Pseudo-Random Generation Algorithm (PRGA) stages, followed by the XOR of the message with the keystream.
3. Output is hexadecimal; decryption expects hex input.

**Super Encryption (`/super`)**
1. Choose a key mode: a single shared key derived for all four stages, or separate keys per stage (Caesar shift, Vigenere key, RC4 key, DES key).
2. Encryption runs Caesar, then Vigenere, then DES, then RC4, with each intermediate stage shown.
3. Decryption automatically reverses the order: RC4, DES, Vigenere, Caesar.

---

### Run locally

No dependencies or build step. `vercel.json` relies on server-level rewrites for the clean URLs (`/vigenere`, `/des`, `/rc4`, `/super`), so a static server is recommended over opening `index.html` directly:

```bash
npx serve .
# or
python3 -m http.server 5500
```

Then open `http://localhost:<port>/` in a browser.

---

### How it works

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

---

### Project structure

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

---

### Tech

HTML, SVG, CSS, vanilla JavaScript, no frameworks or libraries. Deployed as a static site on Vercel.

---

### Disclaimer

This project is built for educational purposes, to make classical and modern ciphers easy to follow step by step. The implementations here are not hardened for real-world use and should not be used to protect sensitive data. For production needs, use a vetted cryptography library such as the Web Crypto API or libsodium.

---

### License

Free to use and modify.

[Back to top](#kriptoasik)

---

## Bahasa Indonesia

Kumpulan alat web interaktif untuk mempelajari kriptografi klasik dan modern, mencakup Caesar Cipher, Vigenere Cipher, DES, RC4, dan mode "Super Enkripsi" yang menggabungkan keempatnya secara berlapis. Setiap alat menampilkan log proses langkah demi langkah di samping hasilnya, sehingga pengguna dapat melihat persis bagaimana setiap algoritma mengubah pesan.

Proyek ini merupakan pengembangan lanjutan dari [Caesar Wheel](https://github.com/anubluskrin/Caesar-Wheel) menjadi toolkit kriptografi multi-halaman.

---

### Fitur

- Lima alat kriptografi dalam satu situs: Caesar, Vigenere, DES, RC4, dan Super Enkripsi
- Caesar Cipher divisualisasikan sebagai cakram ganda yang berputar, bisa diseret untuk mengatur nilai geser
- Log proses langkah demi langkah untuk setiap algoritma, ditampilkan dalam notasi teknis maupun penjelasan bahasa sederhana
- Super Enkripsi menggabungkan Caesar, Vigenere, DES, dan RC4 secara berurutan, dengan opsi kunci bersama atau kunci terpisah per tahap
- Navigasi dan tema visual yang konsisten di semua halaman
- Sepenuhnya berjalan di sisi klien (client-side), tanpa backend atau basis data
- Tanpa build step, tanpa framework atau library eksternal

---

### Cara Penggunaan

**Caesar (`/`)**
1. Seret cakram bagian dalam (atau gunakan tombol `<` `>`) untuk mengatur nilai geser.
2. Ketik pesan pada kotak input.
3. Pilih mode Enkripsi atau Dekripsi.
4. Jalankan proses untuk melihat log per-huruf, lalu baca hasilnya.

**Vigenere (`/vigenere`)**
1. Masukkan kata kunci.
2. Ketik teks asli (plaintext).
3. Jalankan proses untuk melihat setiap huruf digeser sesuai huruf kunci yang bersesuaian. Karakter non-alfabet dilewati tanpa mengonsumsi posisi kunci.

**DES (`/des`)**
1. Masukkan kunci (akan dipotong atau di-pad menjadi 8 karakter/64-bit).
2. Pesan dienkripsi per blok 8 byte dengan padding PKCS5, mode ECB.
3. Log menampilkan key schedule (16 subkey), seluruh 16 ronde Feistel per blok, dan permutasi akhir.
4. Hasil berupa heksadesimal; dekripsi membutuhkan input hex.

**RC4 (`/rc4`)**
1. Masukkan kunci.
2. Log menampilkan tahap Key Scheduling Algorithm (KSA) dan Pseudo-Random Generation Algorithm (PRGA), diikuti operasi XOR antara pesan dan keystream.
3. Hasil berupa heksadesimal; dekripsi membutuhkan input hex.

**Super Enkripsi (`/super`)**
1. Pilih mode kunci: satu kunci bersama yang diturunkan untuk keempat tahap, atau kunci terpisah per tahap (geser Caesar, kunci Vigenere, kunci RC4, kunci DES).
2. Enkripsi berjalan berurutan: Caesar, lalu Vigenere, lalu DES, lalu RC4, dengan setiap tahap antara ditampilkan.
3. Dekripsi otomatis membalik urutan: RC4, DES, Vigenere, Caesar.

---

### Menjalankan Secara Lokal

Tidak ada dependensi atau build step. `vercel.json` mengandalkan rewrite di level server untuk URL bersih (`/vigenere`, `/des`, `/rc4`, `/super`), sehingga disarankan menjalankan server statis daripada membuka `index.html` secara langsung:

```bash
npx serve .
# atau
python3 -m http.server 5500
```

Lalu buka `http://localhost:<port>/` di browser.

---

### Cara Kerja

**Caesar**
```
enkripsi:  C = (P + n) mod 26
dekripsi:  P = (C - n) mod 26
```
`P` = posisi huruf teks asli, `C` = posisi huruf teks sandi, `n` = nilai geser.

**Vigenere**
```
enkripsi:  C[i] = (P[i] + K[i mod panjang(K)]) mod 26
dekripsi:  P[i] = (C[i] - K[i mod panjang(K)]) mod 26
```
Karakter non-alfabet dilewati tanpa perubahan.

**DES**
Blok 64-bit, key schedule 56-bit (PC1, enam belas kali rotasi, PC2), 16 ronde fungsi Feistel (ekspansi, XOR dengan subkey, substitusi S-box, permutasi P), permutasi awal dan akhir, mode ECB dengan padding PKCS5.

**RC4**
KSA menginisialisasi dan mengacak array state 256-byte menggunakan kunci. PRGA kemudian membangkitkan keystream byte demi byte, yang di-XOR dengan teks asli atau teks sandi.

**Super Enkripsi**
```
enkripsi:  RC4( DES( Vigenere( Caesar( P ) ) ) )
dekripsi:  Caesar⁻¹( Vigenere⁻¹( DES⁻¹( RC4⁻¹( C ) ) ) )
```

---

### Struktur Proyek

```
index.html          Caesar Cipher Wheel (halaman utama)
vigenere.html        Vigenere Cipher
des.html              DES
rc4.html              RC4
super.html            Super Enkripsi
vercel.json           Rewrite URL untuk /vigenere, /des, /rc4, /super

ciphers/
  caesar.js           Logika Caesar Cipher
  vigenere.js         Logika Vigenere Cipher
  des.js              Implementasi DES lengkap (IP/FP/E/P/PC1/PC2/S-box, key schedule)
  rc4.js              Implementasi RC4 (KSA + PRGA)
  super.js            Mengorkestrasi keempat cipher untuk Super Enkripsi

shared/
  nav.js              Komponen navigasi bersama
  theme.css           Tema visual bersama
  process-log.js      Penampil log proses ala terminal
  byte-utils.js        Utilitas konversi teks / byte / hex
```

---

### Teknologi

HTML, SVG, CSS, JavaScript murni, tanpa framework atau library. Dideploy sebagai situs statis di Vercel.

---

### Disclaimer

Proyek ini dibuat untuk tujuan edukasi, agar algoritma sandi klasik dan modern mudah dipahami langkah demi langkah. Implementasi di sini tidak dikeraskan (hardened) untuk penggunaan dunia nyata dan tidak boleh dipakai untuk melindungi data sensitif. Untuk kebutuhan produksi, gunakan pustaka kriptografi yang teruji seperti Web Crypto API atau libsodium.

---

### Lisensi

Bebas digunakan dan dimodifikasi.

[Kembali ke atas](#kriptoasik)
