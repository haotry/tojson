/**
 * UI 管理器类
 * 管理所有 UI 元素的更新和交互
 */
export class UIManager {
  private inputArea: HTMLTextAreaElement;
  private outputArea: HTMLTextAreaElement;
  private treeView: HTMLElement;
  private messageContainer: HTMLElement;
  private loadingIndicator: HTMLElement;
  private textViewBtn: HTMLButtonElement;
  private treeViewBtn: HTMLButtonElement;
  private treeControls: HTMLElement;
  private expandAllBtn: HTMLButtonElement;
  private collapseAllBtn: HTMLButtonElement;
  private historySidebar: HTMLElement;
  private historyOverlay: HTMLElement;
  private historyList: HTMLElement;
  private historyBtn: HTMLButtonElement;
  private closeHistoryBtn: HTMLButtonElement;
  private clearHistoryBtn: HTMLButtonElement;
  private currentView: 'text' | 'tree' = 'text';
  private history: Array<{ time: string; data: string }> = [];
  private readonly MAX_HISTORY = 50;

  constructor() {
    this.inputArea = document.getElementById('input-area') as HTMLTextAreaElement;
    this.outputArea = document.getElementById('output-area') as HTMLTextAreaElement;
    this.treeView = document.getElementById('tree-view') as HTMLElement;
    this.messageContainer = document.getElementById('message-container') as HTMLElement;
    this.loadingIndicator = document.getElementById('loading-indicator') as HTMLElement;
    this.textViewBtn = document.getElementById('text-view-btn') as HTMLButtonElement;
    this.treeViewBtn = document.getElementById('tree-view-btn') as HTMLButtonElement;
    this.treeControls = document.getElementById('tree-controls') as HTMLElement;
    this.expandAllBtn = document.getElementById('expand-all-btn') as HTMLButtonElement;
    this.collapseAllBtn = document.getElementById('collapse-all-btn') as HTMLButtonElement;
    this.historySidebar = document.getElementById('history-sidebar') as HTMLElement;
    this.historyOverlay = document.getElementById('history-overlay') as HTMLElement;
    this.historyList = document.getElementById('history-list') as HTMLElement;
    this.historyBtn = document.getElementById('history-btn') as HTMLButtonElement;
    this.closeHistoryBtn = document.getElementById('close-history-btn') as HTMLButtonElement;
    this.clearHistoryBtn = document.getElementById('clear-history-btn') as HTMLButtonElement;

    if (!this.inputArea || !this.outputArea || !this.treeView || !this.messageContainer || !this.loadingIndicator) {
      throw new Error('Required DOM elements not found');
    }

    this.setupViewToggle();
    this.setupTreeControls();
    this.setupHistory();
    this.loadHistory();
  }

  /**
   * 设置历史记录功能
   */
  private setupHistory(): void {
    this.historyBtn?.addEventListener('click', () => this.openHistory());
    this.closeHistoryBtn?.addEventListener('click', () => this.closeHistory());
    this.historyOverlay?.addEventListener('click', () => this.closeHistory());
    this.clearHistoryBtn?.addEventListener('click', () => this.clearHistory());
  }

  /**
   * 打开历史记录
   */
  private openHistory(): void {
    this.historySidebar.classList.add('open');
    this.historyOverlay.classList.add('open');
    this.renderHistory();
  }

  /**
   * 关闭历史记录
   */
  private closeHistory(): void {
    this.historySidebar.classList.remove('open');
    this.historyOverlay.classList.remove('open');
  }

  /**
   * 添加到历史记录
   */
  addToHistory(data: string): void {
    if (!data.trim()) return;
    
    // 检查是否已存在相同内容
    const existingIndex = this.history.findIndex(item => item.data === data);
    
    if (existingIndex !== -1) {
      // 如果已存在，移除旧的记录
      this.history.splice(existingIndex, 1);
    }
    
    // 添加到最前面
    const time = new Date().toLocaleString('zh-CN');
    this.history.unshift({ time, data });
    
    // 限制历史记录数量
    if (this.history.length > this.MAX_HISTORY) {
      this.history = this.history.slice(0, this.MAX_HISTORY);
    }
    
    this.saveHistory();
  }

