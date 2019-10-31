// setTimeout(function () {
//   console.log('setTimeout1');
//   Promise.resolve().then(() => {
//     console.log('settimeout-promise-then1')
//   })
// }, 0)
// setTimeout(function () {
//   console.log('setTimeout2');
//   Promise.resolve().then(() => {
//     console.log('settimeout-promise-then2')
//   })
// }, 0)
// async function async1() {
//   console.log('async1 start');
//   await async2();
//   console.log('async1 end');
// }
// async function async2() {
//   console.log('async2');
// }
// console.log('script start');

// async1();
// new Promise(function (resolve) {
//   console.log('promise1');
//   resolve();
// }).then(function () {
//   console.log('promise2');
// }).then(() => {
//   console.log('promise3')
// }).then(() => {
//   setTimeout(function () {
//     console.log('setTimeout3');
//     Promise.resolve().then(() => {
//       console.log('settimeout-promise-then3')
//     })
//   }, 0)
// });
// console.log('script end');
new Promise((resolve, rejects) => {
  console.log('promise')
  resolve('123')
}).then(res => {
  console.log('promise-then-', res)
})
process.nextTick(() => {
  console.log('nextTick')
  process.nextTick(() => {
    console.log('nextTick')
    process.nextTick(() => {
      console.log('nextTick')
      process.nextTick(() => {
        console.log('nextTick')
      })
    })
  })
})