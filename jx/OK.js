// http://localhost:5757/parse/web1?url=https://v.qq.com/x/cover/mzc00200vkqr54u/v4100qp69zl.html
const {requestJson} = $.require('./_lib.request.js')

const jx = {
    type: 0,
    ext: {
        'flag': [
            'qiyi',
            'imgo',
            '爱奇艺',
            '奇艺',
            'qq',
            'qq 预告及花絮',
            '腾讯',
            'youku',
            '优酷',
        ]
    },
    header: {
        'User-Agent': MOBILE_UA,
    },
    // 添加url属性直接暴露api，不走系统。建议web解析才写这个属性,json解析隐藏起来
   //url: 'https://www.lreeok.vip/okplay/?url=',
};
/*
async function lazy(input, params) {
    log('input:', input);
    let headers = {'User-Agent': PC_UA};
    let timeout = 8000;
    let obj = 'https://www.lreeok.vip/okplay/?url=' + input;
    console.log('obj的结果:', obj);
    return obj
}
*/

async function lazy(input, params) {
    return 'redirect://' + 'https://www.lreeok.vip/okplay/?url=' + input
}