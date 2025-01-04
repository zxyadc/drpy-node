const {getHtml} = $.require('./_lib.request.js')
const {
    formatPlayUrl,
} = misc;
const aliTranscodingCache = {};
const aliDownloadingCache = {};
var rule = {
    title: '推送',
    host: '',
    class_name: '推送',
    class_url: 'push',
    url: '',
    play_parse: true,
    一级: async function (tid, pg, filter, extend) {
        let {MY_CATE, MY_PAGE, input} = this;
        return []
    },
    二级: async function (ids) {
        let {input, orId, publicUrl} = this;
        let playform = []
        let playurls = []
        input = decodeURIComponent(orId);
        let icon = urljoin(publicUrl, './images/icon_cookie/推送.jpg');
        // log(input);
        let vod = {
            vod_pic: icon,
            vod_id: orId,
            vod_content: orId || '温馨提醒:宝子们，推送的时候记得确保ids存在哟~',
            vod_name: 'DS推送:道长&秋秋倾情打造',
        }
        try {
            let push_vod = JSON.parse(input);
            push_vod = Array.isArray(push_vod) ? push_vod[0] : push_vod;
            vod.vod_actor = push_vod.actor || push_vod.vod_actor || '';
            vod.vod_content = push_vod.content || push_vod.vod_content || '';
            vod.vod_director = push_vod.director || push_vod.vod_director || '';
            vod.vod_play_from = push_vod.from || push_vod.vod_play_from || '';
            vod.vod_name = push_vod.name || push_vod.vod_name || '';
            vod.vod_pic = push_vod.pic || push_vod.vod_pic || '';
            vod.vod_play_url = push_vod.url || push_vod.vod_play_url || '';
            // 推送json兼容依赖播放属性
            vod.vod_play_api = push_vod.vod_play_api || '';
            return vod
        } catch (e) {
        }
        if (input.indexOf('#')) {
            let list = input.split('#');
            log(list);
            for (let i = 0; i < list.length; i++) {
                if (/pan.quark.cn|drive.uc.cn|www.alipan.com/.test(list[i])) {
                    if (/pan.quark.cn/.test(list[i])) {
                        const shareData = Quark.getShareData(list[i]);
                        if (shareData) {
                            const videos = await Quark.getFilesByShareUrl(shareData);
                            if (videos.length > 0) {
                                playform.push('Quark-' + shareData.shareId);
                                playurls.push(videos.map((v) => {
                                    const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                                    return v.file_name + '$' + list.join('*');
                                }).join('#'))
                            } else {
                                playform.push('Quark-' + shareData.shareId);
                                playurls.push("资源已经失效，请访问其他资源")
                            }
                        }
                    }
                    if (/drive.uc.cn/.test(list[i])) {
                        const shareData = UC.getShareData(list[i]);
                        if (shareData) {
                            const videos = await UC.getFilesByShareUrl(shareData);
                            if (videos.length > 0) {
                                playform.push('UC-' + shareData.shareId);
                                playurls.push(videos.map((v) => {
                                    const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                                    return v.file_name + '$' + list.join('*');
                                }).join('#'))
                            } else {
                                playform.push('UC-' + shareData.shareId);
                                playurls.push("资源已经失效，请访问其他资源")
                            }
                        }
                    }
                    if (/www.alipan.com/.test(list[i])) {
                        const shareData = Ali.getShareData(list[i]);
                        if (shareData) {
                            const videos = await Ali.getFilesByShareUrl(shareData);
                            log(videos)
                            if (videos.length > 0) {
                                playform.push('Ali-' + shareData.shareId);
                                playurls.push(videos.map((v) => {
                                    const ids = [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''];
                                    return formatPlayUrl('', v.name) + '$' + ids.join('*');
                                }).join('#'))
                            } else {
                                playform.push('Ali-' + shareData.shareId);
                                playurls.push("资源已经失效，请访问其他资源")
                            }
                        }
                    }
                } else {
                    playform.push('推送');
                    playurls.push("推送" + '$' + list[i])
                }
            }
        } else if (/pan.quark.cn|drive.uc.cn|www.alipan.com/.test(input)) {
            if (/pan.quark.cn/.test(input)) {
                const shareData = Quark.getShareData(input);
                if (shareData) {
                    const videos = await Quark.getFilesByShareUrl(shareData);
                    if (videos.length > 0) {
                        playform.push('Quark-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                            return v.file_name + '$' + list.join('*');
                        }).join('#'))
                    } else {
                        playform.push('Quark-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            }
            if (/drive.uc.cn/.test(input)) {
                const shareData = UC.getShareData(link);
                if (shareData) {
                    const videos = await UC.getFilesByShareUrl(shareData);
                    if (videos.length > 0) {
                        playform.push('UC-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
                            return v.file_name + '$' + list.join('*');
                        }).join('#'))
                    } else {
                        playform.push('UC-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            }
            if (/www.alipan.com/.test(input)) {
                const shareData = Ali.getShareData(link);
                if (shareData) {
                    const videos = await Ali.getFilesByShareUrl(shareData);
                    log(videos)
                    if (videos.length > 0) {
                        playform.push('Ali-' + shareData.shareId);
                        playurls.push(videos.map((v) => {
                            const ids = [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''];
                            return formatPlayUrl('', v.name) + '$' + ids.join('*');
                        }).join('#'))
                    } else {
                        playform.push('Ali-' + shareData.shareId);
                        playurls.push("资源已经失效，请访问其他资源")
                    }
                }
            }
        }
            // else if((typeof JSON.parse(input) === 'object'&& JSON.parse(input).url !=='')){
            //     let json = JSON.parse(input);
            //     let list = JSON.parse(input).url.split('#');
            //     vod = {
            //         vod_name: json.vod_name || '',
            //         vod_pic: json.vod_pic || '',
            //         vod_content: json.vod_content || '',
            //         vod_remarks: json.vod_remarks || '',
            //     }
            //     for (let i = 0; i < list.length; i++) {
            //         if(/pan.quark.cn|drive.uc.cn|www.alipan.com/.test(list[i])){
            //             if (/pan.quark.cn/.test(list[i])) {
            //                 const shareData = Quark.getShareData(list[i]);
            //                 if (shareData) {
            //                     const videos = await Quark.getFilesByShareUrl(shareData);
            //                     if (videos.length > 0) {
            //                         playform.push('Quark-' + shareData.shareId);
            //                         playurls.push(videos.map((v) => {
            //                             const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
            //                             return v.file_name + '$' + list.join('*');
            //                         }).join('#'))
            //                     } else {
            //                         playform.push('Quark-' + shareData.shareId);
            //                         playurls.push("资源已经失效，请访问其他资源")
            //                     }
            //                 }
            //             }
            //             if (/drive.uc.cn/.test(list[i])) {
            //                 const shareData = UC.getShareData(list[i]);
            //                 if (shareData) {
            //                     const videos = await UC.getFilesByShareUrl(shareData);
            //                     if (videos.length > 0) {
            //                         playform.push('UC-' + shareData.shareId);
            //                         playurls.push(videos.map((v) => {
            //                             const list = [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle ? v.subtitle.fid : '', v.subtitle ? v.subtitle.share_fid_token : ''];
            //                             return v.file_name + '$' + list.join('*');
            //                         }).join('#'))
            //                     } else {
            //                         playform.push('UC-' + shareData.shareId);
            //                         playurls.push("资源已经失效，请访问其他资源")
            //                     }
            //                 }
            //             }
            //             if (/www.alipan.com/.test(list[i])) {
            //                 const shareData = Ali.getShareData(list[i]);
            //                 if (shareData) {
            //                     const videos = await Ali.getFilesByShareUrl(shareData);
            //                     log(videos)
            //                     if (videos.length > 0) {
            //                         playform.push('Ali-' + shareData.shareId);
            //                         playurls.push(videos.map((v) => {
            //                             const ids = [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''];
            //                             return formatPlayUrl('', v.name) + '$' + ids.join('*');
            //                         }).join('#'))
            //                     } else {
            //                         playform.push('Ali-' + shareData.shareId);
            //                         playurls.push("资源已经失效，请访问其他资源")
            //                     }
            //                 }
            //             }
            //         }else {
            //             playform.push('推送');
            //             playurls.push("推送"+'$'+list[i])
            //         }
            //     }
        // }
        else {
            playform.push('推送');
            playurls.push("推送" + '$' + input)
        }
        vod.vod_play_from = playform.join("$$$")
        vod.vod_play_url = playurls.join("$$$")
        return vod
    },
    lazy: async function (flag, id, flags) {
        let {input} = this;
        if (flag === '推送') {
            if (tellIsJx(input)) {
                return {parse: 1, jx: 1, url: input}
            } else if (/m3u8|mp4|m3u/.test(input)) {
                return {url: input}
            } else {
                return {parse: 1, url: input}
            }
        } else if (/Quark-|UC-|Ali-/.test(flag)) {
            const ids = input.split('*');
            const urls = [];
            let UCDownloadingCache = {};
            let downUrl = ''
            if (flag.startsWith('Quark-')) {
                console.log("夸克网盘解析开始")
                const down = await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                // urls.push("go原画代理",'http://127.0.0.1:7777/?thread=20&url='+down.download_url)
                urls.push("原画", down.download_url + '#fastPlayMode##threads=10#')
                const transcoding = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter((t) => t.accessable);
                transcoding.forEach((t) => {
                    urls.push(t.resolution === 'low' ? "流畅" : t.resolution === 'high' ? "高清" : t.resolution === 'super' ? "超清" : t.resolution, t.video_info.url)
                });
                return {
                    parse: 0,
                    url: urls,
                    header: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'origin': 'https://pan.quark.cn',
                        'referer': 'https://pan.quark.cn/',
                        'Cookie': Quark.cookie
                    }
                }
            }
            if (flag.startsWith('UC-')) {
                console.log("UC网盘解析开始")
                if (!UCDownloadingCache[ids[1]]) {
                    const down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
                    if (down) UCDownloadingCache[ids[1]] = down;
                }
                downUrl = UCDownloadingCache[ids[1]].download_url;
                urls.push("UC原画", downUrl);
                return {
                    parse: 0,
                    url: urls,
                    header: {
                        "Referer": "https://drive.uc.cn/",
                        "cookie": UC.cookie,
                        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch'
                    },
                }
            }
            if (flag.startsWith('Ali-')) {
                const transcoding_flag = {
                    UHD: "4K 超清",
                    QHD: "2K 超清",
                    FHD: "1080 全高清",
                    HD: "720 高清",
                    SD: "540 标清",
                    LD: "360 流畅"
                };
                console.log("网盘解析开始")
                const down = await Ali.getDownload(ids[0], ids[1], flag === 'down');
                urls.push("原画", down.url + "#isVideo=true##ignoreMusic=true#")
                urls.push("极速原画", down.url + "#fastPlayMode##threads=10#")
                const transcoding = (await Ali.getLiveTranscoding(ids[0], ids[1])).sort((a, b) => b.template_width - a.template_width);
                transcoding.forEach((t) => {
                    if (t.url !== '') {
                        urls.push(transcoding_flag[t.template_id], t.url);
                    }
                });
                return {
                    parse: 0,
                    url: urls,
                    header: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'Referer': 'https://www.aliyundrive.com/',
                    },
                }
            }
        } else {
            return input
        }
    },
}

