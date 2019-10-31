const router = require('Koa-router')()
const dbAPi = require('./db')
router.get('/', async(ctx, next) => {
  console.log('redirect -- bloglist')
  ctx.redirect('/blogList');
});
router.get('/login',async (ctx,next)=>{
  // console.log('ctx.render && typeof ctx.render',ctx.render && typeof ctx.render)
  if (ctx.render && typeof ctx.render === 'function') {
    return ctx.render('login');
  }
  next()
});

router.post('/login', async (ctx, next) => {
  let {name, password} = ctx.request.body
  let result = await dbAPi.validate({username: name, password})
  if (result) {
    ctx.cookies.set('LoginStatus', true)
    ctx.redirect('/blogList')
  } else {
    ctx.body = 'Login error'
  }
})
router.post('/delete/blog/:blogId', async (ctx, next) => {
  let blogId = ctx.params.blogId
  await dbAPi.deleteBlogId(blogId)
  await next()
})
router.post('/modify/blog/:blogId/:kindName', async (ctx, next) => {
  let blogId = ctx.params.blogId
  let kindName = ctx.params.kindName
  await dbAPi.modifyBlogKind(blogId, kindName)
  await next()
})
router.get('/blog/:blogId', async (ctx, next) => {
  let blogId = ctx.params.blogId
  let content = await dbAPi.readBlog(blogId)
  ctx.body = content && content.content
  await next()
})
router.get('/blogList', async(ctx, next) => {
  const results = await dbAPi.getBlogList('/')
  await ctx.render('blogList', {results: results})
  next()
})

module.exports = router
