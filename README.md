# 设计模式学习 - TypeScript 实现

这个项目包含了常见设计模式的 TypeScript 实现示例，帮助你深入理解设计模式的核心概念。

## 📚 模式分类

### 🔥 高频使用组（6个）
最常用的设计模式，日常开发中经常遇到：
1. **工厂模式** (Factory Pattern) - 对象创建
2. **单例模式** (Singleton Pattern) - 唯一实例
3. **观察者模式** (Observer Pattern) - 事件通知
4. **代理模式** (Proxy Pattern) - 访问控制
5. **装饰器模式** (Decorator Pattern) - 功能增强
6. **中间件模式** (Middleware Pattern) - 请求处理

### 🎓 重点掌握组
*等待创建...*

## 项目结构

```
design-pattern/
├── 1-factory-pattern/          # 工厂模式
│   └── factory-demo.ts
├── 2-singleton-pattern/        # 单例模式
│   └── singleton-demo.ts
├── 3-observer-pattern/         # 观察者模式
│   └── observer-demo.ts
├── 4-proxy-pattern/            # 代理模式
│   └── proxy-demo.ts
├── 5-decorator-pattern/        # 装饰器模式
│   └── decorator-demo.ts
├── 6-middleware-pattern/       # 中间件模式
│   └── middleware-demo.ts
├── 7-strategy-pattern/         # 策略模式
│   └── strategy-demo.ts
├── 8-adapter-pattern/          # 适配器模式
│   └── adapter-demo.ts
├── 9-template-method-pattern/  # 模板方法模式
│   └── template-method-demo.ts
├── 10-facade-pattern/          # 外观模式
│   └── facade-demo.ts
├── 11-builder-pattern/         # 建造者模式
│   └── builder-demo.ts
├── 12-command-pattern/         # 命令模式
│   └── command-demo.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 运行示例

```bash
# 高频使用组
pnpm run factory      # 工厂模式
pnpm run singleton    # 单例模式
pnpm run observer     # 观察者模式
pnpm run proxy        # 代理模式
pnpm run decorator    # 装饰器模式
pnpm run middleware   # 中间件模式

# 其他重要模式
pnpm run strategy     # 策略模式
pnpm run adapter      # 适配器模式
pnpm run template     # 模板方法模式
pnpm run facade       # 外观模式
pnpm run builder      # 建造者模式
pnpm run command      # 命令模式

# 运行所有高频模式
pnpm run all-frequent

