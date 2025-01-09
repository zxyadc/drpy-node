// http://localhost:5757/parse/JSON合集?url=https://v.qq.com/x/cover/mzc00200vkqr54u/v4100qp69zl.html

const {requestJson} = $.require('./_lib.request.js');
const {getRandomFromList, shuffleArray} = $.require('./_lib.random.js');
const jx = {
    type: 3,
    ext: {
        'flag': [
            "qiyi",
            "imgo",
            "爱奇艺",
            "奇艺",
            "qq",
            "qq 预告及花絮",
            "腾讯",
            "youku",
            "优酷",
            "pptv",
            "PPTV",
            "letv",
            "乐视",
            "leshi",
            "mgtv",
            "芒果",
            "sohu",
            "xigua",
            "fun",
            "风行"
        ]
    },
}

async function lazy(input, params) {
    log('input:', input);
    let parse_list = [
        "https://zy.qiaoji8.com/gouzi.php?url=",
        "http://1.94.221.189:88/algorithm.php?url="
    ]
    let realUrls = [];
    const tasks = parse_list.map((_url, index) => {
        let task_id = _url + input;
        return {
            func: async function parseTask({_url, task_id}) {
                let json = await requestJson(task_id);
                let url = pjfh(json, '$.url');
                if (!json.code || json.code === 200 || ![-1, 404, 403].includes(json.code)) {
                    if (url) {
                        let lastIndex = url.lastIndexOf('/');
                        let lastLength = url.slice(lastIndex + 1).length;
                        // log('lastLength:', lastLength);
                        if (lastLength > 10) {
                            // log(`code:${json.code} , url:${json.url}`);
                            return json
                        }
                    }
                    throw new Error(`${_url} 解析 ${input} 失败: ${JSON.stringify(json)}`);
                } else {
                    throw new Error(`${_url} 解析 ${input} 失败`);
                }
            },
            param: {_url, task_id},
            id: task_id
        }
    });
    const listener = {
        func: (param, id, error, result) => {
            if (error) {
                // console.error(`Task ${id} failed with error: ${error.message}`);
            } else if (result) {
                // log(`Task ${id} succeeded with result: `, result);
                realUrls.push({original: id, ...result});
            }
            // 中断逻辑示例
            if (param.stopOnFirst && result && result.url) {
                return 'break';
            }
        },
        param: {stopOnFirst: true},
    }
    await batchExecute(tasks, listener, 1);
    return realUrls[0]
}
