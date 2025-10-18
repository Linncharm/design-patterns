/**
 * 模板方法模式 (Template Method Pattern)
 *
 * 核心思想：在父类中定义算法的骨架，将某些步骤延迟到子类实现
 * 优点：代码复用、控制子类扩展点、符合开闭原则
 * 使用场景：业务流程框架、生命周期钩子、算法模板、数据处理流程
 */

// ============ 类型定义 ============

/**
 * HTTP请求方法
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * 请求配置
 */
interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * 响应数据
 */
interface ResponseData<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

/**
 * 测试报告
 */
interface TestReport {
  testName: string;
  passed: boolean;
  duration: number;
  setupTime: number;
  teardownTime: number;
  errors: string[];
}

/**
 * 数据记录
 */
interface DataRecord {
  id: number;
  data: unknown;
  timestamp: Date;
}

// ============ 示例1：数据处理流程模板 ============

/**
 * 抽象数据处理器（模板类）
 */
abstract class DataProcessor<T = unknown, R = unknown> {
  /**
   * 模板方法：定义数据处理的完整流程
   */
  public process(data: T): R {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`开始数据处理流程: ${this.getProcessorName()}`);
    console.log('='.repeat(60));

    // 1. 验证数据
    console.log('\n[步骤1] 验证数据...');
    if (!this.validate(data)) {
      throw new Error('数据验证失败');
    }
    console.log('✅ 数据验证通过');

    // 2. 预处理（钩子方法，子类可选实现）
    console.log('\n[步骤2] 数据预处理...');
    const preprocessed: T = this.preProcess(data);
    console.log('✅ 预处理完成');

    // 3. 核心处理（抽象方法，子类必须实现）
    console.log('\n[步骤3] 核心处理...');
    const result: R = this.doProcess(preprocessed);
    console.log('✅ 核心处理完成');

    // 4. 后处理（钩子方法，子类可选实现）
    console.log('\n[步骤4] 后处理...');
    const postProcessed: R = this.postProcess(result);
    console.log('✅ 后处理完成');

    // 5. 保存结果（可选步骤）
    if (this.shouldSave()) {
      console.log('\n[步骤5] 保存结果...');
      this.save(postProcessed);
      console.log('✅ 结果已保存');
    } else {
      console.log('\n[步骤5] 跳过保存步骤');
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`数据处理流程完成: ${this.getProcessorName()}`);
    console.log('='.repeat(60)\n);

    return postProcessed;
  }

  /**
   * 获取处理器名称
   */
  protected abstract getProcessorName(): string;

  /**
   * 验证数据（具体实现由子类提供）
   */
  protected abstract validate(data: T): boolean;

  /**
   * 核心处理逻辑（具体实现由子类提供）
   */
  protected abstract doProcess(data: T): R;

  /**
   * 预处理钩子（子类可选覆盖）
   */
  protected preProcess(data: T): T {
    console.log('   使用默认预处理');
    return data;
  }

  /**
   * 后处理钩子（子类可选覆盖）
   */
  protected postProcess(result: R): R {
    console.log('   使用默认后处理');
    return result;
  }

  /**
   * 是否保存结果（钩子方法）
   */
  protected shouldSave(): boolean {
    return true;
  }

  /**
   * 保存结果（钩子方法）
   */
  protected save(result: R): void {
    console.log(`   结果已保存:`, result);
  }
}

/**
 * CSV数据处理器
 */
class CsvDataProcessor extends DataProcessor<string, DataRecord[]> {
  protected getProcessorName(): string {
    return 'CSV数据处理器';
  }

  protected validate(data: string): boolean {
    if (!data || data.trim() === '') {
      console.log('   ❌ CSV数据为空');
      return false;
    }
    console.log(`   ✓ CSV数据长度: ${data.length} 字符`);
    return true;
  }

  protected preProcess(data: string): string {
    console.log('   去除CSV数据的空白行和注释');
    return data
      .split('\n')
      .filter((line: string) => line.trim() !== '' && !line.startsWith('#'))
      .join('\n');
  }

  protected doProcess(data: string): DataRecord[] {
    const lines: string[] = data.split('\n');
    const headers: string[] = lines[0].split(',');

    console.log(`   CSV列: ${headers.join(', ')}`);

    const records: DataRecord[] = lines.slice(1).map((line: string, index: number) => {
      const values: string[] = line.split(',');
      const record: Record<string, string> = {};

      headers.forEach((header: string, i: number) => {
        record[header.trim()] = values[i]?.trim() || '';
      });

      return {
        id: index + 1,
        data: record,
        timestamp: new Date()
      };
    });

    console.log(`   解析了 ${records.length} 条记录`);
    return records;
  }

