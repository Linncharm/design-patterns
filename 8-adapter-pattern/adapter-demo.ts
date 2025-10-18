/**
 * 适配器模式 (Adapter Pattern)
 *
 * 核心思想：将一个类的接口转换成客户期望的另一个接口，使原本不兼容的类可以一起工作
 * 优点：复用现有类、解耦客户端和实现、符合开闭原则
 * 使用场景：API适配、第三方库封装、数据格式转换、旧系统集成
 */

// ============ 类型定义 ============

/**
 * 统一的用户接口
 */
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

/**
 * 统一的API响应格式
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
}

/**
 * 日志接口
 */
interface Logger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
}

/**
 * 支付网关接口
 */
interface PaymentGateway {
  processPayment(amount: number, currency: string, cardInfo: CardInfo): PaymentResponse;
  refund(transactionId: string, amount: number): RefundResponse;
}

interface CardInfo {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  holderName: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

interface RefundResponse {
  success: boolean;
  refundId: string;
  message: string;
}

// ============ 示例1：第三方API适配 ============

/**
 * 第三方API返回的用户数据格式（不符合我们的标准）
 */
interface ThirdPartyUserData {
  user_id: number;
  user_name: string;
  email_address: string;
  registration_date: string;
  is_active: boolean;
  profile: {
    first_name: string;
    last_name: string;
  };
}

/**
 * 另一个第三方API的用户数据格式
 */
interface LegacyUserData {
  uid: string;
  login: string;
  mail: string;
  created: number; // Unix时间戳
  status: number; // 1=active, 0=inactive
}

/**
 * 第三方API适配器
 */
class ThirdPartyApiAdapter {
  /**
   * 将第三方用户数据转换为标准格式
   */
  public static adaptUser(thirdPartyData: ThirdPartyUserData): User {
    console.log(`\n🔄 适配第三方API用户数据...`);
    console.log(`   原始数据:`, JSON.stringify(thirdPartyData, null, 2));

    const adapted: User = {
      id: String(thirdPartyData.user_id),
      username: thirdPartyData.user_name,
      email: thirdPartyData.email_address,
      createdAt: new Date(thirdPartyData.registration_date)
    };

    console.log(`   适配后:`, JSON.stringify(adapted, null, 2));
    return adapted;
  }

  /**
   * 批量适配用户数据
   */
  public static adaptUsers(thirdPartyData: ThirdPartyUserData[]): User[] {
    return thirdPartyData.map(data => this.adaptUser(data));
  }
}

/**
 * 旧系统API适配器
 */
class LegacyApiAdapter {
  /**
   * 将旧系统用户数据转换为标准格式
   */
  public static adaptUser(legacyData: LegacyUserData): User {
    console.log(`\n🔄 适配旧系统用户数据...`);
    console.log(`   原始数据:`, JSON.stringify(legacyData, null, 2));

    const adapted: User = {
      id: legacyData.uid,
      username: legacyData.login,
      email: legacyData.mail,
      createdAt: new Date(legacyData.created * 1000) // Unix时间戳转Date
    };

    console.log(`   适配后:`, JSON.stringify(adapted, null, 2));
    return adapted;
  }
}

/**
 * 统一用户服务（使用适配器处理不同来源的数据）
 */
class UserService {
  public getUserFromThirdParty(data: ThirdPartyUserData): User {
    return ThirdPartyApiAdapter.adaptUser(data);
  }

  public getUserFromLegacySystem(data: LegacyUserData): User {
    return LegacyApiAdapter.adaptUser(data);
  }

  public displayUser(user: User): void {
    console.log(`\n👤 用户信息：`);
    console.log(`   ID: ${user.id}`);
    console.log(`   用户名: ${user.username}`);
    console.log(`   邮箱: ${user.email}`);
    console.log(`   注册时间: ${user.createdAt.toLocaleString('zh-CN')}`);
  }
}

// ============ 示例2：第三方日志库适配 ============

/**
 * 第三方日志库 Winston（模拟）
 */
class WinstonLogger {
  public write(level: string, message: string): void {
    const timestamp: string = new Date().toISOString();
    console.log(`[Winston] ${timestamp} [${level.toUpperCase()}] ${message}`);
  }

