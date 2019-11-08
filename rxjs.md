# rxjs学习笔记

> RxJS 是一个库，它通过使用 observable 序列来编写异步和基于事件的程序。


## 异步事件管理的基本概念

* Observable (可观察对象): 表示一个概念，这个概念是一个可调用的未来值或事件的集合。
* Observer (观察者): 一个回调函数的集合，它知道如何去监听由 Observable 提供的值。
* Subscription (订阅): 表示 Observable 的执行，主要用于取消 Observable 的执行。
* Operators (操作符): 采用函数式编程风格的纯函数 (pure function)，使用像 map、filter、concat、flatMap 等这样的操作符来处理集合。
* Subject (主体): 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式。
* Schedulers (调度器): 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他。


## Observable可观察对象

Observable是多个值的惰性推送集合，他解决了一下问题：

|   |  单个 | 多个 |
|---|---|---|
|  拉取 | Function  |  Iterator |
|  推送 | Promise  |  	Observable |


### 拉取与推送

|   |  数据生产者 | 数据消费者 |
|---|---|---|
|  拉取 | 被动：当被请求时产生数据  |  主动：决定何时请求数据 |
|  推送 | 主动：按照自己的节奏产生数据  |  	被动：对接受收到的数据进行响应 |


### 惰性
`Observables`是惰性的，不调用就不会执行。 


### `Observable`创建可观察对象

> `Observable` 可以使用 `create` 来创建, 但通常我们使用所谓的创建操作符, 像 `of`、`from`、`interval`、等等。

```js
const { Observable } = require("rxjs");

const observable = new Observable(observer => {
    let index = 0;
    const id = setInterval(() => {
        observer.next(index++);
        if (index >= 5) {
            clearInterval(id);
            observer.complete();
        }
    }, 1000)
})


console.log("start...");
observable.subscribe(
    e => {console.log(e)},
    err => {console.error(err)},
    () => {console.log(`hear complete`)}
);
console.log("end...")

/*
  start...
  end...
  0
  1
  2
  3
  4
  hear complete
*/

```


### `Observable`执行
Observable 执行可以传递三种类型的值：

*   "Next" 通知： 发送一个值，比如数字、字符串、对象，等等。
*   "Error" 通知： 发送一个 JavaScript 错误 或 异常。
*  "Complete" 通知： 不再发送任何值。

> 在 Observable 执行中, 可能会发送零个到无穷多个 "Next" 通知。如果发送的是 "Error" 或 "Complete" 通知的话，那么之后不会再发送任何通知了。



"Next" 通知是最重要，也是最常见的类型：它们表示传递给观察者的实际数据。"Error" 和 "Complete" 通知可能只会在 Observable 执行期间发生一次，并且只会执行其中的一个。

这些约束用所谓的 Observable 语法或合约表达最好，写为正则表达式是这样的：

```js
const { Observable } = require("rxjs");

var observable = Observable.create(function (observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    setTimeout(() => {
      observer.next(4);
      observer.complete();
    }, 1000);
  });
  
  console.log('just before subscribe');
  observable.subscribe({
    next: x => console.log('got value ' + x),
    error: err => console.error('something wrong occurred: ' + err),
    complete: () => console.log('done'),
  });
  console.log('just after subscribe');


/*
just before subscribe
got value 1
got value 2
got value 3
just after subscribe
got value 4
done
*/
```


### Observer 观察者

观察者是由`Observable`发送的值的消费者。观察者只是一组回调函数的集合，每个回调函数对应一种`Observable`发送的通知类型: `next`、`error` 和 `complete` 。下面的示例是一个典型的观察者对象：

### Subscription 

> Subscription 基本上只有一个 unsubscribe() 函数，这个函数用来释放资源或去取消 Observable 执行。


## 操作符

```js
const { of, Subject }  =  require("rxjs");
const { map } = require("rxjs/operators")

const subject = new Subject();

map(x => x * x)(subject).subscribe(e => console.log(e));

subject.next(3);
// -> 9

subject.next(9);
// -> 81

subject.next(12);
// -> 144
```

### Creation Operators

> https://rxjs-dev.firebaseapp.com/api/ajax/ajax
> 
> It creates an observable for an Ajax request with either a request object with url, headers, etc or a string for a URL.

常用操作符

#### 创建

##### of

> 创建一个 Observable，它会依次发出由你提供的参数，最后发出完成通知。 