  /**
   * 保存历史记录到 localStorage
   */
  private saveHistory(): void {
    try {
      localStorage.setItem('json-tool-history', JSON.stringify(this.history));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }

  /**
   * 从 localStorage 加载历史记录
   */
  private loadHistory(): void {
    try {
      const saved = localStorage.getItem('json-tool-history');
      if (saved) {
        this.history = JSON.parse(saved);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
      this.history = [];
    }
  }

  /**
   * 渲染历史记录列表
   */
  private renderHistory(): void {
    if (this.history.length === 0) {
      this.historyList.innerHTML = '<div class="history-empty">暂无历史记录</div>';
      return;
    }
    
    this.historyList.innerHTML = this.history.map((item, index) => {
      const preview = item.data.substring(0, 100).replace(/\n/g, ' ');
      return `
        <div class="history-item" data-index="${index}">
          <div class="history-item-header">
            <span class="history-item-time">${item.time}</span>
            <button class="history-item-delete" data-index="${index}" title="删除">×</button>
          </div>
          <div class="history-item-preview">${preview}${item.data.length > 100 ? '...' : ''}</div>
        </div>
      `;
    }).join('');
    
    // 绑定点击事件
    this.historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('history-item-delete')) {
          const index = parseInt((e.currentTarget as HTMLElement).dataset.index || '0');
          this.loadFromHistory(index);
        }
      });
    });
    
    // 绑定删除事件
    this.historyList.querySelectorAll('.history-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt((e.currentTarget as HTMLElement).dataset.index || '0');
        this.deleteHistoryItem(index);
      });
    });
  }

  /**
   * 从历史记录加载数据
   */
  private loadFromHistory(index: number): void {
    if (this.history[index]) {
      this.inputArea.value = this.history[index].data;
      this.closeHistory();
      this.showSuccess('已加载历史记录');
    }
  }

  /**
   * 删除单条历史记录
   */
  private deleteHistoryItem(index: number): void {
    this.history.splice(index, 1);
    this.saveHistory();
    this.renderHistory();
    this.showInfo('已删除');
  }

  /**
   * 清空所有历史记录
   */
  private clearHistory(): void {
    if (confirm('确定要清空所有历史记录吗？')) {
      this.history = [];
      this.saveHistory();
      this.renderHistory();
      this.showInfo('历史记录已清空');
    }
  }

  /**
   * 设置视图切换
   */
  private setupViewToggle(): void {
    this.textViewBtn?.addEventListener('click', () => this.switchView('text'));
    this.treeViewBtn?.addEventListener('click', () => this.switchView('tree'));
  }

  /**
   * 设置树形控制按钮
   */
  private setupTreeControls(): void {
    this.expandAllBtn?.addEventListener('click', () => this.expandAll());
    this.collapseAllBtn?.addEventListener('click', () => this.collapseAll());
  }

  /**
   * 展开所有节点
   */
  private expandAll(): void {
    const toggles = this.treeView.querySelectorAll('.tree-toggle');
    const nodes = this.treeView.querySelectorAll('.tree-node');
    
    toggles.forEach(toggle => {
      (toggle as HTMLElement).textContent = '▼';
    });
    
    nodes.forEach(node => {
      (node as HTMLElement).style.display = 'block';
    });
  }

  /**
   * 收起所有节点
   */
  private collapseAll(): void {
    const toggles = this.treeView.querySelectorAll('.tree-toggle');
    const nodes = this.treeView.querySelectorAll('.tree-node');
    
    toggles.forEach(toggle => {
      (toggle as HTMLElement).textContent = '▶';
    });
    
    nodes.forEach(node => {
      (node as HTMLElement).style.display = 'none';
    });
  }

  /**
   * 切换视图模式
   */
  private switchView(view: 'text' | 'tree'): void {
    this.currentView = view;
    
    if (view === 'text') {
      this.outputArea.style.display = 'block';
      this.treeView.style.display = 'none';
      this.treeControls.style.display = 'none';
      this.textViewBtn.classList.add('active');
      this.treeViewBtn.classList.remove('active');
    } else {
      this.outputArea.style.display = 'none';
      this.treeView.style.display = 'block';
      this.treeControls.style.display = 'flex';
      this.textViewBtn.classList.remove('active');
      this.treeViewBtn.classList.add('active');
      
      // 更新树形视图
      this.updateTreeView();
    }
  }

  /**
   * 更新树形视图
   */
  private updateTreeView(): void {
    const text = this.outputArea.value;
    
    if (!text.trim()) {
      this.treeView.innerHTML = '<div style="color: #868e96; padding: 20px;">暂无数据</div>';
      return;
    }
    
    try {
      const data = JSON.parse(text);
      this.treeView.innerHTML = this.renderTree(data);
    } catch (error) {
      this.treeView.innerHTML = '<div style="color: #c92a2a; padding: 20px;">无法解析 JSON</div>';
    }
  }

  /**
   * 渲染树形结构
   */
  private renderTree(data: any, key?: string): string {
    const type = Array.isArray(data) ? 'array' : typeof data;
    
    if (type === 'object' && data !== null) {
      const isArray = Array.isArray(data);
      const entries = isArray ? data.map((v, i) => [i, v]) : Object.entries(data);
      const isEmpty = entries.length === 0;
      
      const openBracket = isArray ? '[' : '{';
      const closeBracket = isArray ? ']' : '}';
      
      if (isEmpty) {
        return key 
          ? `<div><span class="tree-key">"${key}"</span>: ${openBracket}${closeBracket}</div>`
          : `<div>${openBracket}${closeBracket}</div>`;
      }
      
      const id = Math.random().toString(36).substr(2, 9);
      const keyHtml = key ? `<span class="tree-key">"${key}"</span>: ` : '';
      
      let html = `<div>
        <span class="tree-toggle" onclick="this.textContent = this.textContent === '▼' ? '▶' : '▼'; this.parentElement.querySelector('.tree-node').style.display = this.textContent === '▼' ? 'block' : 'none';">▼</span>
        ${keyHtml}${openBracket}
        <div class="tree-node" id="${id}">`;
      
      entries.forEach(([k, v], index) => {
        html += this.renderTree(v, String(k));
        if (index < entries.length - 1) html += ',';
        html += '\n';
      });
      
      html += `</div>${closeBracket}</div>`;
      return html;
    } else if (type === 'array') {
      return this.renderTree(data, key);
    } else {
      const valueClass = type === 'string' ? 'string' : 
                        type === 'number' ? 'number' : 
                        type === 'boolean' ? 'boolean' : 'null';
      const valueStr = type === 'string' ? `"${data}"` : String(data);
      
      return key
        ? `<div><span class="tree-key">"${key}"</span>: <span class="tree-value ${valueClass}">${valueStr}</span></div>`
        : `<div><span class="tree-value ${valueClass}">${valueStr}</span></div>`;
    }
  }

  /**
   * 获取输入区域的内容
   * @returns 输入文本
   */
  getInputText(): string {
    return this.inputArea.value;
  }

  /**
   * 获取输出区域的内容
   * @returns 输出文本
   */
  getOutputText(): string {
    return this.outputArea.value;
  }

  /**
   * 设置输出区域的内容
   * @param text - 输出文本
   */
  setOutputText(text: string): void {
    this.outputArea.value = text;
    
    // 如果当前是树形视图，更新树形视图
    if (this.currentView === 'tree') {
      this.updateTreeView();
    }
  }

  /**
   * 显示错误消息
   * @param message - 错误消息
   */
  showError(message: string): void {
    this.showMessage(message, 'error');
  }

  /**
   * 显示成功消息
   * @param message - 成功消息
   */
  showSuccess(message: string): void {
    this.showMessage(message, 'success');
  }

  /**
   * 显示信息消息
   * @param message - 信息消息
   */
  showInfo(message: string): void {
    this.showMessage(message, 'info');
  }

  /**
   * 显示消息
   * @param message - 消息内容
   * @param type - 消息类型
   */
  private showMessage(message: string, type: 'error' | 'success' | 'info'): void {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;

    this.messageContainer.appendChild(messageElement);

    // 3 秒后自动移除消息
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }

  /**
   * 清空所有输入输出区域
   */
  clearAll(): void {
    this.inputArea.value = '';
    this.outputArea.value = '';
    this.messageContainer.innerHTML = '';
  }

  /**
   * 复制文本到剪贴板
   * @param text - 待复制的文本
   * @returns 复制是否成功
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('复制失败:', error);
      return false;
    }
  }

  /**
   * 显示加载指示器
   */
  showLoading(): void {
    this.loadingIndicator.style.display = 'flex';
  }

  /**
   * 隐藏加载指示器
   */
  hideLoading(): void {
    this.loadingIndicator.style.display = 'none';
  }
}
