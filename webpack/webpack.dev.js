/*
* @Author: nizhanjun
* @Date:   2018-11-27 10:24:42
* @Last Modified by:   nizhanjun
* @Last Modified time: 2018-11-27 15:32:41
*/

const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        quiet: false,
        contentBase: '../dist',
        publicPath: 'http://localhost:8082/',
        historyApiFallback: true,
        hot: true,
        port: 8082,
        proxy: {
            '/': {
                target: '//123.103.9.204:6058',
                secure: false, //是否验证SSl证书
                changeOrigin: true //如果设置为true,那么本地会虚拟一个服务端接收你的请求并代你发送该请求，这样就不会有跨域问题了
            }
        },
    }
})

