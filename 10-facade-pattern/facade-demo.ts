/**
 * 外观模式 (Facade Pattern)
 *
 * 核心思想：为复杂子系统提供一个简化的统一接口
 * 优点：简化接口、降低耦合、提高易用性
 * 使用场景：复杂系统简化、SDK封装、第三方库集成、系统分层
 */

// ============ 类型定义 ============

/**
 * 视频格式
 */
type VideoFormat = 'mp4' | 'avi' | 'mkv' | 'mov';

/**
 * 音频格式
 */
type AudioFormat = 'mp3' | 'aac' | 'flac' | 'wav';

/**
 * 视频质量
 */
type VideoQuality = '1080p' | '720p' | '480p' | '360p';

/**
 * 订单状态
 */
type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * 支付方式
 */
type PaymentMethod = 'credit_card' | 'paypal' | 'wechat' | 'alipay';

/**
 * 订单信息
 */
interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

/**
 * 支付信息
 */
interface PaymentInfo {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  timestamp: Date;
}

// ============ 示例1：视频转换系统外观 ============

/**
 * 视频文件类（子系统组件）
 */
class VideoFile {
  constructor(
    public filename: string,
    public format: VideoFormat
  ) {}

  public load(): void {
    console.log(`   📹 加载视频文件: ${this.filename}.${this.format}`);
  }

  public save(filename: string): void {
    console.log(`   💾 保存视频文件: ${filename}`);
  }
}

/**
 * 音频文件类（子系统组件）
 */
class AudioFile {
  constructor(
    public filename: string,
    public format: AudioFormat
  ) {}

  public extract(): void {
    console.log(`   🎵 提取音频轨道: ${this.filename}.${this.format}`);
  }

  public save(filename: string): void {
    console.log(`   💾 保存音频文件: ${filename}`);
  }
}

/**
 * 编解码器（子系统组件）
 */
class Codec {
  public decode(file: VideoFile): void {
    console.log(`   🔓 解码视频: ${file.filename}`);
  }

  public encode(file: VideoFile, format: VideoFormat): void {
    console.log(`   🔐 编码视频为 ${format} 格式`);
  }
}

/**
 * 压缩器（子系统组件）
 */
class Compressor {
  public compress(file: VideoFile, quality: VideoQuality): void {
    console.log(`   🗜️  压缩视频到 ${quality} 质量`);
  }
}

/**
 * 滤镜处理器（子系统组件）
 */
class FilterProcessor {
  public applyFilter(file: VideoFile, filter: string): void {
    console.log(`   🎨 应用滤镜: ${filter}`);
  }

  public adjustBrightness(file: VideoFile, level: number): void {
    console.log(`   ☀️  调整亮度: ${level}%`);
  }

  public adjustContrast(file: VideoFile, level: number): void {
    console.log(`   📊 调整对比度: ${level}%`);
  }
}

/**
 * 字幕处理器（子系统组件）
 */
class SubtitleProcessor {
  public addSubtitle(file: VideoFile, subtitleFile: string): void {
    console.log(`   📝 添加字幕: ${subtitleFile}`);
  }
}

/**
 * 视频转换外观（Facade）
 */
class VideoConverterFacade {
  private codec: Codec;
  private compressor: Compressor;
  private filterProcessor: FilterProcessor;
  private subtitleProcessor: SubtitleProcessor;

  constructor() {
    this.codec = new Codec();
    this.compressor = new Compressor();
    this.filterProcessor = new FilterProcessor();
    this.subtitleProcessor = new SubtitleProcessor();
  }

  /**
   * 简单转换（简化接口）
   */
  public convertVideo(
    sourceFile: string,
    sourceFormat: VideoFormat,
    targetFormat: VideoFormat
  ): void {
    console.log(`\n🎬 开始视频转换`);
    console.log(`   源文件: ${sourceFile}.${sourceFormat}`);
    console.log(`   目标格式: ${targetFormat}\n`);

    const video = new VideoFile(sourceFile, sourceFormat);
    video.load();
    this.codec.decode(video);
    this.codec.encode(video, targetFormat);
    video.save(`${sourceFile}_converted.${targetFormat}`);

    console.log(`\n✅ 视频转换完成\n`);
  }

