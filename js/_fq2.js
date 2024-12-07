// http://localhost:5757/api/番茄小说[书]?ac=list&t=主分类&pg=1
const {getRandomFromList} = $.require('./_lib.random.js');
var rule = {
    类型: '小说',
    title: '番茄小说[书]',
    desc: '番茄小说纯js版本',
    host: 'https://fanqienovel.com/',
    homeUrl: 'https://fanqienovel.com/api/author/book/category_list/v0/',
    url: '/api/author/library/book_list/v0/?page_count=18&page_index=(fypage-1)&gender=-1&category_id=fyclass&creation_status=-1&word_count=-1&sort=0#fyfilter',
    class_parse: async () => {
        log(btoa('123456'));
        log(misc.randMAC());
        log(getRandomFromList(['drpy','drpyS','hipy']));
        // return {}
    },
    headers:{
        'User-Agent':'PC_UA',
    },
    预处理: async () => {
    },
    推荐: async () => {
        // globalThis.fetch_params = {'ua':'xxxx'} // 移除fetch_params,因为不能局部变量，全局变量会导致串数据
        // let html = await request('https://www.baidu.com/')
        // log(html)
        log(typeof RULE_CK,RULE_CK);
        log(typeof RKEY,RKEY);
        log('getItem:',typeof getItem);
        log('setItem:',typeof setItem);
        log('fetch:',typeof fetch);
        log('jsp:',typeof jsp);
        log('pdfh:',typeof pdfh);
        // setItem(RULE_CK, 'dd僵尸大时代');
        log(getItem(RULE_CK));
        log(jsp.MY_URL);
        log(rule.host);
        return []
    },
    一级: async (tid, pg, filter, extend) => {
        console.log(input);
        console.log({tid,pg,filter,extend});
        console.log(rule.host);
        console.log(rule.host.rstrip('/'));
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
