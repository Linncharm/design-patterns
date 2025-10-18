/**
 * 装饰器模式 (Decorator Pattern)
 *
 * 核心思想：动态地给对象添加额外的职责，而不改变其结构
 * 优点：比继承更灵活、遵循开闭原则、可以动态组合多个装饰器
 * 使用场景：需要动态添加功能、避免类爆炸、功能可插拔组合
 */

// ============ 类型定义 ============
interface Component {
  operation(): string;
  getDescription(): string;
  getCost(): number;
}

interface Notifier {
  send(message: string): void;
  getChannels(): string[];
}

interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

interface HttpHandler {
  handle(request: HttpRequest): Promise<HttpResponse>;
}

interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

interface HttpResponse {
  status: number;
  data: unknown;
  headers: Record<string, string>;
}

// ============ 示例1：咖啡订单装饰器（经典示例）============

/**
 * 基础咖啡类
 */
class SimpleCoffee implements Component {
  public operation(): string {
    return '基础咖啡';
  }

  public getDescription(): string {
    return '纯咖啡';
  }

  public getCost(): number {
    return 10;
  }
}

/**
 * 抽象装饰器基类
 */
abstract class CoffeeDecorator implements Component {
  constructor(protected component: Component) {}

  public operation(): string {
    return this.component.operation();
  }

  public getDescription(): string {
    return this.component.getDescription();
  }

  public getCost(): number {
    return this.component.getCost();
  }
}

/**
 * 牛奶装饰器
 */
class MilkDecorator extends CoffeeDecorator {
  public operation(): string {
    return this.component.operation() + ' + 牛奶';
  }

  public getDescription(): string {
    return this.component.getDescription() + ' + 牛奶';
  }

  public getCost(): number {
    return this.component.getCost() + 3;
  }
}

/**
 * 摩卡装饰器
 */
class MochaDecorator extends CoffeeDecorator {
  public operation(): string {
    return this.component.operation() + ' + 摩卡';
  }

  public getDescription(): string {
    return this.component.getDescription() + ' + 摩卡';
  }

  public getCost(): number {
    return this.component.getCost() + 5;
  }
}

/**
 * 焦糖装饰器
 */
class CaramelDecorator extends CoffeeDecorator {
  public operation(): string {
    return this.component.operation() + ' + 焦糖';
  }

  public getDescription(): string {
    return this.component.getDescription() + ' + 焦糖';
  }

  public getCost(): number {
    return this.component.getCost() + 4;
  }
}

/**
 * 奶泡装饰器
 */
class WhipDecorator extends CoffeeDecorator {
  public operation(): string {
    return this.component.operation() + ' + 奶泡';
  }

  public getDescription(): string {
    return this.component.getDescription() + ' + 奶泡';
  }

  public getCost(): number {
    return this.component.getCost() + 2;
  }
}

// ============ 示例2：通知系统装饰器 ============

/**
 * 基础通知器
 */
class BaseNotifier implements Notifier {
  constructor(protected channels: string[] = []) {}

  public send(message: string): void {
    console.log(`📧 [基础通知] ${message}`);
  }

  public getChannels(): string[] {
    return [...this.channels];
  }
}

/**
 * 抽象通知装饰器
 */
abstract class NotifierDecorator implements Notifier {
  constructor(protected notifier: Notifier) {}

  public send(message: string): void {
    this.notifier.send(message);
  }

  public getChannels(): string[] {
    return this.notifier.getChannels();
  }
}

/**
 * 短信通知装饰器
 */
class SmsNotifierDecorator extends NotifierDecorator {
  constructor(notifier: Notifier, private phoneNumber: string) {
    super(notifier);
  }

  public send(message: string): void {
    super.send(message);
    this.sendSms(message);
  }

  private sendSms(message: string): void {
    console.log(`📱 [短信通知] 发送到 ${this.phoneNumber}: ${message}`);
  }

  public getChannels(): string[] {
    return [...super.getChannels(), 'SMS'];
  }
}

/**
 * 微信通知装饰器
 */
class WechatNotifierDecorator extends NotifierDecorator {
  constructor(notifier: Notifier, private wechatId: string) {
    super(notifier);
  }

  public send(message: string): void {
    super.send(message);
    this.sendWechat(message);
  }

  private sendWechat(message: string): void {
    console.log(`💬 [微信通知] 发送到 ${this.wechatId}: ${message}`);
  }

  public getChannels(): string[] {
    return [...super.getChannels(), 'WeChat'];
  }
}

/**
 * Slack通知装饰器
 */
class SlackNotifierDecorator extends NotifierDecorator {
  constructor(notifier: Notifier, private channel: string) {
    super(notifier);
  }

