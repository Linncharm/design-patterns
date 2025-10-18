/**
 * 代理模式 (Proxy Pattern)
 *
 * 核心思想：为其他对象提供一个代理，以控制对这个对象的访问
 * 优点：控制访问、延迟加载、缓存结果、权限验证、日志记录
 * 使用场景：远程代理、虚拟代理、保护代理、缓存代理、智能引用
 */

// ============ 类型定义 ============
interface Image {
  display(): void;
  getSize(): number;
  getPath(): string;
}

interface DatabaseQuery {
  query<T = unknown>(sql: string): Promise<T[]>;
  close(): void;
}

interface ApiService {
  request<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T>;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

interface User {
  id: number;
  username: string;
  role: 'admin' | 'user' | 'guest';
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

// ============ 示例1：虚拟代理 - 图片延迟加载 ============

/**
 * 真实的图片对象
 */
class RealImage implements Image {
  private size: number;

  constructor(private readonly path: string) {
    this.size = 0;
    this.loadFromDisk();
  }

  /**
   * 模拟从磁盘加载图片（耗时操作）
   */
  private loadFromDisk(): void {
    console.log(`📥 正在从磁盘加载图片: ${this.path}`);
    // 模拟加载延迟
    const delay: number = Math.random() * 1000 + 500;

    // 同步模拟延迟（仅用于演示）
    const start: number = Date.now();
    while (Date.now() - start < delay / 100) {
      // 模拟耗时操作
    }

    this.size = Math.floor(Math.random() * 5000) + 1000;
    console.log(`✅ 图片加载完成: ${this.path} (${this.size}KB)\n`);
  }

  public display(): void {
    console.log(`🖼️  显示图片: ${this.path}`);
  }

  public getSize(): number {
    return this.size;
  }

  public getPath(): string {
    return this.path;
  }
}

/**
 * 图片代理 - 实现延迟加载
 */
class ImageProxy implements Image {
  private realImage: RealImage | null = null;

  constructor(private readonly path: string) {
    console.log(`🔗 创建图片代理: ${this.path} (尚未加载实际图片)\n`);
  }

  /**
   * 延迟加载：只有在真正需要时才加载图片
   */
  private loadRealImage(): void {
    if (this.realImage === null) {
      this.realImage = new RealImage(this.path);
    }
  }

  public display(): void {
    this.loadRealImage();
    this.realImage!.display();
  }

  public getSize(): number {
    this.loadRealImage();
    return this.realImage!.getSize();
  }

  public getPath(): string {
    return this.path;
  }
}

// ============ 示例2：保护代理 - API访问控制 ============

/**
 * 真实的API服务
 */
class RealApiService implements ApiService {
  public async request<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    console.log(`📡 发送请求: ${options?.method || 'GET'} ${endpoint}`);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 100));

    // 模拟返回数据
    const mockData = { success: true, endpoint, timestamp: new Date() } as T;
    console.log(`✅ 请求成功\n`);
    return mockData;
  }
}

/**
 * API代理 - 添加权限控制、限流、日志
 */
class ApiServiceProxy implements ApiService {
  private realService: RealApiService;
  private requestCount: Map<string, number[]> = new Map();
  private readonly rateLimitPerMinute: number = 10;

  constructor(private currentUser: User) {
    this.realService = new RealApiService();
    console.log(`🔐 API代理已创建 (用户: ${currentUser.username}, 角色: ${currentUser.role})\n`);
  }

  /**
   * 检查权限
   */
  private checkPermission(endpoint: string): boolean {
    // admin可以访问所有接口
    if (this.currentUser.role === 'admin') {
      return true;
    }

    // guest不能访问需要认证的接口
    if (this.currentUser.role === 'guest' && endpoint.startsWith('/api/private')) {
      return false;
    }

    return true;
  }

  /**
   * 检查速率限制
   */
  private checkRateLimit(endpoint: string): boolean {
    const now: number = Date.now();
    const userKey: string = `${this.currentUser.id}-${endpoint}`;

    if (!this.requestCount.has(userKey)) {
      this.requestCount.set(userKey, []);
    }

    const timestamps: number[] = this.requestCount.get(userKey)!;

    // 移除1分钟前的记录
    const oneMinuteAgo: number = now - 60000;
    const recentRequests: number[] = timestamps.filter(t => t > oneMinuteAgo);

    if (recentRequests.length >= this.rateLimitPerMinute) {
      return false;
    }

    recentRequests.push(now);
    this.requestCount.set(userKey, recentRequests);
    return true;
  }

