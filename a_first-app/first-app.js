// fs идет из коробки ноды
const fs = require('fs'); // запрос функционала файловой системы.

const mainText = 'hello from Node.js';

console.log(mainText);

fs.writeFileSync('hello.text', mainText);