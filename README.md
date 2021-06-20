# 杭电课程助手

[![Netlify Status](https://api.netlify.com/api/v1/badges/a1c545f8-837b-4f07-8dad-ea4f3c99093c/deploy-status)](https://app.netlify.com/sites/hduschedule/deploys)

帮助你快速排课，避免使用学校破旧接口来查询课程。

课程搜索接口来自: [HDUCoursesAPI](https://github.com/WingLim/HDUCoursesAPI)
## 特性

### 获取课表

**注意**: Route 和 Session 需要手动获取

如果担心安全问题，请查看 [corsproxy](https://github.com/WingLim/HDUScheduleHelper/tree/main/corsproxy) 自行部署。

登陆并打开 [选课系统](http://jxgl.hdu.edu.cn/), 按 **F12** 打开开发者工具。

点击 **Application**, 选择 **Cookies**。

选择 **http://jxgl.hdu.edu.cn**, 复制 `route` 的 `Value` 和 `ASP.NET_SessionId` 的 `Value`

![](https://cdn.jsdelivr.net/gh/WingLim/assets@master/images/20210620115306.png)

### 模糊搜索
- 课程名
- 上课地点
- 教师名

### 选择

- 课程性质
- 日期
- 时间

### 额外设置

- 周末模式
- 保存至本地（默认开启）
