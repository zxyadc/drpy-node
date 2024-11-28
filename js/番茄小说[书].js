// http://localhost:5757/api/番茄小说[书]?ac=list&t=主分类&pg=1
var rule = {
    类型: '小说',
    title: '番茄小说[书]',
    desc: '番茄小说纯js版本',
    host: 'https://fanqienovel.com/',
    homeUrl: 'https://fanqienovel.com/api/author/book/category_list/v0/',
    url: '/api/author/library/book_list/v0/?page_count=18&page_index=(fypage-1)&gender=-1&category_id=fyclass&creation_status=-1&word_count=-1&sort=0#fyfilter',
    searchUrl:'https://api5-normal-lf.fqnovel.com/reading/bookapi/search/page/v/?query=**&aid=1967&channel=0&os_version=0&device_type=0&device_platform=0&iid=466614321180296&passback=((fypage-1)*10)&version_code=999',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: '',
    filter_url: '{{fl.筛选}}',
    filter_def: {
        //全部: {筛选: '-1'},
        主分类: {筛选: '1016'},//男频衍生
        主题: {筛选: '516'},//都市异能
        角色: {筛选: '29'},//如懿衍生
        情节: {筛选: '1034'},//如懿衍生
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    },
    config: {
        api: 'https://novel.snssdk.com/api',
        封面域名: 'http://p6-novel.byteimg.com/large/',
    },
    timeout: 5000,
    play_parse: true,
    class_parse: async () => {
        let html = (await req(rule.homeUrl)).content;
        let json = JSON.parse(html);
        let data_list = json.data;
        let ret = {};
        for (let data of data_list) {
            if (!ret[data.label]) {
                ret[data.label] = {
                    title: [],
                    url: []
                }
            }
            ret[data.label].title.push(data.name);
            ret[data.label].url.push(data.category_id);
        }
        let classes = [];
        let filters = {};
        let keys = Object.keys(ret);
        for (let key of keys) {
            let _titles = ret[key].title;
            let _urls = ret[key].url;
            classes.push({
                type_name: key,
                type_id: key,
            });
            filters[key] = [{
                key: '筛选',
                name: '筛选',
                value: _titles.map((it, index) => {
                    return {
                        n: it,
                        v: _urls[index]
                    }
                })
            }];
        }
        classes.unshift({
            type_name: '全部',
            type_id: '-1',
        });
        return {class:classes,filters}
    },
    预处理: async () => {
    },
    推荐: async () => {
        return []
    },
    一级: async (tid, pg, filter, extend) => {
        console.log({tid,pg,filter,extend});
        console.log(`input:${input},MY_URL:${MY_URL}`);
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
