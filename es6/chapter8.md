# 对象扩展

## 对象的简洁表示方法

1. 属性值

ES6允许如下简洁定义对象属性，变量名为属性名，变量值为属性值。

```js
const foo = 'goo'
const cls = { foo } // -> {foo: 'goo'}
```

2. 方法

ES6 在定义方法是，也允许按照以下格式进行简写。

```js
const cat = {
    name: 'cat',
    jump () {
        console.log(`jump`)
    }
}
```

3. getter, setter

```js
const cat = {
    _name: 'cat',

    set name (str) { 
        if (typeof str === 'string' && str !== '') {
            this._name = str
        } else {
            throw new Error('Illegal name')
        }
    },

    get name () { return this._name }
}
```

## 属性名表达式

ES5中两种定义对象方法

```js
let obj = {}

// 方法一
obj.foo = 'foo'
// 方法二
obj['a' + 'bc'] = 'abc'
```

但是在对象字面量中，只能使用方法一。ES6允许在对象字面量中使用方法二。但是，方法二与属性简写不能同时使用
```js
const foo = 'foo'

// error
const obj = {
    ['foo']
}

const obj1 = {
    foo,
    ['asd']: 'asd'
}
// -> { foo: 'foo', asd: 'asd'}
```
注意，属性名表达式如果是非字符串，则会将其转为为字符串，如果是对象默认情况下会自动将对象转为字符串`[object Object]`，这一点要特别小心。如下所示
```js
const key1 = { toString () {return 'amber'} }
const key2 = { name: 'pizza' }
const obj = { [key1]: 1, [key2]: 2 }  // -> { amber: 1, '[object Object]': 2 }
```

## 方法的name属性

函数的name属性，返回函数名。对象方法也是函数，因此也有name属性。

## 属性的可枚举与遍历

对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。`Object.getOwnPropertyDescriptor`方法可以获取该属性的描述对象。

```js
let obj = { amber: 1 };

Object.getOwnPropertyDescriptor(obj,  'amber')

// { value: 1, writable: true, enumerable: true, configurable: true }
```
描述对象的`enumerable`属性，称为“可枚举性”，如果该属性为`false`，就表示某些操作会忽略当前属性。


目前，有四个操作会忽略enumerable为false的属性。
* `for ... in ...`循环： 只遍历对象自身的和继承的可枚举属性。
* `Object.keys`: 返回对象自身的可枚举的属性的键名。
* `JSON.stringify()`: 只串化对象自身的可枚举属性。
* `Object.assign()`: 只拷贝对象自身的可遍历属性。

## 属性遍历

| 方法| 忽略 `enumerable = false` | 遍历继承 | 包含Symbol属性 | 备注 |
|:--| :----: |:--:|:--| ---  |
`for...in`| √ | √ | ×
`Object.keys(obj)`| √ | × | ×
`Object.getOwenPropertyNames(obj)`| × | × | √
`Object.getOwnPropertySymbols(obj)`| - | × | √ | 只遍历自身的Symbol属性
`Reflect.ownKeys(obj)` | ×  | √ | √ |

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
* 首先遍历所有数值键，按照数值升序排列。
* 其次遍历所有字符串键，按照加入时间升序排列。
* 最后遍历所有 Symbol 键，按照加入时间升序排列。

## Super关键字

Super关键字只能在对象的方法中进行使用，`Super`关键字类似于`this`。指向对象的原型对象。

```js
const obj = { 
    x: 'World',
    foo () { console.log(this.x) }
}

const aim = {
    x: 'Hello',
    foo () { super.foo() }
}

Object.setPrototypeOf(aim, obj)
aim.foo()  // -> Hello  原因如下
```

JavaScript 引擎内部，`super.foo`等同于`Object.getPrototypeOf(this).foo`（属性）或`Object.getPrototypeOf(this).foo.call(this)`（方法）。绑定的this依然是`aim`。

## 扩展运算符

### 解构赋值
对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有**可遍历**的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。
```js
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```

### 扩展运算符

扩展运算符辅助对象自身可遍历属性

```js
let z = {a: 3, d: 2}
let {... d} = z
let e = { ...z }
```

## 对象的新增方法

### Object.is()

它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

```js
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### `Object.assign()`

`Object.assign`方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。
```js
const target = { a: 1 };

const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

### `Object.getOwnPropertyDescriptors()`

```js
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
```
