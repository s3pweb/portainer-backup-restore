const config = require('config')

const log = require('../logger/logger')('StacksUtils')
const portainer = require('../portainer/portainer.utils')
const bf = require('../fs/backupFiles.utils')

let filename = config.backupFile

/**
 * @param {String} url - Portainer URL
 * @param {String} login - Portainer login
 * @param {String} password - Portainer password
 * @returns {Promise<String>} JWT token if the login was successful
 */
async function login (url, login, password) {
  // Log in and get JWT token from portainer
  let jwt = await portainer.login(url, login, password)

  log.info(`Logged in successfully.`)

  return jwt
}

/**
 * Retrieve portainer's stacks and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
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
      Id: stack.Id,
      Name: stack.Name,
      SwarmID: stack.SwarmId,
      StackFileContent: stackFile.StackFileContent
    })
    log.debug(`Found stack file for ID: ${stack.Id}.`)
  }

  // Write the backup to the file system
  await bf.writeBackupFile(filename, backup)
  log.info(`Saved ${backup.length} stack(s) to ${filename}`)
}

/**
 * Read the stacks from the FS then call update stack on portainer
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<void>}
 */
async function updateStacks (jwt, url) {
  let data = await bf.readFromBackupFile(filename)

  let backupStacks = JSON.parse(data)
  log.info(`Found ${backupStacks.length} stack(s) in ${filename}`)

  for (let stack of backupStacks) {
    log.debug(`Updating stack ${stack.Id}`)
    let data = await portainer.updateStack(jwt, url, stack.Id, stack)
    log.info({data: data}, `Updated stack ${stack.Id}`)
  }
}

/**
 * Read the stacks from the FS and call remove then create on each stack
 * @param {String} jwt Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<void>}
 */
async function removeAndCreateStacks (jwt, url) {
  let data = await bf.readFromBackupFile(filename)

  let backupStacks = JSON.parse(data)
  log.info(`Found ${backupStacks.length} stack(s) in ${filename}`)

  for (let stack of backupStacks) {
    log.debug(`Removing stack ${stack.Id}`)
    let removeResponse = await portainer.removeStack(jwt, url, stack.Id)
    log.info({data: removeResponse}, `Removed stack ${stack.Id}`)

    log.debug(`Creating stack ${stack.Id}`)
    let createResponse = await portainer.createStack(jwt, url, stack)
    log.info({data: createResponse}, `Created stack ${stack.Id}`)
  }
}

module.exports = {
  login,
  backupStacks,
  updateStacks,
  removeAndCreateStacks
}
