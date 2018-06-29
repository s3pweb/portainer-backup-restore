const express = require('express')
const app = express()
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

let stacks
let stackfile

async function loadDatas () {
  stacks = JSON.parse(await readFromBackupFile(__dirname + '/stacks.json'))
  stackfile = JSON.parse(await readFromBackupFile(__dirname + '/stackfile.json'))
}

// Add custom routes before JSON Server router
app.post('/api/auth', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send({'jwt': 'jwt_token'})
})

app.get('/api/endpoints/1/stacks', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(stacks)
})

app.get('/api/endpoints/1/stacks/:id/stackfile', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(stackfile)
})

exports.before = async t => {
  await loadDatas()

  t.context.server = await app.listen(3333, () => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  })
}

exports.after = async t => {
  await t.context.server.close()
}
