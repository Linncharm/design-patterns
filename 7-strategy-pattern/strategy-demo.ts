/**
 * 策略模式 (Strategy Pattern)
 *
 * 核心思想：定义一系列算法，将每个算法封装起来，使它们可以互相替换
 * 优点：避免多重条件判断、易于扩展、符合开闭原则
 * 使用场景：表单验证、支付方式选择、算法切换、排序策略
 */

// ============ 类型定义 ============

/**
 * 策略接口
 */
interface Strategy<T, R> {
  execute(data: T): R;
}

/**
 * 验证结果
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 支付结果
 */
interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: Date;
}

/**
 * 支付信息
 */
interface PaymentInfo {
  amount: number;
  currency: string;
  description: string;
}

/**
 * 排序策略类型
 */
type SortOrder = 'asc' | 'desc';

/**
 * 产品数据
 */
interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  sales: number;
}

// ============ 示例1：表单验证策略 ============

/**
 * 验证策略接口
 */
interface ValidationStrategy {
  validate(value: string): ValidationResult;
  getName(): string;
}

/**
 * 邮箱验证策略
 */
class EmailValidationStrategy implements ValidationStrategy {
  public validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value || value.trim() === '') {
      errors.push('邮箱不能为空');
    } else {
      const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push('邮箱格式不正确');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public getName(): string {
    return '邮箱验证';
  }
}

/**
 * 手机号验证策略
 */
class PhoneValidationStrategy implements ValidationStrategy {
  public validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value || value.trim() === '') {
      errors.push('手机号不能为空');
    } else {
      const phoneRegex: RegExp = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        errors.push('手机号格式不正确（应为11位数字，以1开头）');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public getName(): string {
    return '手机号验证';
  }
}

/**
 * 密码验证策略
 */
class PasswordValidationStrategy implements ValidationStrategy {
  constructor(
    private minLength: number = 8,
    private requireSpecialChar: boolean = true,
    private requireNumber: boolean = true
  ) {}

  public validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value || value.trim() === '') {
      errors.push('密码不能为空');
    } else {
      if (value.length < this.minLength) {
        errors.push(`密码长度至少为${this.minLength}个字符`);
      }

      if (this.requireNumber && !/\d/.test(value)) {
        errors.push('密码必须包含至少一个数字');
      }

      if (this.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.push('密码必须包含至少一个特殊字符');
      }

      if (!/[a-zA-Z]/.test(value)) {
        errors.push('密码必须包含至少一个字母');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public getName(): string {
    return '密码强度验证';
  }
}

/**
 * 表单验证器（上下文）
 */
class FormValidator {
  private strategy: ValidationStrategy;

  constructor(strategy: ValidationStrategy) {
    this.strategy = strategy;
  }

  /**
   * 设置验证策略
   */
  public setStrategy(strategy: ValidationStrategy): void {
    this.strategy = strategy;
  }

  /**
   * 执行验证
   */
  public validate(value: string): ValidationResult {
    console.log(`\n使用【${this.strategy.getName()}】验证: "${value}"`);
    const result: ValidationResult = this.strategy.validate(value);

    if (result.isValid) {
      console.log(`✅ 验证通过`);
    } else {
      console.log(`❌ 验证失败:`);
      result.errors.forEach((error: string) => {
        console.log(`   - ${error}`);
      });
    }

    return result;
  }
}

// ============ 示例2：支付策略 ============

/**
 * 支付策略接口
 */
interface PaymentStrategy {
  pay(paymentInfo: PaymentInfo): PaymentResult;
  getName(): string;
}

/**
 * 支付宝支付策略
 */
class AlipayStrategy implements PaymentStrategy {
  constructor(private account: string) {}

  public pay(paymentInfo: PaymentInfo): PaymentResult {
    console.log(`\n💰 使用支付宝支付`);
    console.log(`   账号: ${this.account}`);
    console.log(`   金额: ${paymentInfo.amount} ${paymentInfo.currency}`);
    console.log(`   描述: ${paymentInfo.description}`);
    console.log(`   正在调用支付宝SDK...`);

    // 模拟支付处理
    const transactionId: string = `ALIPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: '支付宝支付成功',
      timestamp: new Date()
    };
  }

  public getName(): string {
    return '支付宝';
  }
}

/**
 * 微信支付策略
 */
class WechatPayStrategy implements PaymentStrategy {
  constructor(private openId: string) {}

  public pay(paymentInfo: PaymentInfo): PaymentResult {
    console.log(`\n💚 使用微信支付`);
    console.log(`   OpenID: ${this.openId}`);
    console.log(`   金额: ${paymentInfo.amount} ${paymentInfo.currency}`);
    console.log(`   描述: ${paymentInfo.description}`);
    console.log(`   正在调用微信支付API...`);

    const transactionId: string = `WECHAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: '微信支付成功',
      timestamp: new Date()
    };
  }

  public getName(): string {
    return '微信支付';
  }
}

