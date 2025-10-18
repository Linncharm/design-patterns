/**
 * 单例模式 (Singleton Pattern)
 *
 * 核心思想：确保一个类只有一个实例，并提供全局访问点
 * 优点：节省内存、保证全局唯一性、延迟初始化
 * 使用场景：数据库连接、配置管理、日志记录、缓存等
 */

// ============ 类型定义 ============
interface LogLevel {
  DEBUG: number;
  INFO: number;
  WARN: number;
  ERROR: number;
}

interface LogEntry {
  timestamp: Date;
  level: keyof LogLevel;
  message: string;
  meta?: Record<string, unknown>;
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface ConnectionStatus {
  isConnected: boolean;
  connectionTime?: Date;
  lastQueryTime?: Date;
}

// ============ 示例1：日志管理器（经典单例）============
class Logger {
  private static instance: Logger | null = null;
  private logs: LogEntry[] = [];
  private readonly LOG_LEVEL: LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };
  private currentLevel: number = this.LOG_LEVEL.INFO;

  // 私有构造函数，防止外部实例化
  private constructor() {
    console.log('📝 日志管理器初始化...\n');
  }

  /**
   * 获取单例实例
   * @returns Logger实例
   */
  public static getInstance(): Logger {
    if (Logger.instance === null) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * 设置日志级别
   * @param level - 日志级别
   */
  public setLevel(level: keyof LogLevel): void {
    this.currentLevel = this.LOG_LEVEL[level];
    console.log(`日志级别已设置为: ${level}`);
  }

  /**
   * 记录日志
   * @param level - 日志级别
   * @param message - 日志消息
   * @param meta - 额外的元数据
   */
  private log(level: keyof LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (this.LOG_LEVEL[level] >= this.currentLevel) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        meta
      };
      this.logs.push(entry);

      const timeStr: string = entry.timestamp.toLocaleTimeString('zh-CN');
      const metaStr: string = meta ? ` | ${JSON.stringify(meta)}` : '';
      console.log(`[${timeStr}] [${level}] ${message}${metaStr}`);
    }
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.log('DEBUG', message, meta);
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.log('INFO', message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.log('WARN', message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.log('ERROR', message, meta);
  }

  /**
   * 获取所有日志
   * @returns 日志数组
   */
  public getLogs(): ReadonlyArray<LogEntry> {
    return [...this.logs];
  }

  /**
   * 清空日志
   */
  public clear(): void {
    this.logs = [];
    console.log('日志已清空\n');
  }

  /**
   * 获取日志统计
   */
  public getStats(): Record<keyof LogLevel, number> {
    const stats: Record<string, number> = {
      DEBUG: 0,
      INFO: 0,
      WARN: 0,
      ERROR: 0
    };

    this.logs.forEach((log: LogEntry) => {
      stats[log.level]++;
    });

    return stats as Record<keyof LogLevel, number>;
  }
}

// ============ 示例2：数据库连接（带连接状态的单例）============
class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private config: DatabaseConfig | null = null;
  private status: ConnectionStatus = { isConnected: false };
  private queryCount: number = 0;

  // 私有构造函数
  private constructor() {
    console.log('🗄️  数据库连接管理器初始化...\n');
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): DatabaseConnection {
    if (DatabaseConnection.instance === null) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * 连接数据库
   * @param config - 数据库配置
   */
  public connect(config: DatabaseConfig): void {
    if (this.status.isConnected) {
      console.log('⚠️  数据库已连接，无需重复连接\n');
      return;
    }

    this.config = config;
    // 模拟连接过程
    console.log(`正在连接到数据库...`);
    console.log(`Host: ${config.host}:${config.port}`);
    console.log(`Database: ${config.database}`);
    console.log(`User: ${config.username}`);

    this.status = {
      isConnected: true,
      connectionTime: new Date()
    };

    console.log('✅ 数据库连接成功！\n');
  }

  /**
   * 执行查询
   * @param sql - SQL语句
   * @returns 模拟的查询结果
   */
  public query<T = unknown>(sql: string): T[] {
    if (!this.status.isConnected) {
      throw new Error('数据库未连接，请先调用 connect() 方法');
    }

    this.queryCount++;
    this.status.lastQueryTime = new Date();

    console.log(`执行查询 #${this.queryCount}: ${sql}`);
    console.log(`查询时间: ${this.status.lastQueryTime.toLocaleTimeString('zh-CN')}`);

    // 模拟返回结果
    return [] as T[];
  }

  /**
   * 获取连接状态
   */
  public getStatus(): Readonly<ConnectionStatus> {
    return { ...this.status };
  }

  /**
   * 获取查询统计
   */
  public getQueryCount(): number {
    return this.queryCount;
  }

  /**
   * 断开连接
   */
  public disconnect(): void {
    if (!this.status.isConnected) {
      console.log('数据库未连接\n');
      return;
    }

    console.log('正在断开数据库连接...');
    this.status = { isConnected: false };
    console.log('✅ 数据库已断开\n');
  }
}

// ============ 示例3：配置管理器（泛型单例）============
class ConfigManager<T extends Record<string, unknown>> {
  private static instance: ConfigManager<any> | null = null;
  private config: T | null = null;

