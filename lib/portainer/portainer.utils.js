const axios = require('axios')
const config = require('config')

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
