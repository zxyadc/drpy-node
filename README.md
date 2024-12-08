# drpyS(drpy-node)

nodejs作为服务端的drpy实现。全面升级异步写法

* [本地配置接口-动态本地](/config)
* [本地配置接口-动态外网/局域网](/config/1)
* [本地配置接口-静态](/index)
* [代码加解密工具](/admin/encoder)
* [V我50支付凭证生成器](/authcoder?len=10&number=1)
* [接口压测教程](/docs/httpTest.md)

## 更新记录

### 20241208

更新至V1.0.6

1. 支持batchFetch与配置的两个优质源

[点此查看完整更新记录](docs/updateRecord.md)

## 基础框架

todo:

1. js里的源能否去除export开头，保持跟qjs一致
2. js里的源，像一级这种异步js，里面调用未定义的函数，能否不通过函数参数传入直接注入调用
3. 在源的各个函数调用的时候动态注入input、MY_URL等局部变量不影响全局。搞了半天没成功，有点难受，待解决

写源的函数不可以使用箭头函数，箭头函数无法拿到this作用域就没法获取input和MY_URL变量

精简去除的库:

1. axios
2. jsonpath
3. underscore
4. pino-pretty
5. deasync

## 参考资料

* [crypto-js-wasm使用教程](docs/crypto-js-wasm/readme-CN.md)
* [puppeteer使用教程](docs/pupInstall.md)

## 问题说明

1. windows上直接运行index.js可能会发现运行过程中的日志打印出中文乱码。建议通过yarn dev运行或者在package.json里点击dev脚本运行
