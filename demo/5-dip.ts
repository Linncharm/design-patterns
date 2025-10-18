/**
 * SOLID 原则 - D: 依赖倒置原则 (Dependency Inversion Principle)
 *
 * 核心思想：
 * 1. 高层模块不应该依赖低层模块，两者都应该依赖抽象
 * 2. 抽象不应该依赖细节，细节应该依赖抽象
 *
 * 简单说：面向接口编程，而不是面向实现编程
 * 优点：降低耦合度，提高代码的灵活性和可测试性
 */

// ❌ 违反 DIP 的例子：直接依赖具体实现

class MySQLDatabase {
  connect(): void {
    console.log('🔌 连接到 MySQL 数据库');
  }

  query(sql: string): any[] {
    console.log(`🔍 执行 MySQL 查询: ${sql}`);
    return [{ id: 1, name: '张三' }];
  }
}

// 🚨 问题：UserService 直接依赖 MySQLDatabase 的具体实现
class BadUserService {
  private database: MySQLDatabase;

  constructor() {
    // 紧耦合：直接创建具体类的实例
    this.database = new MySQLDatabase();
  }

  getUsers(): any[] {
    this.database.connect();
    return this.database.query('SELECT * FROM users');
  }
}

console.log('━'.repeat(50));
console.log('❌ 违反 DIP 的设计');
console.log('━'.repeat(50));

const badService = new BadUserService();
badService.getUsers();

console.log('\n问题：');
console.log('1. UserService 直接依赖 MySQLDatabase');
console.log('2. 无法轻易切换到其他数据库（如 PostgreSQL）');
console.log('3. 难以进行单元测试（无法 mock 数据库）');
console.log('4. 违反了依赖倒置原则\n');

// ✅ 遵循 DIP 的例子：依赖抽象而非具体实现

// 1. 定义抽象接口
interface Database {
  connect(): void;
  query(sql: string): any[];
  disconnect(): void;
}

// 2. 具体实现 1: MySQL
class MySQL implements Database {
  connect(): void {
    console.log('🔌 连接到 MySQL 数据库');
  }

  query(sql: string): any[] {
    console.log(`🔍 执行 MySQL 查询: ${sql}`);
    return [{ id: 1, name: '张三', source: 'MySQL' }];
  }

  disconnect(): void {
    console.log('🔌 断开 MySQL 连接');
  }
}

// 3. 具体实现 2: PostgreSQL
class PostgreSQL implements Database {
  connect(): void {
    console.log('🔌 连接到 PostgreSQL 数据库');
  }

  query(sql: string): any[] {
    console.log(`🔍 执行 PostgreSQL 查询: ${sql}`);
    return [{ id: 1, name: '李四', source: 'PostgreSQL' }];
  }

  disconnect(): void {
    console.log('🔌 断开 PostgreSQL 连接');
  }
}

// 4. 具体实现 3: MongoDB
class MongoDB implements Database {
  connect(): void {
    console.log('🔌 连接到 MongoDB 数据库');
  }

  query(sql: string): any[] {
    console.log(`🔍 执行 MongoDB 查询: ${sql}`);
    return [{ id: 1, name: '王五', source: 'MongoDB' }];
  }

  disconnect(): void {
    console.log('🔌 断开 MongoDB 连接');
  }
}

// 5. 高层模块：依赖抽象接口，而非具体实现
class UserService {
  // 依赖注入：通过构造函数注入抽象依赖
  constructor(private database: Database) {}

  getUsers(): any[] {
    this.database.connect();
    const users = this.database.query('SELECT * FROM users');
    this.database.disconnect();
    return users;
  }

  getUserById(id: number): any {
    this.database.connect();
    const users = this.database.query(`SELECT * FROM users WHERE id = ${id}`);
    this.database.disconnect();
    return users[0];
  }
}

console.log('━'.repeat(50));
console.log('✅ 遵循 DIP 的设计');
console.log('━'.repeat(50));

// 可以轻松切换不同的数据库实现
console.log('\n--- 使用 MySQL ---');
const mysqlDb = new MySQL();
const userService1 = new UserService(mysqlDb);
console.log('用户数据:', userService1.getUsers());