  /**
   * 高级转换（带压缩和滤镜）
   */
  public convertWithEffects(
    sourceFile: string,
    sourceFormat: VideoFormat,
    targetFormat: VideoFormat,
    quality: VideoQuality,
    filter?: string
  ): void {
    console.log(`\n🎬 开始高级视频转换`);
    console.log(`   源文件: ${sourceFile}.${sourceFormat}`);
    console.log(`   目标格式: ${targetFormat}`);
    console.log(`   质量: ${quality}\n`);

    const video = new VideoFile(sourceFile, sourceFormat);
    video.load();
    this.codec.decode(video);

    if (filter) {
      this.filterProcessor.applyFilter(video, filter);
    }

    this.filterProcessor.adjustBrightness(video, 110);
    this.filterProcessor.adjustContrast(video, 105);
    this.compressor.compress(video, quality);
    this.codec.encode(video, targetFormat);
    video.save(`${sourceFile}_hq.${targetFormat}`);

    console.log(`\n✅ 高级视频转换完成\n`);
  }

  /**
   * 提取音频
   */
  public extractAudio(
    sourceFile: string,
    sourceFormat: VideoFormat,
    audioFormat: AudioFormat
  ): void {
    console.log(`\n🎵 开始提取音频`);
    console.log(`   源文件: ${sourceFile}.${sourceFormat}`);
    console.log(`   音频格式: ${audioFormat}\n`);

    const video = new VideoFile(sourceFile, sourceFormat);
    video.load();
    this.codec.decode(video);

    const audio = new AudioFile(sourceFile, audioFormat);
    audio.extract();
    audio.save(`${sourceFile}_audio.${audioFormat}`);

    console.log(`\n✅ 音频提取完成\n`);
  }
}

// ============ 示例2：电商系统外观 ============

/**
 * 库存系统（子系统）
 */
class InventorySystem {
  private stock: Map<string, number> = new Map([
    ['PROD-001', 100],
    ['PROD-002', 50],
    ['PROD-003', 200]
  ]);

  public checkStock(productId: string, quantity: number): boolean {
    const available = this.stock.get(productId) || 0;
    console.log(`   📦 库存检查: ${productId} (需要: ${quantity}, 可用: ${available})`);
    return available >= quantity;
  }

  public reserveStock(productId: string, quantity: number): void {
    const current = this.stock.get(productId) || 0;
    this.stock.set(productId, current - quantity);
    console.log(`   🔒 库存已预留: ${productId} x${quantity}`);
  }

  public releaseStock(productId: string, quantity: number): void {
    const current = this.stock.get(productId) || 0;
    this.stock.set(productId, current + quantity);
    console.log(`   🔓 库存已释放: ${productId} x${quantity}`);
  }
}

/**
 * 支付系统（子系统）
 */
class PaymentSystem {
  public processPayment(paymentInfo: PaymentInfo): boolean {
    console.log(`   💳 处理支付: ${paymentInfo.method}`);
    console.log(`   金额: ¥${paymentInfo.amount}`);
    console.log(`   订单ID: ${paymentInfo.orderId}`);

    // 模拟支付处理
    const success = Math.random() > 0.1; // 90%成功率
    if (success) {
      console.log(`   ✅ 支付成功`);
    } else {
      console.log(`   ❌ 支付失败`);
    }
    return success;
  }

  public refund(orderId: string, amount: number): void {
    console.log(`   💰 退款处理: ${orderId}, 金额: ¥${amount}`);
  }
}

/**
 * 物流系统（子系统）
 */
