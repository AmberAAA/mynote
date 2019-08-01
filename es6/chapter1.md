# 作用域、作用域链、Let、Const

## 前置知识点

### 作用域

<!-- TODO:待完善 -->

### 作用域链

<!-- TODO:待完善 -->

### 闭包

<!-- TODO:待完善 -->

## Let

### 基本用法
与`var`相同，用来声明变量。但是拥有块级作用域，只能在let命令所在的块内调用。
``` js
{
    let a = 3;
    var b = 1;
}
a  // ReferenceError: a is not defined
b  // 1
```

块级作用域在计数器上的应用
```js
let b = []
// ES6标准
for (let i = 0; i < 10; i++) {
    b[i] = function () {
        console.log(i)
    }
}
i  // ReferenceError: a is not defined
b[6]()  // 6

// 旧版标准
b = []
for (var j = 0; j < 10; j++) {
    b[j] = function() {
        console.log(j)
    }
}
j // 10
b[3](0) // 10


// TODO: 使用闭包实现计数器

```
上面代码中，变量`i`是`let`声明的，当前的`i`只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是`6`。你可能会问，如果每一轮循环的变量i都是重新声明的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为 JavaScript 引擎内部会记住上一轮循环的值，初始化本轮的变量i时，就在上一轮循环的基础上进行计算。

另外，`for`循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

### 不存在变量提升

`var`声明的变量会存在变量提升。及如果在声明前使用，值为`undefined`。在`let`命令之前调用声明变量。则会直接抛出`RefenceError`。

### 暂时性死区

```js
var amber = 3
function abr () {
    amber = 4
    let amber = 1
}

abr() // ReferenceError: can't access lexical declaration `amber' before initialization
```

ES6 明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错`ReferenceError`。

暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

总之，在代码块内，使用`let`命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

### 不允许重复声明

`let`不允许在相同作用域内，重复声明同一个变量。
```js
// 报错
function func() {
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  let a = 10;
  let a = 1;
}
```

## 块级作用域
### 为什么会出现块级作用域
出现块级作用域主要是为了避免两种事件的产生。
第一种场景，内层变量覆盖上层变量。
```js
var tmp = new Date();

function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world';  // 变量提升导致打印出的是undefind
  }
}

f(); // undefined
```
第二种场景，计数循环会泄露为全局变量。
```js
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5
```

### ES6中的块级作用域
1. 允许嵌套


## Const
`const` 用于声明一个只读常量。因此一旦声明就必须初始化。
```js
const tmp;  // SyntaxError
```
`const`与`let`相同，拥有块级作用域，变量声明也不会提升，也存在暂时性死区。

const的本质是变量指向的内存地址保存的值不允许改动。针对于非引用型变量，布尔、数值、字符串，意味着值不允许改变，等同于常量。针对引用型变量，如对象、函数，就表示不可以把该变量指向另一个内存地址。

