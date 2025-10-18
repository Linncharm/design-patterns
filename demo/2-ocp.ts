/**
 * SOLID 原则 - O: 开闭原则 (Open/Closed Principle)
 *
 * 核心思想：软件实体（类、模块、函数等）应该对扩展开放，对修改封闭
 * 优点：提高代码的可扩展性和可维护性，减少对现有代码的修改
 */

// ❌ 违反 OCP 的例子：每次添加新功能都要修改现有代码

class BadPaymentProcessor {
  processPayment(amount: number, method: string): void {
    if (method === 'credit-card') {
      console.log(`💳 使用信用卡支付 ¥${amount}`);
      console.log('   验证信用卡信息...');
      console.log('   连接银行网关...');
      console.log('   支付成功！');
    } else if (method === 'alipay') {
      console.log(`💰 使用支付宝支付 ¥${amount}`);
      console.log('   跳转到支付宝...');
      console.log('   扫码支付...');
      console.log('   支付成功！');
    } else if (method === 'wechat') {
      console.log(`💚 使用微信支付 ¥${amount}`);
      console.log('   跳转到微信...');
      console.log('   扫码支付...');
      console.log('   支付成功！');
    }
    // 🚨 问题：每次添加新的支付方式，都要修改这个类！
    // 如果要添加 PayPal、Apple Pay 等，都需要修改这里
  }
}

console.log('━'.repeat(50));
console.log('❌ 违反 OCP 的设计');
console.log('━'.repeat(50));

const badProcessor = new BadPaymentProcessor();
badProcessor.processPayment(100, 'credit-card');
console.log();
badProcessor.processPayment(200, 'alipay');

console.log('\n问题：');
console.log('1. 每次添加新支付方式都要修改 processPayment 方法');
console.log('2. 违反了开闭原则');
console.log('3. 容易引入 bug');
console.log('4. 代码复杂度随着支付方式增加而增加\n');

// ✅ 遵循 OCP 的例子：通过抽象和继承实现扩展

// 定义支付方式接口
interface PaymentMethod {
  pay(amount: number): void;
  getName(): string;
}

// 具体支付方式 1: 信用卡
class CreditCardPayment implements PaymentMethod {
  constructor(private cardNumber: string) {}

  pay(amount: number): void {
    console.log(`💳 使用信用卡支付 ¥${amount}`);
    console.log(`   卡号: ${this.maskCardNumber()}`);
    console.log('   验证信用卡信息...');
    console.log('   连接银行网关...');
    console.log('   ✅ 支付成功！');
  }

  getName(): string {
    return '信用卡';
  }

  private maskCardNumber(): string {
    return `****-****-****-${this.cardNumber.slice(-4)}`;
  }
}

// 具体支付方式 2: 支付宝
class AlipayPayment implements PaymentMethod {
  constructor(private account: string) {}

  pay(amount: number): void {
    console.log(`💰 使用支付宝支付 ¥${amount}`);
    console.log(`   账号: ${this.account}`);
    console.log('   跳转到支付宝...');
    console.log('   扫码支付...');
    console.log('   ✅ 支付成功！');
  }

  getName(): string {
    return '支付宝';
  }
}

// 具体支付方式 3: 微信支付
class WechatPayment implements PaymentMethod {
  constructor(private openId: string) {}

  pay(amount: number): void {
    console.log(`💚 使用微信支付 ¥${amount}`);
    console.log(`   OpenID: ${this.openId}`);
    console.log('   跳转到微信...');
    console.log('   扫码支付...');
    console.log('   ✅ 支付成功！');
  }

  getName(): string {
    return '微信支付';
  }
}

// 🆕 扩展：添加新的支付方式（无需修改现有代码）
class PayPalPayment implements PaymentMethod {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`🌐 使用 PayPal 支付 $${(amount / 7).toFixed(2)}`);
    console.log(`   账号: ${this.email}`);
    console.log('   连接到 PayPal...');
    console.log('   ✅ 支付成功！');
  }

  getName(): string {
    return 'PayPal';
  }
}