  /**
   * 代理请求 - 添加权限检查和限流
   */
  public async request<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    console.log(`🔍 [代理] 检查访问权限...`);

    // 权限检查
    if (!this.checkPermission(endpoint)) {
      console.log(`❌ 权限拒绝: ${this.currentUser.username} 无权访问 ${endpoint}\n`);
      throw new Error('Permission denied');
    }
    console.log(`✅ 权限验证通过`);

    // 限流检查
    if (!this.checkRateLimit(endpoint)) {
      console.log(`❌ 请求过于频繁，请稍后再试\n`);
      throw new Error('Rate limit exceeded');
    }
    console.log(`✅ 限流检查通过`);

    // 日志记录
    console.log(`📝 [日志] ${this.currentUser.username} 访问 ${endpoint}`);

    // 转发给真实服务
    return this.realService.request<T>(endpoint, options);
  }
}

// ============ 示例3：缓存代理 - 数据库查询缓存 ============

/**
 * 真实的数据库服务
 */
class RealDatabase implements DatabaseQuery {
  private queryCount: number = 0;

  public async query<T = unknown>(sql: string): Promise<T[]> {
    this.queryCount++;
    console.log(`💾 [数据库] 执行查询 #${this.queryCount}:`);
    console.log(`   SQL: ${sql}`);

    // 模拟数据库查询延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    // 模拟返回结果
    const mockResult: T[] = [
      { id: 1, name: 'Result 1' } as T,
      { id: 2, name: 'Result 2' } as T
    ];

    console.log(`✅ 查询完成，返回 ${mockResult.length} 条记录\n`);
    return mockResult;
  }

  public close(): void {
    console.log(`🔌 数据库连接已关闭`);
  }

  public getQueryCount(): number {
    return this.queryCount;
  }
}

/**
 * 数据库缓存代理
 */
class DatabaseCacheProxy implements DatabaseQuery {
  private realDatabase: RealDatabase;
  private cache: Map<string, CacheEntry<unknown[]>> = new Map();
  private readonly cacheTTL: number = 5000; // 5秒缓存过期

  constructor() {
    this.realDatabase = new RealDatabase();
    console.log(`🗄️  数据库缓存代理已创建\n`);
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(sql: string): string {
    return sql.trim().toLowerCase();
  }

  /**
   * 检查缓存是否有效
   */
  private isCacheValid(entry: CacheEntry<unknown[]>): boolean {
    const now: number = Date.now();
    return now - entry.timestamp < this.cacheTTL;
  }

  /**
   * 带缓存的查询
   */
  public async query<T = unknown>(sql: string): Promise<T[]> {
    const cacheKey: string = this.getCacheKey(sql);

    // 检查缓存
    if (this.cache.has(cacheKey)) {
      const entry: CacheEntry<unknown[]> = this.cache.get(cacheKey)!;

      if (this.isCacheValid(entry)) {
        entry.hits++;
        console.log(`⚡ [缓存命中] 从缓存返回结果 (命中次数: ${entry.hits})`);
        console.log(`   SQL: ${sql}`);
        console.log(`   缓存时间: ${new Date(entry.timestamp).toLocaleTimeString('zh-CN')}\n`);
        return entry.data as T[];
      } else {
        console.log(`⏰ [缓存过期] 缓存已过期，重新查询数据库\n`);
        this.cache.delete(cacheKey);
      }
    }

    // 缓存未命中，查询数据库
    console.log(`🔍 [缓存未命中] 查询数据库...`);
    const result: T[] = await this.realDatabase.query<T>(sql);

    // 存入缓存
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
      hits: 0
    });

    return result;
  }

  public close(): void {
    this.realDatabase.close();
    this.cache.clear();
    console.log(`🗑️  缓存已清空`);
  }

  /**
   * 获取缓存统计
   */
  public getCacheStats(): { size: number; totalHits: number } {
    let totalHits: number = 0;
    this.cache.forEach((entry: CacheEntry<unknown[]>) => {
      totalHits += entry.hits;
    });
    return { size: this.cache.size, totalHits };
  }

  public getRealQueryCount(): number {
    return this.realDatabase.getQueryCount();
  }
}

