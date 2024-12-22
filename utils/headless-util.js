import * as puppeteer from 'puppeteer'

class PuppeteerHelper {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async gotoHtml(config) {
        this.browser = await puppeteer.launch({
            headless: config.headless || true,
            executablePath: process.env.CHROME_PATH
        }); // 可以设置为true以无头模式运行
        this.page = await this.browser.newPage();
        await this.page.setExtraHTTPHeaders(config.headers || {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
        })
        let content = ''
        if (config.isJSON || config.isReq) {
            return await this.page.evaluate(async (url, mth, headers, data) => {
                const requestOptions = {
                    method: mth || 'GET',
                    headers: headers || {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
                        'Content-Type': 'application/json'
                    },
                };
                if (mth !== 'GET' && (data !== '' && data !== undefined)) {
                    requestOptions.body = JSON.stringify(data);
                }
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.text();
            }, config.url, config.method, config.headers, config.data);
        } else {
            await this.page.goto(config.url, config.options);
            content = await this.page.content()
            return content
        }
    }

    async gotoCookie(config) {
        this.browser = await puppeteer.launch({
            headless: config.headless || true,
            executablePath: process.env.CHROME_PATH
        }); // 可以设置为true以无头模式运行
        this.page = await this.browser.newPage();
        await this.page.goto(config.url, config.options || {});
        // 获取当前页面的cookies
        const cookies = await this.page.cookies();
        // 打印cookies
        // log('Cookies:', cookies);
        return cookies || []
    }

    async type(selector, text, options = {}) {
        return await this.page.type(selector, text, ...options);//{ delay: 100 }
    }

    async gotoclick(selector) {
        return await this.page.click(selector);
    }

    async pdf(path, options = {}) {
        return await this.page.pdf({path, ...options});
    }

    async getTitle() {
        return await this.page.title();
    }

    async getUrl() {
        return await this.page.url();
    }

    // 执行自定义的 JavaScript 函数
    async evaluate(fn, ...args) {
        const funcString = fn.toString();// 将函数转换为字符串
        // 构造一个在页面上下文中调用的函数，该函数调用传入的自定义函数
        const pageFunction = new Function(`return (${funcString})`).apply(null, args.map(arg => JSON.stringify(arg)));
        return await this.page.evaluate(pageFunction);
    }

    // 获取页面元素的文本内容
    async gotoText(selector) {
        return await this.page.evaluate((selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent : null;
        }, selector);
    }

    // 获取页面元素的属性值
    async gotoAttribute(selector, attribute) {
        return await this.page.evaluate((selector, attribute) => {
            const element = document.querySelector(selector);
            return element ? element.getAttribute(attribute) : null;
        }, selector, attribute);
    }

    async waitForSelector(selector, options = {}) {
        const {timeout = 30000, onFound} = options; // 默认超时为30秒
        try {
            // 使用 Page 的 waitForSelector 方法，并设置超时
            const elementHandle = await this.page.waitForSelector(selector, {timeout});
            // 如果提供了 onFound 回调，则调用它并传入元素句柄
            if (onFound) {
                await onFound(elementHandle);
            }
            // 返回元素句柄（如果需要的话，调用者可以进一步处理它）
            return elementHandle;
        } catch (error) {
            // 如果超时或选择器未找到，则抛出错误
            throw new Error(`Element with selector "${selector}" not found within ${timeout / 1000} seconds.`);
        }
    }

    async close() {
        if (this.page) {
            await this.page.close();
        }
        if (this.browser) {
            await this.browser.close();
        }
    }
}

export const puppeteerHelper = PuppeteerHelper
