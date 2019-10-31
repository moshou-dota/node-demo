const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log('Master process id is', process.pid);
  for(let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log('worker process dided, id', worker.process.pid)
  })
} else {
  http.createServer((req, res) => {
    res.writeHead(200)
    res.end('hello word')
    process.exit()
  }).listen(8000)
  console.log('Worker started, process id', process.pid)
}