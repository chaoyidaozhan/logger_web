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
        host: '//123.103.9.204:93',
        uploadHost: '//web.api.chaoke.com:6062',
        apiHost: '//123.103.9.204:6058/logger',
        meetHost: 'http://123.103.9.204:6058/meeting/thirdPart/all_meeting_list',
    },
    'develop': { // 91
        uploadHost: '//web.api.chaoke.com:6062',
        apiHost: '//123.103.9.204:6058/logger',
        meetHost: 'http://123.103.9.204:6058/meeting/thirdPart/all_meeting_list',
    },
    'test': { // daily
        uploadHost: '//dwweb-api.yyuap.com',
        apiHost: '//ezone-daily.yyuap/logger',
        meetHost: '//ezone-daily.yyuap/meeting/thirdPart/all_meeting_list',
    },
    'u8c_daily': { // u8c_daliy
        uploadHost: '//dwweb-api-u8c-daily.yyuap.com',
        apiHost: '//ezone-u8c-daily.yyuap/logger',
        meetHost: '//ezone-u8c-daily.yyuap/meeting/thirdPart/all_meeting_list',
    },
    'u8c_prev': { // u8c_prev
        uploadHost: `//${YKJ_IS_DIWORK === '1' ? 'dw' : ''}web-api-yonsuite-pre.diwork.com`,
        apiHost: '//ezone-yonsuite-pre.diwork.com/logger',
        meetHost: '//ezone-yonsuite-pre.diwork.com/meeting/thirdPart/all_meeting_list',
    },
    'prev': {
        uploadHost: '//web-api.esn.ren',
        apiHost: '//ezone.esn.ren/logger',
        meetHost: '//ezone.esn.ren/meeting/thirdPart/all_meeting_list',
    },
    'production': { // 生产环境
        uploadHost: `//${YKJ_IS_DIWORK === '1' ? 'dw' : ''}web-api.diwork.com`,
        apiHost: '//ezone.diwork.com/logger',
        meetHost: '//ezone.diwork.com/meeting/thirdPart/all_meeting_list',
    }
}
