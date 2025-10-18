/**
 * SOLID 原则 - I: 接口隔离原则 (Interface Segregation Principle)
 *
 * 核心思想：客户端不应该被迫依赖它不使用的接口
 * 简单说：一个类不应该被迫实现它不需要的方法
 * 优点：降低耦合度，提高内聚性，使接口更加清晰和易于维护
 */

// ❌ 违反 ISP 的例子：臃肿的接口

interface BadWorker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
  writeCode(): void;
  designArchitecture(): void;
}

// 人类员工：可以实现所有方法
class BadHumanWorker implements BadWorker {
  work(): void {
    console.log('👨‍💼 人类员工在工作');
  }

  eat(): void {
    console.log('🍽️  人类员工在吃饭');
  }

  sleep(): void {
    console.log('😴 人类员工在休息');
  }

  attendMeeting(): void {
    console.log('🤝 人类员工参加会议');
  }

  writeCode(): void {
    console.log('💻 人类员工在写代码');
  }

  designArchitecture(): void {
    console.log('📐 人类员工在设计架构');
  }
}

// 🚨 问题：机器人不需要吃饭和睡觉！
class BadRobotWorker implements BadWorker {
  work(): void {
    console.log('🤖 机器人在工作');
  }

  eat(): void {
    // 机器人不需要吃饭，但被迫实现
    throw new Error('机器人不需要吃饭');
  }

  sleep(): void {
    // 机器人不需要睡觉，但被迫实现
    throw new Error('机器人不需要睡觉');
  }

  attendMeeting(): void {
    throw new Error('机器人不参加会议');
  }

  writeCode(): void {
    console.log('💻 机器人在写代码');
  }

  designArchitecture(): void {
    throw new Error('机器人不设计架构');
  }
}

console.log('━'.repeat(50));
console.log('❌ 违反 ISP 的设计');
console.log('━'.repeat(50));

const badHuman = new BadHumanWorker();
badHuman.work();
badHuman.eat();

const badRobot = new BadRobotWorker();
badRobot.work();
try {
  badRobot.eat();  // ❌ 抛出异常
} catch (error) {
  if (error instanceof Error) {
    console.log('❌', error.message);
  }
}

console.log('\n问题：');
console.log('1. 接口过于臃肿，包含太多方法');
console.log('2. 机器人被迫实现不需要的方法');
console.log('3. 违反了接口隔离原则');
console.log('4. 增加了实现的复杂度\n');

// ✅ 遵循 ISP 的例子：将大接口拆分成多个小接口

// 工作能力
interface Workable {
  work(): void;
}

// 饮食能力
interface Eatable {
  eat(): void;
}

// 休息能力
interface Sleepable {
  sleep(): void;
}

// 会议能力
interface Meetable {
  attendMeeting(): void;
}

// 编程能力
interface Programmable {
  writeCode(): void;
}

// 设计能力
interface Designable {
  designArchitecture(): void;
}

// 人类员工：实现需要的接口
class HumanWorker implements Workable, Eatable, Sleepable, Meetable, Programmable, Designable {
  work(): void {
    console.log('👨‍💼 人类员工在工作');
  }

  eat(): void {
    console.log('🍽️  人类员工在吃饭');
  }

  sleep(): void {
    console.log('😴 人类员工在休息');
  }

  attendMeeting(): void {
    console.log('🤝 人类员工参加会议');
  }

  writeCode(): void {
    console.log('💻 人类员工在写代码');
  }

  designArchitecture(): void {
    console.log('📐 人类员工在设计架构');
  }
}

// 机器人：只实现需要的接口
class RobotWorker implements Workable, Programmable {
  work(): void {
    console.log('🤖 机器人在工作');
  }

  writeCode(): void {
    console.log('💻 机器人在写代码');
  }
}

// 实习生：部分功能
class Intern implements Workable, Eatable, Sleepable, Programmable {
  work(): void {
    console.log('🎓 实习生在工作');
  }

  eat(): void {
    console.log('🍽️  实习生在吃饭');
  }

  sleep(): void {
    console.log('😴 实习生在休息');
  }

  writeCode(): void {
    console.log('💻 实习生在写代码（学习中）');
  }
}

function makeWork(worker: Workable): void {
  worker.work();
}

function makeEat(eater: Eatable): void {
  eater.eat();
}

function makeProgramming(programmer: Programmable): void {
  programmer.writeCode();
}

console.log('━'.repeat(50));
console.log('✅ 遵循 ISP 的设计');
console.log('━'.repeat(50));

const human = new HumanWorker();
const robot = new RobotWorker();
const intern = new Intern();

console.log('\n所有员工都可以工作:');
makeWork(human);
makeWork(robot);
makeWork(intern);

console.log('\n只有需要吃饭的才吃:');
makeEat(human);
makeEat(intern);
// makeEat(robot);  // ✅ 编译错误：robot 没有实现 Eatable

console.log('\n所有能编程的都编程:');
makeProgramming(human);
makeProgramming(robot);
makeProgramming(intern);

// ✅ 另一个例子：智能设备

console.log('\n━'.repeat(50));
console.log('示例2: 智能设备');
console.log('━'.repeat(50));

// ❌ 违反 ISP：臃肿的智能设备接口
interface BadSmartDevice {
  turnOn(): void;
  turnOff(): void;
  setVolume(level: number): void;
  setBrightness(level: number): void;
  setTemperature(temp: number): void;
  playMusic(): void;
  recordVideo(): void;
  print(): void;
}

// ✅ 遵循 ISP：拆分接口
interface Switchable {
  turnOn(): void;
  turnOff(): void;
}

interface VolumeControllable {
  setVolume(level: number): void;
}

interface BrightnessControllable {
  setBrightness(level: number): void;
}

