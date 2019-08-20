# Promise

## 概述

`Promise`是ES6新增的一个异步编程解决方案，它比回调函数，和事件更加合理。

`Primise`是一个对象，内部有三个状态`pedding`、`fulfiilled`、`rejected`。

Promise有以下两个特点。

(一)、 对象的状态不受外界干扰，只有异步操作才能改变其状态。

(二)、 对象的状态只能从`pedding`变成`fulfilled`，或从`pedding`变为`rejected`。

## 基本用法

```js

const promise = new Promise((resolved, reject) => {
    // do some thing
    if (flag) {
        // if success
        resolved()
    } else {
        // if error
        reject()
    }
})

```
Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。

```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

如果调用`resolve`函数和`reject`函数时带有参数，那么它们的参数会被传递给回调函数。`reject`函数的参数通常是Error对象的实例，表示抛出的错误；`resolve`函数的参数除了正常的值以外，还可能是另一个`Promise`实例，比如像下面这样。

```js
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})

```
注意，这时`p1`的状态就会传递给`p2`，也就是说，`p1`的状态决定了`p2`的状态。如果`p1`的状态是pending，那么`p2`的回调函数就会等待`p1`的状态改变；如果p1的状态已经是`resolved`或者`rejected`，那么p2的回调函数将会立刻执行。

下面是另外一个例子
```js

let promise1 = () => new Promise((resolved, rejected) => {
    console.log(`promise1 pedding`)
    setTimeout(() => {
        console.log(`promise1 before fulfilled`)
        resolved('promise1')
        console.log(`promise1 after fulfilled`)
    }, 1000)
})

let promise2 = () => new Promise((resolved, rejected) => {
    console.log(`promise2 pedding`)
    setTimeout(() => {
        console.log(`promise2 before fulfilled`)
        resolved(promise1())
        console.log(`promise2 after fulfilled`)
    }, 1000)
})


promise2().then(e => {
    console.log(`all fulfilled`)
})


// 预测

// promise2 pedding
// .....  after 1s
// promise2 before fulfilled
// promise1 pedding
// promise2 after fulfilled
// ..... after 1s
// promise1 before fulfilled
// promise1 after fulfilled
// all fulfilled
```


## Promise.prototype.then()

## Promise.prototype.catch()

## Promise.prototype.finally()

## Promise.all()
Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再（Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。）

```js
const arr = () => [
    new Promise((resolved) => { setTimeout(resolved, 1000, 'a') }),
    new Promise((resolved) => { setTimeout(resolved, 2000, 'b') }),
    new Promise((resolved) => { setTimeout(resolved, 3000, 'c') }),
    new Promise((resolved) => { setTimeout(resolved, 4000, 'd') }),
]

Promise.all(arr()).then(arr => console.log(arr))

// after 4s
// [ 'a', 'b', 'c', 'd' ]
```

上面代码中，p1会resolved，p2首先会rejected，但是p2有自己的catch方法，该方法返回的是一个新的 Promise 实例，p2指向的实际上是这个实例。该实例执行完catch方法后，也会变成resolved，导致Promise.all()方法参数里面的两个实例都会resolved，因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数。

如果p2没有自己的catch方法，就会调用Promise.all()的catch方法。

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// Error: 报错了
```

## Promise.race()

Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

## Promise.resolve()

* 参数是一个 Promise 实例

直接返回

* 参数是一个thenable对象,Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。

```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```

* 参数不是具有then方法的对象，或根本就不是对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。

```js
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```

* 不带有任何参数

直接返回一个resolved状态的 Promise 对象。

## Promise.reject()