console.log('\n--- 使用 PostgreSQL ---');
const postgresDb = new PostgreSQL();
const userService2 = new UserService(postgresDb);
console.log('用户数据:', userService2.getUsers());

console.log('\n--- 使用 MongoDB ---');
const mongoDb = new MongoDB();
const userService3 = new UserService(mongoDb);
console.log('用户数据:', userService3.getUsers());

// ✅ 另一个例子：消息通知系统

console.log('\n━'.repeat(50));
console.log('示例2: 消息通知系统');
console.log('━'.repeat(50));

// 定义抽象：消息发送接口
interface MessageSender {
  send(message: string, recipient: string): void;
}

// 具体实现：邮件发送
class EmailSender implements MessageSender {
  send(message: string, recipient: string): void {
    console.log(`📧 发送邮件`);
    console.log(`   收件人: ${recipient}`);
    console.log(`   内容: ${message}`);
  }
}

// 具体实现：短信发送
class SMSSender implements MessageSender {
  send(message: string, recipient: string): void {
    console.log(`📱 发送短信`);
    console.log(`   手机号: ${recipient}`);
    console.log(`   内容: ${message}`);
  }
}

// 具体实现：微信发送
class WeChatSender implements MessageSender {
  send(message: string, recipient: string): void {
    console.log(`💚 发送微信消息`);
    console.log(`   用户: ${recipient}`);
    console.log(`   内容: ${message}`);
  }
}

// 具体实现：Slack 发送
class SlackSender implements MessageSender {
  send(message: string, recipient: string): void {
    console.log(`📬 发送 Slack 消息`);
    console.log(`   频道: ${recipient}`);
    console.log(`   内容: ${message}`);
  }
}

// 高层模块：通知服务（依赖抽象）
class NotificationService {
  constructor(private sender: MessageSender) {}

  notify(message: string, recipient: string): void {
    console.log(`\n开始发送通知...`);
    this.sender.send(message, recipient);
    console.log('✅ 通知发送完成\n');
  }

  // 支持切换发送方式
  changeSender(sender: MessageSender): void {
    this.sender = sender;
  }
}

console.log('\n--- 使用不同的发送方式 ---');
const emailSender = new EmailSender();
const smsSender = new SMSSender();
const wechatSender = new WeChatSender();
const slackSender = new SlackSender();

const notificationService = new NotificationService(emailSender);
notificationService.notify('您有新订单', 'user@example.com');

notificationService.changeSender(smsSender);
notificationService.notify('验证码: 123456', '13800138000');

notificationService.changeSender(wechatSender);
notificationService.notify('会议提醒', '张三');

notificationService.changeSender(slackSender);
notificationService.notify('代码审查完成', '#dev-team');

// ✅ 示例3: 日志系统

console.log('━'.repeat(50));
console.log('示例3: 日志系统');
console.log('━'.repeat(50));

// 定义抽象：日志接口
interface Logger {
  log(level: string, message: string): void;
}

// 具体实现：控制台日志
class ConsoleLogger implements Logger {
  log(level: string, message: string): void {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}

// 具体实现：文件日志
class FileLogger implements Logger {
  constructor(private filename: string) {}

  log(level: string, message: string): void {
    console.log(`📝 写入文件 ${this.filename}: [${level.toUpperCase()}] ${message}`);
  }
}

// 具体实现：远程日志
class RemoteLogger implements Logger {
  constructor(private endpoint: string) {}

  log(level: string, message: string): void {
    console.log(`🌐 发送到 ${this.endpoint}: [${level.toUpperCase()}] ${message}`);
  }
}

// 高层模块：应用程序（依赖抽象）
class Application {
  constructor(private logger: Logger) {}

