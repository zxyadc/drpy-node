
var rule = {
    title:'虎牙直播',
    host:'https://www.huya.com',
    homeUrl:'/cache.php?m=LiveList&do=getLiveListByPage&gameId=&tagAll=0&page=1',//用于"分类获取"和"推荐获取"
    url:'/cache.php?m=LiveList&do=getLiveListByPage&gameId=fyfilter&tagAll=0&page=fypage',
    class_name:'网游&娱乐&单机&手游',
    class_url:'1&8&2&3',
    detailUrl:'https://m.huya.com/fyid',//二级详情拼接链接(json格式用)
    filterable: 1,
    filter_url: '{{fl.area}}',
    filter_def: {
        8: {cateId: '2135'},
        1: {cateId: '1'},
        2: {cateId: '1732'},
        3: {cateId: '2336'}
    },
filter: 'H4sIAAAAAAAAA51bWW9bR5b+K4afZoAMQN6NZL+5Y7i7k04cJ5PBLOgHY+JpDJK2B86kMY1GAFIURcoUKdGiRNEkJVGrtVMSJXEnML+FdZen/IU5xauq+opOHnoAPti6l7Wc5TvfWfjXh9GHv/q3vz789sVfHv7q4b8//+8Xv/vm4UcPXz7/0wv6P8steJd9+v+fn3/3w4vpiy/pz37+MqjN+6myV9viD+lP0Yc/fhQ+/Pgr4/5vcceQf/WOxv7tGy914vXG948t+fC7V99NeqWgeTvp5tkgd//ctuK2fMWtbHtry2y/5PUOxPOEGZPPJ/0iW6jdP4lFYgl1nie/fXz/dwf/HiQX3NyGOL6ptvLmFr2t68lg279o3z82E6Z8/PjpPz4SN1T7s3pr0smzreKkU2T5LNs9uX9FiSA4K7PMcNJZ99aWhITU9xsHLJPXH0YMbdOouIUSys7BpLPIakMh0XhidrfeYlDvmOK5E1XXDCrnQWpV3D8CVykN/fGKu971c0K7ZsRWR332LNjd9IdCDWpLd2MrqGbCLYWOlFSHJbfT8U423TdJuWkkYijBuu/aQe140lllSz14w1JvsNY8y/a9/oCt5GgxN7es3otaygTZ8MivdtlV7enL7/7z5QshtzistPA2qB7RG0JLBm6zUJv08h9sYOJRK0G/5G23WWPZ298UL0XhNmyx5KVuhCoTSrz+RW3SrwqVRB1L6dNLn/nNpHu55XbXheTj8M2bO5Zt/jR45432yP+C5ErQHct1ospauH+ezXFnyqXF87gZUfvsb7pnB5ZXvvHnS96icDjTMNRmwahKC/itO7HArIOQ87i7eaHnmA3iz7x3WyW/WfEuzoWR2FGwk1bHTb3lx2uWhWWCFOho7maF7a2TC046Se4TK21vIF3VcbSt2E6atVJBOSWc0kajmgxX/bmrD3Vp4xLeSnoyHJPdi9Oa6rCTbiPYaHv1La8PC+gw0mqzi7fCkhK2UgQbpYKkuKMRAxmyiz5ZgYARU2Eh2zv0Lxr+/pjOTKpmw7duY1+YkQEHczePSY9e71iIMAEizG34uZaGJtGEBS6+XHBTK97ViCxF85FoIqoc3StvuWd9L18lpxN3sGIg/EKaddvCkuMx9U2/8DbIFv3mEnvz/ouPwcKiAOnPnmngFY0klIX6dyX6sEJz0kkpqIlCQHn2jBWKbE/qRNu+SebTJusjxYqDR0A66y1CMPr83ZPv/vLkyd9LC48bKEEOZLW7oL4g8MMALU3hmnSlQohl2mgV2wTOoRaf/l4CEBrAqEkuxurv2d6ReB6Dx3tH7u2Fu1F06zmWk4hpgBvRK954wBauhRVhcFtNeeUrAgmWuZHm56jlQxDSDCQWs2ahnC5Hq8jrK/txb1JuecTx4e5CXB8eo0uZyi8AHDtLbr0mBRONokvnkoSdIcUQ/ghyI+XR48lo201nFCjYcaXeJ7978uhBaNXedZ/lKhBMQERo3QI6nEhCHeTzXz8yPn36e20NMwFKfvbMzx575UvW7bvpa2mIYKSkImIF0r4Ssx4Yesgr9MA4iCIUAvnYpL8rA4Zhauuz7Tnpu45GDehMoYJl+Ach8fA0LIkniYhyvVBtbPmUlfcIgMgGVDy2E1FQFCCVIbUMNuy2a2w/G16CsFz6iYGnJOGFxmjIUyLV0GRrWGD+IZcMMUw8t211D3a+5I2KoQToHv5Fh+CSTFZ5bMyIKoU8/uSzR/9MgBSk37u1K2mYBhx2vcIdQoZ7G2yFONHWdZCUbDgCODfpNMhNQj5pyBcMpYug1/dHu2HY19AYOcl5jjyGZXJBOa/FBLoDwNI03khrjoHHUrSeX5ZySoCrXzfpo8zIsiKas+0dcZzKnJBgxMWdWPQDFWlYYiDhccdJ2l2qF4D42TNv7sTPbUr1wtbcdboH3H5aInoYhgEINrU7iS5gwJQqBNUV93qN5USApbgDuJl5HzR2QoDnZGpKSVld2XhE3e7TR18+/kpGX3BNdzPFMovhpR+wQYnbljRxO6pUEuws8Nyg1yO8kfeAQMPGBT+ZcRulMJhIRzIdOPGbK5ISq+1IQRkoqB47b0y5kiCNsZgWyPj+3bxXFEDkYIwv5t1GmpKWEMoEHiSAdhL3+d+7MFSTaNnyksRtEyNifZcchPIeCh3e1s6r72TMtg3NnpJHbP+adYfEUCUwxrSo5rfWJJgmEG55yBptKzkbBrjgb179+cXrl69eP3j1Hw++ePXti9cPTCUucqQ//PiHjygb+5uTXY6x9FlJB52mDKWQDxKbZW9OuNFVRLroYJiedPpuvTfLQCOI4t0+pWqssxZcpaQCwNYmvbcUJby5rvv2TBkp+nbJezevs70YoiymctEERqHCGp2N0g46HpwNEk83mXQrhx/wZ3DEIJn2DvpE5b1DsmGR9poWiIhMny2ts8IlbWYF2QLL3SpOGCc2rrZLrbjpQ7JWEKYD1uF2LvyLJjvfZENhI3YciMVkPO8NK+76RfB2NbgcWOIdKwHU6nzJr+V/GqRIbv7OCQUJbpBLGVZrT3oL9Hd5zyhY3+PXL55/8+C3P7z844vXws0cQAqCR39lSHgy6bxhhaxYwwRfe/RfL/5H4zV2JDqrZbZ4qHThJMCOgv19otVia+V4/uKItcpetU+I5xUvpFTgbI+f/+Vfvfypd5JXYo+iDklmrJOedFfcZENmdADywXEpODollPC2C24jqVEiKwZ5NQ/5GQ41itcbcUcd9tGfXr3844Ovv5dI5ECIKxxSpOGhOl/gUafKBSruGwfe5S3RJkO3PWIXXbUQ8I7ksbd45C0VCXV5CtWuUeYsXrTQmuBF+od/IdwrFgXpkWvTc/fu0jsSMcKwgWqx5iYpwB+NwhDPQ8r0/pxrXB/LC8Q1Kw9OB14lK/EiAqc/PXTbV5T6UN7jvm+6+S0paHhpM0UxjkIXcQ5+xXqLda9Vac1wIKN0b+789oDO9ICSTu9wQwMKOwJw8Pj5628fPH/5zQP+D2XmCTjdVx9//Zlk/BYcaBpmbElcwHi8XofkJ/YzbAAuChVSpqRipMfHXn4wzX8vg2Rj0ltisu5n2Sit3XN3s8JrCWcr8rzAmyb9FN1clgZiiAPFLfoS/+o4Lb+KTlGrkNy4FqX1mA5UmSgaEYsmhhLGpElHrOLYES2TolwoDO6a39g2kISta+58iLKUroH/1UZBOaW5FUUIuEquNi2TLHAi1m1Kp4ACKZFGdn7LBnNQkEhAxsc6DVqcaAxxepmvGnCE04HfuiMeqEDIsUHLbj3p9XMhF4yR4mZhngAJsCxboJjgj7oqgyMfwLLO7aS/HkYnIfoIEqLlgj88NaKENRCUTLRGuolk/UF/3t0Qgo0hsHnlul+vcxs4v5WsGYosrPCOje6m8ei9KcWqVVKWODjkeCqnFtBSYUk2xU1sFGu94G4P3Ku0v/Seb5OqKMAA4d7myAsoyBPn9N+8leVnG94Jay5kaMHaOjvfkXzbxMrbzR3rrdE7k2Fd5UEmop2fbfP0L3PKljvS1AB82SBHhu8tyrJBHCtCUyNyK6S9XRF7rTgU29xOk5vYeUtq3QRllDa5N3WKbPmcDUVpmlAGDL079FI3BHTTQFuf9E5lLAbz8OpcX16+wgFkoaaIsxOFtbydQ3+1EVosvfhPL15//8P30lphOZJUUN6zIp/ydPhdxR2eS5uMOr+03JcvKJH7VqV7WPqp1bgiMvNsILCdEjJ4vr/P5YANCCNuQXlr7oo2+7CmCSdePAlqArQM00I2ynk8GwszM4wYZE5XVa/2litg8cKtC9EmolDb9Q5SQeXMvZxT6YwTASSiZAFTBcnwgUnx2vFVNzh+R3RHxlPIl4kicR3vb7rnIp45DoDHDO6SNFWqASKYlugpJnmLMm0y4xgVUwTNfqPtN25pORnToISSug3OytwpZabioCiQPWgx1bSjPyNwt9Z1VwuQvNgJoNkNypHPWWtdlcRNZJeIrhzWbu7cnox3DlbW9o4JCFiuwXZkUHOwGNFtBPV5b3CtuaGdgLhGTC/ILpER+jc14iBx9Q5E7ikxCbNaSykJehXNymzWQzaA1esUW02FjSS9SmdiZlMq+3d7bIvD2qR7SQmmAnF152BjTATMvSi7KVFKjUfB37CiNVsRxBDpXY3I8HguvLLnpU7c+WXlJ3ZcyyAabPnC3Tng+LJY8mojyS+wUjktkvLkfuuCFaTDYXI+U4rQ6uFmJAIkf9RVCrW0Sm+/6G4UZ7qVaoOLLqmTXdV0M47gK6s5f3xMKZOycfNn7Y6wTkA+Yu31un+5EDJtepX06t5tuJctMh65G1LfXJsoGzEi/7zJcopJQMsmqK/61S7xbbfzRsoVKJ27fsQO1iHeRoEP+uOqu3ERZsRa1I3G47NhJKy+cneahk6V3ENVo7XsDbLsfZ3H3v0sCYJzhXpLupaFLeiUqrGYBhTfWK5HEXkybroNwc2iCa1MXJj0s2QpWkvdiQJPCHN4GfjjkAv4oxXWmo8J7VgmwnGfctpTjpL7ItkwMFManNAnWBuzvboEyYgolpj/j2JJJs2b0sSZN8Q1Ekh3SED8moVdP5mUG5qQS71d4okMFnVNI6J0j5MH7mIeUmV8K8iWgtUr+ujlXmw+ffxE+7phRX+mOcxNY7oVNyZEg6gWbe8DXkN2aZCLUJYBJWPs0Lu7lI4vuc0lvfgC0rjvdONBpz1zWGO9Rc9Yd6zql/wNbEG2j1hjmTMXnmx1AwJd2fWPITMgxKNk674cqcsGNvROTye9Mqe82wNJHz+YKpj5Ptah31XYUs87TrGagKuYAcFdDBfoKyQMqFiupMOESuOwpEBwlo2iW9nnnroivNq0AIS8d1l2vqfBg2GBQj9++ljb34ohG5w+mQxKQeUKRA5gTdmqe9rkrjCrOShXuiXKihcmnePgUgiSbqnO+NlnT7/84jfquwYEPEItfvlZAoiFvW5fMQnHwoRkqmA2zgTNvnvWl72hCDAAv1r0FqvBDh2vr41zxGwwBdn51q5J4c2ecfeQLChd2U4CnSdJbMYryiaoA54YAoU/rrORrIyaOlWUcOCVb7yTTa+/TGmw9Hi9A0J3YQtXZHziuYUtz9MdnoOvV6ajPKLhHY198ErQ67PWgnyO5Dg/4J5BXG5W8bjIeoWX2yhPqy7wPPlsjnVyFKdVI9eJQWHFqw79wgKrbbL+G6kFLIDoLRodFBOw0C++ZcQBLh5/rgOjlQD0Dkvh4S0VnYFoOR1qmHFd4Cr++G4y3NY7RTiV89Wn/0IJbpASocqMYbsbGub6Fraj0CEce2KDQ1poFiMSWia5cO2n6+wuw65lNLdxoKxzRqDuXzbVkEsU+16hLLTnFpbWFe/PbXhr+1AIcT7IDvgrvWPVhMayzH7WH3c/+5qHosPFYEEwJgJdFSfCBqouFGQm2ArVtWtoI3RV4pghk/zyqVwHhxIO5okHsstLVRFzIkj6c8cu9+U854LZtJc+1KKmiYW5kGPzQCCHSxws8gYb7WDjmlxDpUvYtcoySjQpuvdlCukkZovxmq9HYwktCuH81pR6F9y6oN7OhxijojtZLIzt1dpK/3QEDAIl3gnYKvJTnslyawIRaSnLM75ajd01NFCJadWC/VvWgOwBoCEc49I0auJoE1qXMq4Y2jAOmWgL2VpUP9nw00OtdxHHcZdPPgnJjDhEHIfxptMaqg+PqWvCsbUiZpCkF4vkw+71mgQQqBCF7hpON0m7iMzOExAkhh6hhA5CExgtJYpTpmcH/KzduVkMBAIEM3ozMArTBMFukQxAZnLYONbnV2ZILMh0ZgRqxruhARwk0/zFlcOfBinWKrGuIFYWJrduceDXZAcYO+khQ5TNUsfUY9V2288XiDnqIjExbxYiZecblKfI+gV2dZtlr7RJSSbvJOPQEY723Gt3M6UGKRwMH5g8EJvlPe3ttluVbDYBI0hPPn7g317zKSStMhPHsgGFijc1yuX9dkPqEBnaXsFbPAor9yx9w1ry8mgxMMEyoyJswt/cUTrBE0g1joXjZGESHwI8x87ylip8Ex+ajTpB5o40LoENHbWzq8qT8Yip91pW0veF+RWR7MecuFZkYoPe579+JF0PkI7s1jstsbkrbTzV1lIdURbh5Ka24PWlZhBLyAon/bLevUtEtISJHea1yclYDLOzfV674o2MSp8N13gJZq/OumvBWYbyF3l1aD/Tu2GpkN+ekpPbHKmekl4pA2QZ2SYv543P+azB9Bu8yLW25F0IUhI3ErMlI48gPMOnNUM9qvwdwt1thpYO53dk0QMrXdVbd1tyaAOblNNpWUJwSiim81hy0hRHh/1alj4aWadABaXdKXVlhazXO5ThGEFgj8T4zs8e+zctGOvFoWcC+Rly7BhIiKZTv+7mMUyxmBGcClze9Xfy7GDdTYpoZNiWVhugEBL2NGXmAv3hMKvThhksvIJbq/L2CAYpJ4qJ2zRfCtkJsT+6TLA6cotikMqygMlTVuLmr0lpYWEr9AwOOGVBfCwHgoIkPmF0oP+qXqwTBRcLZaAxORsHI72ta1Z9HzZQZikfQSVg4eU1e7PNWsvBWlZaDfritHemI1IMS1JT/5rh0TYUv0tHrFVmvXlWUzMn8dl6lB4TIhr1SPIRRG2UPQJjT4RC/rgc9oskCiAZIGsifW9s8THylbQGF3ErMpurauM5MQtbows1YGg2ROKZVoVyHCeCZj3o8s/23GzOFJsxXFnFddezdHQNZm1Lm3B6xxNNJEwOlkDYKpGxI/d6x1vsThNEzoZ0k8GWWnBQ9ee2NQGZjladSvNiCIbBBHabsO7DPSMsAK3z6XEyQsmIEasqt95RL6ynK9sB24CJKL02oA16TamKTJNk9qPNpexvBrU1Dt6jXdnQRFnJXykYM6YOVTTKsMOce3ac3ohDCL6nFfzei2iTOIMZzsxyFU+Z+8wPNYAVBKtpluFDd6qzFI9BNOABrLWg7+RAos0rHpnFuOisUOI667nGLPdE16xwoJYDnTEEcaxtupsndEStdRCPYC0dpptnPF0fyObIWnzvFwStN6MO0NO1MTtf1OZ4iRqBNeWvvXfZRDxsHoQVWzlhSDEMbj7NhSUck5mK/YyZtgtxndGeNipoIjnkiefcKVdPZuqw04FRaelQnAo6Y1bjc+5qitvBkOb1G1M3qcJw5YfpfVgEmDq8yGZj+Ns13lWgVboNlSfGcPSMtTa86tA7SKlB7BiSELaSC7IljlJ77dmg4WD6xDkceRTx3mn1SeI6doMgNzHoP3Qk1Wmx4mAdQeMtpTj+RVLVLRDEFvgPhFj3mnSvuvSUCWm9Ff/NJfwKJoF86eyALR2rNI0EgkSVnkzru0NJIeN4z/yiP2yFE8LChWx0ZJhcn82roBcBg5/8rXpP6c8ysVzaPqa3iH59UJS2oeGMg68zcTeiY0zqhsN+40j9IMmytVEr3tzS8mgbez6/mF4ajtZQUmXIf+D/IUhaKEw6auwSBOqTw11ehoWEENXue+/YVQIshd+fhYxHSc6IATaEjTets2th/TfEhvAHicKETB5Dpv2p+N/en7qvNtclIcByCYeNQ2jiYNfyju2ty++AsGWtX6XPYMTVd25+i6VuWXpZOgmQHLeSgeQ/BhbO3l9yuk7mJ3uN086PARvvsWVZedR+2NKfD2T3jSwDgSLN1hte8YjWhlUtMFJKvnKycav9FmXKs4jbsKV1uSt0s8If2gkpmEAl7xlavaVqAzamRsFOnSUHSrhQzJ2OxQnF49C1f7tLGp70xLixjeOVoZInXVnXjSFxPiypX6AadIWpMf34f2zKYNEIPQAA',
    searchUrl:'https://search.cdn.huya.com/?m=Search&do=getSearchContent&q=**&uid=0&v=4&typ=-5&livestate=0&rows=40&start=0',
    searchable:2,
    quickSearch:0,
    headers:{
        'User-Agent':'MOBILE_UA'
    },
    timeout:5000,
    limit:8,
    play_parse:true,
 推荐: async function () {
    return this.一级();
    },
一级: async function () {
  let {input} = this;
  let d = [];
  let jo = JSON.parse(await request(input)).data.datas;
  for (let it of jo) {
    let totalCount = it.totalCount;
    let y = (totalCount / 1e8).toFixed(2) +'亿';
    let w = (totalCount / 1e4).toFixed(2) + '万';
    if (totalCount < 1e8) {
      totalCount = w;
    } else {
      totalCount = y;
    }
    d.push({
      url:it.profileRoom,
      // 标题 链接 图片 观看 up主
  //    url: it.introduction + '┃' + it.profileRoom + '┃' + it.screenshot +'┃' +  totalCount + '┃' + it.nick + '┃' + it.gameFullName + '┃' + it.nick + '┃' + it.introduction,
      title: it.introduction,
      img: it.screenshot,
      desc: '👥 人气' +   totalCount + '🆙' + it.nick
    });
  }
//  return d;
  return setResult(d);
},
 
   
   
   

    二级: async function () {
    let {input,orId} = this;
    let jminput = decodeURIComponent(input);
  //  console.log('input的结果:', input);
 //  let info = jminput.split("/");
    
   //console.log('info的结果:', info[2]);
    let rid = orId;
   console.log('rid的结果:', rid);
    // 以下获取链接的操作改为异步
    let hlsData = await request('https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=' + rid);
    let hlsJson = JSON.parse(hlsData);
    // console.log('hlsJson的结果:', hlsJson);
    let live_url = hlsJson.data.stream.hls.multiLine[0].url;
 //   console.log('live_url的结果:', live_url);
    async function getRealUrl(live_url) {
        let [i, b] = live_url.split('?');
        let r = i.split('/').pop();
        let s = r.replace(/\.(flv|m3u8)/, '');
        let c_tmp = b.split('&').filter(n => n);
        let n = {};
        let c_tmp2 = [];
        c_tmp.forEach(async function (tmp, index) {
            if (index < 3) {
                n[tmp.split('=')[0]] = tmp.split('=')[1];
            } else {
                c_tmp2.push(tmp);
            }
        });
        let tmp2 = c_tmp2.join('&');
        n[tmp2.split('=')[0]] = tmp2.split('=')[1];
        let fm = decodeURIComponent(n.fm).split('&')[0];
        let u = base64Decode(fm);
        let p = u.split('_')[0];
        let f = new Date().getTime() + '0000';
        let ll = n.wsTime;
        let t = '0';
        let h = [p, t, s, f, ll].join('_');
        let m = md5(h);
        return (i + '?wsSecret=' + m + '&wsTime=' + ll + '&u=' + t + '&seqid=' + f + '&ratio=4000' + '&' + c_tmp2.pop()).replace('hls', 'flv').replace('m3u8', 'flv');
    }

    let purl = await getRealUrl(live_url);
    //console.log('purl的结果:', purl);

    let VOD = {};
    VOD.vod_name = hlsJson.data.liveDataintroduction;
    VOD.vod_content = hlsJson.data.welcomeText;
    VOD.vod_remarks = hlsJson.data.liveData.nick;
    /*
    VOD.vod_id = 'no_use';
    VOD.vod_name = info[6];
    VOD.vod_actor = info[4];
    VOD.vod_remarks = info[5];
    VOD.vod_pic = info[2];
    VOD.vod_content = info[0].replace(/https:\/\/www.huya.com\//g, '') +'\n' + '👥 人气' + info[3] + '--------' + '🆙' + info[4];
    */
    VOD.vod_play_from = '虎牙';
    VOD.vod_play_url = '超清$' + purl + '#高清$' + purl.replace(/4000/g, '2000') + '#流畅$' + purl.replace(/4000/g, '500');

    return VOD;
},

// 搜索异步函数修改后
搜索: async function () {
    let {input} = this;
   // console.log('input的结果:', input);
    let d = [];
    let jo = JSON.parse(await request(input)).response[3].docs;
    //console.log('jo的结果:', jo);
    for (let it of jo) {
        d.push({
            url: it.room_id,
            title: it.game_introduction,
            img: it.game_screenshot,
            desc: '👁' + it.game_total_count +'🆙' + it.game_nick,
        });
    }
  return setResult(d);
}
}
