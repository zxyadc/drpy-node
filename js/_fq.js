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
    },
    预处理: async () => {
    },
    推荐: async () => {
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
