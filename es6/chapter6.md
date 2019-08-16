# 函数的扩展

## 函数参数的默认值

### 基本用法

ES5实现默认值的方法

方法一、若y对应的bool值为`false`，则失效。
```js
function fun1 (x, y) {
    y = y || 'World';
    console.log(x, y)
}

fun1('Hello') // -> Hello World
fun1('Hello', 0) // -> Hello World
fun1('Hello', 'Amber')  // -> Hello Amber
```

方法二、可以避免方法一的缺陷，但不简洁
```js
function fun2 (x, y) {
    if (typeof y === 'undefined') {
        y = 'World';
    }
    console.log(x, y)
}

fun2('Hello') // -> Hello World
fun2('Hello', 0) // -> Hello 0
fun2('Hello', 'Amber')  // -> Hello Amber
```

ES6 实现方法

```js
function fun3 (x, y = 'World') {
    console.log(x, y)
}

fun3('Hello') // -> Hello World
fun3('Hello', 0) // -> Hello 0
fun3('Hello', 'Amber')  // -> Hello Amber
```

需要注意的是，使用参数默认值时，不能出现同名参数，另外参数默认值是惰性求值的。
```js
function fun (x, x, y) {}  // 正常声明
function funErr (x, x, y = 1) {}  // error

let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
// 此时x=99 x+1=100
foo() // 100
x = 100;

// 此时x=100 x+1=101
foo() // 101

```

### 与解构赋值默认值结合使用

函数的默认值可以和解构赋值结合使用。

```js
function foo ({x, y = 3}) {
    console.log(x, y)
}

foo() // undefined 3
foo({x: 1}) // 1 3
foo({x: 3, y: 1})  // 3 1
// 如果没有传参数，或者参数无法解构则会报错
foo()  // TypeError
```

为了避免解构时没有传参数，可以用以下方式。

```js
function fetch (url, {body = '', method = 'GET', headers = {}} = {}) {
    console.log(method)
}

fetch('http://github.com')  // -> GET
fetch('http://github.com', {}) // -> GET
fetch('http://github.com', {method: 'POST'}) // -> POST
```


### 参数默认值的位置

通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。除非输入undefined去专门触发默认值。

### length属性

`function.length`返回函数的参数数量，对于有默认值的函数，则返回没有设置默认值的参数的数量。

### 作用域

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个**单独的作用域**（context）。等到初始化结束，这个作用域就会消失。

```js
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

两个特殊的例子，第一个例子

```js
a = 3
function foo1 (y = () => {a = 2}) {
    let a = 4
    return y()
}

foo1()
a // -> 2
```

第二个例子。注意，参数中的x, 与`var x = 3`中的x不在同一个作用域内，

```js
var x = 1;
function foo(x, y = function() { x = 2 }) {
  var x = 3;
  y();
  console.log(x);
}

foo() // 3
x // 1
```
## rest参数

ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。


## 严格模式

ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

## name属性

函数的name属性，返回该函数的函数名。

## 箭头函数

ES6允许通过`() => {}`声明箭头函数，但使用时需要注意以下几点：
1. 函数体内`this`指向定义时所在对象，并不是使用时所在对象。
2. 不能被当作构造函数使用。
3. 不可以使用`arguments`对象。
4. 不能使用`yield`命令，因此箭头函数不能做`Generator`函数。

this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是**箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。** 另外，由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。

### 不适用场合

场合一、对象内部方法，且在方法内使用到`this`
```js
let cat = {
    levels: 3,
    jump: () => {
        this.levels++
    }
}
cat.jump()
cat.levels  // 3
```

场合二、需要动态`this`的时候
```js
var button = document.getElementById('press');
button.addEventListener('click', () => {
  this.classList.toggle('on');
});
```
如上述代码所示，箭头函数中的`this`将指向全局变量，而若使用普通函数，则会自动指向`dom`节点。


## 尾调用优化

尾调用是指的是某个函数的最后一步是调用另一个函数。尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。

```js
// 尾调用优化
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120
```



## 函数参数的尾逗号

ES2017 允许函数的最后一个参数有尾逗号（trailing comma）。

## Function.prototype.toString()

toString()方法返回函数代码本身，以前会省略注释和空格。

## catch命令参数省略

JavaScript 语言的try...catch结构，以前明确要求catch命令后面必须跟参数，接受try代码块抛出的错误对象。