  protected postProcess(result: DataRecord[]): DataRecord[] {
    console.log('   过滤无效记录');
    return result.filter((record: DataRecord) => {
      const data = record.data as Record<string, string>;
      return data && Object.keys(data).length > 0;
    });
  }
}

/**
 * JSON数据处理器
 */
class JsonDataProcessor extends DataProcessor<string, DataRecord[]> {
  protected getProcessorName(): string {
    return 'JSON数据处理器';
  }

  protected validate(data: string): boolean {
    try {
      JSON.parse(data);
      console.log('   ✓ JSON格式有效');
      return true;
    } catch (error) {
      console.log('   ❌ JSON格式无效');
      return false;
    }
  }

  protected doProcess(data: string): DataRecord[] {
    const jsonData: unknown[] = JSON.parse(data);
    console.log(`   解析了 ${jsonData.length} 条JSON记录`);

    return jsonData.map((item: unknown, index: number) => ({
      id: index + 1,
      data: item,
      timestamp: new Date()
    }));
  }

  protected shouldSave(): boolean {
    // JSON处理器不自动保存
    return false;
  }
}

// ============ 示例2：组件生命周期模板 ============

/**
 * 抽象组件类（模板类）
 */
abstract class Component {
  protected isInitialized: boolean = false;
  protected isMounted: boolean = false;
  protected props: Record<string, unknown> = {};

  /**
   * 模板方法：组件生命周期
   */
  public lifecycle(props: Record<string, unknown>): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`组件生命周期: ${this.getComponentName()}`);
    console.log('='.repeat(60));

    this.props = props;

    try {
      // 1. 初始化前
      console.log('\n[生命周期] beforeInit');
      this.beforeInit();

      // 2. 初始化
      console.log('\n[生命周期] init');
      this.init();
      this.isInitialized = true;
      console.log('✅ 组件已初始化');

      // 3. 初始化后
      console.log('\n[生命周期] afterInit');
      this.afterInit();

      // 4. 挂载前
      console.log('\n[生命周期] beforeMount');
      this.beforeMount();

      // 5. 挂载
      console.log('\n[生命周期] mount');
      this.mount();
      this.isMounted = true;
      console.log('✅ 组件已挂载');

      // 6. 挂载后
      console.log('\n[生命周期] afterMount');
      this.afterMount();

      // 7. 渲染
      console.log('\n[生命周期] render');
      this.render();

    } catch (error) {
      console.log(`\n[生命周期] error`);
      this.onError(error instanceof Error ? error : new Error(String(error)));
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`组件生命周期完成: ${this.getComponentName()}`);
    console.log('='.repeat(60)\n);
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    console.log(`\n[生命周期] 销毁组件: ${this.getComponentName()}`);

    console.log('[生命周期] beforeUnmount');
    this.beforeUnmount();

    console.log('[生命周期] unmount');
    this.unmount();
    this.isMounted = false;

    console.log('[生命周期] cleanup');
    this.cleanup();
    this.isInitialized = false;

    console.log('✅ 组件已销毁\n');
  }

  /**
   * 获取组件名称
   */
  protected abstract getComponentName(): string;

  /**
   * 渲染组件（必须实现）
   */
  protected abstract render(): void;

  // ============ 生命周期钩子（子类可选覆盖）============

  protected beforeInit(): void {
    console.log('   [钩子] beforeInit - 默认实现');
  }

  protected init(): void {
    console.log('   [钩子] init - 默认实现');
  }

  protected afterInit(): void {
    console.log('   [钩子] afterInit - 默认实现');
  }

  protected beforeMount(): void {
    console.log('   [钩子] beforeMount - 默认实现');
  }

  protected mount(): void {
    console.log('   [钩子] mount - 默认实现');
  }

  protected afterMount(): void {
    console.log('   [钩子] afterMount - 默认实现');
  }

  protected beforeUnmount(): void {
    console.log('   [钩子] beforeUnmount - 默认实现');
  }

  protected unmount(): void {
    console.log('   [钩子] unmount - 默认实现');
  }

  protected cleanup(): void {
    console.log('   [钩子] cleanup - 默认实现');
  }

  protected onError(error: Error): void {
    console.log(`   [钩子] onError: ${error.message}`);
  }
}

