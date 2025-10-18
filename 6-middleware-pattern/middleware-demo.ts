/**
 * 中间件模式 (Middleware Pattern)
 *
 * 核心思想：将请求处理过程分解为一系列可组合的中间件函数
 * 优点：职责分离、可复用、可组合、易于测试和维护
 * 使用场景：Web框架（Express/Koa）、插件系统、请求处理管道、事件处理
 */

// ============ 类型定义 ============

/**
 * 中间件函数类型
 */
type Middleware<T = any> = (
  context: T,
  next: () => Promise<void>
) => Promise<void> | void;

/**
 * HTTP请求上下文
 */
interface HttpContext {
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: unknown;
    query?: Record<string, string>;
    params?: Record<string, string>;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body?: unknown;
  };
  state: Record<string, unknown>; // 共享状态
  startTime?: number;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

/**
 * 数据处理上下文
 */
interface DataProcessContext {
  data: unknown;
  metadata: Record<string, unknown>;
  errors: string[];
  isValid: boolean;
}

/**
 * 事件上下文
 */
interface EventContext {
  type: string;
  payload: unknown;
  timestamp: number;
  propagationStopped: boolean;
}

// ============ 核心中间件引擎 ============

/**
 * 通用中间件管道
 */
class MiddlewarePipeline<T = any> {
  private middlewares: Middleware<T>[] = [];

  /**
   * 注册中间件
   */
  public use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * 执行中间件链
   */
  public async execute(context: T): Promise<void> {
    let index: number = 0;

    const dispatch = async (): Promise<void> => {
      if (index >= this.middlewares.length) {
        return;
      }

      const middleware: Middleware<T> = this.middlewares[index++];
      await middleware(context, dispatch);
    };

    await dispatch();
  }

  /**
   * 获取已注册的中间件数量
   */
  public getMiddlewareCount(): number {
    return this.middlewares.length;
  }
}

// ============ 示例1：Express风格的HTTP中间件 ============

/**
 * 日志中间件
 */
const loggerMiddleware: Middleware<HttpContext> = async (ctx, next) => {
  const start: number = Date.now();
  const { method, url } = ctx.request;

  console.log(`➡️  [${method}] ${url} - 请求开始`);

  await next();

  const duration: number = Date.now() - start;
  console.log(`⬅️  [${method}] ${url} - ${ctx.response.status} (${duration}ms)`);
};

/**
 * 认证中间件
 */
const authMiddleware: Middleware<HttpContext> = async (ctx, next) => {
  console.log(`🔐 [认证] 检查身份验证...`);

  const token: string | undefined = ctx.request.headers['authorization'];

  if (!token) {
    console.log(`❌ [认证] 未提供认证令牌`);
    ctx.response.status = 401;
    ctx.response.body = { error: 'Unauthorized' };
    return; // 不调用next()，中止后续中间件
  }

  // 模拟token验证
  if (token === 'Bearer valid-token') {
    console.log(`✅ [认证] 认证成功`);
    ctx.user = {
      id: 1,
      username: 'john',
      role: 'admin'
    };
    await next();
  } else {
    console.log(`❌ [认证] 无效的令牌`);
    ctx.response.status = 401;
    ctx.response.body = { error: 'Invalid token' };
  }
};

/**
 * CORS中间件
 */
const corsMiddleware: Middleware<HttpContext> = async (ctx, next) => {
  console.log(`🌍 [CORS] 设置跨域头...`);

  ctx.response.headers['Access-Control-Allow-Origin'] = '*';
  ctx.response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
  ctx.response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

  await next();
};

/**
 * 错误处理中间件
 */
const errorHandlerMiddleware: Middleware<HttpContext> = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(`💥 [错误处理] 捕获到错误: ${error instanceof Error ? error.message : '未知错误'}`);
    ctx.response.status = 500;
    ctx.response.body = {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : '未知错误'
    };
  }
};

/**
 * 响应时间中间件
 */
const responseTimeMiddleware: Middleware<HttpContext> = async (ctx, next) => {
  ctx.startTime = Date.now();
  await next();
  const responseTime: number = Date.now() - ctx.startTime!;
  ctx.response.headers['X-Response-Time'] = `${responseTime}ms`;
  console.log(`⏱️  [性能] 响应时间: ${responseTime}ms`);
};

/**
 * 请求体解析中间件
 */
const bodyParserMiddleware: Middleware<HttpContext> = async (ctx, next) => {
  if (ctx.request.headers['content-type'] === 'application/json') {
    console.log(`📦 [Body Parser] 解析JSON请求体`);
    // 模拟解析
    ctx.request.body = { parsed: true };
  }
  await next();
};

// ============ 示例2：数据处理管道 ============

/**
 * 数据验证中间件
 */
