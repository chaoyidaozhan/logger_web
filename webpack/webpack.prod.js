/*
* @Author: nizhanjun
* @Date:   2018-11-27 10:24:57
* @Last Modified by:   nizhanjun
* @Last Modified time: 2018-11-27 18:40:15
*/
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production'
})