class ShippingSystem {
  public createShipment(order: Order): string {
    console.log(`   📮 创建物流订单: ${order.orderId}`);
    const trackingNumber = `TRACK-${Date.now()}`;
    console.log(`   物流单号: ${trackingNumber}`);
    return trackingNumber;
  }

  public scheduleDelivery(trackingNumber: string): void {
    console.log(`   🚚 安排配送: ${trackingNumber}`);
  }
}

/**
 * 通知系统（子系统）
 */
class NotificationSystem {
  public sendOrderConfirmation(userId: string, orderId: string): void {
    console.log(`   📧 发送订单确认邮件给用户 ${userId}`);
  }

  public sendShippingNotification(userId: string, trackingNumber: string): void {
    console.log(`   📧 发送发货通知: ${trackingNumber}`);
  }

  public sendSMS(phone: string, message: string): void {
    console.log(`   📱 发送短信到 ${phone}: ${message}`);
  }
}

/**
 * 订单系统（子系统）
 */
class OrderSystem {
  private orders: Map<string, Order> = new Map();

  public createOrder(order: Order): void {
    this.orders.set(order.orderId, order);
    console.log(`   📝 创建订单: ${order.orderId}`);
  }

  public updateOrderStatus(orderId: string, status: OrderStatus): void {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = status;
      console.log(`   📝 更新订单状态: ${orderId} -> ${status}`);
    }
  }

  public getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }
}

/**
 * 电商系统外观（Facade）
 */
class EcommerceFacade {
  private inventory: InventorySystem;
  private payment: PaymentSystem;
  private shipping: ShippingSystem;
  private notification: NotificationSystem;
  private orderSystem: OrderSystem;

  constructor() {
    this.inventory = new InventorySystem();
    this.payment = new PaymentSystem();
    this.shipping = new ShippingSystem();
    this.notification = new NotificationSystem();
    this.orderSystem = new OrderSystem();
  }

  /**
   * 下单（简化的统一接口）
   */
  public placeOrder(
    userId: string,
    items: OrderItem[],
    paymentMethod: PaymentMethod
  ): { success: boolean; orderId?: string; message: string } {
    console.log(`\n🛒 开始处理订单`);
    console.log(`   用户ID: ${userId}`);
    console.log(`   商品数量: ${items.length}\n`);

    const orderId = `ORD-${Date.now()}`;

    try {
      // 1. 检查库存
      console.log('\n[步骤1] 检查库存');
      for (const item of items) {
        if (!this.inventory.checkStock(item.productId, item.quantity)) {
          throw new Error(`库存不足: ${item.productId}`);
        }
      }

      // 2. 创建订单
      console.log('\n[步骤2] 创建订单');
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order: Order = {
        orderId,
        userId,
        items,
        totalAmount,
        status: 'pending',
        createdAt: new Date()
      };
      this.orderSystem.createOrder(order);

      // 3. 预留库存
      console.log('\n[步骤3] 预留库存');
      for (const item of items) {
        this.inventory.reserveStock(item.productId, item.quantity);
      }

      // 4. 处理支付
      console.log('\n[步骤4] 处理支付');
      const paymentInfo: PaymentInfo = {
        orderId,
        amount: totalAmount,
        method: paymentMethod,
        timestamp: new Date()
      };

      const paymentSuccess = this.payment.processPayment(paymentInfo);
      if (!paymentSuccess) {
        // 支付失败，释放库存
        for (const item of items) {
          this.inventory.releaseStock(item.productId, item.quantity);
        }
        throw new Error('支付失败');
      }

      // 5. 更新订单状态
      console.log('\n[步骤5] 更新订单状态');
      this.orderSystem.updateOrderStatus(orderId, 'processing');

      // 6. 创建物流订单
      console.log('\n[步骤6] 创建物流订单');
      const trackingNumber = this.shipping.createShipment(order);
      this.shipping.scheduleDelivery(trackingNumber);

      // 7. 发送通知
      console.log('\n[步骤7] 发送通知');
      this.notification.sendOrderConfirmation(userId, orderId);
      this.notification.sendShippingNotification(userId, trackingNumber);

      // 8. 完成订单
      this.orderSystem.updateOrderStatus(orderId, 'completed');

      console.log(`\n✅ 订单处理完成\n`);

      return {
        success: true,
        orderId,
        message: '订单创建成功'
      };

    } catch (error) {
      console.log(`\n❌ 订单处理失败: ${error instanceof Error ? error.message : '未知错误'}\n`);
      this.orderSystem.updateOrderStatus(orderId, 'failed');

      return {
        success: false,
        message: error instanceof Error ? error.message : '订单处理失败'
      };
    }
  }