const validateDataMiddleware: Middleware<DataProcessContext> = async (ctx, next) => {
  console.log(`✅ [验证] 开始数据验证...`);

  if (!ctx.data) {
    ctx.errors.push('数据不能为空');
    ctx.isValid = false;
    return;
  }

  if (typeof ctx.data !== 'object') {
    ctx.errors.push('数据必须是对象类型');
    ctx.isValid = false;
    return;
  }

  console.log(`✅ [验证] 数据验证通过`);
  await next();
};

/**
 * 数据清洗中间件
 */
const sanitizeDataMiddleware: Middleware<DataProcessContext> = async (ctx, next) => {
  console.log(`🧹 [清洗] 清洗数据...`);

  if (typeof ctx.data === 'object' && ctx.data !== null) {
    const data = ctx.data as Record<string, unknown>;
    // 移除空值
    Object.keys(data).forEach(key => {
      if (data[key] === null || data[key] === undefined || data[key] === '') {
        delete data[key];
      }
    });
    console.log(`🧹 [清洗] 已移除空值字段`);
  }

  await next();
};

/**
 * 数据转换中间件
 */
const transformDataMiddleware: Middleware<DataProcessContext> = async (ctx, next) => {
  console.log(`🔄 [转换] 转换数据格式...`);

  if (typeof ctx.data === 'object' && ctx.data !== null) {
    const data = ctx.data as Record<string, unknown>;
    // 将所有字符串转为大写（示例）
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        data[key] = (data[key] as string).toUpperCase();
      }
    });
    console.log(`🔄 [转换] 数据已转换`);
  }

  await next();
};

/**
 * 数据加密中间件
 */
const encryptDataMiddleware: Middleware<DataProcessContext> = async (ctx, next) => {
  console.log(`🔐 [加密] 加密敏感数据...`);

  if (typeof ctx.data === 'object' && ctx.data !== null) {
    const data = ctx.data as Record<string, unknown>;
    // 加密密码字段（示例）
    if (data.password) {
      data.password = `***ENCRYPTED(${data.password})***`;
      console.log(`🔐 [加密] 密码已加密`);
    }
  }

  ctx.metadata.encrypted = true;
  await next();
};

/**
 * 数据持久化中间件
 */
const saveDataMiddleware: Middleware<DataProcessContext> = async (ctx, next) => {
  if (!ctx.isValid) {
    console.log(`❌ [保存] 数据无效，跳过保存`);
    return;
  }

  console.log(`💾 [保存] 保存数据到数据库...`);
  console.log(`   数据:`, JSON.stringify(ctx.data, null, 2));
  console.log(`   元数据:`, JSON.stringify(ctx.metadata, null, 2));
  console.log(`✅ [保存] 数据已保存`);

  await next();
};

// ============ 示例3：事件处理中间件 ============

/**
 * 事件日志中间件
 */
const eventLoggerMiddleware: Middleware<EventContext> = async (ctx, next) => {
  console.log(`📝 [事件日志] 事件类型: ${ctx.type}`);
  console.log(`   时间戳: ${new Date(ctx.timestamp).toISOString()}`);
  console.log(`   载荷:`, JSON.stringify(ctx.payload, null, 2));
  await next();
};

/**
 * 事件过滤中间件
 */
const eventFilterMiddleware: Middleware<EventContext> = async (ctx, next) => {
  const allowedTypes: string[] = ['user.login', 'user.logout', 'order.created'];

  if (!allowedTypes.includes(ctx.type)) {
    console.log(`🚫 [过滤] 事件类型 "${ctx.type}" 不在白名单中，已拦截`);
    ctx.propagationStopped = true;
    return;
  }

  console.log(`✅ [过滤] 事件类型验证通过`);
  await next();
};

/**
 * 事件转换中间件
 */
const eventTransformMiddleware: Middleware<EventContext> = async (ctx, next) => {
  console.log(`🔄 [转换] 标准化事件格式...`);

  const payload = ctx.payload as Record<string, unknown>;
  payload.processedAt = new Date().toISOString();
  payload.version = '1.0';

  await next();
};

/**
 * 事件分发中间件
 */
const eventDispatchMiddleware: Middleware<EventContext> = async (ctx, next) => {
  if (ctx.propagationStopped) {
    console.log(`⚠️  [分发] 事件传播已停止`);
    return;
  }

  console.log(`📢 [分发] 分发事件到订阅者...`);
  console.log(`   事件: ${ctx.type}`);
  console.log(`   订阅者: [EmailService, NotificationService, AnalyticsService]`);

  await next();
};

