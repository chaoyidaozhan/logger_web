import { getCookie } from 'yyzone'
const YKJ_IS_DIWORK = getCookie('YKJ_IS_DIWORK')
module.exports = {
    dev: { // 开发环境
        uploadHost: 'http://web.api.chaoke.com:6062',
        host: '//ezone.chaoke.com:6058',
    },
    develop: { // 91
        uploadHost: 'http://web.api.chaoke.com:6062',
        host: '//ezone.chaoke.com:6058',
    },
    test: { // daily
        uploadHost: 'https://DWWEB',
        host: 'https://EZONE',
    },
    prev: {
        uploadHost: '//web-api.esn.ren',
        host: '//ezone.esn.ren'
    },
    build: { // 生产环境
        uploadHost: `https://${YKJ_IS_DIWORK === '1' ? 'dw' : ''}web-api.diwork.com`,
        host: 'https://ezone.diwork.com'
    }
}
