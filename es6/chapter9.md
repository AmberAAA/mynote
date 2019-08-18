# Symbol

## 概述

ES6引入了一个新的原始数据类型`Synbol`，表示独一无二的值，在此之前，JavaScript共有`6`中基础数据类型，`undefined`，`null`, 布尔，数值，字符串，对象。

```js
const symbolApple = Symbol('apple')
const symbolPen = Symbol('pen')
typeof symbolApple // -> Symbol

const pen1 = Symbol('pen')
const pen2 = Symbol('pen')
pen1 === pen2  // -> false
```

## `Symbol.prototype.description`
`ES2019`新增内容，返回`Symbol`的新描述

```js
const foo = Symbol('foo')
foo // -> Symbol(foo)
foo.description // ->  foo
```

## 作为属性名的Symbol

由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

```js
const mySymbol = Symbol()

// 写法一
let a = {
    [mySymbol]: 1
}

// 写法二
let b = {}
b[mySymbol] = 1

// 写法三
let c = {}
Object.defineProperty(c, mySymbol, { value: 1 })

c[mySymbol] // -> 1

```

作为方法名
```js
const fun = Symbol('fun')

const a = {
    [fun] (str) { console.log(str) }
}

a[fun]('amber') // -> amber

```

Symbol 类型还可以用于定义一组常量，保证这组常量的值都是不相等的。常量使用`Symbol`值最大的好处，就是其他任何值都不可能有相同的值了，因此可以保证上面的switch语句会按设计的方式工作。
```js
const COLOR_RED    = Symbol();
const COLOR_GREEN  = Symbol();

function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return COLOR_GREEN;
    case COLOR_GREEN:
      return COLOR_RED;
    default:
      throw new Error('Undefined color');
    }
}

getComplement(COLOR_RED) // -> COLOR_GREEN
```

## 属性名的遍历

由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

```js
let size = Symbol('size')

class Collection {
    constructor () {
        this[size] = 0
    }

    add (item) {
        this[this[size]] = item
        this[size]++
    }

    static sizeOf (instance) {
        return instance[size]
    }
}

let x = new Collection()
Collection.sizeOf(x) // -> 0

x.add('apple')
Collection.sizeOf(x) // -> 1

Object.keys(x) // ['0']
Object.getOwnPropertyNames(x) // ['0']
Object.getOwnPropertySymbols(x) // [Symbol('size')]

```

## Symbol.for(), Symbol.keyFor()

有时，我们希望重新使用同一个 Symbol 值，Symbol.for方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。

```js
const s1 = Symbol.for('s')
const s2 = Symbol.for('s')
s1 === s2 // -> true
```

`Symbol.keyFor`会返回一个已经登记`Symbol`的`Key`。
```js
const s1 = Symbol.for('s')
Symbol.keyFor(s1) // -> 's'

const s2 = Symbol('s')
Symbol.keyFor(s2) // -> 'undefined'
```

