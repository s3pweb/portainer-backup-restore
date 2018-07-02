const log = require('./lib/logger/logger')('Main')
const portainer = require('./lib/portainer/portainer.utils')
const stacks = require('./lib/stacks/stacks.utils')

async function main () {
  log.debug('Starting app')

  // Log in and get JWT token from portainer
  let jwt = await portainer.login()
  log.info({jwt: jwt}, `Logged in`)

  // Get all stacks from portainer and save them to a json file
  await stacks.backupStacks(jwt)

  // await stacks.updateStacks(jwt)

  await stacks.removeAndCreateStacks(jwt)
}

main()
  .catch((err) => {
    log.error({err: err}, `Error`)
  })