/**
 * 信用卡支付策略
 */
class CreditCardStrategy implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiryDate: string
  ) {}

  public pay(paymentInfo: PaymentInfo): PaymentResult {
    console.log(`\n💳 使用信用卡支付`);
    console.log(`   卡号: **** **** **** ${this.cardNumber.slice(-4)}`);
    console.log(`   有效期: ${this.expiryDate}`);
    console.log(`   金额: ${paymentInfo.amount} ${paymentInfo.currency}`);
    console.log(`   描述: ${paymentInfo.description}`);
    console.log(`   正在处理信用卡交易...`);

    const transactionId: string = `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: '信用卡支付成功',
      timestamp: new Date()
    };
  }

  public getName(): string {
    return '信用卡';
  }
}

/**
 * 加密货币支付策略
 */
class CryptoPayStrategy implements PaymentStrategy {
  constructor(
    private walletAddress: string,
    private cryptocurrency: string = 'BTC'
  ) {}

  public pay(paymentInfo: PaymentInfo): PaymentResult {
    console.log(`\n₿ 使用加密货币支付`);
    console.log(`   货币: ${this.cryptocurrency}`);
    console.log(`   钱包地址: ${this.walletAddress}`);
    console.log(`   金额: ${paymentInfo.amount} ${paymentInfo.currency}`);
    console.log(`   描述: ${paymentInfo.description}`);
    console.log(`   正在广播区块链交易...`);

    const transactionId: string = `CRYPTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
      message: `${this.cryptocurrency}支付成功`,
      timestamp: new Date()
    };
  }

  public getName(): string {
    return `加密货币(${this.cryptocurrency})`;
  }
}

/**
 * 支付处理器（上下文）
 */
class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  /**
   * 切换支付方式
   */
  public setPaymentMethod(strategy: PaymentStrategy): void {
    this.strategy = strategy;
    console.log(`\n🔄 切换支付方式为: ${strategy.getName()}`);
  }

  /**
   * 处理支付
   */
  public processPayment(paymentInfo: PaymentInfo): PaymentResult {
    console.log(`\n📝 准备使用【${this.strategy.getName()}】进行支付`);
    const result: PaymentResult = this.strategy.pay(paymentInfo);

    if (result.success) {
      console.log(`\n✅ 支付成功！`);
      console.log(`   交易ID: ${result.transactionId}`);
      console.log(`   时间: ${result.timestamp.toLocaleString('zh-CN')}`);
    } else {
      console.log(`\n❌ 支付失败: ${result.message}`);
    }

    return result;
  }
}

// ============ 示例3：排序策略 ============

/**
 * 排序策略接口
 */
interface SortStrategy<T> {
  sort(data: T[], order: SortOrder): T[];
  getName(): string;
}

/**
 * 按价格排序策略
 */
class PriceSortStrategy implements SortStrategy<Product> {
  public sort(data: Product[], order: SortOrder = 'asc'): Product[] {
    return [...data].sort((a: Product, b: Product) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }

  public getName(): string {
    return '价格排序';
  }
}

/**
 * 按评分排序策略
 */
class RatingSortStrategy implements SortStrategy<Product> {
  public sort(data: Product[], order: SortOrder = 'desc'): Product[] {
    return [...data].sort((a: Product, b: Product) => {
      return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    });
  }

