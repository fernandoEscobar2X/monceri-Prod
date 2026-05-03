import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateKeyPairSync } from "node:crypto";

const privateKeyPath = resolve(process.cwd(), "secrets/jwt-private.pem");
const publicKeyPath = resolve(process.cwd(), "secrets/jwt-public.pem");

mkdirSync(dirname(privateKeyPath), { recursive: true });

if (existsSync(privateKeyPath) || existsSync(publicKeyPath)) {
  throw new Error("JWT key files already exist. Remove them manually if you intentionally want to rotate keys.");
}

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  privateKeyEncoding: {
    format: "pem",
    type: "pkcs8",
  },
  publicKeyEncoding: {
    format: "pem",
    type: "spki",
  },
});

writeFileSync(privateKeyPath, privateKey, { encoding: "utf8", mode: 0o600 });
writeFileSync(publicKeyPath, publicKey, { encoding: "utf8", mode: 0o600 });

console.log(`Created ${privateKeyPath}`);
console.log(`Created ${publicKeyPath}`);
