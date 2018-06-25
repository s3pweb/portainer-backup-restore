const log = require('./lib/logger/logger')('Main')
const portainer = require('./lib/portainer/portainer.utils')

async function main () {
  log.info('Starting app')

  let jwt = await portainer.auth()
  log.info(`Logged in`)

  let stacks = await portainer.getStacks(jwt)
  log.info(`Found ${stacks.length} stack(s).`)

  for (let stack of stacks) {
    let stackFile = await portainer.getStackFile(jwt, stack.Id)
    log.info({stackFile: stackFile}, `Found stack file for id  ${stack.Id} stack(s).`)
  }
}

main()
  .catch((err) => {
    log.error({err: err}, `Error`)
  })
