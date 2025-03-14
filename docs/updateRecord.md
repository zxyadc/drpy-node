# drpyS更新记录

### 20250310

更新至V1.1.23

1. 修复番茄小说
2. 新增2个源

### 20250227

更新至V1.1.22

1. 优化123网盘的逻辑和推送示例
2. 优化sqlite3库兼容装逼壳

### 20250226

更新至V1.1.21

1. 增加123网盘的逻辑和推送示例

### 20250225

更新至V1.1.20

1. UC整体逻辑修改，并在扫码插件增加了UC_TOKEN扫码逻辑
2. 数据库sqlite3优化，寻找另一个wasm实现的库平替了兼容性极差的sqlite3原生库

### 20250224

更新至V1.1.19

1. 修复 推送和所有网盘源涉及的UC播放问题，支持原代本和原代服务加速
2. 更新猫爪的 alist.js
3. 新增 `sqlite` `sqlite3` 依赖，在ds源里的异步方法里直接使用，示例:

```javascript
await database.startDb();
console.log('database:', database);
const db = database.db;
// 创建表
await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

// 插入数据
await db.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
await db.run('INSERT INTO users (name) VALUES (?)', ['Bob']);

// 查询数据
const users = await db.all('SELECT * FROM users');
console.log(users);

// 更新数据
await db.run('UPDATE users SET name = ? WHERE id = ?', ['Charlie', 1]);

// 查询更新后的数据
const updatedUsers = await db.all('SELECT * FROM users');
console.log(updatedUsers);

// 删除数据
await db.run('DELETE FROM users WHERE id = ?', [2]);

// 查询删除后的数据
const finalUsers = await db.all('SELECT * FROM users');
console.log(finalUsers);
await database.endDb();
```

### 20250211

更新至V1.1.18

1. 新增 `16wMv.js`
2. drpyS支持库升级，新增获取首字母拼音的函数 `getFirstLetter`

### 20250206

更新至V1.1.17

1. parses.conf增强，支持{{host}} 与 {{hostName}} 变量，可以配置同机器服务下的其他端口php解析
2. 设置中心新增解析 视频解析设置栏目，暂时可以设置 `芒果关解` 视频分辨率

### 20250123

更新至V1.1.16

1. 原代本增强，支持模式切换 `5575` 和 `7777`,原7777模式 需要自己开mediaGo,新的默认模式采用不夜加速，装逼壳直接起飞，无需外挂服务(多个壳子同时用可能会端口冲突，待验证)
2. 设置中心-系统配置 增加 设置原代本类型，现在不设置就默认是不夜加速
3. 设置中心-接口挂载 增加设置允许挂载jar,默认关闭，设置为1可以使用挂载配置里的jar
4. 更换默认的epg地址
5. 新增源 `iptv.js`
6. 更新 `直播转点播[合].js` 支持配置文件自定义请求头
7. 修复 `金牌影院.js`、新增源动力出品的 `短剧库.js`
8. 修复ds猫视频不夜源 `黑木耳克隆|T4` 等一级筛选不讲规则返回的不是列表导致的兼容性问题
9. ds猫支持不夜多线程磁盘加速

### 20250122

更新至V1.1.15

