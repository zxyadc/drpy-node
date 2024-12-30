import axios from 'axios';

// https://console.xfyun.cn/services/bm4
// https://xinghuo.xfyun.cn/botcenter/private-dataset
class SparkAI {
    constructor({authKey, baseURL}) {
        if (!authKey) {
            throw new Error('Missing required configuration parameters.');
        }
        this.authKey = authKey;
        this.baseURL = baseURL || 'https://spark-api-open.xf-yun.com';
    }

    async ask(prompt, options = {}) {
        const payload = {
            model: '4.0Ultra', // 使用的模型名称
            user: "道长",
            messages: [{role: 'user', content: prompt}],
            ...options, // 其他选项，如 temperature、max_tokens 等
        };

        try {
            const response = await axios.post(`${this.baseURL}/v1/chat/completions`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.authKey}`, // 使用鉴权信息
                },
            });

            if (response.data && response.data.choices) {
                return response.data.choices[0].message.content;
            } else {
                throw new Error(
                    `Error from Spark AI: ${response.data.error || 'Unknown error'}`
                );
            }
        } catch (error) {
            console.error('Error while communicating with Spark AI:', error.message);
            throw error;
        }
    }
}

export default SparkAI;