  public getName(): string {
    return '评分排序';
  }
}

/**
 * 按销量排序策略
 */
class SalesSortStrategy implements SortStrategy<Product> {
  public sort(data: Product[], order: SortOrder = 'desc'): Product[] {
    return [...data].sort((a: Product, b: Product) => {
      return order === 'asc' ? a.sales - b.sales : b.sales - a.sales;
    });
  }

  public getName(): string {
    return '销量排序';
  }
}

/**
 * 综合排序策略（价格、评分、销量加权）
 */
class ComprehensiveSortStrategy implements SortStrategy<Product> {
  constructor(
    private priceWeight: number = 0.3,
    private ratingWeight: number = 0.4,
    private salesWeight: number = 0.3
  ) {}

  public sort(data: Product[], order: SortOrder = 'desc'): Product[] {
    return [...data].sort((a: Product, b: Product) => {
      // 归一化各个指标
      const maxPrice: number = Math.max(...data.map(p => p.price));
      const maxRating: number = 5; // 假设最高评分是5
      const maxSales: number = Math.max(...data.map(p => p.sales));

      const scoreA: number =
        (1 - a.price / maxPrice) * this.priceWeight +
        (a.rating / maxRating) * this.ratingWeight +
        (a.sales / maxSales) * this.salesWeight;

      const scoreB: number =
        (1 - b.price / maxPrice) * this.priceWeight +
        (b.rating / maxRating) * this.ratingWeight +
        (b.sales / maxSales) * this.salesWeight;

      return order === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    });
  }

  public getName(): string {
    return `综合排序(价格${this.priceWeight}+评分${this.ratingWeight}+销量${this.salesWeight})`;
  }
}

/**
 * 产品排序器（上下文）
 */
class ProductSorter {
  private strategy: SortStrategy<Product>;

  constructor(strategy: SortStrategy<Product>) {
    this.strategy = strategy;
  }

  /**
   * 设置排序策略
   */
  public setSortStrategy(strategy: SortStrategy<Product>): void {
    this.strategy = strategy;
  }

  /**
   * 执行排序
   */
  public sort(products: Product[], order: SortOrder = 'asc'): Product[] {
    console.log(`\n📊 使用【${this.strategy.getName()}】排序（${order === 'asc' ? '升序' : '降序'}）`);
    return this.strategy.sort(products, order);
  }