// ============ 使用示例 ============
async function main(): Promise<void> {
  console.log('🎯 代理模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：虚拟代理 - 延迟加载 ============
  console.log('\n【示例1：虚拟代理 - 图片延迟加载】\n');

  const image1: Image = new ImageProxy('/images/photo1.jpg');
  const image2: Image = new ImageProxy('/images/photo2.jpg');
  const image3: Image = new ImageProxy('/images/photo3.jpg');

  console.log('💡 注意：三个代理已创建，但图片尚未加载\n');
  console.log('现在只显示第一张图片：');
  image1.display();
  console.log(`图片大小: ${image1.getSize()}KB\n`);

  console.log('💡 第二、三张图片不会被加载（节省资源）\n');

  // ============ 示例2：保护代理 - 访问控制 ============
  console.log('='.repeat(60));
  console.log('\n【示例2：保护代理 - API访问控制】\n');

  const adminUser: User = { id: 1, username: 'admin', role: 'admin' };
  const normalUser: User = { id: 2, username: 'john', role: 'user' };
  const guestUser: User = { id: 3, username: 'guest', role: 'guest' };

  // 管理员访问
  console.log('场景1：管理员访问私有接口');
  const adminApi: ApiServiceProxy = new ApiServiceProxy(adminUser);
  try {
    await adminApi.request('/api/private/users');
  } catch (error) {
    if (error instanceof Error) {
      console.log(`错误: ${error.message}`);
    }
  }

  // 普通用户访问
  console.log('场景2：普通用户访问公开接口');
  const userApi: ApiServiceProxy = new ApiServiceProxy(normalUser);
  try {
    await userApi.request('/api/public/products');
  } catch (error) {
    if (error instanceof Error) {
      console.log(`错误: ${error.message}`);
    }
  }

  // 访客访问私有接口（会被拒绝）
  console.log('场景3：访客访问私有接口（应该被拒绝）');
  const guestApi: ApiServiceProxy = new ApiServiceProxy(guestUser);
  try {
    await guestApi.request('/api/private/admin');
  } catch (error) {
    if (error instanceof Error) {
      console.log(`错误: ${error.message}`);
    }
  }

  // ============ 示例3：缓存代理 ============
  console.log('='.repeat(60));
  console.log('\n【示例3：缓存代理 - 数据库查询优化】\n');

  const db: DatabaseCacheProxy = new DatabaseCacheProxy();

  const sql1: string = 'SELECT * FROM users WHERE id = 1';
  const sql2: string = 'SELECT * FROM products LIMIT 10';

  // 第一次查询 - 缓存未命中
  console.log('第1次查询:');
  await db.query(sql1);

  // 第二次相同查询 - 缓存命中
  console.log('第2次查询（相同SQL）:');
  await db.query(sql1);

  // 第三次相同查询 - 缓存命中
  console.log('第3次查询（相同SQL）:');
  await db.query(sql1);

  // 不同的查询 - 缓存未命中
  console.log('第4次查询（不同SQL）:');
  await db.query(sql2);

  // 第二次不同查询 - 缓存命中
  console.log('第5次查询（重复第4次）:');
  await db.query(sql2);

  // 统计信息
  const stats = db.getCacheStats();
  console.log(`\n📊 缓存统计:`);
  console.log(`   缓存项数量: ${stats.size}`);
  console.log(`   缓存命中次数: ${stats.totalHits}`);
  console.log(`   实际数据库查询次数: ${db.getRealQueryCount()}`);
  console.log(`   节省查询次数: ${stats.totalHits}`);

  db.close();

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 代理模式的优势：');
  console.log('1. 控制访问：权限验证、限流保护');
  console.log('2. 延迟加载：需要时才创建真实对象，节省资源');
  console.log('3. 缓存优化：减少重复操作，提升性能');
  console.log('4. 附加功能：日志、监控、统计，不修改原对象');
  console.log('5. 符合开闭原则：通过代理扩展功能');
  console.log('6. TypeScript接口确保代理和真实对象类型一致');
}

// 运行示例
main().catch(console.error);

export {
  Image,
  RealImage,
  ImageProxy,
  ApiService,
  ApiServiceProxy,
  DatabaseQuery,
  RealDatabase,
  DatabaseCacheProxy,
  User
};
