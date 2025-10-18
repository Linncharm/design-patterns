/**
 * SOLID 原则 - S: 单一职责原则 (Single Responsibility Principle)
 *
 * 核心思想：一个类应该只有一个引起它变化的原因，即一个类只负责一项职责
 * 优点：降低类的复杂度，提高可读性和可维护性，降低变更风险
 */

// ❌ 违反 SRP 的例子：一个类承担了多个职责

class BadUser {
  constructor(
    public name: string,
    public email: string
  ) {}

  // 职责1: 用户数据验证
  validate(): boolean {
    if (!this.name || this.name.length < 2) {
      console.log('❌ 用户名太短');
      return false;
    }
    if (!this.email.includes('@')) {
      console.log('❌ 邮箱格式错误');
      return false;
    }
    return true;
  }

  // 职责2: 用户数据持久化
  save(): void {
    console.log(`💾 保存用户到数据库: ${this.name}`);
    // 数据库操作...
  }

  // 职责3: 发送邮件通知
  sendWelcomeEmail(): void {
    console.log(`📧 发送欢迎邮件到: ${this.email}`);
    // 邮件发送逻辑...
  }

  // 职责4: 生成报表
  generateReport(): string {
    return `用户报表: ${this.name} (${this.email})`;
  }
}

console.log('━'.repeat(50));
console.log('❌ 违反 SRP 的设计');
console.log('━'.repeat(50));

const badUser = new BadUser('张三', 'zhangsan@example.com');
badUser.validate();
badUser.save();
badUser.sendWelcomeEmail();
console.log(badUser.generateReport());

console.log('\n问题：');
console.log('1. User 类承担了太多职责');
console.log('2. 修改任何一个功能都可能影响其他功能');
console.log('3. 难以测试和维护');
console.log('4. 违反了单一职责原则\n');

// ✅ 遵循 SRP 的例子：每个类只负责一个职责

// 职责1: 用户数据模型
class User {
  constructor(
    public name: string,
    public email: string
  ) {}

  getUserInfo(): string {
    return `${this.name} (${this.email})`;
  }
}

// 职责2: 用户数据验证
class UserValidator {
  validate(user: User): boolean {
    if (!user.name || user.name.length < 2) {
      console.log('❌ 用户名太短');
      return false;
    }
    if (!user.email.includes('@')) {
      console.log('❌ 邮箱格式错误');
      return false;
    }
    console.log('✅ 用户数据验证通过');
    return true;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 50;
  }
}

// 职责3: 用户数据持久化
class UserRepository {
  private users: User[] = [];

  save(user: User): void {
    this.users.push(user);
    console.log(`💾 保存用户到数据库: ${user.getUserInfo()}`);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getAll(): User[] {
    return this.users;
  }

  delete(email: string): void {
    this.users = this.users.filter(u => u.email !== email);
    console.log(`🗑️  删除用户: ${email}`);
  }
}

// 职责4: 邮件通知服务
class EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`📧 发送欢迎邮件到: ${user.email}`);
    console.log(`   主题: 欢迎加入！`);
    console.log(`   内容: 你好，${user.name}！欢迎注册我们的服务。`);
  }

  sendPasswordResetEmail(user: User): void {
    console.log(`📧 发送密码重置邮件到: ${user.email}`);
  }

  sendNotification(user: User, message: string): void {
    console.log(`📧 发送通知到 ${user.email}: ${message}`);
  }
}

// 职责5: 报表生成服务
class UserReportGenerator {
  generateUserReport(user: User): string {
    return `
=== 用户报表 ===
姓名: ${user.name}
邮箱: ${user.email}
创建时间: ${new Date().toLocaleString()}
===============`;
  }

  generateUsersReport(users: User[]): string {
    let report = '\n=== 用户列表报表 ===\n';
    report += `总用户数: ${users.length}\n\n`;
    users.forEach((user, index) => {
      report += `${index + 1}. ${user.getUserInfo()}\n`;
    });
    report += '==================\n';
    return report;
  }
}

console.log('━'.repeat(50));
console.log('✅ 遵循 SRP 的设计');
console.log('━'.repeat(50));

// 使用示例
const user1 = new User('张三', 'zhangsan@example.com');
const user2 = new User('李四', 'lisi@example.com');

const validator = new UserValidator();
const repository = new UserRepository();
const emailService = new EmailService();
const reportGenerator = new UserReportGenerator();

console.log('\n--- 处理用户1 ---');
if (validator.validate(user1)) {
  repository.save(user1);
  emailService.sendWelcomeEmail(user1);
}

console.log('\n--- 处理用户2 ---');
if (validator.validate(user2)) {
  repository.save(user2);
  emailService.sendWelcomeEmail(user2);
}

console.log('\n--- 生成报表 ---');
console.log(reportGenerator.generateUserReport(user1));
console.log(reportGenerator.generateUsersReport(repository.getAll()));

console.log('\n--- 额外功能演示 ---');
emailService.sendNotification(user1, '您有新消息！');
console.log('\n查找用户:', repository.findByEmail('lisi@example.com')?.getUserInfo());

console.log('\n━'.repeat(50));
console.log('🎯 单一职责原则的优势：');
console.log('━'.repeat(50));
console.log('1. 每个类只负责一个明确的职责');
console.log('2. 修改某个功能不会影响其他功能');
console.log('3. 易于测试：可以单独测试每个类');
console.log('4. 易于维护：代码职责清晰');
console.log('5. 易于复用：可以在其他地方使用这些类');
console.log('6. 降低耦合度：类之间的依赖更清晰');

console.log('\n💡 实际应用场景：');
console.log('- MVC 架构中的职责分离');
console.log('- 微服务架构中的服务拆分');
console.log('- 前端组件的功能拆分');
console.log('- 数据访问层、业务逻辑层、表现层的分离');
console.log('━'.repeat(50));

export {
  User,
  UserValidator,
  UserRepository,
  EmailService,
  UserReportGenerator
};
