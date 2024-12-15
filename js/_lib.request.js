async function requestHtml(url, options) {
    try {
        let html = (await req(url, options)).content;
        // log(html);
        return html
    } catch (e) {
        log(`requestHtml error:${e.message}`);
        return ''
    }

}

async function requestJson(url, options) {
    try {
        let html = (await req(url, options)).content;
        return JSON.parse(html)
    } catch (e) {
        log(`requestJson error:${e.message}`);
        return {}
    }
}

async function getPublicIp() {
    let ip_obj = await requestJson('http://httpbin.org/ip');
    // log('ip_obj:',ip_obj);
    return ip_obj.origin
}

async function getHtml(config) {
    try {
        return await axios.request(typeof config === "string" ? config : {
            url: config.url,
            method: config.method || 'GET',
            headers: config.headers || {
                'User-Agent': PC_UA
            },
            data: config.data || '',
            responseType: config.responseType || '',//'arraybuffer'
        })
    } catch (e) {
        return e.response
    }

}

$.exports = {
    requestHtml,
    requestJson,
    getPublicIp,
    getHtml
    // axios // 没法import系统库
}
