# SQL

## 关系约束

### 主键
> 主键：记录中的主键应该是唯一不重复，可以通过主键检索到唯一记录。

>记录一旦插入到表中，主键最好不要再修改，因为主键是用来唯一定位记录的，修改了主键，会造成一系列的影响。

> 不使用任何业务相关的字段作为主键。

#### 联合主键

> 对于联合主键，允许一列有重复，只要不是所有主键列都重复即可：

### 外键


## 查询数据

```sql
SELECT * FROM <表名>

SELECT * FROM students WHERE NOT class_id = 2;

SELECT * FROM students WHERE (score < 80 OR score > 90) AND gender = 'M';

-- 按照score排序
SELECT id, name, gender, score FROM students ORDER BY score;

--  按照score倒叙排序
SELECT id, name, gender, score FROM students ORDER BY score DESC;

-- 分页查询
SELECT id, name, gender, score FROM students ORDER BY score DESC LIMIT 3 OFFSET 6;



```


### 聚合查询

| 函数 |  说明 |
| --- | --- |
| COUNT | 查询所有列的行数 |
| SUM | 计算某一列的合计值，该列必须为数值类型 |
| AVG | 计算某一列的平均值，该列必须为数值类型 |
| MAX | 计算某一列的最大值 |
| MIN | 计算某一列的最小值 |


```sql
SELECT AVG(score) average FROM students WHERE gender = 'X';

-- 分组查询统计班级人数
SELECT class_id, COUNT(*) num FROM students GROUP BY class_id;
```

