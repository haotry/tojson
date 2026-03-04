import type { ValidationResult, FormatResult, CompressResult, EscapeResult } from './types';

/**
 * JSON 处理器类
 * 负责所有 JSON 相关的核心操作：验证、格式化、压缩
 */
export class JSONProcessor {
  /**
   * 验证 JSON 字符串
   * @param jsonString - 待验证的 JSON 字符串
   * @returns 验证结果
   */
  validate(jsonString: string): ValidationResult {
    const trimmed = jsonString.trim();
    
    if (!trimmed) {
      return {
        isValid: false,
        message: 'JSON 不能为空',
        error: {
          line: 0,
          column: 0,
          description: 'JSON 不能为空'
        }
      };
    }
    
    try {
      // 解析 JSON
      const parsed = JSON.parse(trimmed);
      
      // 检查解析后的类型，只接受对象和数组
      if (typeof parsed !== 'object' || parsed === null) {
        return {
          isValid: false,
          message: 'JSON 必须是对象或数组',
          error: {
            line: 0,
            column: 0,
            description: '有效的 JSON 应该以 { 或 [ 开头'
          }
        };
      }
      
      return {
        isValid: true,
        message: 'JSON 格式正确',
        error: null
      };
    } catch (error) {
      const errorInfo = this.parseError(error as Error);
      return {
        isValid: false,
        message: errorInfo.description,
        error: errorInfo
      };
    }
  }

  /**
   * 解析 JSON 错误并提取位置信息
   * @param error - JavaScript 错误对象
   * @returns 错误详情
   */
  private parseError(error: Error): { line: number; column: number; description: string } {
    const message = error.message;
    
    // 尝试从错误消息中提取行号和列号
    // 例如: "Unexpected token } in JSON at position 15"
    const positionMatch = message.match(/position (\d+)/);
    
    let line = 0;
    let column = 0;
    
    if (positionMatch) {
      const position = parseInt(positionMatch[1], 10);
      // 简化处理：将位置作为列号
      column = position;
    }
    
    // 提取错误描述
    let description = message;
    
    // 常见错误类型映射
    if (message.includes('Unexpected token')) {
      description = 'JSON 语法错误：发现意外的字符';
    } else if (message.includes('Unexpected end')) {
      description = 'JSON 语法错误：意外的结束，可能缺少闭合括号';
    } else if (message.includes('Expected')) {
      description = 'JSON 语法错误：缺少必要的字符';
    } else if (message.includes('property name')) {
      description = 'JSON 语法错误：属性名必须使用双引号';
    }
    
    return { line, column, description };
  }

  /**
   * 格式化 JSON 字符串
   * @param jsonString - 待格式化的 JSON 字符串
   * @param indent - 缩进空格数，默认 2
   * @returns 格式化结果
   */
  format(jsonString: string, indent: number = 2): FormatResult {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, indent);
      return {
        success: true,
        output: formatted,
        error: null
      };
    } catch (error) {
      const errorInfo = this.parseError(error as Error);
      return {
        success: false,
        output: '',
        error: errorInfo.description
      };
    }
  }

  /**
   * 压缩 JSON 字符串
   * @param jsonString - 待压缩的 JSON 字符串
   * @returns 压缩结果
   */
  compress(jsonString: string): CompressResult {
    try {
      const parsed = JSON.parse(jsonString);
      const compressed = JSON.stringify(parsed);
      
      const originalSize = new Blob([jsonString]).size;
      const compressedSize = new Blob([compressed]).size;
      
      return {
        success: true,
        output: compressed,
        originalSize,
        compressedSize,
        error: null
      };
    } catch (error) {
      const errorInfo = this.parseError(error as Error);
      return {
        success: false,
        output: '',
        originalSize: 0,
        compressedSize: 0,
        error: errorInfo.description
      };
    }
  }

  /**
   * 转义 JSON 字符串（将 JSON 转换为可嵌入字符串的格式）
   * @param jsonString - 待转义的 JSON 字符串
   * @returns 转义结果
   */
  escapeJson(jsonString: string): EscapeResult {
    try {
      // 先验证 JSON 是否有效
      JSON.parse(jsonString);
      
      // 转义特殊字符
      const escaped = JSON.stringify(jsonString);
      
      return {
        success: true,
        output: escaped,
        error: null
      };
    } catch (error) {
      const errorInfo = this.parseError(error as Error);
      return {
        success: false,
        output: '',
        error: errorInfo.description
      };
    }
  }

  /**
   * 去除转义（将转义的字符串还原为 JSON）
   * @param escapedString - 已转义的字符串
   * @returns 去转义结果
   */
  unescapeJson(escapedString: string): EscapeResult {
    try {
      // 去除转义
      const unescaped = JSON.parse(escapedString);
      
      // 如果结果不是字符串，说明输入格式不对
      if (typeof unescaped !== 'string') {
        return {
          success: false,
          output: '',
          error: '输入不是有效的转义字符串'
        };
      }
      
      return {
        success: true,
        output: unescaped,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: '去转义失败：输入格式不正确'
      };
    }
  }
}
