module.exports = {
    v: '4.5',
    salt: 'BAN/+GGzUBtMW',
    token: 'd12fdcc7-b9ac-48c4-adf6-5b1958e9afc4',
    development: { // 开发环境
        host: '//123.103.9.204:93',
        apiHost: '//123.103.9.204:6058/logger',
    },
    test: {
        apiHost: '//123.103.9.204:6058/logger',
    },
    prev: {
        apiHost: '//ezone.esn.ren/logger',
    },
    production: { // 生产环境
        apiHost: '//ezone.yonyoucloud.com/logger'
    }
}
