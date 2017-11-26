const path = require('path');

console.log('@@@@ Building config with __dirname: ',__dirname);

const conf = {
  storageDir: path.join(__dirname, '../../storage')
}

module.exports = conf
