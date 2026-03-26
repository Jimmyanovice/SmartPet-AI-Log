// index.js
Page({
  data: {
    address: '佛山市 华南师大',
    doneCount: 0, // 初始值设为 0，防止渲染 undefined
    userInput: '',
    analysisResult: '',
    navs: [
      { text: '问医生', icon: '/images/icons/doc.png', colorClass: 'bg-green' },
      { text: '洗护美容', icon: '/images/icons/bath.png', colorClass: 'bg-red' },
      { text: '科学喂养', icon: '/images/icons/food.png', colorClass: 'bg-yellow' },
      { text: '急救包', icon: '/images/icons/aid.png', colorClass: 'bg-blue' }
    ],
    // 默认任务，如果缓存为空则显示这些
    tasks: [
      { id: 1, name: '喂食', done: true },
      { id: 2, name: '换水', done: false },
      { id: 3, name: '铲屎', done: false }
    ]
  },

  onLoad: function() {
    console.log("首页加载中...");
    // 核心精进：从本地缓存恢复任务状态
    const savedTasks = wx.getStorageSync('today_tasks');
    if (savedTasks) {
      this.setData({ tasks: savedTasks });
    }
  },

  toggleTask(e) {
    const index = e.currentTarget.dataset.index;
    const tasks = this.data.tasks;
    
    if (tasks[index]) {
      // 1. 切换当前任务状态
      tasks[index].done = !tasks[index].done;
      
      // 2. 关键精进：重新遍历数组，统计 done 为 true 的个数
      const currentDoneCount = tasks.filter(item => item.done).length;
      
      // 3. 同步更新到页面 Data 和本地缓存
      this.setData({ 
        tasks: tasks,
        doneCount: currentDoneCount // 这里更新了，(0/4) 才会变成 (1/4)
      }, () => {
        // 保存到本地，防止刷新丢失
        wx.setStorageSync('today_tasks', tasks);
      });
    }
  },

  // 2. 添加新任务 (增加持久化)
  showAddTaskModal() {
    wx.showModal({
      title: '添加新任务',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          const newTask = { 
            id: Date.now(), // 使用时间戳作为唯一标识
            name: res.content, 
            done: false 
          };
          const newTasks = [...this.data.tasks, newTask];
          this.setData({ tasks: newTasks }, () => {
            wx.setStorageSync('today_tasks', newTasks);
          });
        }
      }
    });
  },

  // 3. 后端 API 请求 (保持你的 IP 地址逻辑)
  submitLog: function() {
    if (!this.data.userInput) {
      wx.showToast({ title: '请输入日志内容', icon: 'none' });
      return;
    }

    wx.showLoading({ title: 'AI 分析中...' });
    
    wx.request({
      url: 'http://10.252.144.98:8000/analyze_log', 
      method: 'POST',
      data: {
        pet_name: '乐乐',
        log_text: this.data.userInput
      },
      header: { 'content-type': 'application/json' },
      success: (res) => {
        this.setData({
          analysisResult: res.data.report || '分析完成，详见记录页'
        });
      },
      fail: (err) => {
        console.error('连接 FastAPI 失败:', err);
        wx.showToast({ title: '无法连接局域网服务器', icon: 'none' });
      },
      complete: () => { wx.hideLoading(); }
    });
  },

  // 其他跳转函数保持不变
  goToRecord() { wx.switchTab({ url: '/pages/record/record' }); },
  goToLog() { wx.switchTab({ url: '/pages/record/record' }); },
  navToBlank(e) {
    const title = e.currentTarget.dataset.title;
    wx.navigateTo({ url: `/pages/blank/blank?title=${title}` });
  },
  getLocation() { wx.showToast({ title: '定位功能开发中', icon: 'none' }); },
  handleInput(e) { this.setData({ userInput: e.detail.value }); },
  
  updateDoneCount() {
    const tasks = this.data.tasks || [];
    const doneCount = tasks.filter(item => item.done).length;
    this.setData({ 
      tasks: newTasks,
      doneCount: newTasks.filter(item => item.done).length 
    });
    // 顺便把任务存入本地缓存，解决你说的“刷新就没了”的问题
    wx.setStorageSync('today_tasks', tasks);
  }
});