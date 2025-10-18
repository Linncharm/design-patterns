/**
 * 命令模式 (Command Pattern)
 *
 * 核心思想：将请求封装成对象，从而使你可以用不同的请求对客户进行参数化，
 *          对请求排队或记录请求日志，以及支持可撤销的操作
 * 优点：解耦发送者和接收者，支持撤销/重做，支持请求队列
 * 使用场景：需要撤销操作、请求队列、事务管理、日志记录
 */

// ============ 示例1: 文本编辑器 - 操作封装和撤销/重做 ============

/**
 * 命令接口：定义执行和撤销方法
 */
interface Command {
  execute(): void;
  undo(): void;
  getDescription(): string;
}

/**
 * 接收者：文本文档
 */
class TextDocument {
  private content: string = '';
  private cursorPosition: number = 0;

  insert(text: string, position: number): void {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
    this.cursorPosition = position + text.length;
  }

  delete(position: number, length: number): string {
    const deleted = this.content.slice(position, position + length);
    this.content = this.content.slice(0, position) + this.content.slice(position + length);
    this.cursorPosition = position;
    return deleted;
  }

  getContent(): string {
    return this.content;
  }

  getCursorPosition(): number {
    return this.cursorPosition;
  }

  setCursorPosition(position: number): void {
    this.cursorPosition = Math.max(0, Math.min(position, this.content.length));
  }
}

/**
 * 具体命令：插入文本
 */
class InsertTextCommand implements Command {
  private document: TextDocument;
  private text: string;
  private position: number;

  constructor(document: TextDocument, text: string, position: number) {
    this.document = document;
    this.text = text;
    this.position = position;
  }

  execute(): void {
    this.document.insert(this.text, this.position);
    console.log(`✏️  插入文本: "${this.text}" (位置: ${this.position})`);
  }

  undo(): void {
    this.document.delete(this.position, this.text.length);
    console.log(`↩️  撤销插入: "${this.text}"`);
  }

  getDescription(): string {
    return `插入 "${this.text}"`;
  }
}

/**
 * 具体命令：删除文本
 */
class DeleteTextCommand implements Command {
  private document: TextDocument;
  private position: number;
  private length: number;
  private deletedText: string = '';

  constructor(document: TextDocument, position: number, length: number) {
    this.document = document;
    this.position = position;
    this.length = length;
  }

  execute(): void {
    this.deletedText = this.document.delete(this.position, this.length);
    console.log(`🗑️  删除文本: "${this.deletedText}" (位置: ${this.position})`);
  }

  undo(): void {
    this.document.insert(this.deletedText, this.position);
    console.log(`↩️  撤销删除: "${this.deletedText}"`);
  }

  getDescription(): string {
    return `删除 ${this.length} 个字符`;
  }
}

/**
 * 调用者：文本编辑器 - 管理命令历史和撤销/重做
 */
class TextEditor {
  private document: TextDocument;
  private history: Command[] = [];
  private currentIndex: number = -1;

  constructor() {
    this.document = new TextDocument();
  }

  executeCommand(command: Command): void {
    command.execute();

    // 执行新命令时，清除当前位置之后的历史
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }

  undo(): void {
    if (this.currentIndex < 0) {
      console.log('⚠️  没有可撤销的操作');
      return;
    }

    const command = this.history[this.currentIndex];
    command.undo();
    this.currentIndex--;
  }

  redo(): void {
    if (this.currentIndex >= this.history.length - 1) {
      console.log('⚠️  没有可重做的操作');
      return;
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];
    command.execute();
  }

  showHistory(): void {
    console.log('\n📜 命令历史:');
    this.history.forEach((cmd, index) => {
      const marker = index === this.currentIndex ? '👉' : '  ';
      console.log(`${marker} ${index + 1}. ${cmd.getDescription()}`);
    });
  }

  showContent(): void {
    console.log(`\n📄 当前内容: "${this.document.getContent()}"`);
    console.log(`📍 光标位置: ${this.document.getCursorPosition()}\n`);
  }

