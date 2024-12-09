# drpyS更新记录

### 20241210

更新至V1.0.7

1. 新增drpyBatchFetch.js、用3种不同方式实现drpy的batchFetch批量请求函数
2. 引入hls-parser库用于解析处理m3u8等流媒体文件，在drpyS中提供全局对象hlsParser
3. 新增央视
4. 修复人人
5. 完善batchFetch的4种实现方案

### 20241209

更新至V1.0.6

1. 新增特性，可以不写class_parse属性(但是得确保class_name和class_url不然无法获取分类)
2. 增加腾云驾雾源,修正搜索只能一个结果的问题。
3. 新增batchFetch批量请求，给drpyS源提速！！！腾云驾雾源的二级请求已提速，几百个播放链接的动漫二级秒加载
4. 增加ptt[优],同样支持二级batchFetch
5. 海阔暂不支持源里执行eval,腾云驾雾二级访问不了，现在临时修改为

```javascript
QZOutputJson = JSON5.parse(ht.split('QZOutputJson=')[1].slice(0, -1));
```

6. 手写队列，兼容海阔nodejs单任务版不支持queque等三方模块的问题
7. 修复pdfh不含属性解析的情况下返回结果不是字符串问题与之影响的黑料源

### 20241208

更新至V1.0.5

1. 新增函数 getContentType、getMimeType，替代原docs.js里的用法，并注入给drpyS源使用
2. drpyS支持class_name,class_url,filter等属性了
3. 星芽短剧新增筛选
4. 新增源老白故事
5. 优化首页分类接口机制，支持在class_parse里返回list,然后推荐留空。
6. 推荐函数注入this变量
7. 兼容新版海阔多任务nodejs

### 20241207

更新至V1.0.4

1. 添加源【动漫巴士】
2. 修改headless-util.js
3. 增加hostJs异步函数，使用示例:
4. 优化会员解密功能
5. 优化访问日志输出到本地文件并自动轮转
6. 黑料源使用CryptoJSW提高图片解密速度
7. 优化yarn dev解决控制台日志乱码问题
8. 移植原drpy2的request、post、fetch、reqCookie、getCode、checkHtml、verifyCode等方法并改为异步
9. 增加原drpy2的同步函数 setItem、getItem、clearItem
10. 增加_lib.request.js依赖库，实现了 `requestHtml`和`requestJson`简单封装
11. 在常用一级、二级、搜索等函数里的this里增加jsp、pd、pdfa、pdfh确保指向的链接为当前this的MY_URL
12. 修复pd系列函数取不到属性的问题。新增xvideos源,重写黑料里不正确的pd用法,修复黑料的搜索

```javascript
var rule = {
    hostJs: async function () {
        let {HOST} = this;
        log('HOST:', HOST);
        return 'https://www.baidu.com';
    }
}
```

### 20241206

更新至V1.0.3

1. 完善图片代理相关函数与功能
2. 增加加密源的数据解析
3. crypto-js-wasm.js兼容海阔调用CryptoJSW对象
4. 更新金牌影视，本地代理修复播放问题
5. 暴露更多函数给drpyS源使用。如gzip、ungzip等等
6. 增加源加密功能
7. 根目录增加.nomedia规避手机相册识别ts文件为媒体图片问题
8. 修复金牌影视代理播放不支持海阔引擎的问题
9. 增加会员解密功能
10. 修复pupWebview没引入成功的问题
11. 修正加解密工具不适配移动端高度问题

### 20241205

更新至V1.0.2

1. 增加本地代理功能,示例参考_qq.js 用法:在源的各个js函数里(http://192.168.31.49:5757/api/_qq)

```javascript
let {getProxyUrl} = this;
let vod_url = getProxyUrl() + '&url=' + 'https://hls09.cntv.myhwcdn.cn/asp/hls/2000/0303000a/3/default/d9b0eaa065934f25abd193d391f731b6/2000.m3u8';
```

### 20241204

更新至V1.0.1

1. 引入crypto-js-wasm.js和使用文档
2. 增加docs接口可以查看文档md文件的html页面
3. 完成index.js接口剥离，保持主文件的干净。同时导出start和stop方法
4. 改进本地配置接口，增加外网可用配置。
5. 支持puppeteer,仅pc可用。如需使用请手动安装puppeteer库，然后drpyS的源里支持使用puppeteerHelper对象。
6. 添加favicon.ico
7. 引入全局CryptoJSW对象(海阔暂时会报错无法使用)
8. 增加本地代理功能，示例(跳转百度):

```javascript
var rule = {
    proxy_rule: async function (params) {
        // log(this);
        let {input, MY_URL} = this;
        log(`params:`, params);
        log(`input:${input}`);
        log(`MY_URL::${MY_URL}`);
        // return [404, 'text/plain', 'Not Found']
        return [302, 'text/html', '', {location: 'http://www.baidu.com'}]
    }
}
```

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
