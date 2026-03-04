import { UIManager } from './UIManager';
import { JSONProcessor } from './JSONProcessor';

/**
 * 应用控制器类
 * 协调 UI 和 JSON 处理逻辑
 */
export class AppController {
  private uiManager: UIManager;
  private jsonProcessor: JSONProcessor;

  constructor(uiManager: UIManager, jsonProcessor: JSONProcessor) {
    this.uiManager = uiManager;
    this.jsonProcessor = jsonProcessor;
  }

  /**
   * 处理格式化操作
   */
  handleFormat(): void {
    const input = this.uiManager.getInputText();
    
    if (!input.trim()) {
      this.uiManager.showError('请输入 JSON 数据');
      return;
    }

    this.uiManager.showLoading();

    // 使用 setTimeout 避免阻塞 UI
    setTimeout(() => {
      const result = this.jsonProcessor.format(input);
      
      if (result.success) {
        this.uiManager.setOutputText(result.output);
        this.uiManager.showSuccess('格式化成功');
        this.uiManager.addToHistory(input);
      } else {
        this.uiManager.showError(result.error || '格式化失败');
      }
      
      this.uiManager.hideLoading();
    }, 0);
  }

  /**
   * 处理压缩操作
   */
  handleCompress(): void {
    const input = this.uiManager.getInputText();
    
    if (!input.trim()) {
      this.uiManager.showError('请输入 JSON 数据');
      return;
    }

    this.uiManager.showLoading();

    setTimeout(() => {
      const result = this.jsonProcessor.compress(input);
      
      if (result.success) {
        this.uiManager.setOutputText(result.output);
        const saved = result.originalSize - result.compressedSize;
        const percent = ((saved / result.originalSize) * 100).toFixed(1);
        this.uiManager.showSuccess(`压缩成功，节省 ${saved} 字节 (${percent}%)`);
        this.uiManager.addToHistory(input);
      } else {
        this.uiManager.showError(result.error || '压缩失败');
      }
      
      this.uiManager.hideLoading();
    }, 0);
  }

  /**
   * 处理验证操作
   */
  handleValidate(): void {
    const input = this.uiManager.getInputText();
    
    if (!input.trim()) {
      this.uiManager.showError('请输入 JSON 数据');
      return;
    }

    const result = this.jsonProcessor.validate(input);
    
    if (result.isValid) {
      this.uiManager.showSuccess(result.message);
    } else {
      let errorMsg = result.message;
      if (result.error && result.error.column > 0) {
        errorMsg += ` (位置: ${result.error.column})`;
      }
      this.uiManager.showError(errorMsg);
    }
  }

  /**
   * 处理转义操作
   */
  handleEscape(): void {
    const input = this.uiManager.getInputText();
    
    if (!input.trim()) {
      this.uiManager.showError('请输入 JSON 数据');
      return;
    }

    const result = this.jsonProcessor.escapeJson(input);
    
    if (result.success) {
      this.uiManager.setOutputText(result.output);
      this.uiManager.showSuccess('转义成功');
    } else {
      this.uiManager.showError(result.error || '转义失败');
    }
  }

  /**
   * 处理去转义操作
   */
  handleUnescape(): void {
    const input = this.uiManager.getInputText();
    
    if (!input.trim()) {
      this.uiManager.showError('请输入转义字符串');
      return;
    }

    const result = this.jsonProcessor.unescapeJson(input);
    
    if (result.success) {
      this.uiManager.setOutputText(result.output);
      this.uiManager.showSuccess('去转义成功');
    } else {
      this.uiManager.showError(result.error || '去转义失败');
    }
  }

  /**
   * 处理复制操作
   */
  async handleCopy(): Promise<void> {
    const output = this.uiManager.getOutputText();
    
    if (!output.trim()) {
      this.uiManager.showError('没有可复制的内容');
      return;
    }

    const success = await this.uiManager.copyToClipboard(output);
    
    if (success) {
      this.uiManager.showSuccess('已复制到剪贴板');
    } else {
      this.uiManager.showError('复制失败，请手动复制');
    }
  }

  /**
   * 处理清空操作
   */
  handleClear(): void {
    this.uiManager.clearAll();
    this.uiManager.showInfo('已清空所有内容');
  }

  /**
   * 绑定所有事件监听器
   */
  bindEvents(): void {
    const formatBtn = document.getElementById('format-btn');
    const compressBtn = document.getElementById('compress-btn');
    const escapeBtn = document.getElementById('escape-btn');
    const unescapeBtn = document.getElementById('unescape-btn');
    const validateBtn = document.getElementById('validate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    if (formatBtn) {
      formatBtn.addEventListener('click', () => this.handleFormat());
    }

    if (compressBtn) {
      compressBtn.addEventListener('click', () => this.handleCompress());
    }

    if (escapeBtn) {
      escapeBtn.addEventListener('click', () => this.handleEscape());
    }

    if (unescapeBtn) {
      unescapeBtn.addEventListener('click', () => this.handleUnescape());
    }

    if (validateBtn) {
      validateBtn.addEventListener('click', () => this.handleValidate());
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.handleCopy());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.handleClear());
    }
  }
}
