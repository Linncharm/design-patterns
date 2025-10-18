/**
 * 观察者模式 (Observer Pattern)
 *
 * 核心思想：定义对象间一对多的依赖关系，当一个对象状态改变时，所有依赖它的对象都会得到通知
 * 优点：解耦主题和观察者、支持广播通信、符合开闭原则
 * 使用场景：事件系统、消息订阅、数据绑定、状态监听等
 */

// ============ 类型定义 ============
/**
 * 观察者接口
 */
interface Observer<T = unknown> {
  update(data: T): void;
  getName(): string;
}

/**
 * 主题接口
 */
interface Subject<T = unknown> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(data: T): void;
}

/**
 * 天气数据类型
 */
interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: Date;
}

/**
 * 股票数据类型
 */
interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

/**
 * 订单状态类型
 */
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * 订单数据类型
 */
interface OrderData {
  orderId: string;
  status: OrderStatus;
  statusMessage: string;
  timestamp: Date;
}

// ============ 示例1：天气站（经典观察者模式）============

/**
 * 天气站主题
 */
class WeatherStation implements Subject<WeatherData> {
  private observers: Set<Observer<WeatherData>> = new Set();
  private currentWeather: WeatherData | null = null;

  constructor(private readonly stationName: string) {}

  /**
   * 添加观察者
   */
  public attach(observer: Observer<WeatherData>): void {
    this.observers.add(observer);
    console.log(`✅ ${observer.getName()} 已订阅 ${this.stationName}`);
  }

  /**
   * 移除观察者
   */
  public detach(observer: Observer<WeatherData>): void {
    const deleted: boolean = this.observers.delete(observer);
    if (deleted) {
      console.log(`❌ ${observer.getName()} 已取消订阅 ${this.stationName}`);
    }
  }

  /**
   * 通知所有观察者
   */
  public notify(data: WeatherData): void {
    console.log(`\n📡 ${this.stationName} 正在广播天气更新...`);
    this.observers.forEach((observer: Observer<WeatherData>) => {
      observer.update(data);
    });
  }

  /**
   * 设置天气数据
   */
  public setWeatherData(temperature: number, humidity: number, pressure: number): void {
    this.currentWeather = {
      temperature,
      humidity,
      pressure,
      timestamp: new Date()
    };
    this.notify(this.currentWeather);
  }

  /**
   * 获取当前天气
   */
  public getCurrentWeather(): Readonly<WeatherData> | null {
    return this.currentWeather ? { ...this.currentWeather } : null;
  }

  /**
   * 获取观察者数量
   */
  public getObserverCount(): number {
    return this.observers.size;
  }
}

/**
 * 当前天气显示屏
 */
class CurrentConditionsDisplay implements Observer<WeatherData> {
  constructor(private readonly name: string) {}

  public update(data: WeatherData): void {
    console.log(`\n📱 ${this.name} 收到更新：`);
    console.log(`   温度: ${data.temperature}°C`);
    console.log(`   湿度: ${data.humidity}%`);
    console.log(`   气压: ${data.pressure} hPa`);
  }

  public getName(): string {
    return this.name;
  }
}

/**
 * 统计显示屏（保存历史数据）
 */
class StatisticsDisplay implements Observer<WeatherData> {
  private temperatures: number[] = [];
  private maxTemp: number = -Infinity;
  private minTemp: number = Infinity;

  constructor(private readonly name: string) {}

  public update(data: WeatherData): void {
    this.temperatures.push(data.temperature);
    this.maxTemp = Math.max(this.maxTemp, data.temperature);
    this.minTemp = Math.min(this.minTemp, data.temperature);

    const avgTemp: number = this.temperatures.reduce((sum: number, temp: number) => sum + temp, 0) / this.temperatures.length;

    console.log(`\n📊 ${this.name} 统计：`);
    console.log(`   平均温度: ${avgTemp.toFixed(1)}°C`);
    console.log(`   最高温度: ${this.maxTemp}°C`);
    console.log(`   最低温度: ${this.minTemp}°C`);
    console.log(`   记录次数: ${this.temperatures.length}`);
  }

  public getName(): string {
    return this.name;
  }
}

/**
 * 预警系统
 */
class WeatherAlert implements Observer<WeatherData> {
  constructor(
    private readonly name: string,
    private readonly tempThreshold: { high: number; low: number }
  ) {}

  public update(data: WeatherData): void {
    console.log(`\n⚠️  ${this.name}：`);

    if (data.temperature > this.tempThreshold.high) {
      console.log(`   🔥 高温预警！当前温度 ${data.temperature}°C 超过阈值 ${this.tempThreshold.high}°C`);
    } else if (data.temperature < this.tempThreshold.low) {
      console.log(`   ❄️  低温预警！当前温度 ${data.temperature}°C 低于阈值 ${this.tempThreshold.low}°C`);
    } else {
      console.log(`   ✅ 温度正常 (${data.temperature}°C)`);
    }
  }