  public send(message: string): void {
    super.send(message);
    this.sendSlack(message);
  }

  private sendSlack(message: string): void {
    console.log(`💼 [Slack通知] 发送到频道 ${this.channel}: ${message}`);
  }

  public getChannels(): string[] {
    return [...super.getChannels(), 'Slack'];
  }
}

// ============ 示例3：数据流装饰器 ============

/**
 * 基础数据源
 */
class FileDataSource implements DataSource {
  private data: string = '';

  constructor(private filename: string) {}

  public writeData(data: string): void {
    console.log(`💾 [文件] 写入数据到 ${this.filename}`);
    this.data = data;
    console.log(`   原始数据: "${data}"`);
  }

  public readData(): string {
    console.log(`📂 [文件] 从 ${this.filename} 读取数据`);
    console.log(`   原始数据: "${this.data}"`);
    return this.data;
  }
}

/**
 * 抽象数据源装饰器
 */
abstract class DataSourceDecorator implements DataSource {
  constructor(protected wrappee: DataSource) {}

  public writeData(data: string): void {
    this.wrappee.writeData(data);
  }

  public readData(): string {
    return this.wrappee.readData();
  }
}

/**
 * 加密装饰器
 */
class EncryptionDecorator extends DataSourceDecorator {
  public writeData(data: string): void {
    const encrypted: string = this.encrypt(data);
    console.log(`🔐 [加密] 数据已加密`);
    console.log(`   加密后: "${encrypted}"`);
    super.writeData(encrypted);
  }

  public readData(): string {
    const data: string = super.readData();
    const decrypted: string = this.decrypt(data);
    console.log(`🔓 [解密] 数据已解密`);
    console.log(`   解密后: "${decrypted}"`);
    return decrypted;
  }

  private encrypt(data: string): string {
    // 简单的反转加密（仅用于演示）
    return data.split('').reverse().join('');
  }

  private decrypt(data: string): string {
    // 反转解密
    return data.split('').reverse().join('');
  }
}

/**
 * 压缩装饰器
 */
class CompressionDecorator extends DataSourceDecorator {
  public writeData(data: string): void {
    const compressed: string = this.compress(data);
    console.log(`📦 [压缩] 数据已压缩`);
    console.log(`   原始大小: ${data.length} bytes`);
    console.log(`   压缩后: ${compressed.length} bytes`);
    console.log(`   压缩率: ${((1 - compressed.length / data.length) * 100).toFixed(2)}%`);
    super.writeData(compressed);
  }

  public readData(): string {
    const data: string = super.readData();
    const decompressed: string = this.decompress(data);
    console.log(`📂 [解压] 数据已解压`);
    console.log(`   解压后大小: ${decompressed.length} bytes`);
    return decompressed;
  }

  private compress(data: string): string {
    // 简单的压缩模拟：移除重复字符（仅用于演示）
    return `[COMPRESSED:${data.length}]${data.substring(0, Math.min(20, data.length))}`;
  }

  private decompress(data: string): string {
    // 解压模拟
    const match = data.match(/\[COMPRESSED:(\d+)\](.*)/);
    if (match) {
      const originalLength: number = parseInt(match[1]);
      const sample: string = match[2];
      // 模拟还原（实际应该完整还原）
      return sample.padEnd(originalLength, '.');
    }
    return data;
  }
}

/**
 * Base64编码装饰器
 */
class Base64Decorator extends DataSourceDecorator {
  public writeData(data: string): void {
    const encoded: string = this.encode(data);
    console.log(`🔤 [Base64] 数据已编码`);
    console.log(`   编码后: "${encoded}"`);
    super.writeData(encoded);
  }

  public readData(): string {
    const data: string = super.readData();
    const decoded: string = this.decode(data);
    console.log(`🔡 [Base64] 数据已解码`);
    console.log(`   解码后: "${decoded}"`);
    return decoded;
  }