/**
 * 用户列表组件
 */
class UserListComponent extends Component {
  private users: unknown[] = [];

  protected getComponentName(): string {
    return 'UserListComponent';
  }

  protected beforeInit(): void {
    console.log('   准备初始化用户列表组件...');
  }

  protected init(): void {
    console.log('   初始化组件状态和数据');
    this.users = [];
  }

  protected afterInit(): void {
    console.log('   加载用户数据...');
    // 模拟加载数据
    this.users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];
    console.log(`   加载了 ${this.users.length} 个用户`);
  }

  protected beforeMount(): void {
    console.log('   验证用户数据...');
  }

  protected afterMount(): void {
    console.log('   绑定事件监听器');
    console.log('   启动自动刷新定时器');
  }

  protected render(): void {
    console.log('   渲染用户列表:');
    this.users.forEach((user: any) => {
      console.log(`      - ${user.name}`);
    });
  }

  protected beforeUnmount(): void {
    console.log('   移除事件监听器');
    console.log('   停止定时器');
  }

  protected cleanup(): void {
    console.log('   清理用户数据');
    this.users = [];
  }
}

/**
 * 表单组件
 */
class FormComponent extends Component {
  private formData: Record<string, unknown> = {};

  protected getComponentName(): string {
    return 'FormComponent';
  }

  protected init(): void {
    console.log('   初始化表单数据');
    this.formData = this.props.initialData as Record<string, unknown> || {};
  }

  protected afterMount(): void {
    console.log('   设置表单验证规则');
    console.log('   绑定输入事件');
  }

  protected render(): void {
    console.log('   渲染表单字段:');
    Object.keys(this.formData).forEach((key: string) => {
      console.log(`      ${key}: ${this.formData[key]}`);
    });
  }

  protected cleanup(): void {
    console.log('   重置表单数据');
    this.formData = {};
  }
}

// ============ 示例3：HTTP请求模板 ============

/**
 * 抽象HTTP客户端（模板类）
 */
abstract class HttpClient {
  /**
   * 模板方法：发送HTTP请求
   */
  public async request<T>(config: RequestConfig): Promise<ResponseData<T>> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`HTTP请求: ${config.method} ${config.url}`);
    console.log('='.repeat(60));

    try {
      // 1. 请求前拦截
      console.log('\n[步骤1] 请求前拦截...');
      const interceptedConfig: RequestConfig = await this.beforeRequest(config);

      // 2. 构建请求
      console.log('\n[步骤2] 构建请求...');
      const builtRequest: RequestConfig = this.buildRequest(interceptedConfig);

      // 3. 发送请求（抽象方法）
      console.log('\n[步骤3] 发送请求...');
      const response: ResponseData<T> = await this.sendRequest<T>(builtRequest);
      console.log(`✅ 收到响应: ${response.status}`);

      // 4. 响应后拦截
      console.log('\n[步骤4] 响应后拦截...');
      const interceptedResponse: ResponseData<T> = await this.afterResponse(response);

      // 5. 处理响应
      console.log('\n[步骤5] 处理响应...');
      const processedResponse: ResponseData<T> = this.processResponse(interceptedResponse);

      console.log(`\n${'='.repeat(60)}`);
      console.log(`请求完成: ${config.method} ${config.url}`);
      console.log('='.repeat(60)\n);

      return processedResponse;

    } catch (error) {
      console.log('\n[错误处理] 请求失败');
      return this.onError(error as Error, config);
    }
  }

  /**
   * 发送请求（子类必须实现）
   */
  protected abstract sendRequest<T>(config: RequestConfig): Promise<ResponseData<T>>;

  /**
   * 请求前拦截器（钩子方法）
   */
  protected async beforeRequest(config: RequestConfig): Promise<RequestConfig> {
    console.log('   应用默认请求拦截器');
    return config;
  }

  /**
   * 构建请求（钩子方法）
   */
  protected buildRequest(config: RequestConfig): RequestConfig {
    console.log('   构建请求配置');
    return {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    };
  }

  /**
   * 响应后拦截器（钩子方法）
   */
  protected async afterResponse<T>(response: ResponseData<T>): Promise<ResponseData<T>> {
    console.log('   应用默认响应拦截器');
    return response;
  }

  /**
   * 处理响应（钩子方法）
   */
  protected processResponse<T>(response: ResponseData<T>): ResponseData<T> {
    console.log('   处理响应数据');
    return response;
  }

  /**
   * 错误处理（钩子方法）
   */
  protected onError<T>(error: Error, config: RequestConfig): ResponseData<T> {
    console.log(`   处理错误: ${error.message}`);
    return {
      status: 500,
      data: null as T,
      headers: {}
    };
  }
}

