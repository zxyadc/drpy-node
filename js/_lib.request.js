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
        return JSON.parse(await req(url, options).content)
    } catch (e) {
        log(`requestJson error:${e.message}`);
        return {}
    }
}

$.exports = {
    requestHtml,
    requestJson
}
