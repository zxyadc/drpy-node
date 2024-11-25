// js/360.js
export var rule = {
    title: '标题1',
    description: '这是描述',
    category: '视频',
    一级:async (req)=>{
        let html = await req('123');
        // console.log(html);
        return html
    },
};
