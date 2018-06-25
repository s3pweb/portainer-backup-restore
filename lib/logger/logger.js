const bunyan = require('bunyan')
const config = require('config')

let log = bunyan.createLogger({
  name: 'logger',
  application: config.name,
  src: true,
  serializers: {
    err: bunyan.stdSerializers.err
  },
  streams: [
    {
      level: config.consoleLogLevel,
      stream: process.stdout
    }
  ]
})

let child = function (name) {
  return log.child({loggerName: name})
}

module.exports = child
