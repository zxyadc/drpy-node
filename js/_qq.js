var rule = {
    title: '标题1',
    description: '这是描述',
    category: '视频',
    class_parse: async () => {
        console.log('执行了分类获取')
        return [
            {type_id: '1', type_name: '电影'},
            {type_id: '2', type_name: '电视剧'},
            {type_id: '3', type_name: '综艺'},
            {type_id: '4', type_name: '动漫'},
        ]
    },
    预处理: async () => {
        console.log('执行了预处理')
        rule.title = 'qq影视'
        await local.set(rule.title, 'cookie', 'qwer1234')

    },
    推荐: async () => {
        console.log('执行了推荐函数')
        console.log(typeof (jsp))
        console.log(typeof (pdfh))
        console.log('pako:', typeof (pako))
        let html = (await req('https://www.baidu.com/', {})).content
        console.log(html)
        let cookie = await local.get(rule.title, 'cookie')
        console.log(cookie)
        console.log(base64Encode(cookie))
        let url = pdfh(html, 'script&&Html')
        console.log('url:', url)
        // console.log(template.getMubans())
        console.log(typeof template.getMubans)
        return [
            {vod_name: '测试电影1', vod_pic: '1.png', vod_remarks: '测试描述1', vod_id: 'http://www.1.com'},
            {vod_name: '测试电影2', vod_pic: '2.png', vod_remarks: '测试描述2', vod_id: 'http://www.2.com'},
        ]
    },
    一级: async (args) => {
        // await sleep(200);
        sleepSync(200);
        let html = await req('123');
        console.log('title:', rule.title);
        console.log('html:' + html);
        console.log(typeof (btoa));
        console.log(btoa('123456'));
        console.log(base64Encode('123456'));
        // console.log({tid, pg, filter, extend})
        console.log(args)
        return html + '\n' + '这是一级:' + rule.title
    },
    二级: async () => {
        return '这是二级:' + rule.title
    },
    搜索: async () => {
        return '这是搜索:' + rule.title
    },
    lazy: async () => {
        return template.getMubans()
    },
};