  public writeError(error: Error): void {
    console.log(`[Winston] ERROR: ${error.message}`);
    if (error.stack) {
      console.log(error.stack);
    }
  }
}

/**
 * 第三方日志库 Log4js（模拟）
 */
class Log4jsLogger {
  public trace(msg: string): void {
    console.log(`[Log4js TRACE] ${msg}`);
  }

  public debug(msg: string): void {
    console.log(`[Log4js DEBUG] ${msg}`);
  }

  public info(msg: string): void {
    console.log(`[Log4js INFO] ${msg}`);
  }

  public warn(msg: string): void {
    console.log(`[Log4js WARN] ${msg}`);
  }

  public error(msg: string): void {
    console.log(`[Log4js ERROR] ${msg}`);
  }
}

/**
 * Winston适配器
 */
class WinstonLoggerAdapter implements Logger {
  constructor(private winston: WinstonLogger) {}

  public log(message: string): void {
    this.winston.write('log', message);
  }

  public error(message: string): void {
    this.winston.write('error', message);
  }

  public warn(message: string): void {
    this.winston.write('warn', message);
  }

  public info(message: string): void {
    this.winston.write('info', message);
  }
}

/**
 * Log4js适配器
 */
class Log4jsLoggerAdapter implements Logger {
  constructor(private log4js: Log4jsLogger) {}

  public log(message: string): void {
    this.log4js.debug(message);
  }

  public error(message: string): void {
    this.log4js.error(message);
  }

  public warn(message: string): void {
    this.log4js.warn(message);
  }

  public info(message: string): void {
    this.log4js.info(message);
  }
}

/**
 * 应用程序（使用统一的Logger接口）
 */
class Application {
  constructor(private logger: Logger) {}

  public setLogger(logger: Logger): void {
    this.logger = logger;
  }

  public run(): void {
    this.logger.info('应用程序启动');
    this.logger.log('执行业务逻辑');
    this.logger.warn('这是一个警告');
    this.logger.error('发生错误');
  }
}

// ============ 示例3：数据格式转换适配器 ============

/**
 * XML数据格式（旧系统）
 */
interface XmlData {
  toXmlString(): string;
}

/**
 * JSON数据格式（新系统）
 */
interface JsonData {
  toJsonString(): string;
  toObject(): object;
}

/**
 * XML产品数据
 */
class XmlProduct implements XmlData {
  constructor(
    private id: number,
    private name: string,
    private price: number,
    private stock: number
  ) {}

  public toXmlString(): string {
    return `
<product>
  <id>${this.id}</id>
  <name>${this.name}</name>
  <price>${this.price}</price>
  <stock>${this.stock}</stock>
</product>`.trim();
  }

  public getId(): number { return this.id; }
  public getName(): string { return this.name; }
  public getPrice(): number { return this.price; }
  public getStock(): number { return this.stock; }
}

/**
 * XML到JSON适配器
 */
class XmlToJsonAdapter implements JsonData {
  constructor(private xmlProduct: XmlProduct) {}

  public toJsonString(): string {
    const obj = this.toObject();
    return JSON.stringify(obj, null, 2);
  }

  public toObject(): object {
    return {
      id: this.xmlProduct.getId(),
      name: this.xmlProduct.getName(),
      price: this.xmlProduct.getPrice(),
      stock: this.xmlProduct.getStock(),
      format: 'JSON',
      convertedAt: new Date().toISOString()
    };
  }
}

/**
 * 数据导出器
 */
class DataExporter {
  /**
   * 导出为JSON（接受JsonData接口）
   */
  public exportAsJson(data: JsonData): void {
    console.log(`\n📤 导出JSON数据：`);
    console.log(data.toJsonString());
  }

  /**
   * 导出为XML（接受XmlData接口）
   */
  public exportAsXml(data: XmlData): void {
    console.log(`\n📤 导出XML数据：`);
    console.log(data.toXmlString());
  }
}

// ============ 示例4：支付网关适配器 ============

/**
 * Stripe支付SDK（第三方）
 */
class StripeSDK {
  public charge(params: {
    amount: number;
    currency: string;
    source: string;
    description: string;
  }): { id: string; status: string } {
    console.log(`\n💳 Stripe SDK: 创建支付...`);
    console.log(`   金额: ${params.amount / 100} ${params.currency.toUpperCase()}`);

    return {
      id: `ch_${Math.random().toString(36).substr(2, 9)}`,
      status: 'succeeded'
    };
  }

