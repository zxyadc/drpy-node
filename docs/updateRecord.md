# drpyS更新记录

### 20241204
更新至V1.0.1
1. 引入crypto-js-wasm.js和使用文档
2. 增加docs接口可以查看文档md文件的html页面
3. 完成index.js接口剥离，保持主文件的干净。同时导出start和stop方法
4. 改进本地配置接口，增加外网可用配置。
5. 支持puppeteer,仅pc可用。如需使用请手动安装puppeteer库，然后drpyS的源里支持使用puppeteerHelper对象。

### 20241203

1. 新增misc工具类
2. 新增utils工具类
3. 更新atob、btoa函数逻辑
4. 导出pq函数
5. 增加模块系统,$.require和$.exports
6. 修复drpyS源筛选不生效问题
7. 增加局域网可访问接口
8. 打印所有req发出的请求
9. 增加主页的html
10. 番茄小说示例源增加导入模块的用法
11. 更新自动生成配置的接口，自动读取js目录下非_开头的文件视为源
12. 修正金牌影院js
