import WebSocket from 'ws';
import crypto from 'crypto';

class SparkAIBot {
    constructor(appId, uid, assistantId) {
        if (!appId || !assistantId) {
            throw new Error('Missing required configuration parameters.');
        }
        this.appId = appId;
        this.uid = uid || '道长';
        this.assistantId = assistantId; // assistantId
        this.wsUrl = `wss://spark-openapi.cn-huabei-1.xf-yun.com/v1/assistants/${assistantId}`; // 在构造函数中直接拼接完整的URL
        this.apiKey = 'your_api_key'; // 填写你自己的API密钥
    }

    // 生成签名
    generateSignature() {
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = `${this.appId}${timestamp}${this.apiKey}`;
        const hash = crypto.createHash('sha256');
        hash.update(signature);
        return hash.digest('hex');
    }

    // 发起WebSocket连接
    connectToAssistant() {
        const ws = new WebSocket(this.wsUrl, {
            headers: {
                'x-signature': this.generateSignature(),
                'x-app-id': this.appId,
                // 'x-uid': this.uid
            }
        });

        ws.on('open', () => {
            // console.log('WebSocket connection established');
        });

        return ws;
    }

    // 发送请求数据
    sendMessage(ws, prompt) {
        const requestPayload = {
            header: {
                app_id: this.appId,
                uid: this.uid
            },
            parameter: {
                chat: {
                    domain: 'general',
                    temperature: 0.5,
                    top_k: 4,
                    max_tokens: 2028
                }
            },
            payload: {
                message: {
                    text: [
                        {role: 'user', content: prompt}
                    ]
                }
            }
        };

        ws.send(JSON.stringify(requestPayload));
    }

    // ask函数，传入用户问题prompt，返回AI的完整回答
    ask(prompt) {
        return new Promise((resolve, reject) => {
            const ws = this.connectToAssistant();
            let fullResponse = '';  // 用于存储完整的文本响应

            // 收集返回的文本数据
            ws.on('message', (data) => {
                const response = JSON.parse(data);
                if (response && response.payload && response.payload.choices) {
                    response.payload.choices.text.forEach(choice => {
                        fullResponse += choice.content;  // 累加每个片段的文本内容
                    });
                }
            });

            // 发送消息并等待回应
            ws.on('open', () => {
                this.sendMessage(ws, prompt);
            });

            // 在WebSocket关闭时返回完整的响应
            ws.on('close', () => {
                // console.log('WebSocket connection closed');
                resolve(fullResponse);  // 返回完整的响应文本
            });

            // 处理错误
            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                reject(error);  // 出现错误时，Promise 被拒绝
            });
        });
    }
}

// 从这里获取应用的两个参数 https://xinghuo.xfyun.cn/botcenter/createbot

/*
// 使用示例
const assistant = new SparkAIBot('6fafca91', '道长', 'tke24zrzq3f1_v1');

async function getWeather() {
    try {
        const response = await assistant.ask('你知道zyplayer吗？');
        console.log('AI Response:', response);  // 获取到的完整文本
    } catch (error) {
        console.error('Error getting response:', error);
    }
}

getWeather();

*/

export default SparkAIBot;