  public refundCharge(chargeId: string, amount: number): { id: string; status: string } {
    console.log(`\n💳 Stripe SDK: 退款 ${chargeId}...`);
    return {
      id: `re_${Math.random().toString(36).substr(2, 9)}`,
      status: 'succeeded'
    };
  }
}

/**
 * PayPal支付SDK（第三方）
 */
class PayPalSDK {
  public createPayment(data: {
    total: string;
    currency: string;
    description: string;
  }): { paymentID: string; state: string } {
    console.log(`\n💰 PayPal SDK: 创建支付...`);
    console.log(`   金额: ${data.total} ${data.currency}`);

    return {
      paymentID: `PAY-${Math.random().toString(36).substr(2, 9)}`,
      state: 'approved'
    };
  }

  public refundPayment(paymentId: string, refundAmount: string): { refundID: string } {
    console.log(`\n💰 PayPal SDK: 退款 ${paymentId}...`);
    return {
      refundID: `REF-${Math.random().toString(36).substr(2, 9)}`
    };
  }
}

/**
 * Stripe适配器
 */
class StripeAdapter implements PaymentGateway {
  private stripe: StripeSDK;

  constructor() {
    this.stripe = new StripeSDK();
  }

  public processPayment(amount: number, currency: string, cardInfo: CardInfo): PaymentResponse {
    console.log(`\n🔄 使用Stripe适配器处理支付...`);

    // 将金额转换为分（Stripe要求）
    const amountInCents: number = Math.round(amount * 100);

    // 调用Stripe SDK
    const result = this.stripe.charge({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      source: cardInfo.cardNumber,
      description: `Payment for ${amount} ${currency}`
    });

    return {
      success: result.status === 'succeeded',
      transactionId: result.id,
      message: result.status === 'succeeded' ? '支付成功' : '支付失败'
    };
  }

  public refund(transactionId: string, amount: number): RefundResponse {
    console.log(`\n🔄 使用Stripe适配器处理退款...`);

    const result = this.stripe.refundCharge(transactionId, Math.round(amount * 100));

    return {
      success: result.status === 'succeeded',
      refundId: result.id,
      message: '退款成功'
    };
  }
}

/**
 * PayPal适配器
 */
class PayPalAdapter implements PaymentGateway {
  private paypal: PayPalSDK;

  constructor() {
    this.paypal = new PayPalSDK();
  }

  public processPayment(amount: number, currency: string, cardInfo: CardInfo): PaymentResponse {
    console.log(`\n🔄 使用PayPal适配器处理支付...`);

    const result = this.paypal.createPayment({
      total: amount.toFixed(2),
      currency: currency.toUpperCase(),
      description: `Payment for ${amount} ${currency}`
    });

    return {
      success: result.state === 'approved',
      transactionId: result.paymentID,
      message: result.state === 'approved' ? '支付成功' : '支付失败'
    };
  }

  public refund(transactionId: string, amount: number): RefundResponse {
    console.log(`\n🔄 使用PayPal适配器处理退款...`);

    const result = this.paypal.refundPayment(transactionId, amount.toFixed(2));

    return {
      success: true,
      refundId: result.refundID,
      message: '退款成功'
    };
  }
}

/**
 * 支付服务（使用统一的PaymentGateway接口）
 */
class PaymentService {
  constructor(private gateway: PaymentGateway) {}

  public setGateway(gateway: PaymentGateway): void {
    this.gateway = gateway;
  }

  public pay(amount: number, currency: string, cardInfo: CardInfo): void {
    console.log(`\n💰 支付服务: 处理 ${amount} ${currency} 的支付...`);

    const result: PaymentResponse = this.gateway.processPayment(amount, currency, cardInfo);

    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`   交易ID: ${result.transactionId}`);
    } else {
      console.log(`❌ ${result.message}`);
    }
  }

  public refundPayment(transactionId: string, amount: number): void {
    console.log(`\n💰 支付服务: 退款 ${amount}...`);

    const result: RefundResponse = this.gateway.refund(transactionId, amount);

    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`   退款ID: ${result.refundId}`);
    }
  }
}