```js
const {of} = require("rxjs");

of(1, 2, 3, 4, 5).subscribe(e => console.log(e));
/*
    1,
    2,
    3,
    4,
    5,
*/
```


##### from

> 从一个数组、类数组对象、Promise、迭代器对象或者类 Observable 对象创建一个 Observable.

```js
const {from} = require("rxjs");

from([1, 2, 3]).subscribe(e => console.log(e));

/*
    1,
    2,
    3,
*/
```

##### fromEvent
> 创建一个 Observable，该 Observable 发出来自给定事件对象的指定类型事件。

```js
const { fromEvent } = require("rxjs");

// fromEvent(element, eventName).subscribe(e => console.log(e));
fromEvent(document, 'load').subscribe(e => console.log(`on load`));
```

##### fromPromise


```js
const { fromPromise } = require("rxjs");
const result = fromPromise(fetch('http://myserver.com/'));
result.subscribe(x => console.log(x), e => console.error(e));
```

#### 组合

##### combineLatest
> 它将使用所有输入中的最新值计算公式，然后发出该公式的输出。

![](./source/combineLatest.png)

```js
const { interval, combineLatest } = require("rxjs");

const observable1 = interval(500);
const observable2 = interval(700);

combineLatest(observable1, observable2)
    .subscribe(e => {
        console.log(e)
    })

/*

[ 0, 0 ] time: 711.087ms = 700 // 第一次触发是a,b都触发
[ 1, 0 ] time: 1005.115ms = 500*2
[ 1, 1 ] time: 1404.494ms = 700*2 
[ 2, 1 ] time: 1505.636ms = 500*3
[ 3, 1 ] time: 2006.421ms = 500*4
[ 3, 2 ] time: 2113.476ms = 700*3

*/
```

##### concat
> 通过顺序地发出多个 Observables 的值将它们连接起来，一个接一个的。

![](./source/concat.png)

```js
const { concat, interval, range } = require("rxjs");
const { take } = require("rxjs/operators");

const time1 = interval(1000).pipe(take(5))
const time2 = interval(1000).pipe(take(6))
const time3 = interval(1000).pipe(take(7))

console.time("asd")
concat(time1, time2, time3)
    .subscribe(e => {
        console.log(e);
        console.timeLog("asd")
    })
/*

  0   ->   asd: 1008.188ms
  1   ->   asd: 2004.837ms
  2   ->   asd: 3005.695ms
  3   ->   asd: 4006.039ms
  4   ->   asd: 5006.520ms
  0   ->   asd: 6009.689ms
  1   ->   asd: 7010.109ms
  2   ->   asd: 8010.405ms
  3   ->   asd: 9010.657ms
  4   ->   asd: 10010.194ms
  5   ->   asd: 11010.986ms
  0   ->   asd: 12013.436ms
  1   ->   asd: 13026.348ms
  2   ->   asd: 14015.920ms
  3   ->   asd: 15016.341ms
  4   ->   asd: 16016.574ms
  5   ->   asd: 17016.693ms
  6   ->   asd: 18016.555ms

*/
```

##### merge
> 通过把多个 Observables 的值混合到一个 Observable 中来将其打平。

![](./source/merge.png)


```js
const { interval, merge } = require("rxjs");

const timer1 = interval(500);
const timer2 = interval(600);

console.time("asd")
merge(timer2, timer1)
    .subscribe(e => {
        console.log(e);
        console.timeLog("asd");
    })

/*
0 -> asd: 509.425ms
0 -> asd: 603.273ms
1 -> asd: 1005.020ms
1 -> asd: 1202.815ms
2 -> asd: 1504.404ms
2 -> asd: 1802.827ms
3 -> asd: 2005.755ms
3 -> asd: 2403.422ms
4 -> asd: 2507.326ms
4 -> asd: 3005.008ms
5 -> asd: 3014.245ms
*/
```

##### startWith

> 返回的 Observable 会先发出作为参数指定的项，然后再发出由源 Observable 所发出的项。

![](./s/../source/startWith.png)

```js
const { interval } = require("rxjs");
const { startWith, take } = require("rxjs/operators");

const timer = interval(1000);

timer.pipe(startWith("啊哈哈哈哈哈"), take(5)).subscribe(console.log)
/*
啊哈哈哈哈哈
0
1
2
3
*/

```

##### withLatestFrom

> 结合源 Observable 和另外的 Observables 以创建新的 Observable， 该 Observable 的值由每 个 Observable 最新的值计算得出，当且仅当源发出的时候。


![](./s/../source/withLatestFrom.png)