  public getName(): string {
    return this.name;
  }
}

// ============ 示例2：股票市场（带事件类型的观察者）============

/**
 * 股票交易所
 */
class StockExchange implements Subject<StockData> {
  private observers: Map<string, Set<Observer<StockData>>> = new Map();
  private stocks: Map<string, StockData> = new Map();

  /**
   * 订阅特定股票
   */
  public attach(observer: Observer<StockData>, symbol?: string): void {
    const key: string = symbol || 'ALL';
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    this.observers.get(key)!.add(observer);
    console.log(`✅ ${observer.getName()} 已订阅 ${symbol ? `股票 ${symbol}` : '所有股票'}`);
  }

  /**
   * 取消订阅
   */
  public detach(observer: Observer<StockData>, symbol?: string): void {
    const key: string = symbol || 'ALL';
    const observerSet: Set<Observer<StockData>> | undefined = this.observers.get(key);
    if (observerSet) {
      observerSet.delete(observer);
      console.log(`❌ ${observer.getName()} 已取消订阅 ${symbol || '所有股票'}`);
    }
  }

  /**
   * 通知观察者
   */
  public notify(data: StockData): void {
    // 通知订阅特定股票的观察者
    const specificObservers: Set<Observer<StockData>> | undefined = this.observers.get(data.symbol);
    specificObservers?.forEach((observer: Observer<StockData>) => {
      observer.update(data);
    });

    // 通知订阅所有股票的观察者
    const allObservers: Set<Observer<StockData>> | undefined = this.observers.get('ALL');
    allObservers?.forEach((observer: Observer<StockData>) => {
      observer.update(data);
    });
  }

  /**
   * 更新股票价格
   */
  public updateStock(symbol: string, price: number): void {
    const previousData: StockData | undefined = this.stocks.get(symbol);
    const previousPrice: number = previousData?.price || price;
    const change: number = price - previousPrice;
    const changePercent: number = previousPrice ? (change / previousPrice) * 100 : 0;

    const stockData: StockData = {
      symbol,
      price,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date()
    };

    this.stocks.set(symbol, stockData);
    console.log(`\n📈 ${symbol} 价格更新: ¥${price}`);
    this.notify(stockData);
  }
}

/**
 * 投资者
 */
class Investor implements Observer<StockData> {
  private portfolio: Map<string, number> = new Map();

  constructor(private readonly name: string) {}

  public update(data: StockData): void {
    const arrow: string = data.change > 0 ? '↑' : data.change < 0 ? '↓' : '→';
    const color: string = data.change > 0 ? '🟢' : data.change < 0 ? '🔴' : '⚪';

    console.log(`\n${color} 投资者 ${this.name} 收到 ${data.symbol} 更新：`);
    console.log(`   当前价格: ¥${data.price}`);
    console.log(`   涨跌: ${arrow} ¥${data.change.toFixed(2)} (${data.changePercent.toFixed(2)}%)`);

    // 持仓提醒
    const shares: number | undefined = this.portfolio.get(data.symbol);
    if (shares) {
      const value: number = shares * data.price;
      console.log(`   持仓: ${shares}股，当前市值: ¥${value.toFixed(2)}`);
    }
  }

  public buyStock(symbol: string, shares: number): void {
    this.portfolio.set(symbol, (this.portfolio.get(symbol) || 0) + shares);
    console.log(`${this.name} 买入 ${symbol} ${shares}股`);
  }

  public getName(): string {
    return this.name;
  }
}

// ============ 示例3：订单跟踪系统 ============

/**
 * 订单跟踪器
 */
class OrderTracker implements Subject<OrderData> {
  private observers: Observer<OrderData>[] = [];
  private orders: Map<string, OrderStatus> = new Map();

  public attach(observer: Observer<OrderData>): void {
    this.observers.push(observer);
    console.log(`✅ ${observer.getName()} 已加入订单通知系统`);
  }

  public detach(observer: Observer<OrderData>): void {
    const index: number = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`❌ ${observer.getName()} 已移除订单通知`);
    }
  }

  public notify(data: OrderData): void {
    this.observers.forEach((observer: Observer<OrderData>) => {
      observer.update(data);
    });
  }

  /**
   * 更新订单状态
   */
  public updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.orders.set(orderId, status);

    const statusMessages: Record<OrderStatus, string> = {
      pending: '订单已创建，等待处理',
      processing: '订单处理中',
      shipped: '订单已发货',
      delivered: '订单已送达',
      cancelled: '订单已取消'
    };

    const orderData: OrderData = {
      orderId,
      status,
      statusMessage: statusMessages[status],
      timestamp: new Date()
    };

    console.log(`\n📦 订单 ${orderId} 状态更新: ${status}`);
    this.notify(orderData);
  }
}

