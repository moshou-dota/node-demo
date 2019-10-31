const session = require('koa-session');
const redis = require('redis');
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
let client = redis.createClient('6379', '127.0.0.1')
client.on('error', err => {
  console.log('client err:', err)
})
client.on('ready', () => {
  console.log('client ready')
})

function initSession(app, router, config) {
  const CONFIG = config || {
    key: 'agent',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: false,
    store: {
      async get (key, maxAge, { rolling }) {
        console.log('get key: ', key)
        let result = await client.getAsync(key)
        console.log('get result: ', result)
        return result
      },
      async set (key, sess, maxAge, { rolling, changed }) {
        console.log('set key: ', key)
        let result = await client.setAsync(key, JSON.stringify(sess[CONFIG.key]))
        console.log('set result: ', result)
      },
      async destroy (key) {
        console.log('destroy key: ', key)
        let result = await client.delAsync(key)
        console.log('destroy result: ', result)
        return result
      },
    }
  }
  console.log('CONFIG', CONFIG)
  app.use(session(CONFIG, app))
  router.get('/blogList', (ctx, next) => {
    console.log('ctx.session.agent',ctx.session, ctx.session.agent)
    if (ctx.session && !ctx.session.agent) {
      ctx.session.agent = ctx.header['user-agent']
    }
    next()
  })
}

exports.session = initSession