```js

const { interval } = require("rxjs");
const { withLatestFrom, take, startWith } = require("rxjs/operators");


const event = interval(300).pipe(take(10));
const filter = interval(1000).pipe(startWith("啊哈哈哈"));

event.pipe(take(5), withLatestFrom(filter)).subscribe(console.log);

/*
[ 0, '啊哈哈哈' ]
[ 1, '啊哈哈哈' ]
[ 2, '啊哈哈哈' ]
[ 3, 0 ]
[ 4, 0 ]
*/

```

##### zip

> 将多个 Observable 组合以创建一个 Observable，该 Observable 的值是由所有输入 Observables 的值按顺序计算而来的。
> 
> 如果最后一个参数是函数, 这个函数被用来计算最终发出的值.否则, 返回一个顺序包含所有输入值的数组.
>
> zip工作原理如下，当每个传入zip的流都发射完毕第一次数据时，zip将这些数据合并为数组并发射出去；当这些流都发射完第二次数据时，zip再次将它们合并为数组并发射。以此类推直到其中某个流发出结束信号，整个被合并后的流结束，不再发射数据。

```js
const { interval } = require("rxjs");
const { zip, take } = require("rxjs/operators");

const timer1 = interval(100);
const timer2 = interval(400);
const timer3 = interval(1000);

console.time("asd");

// 最后一个参数为函数，则可以用来处理数据
// timer1.pipe(zip(timer2, timer3, (a, b, c) => a+b+c)).subscribe(console.log)

timer1.pipe(zip(timer2, timer3), take(3)).subscribe(e => {
    console.timeLog("asd");
    console.log(e)
})

/*
asd: 1003.582ms -> [ 0, 0, 0 ]
asd: 2003.687ms -> [ 1, 1, 1 ]
asd: 3004.310ms -> [ 2, 2, 2 ]
*/
```


#### 过滤
##### debounceTime
> 就像是delay, 但是只通过每次大量发送中的最新值。

![](/source/debounceTime.png)

```js
const { interval, Subject } = require("rxjs");
const { debounceTime, take } = require("rxjs/operators");

const clicks = new Subject() // 模拟一阵狂点鼠标

// const clicks = fromEvent(document, 'click');
const result = clicks.pipe(debounceTime(1000));
result.subscribe(x => console.log(x));

interval(3000).pipe(take(3)).subscribe(e => {
    clicks.next(`我是可以输出的`)
})

interval(300).pipe(take(3)).subscribe(e => {
    console.log("300ms %d", e)
    clicks.next(`我输出不了了`)
}, {}, () => {
    console.log("300ms 关闭")
})

/*
300ms 0
300ms 1
300ms 2
300ms 关闭
我输出不了了
我是可以输出的
我是可以输出的
我是可以输出的
*/
```
##### distinctUntilChanged

> 返回 Observable，它发出源 Observable 发出的所有与前一项不相同的项。
> 
> 如果提供了 compare 函数，那么每一项都会调用它来检验是否应该发出这个值。
>
> 如果没有提供 compare 函数，默认使用相等检查。

![](./source/distinctUntilChanged.png)

```js
const { of } = require("rxjs");
const { distinctUntilChanged } = require("rxjs/operators");

of(1,2,3,3,3,4,5,6,6,7)
    .pipe(distinctUntilChanged())
    .subscribe(console.log)

const cat1 = { name: 'tom' };
const cat2 = { name: 'tom' };
const cat3 = { name: 'kity' };
const cat4 = { name: 'jobs' };

console.log(`.........`)

of(cat1, cat2, cat3, cat4)
    .pipe(distinctUntilChanged())
    .subscribe(console.log)

console.log(`.........`)


of(cat1, cat2, cat3, cat4)
    .pipe(distinctUntilChanged((x, y) => x.name === y.name))
    .subscribe(console.log)

/*
   1
   2
   3
   4
   5
   6
   7
  
   { name: 'tom' }
   { name: 'tom' }  // 可看出若不传比较函数，则内部通过===去判断
   { name: 'kity' }
   { name: 'jobs' }
   .........
   { name: 'tom' }
   { name: 'kity' }
   { name: 'jobs' }
*/

```

##### filter

> 通过只发送源 Observable 的中满足指定 predicate 函数的项来进行过滤。
> 类似于 Array.prototype.filter()， 它只会发出源 Observable 中符合标准函数的值。

![](./s/../source/filter.png);

