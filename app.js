const fs = require('fs')

const log = require('./lib/logger/logger')('Main')
const portainer = require('./lib/portainer/portainer.utils')

let filename = 'backup.json'

async function main () {
  log.info('Starting app')

  // Log in and get JWT token from portainer
  let jwt = await portainer.login()
  log.info(`Logged in`)

  // Get all stacks from portainer and save them to a json file
  await backupStacks(jwt)

  await updateStacks(jwt)
}

async function backupStacks (jwt) {
  // Get all stacks from portainer
  let stacks = await portainer.getStacks(jwt)
  log.info(`Found ${stacks.length} stack(s).`)

  let backup = []

  // For each stack, get it's stackfime
  for (let stack of stacks) {
    let stackFile = await portainer.getStackFile(jwt, stack.Id)
    backup.push({
      Name: stack.Name,
      SwarmID: stack.SwarmId,
      StackFileContent: stackFile.StackFileContent
    })
    log.info(`Found stack file for ${stack.Id}.`)
  }

  // Write the backup to the file system
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(backup, null, 2), function (err) {
      if (err) {
        reject(err)
      }
      log.info(`Saved ${backup.length} stack(s) to ${filename}`)
      resolve()
    })
  })
}

async function updateStacks (jwt) {
  let data = await readFromBackupFile(filename)

  let backupStacks = JSON.parse(data)
  log.info(`Found ${backupStacks.length} stack(s) in ${filename}`)

  for (let stack of backupStacks) {
    let stackId = stack.Name + '_' + stack.SwarmID
    log.info(`Updating stack ${stackId}`)
    let data = await portainer.updateStack(jwt, stackId, stack)
    log.info(`Updated stack: ${data}`)
  }
}

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

main()
  .catch((err) => {
    log.error({err: err}, `Error`)
  })
