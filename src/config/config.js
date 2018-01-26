module.exports = {
    v: '4.5',
    salt: 'BAN/+GGzUBtMW',
    token: 'd12fdcc7-b9ac-48c4-adf6-5b1958e9afc4',
    development: { // 开发环境
        host: '//123.103.9.204:93',
        apiHost: '//123.103.9.204:6058/logger_new',
    },
    prevdev: { // 预发布开发环境
        apiHost: '//ezone.esn.ren/logger',
    },
    buildev: { // 生产开发环境
        apiHost: 'https://ezone.yonyoucloud.com/logger'
    },
    test: {
        apiHost: '//123.103.9.204:6058/logger_new',
    },
    prev: {
        apiHost: '//ezone.esn.ren/logger',
    },
    production: { // 生产环境
        apiHost: '//ezone.yonyoucloud.com/logger'
    },
}
