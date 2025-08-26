// Gemini AI Assistant for Hexo Blog
class GeminiAIAssistant {
    constructor() {
        this.apiKey = 'AIzaSyDrL3kgy7cM2NQwLxVks66e1pCwmXpy9Js';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.currentAgent = 'gemini';
        this.chatHistory = [];
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.init();
    }

         init() {
         this.createChatWidget();
         this.bindEvents();
         this.loadChatHistory();
         this.loadPosition();
         this.loadTheme();
         
         // 设置默认Agent为活跃状态
         document.querySelector('[data-agent="gemini"]').classList.add('active');
         

     }

    createChatWidget() {
        const chatHTML = `
            <div id="gemini-ai-assistant" class="ai-assistant-widget">
                <div class="ai-chat-header" id="ai-chat-header">
                    <div class="ai-agent-avatar">
                        <img src="/assets/gemini_avatar.png" alt="Gemini AI" id="current-agent-avatar">
                    </div>
                                                                                                                             <div class="ai-agent-info">
                           <div class="ai-title" id="current-agent-name">Gemini AI</div>
                       </div>
                                                                                   <!-- 功能按钮区域 - 简化设计 -->
                      <div class="ai-header-buttons">
                          <button class="ai-function-btn" id="ai-summary-btn" title="总结文章">
                              <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14,2 14,8 20,8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10,9 9,9 8,9"></polyline>
                              </svg>
                          </button>
                          <button class="ai-function-btn" id="ai-theme-btn" title="切换主题">
                              <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <circle cx="12" cy="12" r="5"></circle>
                                  <line x1="12" y1="1" x2="12" y2="3"></line>
                                  <line x1="12" y1="21" x2="12" y2="23"></line>
                                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                  <line x1="1" y1="12" x2="3" y2="12"></line>
                                  <line x1="21" y1="12" x2="23" y2="12"></line>
                                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                              </svg>
                          </button>
                          <div class="ai-dropdown-menu">
                              <button class="ai-function-btn ai-dropdown-toggle" id="ai-dropdown-toggle" title="更多功能">
                                  <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                      <circle cx="12" cy="12" r="1"></circle>
                                      <circle cx="19" cy="12" r="1"></circle>
                                      <circle cx="5" cy="12" r="1"></circle>
                                  </svg>
                              </button>
                              <div class="ai-dropdown-content" id="ai-dropdown-content">
                                  <button class="ai-dropdown-item" id="ai-improve-btn" title="改进建议">
                                      <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                          <path d="M12 20h9"></path>
                                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                      </svg>
                                      <span>改进建议</span>
                                  </button>
                                  <button class="ai-dropdown-item" id="ai-clear-btn" title="清空聊天">
                                      <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                          <polyline points="3,6 5,6 21,6"></polyline>
                                          <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                          <line x1="10" y1="11" x2="10" y2="17"></line>
                                          <line x1="14" y1="11" x2="14" y2="17"></line>
                                      </svg>
                                      <span>清空聊天</span>
                                  </button>
                                  <button class="ai-dropdown-item" id="ai-export-btn" title="导出聊天">
                                      <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                          <polyline points="7,10 12,15 17,10"></polyline>
                                          <line x1="12" y1="15" x2="12" y2="3"></line>
                                      </svg>
                                      <span>导出聊天</span>
                                  </button>
                                  <button class="ai-dropdown-item" id="ai-web-search-btn" title="网络搜索">
                                      <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                      </svg>
                                      <span>网络搜索</span>
                                  </button>
                                  <button class="ai-dropdown-item" id="ai-help-btn" title="AI助手帮助">
                                      <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                          <circle cx="12" cy="12" r="10"></circle>
                                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                      </svg>
                                      <span>AI助手帮助</span>
                                  </button>
                              </div>
                          </div>
                      </div>
                </div>
                
                                 <div class="ai-chat-body" id="ai-chat-body">
                     <div class="ai-messages" id="ai-messages"></div>
                     

                     
                     <div class="ai-input-area">
                        <div class="ai-input-wrapper">
                            <textarea 
                                id="ai-input" 
                                placeholder="请输入问题"
                                rows="1"
                            ></textarea>
                        </div>
                        <button id="ai-send-btn" class="ai-send-btn" title="发送消息">
                            <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22,2 15,22 11,13 2,9"/>
                            </svg>
                        </button>
                        <button class="ai-input-btn" id="ai-toggle-btn" title="设置">
                            <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Agent Selector -->
                <div class="ai-agent-selector" id="ai-agent-selector">
                                                                                                                                                                       <div class="ai-agent-option" data-agent="gemini">
                           <div class="ai-agent-option-avatar">
                               <img src="/assets/gemini_avatar.png" alt="Gemini AI">
                           </div>
                           <div class="ai-agent-option-name">Gemini AI</div>
                       </div>
                     <div class="ai-agent-option" data-agent="claude">
                         <div class="ai-agent-option-avatar">
                             <img src="/assets/claude_avatar.png" alt="Claude AI">
                         </div>
                         <div class="ai-agent-option-name">Claude AI</div>
                     </div>
                     <div class="ai-agent-option" data-agent="gpt">
                         <div class="ai-agent-option-avatar">
                             <img src="/assets/openai_avatar.png" alt="GPT AI">
                         </div>
                         <div class="ai-agent-option-name">GPT AI</div>
                     </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

         bindEvents() {
         const toggleBtn = document.getElementById('ai-toggle-btn');
         const sendBtn = document.getElementById('ai-send-btn');
         const input = document.getElementById('ai-input');
         const header = document.getElementById('ai-chat-header');
         const agentSelector = document.getElementById('ai-agent-selector');
         const summaryBtn = document.getElementById('ai-summary-btn');
         const themeBtn = document.getElementById('ai-theme-btn');

        // Agent选择器切换
        toggleBtn.addEventListener('click', () => this.toggleAgentSelector());
        
        // Agent选择
        agentSelector.addEventListener('click', (e) => {
            const option = e.target.closest('.ai-agent-option');
            if (option) {
                const agentType = option.dataset.agent;
                this.switchAgent(agentType);
            }
        });

                                                                       // 功能按钮事件
           summaryBtn.addEventListener('click', () => this.summarizeArticle());
           themeBtn.addEventListener('click', () => this.toggleTheme());
           
           // 下拉菜单切换
           const dropdownToggle = document.getElementById('ai-dropdown-toggle');
           const dropdownContent = document.getElementById('ai-dropdown-content');
           
           if (dropdownToggle && dropdownContent) {
               dropdownToggle.addEventListener('click', (e) => {
                   e.stopPropagation();
                   dropdownContent.classList.toggle('show');
                   dropdownToggle.classList.toggle('active');
               });
               
               // 点击外部关闭下拉菜单
               document.addEventListener('click', (e) => {
                   if (!e.target.closest('.ai-dropdown-menu')) {
                       dropdownContent.classList.remove('show');
                       dropdownToggle.classList.remove('active');
                   }
               });
           }
           
           // 下拉菜单中的功能按钮事件
           const improveBtn = document.getElementById('ai-improve-btn');
           const clearBtn = document.getElementById('ai-clear-btn');
           const exportBtn = document.getElementById('ai-export-btn');
           const webSearchBtn = document.getElementById('ai-web-search-btn');
           const helpBtn = document.getElementById('ai-help-btn');
           
           if (improveBtn) improveBtn.addEventListener('click', () => this.improveArticle());
           if (clearBtn) clearBtn.addEventListener('click', () => this.clearChat());
           if (exportBtn) exportBtn.addEventListener('click', () => this.exportChat());
           
           // 网络搜索按钮事件绑定
           if (webSearchBtn) {
               console.log('网络搜索按钮找到，绑定点击事件');
               webSearchBtn.addEventListener('click', () => {
                   console.log('网络搜索按钮被点击');
                   this.toggleWebSearch();
                   // 关闭下拉菜单
                   if (dropdownContent) {
                       dropdownContent.classList.remove('show');
                       dropdownToggle.classList.remove('active');
                   }
               });
           } else {
               console.error('网络搜索按钮未找到');
           }
           
           if (helpBtn) {
               helpBtn.addEventListener('click', () => {
                   this.showToast('💡 AI助手功能说明：\n1. 总结文章：分析当前页面内容\n2. 改进建议：提供文章优化建议\n3. 网络搜索：搜索网络信息\n4. 清空聊天：清除聊天记录\n5. 导出聊天：保存聊天记录');
                   // 关闭下拉菜单
                   if (dropdownContent) {
                       dropdownContent.classList.remove('show');
                       dropdownToggle.classList.remove('active');
                   }
               });
           }

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

                 // 自动调整输入框高度
         input.addEventListener('input', () => this.adjustInputHeight());
         
         // 初始化输入框高度
         input.style.height = '44px';
         document.querySelector('.ai-input-area').style.alignItems = 'center';

        // 拖拽功能
        header.addEventListener('mousedown', (e) => this.startDragging(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDragging());
        
        // 触摸设备支持
        header.addEventListener('touchstart', (e) => this.startDragging(e.touches[0]));
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        document.addEventListener('touchend', () => this.stopDragging());

                 // 点击外部关闭Agent选择器
         document.addEventListener('click', (e) => {
             if (!e.target.closest('#ai-toggle-btn') && !e.target.closest('#ai-agent-selector')) {
                 this.closeAgentSelector();
             }
         });
         
         // 网络搜索相关事件
         const webSearchInput = document.getElementById('ai-web-search-input');
         const webSearchExecuteBtn = document.getElementById('ai-web-search-execute-btn');
         
         if (webSearchInput && webSearchExecuteBtn) {
             // 回车键执行搜索
             webSearchInput.addEventListener('keypress', (e) => {
                 if (e.key === 'Enter') {
                     this.executeWebSearch();
                 }
             });
             
             // 点击搜索按钮
             webSearchExecuteBtn.addEventListener('click', () => this.executeWebSearch());
         }
         
         // 使用事件委托处理AI分析按钮点击
         document.addEventListener('click', (e) => {
             if (e.target.classList.contains('ai-web-search-analyze-btn')) {
                 const resultIndex = e.target.getAttribute('data-result-index');
                 if (resultIndex !== null) {
                     this.analyzeSearchResult(parseInt(resultIndex));
                 }
             }
         });
    }

    toggleAgentSelector() {
        const agentSelector = document.getElementById('ai-agent-selector');
        const toggleBtn = document.getElementById('ai-toggle-btn');
        
        if (agentSelector.classList.contains('show')) {
            this.closeAgentSelector();
        } else {
            agentSelector.classList.add('show');
            toggleBtn.classList.add('active');
        }
    }

         closeAgentSelector() {
         const agentSelector = document.getElementById('ai-agent-selector');
         const toggleBtn = document.getElementById('ai-toggle-btn');
         
         agentSelector.classList.remove('show');
         toggleBtn.classList.remove('active');
     }
     
     // 切换网络搜索功能
     toggleWebSearch() {
         console.log('toggleWebSearch方法被调用');
         const webSearchBtn = document.getElementById('ai-web-search-btn');
         
         if (!webSearchBtn) {
             console.error('网络搜索按钮未找到');
             this.showToast('❌ 网络搜索功能初始化失败');
             return;
         }
         
         if (webSearchBtn.classList.contains('active')) {
             // 关闭网络搜索模式
             webSearchBtn.classList.remove('active');
             this.showToast('🔍 网络搜索已关闭');
             
             // 恢复普通输入模式
             const input = document.getElementById('ai-input');
             if (input) {
                 input.placeholder = '请输入问题';
                 input.value = '';
             }
         } else {
             // 开启网络搜索模式
             webSearchBtn.classList.add('active');
             this.showToast('🔍 网络搜索已开启');
             
             // 切换到网络搜索模式
             const input = document.getElementById('ai-input');
             if (input) {
                 input.placeholder = '输入搜索关键词，按Enter搜索...';
                 input.value = '';
             }
         }
     }

    switchAgent(agentType) {
                           const agentConfigs = {
                             gemini: {
                   name: 'Gemini AI',
                   avatar: '/assets/gemini_avatar.png',
                   apiKey: 'AIzaSyDrL3kgy7cM2NQwLxVks66e1pCwmXpy9Js',
                   apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
               },
             claude: {
                 name: 'Claude AI',
                 avatar: '/assets/claude_avatar.png',
                 apiKey: 'your-claude-api-key',
                 apiUrl: 'https://api.anthropic.com/v1/messages'
             },
             gpt: {
                 name: 'GPT AI',
                 avatar: '/assets/openai_avatar.png',
                 apiKey: 'your-gpt-api-key',
                 apiUrl: 'https://api.openai.com/v1/chat/completions'
             }
         };

        const config = agentConfigs[agentType];
        if (config) {
            // 更新当前Agent配置
            this.currentAgent = agentType;
            this.apiKey = config.apiKey;
            this.apiUrl = config.apiUrl;

                         // 更新界面显示
             document.getElementById('current-agent-name').textContent = config.name;
             document.getElementById('current-agent-avatar').src = config.avatar;

            // 更新选择器中的活跃状态
            document.querySelectorAll('.ai-agent-option').forEach(option => {
                option.classList.remove('active');
            });
            document.querySelector(`[data-agent="${agentType}"]`).classList.add('active');

            // 关闭选择器
            this.closeAgentSelector();

            // 清空聊天记录
            this.clearChat();
        }
    }

    adjustInputHeight() {
        const input = document.getElementById('ai-input');
        input.style.height = 'auto';
        
        // 计算合适的高度，最小44px，最大120px
        const minHeight = 44;
        const maxHeight = 120;
        const scrollHeight = input.scrollHeight;
        
        // 如果内容超出最大高度，显示省略号
        if (scrollHeight > maxHeight) {
            input.style.height = maxHeight + 'px';
            // 在输入框底部显示"..."提示
            this.showInputOverflowHint();
        } else {
            const newHeight = Math.max(scrollHeight, minHeight);
            input.style.height = newHeight + 'px';
            
            // 如果高度等于最小高度，保持居中对齐
            if (newHeight === minHeight) {
                document.querySelector('.ai-input-area').style.alignItems = 'center';
            } else {
                document.querySelector('.ai-input-area').style.alignItems = 'flex-end';
            }
            
            this.hideInputOverflowHint();
        }
    }

    showInputOverflowHint() {
        let hint = document.getElementById('ai-input-overflow-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'ai-input-overflow-hint';
            hint.className = 'ai-input-overflow-hint';
            hint.textContent = '...';
            hint.style.cssText = `
                position: absolute;
                bottom: 8px;
                right: 16px;
                color: #86868b;
                font-size: 12px;
                pointer-events: none;
                z-index: 1;
            `;
            document.querySelector('.ai-input-wrapper').appendChild(hint);
        }
        hint.style.display = 'block';
    }

    hideInputOverflowHint() {
        const hint = document.getElementById('ai-input-overflow-hint');
        if (hint) {
            hint.style.display = 'none';
        }
    }

    clearChat() {
        if (confirm('确定要清空所有聊天记录吗？')) {
            const messagesContainer = document.getElementById('ai-messages');
            messagesContainer.innerHTML = '';
            this.chatHistory = [];
            localStorage.removeItem('gemini-chat-history');
        }
    }

    exportChat() {
        if (this.chatHistory.length === 0) {
            alert('没有聊天记录可以导出');
            return;
        }

        const exportData = {
            timestamp: new Date().toISOString(),
            agent: this.currentAgent,
            messages: this.chatHistory
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    toggleTheme() {
        const widget = document.getElementById('gemini-ai-assistant');
        const currentTheme = widget.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        widget.setAttribute('data-theme', newTheme);
        localStorage.setItem('ai-assistant-theme', newTheme);
        
        // 应用主题样式
        this.applyTheme(newTheme);
        
        // 显示主题切换提示
        this.showToast(`已切换到${newTheme === 'light' ? '浅色' : '深色'}主题`);
    }

    applyTheme(theme) {
        const widget = document.getElementById('gemini-ai-assistant');
        const header = document.querySelector('.ai-chat-header');
        const body = document.querySelector('.ai-chat-body');
        const messages = document.querySelector('.ai-messages');
        const inputArea = document.querySelector('.ai-input-area');
        const input = document.getElementById('ai-input');
        
        if (theme === 'dark') {
            // 深色主题
            widget.style.background = '#1a1a1a';
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
            body.style.background = '#2d2d2d';
            messages.style.background = '#2d2d2d';
            inputArea.style.background = '#2d2d2d';
            inputArea.style.borderTopColor = 'rgba(255, 255, 255, 0.1)';
            input.style.background = '#3d3d3d';
            input.style.color = '#ffffff';
            input.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)';
            
                         // 更新文字颜色
             document.querySelector('.ai-title').style.color = '#ffffff';
             document.querySelectorAll('.ai-btn-icon').forEach(icon => {
                 icon.style.color = '#ffffff';
             });
            
            // 更新消息样式
            document.querySelectorAll('.assistant-message .ai-message-text').forEach(msg => {
                msg.style.background = '#3d3d3d';
                msg.style.color = '#ffffff';
            });
            
        } else {
            // 浅色主题
            widget.style.background = '#ffffff';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.borderBottomColor = 'rgba(0, 0, 0, 0.1)';
            body.style.background = '#f8f9fa';
            messages.style.background = '#f8f9fa';
            inputArea.style.background = '#f8f9fa';
            inputArea.style.borderTopColor = 'rgba(0, 0, 0, 0.1)';
            input.style.background = '#ffffff';
            input.style.color = '#1d1d1f';
            input.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
            
                         // 恢复文字颜色
             document.querySelector('.ai-title').style.color = '#1d1d1f';
             document.querySelectorAll('.ai-btn-icon').forEach(icon => {
                 if (!icon.closest('.ai-send-btn')) {
                     icon.style.color = '#1d1d1f';
                 }
             });
            
            // 恢复消息样式
            document.querySelectorAll('.assistant-message .ai-message-text').forEach(msg => {
                msg.style.background = '#f2f2f7';
                msg.style.color = '#1d1d1f';
            });
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'ai-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

         startDragging(e) {
                           // 不拖拽按钮和输入区域
           if (e.target.closest('#ai-toggle-btn') || 
               e.target.closest('#ai-send-btn') || 
               e.target.closest('#ai-input') ||
               e.target.closest('#ai-summary-btn') ||
               e.target.closest('#ai-theme-btn') ||
               e.target.closest('.ai-dropdown-menu')) return;
        
        console.log('开始拖拽');
        this.isDragging = true;
        const widget = document.getElementById('gemini-ai-assistant');
        const rect = widget.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        e.currentTarget.style.cursor = 'grabbing';
        
        // 添加拖拽时的视觉反馈
        widget.style.transition = 'none';
        widget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6)';
        
        // 确保当前元素可以被拖拽
        widget.style.position = 'fixed';
        widget.style.zIndex = '10000';
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const widget = document.getElementById('gemini-ai-assistant');
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // 限制在视窗范围内，留出一些边距
        const margin = 10;
        const maxX = window.innerWidth - widget.offsetWidth - margin;
        const maxY = window.innerHeight - widget.offsetHeight - margin;
        
        const finalX = Math.max(margin, Math.min(x, maxX));
        const finalY = Math.max(margin, Math.min(y, maxY));
        
        // 强制设置位置，确保拖拽生效
        widget.style.left = finalX + 'px';
        widget.style.top = finalY + 'px';
        
        // 添加调试信息
        console.log('拖拽位置:', finalX, finalY);
    }

    stopDragging() {
        if (this.isDragging) {
            this.isDragging = false;
            const header = document.getElementById('ai-chat-header');
            const widget = document.getElementById('gemini-ai-assistant');
            
            header.style.cursor = 'grab';
            
            // 恢复拖拽前的样式
            widget.style.transition = 'all 0.3s ease';
            widget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            
            // 保存位置到本地存储
            this.savePosition();
        }
    }

         async sendMessage() {
         const input = document.getElementById('ai-input');
         const message = input.value.trim();
         const webSearchBtn = document.getElementById('ai-web-search-btn');
         
         if (!message) return;
 
         // 检查是否处于网络搜索模式
         if (webSearchBtn && webSearchBtn.classList.contains('active')) {
             // 网络搜索模式
             this.addMessage('user', `🔍 搜索：${message}`);
             input.value = '';
             
             // 重置输入框高度
             input.style.height = '44px';
             document.querySelector('.ai-input-area').style.alignItems = 'center';
             this.hideInputOverflowHint();
             
             // 执行网络搜索
             await this.executeWebSearchDirect(message);
         } else {
             // 普通聊天模式
             this.addMessage('user', message);
             input.value = '';
             
             // 重置输入框高度
             input.style.height = '44px';
             document.querySelector('.ai-input-area').style.alignItems = 'center';
             this.hideInputOverflowHint();
 
             // 显示AI正在思考
             const thinkingId = this.addMessage('assistant', '🤔 正在思考中...', true);
 
             try {
                 // 调用Gemini API
                 const response = await this.callGeminiAPI(message);
                 
                 // 移除思考消息，显示AI回复
                 this.removeMessage(thinkingId);
                 this.addMessage('assistant', response);
                 
                 // 保存到聊天历史
                 this.saveChatHistory(message, response);
                 
             } catch (error) {
                 console.error('AI API调用失败:', error);
                 this.removeMessage(thinkingId);
                 this.addMessage('assistant', '❌ 抱歉，我遇到了一些问题。请稍后再试。');
             }
         }
     }

         async callGeminiAPI(message) {
         // 检查是否是文章分析相关的问题
         const isArticleAnalysis = message.includes('总结') || 
                                  message.includes('分析') || 
                                  message.includes('改进') || 
                                  message.includes('文章') ||
                                  message.includes('内容');
         
         let prompt;
         
         if (isArticleAnalysis) {
             // 如果是文章分析，获取页面内容
             const pageContent = await this.getPageContent();
             
             prompt = `你是一个全能AI助手，现在需要分析当前页面的文章内容。

📝 **文章内容**：
${pageContent}

🎯 **分析要求**：
请根据用户的具体问题，对文章进行专业分析。用户问题：${message}

📚 **分析原则**：
- 用中文回答，语言清晰易懂
- 根据文章内容提供准确分析
- 提供具体建议和改进方案
- 结合文章主题给出专业见解
- 如果文章内容不足，请说明并提供通用建议

请直接给出分析结果，不需要询问其他问题。`;
         } else {
             // 如果是普通问题，使用通用知识回答
             prompt = `你是一个全能AI助手，具备以下能力：

🎯 **核心能力**：
- 通用知识问答：涵盖科技、历史、文化、艺术、科学、商业、教育、健康、娱乐、体育等各个领域
- 技术问题解答：编程、算法、系统设计、数据分析、人工智能、机器学习等
- 创意写作：文章创作、故事编写、诗歌创作、剧本创作等
- 学习指导：学习方法、资源推荐、技能提升建议、职业规划等
- 问题分析：逻辑推理、问题拆解、解决方案设计、决策建议等
- 生活咨询：健康建议、理财建议、旅行规划、美食推荐等
- 学术研究：论文写作、研究方法、数据分析、学术规范等

📚 **回答原则**：
- 用中文回答，语言清晰易懂
- 根据问题复杂度调整回答深度
- 提供具体例子和实用建议
- 承认知识边界，不编造信息
- 鼓励用户深入思考
- 主动提供相关知识和扩展信息

❓ **用户问题**：${message}

请直接回答用户问题，发挥你的专业知识，提供准确、详细、有用的信息。不需要询问是否与网站内容相关，直接给出专业回答。`;
         }

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('API响应格式错误');
        }
    }

         addMessage(role, content, isThinking = false) {
         const messagesContainer = document.getElementById('ai-messages');
         const messageId = 'msg-' + Date.now();
         
                   // 为AI回复添加功能按钮
          const actionButtons = role === 'assistant' && !isThinking ? `
              <div class="ai-message-actions">
                  <button class="ai-action-btn ai-copy-btn" data-message-id="${messageId}" title="复制内容">
                      <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                  </button>
                  <button class="ai-action-btn ai-quote-btn" data-message-id="${messageId}" title="引用回复">
                      <svg class="ai-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                  </button>
              </div>
          ` : '';
          
                     const messageHTML = `
               <div class="ai-message ${role}-message" id="${messageId}">
                   <div class="ai-message-content">
                       <div class="ai-message-text">${role === 'assistant' ? this.renderMarkdown(content) : content}</div>
                       ${actionButtons}
                   </div>
               </div>
           `;
         
         messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
         
                   // 为功能按钮添加事件监听器
          if (role === 'assistant' && !isThinking) {
              // 使用setTimeout确保DOM完全渲染后再绑定事件
              setTimeout(() => {
                                     // 复制按钮事件
                   const copyBtn = document.querySelector(`[data-message-id="${messageId}"] .ai-copy-btn`);
                   if (copyBtn) {
                       copyBtn.addEventListener('click', () => {
                           const messageElement = document.getElementById(messageId);
                           // 获取原始文本内容，去除HTML标签
                           const textContent = messageElement.querySelector('.ai-message-text').innerText || 
                                             messageElement.querySelector('.ai-message-text').textContent;
                           
                           // 尝试使用现代API
                           if (navigator.clipboard && window.isSecureContext) {
                               navigator.clipboard.writeText(textContent).then(() => {
                                   this.showToast('✅ 内容已复制到剪贴板');
                               }).catch(() => {
                                   this.fallbackCopyTextToClipboard(textContent);
                               });
                           } else {
                               this.fallbackCopyTextToClipboard(textContent);
                           }
                       });
                   }
                  
                                     // 引用按钮事件
                   const quoteBtn = document.querySelector(`[data-message-id="${messageId}"] .ai-quote-btn`);
                   if (quoteBtn) {
                       console.log('找到引用按钮，绑定点击事件');
                       quoteBtn.addEventListener('click', () => {
                           console.log('引用按钮被点击');
                           const messageElement = document.getElementById(messageId);
                           // 获取原始文本内容，去除HTML标签
                           const textContent = messageElement.querySelector('.ai-message-text').innerText || 
                                             messageElement.querySelector('.ai-message-text').textContent;
                           console.log('准备引用的文本:', textContent);
                           this.quoteMessage(textContent);
                       });
                   } else {
                       console.error('未找到引用按钮:', `[data-message-id="${messageId}"] .ai-quote-btn`);
                   }
              }, 100);
          }
         
         this.scrollToBottom();
         return messageId;
     }
     
     // 降级复制方法
     fallbackCopyTextToClipboard(text) {
         const textArea = document.createElement('textarea');
         textArea.value = text;
         
         // 避免滚动到页面底部
         textArea.style.top = '0';
         textArea.style.left = '0';
         textArea.style.position = 'fixed';
         textArea.style.opacity = '0';
         
         document.body.appendChild(textArea);
         textArea.focus();
         textArea.select();
         
         try {
             const successful = document.execCommand('copy');
             if (successful) {
                 this.showToast('✅ 内容已复制到剪贴板');
             } else {
                 this.showToast('❌ 复制失败，请手动选择文本复制');
             }
         } catch (err) {
             console.error('复制失败:', err);
             this.showToast('❌ 复制失败，请手动选择文本复制');
         }
         
         document.body.removeChild(textArea);
     }
     
     // 引用消息功能
     quoteMessage(text) {
         console.log('引用功能被调用，文本内容:', text);
         
         const input = document.getElementById('ai-input');
         if (!input) {
             console.error('找不到输入框元素');
             this.showToast('❌ 引用失败：找不到输入框');
             return;
         }
         
         const quotedText = `引用：${text}\n\n`;
         console.log('准备添加的引用文本:', quotedText);
         
         // 在输入框开头添加引用内容
         input.value = quotedText + input.value;
         input.focus();
         
         // 调整输入框高度
         this.adjustInputHeight();
         
         // 显示提示
         this.showToast('💬 已引用到输入框');
         console.log('引用功能完成，当前输入框内容:', input.value);
     }
     
     // Markdown渲染方法
     renderMarkdown(text) {
         if (!text) return '';
         
         // 转义HTML特殊字符
         text = text.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
         
         // 处理标题
         text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
         
         // 处理粗体和斜体
         text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/__(.*?)__/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em>$1</em>');
         
         // 处理代码块
         text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                    .replace(/`([^`]+)`/g, '<code>$1</code>');
         
         // 处理列表
         text = text.replace(/^\* (.*$)/gim, '<li>$1</li>')
                    .replace(/^- (.*$)/gim, '<li>$1</li>')
                    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
         
         // 包装列表项
         text = text.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
         
         // 处理链接
         text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
         
         // 处理换行
         text = text.replace(/\n/g, '<br>');
         
         return text;
     }

    removeMessage(messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('ai-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    saveChatHistory(userMessage, aiResponse) {
        this.chatHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: new Date().toISOString()
        });
        
        // 只保留最近20条记录
        if (this.chatHistory.length > 20) {
            this.chatHistory.shift();
        }
        
        localStorage.setItem('gemini-chat-history', JSON.stringify(this.chatHistory));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('gemini-chat-history');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
        }
    }

    savePosition() {
        const widget = document.getElementById('gemini-ai-assistant');
        const position = {
            left: widget.style.left,
            top: widget.style.top
        };
        localStorage.setItem('gemini-widget-position', JSON.stringify(position));
    }

    loadPosition() {
        const saved = localStorage.getItem('gemini-widget-position');
        if (saved) {
            const position = JSON.parse(saved);
            const widget = document.getElementById('gemini-ai-assistant');
            if (position.left && position.top) {
                widget.style.left = position.left;
                widget.style.top = position.top;
            }
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('ai-assistant-theme');
        if (savedTheme) {
            const widget = document.getElementById('gemini-ai-assistant');
            widget.setAttribute('data-theme', savedTheme);
            // 应用保存的主题样式
            this.applyTheme(savedTheme);
        }
    }

         // 获取当前页面内容
     getPageContent() {
         let content = '';
         
         // 获取页面标题
         const title = document.title || '';
         content += `页面标题: ${title}\n\n`;
         
         // 获取文章内容（针对博客文章页面）
         let articleContent = null;
         const selectors = [
             '.article-entry',
             'article',
             '.post-content',
             '.article-content',
             '.entry-content',
             '.post-body',
             '.main',
             'main'
         ];
         
         for (const selector of selectors) {
             articleContent = document.querySelector(selector);
             if (articleContent) {
                 console.log('找到文章容器:', selector);
                 break;
             }
         }
         
         if (articleContent) {
             // 获取文章文本内容，去除HTML标签
             const textContent = articleContent.textContent || articleContent.innerText || '';
             console.log('文章内容长度:', textContent.length);
             console.log('文章内容预览:', textContent.substring(0, 100));
             
             if (textContent.trim().length > 0) {
                 // 限制内容长度，避免API请求过大
                 content += `文章内容: ${textContent.substring(0, 2000)}${textContent.length > 2000 ? '...' : ''}\n\n`;
             } else {
                 console.log('文章内容为空，尝试等待内容加载...');
                 // 如果内容为空，可能是异步加载的，等待一下再试
                 return this.waitForContent();
             }
         } else {
             console.log('未找到任何文章内容容器');
             return this.waitForContent();
         }
         
         // 获取页面URL
         const url = window.location.href;
         content += `页面URL: ${url}\n\n`;
         
         // 获取页面描述（如果有）
         const metaDescription = document.querySelector('meta[name="description"]');
         if (metaDescription) {
             content += `页面描述: ${metaDescription.getAttribute('content')}\n\n`;
         }
         
         // 获取文章标签（如果有）
         const tags = document.querySelectorAll('.post-tags a, .article-tags a, .tag-list a, .article-tag a, .tag a');
         if (tags.length > 0) {
             const tagList = Array.from(tags).map(tag => tag.textContent.trim()).join(', ');
             content += `文章标签: ${tagList}\n\n`;
         }
         
         return content || '无法获取页面内容';
     }
     
     // 等待内容加载
     async waitForContent() {
         return new Promise((resolve) => {
             let attempts = 0;
             const maxAttempts = 10;
             
             const checkContent = () => {
                 attempts++;
                 console.log(`尝试获取内容 (${attempts}/${maxAttempts})`);
                 
                 const articleContent = document.querySelector('.article-entry, article, .post-content, .main');
                 if (articleContent && articleContent.textContent.trim().length > 0) {
                     console.log('内容已加载，长度:', articleContent.textContent.length);
                     resolve(this.getPageContent());
                 } else if (attempts < maxAttempts) {
                     setTimeout(checkContent, 500);
                 } else {
                     console.log('内容加载超时');
                     resolve('无法获取页面内容');
                 }
             };
             
             setTimeout(checkContent, 100);
         });
     }
     
     // 执行网络搜索（直接模式）
     async executeWebSearchDirect(query) {
         // 显示搜索状态
         const thinkingId = this.addMessage('assistant', '🔍 正在搜索中...', true);
         
         try {
             // 使用DuckDuckGo搜索API（免费，无需API密钥）
             const searchResults = await this.performWebSearch(query);
             
             if (searchResults && searchResults.length > 0) {
                 // 移除思考消息
                 this.removeMessage(thinkingId);
                 
                 // 显示搜索结果
                 let resultsText = `🔍 **搜索结果**\n\n`;
                 
                 searchResults.forEach((result, index) => {
                     resultsText += `**${index + 1}. ${result.title}**\n`;
                     resultsText += `${result.content}\n`;
                     resultsText += `链接：${result.url}\n\n`;
                 });
                 
                 resultsText += `💡 **提示**：您可以点击链接查看详细内容，或者询问我分析这些搜索结果。`;
                 
                 this.addMessage('assistant', resultsText);
             } else {
                 this.removeMessage(thinkingId);
                 this.addMessage('assistant', '❌ 未找到相关搜索结果。请尝试其他关键词或告诉我具体问题，我可以基于我的知识回答。');
             }
             
         } catch (error) {
             console.error('网络搜索失败:', error);
             this.removeMessage(thinkingId);
             this.addMessage('assistant', '❌ 搜索失败，请稍后重试。或者告诉我具体问题，我可以基于我的知识回答。');
         }
     }
     
     // 执行网络搜索（原有方法，保留兼容性）
     async executeWebSearch() {
         const searchInput = document.getElementById('ai-web-search-input');
         const searchQuery = searchInput.value.trim();
         
         if (!searchQuery) {
             this.showToast('❌ 请输入搜索关键词');
             return;
         }
         
         // 显示搜索状态
         const resultsContainer = document.getElementById('ai-web-search-results');
         resultsContainer.innerHTML = '<div class="ai-web-search-loading">🔍 正在搜索中...</div>';
         
         try {
             // 使用DuckDuckGo搜索API（免费，无需API密钥）
             const searchResults = await this.performWebSearch(searchQuery);
             
             if (searchResults && searchResults.length > 0) {
                 this.displaySearchResults(searchResults);
                 
                 // 询问用户是否需要AI分析搜索结果
                 this.addMessage('assistant', `🔍 已找到 ${searchResults.length} 条搜索结果。\n\n您可以：\n1. 点击链接查看详细内容\n2. 询问我分析这些搜索结果\n3. 继续搜索其他内容`);
             } else {
                 resultsContainer.innerHTML = '<div class="ai-web-search-no-results">❌ 未找到相关结果</div>';
             }
             
         } catch (error) {
             console.error('网络搜索失败:', error);
             resultsContainer.innerHTML = '<div class="ai-web-search-error">❌ 搜索失败，请稍后重试</div>';
         }
     }
     
     // 执行实际的网络搜索
     async performWebSearch(query) {
         try {
             // 使用DuckDuckGo Instant Answer API
             const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
             
             if (!response.ok) {
                 throw new Error(`搜索请求失败: ${response.status}`);
             }
             
             const data = await response.json();
             const results = [];
             
             // 处理搜索结果
             if (data.AbstractText) {
                 results.push({
                     title: data.Heading || '摘要信息',
                     content: data.AbstractText,
                     url: data.AbstractURL || '#',
                     type: 'abstract'
                 });
             }
             
             if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                 data.RelatedTopics.slice(0, 5).forEach(topic => {
                     if (topic.Text && topic.FirstURL) {
                         results.push({
                             title: topic.Text,
                             content: topic.Text,
                             url: topic.FirstURL,
                             type: 'related'
                         });
                     }
                 });
             }
             
             // 如果没有结果，尝试使用备用搜索方法
             if (results.length === 0) {
                 return this.fallbackWebSearch(query);
             }
             
             return results;
             
         } catch (error) {
             console.error('DuckDuckGo搜索失败:', error);
             // 使用备用搜索方法
             return this.fallbackWebSearch(query);
         }
     }
     
     // 备用网络搜索方法
     async fallbackWebSearch(query) {
         try {
             // 使用Google搜索（通过代理或直接链接）
             const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
             
             // 由于CORS限制，我们无法直接获取Google搜索结果
             // 但我们可以提供搜索链接和指导
             return [{
                 title: 'Google搜索建议',
                 content: `由于技术限制，无法直接获取搜索结果。建议您：\n1. 点击下方链接进行Google搜索\n2. 或者告诉我具体问题，我可以基于我的知识回答`,
                 url: searchUrl,
                 type: 'fallback'
             }];
             
         } catch (error) {
             console.error('备用搜索失败:', error);
             return [];
         }
     }
     
     // 显示搜索结果
     displaySearchResults(results) {
         const resultsContainer = document.getElementById('ai-web-search-results');
         
         let resultsHTML = '<div class="ai-web-search-results-header">🔍 搜索结果</div>';
         
         results.forEach((result, index) => {
             resultsHTML += `
                 <div class="ai-web-search-result-item">
                     <div class="ai-web-search-result-title">
                         <a href="${result.url}" target="_blank" rel="noopener noreferrer">
                             ${result.title}
                         </a>
                     </div>
                     <div class="ai-web-search-result-content">${result.content}</div>
                     <div class="ai-web-search-result-actions">
                         <button class="ai-web-search-analyze-btn" data-result-index="${index}" title="AI分析">
                             🤖 AI分析
                         </button>
                     </div>
                 </div>
             `;
         });
         
         resultsContainer.innerHTML = resultsHTML;
     }
     
     // AI分析搜索结果
     analyzeSearchResult(resultIndex) {
         const resultsContainer = document.getElementById('ai-web-search-results');
         const resultItem = resultsContainer.querySelectorAll('.ai-web-search-result-item')[resultIndex];
         
         if (resultItem) {
             const title = resultItem.querySelector('.ai-web-search-result-title a').textContent;
             const content = resultItem.querySelector('.ai-web-search-result-content').textContent;
             
             const analysisPrompt = `请分析以下网络搜索结果：\n\n标题：${title}\n内容：${content}\n\n请提供：\n1. 信息可信度评估\n2. 主要内容总结\n3. 相关背景信息\n4. 进一步建议`;
             
             // 将分析请求添加到聊天中
             this.addMessage('user', `请分析这个搜索结果：${title}`);
             
             // 模拟AI回复（实际应该调用API）
             setTimeout(() => {
                 this.addMessage('assistant', `🔍 **搜索结果分析**\n\n**标题**：${title}\n\n**内容摘要**：${content.substring(0, 200)}...\n\n**分析建议**：\n1. 这是一个网络搜索结果，建议进一步验证信息准确性\n2. 可以结合多个来源进行交叉验证\n3. 如需深入分析，请告诉我具体关注点`);
             }, 1000);
         }
     }

          // 总结文章
     async summarizeArticle() {
         // 显示AI正在思考
         const thinkingId = this.addMessage('assistant', '📝 正在分析文章内容...', true);
         
         try {
             const pageContent = await this.getPageContent();
             console.log('获取到的页面内容长度:', pageContent.length);
             console.log('页面内容预览:', pageContent.substring(0, 200));
             
             if (pageContent === '无法获取页面内容' || pageContent.length < 50) {
                 this.removeMessage(thinkingId);
                 this.addMessage('assistant', '❌ 无法获取当前页面内容，请确保您在文章页面。\n\n调试信息：\n- 当前页面：' + window.location.href + '\n- 页面标题：' + document.title);
                 return;
             }

             // 直接调用API，让AI智能判断如何总结
             const response = await this.callGeminiAPI('请总结这篇文章的核心内容和主要观点');
             this.removeMessage(thinkingId);
             this.addMessage('assistant', response);
             
         } catch (error) {
             this.removeMessage(thinkingId);
             this.addMessage('assistant', '❌ 总结文章时遇到问题，请稍后再试。');
         }
     }

     // 改进文章建议
     async improveArticle() {
         // 显示AI正在思考
         const thinkingId = this.addMessage('assistant', '🔧 正在分析文章内容...', true);
         
         try {
             const pageContent = await this.getPageContent();
             console.log('获取到的页面内容长度:', pageContent.length);
             console.log('页面内容预览:', pageContent.substring(0, 200));
             
             if (pageContent === '无法获取页面内容' || pageContent.length < 50) {
                 this.removeMessage(thinkingId);
                 this.addMessage('assistant', '❌ 无法获取当前页面内容，请确保您在文章页面。\n\n调试信息：\n- 当前页面：' + window.location.href + '\n- 页面标题：' + document.title);
                 return;
             }

                      const improvePrompt = `请作为全能AI助手，对以下文章进行专业分析和改进建议：

🔍 **分析维度**：
1. 内容结构：逻辑性、层次性、完整性
2. 表达质量：可读性、准确性、生动性
3. 专业深度：技术含量、知识密度、创新性
4. 受众适配：目标读者、阅读体验、价值传递
5. 实用价值：可操作性、参考价值、启发意义

📝 **文章内容**：
${pageContent}

💡 **改进建议**：
请根据文章类型和内容特点，提供具体可行的改进建议，包括结构优化、内容补充、表达提升等方面。`;

             // 直接调用API，让AI智能判断如何改进
             const response = await this.callGeminiAPI('请分析这篇文章并提供具体的改进建议');
             this.removeMessage(thinkingId);
             this.addMessage('assistant', response);
         } catch (error) {
             this.removeMessage(thinkingId);
             this.addMessage('assistant', '❌ 获取文章内容时遇到问题，请稍后再试。');
         }
     }
}

// 页面加载完成后初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
    new GeminiAIAssistant();
});