  getDocument(): TextDocument {
    return this.document;
  }
}

// ============ 示例2: 图形编辑器 - 图形操作 ============

interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  color: string;
}

class Canvas {
  private shapes: Map<string, Shape> = new Map();

  addShape(shape: Shape): void {
    this.shapes.set(shape.id, shape);
  }

  removeShape(id: string): Shape | null {
    const shape = this.shapes.get(id) || null;
    if (shape) {
      this.shapes.delete(id);
    }
    return shape;
  }

  moveShape(id: string, deltaX: number, deltaY: number): { oldX: number; oldY: number } | null {
    const shape = this.shapes.get(id);
    if (!shape) return null;

    const oldPosition = { oldX: shape.x, oldY: shape.y };
    shape.x += deltaX;
    shape.y += deltaY;
    return oldPosition;
  }

  changeColor(id: string, newColor: string): string | null {
    const shape = this.shapes.get(id);
    if (!shape) return null;

    const oldColor = shape.color;
    shape.color = newColor;
    return oldColor;
  }

  listShapes(): void {
    console.log('\n🎨 画布上的图形:');
    if (this.shapes.size === 0) {
      console.log('  (空)');
    } else {
      this.shapes.forEach(shape => {
        console.log(`  - ${shape.type} (${shape.id}): 位置(${shape.x}, ${shape.y}), 颜色: ${shape.color}`);
      });
    }
    console.log();
  }
}

class AddShapeCommand implements Command {
  constructor(private canvas: Canvas, private shape: Shape) {}

  execute(): void {
    this.canvas.addShape(this.shape);
    console.log(`➕ 添加图形: ${this.shape.type} (${this.shape.id})`);
  }

  undo(): void {
    this.canvas.removeShape(this.shape.id);
    console.log(`↩️  撤销添加: ${this.shape.type} (${this.shape.id})`);
  }

  getDescription(): string {
    return `添加 ${this.shape.type}`;
  }
}

class MoveShapeCommand implements Command {
  private oldPosition: { oldX: number; oldY: number } | null = null;

  constructor(
    private canvas: Canvas,
    private shapeId: string,
    private deltaX: number,
    private deltaY: number
  ) {}

  execute(): void {
    this.oldPosition = this.canvas.moveShape(this.shapeId, this.deltaX, this.deltaY);
    console.log(`🔄 移动图形: ${this.shapeId} (${this.deltaX}, ${this.deltaY})`);
  }

  undo(): void {
    if (this.oldPosition) {
      this.canvas.moveShape(this.shapeId, -this.deltaX, -this.deltaY);
      console.log(`↩️  撤销移动: ${this.shapeId}`);
    }
  }

  getDescription(): string {
    return `移动 ${this.shapeId}`;
  }
}

class ChangeColorCommand implements Command {
  private oldColor: string | null = null;

  constructor(private canvas: Canvas, private shapeId: string, private newColor: string) {}

  execute(): void {
    this.oldColor = this.canvas.changeColor(this.shapeId, this.newColor);
    console.log(`🎨 改变颜色: ${this.shapeId} -> ${this.newColor}`);
  }

  undo(): void {
    if (this.oldColor) {
      this.canvas.changeColor(this.shapeId, this.oldColor);
      console.log(`↩️  撤销颜色: ${this.shapeId} -> ${this.oldColor}`);
    }
  }

  getDescription(): string {
    return `改变 ${this.shapeId} 颜色`;
  }
}

class GraphicsEditor {
  private canvas: Canvas;
  private history: Command[] = [];
  private currentIndex: number = -1;

  constructor() {
    this.canvas = new Canvas();
  }

  executeCommand(command: Command): void {
    command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }

  undo(): void {
    if (this.currentIndex < 0) {
      console.log('⚠️  没有可撤销的操作');
      return;
    }
    this.history[this.currentIndex].undo();
    this.currentIndex--;
  }