# 运行所有示例
pnpm run all
```

---

## 🔥 高频使用组详解

### 1. 工厂模式 (Factory Pattern)

**位置**: `1-factory-pattern/factory-demo.ts`

#### 核心思想
定义一个创建对象的接口，让子类决定实例化哪个类，将对象的创建和使用解耦。

#### 适用场景
- 需要根据不同条件创建不同类型的对象
- 创建对象的逻辑比较复杂
- 需要隐藏对象创建的细节

#### 优势
✅ 解耦对象的创建和使用
✅ 符合开闭原则（对扩展开放，对修改关闭）
✅ 客户端无需知道具体类名，降低耦合
✅ TypeScript 类型系统提供编译时类型检查

#### 示例代码
```typescript
const coffee: Coffee = CoffeeFactory.createCoffee('拿铁');
coffee.prepare();
coffee.brew();
coffee.serve();
```

---

### 2. 单例模式 (Singleton Pattern)

**位置**: `2-singleton-pattern/singleton-demo.ts`

#### 核心思想
确保一个类只有一个实例，并提供全局访问点。

#### 适用场景
- 数据库连接池
- 配置管理器
- 日志记录器
- 缓存管理

#### 优势
✅ 全局唯一实例，节省内存
✅ 提供全局访问点，方便状态共享
✅ 延迟初始化，按需创建
✅ TypeScript 私有构造函数确保单例约束

#### 三个实际示例
1. **日志管理器** - 全局日志记录，支持不同级别
2. **数据库连接** - 管理数据库连接状态和查询
3. **配置管理器** - 泛型实现，管理应用配置

---

### 3. 观察者模式 (Observer Pattern)

**位置**: `3-observer-pattern/observer-demo.ts`

#### 核心思想
定义对象间一对多的依赖关系，当一个对象状态改变时，所有依赖它的对象都会自动收到通知并更新。

#### 适用场景
- 事件监听系统
- 消息订阅/发布系统
- 数据绑定（如 Vue、React 的响应式系统）
- MVC 架构中的 Model-View 通信

#### 优势
✅ 松耦合：主题和观察者可以独立变化
✅ 动态订阅：运行时可以添加/移除观察者
✅ 广播通信：一次通知，多个接收者
✅ 符合开闭原则：新增观察者无需修改主题

#### 三个实际示例
1. **天气监测系统** - 气象站通知多个显示设备
2. **股票交易系统** - 股票价格变动通知投资者
3. **订单跟踪系统** - 订单状态变更通知客户和物流

---

### 4. 代理模式 (Proxy Pattern)

**位置**: `4-proxy-pattern/proxy-demo.ts`

#### 核心思想
为其他对象提供一个代理，以控制对这个对象的访问。

#### 适用场景
- 远程代理（RPC调用）
- 虚拟代理（延迟加载）
- 保护代理（权限控制）
- 缓存代理（结果缓存）

#### 优势
✅ 控制访问：权限验证、限流保护
✅ 延迟加载：需要时才创建真实对象，节省资源
✅ 缓存优化：减少重复操作，提升性能
✅ 附加功能：日志、监控、统计，不修改原对象

#### 三个实际示例
1. **虚拟代理** - 图片延迟加载（只在需要时加载）
2. **保护代理** - API访问控制（权限验证、限流）
3. **缓存代理** - 数据库查询缓存（减少数据库访问）

---

### 5. 装饰器模式 (Decorator Pattern)

**位置**: `5-decorator-pattern/decorator-demo.ts`

#### 核心思想
动态地给对象添加额外的职责，而不改变其结构。比继承更灵活。

#### 适用场景
- 需要动态添加功能
- 避免类爆炸（多种功能组合）
- 功能可插拔组合

#### 优势
✅ 动态组合：运行时灵活添加功能
✅ 避免类爆炸：不需要为每种组合创建子类
✅ 单一职责：每个装饰器只负责一个功能
✅ 可嵌套使用：装饰器可以多层包装

#### 装饰器 vs 继承
| 特性 | 装饰器 | 继承 |
|------|--------|------|
| 时机 | 运行时动态组合 | 编译时静态确定 |
| 灵活性 | 非常灵活 | 不够灵活 |
| 组合 | 可以任意组合 | 需要创建大量子类 |
| 修改 | 不修改原对象 | 修改类层次结构 |

#### 三个实际示例
1. **咖啡订单** - 基础咖啡 + 牛奶 + 摩卡 + 焦糖 + 奶泡（任意组合）
2. **通知系统** - 邮件 + 短信 + 微信 + Slack（多渠道通知）
3. **数据流处理** - 压缩 + 加密 + Base64编码（多层装饰）

---

### 6. 中间件模式 (Middleware Pattern)

**位置**: `6-middleware-pattern/middleware-demo.ts`

#### 核心思想
将请求处理过程分解为一系列可组合的中间件函数，形成处理管道。

#### 适用场景
- Web框架（Express/Koa）
- 插件系统
- 请求处理管道
- 事件处理链

#### 优势
✅ 职责分离：每个中间件只负责一个特定功能
✅ 可组合性：灵活组合不同的中间件
✅ 可复用性：中间件可在不同场景复用
✅ 顺序控制：中间件执行顺序清晰可控
✅ 易于测试：每个中间件可独立测试

#### 核心概念
- **next() 函数**：控制流程继续或中断
- **洋葱模型**：请求进入 → 中间件1 → 中间件2 → ... → 响应出来
- **上下文共享**：所有中间件共享同一个context对象

#### 实际应用
- **Express/Koa**: Web框架的核心机制
- **Redux**: 中间件处理action
- **日志、认证、缓存、错误处理**等横切关注点

#### 三个实际示例
1. **HTTP请求处理** - 日志 → CORS → 认证 → 限流 → 业务逻辑
2. **数据处理管道** - 验证 → 清洗 → 转换 → 加密 → 保存
3. **事件处理** - 日志 → 过滤 → 转换 → 分发

---

### 11. 建造者模式 (Builder Pattern)

**位置**: `11-builder-pattern/builder-demo.ts`

#### 核心思想
将复杂对象的构建过程分步骤进行，同样的构建过程可以创建不同的表示。分离对象的构建和表示。

#### 适用场景
- 需要构建复杂对象（多个可选参数）
- 需要多种配置组合
- 链式调用 API
- 配置对象构建

#### 优势
✅ 分步骤构建，过程清晰可控
✅ 链式调用，代码可读性强
✅ 同样的构建过程可创建不同表示
✅ 可以精细控制构建过程
✅ 易于添加新的构建步骤
✅ TypeScript 类型系统保证参数类型安全

#### 三个实际示例
1. **电脑配置器** - 自定义配置、游戏PC、办公PC（复杂对象构建）
2. **SQL查询构造器** - SELECT、WHERE、JOIN、ORDER BY、分页（查询构建）
3. **HTTP请求配置** - 方法、URL、请求头、请求体、超时、重试（配置对象）

#### 示例代码
```typescript
// 链式调用构建复杂对象
const computer = new ComputerBuilder()
  .setCPU('Intel Core i7-13700K')
  .setRAM('16GB DDR5')
  .setStorage('512GB SSD')
  .setGPU('NVIDIA RTX 4070')
  .build();

