# 变量的解构赋值

> 允许按照相应的语法从对象或数组中取值，并进行赋值

## 数组解构

```js
/* 基本写法 */ 
let [a, b, c] = [1, 2, 3];

/* 嵌套 */
let [d, [e, f], g] = [1, [2, 3], 4]
f // ->   3

/* 跳过 */
let [, ,c1] = [1, 2, 3];
c // -> 3

/* 剩余全选 */
let [a2, ...b2] = [1,2,3]
let [c2, ...d2] = [1]
b2 // -> [2, 3]
d2 // -> []

/* 解构不成功返回undefined */
let [a3, [b3, c3], d3] = [1, [2], 3]
c3 // -> undefined


/* 可以解构Set结构 */
let [a4] = new Set(['a', 'b', 'c'])
a4 // -> 'a'

/* 如果有遍历接口，也可以进行结构，如字符串 */
let [a5, b5] = 'string'
a5 // -> 's'
b5 // -> 't'

/* 
    解构时，可以设置默认值，
    赋值是也可指向其他变量
    对解构不成功的定位为严格等于undefined
*/

let [a6, b6 = 2] = [1]
let [c6 = 1, d6 = 2] = [null, undefined]
let [e6 = 1, f6 = e6] = [null, undefined]
b6 // -> 2
c6 // -> null
f6 // -> null


// 结构其他类型会报错
let [err1] = 2
let [err2] = {a: '1'}
let [err3] = true
// -> Type Error
``` 

## 对象解构

数组根据索引进行解构，而对象通过属性名进行解构。

### 基本用法

```js
/*
let {模式: 变量} = 目标对象
简写：
let { 模式 } = 目标对象
*/

const amber = {
    name: 'Amber',
    sex: 0,
    hobby: ['eatting' , 'sleeping'],
    saying: () => { console.log(`hei hei ~ I'm Amber`) },
    family: ['dad', 'mom', 'wife'],
    details: {
        age: 24
    }
}

const person = {
    aim: 2,
    leg: 2,
    mouth: 1,   
}

Object.setPrototypeOf(amber, person)

const backObj = {}
const backArr = []

const { name: N } = amber;
N; // -> 'Amber' 

const { name } = amber;  
name; // -> 'Amber'

/*
    对象属性的值或方法都可以解构
    注意圆括号 详见注意
*/
({ sex: backObj.s, saying } = amber)
backObj // -> { s: 0 }
saying() // -> hei hei ~ I'm Amber

/* 嵌套数组 */
const { hobby: [, hobby02]} = amber
hobby02 // -> sleeping

/* 嵌套对象 */
const { details: { age } } = amber
age // -> 24

/* 解构失败，返回undefined */
const { foo } = amber
foo // -> undefined

/* 会向上查找原型链 */
const { aim } = amber
aim // -> 2

/* 指定默认值 */
const { age: a = 3, like: like = null } = amber 
a // -> 3
like // -> null

/* 嵌套解构，若属性不存在则会报错 */
const { foo: { brz } } = amber  // -> TypeError

```

### 注意事项
对已经初始化的变量进行赋值时要小心，js解析器会将`{x}`理解为块代码，因此需要用小括号包裹
```js
let obj = {x: 1};
let x;
// 错误写法
{x} = obj; // -> SyntaxError
// 正确写法
({x} = obj);
x;
```
因为数组也是一种特殊的对象，因此也可以用对象解构
```js
let arr =  [0, 1, 2, 3, 4]
let {0: a, [arr.length - 1]: b} = arr
a // -> 0
b // -> 4
```
解构时左边可以传入为空，虽然没有意义
```js
let arr =  [0, 1, 2, 3, 4]
let {} = arr
```

## 字符串解构
可以把字符串当作数组进行解构
```js
let str = 'string'
let [a, b, ...c] = str
a // -> s
b // -> t
c // -> ['r', 'i', 'n', 'g']
```
也可以把字符串当作对象进行解构
```js
let str = 'string'
let {0: a, length: len, [str.length - 1]: b} = str
a // -> s
b // -> g
```

## 数字和布尔解构
当等号右边为数组或布尔类型时，会先转换为对象再进行解构
```js
num = 5
let {toString: nt} = num
nt === Number.prototype.toString

let boo = true
let {toString: bt} = boo
bt === Boolean.prototype.toString
```

## 函数的参数解构

```js
// 对第一个数组进行解构
let add = ([a, b]) => a + b
[[1, 2], [3, 4]].map(add) // -> [3, 7]

// 设置默认值
let plus1 = (x = 0) => x + 1
plus1() // 1
plus1(3) // 4


// 对第一个对象也可进行解构
let logName = ({name}) => { return `name is ${name}` }
logName({name: 'Amber'})
```

## 用途示例
### 交换变量值
```js
let [x, y] = [1, 2]
[y, x] = [x, y]
x // -> 2
y // -> 1
```
### 从函数返回多个值
```js
let demo = () => { return {name: 'Amber', sex: 1} }
let {name, sex} = demo()
name // -> amber
sex // -> 1
```
### 函数参数的定义
解构赋值可以方便地将一组参数与变量名对应起来。
```js
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});

```
### 提取JSON数据
```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
```
### 参数参数默认值
```js
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```
### 遍历MAP解构
任何部署了`Iterator`接口的对象，都可以用`for...of`循环遍历。`Map`结构原生支持 `Iterator`接口，配合变量的解构赋值，获取键名和键值就非常方便。
```js
// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}

```
### 输入模块的指定方法
加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。
```js
const { SourceMapConsumer, SourceNode } = require("source-map");
```