  redo(): void {
    if (this.currentIndex >= this.history.length - 1) {
      console.log('⚠️  没有可重做的操作');
      return;
    }
    this.currentIndex++;
    this.history[this.currentIndex].execute();
  }

  getCanvas(): Canvas {
    return this.canvas;
  }
}

// ============ 示例3: 任务队列 - 异步命令执行 ============

interface AsyncCommand {
  execute(): Promise<void>;
  getName(): string;
  getPriority(): number;
}

class DownloadFileCommand implements AsyncCommand {
  constructor(private url: string, private priority: number = 0) {}

  async execute(): Promise<void> {
    console.log(`⬇️  开始下载: ${this.url}`);
    // 模拟下载延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    console.log(`✅ 下载完成: ${this.url}`);
  }

  getName(): string {
    return `下载 ${this.url}`;
  }

  getPriority(): number {
    return this.priority;
  }
}

class SendEmailCommand implements AsyncCommand {
  constructor(private to: string, private subject: string, private priority: number = 0) {}

  async execute(): Promise<void> {
    console.log(`📧 发送邮件: ${this.to} - ${this.subject}`);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    console.log(`✅ 邮件已发送: ${this.to}`);
  }

  getName(): string {
    return `发送邮件给 ${this.to}`;
  }

  getPriority(): number {
    return this.priority;
  }
}

class ProcessDataCommand implements AsyncCommand {
  constructor(private data: string, private priority: number = 0) {}

  async execute(): Promise<void> {
    console.log(`⚙️  处理数据: ${this.data}`);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    console.log(`✅ 数据处理完成: ${this.data}`);
  }

  getName(): string {
    return `处理数据 ${this.data}`;
  }

  getPriority(): number {
    return this.priority;
  }
}

/**
 * 任务队列：支持优先级和并发控制
 */
class TaskQueue {
  private queue: AsyncCommand[] = [];
  private running: number = 0;
  private maxConcurrent: number;
  private completed: number = 0;
  private failed: number = 0;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  addTask(command: AsyncCommand): void {
    this.queue.push(command);
    // 按优先级排序（高优先级在前）
    this.queue.sort((a, b) => b.getPriority() - a.getPriority());
    console.log(`📝 任务入队: ${command.getName()} (优先级: ${command.getPriority()})`);
  }

  async processQueue(): Promise<void> {
    console.log(`\n🚀 开始处理任务队列 (最大并发: ${this.maxConcurrent})\n`);

    const runningTasks = new Set<Promise<void>>();

    const processNext = async () => {
      while (this.queue.length > 0) {
        // 等待直到有可用的并发槽位
        while (runningTasks.size >= this.maxConcurrent) {
          await Promise.race(runningTasks);
        }

        const command = this.queue.shift();
        if (command) {
          const task = this.executeTask(command).finally(() => {
            runningTasks.delete(task);
          });
          runningTasks.add(task);
        }
      }
    };

    await processNext();

    // 等待所有正在运行的任务完成
    await Promise.all(Array.from(runningTasks));

    console.log(`\n📊 任务队列处理完成:`);
    console.log(`  ✅ 成功: ${this.completed}`);
    console.log(`  ❌ 失败: ${this.failed}`);
    console.log(`  📝 总计: ${this.completed + this.failed}\n`);
  }

  private async executeTask(command: AsyncCommand): Promise<void> {
    try {
      await command.execute();
      this.completed++;
    } catch (error) {
      console.error(`❌ 任务失败: ${command.getName()}`);
      this.failed++;
    } finally {
      this.running--;
    }
  }

  getQueueStatus(): { pending: number; running: number; completed: number; failed: number } {
    return {
      pending: this.queue.length,
      running: this.running,
      completed: this.completed,
      failed: this.failed
    };
  }
}

// ============ 使用示例 ============

