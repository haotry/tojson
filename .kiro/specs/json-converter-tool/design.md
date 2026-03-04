# 设计文档

## 概述

JSON 转换工具是一个纯前端单页应用（SPA），使用现代 Web 技术构建。所有 JSON 处理逻辑在浏览器端执行，无需服务器交互，确保用户数据隐私和快速响应。

该应用采用模块化架构，将 UI 组件、JSON 处理逻辑和状态管理清晰分离，便于维护和扩展。

## 架构

### 整体架构

```
┌─────────────────────────────────────────┐
│           用户界面层 (UI Layer)          │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │输入组件 │ │按钮组件 │ │输出组件  │  │
│  └─────────┘ └─────────┘ └──────────┘  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        应用逻辑层 (Logic Layer)          │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ 状态管理器   │  │  事件处理器     │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       JSON 处理层 (Processing Layer)     │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │格式化器  │ │压缩器    │ │验证器   │ │
│  └──────────┘ └──────────┘ └─────────┘ │
└─────────────────────────────────────────┘
```

### 技术栈

- **HTML5**: 页面结构
- **CSS3**: 样式和响应式布局
- **JavaScript (ES6+)**: 应用逻辑
- **原生 JSON API**: JSON 解析和序列化

## 组件和接口

### 1. JSON 处理模块 (JSONProcessor)

负责所有 JSON 相关的核心操作。

```javascript
class JSONProcessor {
  /**
   * 验证 JSON 字符串
   * @param {string} jsonString - 待验证的 JSON 字符串
   * @returns {ValidationResult} 验证结果
   */
  validate(jsonString)
  
  /**
   * 格式化 JSON 字符串
   * @param {string} jsonString - 待格式化的 JSON 字符串
   * @param {number} indent - 缩进空格数，默认 2
   * @returns {FormatResult} 格式化结果
   */
  format(jsonString, indent = 2)
  
  /**
   * 压缩 JSON 字符串
   * @param {string} jsonString - 待压缩的 JSON 字符串
   * @returns {CompressResult} 压缩结果
   */
  compress(jsonString)
}
```

### 2. UI 管理器 (UIManager)

管理所有 UI 元素的更新和交互。

```javascript
class UIManager {
  /**
   * 初始化 UI 元素引用
   */
  constructor()
  
  /**
   * 获取输入区域的内容
   * @returns {string} 输入文本
   */
  getInputText()
  
  /**
   * 设置输出区域的内容
   * @param {string} text - 输出文本
   */
  setOutputText(text)
  
  /**
   * 显示错误消息
   * @param {string} message - 错误消息
   */
  showError(message)
  
  /**
   * 显示成功消息
   * @param {string} message - 成功消息
   */
  showSuccess(message)
  
  /**
   * 清空所有输入输出区域
   */
  clearAll()
  
  /**
   * 复制文本到剪贴板
   * @param {string} text - 待复制的文本
   * @returns {Promise<boolean>} 复制是否成功
   */
  copyToClipboard(text)
  
  /**
   * 显示加载指示器
   */
  showLoading()
  
  /**
   * 隐藏加载指示器
   */
  hideLoading()
}
```

### 3. 应用控制器 (AppController)

协调 UI 和 JSON 处理逻辑。

```javascript
class AppController {
  /**
   * 初始化应用
   * @param {UIManager} uiManager - UI 管理器实例
   * @param {JSONProcessor} jsonProcessor - JSON 处理器实例
   */
  constructor(uiManager, jsonProcessor)
  
  /**
   * 处理格式化操作
   */
  handleFormat()
  
  /**
   * 处理压缩操作
   */
  handleCompress()
  
  /**
   * 处理验证操作
   */
  handleValidate()
  
  /**
   * 处理复制操作
   */
  handleCopy()
  
  /**
   * 处理清空操作
   */
  handleClear()
  
  /**
   * 绑定所有事件监听器
   */
  bindEvents()
}
```

## 数据模型

### ValidationResult

```javascript
{
  isValid: boolean,      // JSON 是否有效
  message: string,       // 验证消息
  error: {               // 错误详情（如果有）
    line: number,        // 错误行号
    column: number,      // 错误列号
    description: string  // 错误描述
  } | null
}
```

### FormatResult

```javascript
{
  success: boolean,      // 格式化是否成功
  output: string,        // 格式化后的 JSON 字符串
  error: string | null   // 错误消息（如果有）
}
```

### CompressResult

