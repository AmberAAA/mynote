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

`.`字符用来匹配除换行符以外的其他字符，加上`u`修复符后，可以正确匹配码点大于`0xFFFF`的字符。
```js
/^.$/.test("🐪")  // -> false
/^.$/u.test("🐪")  // -> true
```

### Ubicode 字符表示法
加上`u`修饰符之后，可以用大括号来表示Unicode字符
```js
/\u{61}/.test('a')  // -> false
/\u{61}/u.test('a')  // -> true
```

### 量词
添加`u`修饰符后，量词也会正确识别码点大于`0xFFFF`的Unicode字符。
```js
/a{2}/.test('aa') // true
/a{2}/u.test('aa') // true
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

### 预定义模式
`u`修饰符也影响到预定义模式，能否正确识别码点大于0xFFFF的Unicode字符。


```js
function codePointLength(text) {
  var result = text.match(/[\s\S]/gu);
  return result ? result.length : 0;
}

var s = '𠮷𠮷';

s.length // 4
codePointLength(s) // 2
```

### i修饰符

有些 Unicode 字符的编码不同，但是字型很相近，比如，`\u004B`与`\u212A`都是大写的`K`。

```js
/[a-z]/i.test('\u212A') // false
/[a-z]/iu.test('\u212A') // true
```

## `RegExp.prototpyt.unicode`属性

正则实例对象新增`unicode`属性，表示是否设置了`u`修饰符。

## `y`修饰符

除了`u`修饰符，ES6还为正则表达式添加了`y`修饰符。表示“粘连”(sticky)修饰符。

`y`操作符与`g`操作符相似，均为全局匹配，后一次的匹配，从上一次匹配成功的下一个位置开始。不同的是，`g`操作符在剩余字符的任意位置匹配成功均可。而`y`操作符必须要求从第一个字符开始匹配。

```js
s = 'aaa_aa_a'

r1 = /a+/g
r2 = /a+/y

r1.exec(s)  // -> ['aaa']
r1.exec(s)  // -> ['aa']
r1.exec(s)  // -> ['a']
r1.exec(s)  // -> null

r2.exec(s)  // -> ['aaa']
/*因为：剩下的字符_aa_a从开头开始并不匹配*/
r2.exec(s)  // -> null

r3 = /a+_/y
r3.exec(s) // -> ['aaa_']
r3.exec(s) // -> ['aa_']

```

## `RegExp.prototype.sticky` 属性

与y修饰符相匹配，ES6 的正则实例对象多了sticky属性，表示是否设置了y修饰符。

## `RegExp.prototype.flags`属性

ES6 为正则表达式新增了flags属性，会返回正则表达式的修饰符

## `s`修饰符：dotAll模式

正则表达式中，点（.）是一个特殊字符，代表任意的单个字符，但是有两个例外。一个是四个字节的 UTF-16 字符，这个可以用u修饰符解决；另一个是行终止符（line terminator character）。

ES2018 引入s修饰符，使得.可以匹配任意单个字符。

```js
const re = /foo.bar/s;
// 另一种写法
// const re = new RegExp('foo.bar', 's');

re.test('foo\nbar') // true
re.dotAll // true
re.flags // 's'
```



## 后行断言

**TODO**

## `Unicode`属性类

**TODO**

## 具m名组匹配

**TODO**

## `String.prototype.matchAll`

**TODO**
