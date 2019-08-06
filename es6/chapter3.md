# 字符串的扩展与新增方法

## 参考
1. [ECMAScript6入门 字符串的扩展](https://es6.ruanyifeng.com/#docs/string)
2. [ECMAScript6入门 字符串的新增方法](https://es6.ruanyifeng.com/#docs/string-methods)
3. [最为透彻的utf-8、unicode详解](https://blog.csdn.net/tcf_jingfeng/article/details/80134600)

## 字符串的扩展

### 字符Unicode表示法

目前JavaScript共有6种方法可以表示一个字符。
```js
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
```

### 字符串遍历器

ES6为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被for...of循环遍历。除了遍历字符串，这个遍历器最大的优点是可以识别大于`0xFFFF`的码点，传统的for循环无法识别这样的码点。（`0XFFFF`是两个字节哦）
```js
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```

### 直接输入`U+2028`和`U+2029`
JavaScript 字符串允许直接输入字符，以及输入字符的转义形式。但是，JavaScript 规定有5个字符，不能在字符串里面直接使用，只能使用转义形式。

* U+005C：反斜杠（reverse solidus)
* U+000D：回车（carriage return）
* U+2028：行分隔符（line separator）
* U+2029：段分隔符（paragraph separator）
* U+000A：换行符（line feed）

`ES2019`允许JavaScript字符串直接输入 U+2028（行分隔符）和 U+2029（段分隔符）。

```js
const PS = eval("'\u2029'");
```

### JSON.stringify()的改造

`ES2019`改变了`JSON.stringify()`的行为。如果遇到`0xD800`到`0xDFFF`之间的单个码点，或者不存在的配对形式，它会返回转义字符串，留给应用自己决定下一步的处理。

### 模板字符串

`ES6`引入了模板字符串解决频繁使用`+`进行拼接字符串的问题。
```js
$('#result').append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`)
```

## 字符串的新增方法

### `String.fromCodePoint()`
ES5提供的`String.fromCharCode()`无法返回码点大于`0xFFFF`的字符，大于`0xFFFF`的高位会溢出无效。为了避免这种情况，新增了`fromCodePoint`方法。
```js
String.fromCharCode(0x20BB7)
// ஷ
String.fromCharCode(0x0BB7)
// ஷ
String.fromCodePoint(0x20BB7)
// 𠮷
```

### `String.raw()`

返回一个`\`被转移的字符串

```js
String.raw`Hi\n${2+3}!`;
// "Hi\\n5!"

String.raw`Hi\u000A!`;
// 返回 "Hi\\u000A!"

```

String.raw()方法也可以作为正常的函数使用。这时，它的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该是一个数组。

```js
String.raw({ raw: 'test' }, 0, 1, 2);
// 't0e1s2t'

```

### 实例方法：codePointAt()

JavaScript内部，字符以`UTF-16`的格式储存，每个字符固定为`2`个字节。对于那些需要`4`个字节储存的字符（`Unicode`码点大于`0xFFFF`的字符），JavaScript会认为它们是两个字符。
ES6 提供了codePointAt()方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。
```js
let s = "𠮷";

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```

但是需要的是参数并不是连续的。
```js
let s = '𠮷a';
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));
}
```

### 实例方法：normalize()

语调符号和重音符号相关， 略。

### 实例方法：includes(), startsWith(), endsWith()
传统上，JavaScript 只有
`indexOf`方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法。

- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

```js
let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

// 接受第二参数表示从第几个字符开始搜索

let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```

### 实例方法：repeat() 

`repeat`方法返回一个新字符串，表示将原字符串重复`n`次。

```js
'x'.repeat(3) // "xxx"
// 如果是小数，将会向上取整。
'na'.repeat(2.9) // "nana"

```

### padStart()，padEnd()
`ES2017`引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。`padStart()`用于头部补全，`padEnd()`用于尾部补全。

```js
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab') // 'xabab'
'abc'.padStart(10, '0123456789')

```

### 实例方法：trimStart()，trimEnd()

```js
const s = '  abc  ';

s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"

```


上面代码中，`trimStart()`只消除头部的空格，保留尾部的空格。`trimEnd()`也是类似行为。

除了空格键，这两个方法对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。

浏览器还部署了额外的两个方法，`trimLeft()`是`trimStart()`的别名，`trimRight()`是`trimEnd()`的别名。


