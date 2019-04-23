module.exports = {
    v: '4.5',
    salt: 'BAN/+GGzUBtMW',
    token: 'd12fdcc7-b9ac-48c4-adf6-5b1958e9afc4',
    'development': { // 开发环境
        host: '//123.103.9.204:93',
        uploadHost: '//web.api.chaoke.com:6062',
        apiHost: '//123.103.9.204:6058/logger',
    },
    'dev-prev': {
        apiHost: 'https://ezone.esn.ren/logger',
    },
    'test': {
        uploadHost: '//web.api.chaoke.com:6062',
        apiHost: '//123.103.9.204:6058/logger',
    },
    'daily': {
        uploadHost: '//dwweb-api.yyuap.com',
        apiHost: '//123.103.9.204:6058/logger',
    },
    'prev': {
        uploadHost: '//web-api.esn.ren',
        apiHost: '//ezone.esn.ren/logger'
    },
    'production': { // 生产环境
        uploadHost: '//web-api.diwork.com/',
        apiHost: '//ezone.diwork.com/logger'
    }
}
