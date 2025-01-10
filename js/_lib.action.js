const action_data = [
    {
        vod_id: JSON.stringify({
            actionId: '连续对话',
            id: 'talk',
            type: 'input',
            title: '连续对话',
            tip: '请输入消息',
            value: '',
            msg: '开始新的对话',
            button: 3,
            imageUrl: 'https://img2.baidu.com/it/u=1206278833,3265480730&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800',
            imageHeight: 200,
            imageType: 'card_pic_3',
            keep: true,
            width: 680,
            height: 800,
            msgType: 'long_text',
            httpTimeout: 60,
            canceledOnTouchOutside: false,
            selectData: '新的对话:=清空AI对话记录'
        }),
        vod_name: '连续对话',
        vod_pic: 'https://img2.baidu.com/it/u=1206278833,3265480730&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800',
        vod_tag: 'action'
    },
    {
        vod_id: '夸克扫码',
        vod_name: '夸克扫码',
        vod_pic: 'https://pic.qisuidc.cn/s/2024/10/23/6718c212f1fdd.webp',
        vod_remarks: '夸克',
        vod_tag: 'action'
    },
    {
        vod_id: '基础Action指令',
        vod_name: '基础Action',
        vod_tag: 'action'
    },
    {
        vod_id: 'set-cookie',
        vod_name: '设置Cookie',
        vod_pic: 'https://pic.qisuidc.cn/s/2024/10/23/6718c212f1fdd.webp',
        vod_remarks: '夸克',
        vod_tag: 'action'
    },
    {
        vod_id: JSON.stringify({
            actionId: '单项输入',
            id: 'alitoken',
            type: 'input',
            title: '阿里云盘Token',
            tip: '请输入阿里云盘32位的Token',
            value: '',
            msg: '单项输入带图, 例如显示验证码图片',
            imageUrl: 'https://pic.imgdb.cn/item/667ce9f4d9c307b7e9f9d052.webp',
            imageHeight: 200,
            imageType: 'card_pic_3',
        }),
        vod_name: '单项输入带图',
        vod_tag: 'action'
    },
    {
        vod_id: JSON.stringify({
            actionId: '扫码初始动作',
            id: 'alitoken',
            type: 'input',
            title: '阿里云盘Token',
            msg: '弹出窗口就执行initAction里的动作，回调时就关闭窗口，应用于扫码场景，为了演示，动作注释了',
            button: 0,
            timeout: 20,
            qrcode: 'https://www.alipan.com/',
            //initAction: 'initAction'
        }),
        vod_name: '扫码初始动作',
        vod_tag: 'action'
    },
    {
        vod_id: JSON.stringify({
            actionId: '单项快速输入',
            id: 'alitoken',
            type: 'input',
            width: 680,
            title: '阿里云盘Token',
            tip: '请输入阿里云盘32位的Token',
            value: '',
            msg: '中国第五座南极科考站秦岭站正式建成。',
            selectData: '1:=aaa输入默认值,2:=bb输入默认值bbbbb,3:=c输入默认值ddd,4:=输入默认值,5:=111,6:=22222,7:=HOHO,HELLO,world'
        }),
        vod_name: '单项快速输入',
        vod_tag: 'action'
    },
    {
        vod_id: JSON.stringify({
            actionId: '多项输入',
            type: 'multiInput',
            title: 'Action多项输入',
            width: 640,
            msg: '通过action配置的多项输入',
            input: [
                {
                    id: 'item1',
                    name: '项目1',
                    tip: '请输入项目1内容',
                    value: ''
                },
                {
                    id: 'item2',
                    name: '项目2',
                    tip: '请输入项目2内容',
                    value: ''
                },
                {
                    id: 'item3',
                    name: '项目3',
                    tip: '请输入项目3内容',
                    value: ''
                }
            ]
        }),
        vod_name: '多项输入',
        vod_tag: 'action'
    },
    {
        vod_id: JSON.stringify({
            actionId: '单选菜单',
            type: 'menu',
            title: 'Action菜单',
            width: 300,
            column: 2,
            option: [
                {
                    name: '菜单1',
                    action: 'menu1'
                },
                {
                    name: '菜单2',
                    action: 'menu2'
                },
                '菜单3$menu3',
                '菜单4$menu4',
                '菜单5$menu5',
                '菜单6$menu6',
                '菜单7$menu7',
                '菜单8$menu8',
                '菜单9$menu9',
                '菜单10$menu10',
            ],
            selectedIndex: 3
        }),
        vod_name: '单选菜单',
        vod_tag: 'action'
    },
    {
        vod_id: JSON.stringify({
            actionId: '多选菜单',
            type: 'select',
            title: 'Action多选菜单',
            width: 480,
            column: 2,
            option: [
                {
                    name: '选项1',
                    action: 'menu1',
                    selected: true
                },
                {
                    name: '选项2',
                    action: 'menu2'
                },
                {
                    name: '选项3',
                    action: 'menu3',
                    selected: true
                },
                {
                    name: '选项4',
                    action: 'menu4'
                },
                {
                    name: '选项5',
                    action: 'menu5'
                },
                {
                    name: '选项6',
                    action: 'menu6'
                },
                {
                    name: '选项7',
                    action: 'menu7'
                },
                {
                    name: '选项8',
                    action: 'menu8'
                },
                {
                    name: '选项9',
                    action: 'menu9',
                    selected: true
                },
                {
                    name: '选项10',
                    action: 'menu10',
                    selected: true
                },
                {
                    name: '选项11',
                    action: 'menu11',
                    selected: true
                },
                {
                    name: '选项12',
                    action: 'menu12',
                    selected: true
                }
            ]
        }),
        vod_name: '多选菜单',
        vod_tag: 'action'
    },
];

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

$.exports = {
    action_data,
    generateUUID
}
