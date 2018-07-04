import test from 'ava'
import { before, after } from './utils'

const config = require('config')

const portainer = require('../lib/portainer/portainer.utils')
const stacks = require('../lib/stacks/stacks.utils')
const bf = require('../lib/fs/backupFiles.utils')

let filename = config.backupFile

test.before(before)

test('Backup stacks to FS', async t => {
  let jwt = await portainer.login(config.portainer.url, config.portainer.login, config.portainer.password)

  t.true(!!jwt, 'JWT does not exist')
  t.is(jwt, 'jwt_token', 'JWT token is not jwt_token')

  await stacks.backupStacks(jwt, config.portainer.url)

  let data = await bf.readFromBackupFile(filename)
  let backupStacks = JSON.parse(data)

  t.is(backupStacks.length, 2, 'Backup size is not 2')
  t.is(backupStacks[0].Name, 'nginx', 'Backup 0 name is not nginx')
  t.is(backupStacks[1].Name, 'HelloWorld', 'Backup 1 name is not HelloWorld')
})

test.after.always(after)
