globalThis.h_ost = 'https://api.cenguigui.cn';

var rule = {
    title: '甜圈短剧[短]',
    host: h_ost,
    searchUrl: '/api/duanju/api.php?name=**&page=fypage',
    url: '/api/duanju/api.php?classname=fyclass&offset=fypage',
    headers: {
        'User-Agent': 'okhttp/3.12.11',
    },
    timeout: 5000,
    filterable: 1,
    limit: 20,
    multi: 1,
    searchable: 2,
    play_parse: 1,
    class_parse: async function () {
        const { input, pdfa, pdfh, pd } = this;
        const classes = [];
        const html = await request('https://mov.cenguigui.cn/', { headers: this.headers });
        let data = pdfa(html, ".overflow-auto .btn");
        data.forEach((it) => {
            let type_name = pdfh(it, "button&&Text");
            classes.push({ type_id: type_name, type_name });
        });
        return { class: classes };
    },
    lazy: async function () {
        let {input} = this;
        return {
            parse: 0,
            url: `https://api.cenguigui.cn/api/duanju/api.php?video_id=${input}&type=mp4`
        };
    },
    一级: async function () {
        const { input } = this;
        const d = [];
        const html = await request(input, { headers: this.headers });
        const data = JSON.parse(html).data;
        data.forEach((it) => {
            d.push({
                title: it.title,
                img: it.cover,
                year: it.copyright,
                desc: it.sub_title,
                url: it.book_id
            });
        });
        return setResult(d);
    },
    二级: async function () {
        let { orId } = this;
        let url = `https://api.cenguigui.cn/api/duanju/api.php?book_id=${orId}`;
        let item = JSON.parse(await request(url));
        let VOD = {
            vod_name: item.book_name,
            type_name: item.category,
            vod_pic: item.book_pic,
            vod_content: item.desc,
            vod_remarks: item.duration,
            vod_year: '更新时间:' + item.time,
            vod_actor: item.author
        };
        let playUrls = item.data.map(item => `${item.title}$${item.video_id}`);
        VOD.vod_play_from = '甜圈短剧';
        VOD.vod_play_url = playUrls.join("#");
        return VOD;
    },
    搜索: async function () {
        const { input } = this;
        const d = [];
        const html = await request(input, { headers: this.headers });
        const data = JSON.parse(html).data;
        data.forEach((it) => {
            d.push({
                title: it.title,
                img: it.cover,
                year: it.author,
                desc: it.type,
                url: it.book_id
            });
        });
        return setResult(d);
    }
};