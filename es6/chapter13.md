# Iterator 和 for...of循环

## 遍历器的概念

随着ES6新增的`Map`， `Set`数据结构，现在Javascript一共有4中可以表示集合的数据结构，为了统一调用机制，出现了`Iterator`遍历器。遍历器是一个函数，返回一个有`next`方法的对象。每次调用`next`方法，会返回一个对象`{value: 'demeo', done: false}`，当`done`为`true`时表示遍历结束。

```js
// demo
let makeIterator = function (arr) {
    let index = 0;
    return {
        next: function () {
            return index < arr.length ? 
            {
                value: arr[index++],
                done: false
            } :
            {
                value: undefined,
                done: true
            }
        }
    }
}

let i =  makeIterator([1, 2])
i.next()  // -> { value: 1, done: false }
i.next() // -> { value: 2, done: false }
i.next() // -> { value: undefined, done: true }
```

## ArrayLike的遍历器

1. 对与ArrayLike对象，可以直接使用数组的遍历器

```js
let arrLike = {
    0: 0,
    1: 1,
    length: 2,
    [Symbol.iterator]:  Array.prototype[Symbol.iterator]
}

for (let i of arrLike) { console.log(i) }
// 0
// 1
```

2. 自定义遍历器

```js

let arrLike = {
    0: 0,
    1: 1,
    length: 2,
    [Symbol.iterator]: function () {
        let index = 0;
        return {
            next: () => {
                return index < this.length ? { value: this[index++] } : { done: true }
            }
        }
    }
}

for (let i of arrLike) { console.log(i) }
// 0
// 1
```

next方法返回一个对象，表示当前数据成员的信息。这个对象具有value和done两个属性，value属性返回当前位置的成员，done属性是一个布尔值，表示遍历是否结束，即是否还有必要再一次调用next方法。


## Object的遍历器

```js
let cls = {
    data: [2, 3],
    [Symbol.iterator]: function () {
        let index = 0;
        return {
            next: () => {
                return index < this.data.length ? { value: this.data[index++] } : { done: true }
            }
        }
    }
}
for (let i of cls) { console.log(i) }
// 2
// 3
```

## 遍历器的场合

1. 解构赋值
2. 扩展运算符
3. yield*
4. 其他场合

    * for...of
    * Array.from()
    * Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
    * Promise.all()
    * Promise.race()

## Iterator 接口与 Generator 函数

Symbol.iterator方法的最简单实现，还是使用下一章要介绍的 Generator 函数。

```js
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
}
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"

```
## 遍历器对象的 return()，throw()

遍历器对象除了具有next方法，还可以具有return方法和throw方法。如果你自己写遍历器对象生成函数，那么next方法是必须部署的，return方法和throw方法是否部署是可选的。

return方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。



