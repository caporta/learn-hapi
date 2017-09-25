'use strict'
const Hapi = require('hapi')
const Good = require('good')


const server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 8000,
})

const options = {
  reporters: {
    reporter: [{
      module: 'good-console',
      args: [{ log: '*', response: '*' }],
    }, 'stdout'],
  },
}

server.register({
  register: Good,
  options,
}, error => {

  if (error) {
    return console.error(error)
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello hapi')
    },
  })

  server.start(() => {
    console.log(`Started at ${server.info.uri}`)
  })
})
