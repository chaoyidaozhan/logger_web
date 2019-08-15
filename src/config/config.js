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
    dev: { // 开发环境
        uploadHost: '//web.api.chaoke.com:6062',
        host: '//ezone.chaoke.com:6058',
    },
    develop: { // 91
        uploadHost: '//web.api.chaoke.com:6062',
        host: '//ezone.chaoke.com:6058',
    },
    test: { // daily
        uploadHost: '//DWWEB',
        host: '//EZONE',
    },
    prev: {
        uploadHost: '//web-api.esn.ren',
        host: '//ezone.esn.ren'
    },
    build: { // 生产环境
        uploadHost: `//${YKJ_IS_DIWORK === '1' ? 'dw' : ''}web-api.diwork.com`,
        host: '//ezone.diwork.com'
    }
}