  private constructor() {
    console.log('⚙️  配置管理器初始化...\n');
  }

  /**
   * 获取单例实例
   */
  public static getInstance<T extends Record<string, unknown>>(): ConfigManager<T> {
    if (ConfigManager.instance === null) {
      ConfigManager.instance = new ConfigManager<T>();
    }
    return ConfigManager.instance;
  }

  /**
   * 加载配置
   * @param config - 配置对象
   */
  public load(config: T): void {
    this.config = { ...config };
    console.log('配置已加载：');
    console.log(JSON.stringify(config, null, 2));
    console.log('');
  }

  /**
   * 获取配置项
   * @param key - 配置键
   * @returns 配置值
   */
  public get<K extends keyof T>(key: K): T[K] | undefined {
    return this.config?.[key];
  }

  /**
   * 设置配置项
   * @param key - 配置键
   * @param value - 配置值
   */
  public set<K extends keyof T>(key: K, value: T[K]): void {
    if (this.config) {
      this.config[key] = value;
      console.log(`配置项 "${String(key)}" 已更新为: ${JSON.stringify(value)}\n`);
    }
  }

  /**
   * 获取所有配置
   */
  public getAll(): Readonly<T> | null {
    return this.config ? { ...this.config } : null;
  }
}

// ============ 应用配置类型 ============
interface AppConfig {
  appName: string;
  version: string;
  port: number;
  isDevelopment: boolean;
  features: {
    enableCache: boolean;
    enableLogging: boolean;
  };
}

// ============ 使用示例 ============
function main(): void {
  console.log('🎯 单例模式示例\n');
  console.log('='.repeat(50));
  console.log('\n【示例1：日志管理器】\n');

  // 获取日志管理器实例
  const logger1: Logger = Logger.getInstance();
  const logger2: Logger = Logger.getInstance();

  // 验证是同一个实例
  console.log(`logger1 === logger2: ${logger1 === logger2}`);
  console.log('（两次获取的是同一个实例）\n');

  // 使用日志管理器
  logger1.info('应用启动');
  logger1.debug('这条DEBUG信息不会显示（当前级别是INFO）');
  logger1.warn('这是一个警告', { userId: 123 });
  logger2.error('发生错误', { code: 500, message: 'Internal Server Error' });

  // 查看统计
  console.log('\n日志统计：', logger1.getStats());
  console.log('');

  console.log('='.repeat(50));
  console.log('\n【示例2：数据库连接】\n');

  // 获取数据库连接实例
  const db1: DatabaseConnection = DatabaseConnection.getInstance();
  const db2: DatabaseConnection = DatabaseConnection.getInstance();

  console.log(`db1 === db2: ${db1 === db2}`);
  console.log('（确保全局只有一个数据库连接）\n');

  // 连接数据库
  const dbConfig: DatabaseConfig = {
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: '******',
    database: 'myapp'
  };

  db1.connect(dbConfig);

  // 执行查询
  db1.query('SELECT * FROM users WHERE id = 1');
  db2.query('SELECT * FROM products LIMIT 10');

  console.log(`\n总查询次数: ${db1.getQueryCount()}\n`);

  console.log('='.repeat(50));
  console.log('\n【示例3：配置管理器】\n');

  // 获取配置管理器实例
  const config: ConfigManager<AppConfig> = ConfigManager.getInstance<AppConfig>();

  // 加载配置
  config.load({
    appName: '我的应用',
    version: '1.0.0',
    port: 3000,
    isDevelopment: true,
    features: {
      enableCache: true,
      enableLogging: true
    }
  });

  // 读取配置
  const appName: string | undefined = config.get('appName');
  const port: number | undefined = config.get('port');
  console.log(`应用名称: ${appName}`);
  console.log(`端口: ${port}\n`);

  // 更新配置
  config.set('port', 8080);

  console.log('='.repeat(50));
  console.log('\n🎯 单例模式的优势：');
  console.log('1. 全局唯一实例，节省内存资源');
  console.log('2. 提供全局访问点，方便状态共享');
  console.log('3. 延迟初始化，按需创建实例');
  console.log('4. TypeScript私有构造函数确保单例约束');
  console.log('5. 适合管理全局状态（日志、配置、连接等）');
}

// 运行示例
main();

export { Logger, DatabaseConnection, ConfigManager, LogEntry, DatabaseConfig, AppConfig };
