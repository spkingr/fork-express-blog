# Redis

## 设计

规则设计：

1. 每个用户连接到房间后，自动生成一个 Key ： `uuidv4()` ，作为数据库唯一ID主键保存，长度 36
2. 长度 36 作为分享过长，所以取前面 8 个字符作为客户端查看、分享的 RoomId ，但是要保证唯一性
3. 保证唯一性的方法：每个房间取号 1-N ，或者判断 8 个字符是否存在，存在就添加序号或者其他手段
4. 用户 ID 和房间分享 ID 和房间实际 ID 需要关联起来，随时获取、查询
5. 用户进出房间：
    1. 新房间：新建房间到 Redis ，保存人数、时间、用户 ID
    2. 他人房间：房间人数更新到 Redis ，更新新用户 ID 到房间用户列表，发送消息
    3. 退出房间：房主退出即解散（可以考虑让位），普通用户退出则刷新 Redis 并发送消息
    4. 不论进入还是退出房间，只要房间人数超过 2 （或者其他规则），就需要更新 MySQL 数据库
    5. 退出房间前后，只有房主一个人，这种临时房间可以完全删除，无需持久化，或者 10 分钟后自动删除，支持该用户重复进入，避免对同一个 User 重复创建、实例化房间，浪费资源
6. 消息处理：
    1. 系统消息
    2. 用户发送消息：如果只有房主一个人，可以考虑不用保存到 MySQL
    3. 用户频发消息：前端禁用，后端可以使用 Redis 设置定时器： redis.set(userId, '', {EX: '3'})
    4. 其他普通消息根据规则定时、周期持久化到 MySQL
7. 其他：统计房间房间历史数量、消息条数、房间活跃度、房间类型分析……

伪代码：

```js
// 存储所有用户房间分享ID和房间ID的键值对
const clients = new Map()
const roomId = uuidv4()
let shareId = roomId.substring(0, 8)
let i = 0
while(clients.get(shareId)) {
  // 存在重复，尝试加数字、或者改变大小、或者干脆使用用户名+时间拼接等
  shareId = shareId.substring(0, i).toUppercase() + shareId.substring(i)
  i ++
}
// 保存，以后每次可以从这里获取真实的RoomId，保证唯一
clients.put(shareId, roomId)

// 添加到Redis
// 1. 如果是创建房间
redis.lPush('room:list', roomId) // 保存房间
redis.hSet(roomId, 'user', '用户名')
redis.hSet(roomId, 'member_count', 1)
redis.hSet(roomId, 'saved_to_mysql', 0) // 是否已经持久化
// ...

// 2. 如果是加入房间
redis.hSet(roomId, 'member_count', redis.hGet(roomId, 'member_count') + 1)
// ...

// 3. 退出房间
redis.hSet(roomId, 'member_count', redis.hGet(roomId, 'member_count') - 1)
if(redis.hGet(roomId, 'member_count') <= 0) {
  // 也不一定需要删除，可以保留10分钟等，用户可以继续进入
  redis.del(roomId)
  //  同时需要持久化：看情况，如果有消息、人数超过2等规则
}

// 4. 发送的消息：暂存在Redis
let message = {senderId, receiverId, timestamp, content}
redis.lPush("message:list:" + roomId, JSON.stringify(message))
// 一旦超过阈值（比如100条、或者停留时间超过1小时等），保存到数据库：
if(redis.lLen("message:list:" + roomId) >= 100) {
  flushToMysql()
  redis.del("message:list:" + roomId)
}
// 持久化到mysql：（可以根据HASH中的saved_to_mysql字段）
// INSERT INTO X(id, Y) VALUES(1, "A") ON DUPLICATE KEY UPDATE Y="A"
```

## MySQL设置

总纲：

1. 最好设计 ID 为主键，自增，但是房间、消息等可以不用，使用 `uuidv4()`
2. 表名小写（可以考虑 `t_` 开头），不用复数，比如 `user/t_user` 而不是 `users` ，对应 Model 模型定义
3. 字段全部小写，驼峰转为下横线，比如 `userName` 字段对应列名： `user_name`
4. 布尔值可以使用 `boolean/enum/bit/tinyint` ，*我觉得* `bit(1)` 最合适
5. 其他： `varchar` 尽量长，但是不宜过长造成浪费，金钱用 `decimal(10,2)` 简单，时间一般考虑使用 `timestamp` ，优点是空间小、保留时区，缺点是不能保存 `null` ，但是一般时间是不允许为空的，没什么意义

用户表设计：

```sql
create table if not exists user(
  id bigint not null primary key auto_increment,
  username varchar(32) not null unique,
  password varchar(64) not null,
  nickname varchar(32) not null comment '昵称',
  register_date timestamp not null default current_timestamp,
  last_login_date timestamp not null default current_timestamp,
  avatar_path varchar(128)
);

-- 需要保留设置特殊用户：管理、系统、官方等
```

房间表设计：

```sql
create table if not exists room(
  room_id char(36) not null primary key,
  creator_id bigint not null comment '用户ID',
  room_name varchar(64) comment '自定义的房间名字',
  room_capacity integer not null default 0,
  member_count integer not null default 1,
  create_date timestamp not null default current_timestamp
);
```

消息表设计：

```sql
create table if not exists room_message(
  room_id char(36) not null,
  sender_id bigint not null comment '发送者ID，可以是系统',
  receiver_id bigint not null comment '接收者ID，可以是系统',
  create_date timestamp not null default current_timestamp,
  content varchar(255) not null comment '消息内容，最大长度按规定来',
  is_visible bit(1) not null default 1 comment '是否显示'
);

-- 消息可以被系统禁用，不显示
```

## 其他

待定
