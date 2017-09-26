'use strict'
const Hapi = require('hapi')
const Boom = require('boom')
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

  // hapi evaluates routes in order of descending specificity. source order is irrelevant

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply(request.params)
    },
  })

  // can denote file extension
  server.route({
    method: 'GET',
    path: '/files/{filename}.jpg',
    handler: (request, reply) => {
      reply(request.params)
    },
  })

  // '?' denotes optional param. will match without (0-1)
  server.route({
    method: 'GET',
    path: '/users/{username?}',
    handler: (request, reply) => {
      reply(request.params)
    },
  })

  // can use wildcard for arbitrary (or limited) number of params. will match without (0-2, up to 0+)
  server.route({
    method: 'GET',
    path: '/children/{children*2}',
    handler: (request, reply) => {
      reply(request.params)
    },
  })

  // graceful error handling with boom
  server.route({
    method: 'GET',
    path: '/idontexist',
    handler: (request, reply) => {
      reply(Boom.notFound())
    },
  })

  server.route({
    method: 'GET',
    path: '/fancyheaders',
    handler: (request, reply) => {
      reply('hello world')
        .code(418)
        .type('text/plain')
        .header('foo', 'bar')
        .state('baz', 'qux')
    },
  })

  server.start(() => {
    console.log(`Started at ${server.info.uri}`)
  })
})
