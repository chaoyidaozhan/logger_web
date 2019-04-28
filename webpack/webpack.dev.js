/*
* @Author: nizhanjun
* @Date:   2018-11-27 10:24:42
* @Last Modified by:   nizhanjun
* @Last Modified time: 2018-11-27 15:32:41
*/
const config = require('./config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')

const NODE_ENV = process.env.NODE_ENV
module.exports = merge(common, {
    devtool: '#cheap-module-eval-source-map',
    mode: 'development',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, config[NODE_ENV].contentBase)
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        quiet: false,
        compress: true,
        contentBase: config[NODE_ENV].contentBase,
        publicPath: 'http://localhost:8081/',
        historyApiFallback: true,
        hot: true,
        open: true,
        port: 8082,
        disableHostCheck: true,
        proxy: {
            '/': {
                target: config[NODE_ENV].proxyTarget,
                secure: false, //是否验证SSl证书
                changeOrigin: true //如果设置为true,那么本地会虚拟一个服务端接收你的请求并代你发送该请求，这样就不会有跨域问题了
            }
        }
    }
})

