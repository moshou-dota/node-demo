let Readable = require('stream').Readable
let util = require('util')

console.log('MyReadable', MyReadable)
util.inherits(MyReadable, Readable)

function MyReadable (array) {
  Readable.call(this, {objectMode: true})
  this.array = array
}

MyReadable.prototype._read = function () {
  if(this.array.length) {
    this.push(this.array.shift())
  } else {
    this.push(null)
  }
}

const array = ['a', 'b', 'c', 'd', 'e']
const read = new MyReadable(array);
read.on('data', function (data) {
  console.log('read-on:', data)
})
read.on('end', function (){
  console.log('data-end')
})