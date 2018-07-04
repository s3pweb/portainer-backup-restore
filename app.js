const yargs = require('yargs')

const log = require('./lib/logger/logger')('Main')
const stacks = require('./lib/stacks/stacks.utils')

const argv = yargs
  .command('backup', 'Back up stacks from portainer')
  .command('update', 'Update the backed up  stacks')
  .command('create', 'Remove then create the backed up stacks')
  .options({
    'u': {
      demand: false,
      alias: 'url',
      describe: 'Portainer\'s URL',
      string: true
    },
    'l': {
      demand: false,
      alias: 'login',
      describe: 'User\'s login to use',
      string: true
    },
    'p': {
      demand: false,
      alias: 'password',
      describe: 'User\'s password',
      string: true
    }
  })
  .implies('url', 'login')
  .implies('login', 'password')
  .implies('login', 'url')
  .implies('password', 'login')
  .implies('password', 'url')
  .help()
  .alias('help', 'h')
  .locale('en')
  .argv

async function main () {
  log.debug({yargs: argv}, 'Starting app')

  // Log in and get JWT token from portainer
  let jwt = await stacks.login(argv.url, argv.login, argv.password)

  if (argv._[0] === 'backup') {
    // Get all stacks from portainer and save them to a json file
    await stacks.backupStacks(jwt, argv.url)
  } else if (argv._[0] === 'update') {
    // Read the backup file then update all the stacks
    await stacks.updateStacks(jwt, argv.url)
  } else if (argv._[0] === 'create') {
    // Read the backup file then re-create all the stacks
    await stacks.removeAndCreateStacks(jwt, argv.url)
  } else {
    log.warn(`Unknown command`)
  }
}

main()
  .catch((err) => {
    log.error({err: err}, `Error`)
  })