/**
 * 认证HTTP客户端
 */
class AuthHttpClient extends HttpClient {
  constructor(private token: string) {
    super();
  }

  protected async beforeRequest(config: RequestConfig): Promise<RequestConfig> {
    console.log('   添加认证token');
    return {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  protected async sendRequest<T>(config: RequestConfig): Promise<ResponseData<T>> {
    console.log(`   模拟发送认证请求: ${config.method} ${config.url}`);
    console.log(`   Headers:`, JSON.stringify(config.headers, null, 2));

    // 模拟HTTP响应
    return {
      status: 200,
      data: { message: 'Success', userId: 123 } as T,
      headers: { 'content-type': 'application/json' }
    };
  }

  protected async afterResponse<T>(response: ResponseData<T>): Promise<ResponseData<T>> {
    console.log('   验证响应签名');
    return response;
  }
}

// ============ 使用示例 ============
async function main(): Promise<void> {
  console.log('🎯 模板方法模式示例\n');
  console.log('='.repeat(60));

  // ============ 示例1：数据处理流程 ============
  console.log('\n【示例1：数据处理流程模板】');

  // CSV数据处理
  const csvData: string = `
# 用户数据
name,email,age
Alice,alice@example.com,25
Bob,bob@example.com,30

Charlie,charlie@example.com,28
`.trim();

  const csvProcessor: CsvDataProcessor = new CsvDataProcessor();
  const csvResult: DataRecord[] = csvProcessor.process(csvData);
  console.log(`\nCSV处理结果: ${csvResult.length} 条记录`);

  // JSON数据处理
  const jsonData: string = JSON.stringify([
    { name: 'David', email: 'david@example.com', age: 35 },
    { name: 'Eve', email: 'eve@example.com', age: 22 }
  ]);

  const jsonProcessor: JsonDataProcessor = new JsonDataProcessor();
  const jsonResult: DataRecord[] = jsonProcessor.process(jsonData);
  console.log(`\nJSON处理结果: ${jsonResult.length} 条记录`);

  // ============ 示例2：组件生命周期 ============
  console.log('\n\n【示例2：组件生命周期钩子】');

  const userList: UserListComponent = new UserListComponent();
  userList.lifecycle({ title: '用户列表' });
  userList.destroy();

  const form: FormComponent = new FormComponent();
  form.lifecycle({ initialData: { username: 'john', email: 'john@example.com' } });
  form.destroy();

  // ============ 示例3：HTTP请求模板 ============
  console.log('\n\n【示例3：HTTP请求模板】');

  const httpClient: AuthHttpClient = new AuthHttpClient('secret-token-123');
  await httpClient.request({
    url: 'https://api.example.com/users',
    method: 'GET'
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 模板方法模式的优势：');
  console.log('1. 代码复用：公共逻辑在父类实现');
  console.log('2. 控制反转：框架调用子类代码（好莱坞原则）');
  console.log('3. 扩展点明确：钩子方法定义清晰的扩展点');
  console.log('4. 保护算法骨架：模板方法通常设为final防止修改');
  console.log('5. TypeScript抽象类强制子类实现关键方法');
  console.log('\n💡 模板方法 vs 策略模式：');
  console.log('   - 模板方法：继承，算法骨架固定，部分步骤可变');
  console.log('   - 策略模式：组合，整个算法可替换');
  console.log('\n🔧 实际应用场景：');
  console.log('   - 框架生命周期（React、Vue组件）');
  console.log('   - 数据处理流程（ETL、数据清洗）');
  console.log('   - HTTP客户端（请求拦截器）');
  console.log('   - 测试框架（setup、test、teardown）');
  console.log('   - 游戏AI（决策树模板）');
}

// 运行示例
main().catch(console.error);

export {
  DataProcessor,
  CsvDataProcessor,
  JsonDataProcessor,
  Component,
  UserListComponent,
  FormComponent,
  HttpClient,
  AuthHttpClient,
  DataRecord,
  RequestConfig,
  ResponseData
};