// SQL 查询构造
const query = new SQLQuery()
  .select('name', 'email')
  .from('users')
  .where('age', '>=', 18)
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();
```

---

### 12. 命令模式 (Command Pattern)

**位置**: `12-command-pattern/command-demo.ts`

#### 核心思想
将请求封装成对象，从而使你可以用不同的请求对客户进行参数化，对请求排队或记录请求日志，以及支持可撤销的操作。

#### 适用场景
- 需要撤销/重做操作
- 请求队列、任务调度
- 事务管理、日志记录
- 宏命令（组合多个命令）

#### 优势
✅ 解耦请求发送者和接收者
✅ 支持撤销/重做操作
✅ 支持请求队列和延迟执行
✅ 便于记录日志和审计
✅ 支持宏命令（组合命令）
✅ 符合开闭原则，易于扩展新命令

#### 三个实际示例
1. **文本编辑器** - 插入、删除、撤销、重做、命令历史（操作封装）
2. **图形编辑器** - 添加图形、移动、改变颜色、撤销/重做（图形操作）
3. **任务队列** - 异步任务、优先级、并发控制（任务队列）

#### 示例代码
```typescript
// 执行命令
editor.executeCommand(new InsertTextCommand(document, 'Hello', 0));
editor.executeCommand(new DeleteTextCommand(document, 5, 6));

// 撤销/重做
editor.undo();
editor.redo();

// 任务队列
const queue = new TaskQueue(2);  // 最大并发数
queue.addTask(new DownloadFileCommand('file.zip', priority: 1));
queue.addTask(new SendEmailCommand('user@example.com', 'Subject', priority: 3));
await queue.processQueue();
```

---

## 📊 模式对比总结

| 模式 | 类型 | 主要目的 | 关键特点 | 使用频率 |
|------|------|----------|----------|----------|
| 工厂模式 | 创建型 | 封装对象创建 | 解耦创建和使用 | ⭐⭐⭐⭐⭐ |
| 单例模式 | 创建型 | 控制实例数量 | 全局唯一实例 | ⭐⭐⭐⭐⭐ |
| 观察者模式 | 行为型 | 对象间通信 | 一对多依赖关系 | ⭐⭐⭐⭐⭐ |
| 代理模式 | 结构型 | 控制访问 | 间接访问对象 | ⭐⭐⭐⭐⭐ |
| 装饰器模式 | 结构型 | 功能增强 | 动态添加职责 | ⭐⭐⭐⭐⭐ |
| 中间件模式 | 行为型 | 请求处理 | 管道式处理 | ⭐⭐⭐⭐⭐ |
| 策略模式 | 行为型 | 算法封装 | 算法可互换 | ⭐⭐⭐⭐ |
| 适配器模式 | 结构型 | 接口转换 | 兼容不同接口 | ⭐⭐⭐⭐ |
| 模板方法模式 | 行为型 | 算法框架 | 定义算法骨架 | ⭐⭐⭐⭐ |
| 外观模式 | 结构型 | 简化接口 | 统一复杂接口 | ⭐⭐⭐⭐ |
| 建造者模式 | 创建型 | 复杂对象构建 | 分步骤构建 | ⭐⭐⭐⭐ |
| 命令模式 | 行为型 | 请求封装 | 撤销/重做/队列 | ⭐⭐⭐⭐ |

## 💡 TypeScript 优势

在设计模式实现中，TypeScript 提供了以下优势：

1. **类型安全**: 编译时检查，减少运行时错误
2. **接口约束**: 确保实现符合设计契约
3. **泛型支持**: 提供灵活且类型安全的抽象
4. **访问修饰符**: `private`、`protected`、`public` 控制访问
5. **抽象类**: 定义通用行为和强制子类实现
6. **类型推断**: 减少冗余代码，提高可读性

## 📖 学习建议

1. **理解概念**: 先理解每个模式的核心思想和适用场景
2. **运行示例**: 执行代码，观察输出，理解执行流程
3. **阅读代码**: 仔细阅读注释和类型定义
4. **修改实验**: 尝试修改代码，添加新功能
5. **实际应用**: 在自己的项目中应用这些模式
6. **类型思考**: 注意 TypeScript 类型如何增强代码安全性

## 🎯 学习路径

**阶段1**: 高频使用组（已完成）
- ✅ 工厂模式
- ✅ 单例模式
- ✅ 观察者模式
- ✅ 代理模式
- ✅ 装饰器模式
- ✅ 中间件模式

**阶段2**: 重点掌握组（已完成）
- ✅ 策略模式
- ✅ 适配器模式
- ✅ 模板方法模式
- ✅ 外观模式
- ✅ 建造者模式
- ✅ 命令模式

**阶段3**: 高级模式（待实现）
- 责任链模式 (Chain of Responsibility)
- 状态模式 (State)
- 迭代器模式 (Iterator)
- 组合模式 (Composite)
- 桥接模式 (Bridge)
- 备忘录模式 (Memento)

## 📚 参考资源

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns) (GoF)
- [Refactoring.Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 📄 许可证

MIT License

---

**Happy Coding!** 祝你学习愉快！🎉
