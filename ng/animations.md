# Angular 动画

## 快速上手

1. 引入动画模块
2. 定义动画
3. 将动画绑定到DOM上


## 引入动画模块
略

## 定义动画

![动画](https://angular.cn/generated/images/guide/animations/open-closed.png)
### `trigger`

> [tigger](https://angular.cn/api/animations/trigger): 创建一个有名字的动画触发器，包含一个 state() 和 transition() 的列表，当此触发器的绑定表达式发生变化时，它们就会重新求值。


### state

> [state](https://angular.cn/api/animations/state): 在附加到元素的触发器上，声明一个动画状态。

### style
> [style](https://angular.cn/api/animations/style): 声明一个包含 CSS 属性/样式的键值对象，可在动画序列中用作动画状态（state），或在调用 animate() 和 keyframes() 时作为传入的样式数据。

### transition

> [transition](https://angular.cn/api/animations/transition): 声明一个转场动画，以便在满足给定条件时运行一系列动画步骤。该条件是一个逻辑型表达式或一个函数， 该函数比较以前和现在的动画状态，如果应该开始转场则返回 true。 当满足所定义的转场动画的状态标准时，就会开始执行相关的动画。

### animate
> [animate](https://angular.cn/api/animations/animate): 定义一个动画步骤，它把一些样式信息和时序信息组合在一起。


