function getCookie(name) {
    var arr = window.document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}
const YKJ_IS_DIWORK = getCookie('YKJ_IS_DIWORK')
module.exports = {
    v: '4.5',
    salt: 'BAN/+GGzUBtMW',
    token: 'd12fdcc7-b9ac-48c4-adf6-5b1958e9afc4',
    'development': { // 开发环境
        uploadHost: '//web.api.chaoke.com:6062',
        apiHost: '//ezone.chaoke.com:6058/logger',
    },
    'develop': { // 91
        uploadHost: '//web.api.chaoke.com:6062',
        apiHost: '//ezone.chaoke.com:6058/logger',
    },
    'test': { // daily
        uploadHost: '//dwweb-api.yyuap.com',
        apiHost: '//ezone-daily.yyuap.com/logger',
    },
    'u8c_daily': { // u8c_daliy
        uploadHost: '//dwweb-api-u8c-daily.yyuap.com',
        apiHost: '//ezone-u8c-daily.yyuap/logger',
    },
    'prev': {
        uploadHost: '//web-api.esn.ren',
        apiHost: '//ezone.esn.ren/logger'
    },
    'production': { // 生产环境
        uploadHost: `//${YKJ_IS_DIWORK === '1' ? 'dw' : ''}web-api.diwork.com`,
        apiHost: '//ezone.diwork.com/logger'
    }
}