  private encode(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  private decode(data: string): string {
    return Buffer.from(data, 'base64').toString('utf-8');
  }
}

// ============ 使用示例 ============
function main(): void {
  console.log('🎯 装饰器模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：咖啡订单 ============
  console.log('\n【示例1：咖啡订单装饰器】\n');

  // 基础咖啡
  let coffee: Component = new SimpleCoffee();
  console.log(`订单1: ${coffee.getDescription()}`);
  console.log(`价格: ¥${coffee.getCost()}\n`);

  // 加牛奶
  coffee = new MilkDecorator(coffee);
  console.log(`订单2: ${coffee.getDescription()}`);
  console.log(`价格: ¥${coffee.getCost()}\n`);

  // 再加摩卡
  coffee = new MochaDecorator(coffee);
  console.log(`订单3: ${coffee.getDescription()}`);
  console.log(`价格: ¥${coffee.getCost()}\n`);

  // 豪华版：基础咖啡 + 双份牛奶 + 摩卡 + 焦糖 + 奶泡
  let fancyCoffee: Component = new SimpleCoffee();
  fancyCoffee = new MilkDecorator(fancyCoffee);
  fancyCoffee = new MilkDecorator(fancyCoffee); // 双份牛奶
  fancyCoffee = new MochaDecorator(fancyCoffee);
  fancyCoffee = new CaramelDecorator(fancyCoffee);
  fancyCoffee = new WhipDecorator(fancyCoffee);

  console.log(`豪华订单: ${fancyCoffee.getDescription()}`);
  console.log(`价格: ¥${fancyCoffee.getCost()}`);
  console.log(`💡 灵活组合，无需创建大量子类！\n`);

  // ============ 示例2：通知系统 ============
  console.log('='.repeat(60));
  console.log('\n【示例2：多渠道通知系统】\n');

  // 基础通知
  let notifier: Notifier = new BaseNotifier();
  console.log('场景1：仅基础通知');
  notifier.send('系统启动');
  console.log('');

  // 添加短信通知
  notifier = new SmsNotifierDecorator(notifier, '138-1234-5678');
  console.log('场景2：基础通知 + 短信');
  notifier.send('订单已确认');
  console.log('');

  // 添加微信通知
  notifier = new WechatNotifierDecorator(notifier, 'user_wx_123');
  console.log('场景3：基础通知 + 短信 + 微信');
  notifier.send('订单已发货');
  console.log('');

  // 添加Slack通知
  notifier = new SlackNotifierDecorator(notifier, '#alerts');
  console.log('场景4：基础通知 + 短信 + 微信 + Slack');
  notifier.send('系统异常告警');
  console.log(`\n激活的通知渠道: ${notifier.getChannels().join(', ')}\n`);

  // ============ 示例3：数据流处理 ============
  console.log('='.repeat(60));
  console.log('\n【示例3：数据流装饰器（加密+压缩+编码）】\n');

  const originalData: string = 'Sensitive user data: password123, email@example.com';

  // 场景1：仅保存（无装饰）
  console.log('场景1：直接保存到文件');
  let dataSource: DataSource = new FileDataSource('data.txt');
  dataSource.writeData(originalData);
  console.log('');

  // 场景2：加密后保存
  console.log('场景2：加密后保存');
  dataSource = new EncryptionDecorator(
    new FileDataSource('encrypted.txt')
  );
  dataSource.writeData(originalData);
  console.log('\n读取并解密：');
  dataSource.readData();
  console.log('');

  // 场景3：压缩 + 加密 + Base64编码（多层装饰）
  console.log('场景3：压缩 + 加密 + Base64编码（三层装饰）');
  dataSource = new Base64Decorator(
    new EncryptionDecorator(
      new CompressionDecorator(
        new FileDataSource('secure.txt')
      )
    )
  );

  console.log('\n写入操作（从内到外）：');
  dataSource.writeData(originalData);

  console.log('\n读取操作（从外到内）：');
  const readResult: string = dataSource.readData();
  console.log(`\n最终读取结果: "${readResult}"\n`);

  console.log('='.repeat(60));
  console.log('\n🎯 装饰器模式的优势：');
  console.log('1. 动态组合：运行时灵活添加功能');
  console.log('2. 避免类爆炸：不需要为每种组合创建子类');
  console.log('3. 单一职责：每个装饰器只负责一个功能');
  console.log('4. 符合开闭原则：新增装饰器不影响现有代码');
  console.log('5. 可嵌套使用：装饰器可以多层包装');
  console.log('6. TypeScript接口确保装饰器和组件类型一致');
  console.log('\n💡 装饰器 vs 继承：');
  console.log('   - 继承是静态的，编译时确定');
  console.log('   - 装饰器是动态的，运行时组合');
  console.log('   - 装饰器比继承更灵活，避免类爆炸问题');
}

// 运行示例
main();

export {
  Component,
  SimpleCoffee,
  CoffeeDecorator,
  MilkDecorator,
  MochaDecorator,
  CaramelDecorator,
  WhipDecorator,
  Notifier,
  BaseNotifier,
  SmsNotifierDecorator,
  WechatNotifierDecorator,
  SlackNotifierDecorator,
  DataSource,
  FileDataSource,
  EncryptionDecorator,
  CompressionDecorator,
  Base64Decorator
};
