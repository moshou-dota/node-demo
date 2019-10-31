var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }, err => {
  if (err) {
    console.log('mongo connect fail')
  } else {
    console.log('mongo connect success')
  }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('db connected')
})

var loginSchema = new mongoose.Schema({
  username: String,
  password: String
});
var login = db.model("login", loginSchema, "login");

async function saveAdmin () {
  var result = await login.find({username: 'admin'})
  if (result.length > 0) return
  var loginInfo = new login({username: 'admin', password: '123456'})
  loginInfo.save(err => {
    if (err) {
      console.log('login save fail')
    } else {
      console.log('login save success')
    }
  })
}
saveAdmin()
async function validate (data = {}) {
  console.log('validate--data:', data)
  let result = await login.find(data)
  console.log('validate--result:', result)
  return result.length > 0? true: false
} 

var blogListSchema = new mongoose.Schema({
  title: String,
  kind: String,
  id: String
})
var blogList = db.model('blogList', blogListSchema, 'blogList')

var blogSchema = new mongoose.Schema({
  content: String,
  id: String
})
var blog = db.model('blog', blogSchema, 'blog')

async function getBlogList(kind) {
  let query = {}
  let results = []
  if (kind !== '/') {
    query = {
      kind: kind
    }
  }
  results = await blogList.find(query)
  return results
}

async function queryMaxID() {
  let temp = 0
  await blogList.find({}).sort({
    'id': -1
  }).limit(1).then(doc => {
    if (doc.length > 0) {
      temp = doc[0].id
    } else {
      console.log('collection is empty')
    }
  })
  return temp
}

async function insertBlogList(title, kind) {
  let value = await queryMaxID()
  var record = new blogList({
    title: title,
    kind: kind,
    id: ++value
  })
  await record.save(function (err) {
    if (err) {
      console.log('blog save fail', err)
      return
    }
    console.log('blog save success, id is ' + value)
  })
  return value
}

function deleteBlogId(id) {
  let query = {
    id: id
  }
  blogList.remove(query).then(doc => {
    console.log('delete blog done')
  })
}

function modifyBlogKind(id, kind) {
  let query = {
    id: id
  }
  blogList.findOneAndUpdate(query, {
    kind: kind
  }).then(doc => {
    console.log('modify blog kind done')
  })
}

async function saveBlog(path, id) {
  var content = require('fs').readFileSync(path, {
    encoding: 'UTF-8'
  })
  var query = new blog({
    content: content,
    id: id
  });
  await query.save(err => {
    if (err) {
      console.log('save blog to db err:--', err)
      return
    }
    console.log('save blog to db success')
  })
}

async function readBlog (id) {
  var result = await blog.find({id: id})
  return result[0]
}

module.exports = {
  insertBlogList,
  deleteBlogId,
  modifyBlogKind,
  saveBlog,
  readBlog,
  getBlogList,
  validate
}