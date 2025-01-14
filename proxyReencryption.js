// backend/proxyReencryption.js
const recrypt = require("recrypt-js");

class ProxyReencryption {
  constructor() {
    this.recrypt = new recrypt();
  }

  generateKeyPair() {
    return this.recrypt.generateKeyPair();
  }

  generateReEncryptionKey(ownerPrivateKey, delegatePublicKey) {
    return this.recrypt.generateReEncryptionKey(
      ownerPrivateKey,
      delegatePublicKey
    );
  }

  encrypt(message, publicKey) {
    return this.recrypt.encrypt(message, publicKey);
  }

  reEncrypt(ciphertext, reEncryptionKey) {
    return this.recrypt.reEncrypt(ciphertext, reEncryptionKey);
  }

  decrypt(ciphertext, privateKey) {
    return this.recrypt.decrypt(ciphertext, privateKey);
  }
}
