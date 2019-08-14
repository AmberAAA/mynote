# 正则表达式

## 构造函数

在`ES5`中，正则表达式的构造函数的参数有两种情况

第一种，第一个参数传入字符串，第二个参数传入修饰符。

```js
var reg = new RegExp('abr', 'gi')
```

第二种，传入一个正则表达式
```js
var reg = new RegExp(/abr/gi)
```

`ES6`新增了一种方式，允许第一个参数传入整个表达式，第二个传入修饰符。需要注意的是，**如果表达式中已经包含了修饰符，则会被第二个参数，传入的修饰符完全取代**。

```js
let reg = new RegExp(/abr/gi, 'i')
reg.flags // -> i
```

## 字符串的正则方法

字符串一共有`4`种方法，可以使用正则表达式：`match()`, `split()`, `replace()`, `search()`。

ES6将这4个方法在语言内部全部调用`RegExp`的实例方法，从而做到与所有正则相关的方法全部定义在`RegExp`对象上。

## `u`修饰符

`ES6`新增了一个修饰符`u`用于正确处理码点大于`0xFFFF`的字符。

```js
/^\uD83D/u.test('\uD83D\uDC2A') // -> false
/^\uD83D/.test('\uD83D\uDC2A')  // -> true

/^\uD83D/u.test("🐪") // -> false
/^\uD83D/.test("🐪")  // -> true

'\uD83D\uDC2A' === "🐪" // -> true
```

一旦加上`u`操作符，将会改变以下正则表达式的行为。

### `.`点字符



## `RegExp.prototpyt.unicode`属性

## `y`修饰符

## `RegExp.prototype.sticky` 属性

## `RegExp.prototype.flags`属性

## `s`修饰符：dotAll模式

## 后行断言

## `Unicode`属性类

## 具m名组匹配

## `String.prototype.matchAll`
