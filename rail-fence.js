"use strict";
const nonLetterMap = new Map();
// reconstruct the arry based on the plaintext
function rail_fence_encr(plaintext, key) {
  // create an array with the length of the key
  let result = [];
  for (let i = 0; i < key; i++) {
    result.push([]);
  }
  //build the map for the non-letter characters
  const lettersOnly = [];
  for (let i = 0; i < plaintext.length; i++) {
    if (!plaintext[i].match(/[a-zA-Z]/)) {
      nonLetterMap.set(i, plaintext[i]);
    } else {
      lettersOnly.push(plaintext[i]);
    }
  }
  //we only need the letters in the plaintext, and we have to do it in zigzag
  let traversar = true;
  let charIndex = 0;
  for (let j = 0; j < lettersOnly.length; ) {
    for (let i = 0; ; ) {
      //this condition here is to break out the inner loop whenever we reach the end of the lettersOnly array
      if (j == lettersOnly.length) {
        break;
      }

      // @ts-ignore
      result[i][j] = lettersOnly[charIndex++];
      // here we switch back to reducing
      if (i == key - 1) {
        traversar = false;
      }
      // here we switch back to increasing
      if (i == 0) {
        traversar = true;
      }
      // here we decide whether to increase or decrease the row index
      if (traversar) {
        i++;
      } else {
        i--;
      }

      j++;
    }
  }
  return result.map((row) => row.join("")).join(" ");
}

function rail_fence_decr(ciphertext, key) {
  //e.g., ciphertext = HorelWlo dl
  // e.g., ciphertextArr = ["H", "o", "r", "e", "l", "W", "l", "o", "d", "l"]
  const ciphertextArr = ciphertext.split(" ").join("").split("");

  // create an array with the length of the key
  let starsArr = [];
  for (let i = 0; i < key; i++) {
    starsArr.push([]);
  }

  //filling the digonals with "*" to make it easier to reconstruct the plaintext
  let traversar = true;
  for (let j = 0; j < ciphertextArr.length; ) {
    for (let i = 0; ; ) {
      if (j == ciphertextArr.length) {
        break;
      }

      // @ts-ignore
      starsArr[i][j] = "*";

      // here we switch back to reducing
      if (i == key - 1) {
        traversar = false;
      }
      // here we switch back to increasing
      if (i == 0) {
        traversar = true;
      }
      // here we decide whether to increase or decrease the row index
      if (traversar) {
        i++;
      } else {
        i--;
      }

      j++;
    }
  }

  // we replace the "*" with the characters of the ciphertext
  let charIndex = 0;
  for (let i = 0; i < key; i++) {
    for (let j = 0; j < ciphertextArr.length; j++) {
      if (starsArr[i][j] == "*") {
        // @ts-ignore
        starsArr[i][j] = ciphertextArr[charIndex++];
      }
    }
  }

  // reconstruct the plaintext
  let plaintext = "";
  traversar = true;
  for (let j = 0; j < ciphertextArr.length; ) {
    for (let i = 0; ; ) {
      if (j == ciphertextArr.length) {
        break;
      }

      plaintext += starsArr[i][j];

      // here we switch back to reducing
      if (i == key - 1) {
        traversar = false;
      }
      // here we switch back to increasing
      if (i == 0) {
        traversar = true;
      }
      // here we decide whether to increase or decrease the row index
      if (traversar) {
        i++;
      } else {
        i--;
      }

      j++;
    }
  }

  // retain back the non-letter characters
  for (let i = 0; i <= plaintext.length; i++) {
    if (nonLetterMap.has(i)) {
      plaintext =
        plaintext.slice(0, i) + nonLetterMap.get(i) + plaintext.slice(i);
    }
  }

  return plaintext;
}

const plaintext = "Once a soldier, always a soldier.";
const key = 3;
const ciphertext = rail_fence_encr(plaintext, key);
const decryptedText = rail_fence_decr(ciphertext, key);
console.log("Plaintext:", plaintext);
console.log("Key:", key);
console.log("Ciphertext:", ciphertext);
console.log("Decrypted Text:", decryptedText);