async function main(): Promise<void> {
  console.log('⚡ 命令模式演示\n');

  console.log('━'.repeat(50));
  console.log('示例1: 文本编辑器 - 撤销/重做');
  console.log('━'.repeat(50));

  const editor = new TextEditor();

  // 执行一系列编辑操作
  editor.executeCommand(new InsertTextCommand(editor.getDocument(), 'Hello', 0));
  editor.showContent();

  editor.executeCommand(new InsertTextCommand(editor.getDocument(), ' World', 5));
  editor.showContent();

  editor.executeCommand(new InsertTextCommand(editor.getDocument(), '!', 11));
  editor.showContent();

  editor.executeCommand(new DeleteTextCommand(editor.getDocument(), 5, 6));
  editor.showContent();

  editor.showHistory();

  // 撤销操作
  console.log('\n--- 执行撤销 ---');
  editor.undo();
  editor.showContent();

  editor.undo();
  editor.showContent();

  // 重做操作
  console.log('\n--- 执行重做 ---');
  editor.redo();
  editor.showContent();

  editor.showHistory();

  console.log('\n━'.repeat(50));
  console.log('示例2: 图形编辑器');
  console.log('━'.repeat(50));

  const graphicsEditor = new GraphicsEditor();
  const canvas = graphicsEditor.getCanvas();

  // 添加图形
  graphicsEditor.executeCommand(new AddShapeCommand(canvas, {
    id: 'rect1',
    type: '矩形',
    x: 100,
    y: 100,
    color: '红色'
  }));

  graphicsEditor.executeCommand(new AddShapeCommand(canvas, {
    id: 'circle1',
    type: '圆形',
    x: 200,
    y: 200,
    color: '蓝色'
  }));

  canvas.listShapes();

  // 移动和改变颜色
  graphicsEditor.executeCommand(new MoveShapeCommand(canvas, 'rect1', 50, 30));
  graphicsEditor.executeCommand(new ChangeColorCommand(canvas, 'circle1', '绿色'));

  canvas.listShapes();

  // 撤销操作
  console.log('--- 撤销两次 ---');
  graphicsEditor.undo();
  graphicsEditor.undo();

  canvas.listShapes();

  // 重做操作
  console.log('--- 重做一次 ---');
  graphicsEditor.redo();

  canvas.listShapes();

  console.log('\n━'.repeat(50));
  console.log('示例3: 任务队列 - 异步命令执行');
  console.log('━'.repeat(50));

  const taskQueue = new TaskQueue(2);  // 最大并发数: 2

  // 添加各种任务（带优先级）
  taskQueue.addTask(new DownloadFileCommand('file1.zip', 1));
  taskQueue.addTask(new SendEmailCommand('user1@example.com', '欢迎邮件', 3));
  taskQueue.addTask(new ProcessDataCommand('数据集A', 2));
  taskQueue.addTask(new DownloadFileCommand('file2.zip', 1));
  taskQueue.addTask(new SendEmailCommand('user2@example.com', '通知邮件', 3));
  taskQueue.addTask(new ProcessDataCommand('数据集B', 2));

  // 处理队列
  await taskQueue.processQueue();

  console.log('='.repeat(50));
  console.log('🎯 命令模式的优势：');
  console.log('1. 解耦请求发送者和接收者');
  console.log('2. 支持撤销/重做操作');
  console.log('3. 支持请求队列和延迟执行');
  console.log('4. 便于记录日志和审计');
  console.log('5. 支持宏命令（组合命令）');
  console.log('6. 符合开闭原则，易于扩展新命令');
  console.log('='.repeat(50));
}

// 运行示例
main().catch(console.error);

export {
  Command,
  TextEditor,
  InsertTextCommand,
  DeleteTextCommand,
  GraphicsEditor,
  AddShapeCommand,
  MoveShapeCommand,
  ChangeColorCommand,
  TaskQueue,
  AsyncCommand,
  DownloadFileCommand,
  SendEmailCommand,
  ProcessDataCommand
};
