/**
 * 工厂模式 (Factory Pattern)
 *
 * 核心思想：定义一个创建对象的接口，让子类决定实例化哪个类
 * 优点：解耦对象的创建和使用，便于扩展新的产品类型
 * 使用场景：当需要根据不同条件创建不同对象时
 */

// ============ 类型定义 ============
type CoffeeType = 'espresso' | 'latte' | 'cappuccino' | 'americano' | '浓缩' | '拿铁' | '卡布奇诺' | '美式';

interface MenuItem {
  name: string;
  price: number;
}

// ============ 抽象产品类 ============
abstract class Coffee {
  public readonly type: string;
  public readonly price: number;

  constructor(type: string, price: number) {
    this.type = type;
    this.price = price;
  }

  abstract prepare(): void;
  abstract brew(): void;

  serve(): void {
    console.log(`${this.type} 已准备好，请享用！\n`);
  }
}

// ============ 具体产品类 ============
class Espresso extends Coffee {
  constructor() {
    super('浓缩咖啡', 25);
  }

  prepare(): void {
    console.log(`选择高品质咖啡豆...`);
    console.log(`研磨咖啡豆至细粉状...`);
  }

  brew(): void {
    console.log(`使用高压萃取浓缩咖啡...`);
    console.log(`萃取时间：25-30秒`);
  }
}

class Latte extends Coffee {
  private milkTemperature: number = 65;

  constructor() {
    super('拿铁咖啡', 32);
  }

  prepare(): void {
    console.log(`准备咖啡豆和新鲜牛奶...`);
    console.log(`加热牛奶至${this.milkTemperature}°C...`);
  }

  brew(): void {
    console.log(`萃取双份浓缩咖啡...`);
    console.log(`倒入蒸汽牛奶...`);
    console.log(`制作拉花艺术 ☕`);
  }
}

class Cappuccino extends Coffee {
  private readonly ratio: string = '1/3浓缩咖啡、1/3热牛奶、1/3奶泡';

  constructor() {
    super('卡布奇诺', 30);
  }

  prepare(): void {
    console.log(`准备咖啡豆和牛奶...`);
    console.log(`打发牛奶产生丰富奶泡...`);
  }

  brew(): void {
    console.log(`萃取浓缩咖啡...`);
    console.log(`加入${this.ratio}...`);
    console.log(`撒上可可粉 ✨`);
  }
}

class Americano extends Coffee {
  private waterRatio: number = 2;

  constructor() {
    super('美式咖啡', 22);
  }

  prepare(): void {
    console.log(`准备咖啡豆和热水...`);
  }

  brew(): void {
    console.log(`萃取双份浓缩咖啡...`);
    console.log(`加入${this.waterRatio}倍热水稀释...`);
  }
}

// ============ 工厂类 ============
class CoffeeFactory {
  /**
   * 静态工厂方法：根据类型创建咖啡对象
   * @param type - 咖啡类型
   * @returns Coffee实例
   * @throws Error - 当咖啡类型不存在时抛出错误
   */
  static createCoffee(type: CoffeeType): Coffee {
    console.log(`\n======= 咖啡工厂 =======`);
    console.log(`顾客点单：${type}\n`);

    const typeMap: Record<string, () => Coffee> = {
      'espresso': () => new Espresso(),
      '浓缩': () => new Espresso(),
      'latte': () => new Latte(),
      '拿铁': () => new Latte(),
      'cappuccino': () => new Cappuccino(),
      '卡布奇诺': () => new Cappuccino(),
      'americano': () => new Americano(),
      '美式': () => new Americano(),
    };

    const creator = typeMap[type.toLowerCase()];

    if (!creator) {
      throw new Error(`抱歉，我们不提供 ${type} 这种咖啡`);
    }

    return creator();
  }

  /**
   * 获取菜单列表
   * @returns 菜单项数组
   */
  static getMenu(): MenuItem[] {
    return [
      { name: 'Espresso (浓缩)', price: 25 },
      { name: 'Latte (拿铁)', price: 32 },
      { name: 'Cappuccino (卡布奇诺)', price: 30 },
      { name: 'Americano (美式)', price: 22 }
    ];
  }
}

// ============ 使用示例 ============
function main(): void {
  console.log('☕ 欢迎来到咖啡工厂！\n');
  console.log('今日菜单：');
  CoffeeFactory.getMenu().forEach((item: MenuItem) => {
    console.log(`  - ${item.name}: ¥${item.price}`);
  });

  // 顾客1：点一杯拿铁
  try {
    const latte: Coffee = CoffeeFactory.createCoffee('拿铁');
    latte.prepare();
    latte.brew();
    latte.serve();
    console.log(`价格：¥${latte.price}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  // 顾客2：点一杯美式
  try {
    const americano: Coffee = CoffeeFactory.createCoffee('americano');
    americano.prepare();
    americano.brew();
    americano.serve();
    console.log(`价格：¥${americano.price}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  // 顾客3：点一杯不存在的咖啡
  try {
    const unknown: Coffee = CoffeeFactory.createCoffee('摩卡' as CoffeeType);
    unknown.prepare();
    unknown.brew();
    unknown.serve();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ ${error.message}\n`);
    }
  }

  console.log('='.repeat(40));
  console.log('🎯 工厂模式的优势：');
  console.log('1. 客户端不需要知道具体咖啡类的实现细节');
  console.log('2. 只需告诉工厂需要什么类型的咖啡');
  console.log('3. 新增咖啡类型时，只需修改工厂类');
  console.log('4. 符合开闭原则（对扩展开放，对修改关闭）');
  console.log('5. TypeScript类型系统提供编译时类型检查');
}

// 运行示例
main();

export { CoffeeFactory, Coffee, Espresso, Latte, Cappuccino, Americano, CoffeeType, MenuItem };
