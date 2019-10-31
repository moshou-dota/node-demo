const formidable = require("formidable")
const fs = require('fs')
const dbApi = require('./db')
const path = require('path')

async function dealUpload(ctx, next) {
  if (ctx.method == "POST" && ctx.path == "/upload") {
    var form = new formidable.IncomingForm()
    let savePath = path.join(__dirname, '../' + '/static/blogs/')
    form.keepExtensions = true
    form.uploadDir = savePath
    form.parse(ctx.req, async function (err, fields, files) {
      if (err) {
        console.log('upload error', error)
        return err
      }
      fs.renameSync(files.file.path, savePath + files.file.name)
      let blogId = await dbApi.insertBlogList(files.file.name, fields.kind)
      await dbApi.saveBlog(savePath + files.file.name, blogId)
      await next()
    })
  } else {
    await next()
  }
}
module.exports = dealUpload;