```js
const { interval } = require("rxjs");
const { take, filter } = require("rxjs/operators");

// 取10以内的偶数，每1s输出一个。
interval(500)
    .pipe(take(10), filter(i => i % 2 === 0))
    .subscribe(console.log)

/*
   0
   2
   4
   6
   8
*/
```

##### take
> 接收源 Observable 最初的N个值 (N = count)，然后完成。

![](source/take.png)

```js
const { interval } = require("rxjs");
const { take, filter } = require("rxjs/operators");

// 取10以内的偶数，每1s输出一个。
interval(500)
    .pipe(take(10), filter(i => i % 2 === 0))
    .subscribe(console.log)

/*
   0
   2
   4
   6
   8
*/
```

##### takeUntil
> 发出源 Observable 发出的值，直到 notifier Observable 发出值。

![](./source/takeUntil.png)
```js
const { interval, timer } = require("rxjs");
const { takeUntil } = require("rxjs/operators");

interval(500)
    .pipe(takeUntil(timer(3000)))
    .subscribe(console.log)

/*

   0
   1
   2
   3
   4

*/

```



#### 转换
##### bufferTime
> 将过往的值收集到数组中，并周期性地发出这些数组。

![](source/bufferTime.png)

```js

const { interval } = require("rxjs");
const { bufferTime, take } = require("rxjs/operators");

interval(100)
    .pipe(bufferTime(1000), take(3))
    .subscribe(console.log)

/*
   [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
   [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]
   [ 19, 20, 21, 22, 23, 24, 25, 26, 27, 28 ]
*/

```

##### concatMap

> 将源值投射为一个合并到输出 Observable 的 Observable,以串行的方式等待前一个完成再合并下一个 Observable。
>
> 将每个值映射为 Observable, 然后使用concatAll将所有的 内部 Observables 打平。

![](./source/concatMap.png)

```js
const { interval } = require("rxjs");
const { concatMap, take, map } = require("rxjs/operators");

// interval(1000).pipe(concatMap(ev => interval(100).pipe(take(4)))).subscribe(console.log)

interval(1000).pipe(
    take(4),
    concatMap(ev => {
        console.log(`interval(1000)-${ev}: 触发`)
        return interval(100).pipe(take(4), map(e => `${ev}-${e}`))
    }),
)
.subscribe(console.log, null, () => demo2())

// 可以从此DEMO中看出，若concatMap还没有执行完，则会阻塞外层的subjectable
const demo2 = function() {
    console.log('........更特殊的情况.............')
    console.time("info")
    interval(155).pipe(
        take(4),
        concatMap(ev => {
            console.timeLog("info")
            console.log(`interval(155)-${ev}: 触发`)
            console.log('---------------')
            return interval(100).pipe(take(4), map(e => `${ev}-${e}`))
        }),
    )
    .subscribe(e => {
        console.timeLog("info")
        console.log(e)
    })
}

/*
   interval(1000)-0: 触发
   0-0
   0-1
   0-2
   0-3
   interval(1000)-1: 触发
   1-0
   1-1
   1-2
   1-3
   interval(1000)-2: 触发
   2-0
   2-1
   2-2
   2-3
   interval(1000)-3: 触发
   3-0
   3-1
   3-2
   3-3
   ........更特殊的情况.............
   info: 154.869ms
   interval(155)-0: 触发
   ---------------
   info: 258.611ms
   0-0
   info: 360.187ms
   0-1
   info: 459.892ms
   0-2
   info: 560.773ms
   0-3
   info: 562.727ms
   interval(155)-1: 触发
   ---------------
   info: 672.342ms
   1-0
   info: 772.072ms
   1-1
   info: 872.817ms
   1-2
   info: 972.637ms
   1-3
   info: 974.512ms
   interval(155)-2: 触发
   ---------------
   info: 1086.350ms
   2-0
   info: 1187.088ms
   2-1
   info: 1287.792ms
   2-2
   info: 1389.468ms
   2-3
   info: 1390.790ms
   interval(155)-3: 触发
   ---------------
   info: 1501.169ms
   3-0
   info: 1600.971ms
   3-1
   info: 1701.550ms
   3-2
   info: 1802.296ms
   3-3
*/

```

##### map

> 将给定的 project 函数应用于源 Observable 发出的每个值，并将结果值作为 Observable 发出。

![](./source/map.png)

```js
const { map, take } = require("rxjs/operators");
const { interval } = require("rxjs");

interval(500).pipe(map(i => i ** i ), take(10)).subscribe(console.log);
/*
   1
   1
   4
   27
   256
   3125
   46656
   823543
   16777216
   387420489
*/

```