// 🆕 扩展：虚拟货币支付
class CryptoPayment implements PaymentMethod {
  constructor(private wallet: string, private currency: string) {}

  pay(amount: number): void {
    console.log(`₿ 使用${this.currency}支付`);
    console.log(`   钱包地址: ${this.wallet.slice(0, 10)}...`);
    console.log('   发起区块链交易...');
    console.log('   等待确认...');
    console.log('   ✅ 支付成功！');
  }

  getName(): string {
    return `${this.currency}加密货币`;
  }
}

// 支付处理器（不需要修改，只需要接收不同的支付方式）
class PaymentProcessor {
  processPayment(amount: number, paymentMethod: PaymentMethod): void {
    console.log(`\n开始处理支付 (${paymentMethod.getName()})...`);
    paymentMethod.pay(amount);
    this.logTransaction(amount, paymentMethod.getName());
  }

  private logTransaction(amount: number, method: string): void {
    console.log(`📝 记录交易: ¥${amount} - ${method} - ${new Date().toLocaleString()}`);
  }
}

console.log('\n━'.repeat(50));
console.log('✅ 遵循 OCP 的设计');
console.log('━'.repeat(50));

const processor = new PaymentProcessor();

// 使用不同的支付方式
const creditCard = new CreditCardPayment('1234567812345678');
processor.processPayment(100, creditCard);

const alipay = new AlipayPayment('user@example.com');
processor.processPayment(200, alipay);

const wechat = new WechatPayment('oxxx123456');
processor.processPayment(300, wechat);

// 🆕 添加新的支付方式：PayPal（无需修改 PaymentProcessor）
const paypal = new PayPalPayment('user@paypal.com');
processor.processPayment(150, paypal);

// 🆕 添加新的支付方式：加密货币（无需修改 PaymentProcessor）
const crypto = new CryptoPayment('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'Bitcoin');
processor.processPayment(500, crypto);

// ✅ 另一个例子：形状面积计算

interface Shape {
  calculateArea(): number;
  getName(): string;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }

  getName(): string {
    return '矩形';
  }
}

class Circle implements Shape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getName(): string {
    return '圆形';
  }
}

class Triangle implements Shape {
  constructor(private base: number, private height: number) {}

  calculateArea(): number {
    return (this.base * this.height) / 2;
  }

  getName(): string {
    return '三角形';
  }
}

// 面积计算器（对扩展开放，对修改封闭）
class AreaCalculator {
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }

  printAreas(shapes: Shape[]): void {
    console.log('\n━'.repeat(50));
    console.log('形状面积计算:');
    console.log('━'.repeat(50));
    shapes.forEach(shape => {
      console.log(`${shape.getName()}: ${shape.calculateArea().toFixed(2)} 平方单位`);
    });
    console.log(`总面积: ${this.calculateTotalArea(shapes).toFixed(2)} 平方单位`);
  }
}

const shapes: Shape[] = [
  new Rectangle(5, 10),
  new Circle(7),
  new Triangle(6, 8)
];

const calculator = new AreaCalculator();
calculator.printAreas(shapes);

console.log('\n━'.repeat(50));
console.log('🎯 开闭原则的优势：');
console.log('━'.repeat(50));
console.log('1. 添加新功能无需修改现有代码');
console.log('2. 通过抽象（接口/抽象类）实现扩展');
console.log('3. 降低引入 bug 的风险');
console.log('4. 提高代码的可维护性');
console.log('5. 符合"对扩展开放，对修改封闭"原则');

console.log('\n💡 实际应用场景：');
console.log('- 插件系统');
console.log('- 策略模式、工厂模式');
console.log('- 中间件系统');
console.log('- 支付系统、日志系统');
console.log('━'.repeat(50));

export {
  PaymentMethod,
  CreditCardPayment,
  AlipayPayment,
  WechatPayment,
  PayPalPayment,
  PaymentProcessor,
  Shape,
  Rectangle,
  Circle,
  Triangle,
  AreaCalculator
};
