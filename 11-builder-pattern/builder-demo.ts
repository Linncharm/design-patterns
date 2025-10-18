/**
 * 建造者模式 (Builder Pattern)
 *
 * 核心思想：将复杂对象的构建过程分步骤进行，同样的构建过程可以创建不同的表示
 * 优点：分离构建过程和表示，精细控制构建过程，代码可读性强
 * 使用场景：需要构建复杂对象、需要多种配置组合、链式调用API
 */

// ============ 示例1: 复杂对象构建 - 电脑配置器 ============

interface ComputerConfig {
  cpu: string;
  ram: string;
  storage: string;
  gpu?: string;
  os?: string;
  monitor?: string;
  keyboard?: string;
  mouse?: string;
}

class Computer {
  private config: ComputerConfig;

  constructor(config: ComputerConfig) {
    this.config = config;
  }

  getSpecs(): void {
    console.log('\n========== 电脑配置清单 ==========');
    console.log(`CPU: ${this.config.cpu}`);
    console.log(`内存: ${this.config.ram}`);
    console.log(`存储: ${this.config.storage}`);
    if (this.config.gpu) console.log(`显卡: ${this.config.gpu}`);
    if (this.config.os) console.log(`操作系统: ${this.config.os}`);
    if (this.config.monitor) console.log(`显示器: ${this.config.monitor}`);
    if (this.config.keyboard) console.log(`键盘: ${this.config.keyboard}`);
    if (this.config.mouse) console.log(`鼠标: ${this.config.mouse}`);
    console.log('==================================\n');
  }

  getPrice(): number {
    let price = 0;
    // 简单定价逻辑
    if (this.config.cpu.includes('i9')) price += 4000;
    else if (this.config.cpu.includes('i7')) price += 2500;
    else if (this.config.cpu.includes('i5')) price += 1500;

    if (this.config.ram.includes('32GB')) price += 1200;
    else if (this.config.ram.includes('16GB')) price += 600;
    else price += 300;

    if (this.config.storage.includes('1TB SSD')) price += 800;
    else if (this.config.storage.includes('512GB SSD')) price += 500;

    if (this.config.gpu?.includes('RTX 4090')) price += 15000;
    else if (this.config.gpu?.includes('RTX 4070')) price += 5000;

    return price;
  }
}

/**
 * 电脑建造者 - 支持链式调用
 */
class ComputerBuilder {
  private cpu: string = '';
  private ram: string = '';
  private storage: string = '';
  private gpu?: string;
  private os?: string;
  private monitor?: string;
  private keyboard?: string;
  private mouse?: string;

  setCPU(cpu: string): this {
    this.cpu = cpu;
    return this;
  }

  setRAM(ram: string): this {
    this.ram = ram;
    return this;
  }

  setStorage(storage: string): this {
    this.storage = storage;
    return this;
  }

  setGPU(gpu: string): this {
    this.gpu = gpu;
    return this;
  }

  setOS(os: string): this {
    this.os = os;
    return this;
  }

  setMonitor(monitor: string): this {
    this.monitor = monitor;
    return this;
  }

  setKeyboard(keyboard: string): this {
    this.keyboard = keyboard;
    return this;
  }

  setMouse(mouse: string): this {
    this.mouse = mouse;
    return this;
  }

  build(): Computer {
    if (!this.cpu || !this.ram || !this.storage) {
      throw new Error('必须配置 CPU、RAM 和存储设备');
    }

    return new Computer({
      cpu: this.cpu,
      ram: this.ram,
      storage: this.storage,
      gpu: this.gpu,
      os: this.os,
      monitor: this.monitor,
      keyboard: this.keyboard,
      mouse: this.mouse,
    });
  }

  // 预设配置
  static createGamingPC(): ComputerBuilder {
    return new ComputerBuilder()
      .setCPU('Intel Core i9-13900K')
      .setRAM('32GB DDR5')
      .setStorage('1TB NVMe SSD')
      .setGPU('NVIDIA RTX 4090')
      .setOS('Windows 11 Pro')
      .setMonitor('27寸 4K 144Hz')
      .setKeyboard('机械键盘 RGB')
      .setMouse('游戏鼠标');
  }

  static createOfficePC(): ComputerBuilder {
    return new ComputerBuilder()
      .setCPU('Intel Core i5-13400')
      .setRAM('16GB DDR4')
      .setStorage('512GB SSD')
      .setOS('Windows 11 Home');
  }
}

