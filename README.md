# drpyS(drpy-node)

nodejs作为服务端的drpy实现。全面升级异步写法  
~~积极开发中，每日一更~~，当前进度 `49%`  
找工作中，随缘更新

* [本地配置接口-动态本地](/config?pwd=)
* [本地配置接口-动态外网/局域网](/config/1?pwd=)
* [其他配置接口-订阅过滤](/docs/sub.md)
* [代码加解密工具](/admin/encoder)
* [V我50支付凭证生成器](/authcoder?len=10&number=1)
* [接口压测教程](/docs/httpTest.md)
* [央视点播解析工具](/proxy/央视大全[官]/index.html)
* [cookie管理插件](/apps/cookie-butler/index.html)
* [本站防止爬虫协议](/robots.txt)
* [本项目主页-免翻](https://git-proxy.playdreamer.cn/hjdhnx/drpy-node)
* [DS源适配猫影视](https://github.com/hjdhnx/CatPawOpen/tree/ds-cat)
* [在线猫ds源主页](/cat/index.html)

## 更新记录

### 20250310

更新至V1.1.23

### 20250227

更新至V1.1.22

### 20250226

更新至V1.1.21

### 20250225

更新至V1.1.20

### 20250224

更新至V1.1.19

### 20250211

更新至V1.1.18

### 20250206

更新至V1.1.17

### 20250123

更新至V1.1.16

### 20250122

更新至V1.1.15

1. ds源和dr2源增加装逼壳图标支持

### 20250121

更新至V1.1.14

1. 猫源ds在线配置支持接口密码
2. 新增源
3. 磁盘加速

### 20250120

更新至V1.1.13

1. 完善猫在线配置

### 20250117

本次未更新版本

1. 新开项目，使ds源适用于新版猫影视 [猫爪catpwd](https://github.com/CatPawApp/CatPawOpen)

[点此查看完整更新记录](docs/updateRecord.md)

**注意事项**

总是有人遇到各种奇葩问题，像什么没弹幕，访问/config/1服务马上崩溃等等，能自行解决最好，解决不了我建议你使用下方安装教程 `3.道长腾讯轻量云服务器安装方案`
跟我一样还有问题那就不可能了，我能用你即能用

## 基础框架

todo:

1. js里的源能否去除export开头，保持跟qjs一致
2. js里的源，像一级这种异步js，里面调用未定义的函数，能否不通过函数参数传入直接注入调用
3. 在源的各个函数调用的时候动态注入input、MY_URL等局部变量不影响全局。搞了半天没成功，有点难受，待解决

写源的函数不可以使用箭头函数，箭头函数无法拿到this作用域就没法获取input和MY_URL变量

精简去除的库:

1. axios(这个去不掉，刚需，后端请求才能拿到set-cookie)
2. jsonpath
3. underscore
4. pino-pretty
5. deasync

## 参考资料

* [crypto-js-wasm使用教程](docs/crypto-js-wasm/readme-CN.md)
* [puppeteer使用教程](docs/pupInstall.md)
* [drpyS源属性说明](docs/ruleAttr.md)
* [drpy2写源简述](docs/ruleDesc.md)

## 问题说明

1. windows上直接运行index.js可能会发现运行过程中的日志打印出中文乱码。建议通过yarn dev运行或者在package.json里点击dev脚本运行

## 安装说明

1.zy安装方案

* [多平台安装教程](https://zy.catni.cn/otherShare/drpyS-build.html)

2.自动化安装方案（直接薅道长羊毛）

* 终端执行

`bash -c "$(curl -fsSLk https://git-proxy.playdreamer.cn/hjdhnx/drpy-node/raw/refs/heads/main/autorun.sh)"`

* 添加定时方案

`echo "30 7 * * * cd /patch && bash -c \"\$(curl -fsSLk https://git-proxy.playdreamer.cn/hjdhnx/drpy-node/raw/refs/heads/main/autorun.sh)\" >> /patch/drpyslog.log 2>&1" | crontab -`

或者下载脚本到本地后

`chmod a+x /path/autorun.sh`

`echo "30 7 * * * bash /path/autorun.sh  >> /path/logfile.log 2>&1" | crontab -`

命令说明 /patch 为脚本存放路径（脚本放在与源码同级的自定义目录中）

3.道长腾讯轻量云服务器安装方案

```shell
mkdir /home/node_work
cd /home/node_work
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm install 22
npm config set registry https://registry.npmmirror.com
npm i -g cnpm --registry=https://registry.npmmirror.com
npm i -g pm2 yarn@1.22.19
git clone https://git-proxy.playdreamer.cn/hjdhnx/drpy-node.git
cd drpy-node
yarn
yarn pm2
pm2 logs drpys
pm2 ls
pm2 stop drpys
pm2 start drpys
pm2 restart drpys
```

## 代理转发功能测试

* [代理转发ds](/req/https://github.com/hjdhnx/drpy-node)
* [代理转发百度](/req/https://www.baidu.com)
* [代理转发范冰冰直播源](/req/https://live.fanmingming.com/tv/m3u/ipv6.m3u)

## 友链(白嫖接口服务)

* [猫影视git文件加速](https://github.catvod.com/)
* [猫影视多功能主页](https://catvod.com/)
* [ZY写源教学](https://zy.catni.cn/editSource/edit-grammar.html)
* [源动力](https://sourcepower.top/index)

## AI接入

* [讯飞星火](https://console.xfyun.cn/services/bm4)
* [deepseek](https://platform.deepseek.com/api_keys) | [对话](https://chat.deepseek.com/)
* [讯飞智能体](https://xinghuo.xfyun.cn/botcenter/createbot)
  | [对话](https://xinghuo.xfyun.cn/botweb/0b83d4b1c0447e82ea00fe9485bd9353)
  | [数据集](https://xinghuo.xfyun.cn/botcenter/private-dataset)
* [KIMI](https://platform.moonshot.cn/console/info) | [对话](https://kimi.moonshot.cn/)

## 版权

本项目主体框架由道长开发，项目内相关源收集于互联网，可供学习交流测试使用，禁止商用或者直接转卖代码，转载代码请带上出处。

## 免责声明

1. 此程序仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此程序仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此程序用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此程序涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何程序引发的问题概不负责，包括但不限于由程序错误引起的任何损失和损害。
6. 如果任何单位或个人认为此程序可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此程序。
7. 所有直接或间接使用、查看此程序的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此程序，即视为您已接受此免责声明。