  /**
   * 显示产品列表
   */
  public displayProducts(products: Product[]): void {
    console.log('\n产品列表：');
    console.log('─'.repeat(80));
    console.log(`${'ID'.padEnd(6)} ${'名称'.padEnd(20)} ${'价格'.padEnd(10)} ${'评分'.padEnd(10)} ${'销量'.padEnd(10)}`);
    console.log('─'.repeat(80));

    products.forEach((product: Product) => {
      console.log(
        `${String(product.id).padEnd(6)} ` +
        `${product.name.padEnd(20)} ` +
        `¥${String(product.price).padEnd(9)} ` +
        `${'⭐'.repeat(Math.floor(product.rating))} ${product.rating.toFixed(1).padEnd(4)} ` +
        `${String(product.sales).padEnd(10)}`
      );
    });
    console.log('─'.repeat(80));
  }
}

// ============ 使用示例 ============
function main(): void {
  console.log('🎯 策略模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：表单验证 ============
  console.log('\n【示例1：表单验证策略】');
  console.log('='.repeat(60));

  const validator: FormValidator = new FormValidator(new EmailValidationStrategy());

  // 邮箱验证
  validator.validate('user@example.com');
  validator.validate('invalid-email');

  // 切换到手机号验证
  validator.setStrategy(new PhoneValidationStrategy());
  validator.validate('13812345678');
  validator.validate('12345');

  // 切换到密码验证
  validator.setStrategy(new PasswordValidationStrategy(8, true, true));
  validator.validate('Pass123!');
  validator.validate('weak');

  // ============ 示例2：支付方式 ============
  console.log('\n\n' + '='.repeat(60));
  console.log('\n【示例2：支付策略】');
  console.log('='.repeat(60));

  const paymentInfo: PaymentInfo = {
    amount: 299.99,
    currency: 'CNY',
    description: '购买高级会员'
  };

  // 使用支付宝支付
  const processor: PaymentProcessor = new PaymentProcessor(
    new AlipayStrategy('user@alipay.com')
  );
  processor.processPayment(paymentInfo);

  // 切换到微信支付
  processor.setPaymentMethod(new WechatPayStrategy('wx_openid_123456'));
  processor.processPayment(paymentInfo);

  // 切换到信用卡支付
  processor.setPaymentMethod(
    new CreditCardStrategy('1234567890123456', '123', '12/25')
  );
  processor.processPayment(paymentInfo);

  // 切换到加密货币支付
  processor.setPaymentMethod(
    new CryptoPayStrategy('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC')
  );
  processor.processPayment(paymentInfo);

  // ============ 示例3：排序策略 ============
  console.log('\n\n' + '='.repeat(60));
  console.log('\n【示例3：产品排序策略】');
  console.log('='.repeat(60));

  const products: Product[] = [
    { id: 1, name: 'iPhone 15 Pro', price: 7999, rating: 4.8, sales: 15000 },
    { id: 2, name: 'MacBook Pro', price: 12999, rating: 4.9, sales: 8000 },
    { id: 3, name: 'AirPods Pro', price: 1999, rating: 4.7, sales: 25000 },
    { id: 4, name: 'iPad Air', price: 4799, rating: 4.6, sales: 12000 },
    { id: 5, name: 'Apple Watch', price: 2999, rating: 4.5, sales: 18000 }
  ];

  const sorter: ProductSorter = new ProductSorter(new PriceSortStrategy());

  console.log('\n原始产品列表：');
  sorter.displayProducts(products);

  // 按价格排序（升序）
  let sorted: Product[] = sorter.sort(products, 'asc');
  sorter.displayProducts(sorted);

  // 按评分排序（降序）
  sorter.setSortStrategy(new RatingSortStrategy());
  sorted = sorter.sort(products, 'desc');
  sorter.displayProducts(sorted);

  // 按销量排序（降序）
  sorter.setSortStrategy(new SalesSortStrategy());
  sorted = sorter.sort(products, 'desc');
  sorter.displayProducts(sorted);

  // 综合排序
  sorter.setSortStrategy(new ComprehensiveSortStrategy(0.3, 0.4, 0.3));
  sorted = sorter.sort(products, 'desc');
  sorter.displayProducts(sorted);

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 策略模式的优势：');
  console.log('1. 避免多重条件判断（if-else/switch）');
  console.log('2. 算法可以自由切换和组合');
  console.log('3. 易于扩展新策略，符合开闭原则');
  console.log('4. 每个策略独立封装，便于测试');
  console.log('5. TypeScript接口确保所有策略实现一致');
  console.log('\n💡 策略模式 vs 条件语句：');
  console.log('   - 条件语句：集中在一处，难以扩展');
  console.log('   - 策略模式：分散为独立类，易于维护和扩展');
  console.log('\n🔧 实际应用场景：');
  console.log('   - 表单验证：不同字段使用不同验证规则');
  console.log('   - 支付系统：支持多种支付方式');
  console.log('   - 电商排序：价格、销量、评分等多种排序');
  console.log('   - 压缩算法：ZIP、RAR、7Z等不同压缩策略');
  console.log('   - 路由算法：最短路径、最快路径等');
}

// 运行示例
main();

export {
  Strategy,
  ValidationStrategy,
  EmailValidationStrategy,
  PhoneValidationStrategy,
  PasswordValidationStrategy,
  FormValidator,
  PaymentStrategy,
  AlipayStrategy,
  WechatPayStrategy,
  CreditCardStrategy,
  PaymentProcessor,
  SortStrategy,
  PriceSortStrategy,
  RatingSortStrategy,
  SalesSortStrategy,
  ProductSorter,
  PaymentInfo,
  PaymentResult,
  Product
};
