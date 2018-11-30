/*
* @Author: nizhanjun
* @Date:   2018-11-27 10:24:57
* @Last Modified by:   nizhanjun
* @Last Modified time: 2018-11-27 18:40:15
*/
const merge = require('webpack-merge')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS:{
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }
        })
    ]
})
