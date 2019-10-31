const Koa = require('Koa')
const static = require('koa-static')
const bodyParser = require ('Koa-bodyparser')
const router = require('./middleware/router')
const views = require('koa-views')
const path = require('path')
const dealUpload = require('./middleware/upload')
const validate = require('./middleware/validate').validate
const session = require('./middleware/session').session
const app = new Koa()

app.use(static(__dirname + '/src/html', {extensions: ['html']}))
app.use(views(path.join(__dirname, '/static/blogs'), {extension: 'ejs'}))
app.use(bodyParser())
app.use(validate)
session(app, router)
app.use(router.routes())
app.use(dealUpload)

app.listen(3000, () => {
  console.log('connect to 3000')
})