```javascript
{
  success: boolean,      // 压缩是否成功
  output: string,        // 压缩后的 JSON 字符串
  originalSize: number,  // 原始大小（字节）
  compressedSize: number,// 压缩后大小（字节）
  error: string | null   // 错误消息（如果有）
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### 属性 1：输入内容保留

*对于任何* 文本字符串，当粘贴到输入区域后，读取的内容应该与原始文本完全相同

**验证需求：1.2**

### 属性 2：有效 JSON 格式化成功

*对于任何* 有效的 JSON 字符串，格式化操作应该成功并返回格式化后的输出

**验证需求：2.1**

### 属性 3：格式化输出符合规范

*对于任何* 有效的 JSON 字符串，格式化后的输出应该使用 2 个空格缩进，并在对象和数组元素之间包含适当的换行符

**验证需求：2.2, 2.3**

### 属性 4：无效输入显示错误

*对于任何* 无效的 JSON 字符串，执行格式化或压缩操作时应该显示错误消息而不是转换结果

**验证需求：2.4, 3.4**

### 属性 5：有效 JSON 压缩成功

*对于任何* 有效的 JSON 字符串，压缩操作应该成功并返回移除所有不必要空白字符的输出

**验证需求：3.1, 3.2**

### 属性 6：JSON 往返一致性

*对于任何* 有效的 JSON 对象，经过压缩（或格式化）后再解析，应该得到语义等价的数据结构

**验证需求：3.3**

### 属性 7：验证结果完整性

*对于任何* 输入字符串，验证操作应该总是返回包含 isValid 标志和相应消息的验证结果

**验证需求：4.1**

### 属性 8：有效 JSON 验证成功

*对于任何* 语法正确的 JSON 字符串，验证结果应该标记为有效并显示成功消息

**验证需求：4.2**

### 属性 9：无效 JSON 提供错误详情

*对于任何* 语法错误的 JSON 字符串，验证结果应该标记为无效并提供错误消息和位置信息（如果可确定）

**验证需求：4.3**

### 属性 10：复制功能正确性

*对于任何* 输出区域的内容，点击复制按钮后，系统剪贴板应该包含完全相同的文本

**验证需求：5.2**

### 属性 11：清空操作完全清除

*对于任何* 应用状态（包含任意输入、输出和消息），点击清空按钮后，输入区域、输出区域和所有提示消息都应该被清空

**验证需求：6.2, 6.3, 6.4**

### 属性 12：响应式布局适配

*对于任何* 视口宽度，页面布局应该适当调整以保持可用性（桌面端并排显示，移动端垂直堆叠）

**验证需求：7.1, 7.2, 7.3**

### 属性 13：错误消息包含类型信息

*对于任何* 导致解析失败的 JSON 输入，错误消息应该包含具体的错误类型描述

**验证需求：8.1**

### 属性 14：错误位置信息

*对于任何* 可定位的 JSON 语法错误，错误消息应该包含行号和列号信息

**验证需求：8.2**

## 错误处理

### 错误类型

1. **JSON 语法错误**
   - 缺少引号
   - 缺少逗号或冒号
   - 括号不匹配
   - 非法字符
   - 尾随逗号

2. **系统错误**
   - 剪贴板访问失败
   - 内存不足（处理超大 JSON）

### 错误处理策略

- 所有 JSON 处理操作使用 try-catch 包裹
- 解析错误时提取错误位置信息（通过解析 JavaScript 错误消息）
- 用户友好的错误消息映射（将技术错误转换为易懂的描述）
- 错误状态不影响其他功能的可用性

### 错误消息格式

```javascript
{
  type: 'error' | 'success' | 'info',
  message: string,
  details: {
    line?: number,
    column?: number,
    suggestion?: string
  }
}
```

## 测试策略

### 双重测试方法

本项目采用单元测试和基于属性的测试相结合的方法，以确保全面的代码覆盖和正确性验证。

- **单元测试**：验证特定示例、边界条件和错误情况
- **基于属性的测试**：验证跨所有输入的通用属性

两者是互补的，共同提供全面的测试覆盖。单元测试捕获具体的错误，基于属性的测试验证一般正确性。

### 单元测试

单元测试专注于：
- 特定的 JSON 示例（空对象、嵌套数组、特殊字符）
- 边界条件（空字符串、超大 JSON、1MB 输入）
- 错误情况（各种类型的无效 JSON）
- UI 交互（按钮点击、文本输入）
- 集成点（组件之间的交互）

避免编写过多的单元测试 - 基于属性的测试已经覆盖了大量输入场景。

### 基于属性的测试

使用 **fast-check** 库（JavaScript 的属性测试库）进行基于属性的测试。

**配置要求**：
- 每个属性测试至少运行 100 次迭代（由于随机化）
- 每个测试必须引用其设计文档中的属性
- 标签格式：**Feature: json-converter-tool, Property {number}: {property_text}**
- 每个正确性属性必须由单个基于属性的测试实现

**测试覆盖**：
- 属性 1-14：所有正确性属性都应该有对应的基于属性的测试
- 使用 fast-check 的任意生成器生成随机 JSON 数据
- 使用自定义生成器创建有效和无效的 JSON 字符串

### 测试工具

- **测试框架**：Jest 或 Vitest
- **属性测试库**：fast-check
- **DOM 测试**：@testing-library/dom
- **覆盖率工具**：内置于测试框架

### 测试文件结构

```
tests/
├── unit/
│   ├── json-processor.test.js
│   ├── ui-manager.test.js
│   └── app-controller.test.js
├── property/
│   ├── json-operations.property.test.js
│   ├── ui-interactions.property.test.js
│   └── error-handling.property.test.js
└── integration/
    └── app.integration.test.js
```

## 实现注意事项

### 性能优化

1. **大文件处理**
   - 对于超过 100KB 的输入，使用 Web Worker 进行处理
   - 显示加载指示器避免 UI 冻结
   - 考虑使用流式处理或分块处理

2. **DOM 更新**
   - 使用 requestAnimationFrame 优化 UI 更新
   - 防抖输入事件（实时验证）

3. **内存管理**
   - 及时清理大型字符串引用
   - 避免不必要的字符串复制

### 浏览器兼容性

- 目标浏览器：现代浏览器（Chrome、Firefox、Safari、Edge）最近两个版本
- 使用标准 Web API（避免需要 polyfill）
- Clipboard API 需要 HTTPS 或 localhost

### 可访问性

- 所有交互元素支持键盘导航
- 适当的 ARIA 标签
- 足够的颜色对比度
- 屏幕阅读器友好的错误消息

### 安全性

- 所有处理在客户端进行，无数据传输
- 不使用 eval() 或类似的不安全函数
- 使用原生 JSON.parse() 和 JSON.stringify()
