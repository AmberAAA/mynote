# 数值的扩展

## 二进制、八进制、十六进制的表示方法

二进制、八进制、十六进制的表示方法分别是`0b111`, `0o222`,`0x2222`或`oB111`, `0O222`, `0X3333`。

### 进制互转

``` js

// 其他进制转十进制
Number(0xFFF) // -> 4095
N

// 十进制转其他进制
Number(123).toString(16) // -> '7b'


```

## Number.isFinite(), Number.isNaN()

Number.isFinite()用来判断数字是否有限，Number.isNaN()用来判断是否为NaN。这两个方法与全局方法有些区别。全局方法会将非数字类型转换为数字类型，再进行比较计算。而Number的方法不会。

## Number.parseInt(), Number.parseFloat()

ES6 将全局方法`parseInt()`和`parseFloat()`，移植到Number对象上面，行为完全保持不变。

## Number.isInteger()

`Number.isInteger()`判断是否是一个整数。如果参数不是树脂类型，则直接返回false。

## Number.EPSILON

`Number.EPSILON`常量，表示数字类型的精度。

## 安全整数和 Number.isSafeInteger()

JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。ES6 引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。

## Math 对象的扩展

不做详细介绍

### Math.trunc()

### Math.sign()

Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。

### Math.cbrt()

### Math.clz32()

### Math.imul() 

### Math.fround()

### Math.hypot()

### 对数方法

1. Math.expm1()


2. Math.log1p()


3. Math.log10()


4. Math.log2()


### 双曲线函数

### 指数运算符

ES2016 新增了一个指数运算符（**）。

```js

2 ** 2 // 4
2 ** 3 // 8

// 相当于 2 ** (3 ** 2)

2 ** 3 ** 2


```