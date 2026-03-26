// pages/record/record.js
// pages/record/record.js
Page({
  data: {
    diaryList: []
  },
  // 关键：必须用 onShow
  onShow: function () {
    console.log("正在尝试读取数据...");
    const logs = wx.getStorageSync('pet_logs');
    if (logs) {
      this.setData({
        diaryList: logs
      });
      console.log("成功读取到数据：", logs);
    }
  },
  goToEdit: function() {
    wx.navigateTo({ url: '/pages/blank/blank' });
  }
})