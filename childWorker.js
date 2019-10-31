let begin = process.argv[2]
console.log('I am worker ' + begin)
process.on('message', data => {
  console.log('from master process msg:', data)
  process.exit()
})
process.send({hello: 'parent'})