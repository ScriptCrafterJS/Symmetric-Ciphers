"use strict";
import seedrandom from "seedrandom";
export function encrypt(message, key) {
  // the key is as long as the message
  if (message.length !== key.length) {
    throw new Error("Message and key must be the same length");
  }

  // convert the message to an array of binary bits
  const messageBinary = message.split("").map((char) => char.charCodeAt(0));

  // XOR the message and the key
  const encryptedBinary = messageBinary.map((byte, i) => {
    //here the byte is a string of 1s and 0s
    return byte ^ key[i];
  });

  return encryptedBinary;
}

export function decrypt(message, key) {}

export function generateKey(length) {
  const key = Array.from({ length }, () => Math.floor(Math.random() * 256));
  return key;
}

const plainText = "hello world";
const seed = "once_a_soldier_always_a_soldier";
const key = generateKey(plainText.length, seed);

encrypt(plainText, key);
