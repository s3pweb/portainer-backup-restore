import test from 'ava'
import { before, after } from './utils'

const config = require('config')

const portainer = require('../lib/portainer/portainer.utils')

test.before(before)

test('Log user', async t => {
  let jwt = await portainer.login(config.portainer.url, config.portainer.login, config.portainer.password)

  t.true(!!jwt, 'JWT does not exist')
  t.is(jwt, 'jwt_token', 'JWT token is not jwt_token')
})

test('Get all stacks', async t => {
  let data = await portainer.getStacks(undefined, config.portainer.url)

  t.true(!!data, 'Data exist')
  t.is(data.length, 2, 'Array size is not 2')
  t.is(data[0].Name, 'nginx', 'First stack name is not nginx')
  t.is(data[1].Name, 'HelloWorld', 'First stack name is not HelloWorld')
})

test('Get stack file', async t => {
  let data = await portainer.getStackFile(undefined, config.portainer.url, 'id')

  t.true(!!data, 'Data does not exist')
  t.true(!!data.StackFileContent, 'StackFileContent does not exist')
})

test.after.always(after)
