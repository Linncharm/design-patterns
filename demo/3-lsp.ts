/**
 * SOLID 原则 - L: 里氏替换原则 (Liskov Substitution Principle)
 *
 * 核心思想：子类对象应该能够替换其父类对象被使用，而不影响程序的正确性
 * 简单说：子类必须能够完全替代父类，且不改变程序的行为
 * 优点：确保继承的正确性，提高代码的可靠性和可维护性
 */

// ❌ 违反 LSP 的例子：企鹅不会飞，但继承了会飞的鸟类

class Bird {
  fly(): void {
    console.log('🐦 鸟儿在飞翔...');
  }

  eat(): void {
    console.log('🐦 鸟儿在吃食...');
  }
}

class Sparrow extends Bird {
  fly(): void {
    console.log('🐦 麻雀在飞翔...');
  }
}

// 🚨 问题：企鹅不会飞！
class BadPenguin extends Bird {
  fly(): void {
    // 企鹅不会飞，但被迫实现 fly 方法
    throw new Error('企鹅不会飞！');
  }
}

function makeBirdFly(bird: Bird): void {
  bird.fly();  // 期望所有鸟都能飞
}

console.log('━'.repeat(50));
console.log('❌ 违反 LSP 的设计');
console.log('━'.repeat(50));

const sparrow = new Sparrow();
makeBirdFly(sparrow);  // ✅ 正常

const badPenguin = new BadPenguin();
try {
  makeBirdFly(badPenguin);  // ❌ 抛出异常！
} catch (error) {
  if (error instanceof Error) {
    console.log('❌ 错误:', error.message);
  }
}

console.log('\n问题：');
console.log('1. 企鹅继承了 Bird，但不能飞');
console.log('2. 子类 (Penguin) 无法替换父类 (Bird)');
console.log('3. 违反了里氏替换原则');
console.log('4. 使用父类引用时会出现意外行为\n');

// ✅ 遵循 LSP 的例子：重新设计类层次结构

// 抽象：所有鸟类的基类
abstract class Animal {
  abstract eat(): void;
  abstract move(): void;
}

// 会飞的鸟（接口）
interface Flyable {
  fly(): void;
}

// 会游泳的动物（接口）
interface Swimmable {
  swim(): void;
}

// 麻雀：会飞的鸟
class GoodSparrow extends Animal implements Flyable {
  eat(): void {
    console.log('🐦 麻雀在吃食...');
  }

  move(): void {
    this.fly();
  }

  fly(): void {
    console.log('🐦 麻雀在飞翔...');
  }
}

// 企鹅：会游泳的鸟
class GoodPenguin extends Animal implements Swimmable {
  eat(): void {
    console.log('🐧 企鹅在吃鱼...');
  }

  move(): void {
    this.swim();
  }

  swim(): void {
    console.log('🐧 企鹅在游泳...');
  }

  slide(): void {
    console.log('🐧 企鹅在滑行...');
  }
}

// 鸭子：既会飞又会游泳的鸟
class Duck extends Animal implements Flyable, Swimmable {
  eat(): void {
    console.log('🦆 鸭子在吃食...');
  }

  move(): void {
    console.log('🦆 鸭子可以选择飞或游泳');
  }

  fly(): void {
    console.log('🦆 鸭子在飞翔...');
  }

  swim(): void {
    console.log('🦆 鸭子在游泳...');
  }
}

// 处理所有动物的函数
function makeAnimalMove(animal: Animal): void {
  console.log('\n让动物移动:');
  animal.move();
}

// 处理会飞的动物
function makeFly(flyable: Flyable): void {
  console.log('\n让会飞的动物飞翔:');
  flyable.fly();
}

// 处理会游泳的动物
function makeSwim(swimmable: Swimmable): void {
  console.log('\n让会游泳的动物游泳:');
  swimmable.swim();
}

console.log('━'.repeat(50));
console.log('✅ 遵循 LSP 的设计');
console.log('━'.repeat(50));

const goodSparrow = new GoodSparrow();
const goodPenguin = new GoodPenguin();
const duck = new Duck();

// 所有动物都可以移动
makeAnimalMove(goodSparrow);
makeAnimalMove(goodPenguin);
makeAnimalMove(duck);

// 只有会飞的动物才能执行飞行
makeFly(goodSparrow);
makeFly(duck);

// 只有会游泳的动物才能执行游泳
makeSwim(goodPenguin);
makeSwim(duck);

// ✅ 另一个例子：矩形和正方形

console.log('\n━'.repeat(50));
console.log('示例2: 矩形和正方形');
console.log('━'.repeat(50));

// ❌ 违反 LSP：正方形不应该继承矩形
class BadRectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class BadSquare extends BadRectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width;  // 🚨 改变了父类的行为
  }

  setHeight(height: number): void {
    this.width = height;  // 🚨 改变了父类的行为
    this.height = height;
  }
}