// ============ 使用示例 ============
async function main(): Promise<void> {
  console.log('🎯 中间件模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：HTTP请求处理 ============
  console.log('\n【示例1：HTTP请求处理中间件链】\n');

  const httpPipeline = new MiddlewarePipeline<HttpContext>();

  // 注册中间件（注意顺序很重要！）
  httpPipeline
    .use(errorHandlerMiddleware)     // 1. 错误处理（最外层）
    .use(loggerMiddleware)            // 2. 日志记录
    .use(responseTimeMiddleware)      // 3. 响应时间统计
    .use(corsMiddleware)              // 4. CORS处理
    .use(bodyParserMiddleware)        // 5. 请求体解析
    .use(authMiddleware);             // 6. 身份认证

  console.log(`已注册 ${httpPipeline.getMiddlewareCount()} 个中间件\n`);

  // 场景1：成功的请求
  console.log('场景1：正常的认证请求');
  console.log('-'.repeat(60));
  const ctx1: HttpContext = {
    request: {
      method: 'GET',
      url: '/api/users',
      headers: {
        'authorization': 'Bearer valid-token',
        'content-type': 'application/json'
      }
    },
    response: {
      status: 200,
      headers: {}
    },
    state: {}
  };

  await httpPipeline.execute(ctx1);
  console.log(`\n最终响应状态: ${ctx1.response.status}`);
  console.log(`认证用户:`, ctx1.user);

  // 场景2：未认证的请求
  console.log('\n' + '-'.repeat(60));
  console.log('场景2：未提供认证信息的请求');
  console.log('-'.repeat(60));
  const ctx2: HttpContext = {
    request: {
      method: 'POST',
      url: '/api/orders',
      headers: {}
    },
    response: {
      status: 200,
      headers: {}
    },
    state: {}
  };

  await httpPipeline.execute(ctx2);
  console.log(`\n最终响应状态: ${ctx2.response.status}`);
  console.log(`响应体:`, ctx2.response.body);

  // ============ 示例2：数据处理管道 ============
  console.log('\n' + '='.repeat(60));
  console.log('\n【示例2：数据处理管道】\n');

  const dataPipeline = new MiddlewarePipeline<DataProcessContext>();

  dataPipeline
    .use(validateDataMiddleware)
    .use(sanitizeDataMiddleware)
    .use(transformDataMiddleware)
    .use(encryptDataMiddleware)
    .use(saveDataMiddleware);

  console.log(`已注册 ${dataPipeline.getMiddlewareCount()} 个中间件\n`);

  console.log('场景：处理用户注册数据');
  console.log('-'.repeat(60));
  const dataCtx: DataProcessContext = {
    data: {
      username: 'john_doe',
      email: '',  // 空值，会被清洗
      password: 'secret123',
      age: null   // 空值，会被清洗
    },
    metadata: {},
    errors: [],
    isValid: true
  };

  await dataPipeline.execute(dataCtx);

  if (dataCtx.errors.length > 0) {
    console.log(`\n验证错误:`, dataCtx.errors);
  }

  // ============ 示例3：事件处理 ============
  console.log('\n' + '='.repeat(60));
  console.log('\n【示例3：事件处理中间件】\n');

  const eventPipeline = new MiddlewarePipeline<EventContext>();

  eventPipeline
    .use(eventLoggerMiddleware)
    .use(eventFilterMiddleware)
    .use(eventTransformMiddleware)
    .use(eventDispatchMiddleware);

  console.log(`已注册 ${eventPipeline.getMiddlewareCount()} 个中间件\n`);

  // 场景1：允许的事件类型
  console.log('场景1：允许的事件类型');
  console.log('-'.repeat(60));
  const event1: EventContext = {
    type: 'user.login',
    payload: {
      userId: 123,
      username: 'john',
      ip: '192.168.1.1'
    },
    timestamp: Date.now(),
    propagationStopped: false
  };

  await eventPipeline.execute(event1);

  // 场景2：不允许的事件类型
  console.log('\n' + '-'.repeat(60));
  console.log('场景2：不在白名单的事件类型');
  console.log('-'.repeat(60));
  const event2: EventContext = {
    type: 'system.debug',
    payload: {
      message: 'Debug info'
    },
    timestamp: Date.now(),
    propagationStopped: false
  };

  await eventPipeline.execute(event2);

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 中间件模式的优势：');
  console.log('1. 职责分离：每个中间件只负责一个特定功能');
  console.log('2. 可组合性：灵活组合不同的中间件');
  console.log('3. 可复用性：中间件可在不同场景复用');
  console.log('4. 顺序控制：中间件执行顺序清晰可控');
  console.log('5. 易于测试：每个中间件可独立测试');
  console.log('6. 符合开闭原则：新增功能只需添加新中间件');
  console.log('\n💡 中间件模式的核心：');
  console.log('   - next() 函数：控制流程继续或中断');
  console.log('   - 洋葱模型：请求进入->中间件1->中间件2->...->响应出来');
  console.log('   - 上下文共享：所有中间件共享同一个context对象');
  console.log('\n🔧 实际应用：');
  console.log('   - Express/Koa: Web框架的核心机制');
  console.log('   - Redux: 中间件处理action');
  console.log('   - 日志、认证、缓存、错误处理等横切关注点');
}

// 运行示例
main().catch(console.error);

export {
  Middleware,
  MiddlewarePipeline,
  HttpContext,
  DataProcessContext,
  EventContext,
  loggerMiddleware,
  authMiddleware,
  corsMiddleware,
  errorHandlerMiddleware,
  validateDataMiddleware,
  transformDataMiddleware
};
