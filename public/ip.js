async function getIp() {
    let ip_obj = (await req('http://httpbin.org/ip')).content.parseX.get();
    return ip_obj.origin
}

$.exports = {
    getIp
}