function testRectangle(rect: BadRectangle): void {
  rect.setWidth(5);
  rect.setHeight(10);
  const area = rect.getArea();
  console.log(`期望面积: 50, 实际面积: ${area}`);
  if (area !== 50) {
    console.log('❌ 子类无法替换父类！');
  }
}

console.log('\n--- 违反 LSP 的矩形/正方形 ---');
const badRect = new BadRectangle(0, 0);
testRectangle(badRect);  // ✅ 50

const badSquare = new BadSquare(0, 0);
testRectangle(badSquare);  // ❌ 100（预期 50）

// ✅ 遵循 LSP：使用抽象
interface Shape2D {
  getArea(): number;
  getName(): string;
}

class GoodRectangle implements Shape2D {
  constructor(private width: number, private height: number) {}

  getArea(): number {
    return this.width * this.height;
  }

  getName(): string {
    return `矩形 (${this.width} x ${this.height})`;
  }
}

class GoodSquare implements Shape2D {
  constructor(private side: number) {}

  getArea(): number {
    return this.side * this.side;
  }

  getName(): string {
    return `正方形 (边长: ${this.side})`;
  }
}

function calculateArea(shape: Shape2D): void {
  console.log(`${shape.getName()} 的面积: ${shape.getArea()}`);
}

console.log('\n--- 遵循 LSP 的矩形/正方形 ---');
const goodRect = new GoodRectangle(5, 10);
const goodSquare = new GoodSquare(10);

calculateArea(goodRect);   // ✅ 50
calculateArea(goodSquare); // ✅ 100

// ✅ 另一个例子：银行账户

console.log('\n━'.repeat(50));
console.log('示例3: 银行账户');
console.log('━'.repeat(50));

abstract class BankAccount {
  protected balance: number = 0;

  constructor(protected accountNumber: string) {}

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('存款金额必须大于0');
    }
    this.balance += amount;
    console.log(`💰 存款 ¥${amount}，余额: ¥${this.balance}`);
  }

  abstract withdraw(amount: number): void;

  getBalance(): number {
    return this.balance;
  }

  getAccountInfo(): string {
    return `账号: ${this.accountNumber}, 余额: ¥${this.balance}`;
  }
}

// 普通储蓄账户
class SavingsAccount extends BankAccount {
  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('取款金额必须大于0');
    }
    if (amount > this.balance) {
      throw new Error('余额不足');
    }
    this.balance -= amount;
    console.log(`💸 取款 ¥${amount}，余额: ¥${this.balance}`);
  }
}

// 定期存款账户（取款有限制）
class FixedDepositAccount extends BankAccount {
  constructor(
    accountNumber: string,
    private maturityDate: Date
  ) {
    super(accountNumber);
  }

  withdraw(amount: number): void {
    if (new Date() < this.maturityDate) {
      throw new Error('定期存款未到期，无法取款');
    }
    if (amount <= 0) {
      throw new Error('取款金额必须大于0');
    }
    if (amount > this.balance) {
      throw new Error('余额不足');
    }
    this.balance -= amount;
    console.log(`💸 取款 ¥${amount}，余额: ¥${this.balance}`);
  }
}

function performBanking(account: BankAccount): void {
  console.log(`\n处理账户: ${account.getAccountInfo()}`);
  account.deposit(1000);
  try {
    account.withdraw(500);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`⚠️  ${error.message}`);
    }
  }
}

const savings = new SavingsAccount('SA-001');
performBanking(savings);  // ✅ 正常

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 365);  // 一年后到期
const fixedDeposit = new FixedDepositAccount('FD-001', futureDate);
performBanking(fixedDeposit);  // ✅ 抛出合理的异常

console.log('\n━'.repeat(50));
console.log('🎯 里氏替换原则的优势：');
console.log('━'.repeat(50));
console.log('1. 确保继承层次结构的正确性');
console.log('2. 子类可以完全替换父类');
console.log('3. 提高代码的可靠性和健壮性');
console.log('4. 避免运行时错误和意外行为');
console.log('5. 使多态更加安全');

console.log('\n💡 实际应用场景：');
console.log('- 框架设计中的类继承');
console.log('- 多态方法调用');
console.log('- 接口实现的正确性验证');
console.log('- 代码重构时的继承关系调整');

console.log('\n⚠️  违反 LSP 的信号：');
console.log('- 子类抛出父类没有的异常');
console.log('- 子类无法完成父类的功能');
console.log('- 需要 instanceof 检查类型');
console.log('- 重写方法后改变了原有行为');
console.log('━'.repeat(50));

export {
  Animal,
  Flyable,
  Swimmable,
  GoodSparrow,
  GoodPenguin,
  Duck,
  Shape2D,
  GoodRectangle,
  GoodSquare,
  BankAccount,
  SavingsAccount,
  FixedDepositAccount
};
