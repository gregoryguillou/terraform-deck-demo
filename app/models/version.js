'use strict'
const request = require('request')

function version (workspace, callback) {
  request.get(`http://consul:8500/v1/kv/environment/${workspace}/version?raw=true`, (error, response, body) => {
    if (error) {
      return callback(null, 'error')
    }
    if (response.statusCode === 200) {
      callback(null, body)
    }
  })
}

module.exports = {
  version: version
}
