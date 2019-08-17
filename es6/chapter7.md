# 数组的扩展

## 扩展运算符

数组的扩展运算符与函数的`rest`操作符一致，均表示为`...`。作用是将数组拆分为一组以逗号分隔的参数序列。

```js
const arr0 = [1, 2, 3]
console.log(...arr0)  // => 1 2 3

const arr1 = []
arr1.push(...arr0)
arr1 // => [1, 2, 3]

const arr2 = [1, 2]
function add (a, b, c, d) {
    return a + b + c + d
}
add(1, ...arr2, 2)  // -> 6

// 扩展符后面亦可以跟表达式
const arr3 = [
    ...(1 > 2　? 'c': [1, 2, 3]),
    4,
]
arr3 // -> [1, 2, 3, 4]
```

### 应用场景

1. 代替函数的`apply`方法， 将数组直接转换为函数的参数。

```js
const arr = [1, 2, 3]

function add (x, y, z) {
    return x + y + z
}

// ES5写法
add.apply(null, arr)  // -> 6

// ES6写法
add(...arr)  // -> 6


Math.max.apply(null, arr)  // -> 3
Math.max(...arr) // -> 3
```

2. 复制数组

因为数组是引用型变量，直接赋值其实只是改变了变量的指针，并没有创建新的数组。

```js
const arr1 = [1, 2, 3]

// 方法一
const arr2 = [...arr1]

// 方法二
const [...arr3] = arr1

// ES5 方法
const arr4 = arr.slice()

```

3. 解构赋值
数组的扩展符可以与结构赋值相结合，用于生成新的数组。

```js

// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list


const [b, ...c] = []
// b -> undefined
// c -> []

// 注意扩展符只能出现在数组元素的最后一个
const [...butLast, last] = [1, 2, 3, 4, 5];  // -> ERROR


```

4. 字符串解构

```js
const str = 'Hello World! 😁'

str.length // -> 15

// 字符串结构可以正确区分码点大于0xFFFF的unicode字符
const arr = [...str]
arr.length  // ->14
```

5. Iterator接口

将在后续章节中详讲

6. Map 和 Set 结构、 Generator函数

将在后续章节中详讲


## Array.form

`Array.from`将把`Array-Like`对象，可遍历对象，转换为`Array`对象。

```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    length: 2
}

// ES5 
const arr1 = [].slice.call(arrayLike)
const arr2 = Array.from(arrayLike)

// 只用部署了遍历接口，数组的扩展符就可以将其转换为数组。
const dom = document.querySelectorAll('div')
const domArr = [...dom]

// 只要对象内有length属性，Array.from就可以将其转换为数组。
const demo = {
    length: 3
}
Array.from(demo)  // -> [undefined, undefined, undefined]

```

Array.from(obj [, handle [, this]])

```js
Array.from({length: 3}, (item, index, arr) =>  index , null)  // [1, 2, 3]

```

## Array.of

Array.of方法用于将一组值，转换为数组。主要是避免`new Array()`因参数不一样的重载。

```js
Array.of(1,2,3,4) // [1, 2, 3, 4]
```

## 数组实例的`copyWithin()`

数组实例的copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

## 数组实例的`find()`与`findIndex()`
`find()`与`findIndex()`主要为了规避`indexOf()`的不足。`find()`与`findIndex()`均接收一个回调函数作为参数。


```js
// 若满足条件
[1, 2, 5, 10].find((value, index, arr) => value > 4)  // -> 5
[1, 2, 5, 10].findIndex((value, index, arr) => value > 4) // -> 2

// 若不满足条件
[1, 2, 5, 10].find((value, index, arr) => value < 0)  // -> undefined
[1, 2, 5, 10].findIndex((value, index, arr) => value < 0 ) // -> -1
```

## 数组实例的`fill`

fill方法使用给定值，填充一个数组。

```js
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']


```

## 数组实例的 entries()，keys() 和 values()

将在后续章节中详讲

## 数组实例的 includes()

Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。ES2016 引入了该方法。

## 数组实例的 flat()，flatMap()

数组的成员有时还是数组，Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。

flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。

## 数组的空位

ES6 则是明确将空位转为undefined。