interface TemperatureControllable {
  setTemperature(temp: number): void;
}

interface MediaPlayable {
  playMusic(): void;
}

interface VideoRecordable {
  recordVideo(): void;
}

interface Printable {
  print(): void;
}

// 智能灯：只需要开关和亮度控制
class SmartLight implements Switchable, BrightnessControllable {
  private isOn: boolean = false;
  private brightness: number = 50;

  turnOn(): void {
    this.isOn = true;
    console.log('💡 智能灯已开启');
  }

  turnOff(): void {
    this.isOn = false;
    console.log('💡 智能灯已关闭');
  }

  setBrightness(level: number): void {
    this.brightness = level;
    console.log(`💡 设置亮度为 ${level}%`);
  }
}

// 智能音箱：开关、音量、播放音乐
class SmartSpeaker implements Switchable, VolumeControllable, MediaPlayable {
  private isOn: boolean = false;
  private volume: number = 50;

  turnOn(): void {
    this.isOn = true;
    console.log('🔊 智能音箱已开启');
  }

  turnOff(): void {
    this.isOn = false;
    console.log('🔊 智能音箱已关闭');
  }

  setVolume(level: number): void {
    this.volume = level;
    console.log(`🔊 设置音量为 ${level}%`);
  }

  playMusic(): void {
    console.log('🎵 正在播放音乐');
  }
}

// 智能空调：开关、温度控制
class SmartAirConditioner implements Switchable, TemperatureControllable {
  private isOn: boolean = false;
  private temperature: number = 26;

  turnOn(): void {
    this.isOn = true;
    console.log('❄️  智能空调已开启');
  }

  turnOff(): void {
    this.isOn = false;
    console.log('❄️  智能空调已关闭');
  }

  setTemperature(temp: number): void {
    this.temperature = temp;
    console.log(`❄️  设置温度为 ${temp}°C`);
  }
}

// 智能打印机
class SmartPrinter implements Switchable, Printable {
  private isOn: boolean = false;

  turnOn(): void {
    this.isOn = true;
    console.log('🖨️  打印机已开启');
  }

  turnOff(): void {
    this.isOn = false;
    console.log('🖨️  打印机已关闭');
  }

  print(): void {
    console.log('🖨️  正在打印文档...');
  }
}

console.log('\n--- 使用智能设备 ---');
const light = new SmartLight();
light.turnOn();
light.setBrightness(80);

const speaker = new SmartSpeaker();
speaker.turnOn();
speaker.setVolume(60);
speaker.playMusic();

const ac = new SmartAirConditioner();
ac.turnOn();
ac.setTemperature(24);

const printer = new SmartPrinter();
printer.turnOn();
printer.print();

// ✅ 示例3: 文档处理

console.log('\n━'.repeat(50));
console.log('示例3: 文档处理');
console.log('━'.repeat(50));

interface Readable {
  read(): string;
}

interface Writable {
  write(content: string): void;
}

interface Editable {
  edit(content: string): void;
}

interface Deletable {
  delete(): void;
}

// 只读文档
class ReadOnlyDocument implements Readable {
  constructor(private content: string) {}

  read(): string {
    console.log('📖 读取只读文档');
    return this.content;
  }
}

// 可编辑文档
class EditableDocument implements Readable, Writable, Editable, Deletable {
  private content: string = '';

  read(): string {
    console.log('📖 读取文档');
    return this.content;
  }

  write(content: string): void {
    this.content = content;
    console.log('✍️  写入文档');
  }

  edit(content: string): void {
    this.content += content;
    console.log('✏️  编辑文档');
  }

  delete(): void {
    this.content = '';
    console.log('🗑️  删除文档内容');
  }
}

// 日志文件：只能写入和读取，不能编辑或删除
class LogFile implements Readable, Writable {
  private logs: string[] = [];

  read(): string {
    console.log('📋 读取日志');
    return this.logs.join('\n');
  }

  write(content: string): void {
    this.logs.push(`[${new Date().toISOString()}] ${content}`);
    console.log('📝 写入日志');
  }
}

console.log('\n--- 文档操作 ---');
const readOnly = new ReadOnlyDocument('这是只读内容');
readOnly.read();

const editable = new EditableDocument();
editable.write('新文档内容');
editable.edit('追加内容');
editable.read();

const log = new LogFile();
log.write('系统启动');
log.write('用户登录');
log.read();

console.log('\n━'.repeat(50));
console.log('🎯 接口隔离原则的优势：');
console.log('━'.repeat(50));
console.log('1. 客户端只依赖它需要的接口');
console.log('2. 降低接口之间的耦合度');
console.log('3. 提高系统的灵活性和可维护性');
console.log('4. 避免实现不需要的方法');
console.log('5. 接口更加清晰和专注');

console.log('\n💡 实际应用场景：');
console.log('- API 设计：提供细粒度的接口');
console.log('- 插件系统：不同插件实现不同接口');
console.log('- 权限系统：不同角色有不同能力');
console.log('- 设备驱动：不同设备有不同功能');

console.log('\n⚠️  违反 ISP 的信号：');
console.log('- 接口方法数量过多');
console.log('- 实现类有很多空方法或抛异常的方法');
console.log('- 客户端只使用接口的一部分方法');
console.log('- 修改接口影响很多不相关的类');
console.log('━'.repeat(50));

export {
  Workable,
  Eatable,
  Sleepable,
  Programmable,
  HumanWorker,
  RobotWorker,
  Intern,
  Switchable,
  SmartLight,
  SmartSpeaker,
  SmartAirConditioner,
  SmartPrinter,
  Readable,
  Writable,
  Editable,
  EditableDocument,
  ReadOnlyDocument,
  LogFile
};
