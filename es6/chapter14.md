# Generator 函数的语法

## 简介

Generator 函数是 ES6 提供的一种异步编程解决方案。Generator与普通函数有两点不同，一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

for (let i of hw) { console.log(i) }
// -> hello
// -> world
// -> undefined
```

### yield 表达式

遍历器对象的next方法的运行逻辑如下

* 遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
* 下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。
* 如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
* 如果该函数没有return语句，则返回的对象的value属性值为undefined。

注意`yield`表达式只能出现在`Generator`函数中。

```js
let generator = function* () {
    console.log(`init`)
    console.log('hello', yield 'world');
    yield (3 + 4);
    yield 3;
}

let gen = generator()

gen.next() 
// -> init
// -> { value: 'world', done: false }
gen.next()
// -> hello undefined
// -> { value: 7, done: false }
gen.next()
// -> { value: 3, done: false }
gen.next()
// -> { value: undefined, done: true }

```

### 与 Iterator 接口的关系

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。

```js

var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]

```

### next 方法的参数

yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

```js
let generator = function* () {
    let i = 0
    while(true) {
        var reset = yield i++
        if (reset) break;
    }
}

let gen = generator();
gen.next()
// -> { value: 0, done: false }
gen.next()
// -> { value: 1, done: false }
gen.next()
// -> { value: 2, done: false }
gen.next(true)
// -> { value: undefined, done: true }
```

## Generator.prototype.throw()

```js
let generator = function* () {
    try {
        let i = 0
        while(true) {
            yield i++
        }
    } catch (e) {
        console.error(new Error(e))
    }
}

let gen = generator()
gen.next()  // -> { value: 0, done: false }
gen.next()  // -> { value: 1, done: false }
gen.throw(`a error`)
// -> Error: a error
// ->{ value: undefined, done: true }
gen.next() // -> { value: undefined, done: true }

```

## Generator.prototype.return()

Generator 函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。

## yield* 表达式 
ES6 提供了yield*表达式，作为解决办法，用来在一个 Generator 函数里面执行另一个 Generator 函数。

```js
const foo = function* () {
    yield 1;
    yield 2;
}

const bar = function* () {
    yield 'a';
    yield* foo()
    yield* [true, false]
    yield* '🐂🍺'
    yield 'b';
}

[...bar()]
// ->  [ "a", 1, 2, true, false, "🐂", "🍺", "b" ]
```

```js
// 使用yield遍历二叉树

const Tree = function (left, label, right) {
    this.left = left
    this.label = label,
    this.right = right
}

function make (arr) {
    if (arr.length === 1)  return new Tree(null, arr[0], null)
    else return new Tree(make(arr[0]), arr[1], make(arr[2]))
}

let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

[...inorder(tree)]
// [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ]

```