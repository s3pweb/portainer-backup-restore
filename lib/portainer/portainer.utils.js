const axios = require('axios')
const config = require('config')

async function auth () {
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

module.exports = {
  auth,
  getStacks,
  getStackFile
}
