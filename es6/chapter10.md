# Set和Map数据结构

## Set数据结构

Set数据结构类似于数字，但不同的是内在元素不重复。

```js
const arr = [1, 2, 3, 1, 2]
set1 = new Set()
arr.forEach(i => set1.add(i))
set1 // Set { 1, 2, 3 }
```

Set构造函数也可接收一个初始化参数，如数组，或实现迭代结构的对象。Set内部按照严格等于进行判断数据是否重复，此外认为NaN等于自身。
```js
const arr = [1, 2, 3, 1, 2]

new Set(arr)// Set { 1, 2, 3 }
new Set('AmberAAA') // Set { 'A', 'm', 'b', 'e', 'r' }

// 数组去重
[...new Set(arr)] // -> [1, 2, 3]

// 字符串去重
[...new Set('AmberAAA')].join('')
```

### 实例方法

* `Set.prototype.constructor`: 构造函数，默认就是`Set`函数。
* `Set.prototype.size`：返回Set实例的成员总数。

    操作相关
* `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
* `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
* `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为Set的成员。
* `Set.prototype.clear()`：清除所有成员，没有返回值。

    遍历相关
* `Set.prototype.keys()`：返回键名的遍历器
* `Set.prototype.values()`：返回键值的遍历器
* `Set.prototype.entries()`：返回键值对的遍历器
* `Set.prototype.forEach()`：使用回调函数遍历每个成员

```js
// 操作方法
const set = new Set([1, 2, 3, 4, 1])
set // -> Set { 1, 2, 3, 4 }
set.add(5) // -> Set { 1, 2, 3, 4, 5 }
set.delete(5) // -> true
set.has(2)  // -> true
set.clear()
set // -> Set {}
```

```js
// 遍历方法
const set = new Set([1, 2, 3, 4, 1])
// 因为由于Set结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。
for (let i of set.keys()) { console.log(i) }
// 1
// 2
// 3
// 4
for (let i of set.values()) { console.log(i) }
// 1
// 2
// 3
// 4
for (let i of set.entries()) { console.log(i) }
// [1, 1]
// [2, 2]
// [3, 3]
// [4, 4]
set.forEach((e) => console.log(e))
// 1
// 2
// 3
// 4
```

扩展运算符（`...`）内部使用`for...of`循环，所以也可以用于 Set 结构。

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

## WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。首先，WeakSet 的成员只能是对象，而不能是其他类型的值。其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。因此 ES6 规定 WeakSet 不可遍历。

### 实例方法

* `WeakSet.prototype.add`: 添加`Weakset`的成员。
* `WeakSet.prototype.delete`：删除`Weakset`的指定成员。
* `WeakSet.prototype.has`：查询对象是否是WeakSet实例的成员。返回Boolean。

## Map数据结构

JavaScript的`Objcet`是一个键值对结合，其中键只能为字符串。而Map结构是一种`值-值`对应。
```js
const map = new Map()
const o = { title: 'Chapter10.md' }
map.set(o, 'biu~')
map.get(o) // -> biu~
map.has(o) // -> true
map.set(o, 'pu~')]
map.delete(o) // -> true
```

直接向构造函数传值进行构造
```js
const map = new Map([
    [{a: 'd'}, 'a'],
    [{}, {}]
])
map // -> Map { { a: 'd' } => 'a', {} => {} }
map.has({}) // -> false

```

### Map的属性操作方法
* size 属性
* Map.prototype.set(key, value)
* Map.prototype.get(key)
* Map.prototype.has(key)
* Map.prototype.delete(key)
* Map.prototype.clear()

### Map的遍历方法

* Map.prototype.keys()：返回键名的遍历器。
* Map.prototype.values()：返回键值的遍历器。
* Map.prototype.entries()：返回所有成员的遍历器。
* Map.prototype.forEach()：遍历 Map 的所有成员。

需要特别注意的是，Map 的遍历顺序就是插入顺序。

**认识部署了迭代接口的对象，均可以使用`...`经行解构遍历**


### Map与其他结构互相转换

初始化Map对象
const map = new Map([
    [{}, {}],
    ['a', 'b'],
    [{a: 'c'}, 'd']
])

1. Map->Array

```js
let arr1 = [...map] // [ [ {}, {} ], [ 'a', 'b' ], [ { a: 'c' }, 'd' ] ]
```

2. Array->Map

```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
```

3. Map -> Object

如果所有 Map 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。
```js
const map2obj = (map) => {
    const obj = {}
    for (let [k, v] of map.entries() ) {
        obj[k] = v
    }
    return obj
}
```

4. Objcet -> Map

```js
const obj2map = (obj) => {
    const map = new Map()
    for (let [k, v] of Object.entries(obj) ) {
        map.set(k, v)
    }
    return map
}

obj2map({a: 3, b: 4}) // -> Map { 'a' => 3, 'b' => 4 }
```

5. Map -> JSON

```js
const map = new Map([['a', 3], ['b', 4]])
// 1. 若键全是字符串，则可以转换成为对象JSON
JSON.stringify(map2obj(map))

// 2. 若键有对象，则可以转会为数组JSON
const map1 = new Map([[{}, 3], ['b', 4]])
JSON.stringify([...map1]) // -> '[[{},3],["b",4]]'
```

6. JSON -> Map

```js
// 1. 对象JSON
obj2map(JSON.parse(json))

// 2. 数组JSON
new Map(JSON.parse(json))
```

## WeakMap

`WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合。`WeakMap`与`Map`的区别有两点。首先，`WeakMap`只接受对象作为键名（null除外），不接受其他类型的值作为键名。

```js
let sym = Symbol()

let weakmap = new WeakMap()
WeakMap.set(sym, 1)  // -> TypeError
```


WeakMap 与 Map 在 API 上的区别主要是两个，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。二是无法清空，即不支持clear方法。因此，WeakMap只有四个方法可用：get()、set()、has()、delete()。