1. ds源和dr2源增加装逼壳图标支持
2. 直转点加了一条记录
3. 打包7z脚本排除本地挂载的外部T4数据
4. ds猫源适配不讲规矩的不夜T4
5. 挂载数据默认值改为不启用
6. 修复移动盘播放问题
7. 不夜的推送不讲规矩，只支持get不支持post，需要壳适配。一级不讲规则，ac只能detail才有数据，list/videolist不行
8. 统一挨着修改网盘源，增加二级数据返回 vod_play_pan，按$$$分割的原始网盘链接，包括push也有效，方便海阔本地小程序播放
9. 增加 [源动力](https://sourcepower.top/source) 官方出品的`短剧库.js`
10. 设置中心推送视频去掉编码，交给壳子处理，防止双层编码导致的问题

### 20250121

更新至V1.1.14

1. 猫源ds在线配置支持接口密码
2. 修复移动网盘工具类(移动1可以，2和3还是不行)
3. 新增 [源动力](https://sourcepower.top/source) 官方出品的两个源 `麦田影院.js` `凡客TV.js`
4. 设置中心增加接口挂载功能，可以挂载hipy-t4和不夜t4(box在线配置)
5. 多线程播放加速新增 磁盘加速模式

### 20250120

更新至V1.1.13

1. 完善猫源ds在线配置

### 20250119

更新至V1.1.12

1. 支持猫源在线配置

使用教程:

- [点这里跳进去后复制地址](/config/index.js.md5)
- 回来后手动处理地址: 在http:// 中间插入授权验证，比如 admin:drpys@
- 举例: 你复制的地址： `http://127.0.0.1:5757/config/index.js.md5`
- 举例: 你手动处理后放猫里的的地址： `http://admin:drpys@127.0.0.1:5757/config/index.js.md5`

### 20250117

本次未更新版本

1. 新开项目，使ds源适用于新版猫影视 [猫爪catpwd](https://github.com/CatPawApp/CatPawOpen)

### 20250116

更新至V1.1.11

1. 更新天翼和移动网盘工具类
2. 新增哔哩大杂烩
3. 优化push_agent
4. 修复 雷鲸小站
5. 央视大全推荐页增加直播，卡卡的但是能凑合看

### 20250115

更新至V1.1.10

1. 重构天翼网盘工具类
2. 新增移动网盘工具类
3. 增加 `JSONbig` 和 `JsonBig` 来处理json解析文本中包括很长的整数值问题
4. 新增 nodejs依赖项 `crypto-js` `json-bigint`

### 20250114

更新至V1.1.9

1. dr2源接口api改为 `assets://js/lib/drpy2.js` 确保含有内置drpy2的壳子可以正常使用
2. 设置中心隐藏天翼cookie的设置功能，防止因为错误设置导致的封ip
3. 更新秋秋最新提供的天翼盘工具类和配套站
4. 增加了一些dr2的听书源
5. 修复&新增几个优质源
6. 设置中心推荐页面增加源内搜索动作示例

### 20250113

更新至V1.1.8

此版本包含重要更新，强烈推荐。以下是重点强调:

- drpy2 t3源已经非常成熟，道长将会很长时间内不再维护，以下简称dr2源。
- 海阔视界，zyplayer,easybox等软件积极适配，已经有成熟的内置dr2方案。
- 所以道长将dr2源与本项目融合，本项目不再提供dr2源的api请壳子使用内置dr2方案运行本项目含dr2源的配置订阅链接。
- 某些壳子不支持或者不想使用dr2源的用户可以在设置中心-系统配置-配置是否启用dr2源配置
- dr2源优势明显，至少5年内不会弃用。且少部分地方存在超越ds的优势(http2，玄学过cf等)，zy写此类源非常快，因此作为壳子内置的标准使用。
- dr2源新项目赋能：可以通过push://协议使用ds的推送方案，支持ds的订阅机制、排序、传参方案

1. 新增天翼网盘相关配置和解析逻辑及配套源
2. 支持挂载drpy的js自动生成t3配置并放置了几个示例源,固定目录在 `js_dr2`

### 20250112

今日无更新,但是做了一些相关技术性研究

1. `drpyInject.js` req系列函数支持拦截器打印转换的curl命令
2. 添加 `低端[盘].js` 尝试解决cf导致的获取源码错误问题以失败告终(py的requests也请求不到源码，我也很绝望,还研究了axios升级http2协议也没卵用，不知道是请求头哪儿的差异，dr2的js正常用，想不明白了)
3. 研究 `好乐影视.js` 不正常问题，发现请求到的源码里面都是一些location.href=的链接跳转，浏览器访问网站当然没问题，写成源一脸懵逼，没啥好办法。

### 20250111

更新至V1.1.7

1. 生成的订阅配置增加风景壁纸接口可供壳子切换
2. lazy传入的this指向里的input和MY_URL在非http链接的情况下取消自动url解码逻辑，应对特殊场景解码后加号丢失问题
3. 设置中心接入了新的AI：kimi,并全面升级所有AI都支持上下文连续对话，最多20条聊天记录
4. 连续对话增加快速输入新的对话
5. 新增 & 修复源
6. 优化 batchFetch 函数的性能开销
7. 新增 `小米盘搜[搜].js`
8. 统一给所有函数的this指针绑定HOST变量
9. 紧急修复了一个bug，影响全局的接口query解析

### 20250110

更新至V1.1.6

1. 更新 `虎斑[盘].js` 域名
2. `req` 底层请求函数优化，确保错误返回时可以取到返回的html内容
3. `火车太堵`原域名访问有cf验证了无法获取源码没法修了，现在更换一个域名
4. 修复示例代码 `360test.js` 运行错误
5. `moduleExt` 增加默认值为空字符串而不是 `undefined`
6. 不允许在源或者解析里写 `const axios = require('axios');` 会出现无法解决的问题
7. 增加一个密源
8. 尝试修复解析 `虾米.js` 以失败告终，解出来ip开头的地址还是无法播放
9. 增加 `config/parses.conf` 用于手动配置web解析和json解析
10. 更新所有网盘源的搜索，为套娃党的粗心擦屁股

已知bug:

1. 装逼壳搜索不支持传参源，采王系列无法获取结果，easybox正常

### 20250109

更新至V1.1.5

1. `.env` 增加 `MAX_TASK`参数，配置系统多任务数限制，默认不设置则为2，解决低端设备如arm盒子访问配置崩溃问题。高端设备实测发现设置为8比较快
2. 自建解析功能增强，支持自定义其他参数，增加两个示例解析
3. 抓取了一些采集源扩充采王，抓取方式，zy3.7版本运行以下代码

```javascript
var rule = {
    推荐: $js.toString(() => {
        let url = 'https://blog.ilol.top/p/zqgwes.html';
        let html = request(url);
        let tlist = pdfa(html, '.post-content&&h2');
        log(tlist)
        let alist = pdfa(html, '.post-content&&a:gt(0)');
        log(alist);

        VODS = [];

        for (let i in tlist) {
            VODS.push({
                name: pdfh(tlist[i], 'Text'),
                url: pdfh(alist[i], 'a&&href'),
            })
        }
        log(JSON.stringify(VODS))

    })
}
```

4. 增加源 `奇珍异兽[官].js`
5. 新增一个源 `hdmoli.js` 用于演示二级同时存在播放列表和网盘分享链接的写法

### 20250108

更新至V1.1.4

1. 修改 `fastify` 全局 `query` 解析行为，避免同一个参数出现多次被解析成列表，比如extend参数。
2. 主页增加版权说明和免责申明
3. 自然排序逻辑改成包含，用于支持模糊排序功能(v我50限定功能)
4. 设置中心全局动作新增 `推送`
5. ds源增加可用的全局函数 `batchExecute` 用法同海阔，配置生成逻辑改成 batchExecute 执行

### 20250107

更新至V1.1.3

1. 修复 `req` 系列函数获取源码由于没有请求头没有默认 `accept` 属性导致的某些网页获取的源码异常问题
2. 推送及各个网盘播放的夸克代理线程数绑定设置中心播放线程代理的值，默认为6
3. 修复js版打包7z脚本命令的日期不正确问题
4. 增加源 `秋霞电影网.js`
5. 增加源 `小米[盘].js` 用于演示 `push://` 推送写法
6. 推送源支持 `www.aliyundrive.com` 这种地址的拦截
7. lazy执行失败后自动执行嗅探机制调整,仅限于http开头的链接

`小米[盘].js` 使用说明:
海阔待改推送 增加编码 `encodeURIComponent`

```javascript
log(detail);
let state = post(s + 'action', {
    timeout: 2000,
    body: {
        do: 'push',
        url: encodeURIComponent(JSON.stringify(detail))
    },
    headers: {
        'User-Agent': MOBILE_UA
    },
});
```

装逼壳待改，接受海阔推送json数据时对url数据进行url解码。然后才是判断解析json  
push:// 选集无法播放，待改

### 20250106

更新至V1.1.2

1. 修复 `动漫巴士[漫].js`
2. 重写 `req` 方法，使之支持 `request` 使用时支持字符串解码功能,支持 `gbk`等类型的网站数据，与之对应的源 `九七电影网.js`
3. ds推送兼容装逼壳新增推送相关属性 `vod_play_flag` `vod_play_index` `vod_play_position`
4. 增加源 `光速[优].js`

### 20250105

更新至V1.1.1

1. 优化订阅过滤和青少年模式没处理采王这类自定义别名的情况
2. push_agent 推送json兼容依赖播放属性，已实现海阔drpyHiker的任意二级推送至装逼壳并依赖推送者进行解析播放，包括小说漫画
3. aes加密的源在初始化获取原始代码的时候发现获取的文本不完善，待排查问题，待解决，如皮皮虾。之前把aes加密函数放lazy里频繁出现这种问题
4. 闪电盘等几个网盘源的筛选数据有问题，尽我能力尝试修复
5. 更新安装文档
6. 增加新源 `播剧网.js`，`樱漫[漫].js` ，`皮皮虾[优].js`
7. 从源动力零元购进货了一批ds源并测试和修正代码
8. 哔哩直播搜索功能需要配置环境变量哔哩cookie，暂时从网页上复制后手动填写入库吧，扫码获取的那个cookie貌似不行
9. 增加哔哩影视
10. 抖音直播弹幕随机颜色，且使用Jinja2绑定服务地址，解决反代后不存在端口问题
11. 给静态目录插件中心挂载basic验证，防止非法绕过主页直接使用插件
12. 增加代理转发接口 `/req/被转发的完整地址`,可在设置中心开启或关闭

### 20250104

每30天等于1个月，版本号提升0.1，终于发布1.1版本了

更新至V1.1.0

1. 优化 `抖音直播弹幕[官].js` 在加载弹幕过程中奇怪的废弃用法报错问题
2. 增加 `采集之王[合].js` 与相对应的json文件和map文件
3. 优化本地包打包发布脚本，支持过滤密发布绿色版，以后群文件只传绿色版
4. 打包发布脚本同步新增js版的，可以不安装python环境也能使用了。

### 20250103

更新至V1.0.30

1. 增加 `抖音直播弹幕[官].js`
2. drpyS注入可用的全局函数 `WebSocket` `WebSocketServer` `zlib`
3. drpyS注入可用的this指针环境变量 `hostUrl`,不含协议头的主机地址
4. 抖音弹幕共享全局fastify接口的服务和端口
5. 增加新的依赖 `google-protobuf`
6. 首页推荐数据报错不再抛错，避免影响其他数据加载
7. `我的哔哩[官].js` 等传参源兼容装逼壳
8. 增加 `runMain` 异步函数，可以调用drpyS.js里的内容
9. 配置生成逻辑改成并发执行，可能某些场景会比较快
10. 增加直转点

### 20250102

更新至V1.0.29

1. 增加 `七猫小说.js`
2. 新增 `我的哔哩[官].js`,支持传参源，传参字典可自定义，文件在 `config/map.txt`,格式为 `接口名称@参数@别名`
3. 支持ipv6监听服务

### 20250101

更新至V1.0.28

元旦快乐

1. 设置AI功能回复优化，明确知道是哪个AI
2. basic授权机制调整，未配置 `.env` 文件的这两个属性任意一个时不启用此功能
3. 增加`玩偶哥哥[盘].js`,隔壁老三套娃自写，配套筛选

### 20241231

更新至V1.0.27

1. 设置中心优化，样式微调
2. 新增 `_lib.waf.js` 通用过长城雷池防火墙工具，与对应示例源 `团长资源[盘].js`
3. 优化 `多多[盘].js` 默认筛选不正确导致没数据问题
4. 新增源 `专享影视.js` `火车太堵.js`
5. 增加 `robots.txt` 防止被引擎收录
6. 服务启动增加打印nodejs版本号
7. 主页接口增加basic验证，请自己手动配置.env文件中的 `API_AUTH_NAME` 和 `API_AUTH_CODE`
8. 配置接口和源接口增加api授权，在.env文件中配置 `API_PWD = dzyyds`
9. AI工具集成到 `AIS` 对象里了
10. ENV环境变量get和set方法增加参数3:`isObject=1`,支持读写变量如果是字符串自动转为object对象
11. AI库完成讯飞星火智能体对接，可配置当前AI为3，新增依赖库 `ws`

### 20241230

更新至V1.0.26

1. 设置中心优化，样式适配装逼壳。并支持全局站源动作
2. 增加简繁体转换函数 `simplecc`,用法如下:  
   简体转繁体: `simplecc("发财了去植发", "s2t")`  
   繁体转简体: `simplecc("發財了去植髮", "t2s")`
3. 增加源相互调用功能,仅支持在源的特定函数里使用，示例:

```javascript
let {proxyUrl, getRule} = this;
const tx_rule = await getRule('腾云驾雾[官]');
if (tx_rule) {
    log(tx_rule.url);
    log(tx_rule.title);
    // log(JSON.stringify(tx_rule));
    let data1 = await tx_rule.callRuleFn('搜索', ['斗罗大陆'])
    log(data1);
    let data2 = await tx_rule.callRuleFn('一级', ['tv'])
    log(data2);
} else {
    log('没有这个原')
}
```

4. 增加讯飞星火AI对话交互动作,设置中心推荐栏可用。 源里可使用这个对象 `SparkAI`,调用示例:

```javascript
const sparkAI = new SparkAI({
    authKey: ENV.get('spark_ai_authKey'),
    baseURL: 'https://spark-api-open.xf-yun.com',
});
rule.askLock = 1;
try {
    replyContent = await sparkAI.ask(prompt, {temperature: 1.0});
} catch (error) {
    replyContent = error.message;
}
rule.askLock = 0;
```

### 20241229

更新至V1.0.25

1. 优化设置中心在海阔的样式，增加推送功能支持推送海阔数据示例
2. 优化 `push_agent.js` 增加默认图片，增加海阔推送数据识别
3. 从 `api.js` 文件中抽离出 `mediaProxy.js` 逻辑
4. 优化本地多线程流代理，尝试降低出现`403` 问题的频率
5. batchFetch也尝试增加 连接数代理降低网站连接超出后自动拒绝的概率
6. 后端 `httpUrl` 使用独立的 `_axios` 对象，避免跟系统内 `req` 所用对象冲突
7. 完成设置中心所有平台扫码功能

### 20241228

更新至V1.0.24

1. 本地代理支持多线程流代理，参考设置中心的本地代理测试。默认线程数为1，可以设置中心自行修改
2. 至臻盘新增 `原代服` `原代本` 两种画质，可选择启用代理播放功能
3. 更新了两个源
4. 夸克扫描功能优化，支持取消扫码
5. 设置中心图标优化，并支持推送番茄小说
6. 默认排序文件改为 `order_common.example.html` `order_yellow.example.html` 允许用户自己新建不带example的文件避免跟仓库冲突

### 20241227

更新至V1.0.23

1. 更新 `searchable` `filterable` `quickSearch` 默认全部为0
2. 优化网盘源二级失效资源处理
3. 新增 `push_agent.js` 推送专用源，支持 各大网盘，官链，直链，待嗅探，多列表等场景推送
4. 修复已有源三个属性没正确设置问题
5. 增加 `蜡笔[盘].js`
6. 设置中心支持推送
7. drpyS新增可用函数 `XMLHttpRequest` `_fetch`,由于`fetch`是drpy2内置函数等同于`request`,新增的`_fetch`是nodejs原生函数。示例:

```javascript
const xhr = new XMLHttpRequest();
log(xhr);
```

8. 环境this增加 `httpUrl`
9. 设置中心增加夸克扫码功能与真实可用的逻辑
10. action动作交互升级至最新标准，完美适配最新装逼壳

### 20241226

更新至V1.0.22

1. 更新网盘插件 `ali.js`,修正播放失败无法自动刷新cookie问题
2. 更新 `至臻[盘].js` 支持原画播放
3. 夸克支持原画播放，并优化夸克和uc自动刷新cookie逻辑
4. `random-http-ua.js` 优化 `instanceof Array` 改为 `Array.isArray` 解决传递option无法生成ua问题
5. drpyS源模块系统升级，支持使用`.cjs`的标准commonJS模块导入使用，运行读写文件等操作。示例`_lib.request.cjs`。谨慎使用，权限比较大 在源里的示例用法:

```javascript
const fs = require('fs');
const path = require('path');
const absolutePath = path.resolve('./');
console.log(absolutePath);
const data = fs.readFileSync('./js/_360.js', 'utf8');
console.log(data);
const {getPublicIp1, getPublicIp2} = require('../js/_lib.request.cjs');
console.log('typeof getPublicIp1:', typeof getPublicIp1);
console.log('typeof getPublicIp2:', typeof getPublicIp2);
```

6. drpyS源初始化增加30秒超时返回机制(但不会中断后台任务，请确保代码不要含有死循环等操作)
7. 研究本地代理流但是没成功，代码保留了

### 20241225

更新至V1.0.21

1. drpyS t4接口升级，同时支持`GET` `POST form` `POST JSON`
2. drpyS 源增加阿里工具类 `Ali`
3. drpyS 源增加 `_ENV`，用于获取 `process.env`
4. drpyS 源所有函数的this变量内增加 `publicUrl`属性，可以用于获取本t4服务的公开文件目录，自行拼接静态文件
5. 订阅里增加 `?sub=all` 的订阅，支持默认的源排序规则
6. 增加源设置中心并置顶在订阅配置里，支持手动输入4种平台的cookie
7. 设置中心增加青少年设置的开关，设置值为1可以彻底隐藏带密的源，无视订阅
8. uc 和 夸克自动更新播放所需cookie
9. 引入一个新的依赖 `dayjs`

### 20241224

更新至V1.0.20

1. 环境变量 `/config/env.json` 不再提交到github
2. 修改规则内各个函数的this指向，使this可以获取到rule对象的属性，也能设置属性到rule上
3. 增加lives配置
4. 增加drpyS可用的全局函数 `rc4Encrypt` `rc4Decrypt` `rc4` `rc4_decode`
5. 增加随机ua生成函数 `randomUa.generateUa()`
6. 增加一个漫画源
7. batchFetch增加16个一组分组同步请求逻辑
8. tv订阅允许[盘]类源
9. 源不定义lazy默认表示嗅探选集链接
10. 增加 `player.json` 配置一些box所需的播放器参数

### 20241223

更新至V1.0.19

1. 更新部分源
2. 更新扫码入库代码,支持UC扫码入库可播`闪电优汐[盘]`

### 20241222

更新至V1.0.18

1. 修复`cookie管理工具`扫码获取夸克和UC的cookie不正确的问题，感谢 [@Hiram-Wong](https://github.com/Hiram-Wong)
2. `COOKIE.parse` 支持列表，修复 `COOKIE.stringify` 可以直接将obj转为正确的cookie字符串，区别于 `COOKIE.serialize` 方法
3. 夸克cookie入库自动清洗，只保留有效部分

### 20241221

更新至V1.0.17

1. 修复`req`函数在请求错误返回的content可能存在json情况的问题
2. 增加`ENV`对象。用于在实际过程中get和set设置系统环境变量如各种cookie
3. 完善Cookie管理器的扫码和输入后入库功能逻辑
4. 引入自然排序算法库解决生成的配置中源的顺序问题
5. 海阔排序问题需要使用nodejsi18n小程序
6. cookie入库自动去除\n
7. 支持网盘工具

### 20241220

更新至V1.0.16

注意事项:`axiosX` 用于请求返回的headers一般没有set-cookie或者是个字符串,因为它是esm实现
`axios` `req` `request` `fetch` 等node实现的函数返回headers才能获取到set-cookie

1. drpyS源增加可使用的函数`jsonToCookie` `cookieToJson` `axiosX`
2. 修复素白白搜索(若网站允许),修复番薯动漫
3. 增加 `COOKIE`对象，可以像`JSON`一样使用 `COOKIE.parse` `COOKIE.stringify`
4. 生成的源增加自然排序
5. 移除对海阔等环境的eval注入。最新版本的so已经支持eval了
6. 增加订阅码自定义排序功能

### 20241219

更新至V1.0.15

1. drpyS源增加可使用的函数`Buffer` `URLSearchParams`
2. 所有html页面头部加入drpyS-前缀
3. 新增番薯源
4. 新增几个订阅码

### 20241218

更新至V1.0.14

1. 增加drpyS源属性说明文档
2. 增加一些源
3. 增加dockerFile
4. 兼容vercel由于找不到readme.md无法生成主页的问题
5. 调整vip解密功能兼容vercel

### 20241217

更新至V1.0.13

1. 动态计算生成配置里的 `searchable` `filterable` `quickSearch` `cost`属性
2. 修复前面版本变更导致的 `getProxyUrl` 环境异常问题
3. 解析的object支持返回header:{"use-agent":"Mozilla/5.0"}
4. 解析返回object会自动添加code和msg(如果没手动指定)

### 20241216

更新至V1.0.12

1. fixAdM3u8Ai 去广告算法升级
2. 尝试增加扫码获取cookie网页插件。后期可以更新t4接口所需cookie

### 20241215

更新至V1.0.11

1. drpyS源pathLib对象增加readFile方法，支持读取data目录的指定文件，使用示例:

```javascript
const indexHtml = pathLib.readFile('./cntv/index.html');
```

2. 央视代理增加返回网页示例，用于平替cntvParser项目。关联首页的【央视点播解析工具】
3. 增加qs工具,drpyS源里可以直接使用，示例:

```javascript
log(qs.stringify({a: 1, b: 2}))
```

4. 在.env文件中加入 `LOG_WITH_FILE = 1` 可以使请求日志输出到文件，不配置则默认输出到控制台
5. 支持vercel部署，首页报错找不到readme.md无关大雅，能用就行,直接访问部署好的服务地址/config/1
6. 支持自定义解析。放在jx目录的js文件
7. 新增虾米解析，素白白等源，优化海阔eval机制
8. 解析支持$.import和$.require使用js目录下的lib
9. 增加python脚本用于打包发布本地版7z文件

### 20241213

更新至V1.0.10

1. axios变动，libs_drpy目录保留esm版axios,public目录保留全平台版axios。req封装采用node的axios。解决请求的set-cookie不正确问题
2. 增加异步导入模块功能$.import。支持远程模块(请务必保证模块的正确性，不然可能导致后端服务挂掉)
   用法示例,详见_fq3.js

```javascript
const {getIp} = await $.import('http://127.0.0.1:5757/public/ip.js');
var rule = {
    class_parse: async () => {
        log('ip:', await getIp());
    },
}
```

### 20241212

更新至V1.0.9

1. drpyS加解密工具增加文本大小限制，目前默认为100KB，防止垃圾大数据恶意攻击接口服务
2. 修复央视大全本地代理接口没有动态获取导致可能外网播放地址出现127开头内网地址无法播放的问题
3. 升级axios单文件版到1.7.9
4. 往libsSanbox注入eval函数(非直接注入，仅针对海阔，直接注入会用不了)，暂时解决海阔不支持vm里执行eval的问题,但是问题来了，存在作用域问题不要轻易使用，暂时无法解决。(
   已检测此eval不可以逃逸vm和直接获取drpyS内的变量，勉强能用)
5. 尝试$.require支持网络导入远程js依赖，要求1s内的数据(千万不要导入自己服务的静态文件，会导致阻塞)

### 20241211

更新至V1.0.8

1. BatchFetch默认采用fastq实现，支持海阔，性能强劲
2. 海阔存在写源里不支持eval问题，单任务版也不行。后续尽量避免eval，多采用JSON或JSON5处理
3. 添加axios,URL,pathLib等函数给ds源使用，推荐只在_lib库里使用
4. 支持wasm使用。
5. 新增加字符串扩展方法join，用法同python
6. 完善满血版央视大全,超越hipy版cntv
7. 本地代理增加proxyPath注入至this变量

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
