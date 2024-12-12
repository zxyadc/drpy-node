async function getIp() {
    let ip_obj = (await req('http://httpbin.org/ip')).content;
    return ip_obj.parseX.origin
}

$.exports = {
    getIp
}