##### mergeMap
> 将每个值映射成 Observable ，然后使用 mergeAll 打平所有的内部 Observables。
>
> 相比与concatMap, `MergeMap`打平了，没有阻塞。

```js

const { interval } = require("rxjs");
const { mergeMap, take, map } = require("rxjs/operators");

// 从concatMap中的例子直接copy出来，可以更清楚的看到他们之间的不同。
const demo2 = function() {
    console.log('........更特殊的情况.............')
    console.time("info")
    interval(155).pipe(
        take(4),
        // concatMap(ev => {
        mergeMap(ev => {
            console.timeLog("info")
            console.log(`interval(155)-${ev}: 触发`)
            console.log('---------------')
            return interval(100).pipe(take(4), map(e => `${ev}-${e}`))
        }),
    )
    .subscribe(e => {
        console.timeLog("info")
        console.log(e)
    })
}

demo2()

/*
   ........更特殊的情况.............
   info: 159.128ms
   interval(155)-0: 触发
   ---------------
   info: 270.447ms
   0-0
   info: 315.049ms
   interval(155)-1: 触发
   ---------------
   info: 370.971ms
   0-1
   info: 418.616ms
   1-0
   info: 470.485ms
   interval(155)-2: 触发
   ---------------
   info: 472.738ms
   0-2
   info: 518.584ms
   1-1
   info: 573.440ms
   2-0
   info: 575.164ms
   0-3
   info: 619.424ms
   1-2
   info: 627.503ms
   interval(155)-3: 触发
   ---------------
   info: 673.215ms
   2-1
   info: 719.125ms
   1-3
   info: 739.133ms
   3-0
   info: 776.531ms
   2-2
   info: 839.711ms
   3-1
   info: 876.537ms
   2-3
   info: 940.563ms
   3-2
   info: 1041.309ms
   3-3
*/

```



##### scan
> 对源 Observable 使用累加器函数， 返回生成的中间值， 可选的初始值。
>
> 就像是 reduce, 但是发出目前的累计数当源发出数据的时候。

![](./source/scan.png)

```js
const { interval } = require("rxjs");
const { scan, take } = require("rxjs/operators");

interval(500).pipe(scan((acc, value) => acc + value, 0), take(5)).subscribe(console.log);

/*
   0
   1
   3
   6
   10
*/
```


##### switchMap

> 相比于`concatMap`，`mergeMap`, 在使用`switchMao`时，源更新，之前的`switchMap`就已经丢弃。
> 

```js
const { interval } = require("rxjs");
const { switchMap, map, take } = require("rxjs/operators");

interval(1000).pipe(switchMap(env => interval(env * 200 + 200).pipe(map(e => `interval1 -- ${env} -- ${e} `)))).subscribe(console.log);

/*
interval1 -- 0 -- 0
interval1 -- 0 -- 1
interval1 -- 0 -- 2
interval1 -- 0 -- 3
interval1 -- 1 -- 0
interval1 -- 1 -- 1
interval1 -- 2 -- 0
interval1 -- 3 -- 0
interval1 -- 4 -- 0
//注意 程序并没有结束 因为还没有等到switchMap响应，就已经源就已经更新。
*/
```


#### 工具
##### tap
> 对`Observable`进行监听但不影响可观察对象。

```js
const { of } = require("rxjs")
const { tap, map } = require("rxjs/operators");

const User1 = { name: 'User1' };
const User2 = { name: 'User2' };
const User3 = { name: 'User3' };
const User4 = { name: 'User4' }

of(User1,User2,User3,User4)
    .pipe(tap(console.log), map(e => e.name))
    .subscribe(console.log)

/*
   { name: 'User1' }
   User1
   { name: 'User2' }
   User2
   { name: 'User3' }
   User3
   { name: 'User4' }
   User4
*/

```

#### 多播
##### share
> 将一个可观察对象进行共享

```js
const { interval } = require("rxjs");
const { share } = require("rxjs/operators");

const i = interval(1000).pipe(share());

const timer = (name) => i.subscribe(e => console.log(`${name} --- ${e}`));

timer("amber");

setTimeout(e => timer("bob"), 4345);

/*
   amber --- 0
   amber --- 1
   amber --- 2
   amber --- 3
   amber --- 4
   bob --- 4
   amber --- 5
   bob --- 5
   amber --- 6
   bob --- 6
   amber --- 7
   bob --- 7
*/
```