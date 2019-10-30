module.exports = {
    dev: { // 开发环境
        proxyTarget: '//123.103.9.204:6058',
        contentBase: '../web',
        phpHost: 'http://web.api.chaoke.com:6062'
    },
    develop: {
        phpHost: 'http://web.api.chaoke.com:6062'
    },
    test: {
        phpHost: 'http://dwweb.api.yyuap.com:6062'
    },
    prev: {
        phpHost: 'https://dwweb-api.diwork.com'
    },
    build: {
        phpHost: 'https://dwweb-api.diwork.com'
    }
}
