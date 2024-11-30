# drpy-node

nodejs作为服务端的drpy实现。全面升级异步写法

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
