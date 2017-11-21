const path = require('path');

const conf = {
  storageDir: path.join(__dirname, '../../storage')
}
console.log('@@@@ Config set to ',conf);

module.exports = conf
