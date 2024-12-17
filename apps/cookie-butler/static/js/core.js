// import axios from 'axios';
// import QRCode from 'qrcode';
// import { Buffer } from 'buffer';
// import { v4 as uuidv4 } from 'uuid';

class QRCodeHandler {
    // 状态常量
    static STATUS_NEW = "NEW";            // 待扫描
    static STATUS_SCANED = "SCANED";      // 已扫描
    static STATUS_CONFIRMED = "CONFIRMED"; // 已确认
    static STATUS_CANCELED = "CANCELED";   // 已取消
    static STATUS_EXPIRED = "EXPIRED";     // 已过期

    // 平台常量
    static PLATFORM_QUARK = "quark";      // 夸克
    static PLATFORM_ALI = "ali";          // 阿里云盘
    static PLATFORM_UC = "uc";            // UC
    static PLATFORM_BILI = "bili";        // 哔哩哔哩

    // 通用请求头
    static HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; M2012K10C Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/plain, */*'
    };

    constructor() {
        this.platformStates = {
            [QRCodeHandler.PLATFORM_QUARK]: null,
            [QRCodeHandler.PLATFORM_ALI]: null,
            [QRCodeHandler.PLATFORM_UC]: null,
            [QRCodeHandler.PLATFORM_BILI]: null
        };
    }

    static generateUUID() {
        return crypto.randomUUID();
    }

    async _generateQRCode(url) {
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(url, function (err, res) {
                if (err) reject(err);
                resolve(res);
            });
        });
    }

    async startScan(platform) {
        switch (platform) {
            case QRCodeHandler.PLATFORM_QUARK:
                return await this._startQuarkScan();
            case QRCodeHandler.PLATFORM_ALI:
                return await this._startAliScan();
            case QRCodeHandler.PLATFORM_UC:
                return await this._startUCScan();
            case QRCodeHandler.PLATFORM_BILI:
                return await this._startBiliScan();
            default:
                throw new Error("Unsupported platform");
        }
    }

    async checkStatus(platform) {
        switch (platform) {
            case QRCodeHandler.PLATFORM_QUARK:
                return await this._checkQuarkStatus();
            case QRCodeHandler.PLATFORM_ALI:
                return await this._checkAliStatus();
            case QRCodeHandler.PLATFORM_UC:
                return await this._checkUCStatus();
            case QRCodeHandler.PLATFORM_BILI:
                return await this._checkBiliStatus();
            default:
                throw new Error("Unsupported platform");
        }
    }

    // 夸克平台相关方法
    async _startQuarkScan() {
        try {
            const requestId = QRCodeHandler.generateUUID();
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://uop.quark.cn/cas/ajax/getTokenForQrcodeLogin",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        request_id: requestId,
                        client_id: "532",
                        v: "1.2"
                    },
                }
            });
            const resData = res.data;
            const qcToken = resData.data.data.members.token;

            const qrUrl = `https://su.quark.cn/4_eMHBJ?token=${qcToken}&client_id=532&ssb=weblogin&uc_param_str=&uc_biz_str=S%3Acustom%7COPT%3ASAREA%400%7COPT%3AIMMERSIVE%401%7COPT%3ABACK_BTN_STYLE%400`;

            this.platformStates[QRCodeHandler.PLATFORM_QUARK] = {
                token: qcToken,
                request_id: requestId
            };

            const qrCode = await this._generateQRCode(qrUrl);
            return {
                qrcode: qrCode,
                status: QRCodeHandler.STATUS_NEW
            };
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_QUARK] = null;
            throw e;
        }
    }

    async _checkQuarkStatus() {
        const state = this.platformStates[QRCodeHandler.PLATFORM_QUARK];
        if (!state) {
            return { status: QRCodeHandler.STATUS_EXPIRED };
        }

        try {
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://uop.quark.cn/cas/ajax/getServiceTicketByQrcodeToken",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        request_id: state.request_id,
                        client_id: "532",
                        v: "1.2",
                        token: state.token
                    }
                }
            });
            const resData = res.data;

            if (resData.data.status === 2000000) { // 扫码成功
                const serviceTicket = resData.data.data.members.service_ticket;
                const cookieRes = await axios({
                    url: "/http",
                    method: "POST",
                    data: {
                        url: "https://pan.quark.cn/account/info",
                        headers: {
                            ...QRCodeHandler.HEADERS
                        },
                        params: {
                            st: serviceTicket,
                            lw: "scan"
                        }
                    }
                });
                const cookieResData = cookieRes.data;
                const cookies = Array.isArray(cookieResData.headers['set-cookie']) ? cookieResData.headers['set-cookie'].join('; '):cookieResData.headers['set-cookie'];
                return {
                    status: QRCodeHandler.STATUS_CONFIRMED,
                    cookie: cookies
                };
            } else if (resData.data.status === 50004002) { // token过期
                this.platformStates[QRCodeHandler.PLATFORM_QUARK] = null;
                return { status: QRCodeHandler.STATUS_EXPIRED };
            } else {
                return { status: QRCodeHandler.STATUS_NEW };
            }
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_QUARK] = null;
            throw new Error(e.response.data.message || e.message);
        }
    }

    // 阿里云盘平台相关方法
    async _startAliScan() {
        try {
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://passport.aliyundrive.com/newlogin/qrcode/generate.do",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        appName: "aliyun_drive",
                        fromSite: "52",
                        appEntrance: "web",
                        isMobile: "false",
                        lang: "zh_CN",
                        returnUrl: "",
                        bizParams: "",
                        _bx_v: "2.2.3"
                    }
                }
            });
            const resData = res.data;
            const contentData = resData.data.content.data;
            this.platformStates[QRCodeHandler.PLATFORM_ALI] = {
                ck: contentData.ck,
                t: contentData.t
            };
            const qrCode = await this._generateQRCode(contentData.codeContent);
            return {
                qrcode: qrCode,
                status: QRCodeHandler.STATUS_NEW
            };
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_ALI] = null;
            throw e;
        }
    }

    async _checkAliStatus() {
        const state = this.platformStates[QRCodeHandler.PLATFORM_ALI];
        if (!state) {
            return { status: QRCodeHandler.STATUS_EXPIRED };
        }

        try {
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://passport.aliyundrive.com/newlogin/qrcode/query.do",
                    method: "POST",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        appName: "aliyun_drive",
                        fromSite: "52",
                        _bx_v: "2.2.3"
                    },
                    data: {
                        ck: state.ck,
                        t: state.t,
                        appName: "aliyun_drive",
                        appEntrance: "web",
                        isMobile: "false",
                        lang: "zh_CN",
                        returnUrl: "",
                        navlanguage: "zh-CN",
                        bizParams: ""
                    }
                }
            });
            const resData = res.data;

            if (!resData.data.content || !resData.data.content.data) {
                return { status: QRCodeHandler.STATUS_EXPIRED };
            }

            const status = resData.data.content.data.qrCodeStatus;

            if (status === "CONFIRMED") {
                if (resData.data.content.data.bizExt) {
                    const bizExt = JSON.parse(atob(resData.data.content.data.bizExt));
                    return {
                        status: QRCodeHandler.STATUS_CONFIRMED,
                        token: bizExt.pds_login_result.refreshToken
                    };
                }
                return { status: QRCodeHandler.STATUS_EXPIRED };
            } else if (status === "SCANED") {
                return { status: QRCodeHandler.STATUS_SCANED };
            } else if (status === "CANCELED") {
                this.platformStates[QRCodeHandler.PLATFORM_ALI] = null;
                return { status: QRCodeHandler.STATUS_CANCELED };
            } else if (status === "NEW") {
                return { status: QRCodeHandler.STATUS_NEW };
            } else {
                return { status: QRCodeHandler.STATUS_EXPIRED };
            }
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_ALI] = null;
            throw new Error(e.message);
        }
    }

    // UC平台相关方法
    async _startUCScan() {
        try {
            const requestId = QRCodeHandler.generateUUID();
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://api.open.uc.cn/cas/ajax/getTokenForQrcodeLogin",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        __t: Date.now()
                    },
                    data: {
                        v: "1.2",
                        request_id: requestId,
                        client_id: "381"
                    }
                }
            });
            const resData = res.data;
            const token = resData.data.data.members.token;

            const qrUrl = `https://su.uc.cn/1_n0ZCv?token=${token}&client_id=381&uc_param_str=&uc_biz_str=S%3Acustom%7CC%3Atitlebar_fix`;

            this.platformStates[QRCodeHandler.PLATFORM_UC] = {
                token: token,
                request_id: requestId
            };

            const qrCode = await this._generateQRCode(qrUrl);
            return {
                qrcode: qrCode,
                status: QRCodeHandler.STATUS_NEW
            };
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_UC] = null;
            throw e;
        }
    }

    async _checkUCStatus() {
        const state = this.platformStates[QRCodeHandler.PLATFORM_UC];
        if (!state) {
            return { status: QRCodeHandler.STATUS_EXPIRED };
        }

        try {
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://api.open.uc.cn/cas/ajax/getServiceTicketByQrcodeToken",
                    method: "POST",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        __t: Date.now()
                    },
                    data: {
                        v: "1.2",
                        request_id: state.request_id,
                        client_id: "381",
                        token: state.token
                    }
                }
            });
            const resData = res.data;

            if (resData.data.status === 2000000) { // 扫码成功
                const serviceTicket = resData.data.data.members.service_ticket;
                const cookieRes = await axios({
                    url: "/http",
                    method: "POST",
                    data: {
                        url: "https://drive.uc.cn/account/info",
                        headers: {
                            ...QRCodeHandler.HEADERS
                        },
                        params: {
                            st: serviceTicket
                        },
                    }
                });
                const cookieResData = cookieRes.data;
                const cookies = Array.isArray(cookieResData.headers['set-cookie']) ? cookieResData.headers['set-cookie'].join('; '):cookieResData.headers['set-cookie'];
                this.platformStates[QRCodeHandler.PLATFORM_UC] = null;
                return {
                    status: QRCodeHandler.STATUS_CONFIRMED,
                    cookie: cookies
                };
            } else if (resData.data.status === 50004002) { // token过期
                this.platformStates[QRCodeHandler.PLATFORM_UC] = null;
                return { status: QRCodeHandler.STATUS_EXPIRED };
            } else {
                return { status: QRCodeHandler.STATUS_NEW };
            }
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_UC] = null;
            throw new Error(e.message);
        }
    }

    // 哔哩哔哩平台相关方法
    async _startBiliScan() {
        try {
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        source: "main-mini"
                    }
                }
            });
            const resData = res.data;
            console.log(resData)

            if (resData.data.code !== 0) {
                throw new Error(resData.data.message);
            }

            const qrcodeData = resData.data.data;
            this.platformStates[QRCodeHandler.PLATFORM_BILI] = {
                qrcode_key: qrcodeData.qrcode_key
            };

            const qrCode = await this._generateQRCode(qrcodeData.url);
            return {
                qrcode: qrCode,
                status: QRCodeHandler.STATUS_NEW
            };
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_BILI] = null;
            throw new Error(e.message);
        }
    }

    async _checkBiliStatus() {
        const state = this.platformStates[QRCodeHandler.PLATFORM_BILI];
        if (!state) {
            return { status: QRCodeHandler.STATUS_EXPIRED };
        }

        try {
            const res = await axios({
                url: "/http",
                method: "POST",
                data: {
                    url: "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
                    headers: {
                        ...QRCodeHandler.HEADERS
                    },
                    params: {
                        qrcode_key: state.qrcode_key,
                        source: "main-mini"
                    }
                }
            });
            const resData = res.data;

            if (resData.data.code !== 0) {
                throw new Error(resData.data.message);
            }

            if (resData.data.data.code === 86101) { // 未扫码
                return { status: QRCodeHandler.STATUS_NEW };
            } else if (resData.data.data.code === 86090) { // 已扫码未确认
                return { status: QRCodeHandler.STATUS_SCANED };
            } else if (resData.data.data.code === 0) { // 已确认
                const url = resData.data.data.url;
                let cookie = "";
                if (url) {
                    const search = new URL(url).search;
                    cookie = search.slice(1);
                    cookie = decodeURIComponent(cookie);
                }
                return {
                    status: QRCodeHandler.STATUS_CONFIRMED,
                    cookie: cookie
                };
            } else { // 二维码过期
                this.platformStates[QRCodeHandler.PLATFORM_BILI] = null;
                return { status: QRCodeHandler.STATUS_EXPIRED };
            }
        } catch (e) {
            this.platformStates[QRCodeHandler.PLATFORM_BILI] = null;
            throw new Error(e.message);
        }
    }
}