/**
 * 客户通知
 */
class CustomerNotification implements Observer<OrderData> {
  constructor(private readonly customerName: string) {}

  public update(data: OrderData): void {
    const emoji: Record<OrderStatus, string> = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };

    console.log(`\n${emoji[data.status]} 尊敬的 ${this.customerName}：`);
    console.log(`   订单号: ${data.orderId}`);
    console.log(`   状态: ${data.statusMessage}`);
    console.log(`   时间: ${data.timestamp.toLocaleString('zh-CN')}`);
  }

  public getName(): string {
    return `客户-${this.customerName}`;
  }
}

/**
 * 物流系统
 */
class LogisticsSystem implements Observer<OrderData> {
  public update(data: OrderData): void {
    if (data.status === 'processing') {
      console.log(`\n🚚 物流系统：订单 ${data.orderId} 准备打包发货`);
    } else if (data.status === 'shipped') {
      console.log(`\n🚚 物流系统：订单 ${data.orderId} 运输中，预计3天送达`);
    }
  }

  public getName(): string {
    return '物流系统';
  }
}

// ============ 使用示例 ============
function main(): void {
  console.log('🎯 观察者模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：天气站 ============
  console.log('\n【示例1：天气监测系统】\n');

  const weatherStation: WeatherStation = new WeatherStation('北京气象站');

  const currentDisplay: CurrentConditionsDisplay = new CurrentConditionsDisplay('实时显示屏');
  const statsDisplay: StatisticsDisplay = new StatisticsDisplay('统计显示屏');
  const weatherAlert: WeatherAlert = new WeatherAlert('预警系统', { high: 35, low: 0 });

  // 订阅
  weatherStation.attach(currentDisplay);
  weatherStation.attach(statsDisplay);
  weatherStation.attach(weatherAlert);

  console.log(`\n当前订阅者数量: ${weatherStation.getObserverCount()}\n`);

  // 更新天气数据
  weatherStation.setWeatherData(28, 65, 1013);
  weatherStation.setWeatherData(32, 70, 1012);
  weatherStation.setWeatherData(37, 60, 1011); // 触发高温预警

  // 取消订阅
  console.log('\n');
  weatherStation.detach(statsDisplay);
  weatherStation.setWeatherData(25, 55, 1014);

  // ============ 示例2：股票市场 ============
  console.log('\n' + '='.repeat(60));
  console.log('\n【示例2：股票交易系统】\n');

  const stockExchange: StockExchange = new StockExchange();

  const investor1: Investor = new Investor('张三');
  const investor2: Investor = new Investor('李四');

  investor1.buyStock('AAPL', 100);
  investor2.buyStock('GOOGL', 50);

  // 订阅
  stockExchange.attach(investor1, 'AAPL');
  stockExchange.attach(investor2, 'GOOGL');
  stockExchange.attach(investor2); // 李四订阅所有股票

  console.log('');

  // 更新股票价格
  stockExchange.updateStock('AAPL', 150.50);
  stockExchange.updateStock('GOOGL', 2800.75);
  stockExchange.updateStock('AAPL', 152.30); // 张三和李四都会收到

  // ============ 示例3：订单跟踪 ============
  console.log('\n' + '='.repeat(60));
  console.log('\n【示例3：订单跟踪系统】\n');

  const orderTracker: OrderTracker = new OrderTracker();

  const customer: CustomerNotification = new CustomerNotification('王小明');
  const logistics: LogisticsSystem = new LogisticsSystem();

  orderTracker.attach(customer);
  orderTracker.attach(logistics);

  console.log('');

  // 订单状态变化
  orderTracker.updateOrderStatus('ORD-2024-001', 'pending');
  orderTracker.updateOrderStatus('ORD-2024-001', 'processing');
  orderTracker.updateOrderStatus('ORD-2024-001', 'shipped');
  orderTracker.updateOrderStatus('ORD-2024-001', 'delivered');

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 观察者模式的优势：');
  console.log('1. 松耦合：主题和观察者可以独立变化');
  console.log('2. 动态订阅：运行时可以添加/移除观察者');
  console.log('3. 广播通信：一次通知，多个接收者');
  console.log('4. 符合开闭原则：新增观察者无需修改主题');
  console.log('5. TypeScript接口确保类型安全的通信契约');
}

// 运行示例
main();

export {
  Observer,
  Subject,
  WeatherStation,
  CurrentConditionsDisplay,
  StatisticsDisplay,
  WeatherAlert,
  StockExchange,
  Investor,
  OrderTracker,
  CustomerNotification,
  LogisticsSystem,
  WeatherData,
  StockData,
  OrderData,
  OrderStatus
};
