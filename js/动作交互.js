const {action_data} = $.require('./_lib.action.js');

// 访问测试 http://127.0.0.1:5757/api/动作交互?ac=action&action=set-cookie
// 访问测试 http://127.0.0.1:5757/api/动作交互?ac=action&action=quarkCookieConfig&value={"cookie":"我是cookie"}
var rule = {
    类型: '测试',
    title: '动作交互',
    推荐: async () => {
        return action_data;
    },
    action: async function (action, value) {
        if (action === 'set-cookie') {
            return JSON.stringify({
                action: {
                    actionId: 'quarkCookieConfig',
                    id: 'cookie',
                    type: 'input',
                    title: '夸克Cookie',
                    tip: '请输入夸克的Cookie',
                    value: '原值',
                    msg: '此弹窗是动态设置的参数，可用于动态返回原设置值等场景'
                }
            });
        }
        if (action === 'quarkCookieConfig' && value) {
            try {
                const obj = JSON.parse(value);
                const val = obj.cookie;
                return "我收到了：" + value + " cookie为:" + val;
            } catch (e) {
                return '发生错误：' + e;
            }
        }
        if (action === '连续对话') {
            let retMsg = value + "\nHello";
            return JSON.stringify({
                action: {
                    actionId: '连续对话',
                    id: 'talk',
                    type: 'input',
                    title: '连续对话',
                    tip: '请输入消息',
                    value: '',
                    msg: retMsg
                }
            });
        }

        return '动作：' + action + '\n数据：' + value;
    },
};