  run(): void {
    this.logger.log('info', '应用程序启动');
    this.logger.log('debug', '初始化配置');
    this.logger.log('info', '连接数据库');
    this.logger.log('warn', '检测到潜在问题');
    this.logger.log('error', '发生错误');
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
  }
}

console.log('\n--- 使用控制台日志 ---');
const consoleLogger = new ConsoleLogger();
const app1 = new Application(consoleLogger);
app1.run();

console.log('\n--- 使用文件日志 ---');
const fileLogger = new FileLogger('app.log');
const app2 = new Application(fileLogger);
app2.run();

console.log('\n--- 使用远程日志 ---');
const remoteLogger = new RemoteLogger('https://log.example.com');
const app3 = new Application(remoteLogger);
app3.run();

// ✅ 示例4: 支付系统（结合工厂模式）

console.log('\n━'.repeat(50));
console.log('示例4: 支付系统（结合工厂模式）');
console.log('━'.repeat(50));

// 定义抽象：支付网关接口
interface PaymentGateway {
  processPayment(amount: number): boolean;
  refund(transactionId: string, amount: number): boolean;
}

// 具体实现：支付宝
class AlipayGateway implements PaymentGateway {
  processPayment(amount: number): boolean {
    console.log(`💰 支付宝支付 ¥${amount}`);
    return true;
  }

  refund(transactionId: string, amount: number): boolean {
    console.log(`↩️  支付宝退款 ${transactionId}: ¥${amount}`);
    return true;
  }
}

// 具体实现：微信支付
class WeChatPayGateway implements PaymentGateway {
  processPayment(amount: number): boolean {
    console.log(`💚 微信支付 ¥${amount}`);
    return true;
  }

  refund(transactionId: string, amount: number): boolean {
    console.log(`↩️  微信退款 ${transactionId}: ¥${amount}`);
    return true;
  }
}

// 高层模块：订单服务（依赖抽象）
class OrderService {
  constructor(private paymentGateway: PaymentGateway) {}

  checkout(amount: number): void {
    console.log(`\n处理订单，金额: ¥${amount}`);
    const success = this.paymentGateway.processPayment(amount);
    if (success) {
      console.log('✅ 支付成功');
    }
  }

  processRefund(transactionId: string, amount: number): void {
    console.log(`\n处理退款，交易ID: ${transactionId}`);
    const success = this.paymentGateway.refund(transactionId, amount);
    if (success) {
      console.log('✅ 退款成功');
    }
  }
}

console.log('\n--- 使用支付宝 ---');
const alipayGateway = new AlipayGateway();
const orderService1 = new OrderService(alipayGateway);
orderService1.checkout(199.99);
orderService1.processRefund('TXN-001', 199.99);

console.log('\n--- 使用微信支付 ---');
const wechatPayGateway = new WeChatPayGateway();
const orderService2 = new OrderService(wechatPayGateway);
orderService2.checkout(299.99);
orderService2.processRefund('TXN-002', 299.99);

console.log('\n━'.repeat(50));
console.log('🎯 依赖倒置原则的优势：');
console.log('━'.repeat(50));
console.log('1. 高层模块和低层模块都依赖抽象');
console.log('2. 降低模块间的耦合度');
console.log('3. 提高代码的灵活性和可扩展性');
console.log('4. 易于进行单元测试（可以 mock 依赖）');
console.log('5. 易于替换和升级组件');

console.log('\n💡 实际应用场景：');
console.log('- 依赖注入（DI）容器');
console.log('- 框架设计（Spring、NestJS 等）');
console.log('- 插件系统');
console.log('- 微服务架构');

console.log('\n🔑 实现 DIP 的关键技术：');
console.log('- 依赖注入（Dependency Injection）');
console.log('- 接口/抽象类');
console.log('- 工厂模式');
console.log('- 控制反转（IoC）容器');

console.log('\n⚠️  违反 DIP 的信号：');
console.log('- 在类内部使用 new 创建依赖对象');
console.log('- 直接依赖具体类而非接口');
console.log('- 难以进行单元测试');
console.log('- 修改底层实现需要修改高层模块');
console.log('━'.repeat(50));

export {
  Database,
  MySQL,
  PostgreSQL,
  MongoDB,
  UserService,
  MessageSender,
  EmailSender,
  SMSSender,
  WeChatSender,
  NotificationService,
  Logger,
  ConsoleLogger,
  FileLogger,
  RemoteLogger,
  Application,
  PaymentGateway,
  AlipayGateway,
  WeChatPayGateway,
  OrderService
};
