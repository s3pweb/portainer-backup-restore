const axios = require('axios')

/**
 * Authenticate user on portainer API
 * @returns {Promise<String>} Generated JWT token
 */
async function login (url, login, password) {
  return new Promise((resolve, reject) => {
    axios.post(url + '/api/auth', {
      'Username': login,
      'Password': password
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
 * @param url
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getStacks (jwt, url) {
  return new Promise((resolve, reject) => {
    axios.get(url + '/api/endpoints/1/stacks',
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
 * @param url
 * @param id Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getStackFile (jwt, url, id) {
  return new Promise((resolve, reject) => {
    axios.get(url + `/api/endpoints/1/stacks/${id}/stackfile`,
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
 * @param url
 * @param id Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<>} Nothing if the request succeeds
 */
async function removeStack (jwt, url, id) {
  return new Promise((resolve, reject) => {
    axios.delete(url + `/api/endpoints/1/stacks/${id}`,
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
 * @param url
 * @param stackBackup Backup JSON, format is {"Name": "Stack name", "SwarmID": "123456789", "StackFileContent": "version: '3.4'..."}
 * @returns {Promise<JSON>} JSON Object containing the new stack ID
 */
async function createStack (jwt, url, stackBackup) {
  return new Promise((resolve, reject) => {
    axios.post(url + '/api/endpoints/1/stacks?method=string', stackBackup,
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
 * @param url
 * @param id Stack ID (<stack name>_<swarm ID>
 * @param stackBackup Backup JSON, format is {"Name": "Stack name", "SwarmID": "123456789", "StackFileContent": "version: '3.4'..."}
 * @returns {Promise<>} Nothing if the request succeeds
 */
async function updateStack (jwt, url, id, stackBackup) {
  return new Promise((resolve, reject) => {
    axios.put(url + `/api/endpoints/1/stacks/${id}`, stackBackup,
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
