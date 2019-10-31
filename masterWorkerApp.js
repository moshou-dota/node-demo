let child_process = require('child_process')
let childWorker = child_process.fork('childWorker.js', ['args1'])
childWorker.on('exit', function () {
  console.log('child process exit')
})
childWorker.send({hello: 'child'})
childWorker.on('message', data => {
  console.log('form child process msg:', data)
})