// ============ 示例2: SQL 查询构造器 ============

type WhereCondition = {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN';
  value: string | number | (string | number)[];
};

type JoinType = 'INNER' | 'LEFT' | 'RIGHT';

class SQLQuery {
  private selectFields: string[] = ['*'];
  private tableName: string = '';
  private whereConditions: WhereCondition[] = [];
  private orderByField?: string;
  private orderDirection: 'ASC' | 'DESC' = 'ASC';
  private limitValue?: number;
  private offsetValue?: number;
  private joins: Array<{ type: JoinType; table: string; on: string }> = [];

  select(...fields: string[]): this {
    this.selectFields = fields.length > 0 ? fields : ['*'];
    return this;
  }

  from(table: string): this {
    this.tableName = table;
    return this;
  }

  where(field: string, operator: WhereCondition['operator'], value: WhereCondition['value']): this {
    this.whereConditions.push({ field, operator, value });
    return this;
  }

  join(type: JoinType, table: string, on: string): this {
    this.joins.push({ type, table, on });
    return this;
  }

  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByField = field;
    this.orderDirection = direction;
    return this;
  }

  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  offset(offset: number): this {
    this.offsetValue = offset;
    return this;
  }

  build(): string {
    if (!this.tableName) {
      throw new Error('必须指定表名');
    }

    let sql = `SELECT ${this.selectFields.join(', ')} FROM ${this.tableName}`;

    // 添加 JOIN
    if (this.joins.length > 0) {
      this.joins.forEach(join => {
        sql += ` ${join.type} JOIN ${join.table} ON ${join.on}`;
      });
    }

    // 添加 WHERE
    if (this.whereConditions.length > 0) {
      const conditions = this.whereConditions.map(({ field, operator, value }) => {
        if (operator === 'IN' && Array.isArray(value)) {
          const values = value.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ');
          return `${field} IN (${values})`;
        }
        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
        return `${field} ${operator} ${formattedValue}`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // 添加 ORDER BY
    if (this.orderByField) {
      sql += ` ORDER BY ${this.orderByField} ${this.orderDirection}`;
    }

    // 添加 LIMIT
    if (this.limitValue !== undefined) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    // 添加 OFFSET
    if (this.offsetValue !== undefined) {
      sql += ` OFFSET ${this.offsetValue}`;
    }

    return sql + ';';
  }

  // 便捷方法：分页查询
  paginate(page: number, pageSize: number): this {
    this.limit(pageSize);
    this.offset((page - 1) * pageSize);
    return this;
  }
}

// ============ 示例3: HTTP 请求配置构建器 ============

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Headers = Record<string, string>;
type RequestBody = Record<string, any> | string;

interface HttpRequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Headers;
  body?: RequestBody;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

class HttpRequest {
  private config: HttpRequestConfig;

  constructor(config: HttpRequestConfig) {
    this.config = config;
  }

  async execute(): Promise<void> {
    console.log('\n========== HTTP 请求配置 ==========');
    console.log(`方法: ${this.config.method}`);
    console.log(`URL: ${this.config.url}`);

    if (this.config.headers && Object.keys(this.config.headers).length > 0) {
      console.log('请求头:');
      Object.entries(this.config.headers).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }

    if (this.config.body) {
      console.log('请求体:');
      console.log(typeof this.config.body === 'string'
        ? `  ${this.config.body}`
        : `  ${JSON.stringify(this.config.body, null, 2)}`);
    }

    if (this.config.timeout) {
      console.log(`超时: ${this.config.timeout}ms`);
    }

    if (this.config.retries) {
      console.log(`重试次数: ${this.config.retries}`);
    }

    console.log(`缓存: ${this.config.cache ? '启用' : '禁用'}`);
    console.log('===================================\n');
    console.log('✅ 请求已发送（模拟）\n');
  }
}

class HttpRequestBuilder {
  private method: HttpMethod = 'GET';
  private url: string = '';
  private headers: Headers = {};
  private body?: RequestBody;
  private timeout?: number;
  private retries?: number;
  private cache: boolean = false;

  setMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers: Headers): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setBody(body: RequestBody): this {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  setRetries(retries: number): this {
    this.retries = retries;
    return this;
  }

  enableCache(): this {
    this.cache = true;
    return this;
  }

  build(): HttpRequest {
    if (!this.url) {
      throw new Error('必须设置请求 URL');
    }

    return new HttpRequest({
      method: this.method,
      url: this.url,
      headers: Object.keys(this.headers).length > 0 ? this.headers : undefined,
      body: this.body,
      timeout: this.timeout,
      retries: this.retries,
      cache: this.cache,
    });
  }

  // 便捷方法
  static get(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod('GET').setUrl(url);
  }

  static post(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod('POST').setUrl(url);
  }

  static put(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod('PUT').setUrl(url);
  }

  static delete(url: string): HttpRequestBuilder {
    return new HttpRequestBuilder().setMethod('DELETE').setUrl(url);
  }
}

// ============ 使用示例 ============

async function main(): Promise<void> {
  console.log('🔨 建造者模式演示\n');

  console.log('━'.repeat(50));
  console.log('示例1: 复杂对象构建 - 电脑配置器');
  console.log('━'.repeat(50));

  // 自定义配置
  const customPC = new ComputerBuilder()
    .setCPU('Intel Core i7-13700K')
    .setRAM('16GB DDR5')
    .setStorage('512GB SSD')
    .setGPU('NVIDIA RTX 4070')
    .setOS('Windows 11 Pro')
    .build();

  console.log('自定义配置的电脑:');
  customPC.getSpecs();
  console.log(`💰 预估价格: ¥${customPC.getPrice()}\n`);

  // 预设配置：游戏PC
  const gamingPC = ComputerBuilder.createGamingPC().build();
  console.log('游戏PC配置:');
  gamingPC.getSpecs();
  console.log(`💰 预估价格: ¥${gamingPC.getPrice()}\n`);

  // 预设配置：办公PC
  const officePC = ComputerBuilder.createOfficePC().build();
  console.log('办公PC配置:');
  officePC.getSpecs();
  console.log(`💰 预估价格: ¥${officePC.getPrice()}\n`);

  console.log('━'.repeat(50));
  console.log('示例2: SQL 查询构造器');
  console.log('━'.repeat(50));

  // 简单查询
  const simpleQuery = new SQLQuery()
    .select('id', 'name', 'email')
    .from('users')
    .where('age', '>=', 18)
    .where('status', '=', 'active')
    .orderBy('created_at', 'DESC')
    .limit(10)
    .build();

  console.log('\n简单查询:');
  console.log(simpleQuery);

  // 复杂查询：带 JOIN 和分页
  const complexQuery = new SQLQuery()
    .select('u.id', 'u.name', 'o.order_id', 'o.total')
    .from('users u')
    .join('INNER', 'orders o', 'u.id = o.user_id')
    .where('o.status', 'IN', ['paid', 'shipped'])
    .where('o.total', '>', 100)
    .orderBy('o.created_at', 'DESC')
    .paginate(1, 20)  // 第1页，每页20条
    .build();

  console.log('\n复杂查询（带 JOIN 和分页）:');
  console.log(complexQuery);

  console.log('\n━'.repeat(50));
  console.log('示例3: HTTP 请求配置构建器');
  console.log('━'.repeat(50));

  // GET 请求
  const getRequest = HttpRequestBuilder
    .get('https://api.example.com/users/123')
    .setHeader('Authorization', 'Bearer token123')
    .setTimeout(5000)
    .enableCache()
    .build();

  await getRequest.execute();

  // POST 请求
  const postRequest = HttpRequestBuilder
    .post('https://api.example.com/users')
    .setHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    })
    .setBody({
      name: '张三',
      email: 'zhangsan@example.com',
      age: 28
    })
    .setTimeout(10000)
    .setRetries(3)
    .build();

  await postRequest.execute();

  console.log('='.repeat(50));
  console.log('🎯 建造者模式的优势：');
  console.log('1. 分步骤构建复杂对象，过程清晰');
  console.log('2. 链式调用，代码可读性强');
  console.log('3. 同样的构建过程可以创建不同的表示');
  console.log('4. 可以精细控制构建过程');
  console.log('5. 易于扩展新的构建步骤');
  console.log('6. TypeScript 类型系统保证类型安全');
  console.log('='.repeat(50));
}

// 运行示例
main().catch(console.error);

export {
  ComputerBuilder,
  Computer,
  SQLQuery,
  HttpRequestBuilder,
  HttpRequest
};
