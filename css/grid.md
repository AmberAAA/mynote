# 栅格布局

## 命令速查

###  display: grid;

采用栅格布局，采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）。下面代码中，最外层的`<div>`元素就是容器，内层的三个`<div>`元素就是项目。


```html
<div>
    <div><p>1</p></div>
    <div><p>1</p></div>
    <div><p>1</p></div>
</div>
```

容器里面的水平区域称为"行"（row），垂直区域称为"列"（column）。


### grid-template-columns 属性，grid-template-rows 属性 
