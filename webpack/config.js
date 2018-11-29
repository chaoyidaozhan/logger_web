module.exports = {
    development: { // 开发环境
        proxyTarget: '//123.103.9.204:6058',
        contentBase: '../dist'
    },
    prev: { // 预发布开发环境
        proxyTarget: '//ezone.esn.ren',
        contentBase: '../dist'
    },
    production: { // 生产开发环境
        proxyTarget: 'https://ezone.yonyoucloud.com',
        contentBase: '../dist'
    }
}
