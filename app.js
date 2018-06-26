const fs = require('fs')

const log = require('./lib/logger/logger')('Main')
const portainer = require('./lib/portainer/portainer.utils')

let filename = 'backup.json'

async function main () {
  log.info('Starting app')

  // Log in and get JWT token from portainer
  let jwt = await portainer.auth()
  log.info(`Logged in`)

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
  fs.writeFile(filename, JSON.stringify(backup, null, 2), function (err) {
    if (err) {
      throw err
    }
    log.info(`Saved ${backup.length} stack(s) to ${filename}`)
  })
}

main()
  .catch((err) => {
    log.error({err: err}, `Error`)
  })
