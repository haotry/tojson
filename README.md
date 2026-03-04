# JSON 转换工具

纯前端 JSON 转换工具，提供格式化、压缩和验证功能。

## 功能特性

- ✨ JSON 格式化（2 空格缩进）
- 🗜️ JSON 压缩（移除空白字符）
- ✅ JSON 验证（语法检查和错误定位）
- 📋 一键复制结果
- 🧹 快速清空输入输出
- 📱 响应式设计（支持移动端）
- 🔒 完全客户端处理（数据隐私）

## 安装依赖

首先确保已安装 Node.js (推荐 v18 或更高版本)。

```bash
npm install
```

## 开发

启动开发服务器：

```bash
npm run dev
```

然后在浏览器中打开 http://localhost:5173

## 构建

构建生产版本：

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 测试

运行所有测试：

```bash
npm test
```

运行测试并监听文件变化：

```bash
npm run test:watch
```

生成测试覆盖率报告：

```bash
npm run test:coverage
```

## 技术栈

- TypeScript
- Vite
- Vitest (测试框架)
- fast-check (属性测试)
- 原生 Web APIs

## 项目结构

```
.
├── src/
│   ├── main.ts           # 应用入口
│   ├── styles.css        # 全局样式
│   ├── JSONProcessor.ts  # JSON 处理核心
│   ├── UIManager.ts      # UI 管理
│   └── AppController.ts  # 应用控制器
├── tests/
│   ├── unit/            # 单元测试
│   ├── property/        # 属性测试
│   └── integration/     # 集成测试
├── index.html           # HTML 入口
└── package.json
```

## 浏览器支持

支持所有现代浏览器的最新两个版本：
- Chrome
- Firefox
- Safari
- Edge
