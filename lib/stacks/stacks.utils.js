const config = require('config')

const log = require('../logger/logger')('StacksUtils')
const portainer = require('../portainer/portainer.utils')
const bf = require('../fs/backupFiles.utils')

let filename = config.backupFile

async function login (url, login, password) {
  // Log in and get JWT token from portainer
  let jwt = await portainer.login(url, login, password)

  log.info({jwt: jwt}, `Logged in successfully.`)

  return jwt
}

/**
 * Retrieve portainer's stacks and write then to the FS
 * @param jwt Token from login()
 * @param url
 * @returns {Promise<>}
 */
async function backupStacks (jwt, url) {
  // Get all stacks from portainer
  let stacks = await portainer.getStacks(jwt, url)
  log.info(`Found ${stacks.length} stack(s).`)

  let backup = []

  // For each stack, get it's stackfime
  for (let stack of stacks) {
    let stackFile = await portainer.getStackFile(jwt, url, stack.Id)
    backup.push({
      Name: stack.Name,
      SwarmID: stack.SwarmId,
      StackFileContent: stackFile.StackFileContent
    })
    log.debug(`Found stack file for ${stack.Id}.`)
  }

  // Write the backup to the file system
  await bf.writeBackupFile(filename, backup)
  log.info(`Saved ${backup.length} stack(s) to ${filename}`)
}

/**
 * Read the stacks from the FS then call update stack on portainer
 * @param jwt Token from login()
 * @param url
 * @returns {Promise<void>}
 */
async function updateStacks (jwt, url) {
  let data = await bf.readFromBackupFile(filename)

  let backupStacks = JSON.parse(data)
  log.info(`Found ${backupStacks.length} stack(s) in ${filename}`)

  for (let stack of backupStacks) {
    let stackId = stack.Name + '_' + stack.SwarmID
    log.debug(`Updating stack ${stackId}`)
    let data = await portainer.updateStack(jwt, url, stackId, stack)
    log.info({data: data}, `Updated stack ${stackId}`)
  }
}

/**
 * Read the stacks from the FS and call remove then create on each stack
 * @param jwt Token from login()
 * @param url
 * @returns {Promise<void>}
 */
async function removeAndCreateStacks (jwt, url) {
  let data = await bf.readFromBackupFile(filename)

  let backupStacks = JSON.parse(data)
  log.info(`Found ${backupStacks.length} stack(s) in ${filename}`)

  for (let stack of backupStacks) {
    let stackId = stack.Name + '_' + stack.SwarmID
    log.debug(`Removing stack ${stackId}`)
    let removeResponse = await portainer.removeStack(jwt, url, stackId)
    log.info({data: removeResponse}, `Removed stack ${stackId}`)

    log.debug(`Creating stack ${stackId}`)
    let createResponse = await portainer.createStack(jwt, url, stack)
    log.info({data: createResponse}, `Created stack ${stackId}`)
  }
}

module.exports = {
  login,
  backupStacks,
  updateStacks,
  removeAndCreateStacks
}