  /**
   * 取消订单
   */
  public cancelOrder(orderId: string): void {
    console.log(`\n❌ 取消订单: ${orderId}\n`);

    const order = this.orderSystem.getOrder(orderId);
    if (!order) {
      console.log('订单不存在');
      return;
    }

    // 释放库存
    console.log('[步骤1] 释放库存');
    for (const item of order.items) {
      this.inventory.releaseStock(item.productId, item.quantity);
    }

    // 退款
    console.log('\n[步骤2] 处理退款');
    this.payment.refund(orderId, order.totalAmount);

    // 更新状态
    console.log('\n[步骤3] 更新订单状态');
    this.orderSystem.updateOrderStatus(orderId, 'failed');

    // 发送通知
    console.log('\n[步骤4] 发送取消通知');
    this.notification.sendSMS('138****5678', `订单${orderId}已取消`);

    console.log(`\n✅ 订单取消完成\n`);
  }
}

// ============ 示例3：智能家居系统外观 ============

/**
 * 灯光系统（子系统）
 */
class LightingSystem {
  public turnOn(): void {
    console.log('   💡 打开灯光');
  }

  public turnOff(): void {
    console.log('   🌙 关闭灯光');
  }

  public dim(level: number): void {
    console.log(`   🔅 调暗灯光到 ${level}%`);
  }
}

/**
 * 空调系统（子系统）
 */
class AirConditioningSystem {
  public turnOn(): void {
    console.log('   ❄️  打开空调');
  }

  public turnOff(): void {
    console.log('   ❄️  关闭空调');
  }

  public setTemperature(temp: number): void {
    console.log(`   🌡️  设置温度: ${temp}°C`);
  }
}

/**
 * 音响系统（子系统）
 */
class AudioSystem {
  public turnOn(): void {
    console.log('   🔊 打开音响');
  }

  public turnOff(): void {
    console.log('   🔇 关闭音响');
  }

  public setVolume(level: number): void {
    console.log(`   🔊 音量: ${level}%`);
  }

  public playMusic(song: string): void {
    console.log(`   🎵 播放音乐: ${song}`);
  }
}

/**
 * 窗帘系统（子系统）
 */
class CurtainSystem {
  public open(): void {
    console.log('   🪟 打开窗帘');
  }

  public close(): void {
    console.log('   🪟 关闭窗帘');
  }
}

/**
 * 智能家居外观（Facade）
 */
class SmartHomeFacade {
  private lights: LightingSystem;
  private ac: AirConditioningSystem;
  private audio: AudioSystem;
  private curtains: CurtainSystem;

  constructor() {
    this.lights = new LightingSystem();
    this.ac = new AirConditioningSystem();
    this.audio = new AudioSystem();
    this.curtains = new CurtainSystem();
  }

  /**
   * 回家模式
   */
  public arriveHome(): void {
    console.log('\n🏡 激活"回家模式"\n');
    this.lights.turnOn();
    this.ac.turnOn();
    this.ac.setTemperature(24);
    this.curtains.open();
    this.audio.turnOn();
    this.audio.setVolume(30);
    this.audio.playMusic('Welcome Home');
    console.log('\n✅ 回家模式已激活\n');
  }

