const fs = require('fs')

function readFromBackupFile (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  readFromBackupFile
}
