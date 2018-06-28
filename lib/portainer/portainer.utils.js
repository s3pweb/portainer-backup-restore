const axios = require('axios')
const config = require('config')

/**
 * Authenticate user on portainer API
 * @returns {Promise<String>} Generated JWT token
 */
async function login () {
  return new Promise((resolve, reject) => {
    axios.post(config.portainer.url + '/api/auth', {
      'Username': config.portainer.login,
      'Password': config.portainer.password
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((response) => {
      resolve(response.data.jwt)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * Get all the stacks from portainer API
 * @param jwt Token from login()
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getStacks (jwt) {
  return new Promise((resolve, reject) => {
    axios.get(config.portainer.url + '/api/endpoints/1/stacks',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + jwt
        }
      }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * Get the stack file content from portainer API
 * @param jwt Token from login()
 * @param id Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getStackFile (jwt, id) {
  return new Promise((resolve, reject) => {
    axios.get(config.portainer.url + `/api/endpoints/1/stacks/${id}/stackfile`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + jwt
        }
      }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * Delete the stack on portainer
 * @param jwt Token from login()
 * @param id Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<>} Nothing if the request succeeds
 */
async function removeStack (jwt, id) {
  return new Promise((resolve, reject) => {
    axios.delete(config.portainer.url + `/api/endpoints/1/stacks/${id}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + jwt
        }
      }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * Create a new stack on portainer from a backup
 * @param jwt Token from login()
 * @param stackBackup Backup JSON, format is {"Name": "Stack name", "SwarmID": "123456789", "StackFileContent": "version: '3.4'..."}
 * @returns {Promise<JSON>} JSON Object containing the new stack ID
 */
async function createStack (jwt, stackBackup) {
  return new Promise((resolve, reject) => {
    axios.post(config.portainer.url + '/api/endpoints/1/stacks?method=string', stackBackup,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + jwt
        }
      }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * Update the stack on portainer from a backup
 * @param jwt Token from login()
 * @param id Stack ID (<stack name>_<swarm ID>
 * @param stackBackup Backup JSON, format is {"Name": "Stack name", "SwarmID": "123456789", "StackFileContent": "version: '3.4'..."}
 * @returns {Promise<>} Nothing if the request succeeds
 */
async function updateStack (jwt, id, stackBackup) {
  return new Promise((resolve, reject) => {
    axios.put(config.portainer.url + `/api/endpoints/1/stacks/${id}`, stackBackup,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + jwt
        }
      }).then((response) => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

module.exports = {
  login,
  getStacks,
  getStackFile,
  removeStack,
  createStack,
  updateStack
}