  /**
   * 离家模式
   */
  public leaveHome(): void {
    console.log('\n👋 激活"离家模式"\n');
    this.lights.turnOff();
    this.ac.turnOff();
    this.audio.turnOff();
    this.curtains.close();
    console.log('\n✅ 离家模式已激活\n');
  }

  /**
   * 睡眠模式
   */
  public sleepMode(): void {
    console.log('\n😴 激活"睡眠模式"\n');
    this.lights.dim(10);
    this.ac.setTemperature(26);
    this.audio.setVolume(10);
    this.audio.playMusic('Lullaby');
    this.curtains.close();
    console.log('\n✅ 睡眠模式已激活\n');
  }

  /**
   * 观影模式
   */
  public movieMode(): void {
    console.log('\n🎬 激活"观影模式"\n');
    this.lights.dim(20);
    this.ac.setTemperature(23);
    this.curtains.close();
    this.audio.turnOn();
    this.audio.setVolume(60);
    console.log('\n✅ 观影模式已激活\n');
  }
}

// ============ 使用示例 ============
function main(): void {
  console.log('🎯 外观模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：视频转换 ============
  console.log('\n【示例1：视频转换系统外观】');
  console.log('='.repeat(60));

  const videoConverter = new VideoConverterFacade();

  // 简单转换
  videoConverter.convertVideo('my_video', 'avi', 'mp4');

  // 高级转换
  videoConverter.convertWithEffects('holiday_2024', 'mov', 'mp4', '1080p', 'vintage');

  // 提取音频
  videoConverter.extractAudio('concert', 'mkv', 'mp3');

  // ============ 示例2：电商系统 ============
  console.log('\n' + '='.repeat(60));
  console.log('\n【示例2：电商系统外观】');
  console.log('='.repeat(60));

  const ecommerce = new EcommerceFacade();

  // 下单
  const result = ecommerce.placeOrder(
    'USER-123',
    [
      { productId: 'PROD-001', quantity: 2, price: 99.99 },
      { productId: 'PROD-002', quantity: 1, price: 199.99 }
    ],
    'wechat'
  );

  if (result.success) {
    console.log(`订单号: ${result.orderId}`);

    // 取消订单
    setTimeout(() => {
      ecommerce.cancelOrder(result.orderId!);
    }, 100);
  }

  // ============ 示例3：智能家居 ============
  console.log('\n' + '='.repeat(60));
  console.log('\n【示例3：智能家居系统外观】');
  console.log('='.repeat(60));

  const smartHome = new SmartHomeFacade();

  smartHome.arriveHome();
  smartHome.movieMode();
  smartHome.sleepMode();
  smartHome.leaveHome();

  console.log('='.repeat(60));
  console.log('\n🎯 外观模式的优势：');
  console.log('1. 简化接口：隐藏复杂子系统，提供简单接口');
  console.log('2. 降低耦合：客户端与子系统解耦');
  console.log('3. 提高易用性：一个方法完成多个操作');
  console.log('4. 更好的分层：定义系统的入口点');
  console.log('5. TypeScript类型确保接口使用正确');
  console.log('\n💡 外观模式 vs 适配器模式：');
  console.log('   - 外观模式：简化复杂系统，提供高层接口');
  console.log('   - 适配器模式：转换接口，使不兼容的类协同工作');
  console.log('\n🔧 实际应用场景：');
  console.log('   - SDK封装（微信SDK、支付SDK）');
  console.log('   - 复杂业务流程简化（下单、注册）');
  console.log('   - 第三方库集成（数据库、缓存、消息队列）');
  console.log('   - 系统分层（前端API、后端服务）');
  console.log('   - 智能设备控制（家居、IoT）');
}

// 运行示例
main();

export {
  VideoConverterFacade,
  EcommerceFacade,
  SmartHomeFacade,
  Order,
  OrderItem,
  PaymentInfo,
  VideoFormat,
  AudioFormat,
  VideoQuality,
  PaymentMethod
};
