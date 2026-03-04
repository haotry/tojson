import { describe, it, expect } from 'vitest';
import { JSONProcessor } from '../../src/JSONProcessor';

describe('JSONProcessor', () => {
  const processor = new JSONProcessor();

  describe('validate', () => {
    it('应该验证有效的 JSON 对象', () => {
      const result = processor.validate('{"name": "test"}');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('JSON 格式正确');
      expect(result.error).toBeNull();
    });

    it('应该验证有效的 JSON 数组', () => {
      const result = processor.validate('[1, 2, 3]');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('应该检测无效的 JSON', () => {
      const result = processor.validate('{invalid}');
      expect(result.isValid).toBe(false);
      expect(result.error).not.toBeNull();
      expect(result.message).toBeTruthy();
    });

    it('应该检测缺少闭合括号', () => {
      const result = processor.validate('{"name": "test"');
      expect(result.isValid).toBe(false);
      expect(result.error).not.toBeNull();
    });
  });

  describe('format', () => {
    it('应该格式化有效的 JSON', () => {
      const result = processor.format('{"name":"test","age":25}');
      expect(result.success).toBe(true);
      expect(result.output).toContain('\n');
      expect(result.output).toContain('  '); // 2 空格缩进
      expect(result.error).toBeNull();
    });

    it('应该使用 2 空格缩进', () => {
      const result = processor.format('{"a":{"b":"c"}}');
      expect(result.success).toBe(true);
      const lines = result.output.split('\n');
      expect(lines[1]).toMatch(/^  /); // 第二行应该有 2 空格缩进
    });

    it('应该处理无效的 JSON', () => {
      const result = processor.format('{invalid}');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.output).toBe('');
    });

    it('应该格式化嵌套对象', () => {
      const input = '{"user":{"name":"test","data":{"age":25}}}';
      const result = processor.format(input);
      expect(result.success).toBe(true);
      expect(result.output).toContain('\n');
    });
  });

  describe('compress', () => {
    it('应该压缩有效的 JSON', () => {
      const input = '{\n  "name": "test",\n  "age": 25\n}';
      const result = processor.compress(input);
      expect(result.success).toBe(true);
      expect(result.output).toBe('{"name":"test","age":25}');
      expect(result.error).toBeNull();
    });

    it('应该移除所有空白字符', () => {
      const input = '  {  "a"  :  "b"  }  ';
      const result = processor.compress(input);
      expect(result.success).toBe(true);
      expect(result.output).not.toContain(' ');
      expect(result.output).not.toContain('\n');
    });

    it('应该计算文件大小', () => {
      const input = '{\n  "name": "test"\n}';
      const result = processor.compress(input);
      expect(result.success).toBe(true);
      expect(result.originalSize).toBeGreaterThan(0);
      expect(result.compressedSize).toBeGreaterThan(0);
      expect(result.compressedSize).toBeLessThan(result.originalSize);
    });

    it('应该处理无效的 JSON', () => {
      const result = processor.compress('{invalid}');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('应该保持语义完整性', () => {
      const input = '{"name":"test","items":[1,2,3]}';
      const result = processor.compress(input);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.output);
      expect(parsed).toEqual({ name: 'test', items: [1, 2, 3] });
    });
  });
});
