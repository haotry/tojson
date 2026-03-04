import { UIManager } from './UIManager';
import { JSONProcessor } from './JSONProcessor';
import { AppController } from './AppController';

/**
 * 应用初始化
 */
function initApp(): void {
  try {
    // 实例化核心组件
    const uiManager = new UIManager();
    const jsonProcessor = new JSONProcessor();
    const appController = new AppController(uiManager, jsonProcessor);

    // 绑定事件监听器
    appController.bindEvents();

    console.log('JSON 转换工具已启动');
  } catch (error) {
    console.error('应用初始化失败:', error);
    alert('应用初始化失败，请刷新页面重试');
  }
}

// DOM 加载完成后初始化应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
