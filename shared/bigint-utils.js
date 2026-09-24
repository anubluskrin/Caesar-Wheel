// --- operasi dasar BigInt untuk RSA ---

function modPow(base, exp, mod){
  base = base % mod;
  let result = 1n;
  while(exp > 0n){
    if(exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

function gcd(a, b){
  while(b){ [a, b] = [b, a % b]; }
  return a;
}

// extended Euclidean: mencari x sehingga (a*x) mod m === 1  (invers modular)
function modInverse(a, m){
  let [oldR, r] = [a, m];
  let [oldS, s] = [1n, 0n];
  while(r !== 0n){
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  if(oldR !== 1n) throw new Error('Invers modular tidak ada');
  return ((oldS % m) + m) % m;
}

function randomBigInt(bits){
  let hex = '';
  for(let i = 0; i < Math.ceil(bits / 4); i++){
    hex += Math.floor(Math.random() * 16).toString(16);
  }
  let n = BigInt('0x' + hex);
  // pastikan bit paling signifikan menyala (panjang bit tepat) & angka ganjil
  n |= (1n << BigInt(bits - 1));
  n |= 1n;
  return n;
}

// Miller-Rabin primality test (probabilistik, k ronde)
function isProbablePrime(n, k = 12){
  if(n < 2n) return false;
  if(n === 2n || n === 3n) return true;
  if(n % 2n === 0n) return false;

  let d = n - 1n;
  let r = 0n;
  while(d % 2n === 0n){ d /= 2n; r++; }

  witnessLoop:
  for(let i = 0; i < k; i++){
    const a = 2n + (randomBigInt(Math.max(2, n.toString(2).length - 1)) % (n - 3n));
    let x = modPow(a, d, n);
    if(x === 1n || x === n - 1n) continue;
    for(let j = 0n; j < r - 1n; j++){
      x = modPow(x, 2n, n);
      if(x === n - 1n) continue witnessLoop;
    }
    return false;
  }
  return true;
}

function generatePrime(bits){
  let candidate;
  do {
    candidate = randomBigInt(bits);
  } while(!isProbablePrime(candidate));
  return candidate;
}