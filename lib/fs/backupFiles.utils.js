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

function writeBackupFile (filename, backup) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(backup, null, 2), function (err) {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

module.exports = {
  readFromBackupFile,
  writeBackupFile
}
