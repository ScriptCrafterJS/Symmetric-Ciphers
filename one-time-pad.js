"use strict";
// importing modules
import { app, dialog } from "electron";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";

function one_time_pad_encr(plaintext, key) {
  // early check to make sure the key is as long as the message
  if (plaintext.length !== key.length) {
    throw new Error("Message and key must be the same length");
  }

  // convert the message string to an array of ASCII values for each character
  const messageBinary = plaintext.split("").map((char) => char.charCodeAt(0));

  // XOR the message ASCII values with the key values each byte at a time
  const encryptedBinary = messageBinary.map((byte, i) => {
    return byte ^ key[i];
  });

  // returen an array of the encrypted bytes
  return encryptedBinary;
}

function one_time_pad_decr(ciphertext, key) {
  // early check to make sure the key is as long as the ciphtertext
  if (ciphertext.length !== key.length) {
    throw new Error("Message and key must be the same length");
  }

  // decrypting the ciphter text using the XOR operation between the key and the ciphertext
  const decryptedBinary = ciphertext.map((byte, i) => {
    return byte ^ key[i];
  });

  // clear out the key after decryption
  key = [];
  return decryptedBinary.map((byte) => String.fromCharCode(byte)).join("");
}

// Helper method for encryption
function oneTimePadEncryption(content) {
  // always generate a new key for each encryption process
  const key = generateKey(content.length);
  // store the key in a file in the current directory
  fs.writeFileSync("one-time-pad-key.txt", key.join(","));
  return one_time_pad_encr(content, key);
}

// Helper method for decryption
function oneTimePadDecryption(content) {
  const key = fs.readFileSync("one-time-pad-key.txt", "utf-8").split(",");
  return one_time_pad_decr(content, key);
}

function generateKey(length) {
  // the key is an array of bytes each byte is a random number between 0 and 255
  // const key = Array.from({ length }, () => Math.floor(Math.random() * 256));
  const key = [
    100, 200, 150, 220, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210,
  ];
  return key;
}

function oneTimePadding() {
  //lets make it a list of options to the user so he could input it in the console
  let encryptedMessage = [];

  do {
    console.log("=====================================");
    console.log("Choose one of the following options: ");
    console.log("1. Encrypt a message");
    console.log("2. Decrypt the encrypted message");
    console.log("3. Encrypt a file");
    console.log("4. Decrypt a file");
    console.log("5. Print the key used");
    console.log("6. Exit");
    console.log("=====================================");

    //get the user input
    let choice = readlineSync.question("Enter your choice: ");

    switch (choice) {
      case "1":
        //encrypt a message
        let message = readlineSync.question("Enter the message: ");
        encryptedMessage = oneTimePadEncryption(message);
        console.log("The encrypted message is: " + encryptedMessage);
        break;
      case "2":
        //decrypt the encrypted message
        let decryptedMessage = oneTimePadDecryption(encryptedMessage);
        console.log("The decrypted message is: " + decryptedMessage);
        break;
      case "3":
        // encrypt a file

        // if no file chosen the value is undefined, other wise it is an array of file paths
        let filePaths = dialog.showOpenDialogSync({
          properties: ["openFile"],
        });

        if (filePaths && filePaths.length > 0) {
          // we read the file synchronously to make sure we have the file content before we encrypt it
          const fileContent = fs.readFileSync(filePaths[0], "utf-8");

          const encryptedFileContent = oneTimePadEncryption(fileContent);

          // here we make the output file name : (originalFileName)-encrypted.txt
          const originalDir = path.dirname(filePaths[0]);
          const originalFileName = path.basename(
            filePaths[0],
            path.extname(filePaths[0])
          );
          const encryptedFileName = `${originalFileName}-encrypted.txt`;
          const encryptedFilePath = path.join(originalDir, encryptedFileName);

          fs.writeFileSync(encryptedFilePath, encryptedFileContent.join(","));
          console.log("The encrypted file is: encryptedFile.txt");
        } else {
          console.log("No file selected.");
        }
        break;
      case "4":
        // decrypt a file

        let filePaths2 = dialog.showOpenDialogSync({
          properties: ["openFile"],
        });

        if (filePaths2 && filePaths2.length > 0) {
          // we read the file synchronously to make sure we have the file content before we decrypt it
          const fileContent2 = fs.readFileSync(filePaths2[0], "utf-8");

          //start the Decryption process on the file content
          const decryptedFileContent2 = oneTimePadDecryption(
            fileContent2.split(",").map(Number)
          );

          // here we make the output file name : (originalFileName)-decrypted.txt
          const encryptedDir = path.dirname(filePaths2[0]);
          const encryptedFileName = path.basename(
            filePaths2[0],
            path.extname(filePaths2[0])
          );
          const decryptedFileName = `${encryptedFileName}-decrypted.txt`;
          const decryptedFilePath = path.join(encryptedDir, decryptedFileName);

          //convert the string "n,n,n" to an array of numbers [n,n,n], this is why we use Number as a map function
          fs.writeFileSync(decryptedFilePath, decryptedFileContent2);
          console.log("The decrypted file is: decryptedFile.txt");
        } else {
          console.log("No file selected.");
        }
        break;
      case "5":
        //print the key value if exists
        const key = fs.readFileSync("one-time-pad-key.txt", "utf-8").split(",");
        console.log("The key used is: " + key);
        break;
      case "6":
        //exit the program
        console.log("Goodbye!");
        return;
      default:
        console.log("Invalid choice! Please enter a valid choice.");
    }
  } while (true);
}
// start the program
app.whenReady().then(() => {
  oneTimePadding();
});