// ============ 使用示例 ============
function main(): void {
  console.log('🎯 适配器模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：API数据适配 ============
  console.log('\n【示例1：第三方API数据适配】');
  console.log('='.repeat(60));

  const userService: UserService = new UserService();

  // 第三方API数据
  const thirdPartyData: ThirdPartyUserData = {
    user_id: 1001,
    user_name: 'john_doe',
    email_address: 'john@example.com',
    registration_date: '2024-01-15T08:30:00Z',
    is_active: true,
    profile: {
      first_name: 'John',
      last_name: 'Doe'
    }
  };

  const user1: User = userService.getUserFromThirdParty(thirdPartyData);
  userService.displayUser(user1);

  // 旧系统数据
  const legacyData: LegacyUserData = {
    uid: 'legacy-9527',
    login: 'alice_smith',
    mail: 'alice@oldmail.com',
    created: 1610611200, // 2021-01-14
    status: 1
  };

  const user2: User = userService.getUserFromLegacySystem(legacyData);
  userService.displayUser(user2);

  // ============ 示例2：日志库适配 ============
  console.log('\n\n' + '='.repeat(60));
  console.log('\n【示例2：第三方日志库适配】');
  console.log('='.repeat(60));

  const app: Application = new Application(
    new WinstonLoggerAdapter(new WinstonLogger())
  );

  console.log('\n使用Winston日志库：');
  app.run();

  console.log('\n切换到Log4js日志库：');
  app.setLogger(new Log4jsLoggerAdapter(new Log4jsLogger()));
  app.run();

  // ============ 示例3：数据格式转换 ============
  console.log('\n\n' + '='.repeat(60));
  console.log('\n【示例3：数据格式转换（XML → JSON）】');
  console.log('='.repeat(60));

  const xmlProduct: XmlProduct = new XmlProduct(101, 'MacBook Pro', 12999, 50);
  const exporter: DataExporter = new DataExporter();

  // 导出原始XML
  exporter.exportAsXml(xmlProduct);

  // 使用适配器转换为JSON并导出
  const jsonAdapter: XmlToJsonAdapter = new XmlToJsonAdapter(xmlProduct);
  exporter.exportAsJson(jsonAdapter);

  console.log(`\n💡 通过适配器，XML数据可以无缝转换为JSON格式！`);

  // ============ 示例4：支付网关适配 ============
  console.log('\n\n' + '='.repeat(60));
  console.log('\n【示例4：支付网关适配】');
  console.log('='.repeat(60));

  const cardInfo: CardInfo = {
    cardNumber: '4242424242424242',
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: '123',
    holderName: 'John Doe'
  };

  // 使用Stripe支付
  console.log('\n场景1：使用Stripe支付');
  const paymentService: PaymentService = new PaymentService(new StripeAdapter());
  paymentService.pay(99.99, 'USD', cardInfo);

  // 切换到PayPal支付
  console.log('\n场景2：切换到PayPal支付');
  paymentService.setGateway(new PayPalAdapter());
  paymentService.pay(199.99, 'USD', cardInfo);

  console.log('\n\n' + '='.repeat(60));
  console.log('\n🎯 适配器模式的优势：');
  console.log('1. 复用现有代码，无需修改原有实现');
  console.log('2. 解耦客户端和第三方库，易于替换');
  console.log('3. 符合开闭原则和单一职责原则');
  console.log('4. 统一接口，简化客户端代码');
  console.log('5. TypeScript接口确保适配器实现正确');
  console.log('\n💡 适配器模式的应用场景：');
  console.log('   - 整合第三方SDK（支付、日志、存储等）');
  console.log('   - 统一不同数据源的API接口');
  console.log('   - 数据格式转换（XML、JSON、Protocol Buffer）');
  console.log('   - 旧系统迁移和集成');
  console.log('   - 多种实现方式的统一接口');
}

// 运行示例
main();

export {
  User,
  Logger,
  PaymentGateway,
  ThirdPartyApiAdapter,
  LegacyApiAdapter,
  WinstonLoggerAdapter,
  Log4jsLoggerAdapter,
  XmlToJsonAdapter,
  StripeAdapter,
  PayPalAdapter,
  UserService,
  Application,
  PaymentService
};
