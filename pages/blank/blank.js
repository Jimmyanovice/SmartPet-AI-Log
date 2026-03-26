// pages/blank/blank.js
Page({
  data: {
    date: '2026-03-25',
    content: '',
    tag: '',
    tempImages: []
  },

  onDateChange(e) { this.setData({ date: e.detail.value }); },
  onContentInput(e) { this.setData({ content: e.detail.value }); },
  onTagInput(e) { this.setData({ tag: e.detail.value }); },

  // 选择图片
  onChooseImage() {
    wx.chooseMedia({
      count: 1,
      success: (res) => {
        this.setData({ tempImages: res.tempFiles.map(f => f.tempFilePath) });
      }
    });
  },

  // 💡 核心保存函数
  saveAndUpload() {
    if (!this.data.content) {
      return wx.showToast({ title: '内容空空如也', icon: 'none' });
    }

    const newDiary = {
      id: Date.now(),
      date: this.data.date,
      content: this.data.content,
      tag: this.data.tag || '日常',
      images: this.data.tempImages // 存入临时路径用于本地渲染
    };

    // 1. 本地保存：确保 record 界面能立刻看到
    let logs = wx.getStorageSync('pet_logs') || [];
    logs.unshift(newDiary);
    wx.setStorageSync('pet_logs', logs);

    // 2. 后端保存：如果你的 FastAPI 已经准备好了，在这里上传
    if (this.data.tempImages.length > 0) {
      wx.uploadFile({
        url: 'http://10.252.144.98:8000/upload', // 换成你的 FastAPI 接口
        filePath: this.data.tempImages[0],
        name: 'file',
        success: (res) => {
          console.log('图片上传服务器成功', res);
        }
      });
    }

    wx.showToast({
      title: '已成功发布',
      success: () => {
        setTimeout(() => { wx.navigateBack(); }, 1000); // 存完自动返回 record 界面
      }
    });
  }
})