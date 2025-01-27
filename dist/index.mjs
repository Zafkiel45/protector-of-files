import { createReadStream, createWriteStream } from 'node:fs';
const { randomBytes, scryptSync, createCipheriv, createDecipheriv } = await import('node:crypto');
const args = process.argv.slice(2);
const algorithm = 'aes-256-cbc';
const password = args[1];
function HandleEncrypt(input, output) {
    const salt = randomBytes(16);
    const iv = randomBytes(16);
    const key = scryptSync(password, salt, 32);
    const cypher = createCipheriv(algorithm, key, iv);
    const inputStream = createReadStream(input);
    const outputStream = createWriteStream(output);
    outputStream.write(salt);
    outputStream.write(iv);
    inputStream.pipe(cypher).pipe(outputStream);
    outputStream.on('finish', () => console.log('file encrypted'));
}
;
function HandleDecrypt(input, output) {
    const inputStream = createReadStream(input);
    let salt = Buffer.alloc(16);
    let iv = Buffer.alloc(16);
    inputStream.read(16);
    inputStream.once('readable', () => {
        salt = inputStream.read(16);
        iv = inputStream.read(16);
        const key = scryptSync(password, salt, 32);
        const cypher = createDecipheriv(algorithm, key, iv);
        const outputStream = createWriteStream(output);
        inputStream.pipe(cypher).pipe(outputStream);
        outputStream.on('finish', () => console.log('file decrypted'));
    });
}
;
switch (args[0]) {
    case 'encrypt':
        HandleEncrypt('./notes/diary/note.md', './notes/diary/note.enc');
        break;
    case 'decrypt':
        HandleDecrypt('./notes/diary/note.enc', './notes/diary/note.md');
        break;
    default:
        console.log('bad error');
}
;
/*
  I didn't understand completely what is a key derivation function.
  Remember to search more about this later!
*/ 
//# sourceMappingURL=index.mjs.map