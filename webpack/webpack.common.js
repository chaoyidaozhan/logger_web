/*
 * @Author: nizhanjun
 * @Date:   2018-11-27 10:24:27
 * @Last Modified by:   nizhanjun
 * @Last Modified time: 2018-11-27 19:14:11
 */
const path = require('path')
const webpack = require("webpack")
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HappyPack = require('happypack')
const utils = require('./utils')
const config = require('./config/')

const APP_ROOT = path.resolve(__dirname, '../')

function resolve(dir) {
    return path.join(APP_ROOT, dir)
}

const APP_DIST = resolve('web')
const APP_SRC = resolve('/src')

const NODE_ENV = process.env.NODE_ENV

// vue happypack loader
const cssLoader = new MiniCssExtractPlugin({
    use: [
        'happypack/loader?id=happy-css'
    ]
})
const vueLoaderConfig = {
    ...utils.cssLoaders({
        sourceMap: false,
        extract: NODE_ENV !== 'dev'
    }),
    js: 'happypack/loader?id=happy-babel-vue',
    css: cssLoader
}

// css and less loader
function createCssAndLessLoader() {
    const loaders = [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../'
            }
        },
        'css-loader',
        {
            loader: "postcss-loader",
            options: {
                plugins: [
                    require("autoprefixer")
                ]
            }
        },
        'less-loader',
        {
            loader: 'style-resources-loader',
            options: {
                patterns: resolve(`/src/assets/css/var.less`)
            }
        }
    ]
    return Object.assign([NODE_ENV === 'dev' ? 'css-hot-loader' : ''], loaders)
}
module.exports = {
    entry: [
        '@babel/polyfill',
        path.join(APP_ROOT, 'src/main.js')
    ],
    output: {
        path: APP_DIST,
        filename: 'js/[name].[contenthash:8].js',
        publicPath: './'
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
            'app_src': APP_SRC,
            'app_component': 'app_src/components',
            'app_view': 'app_src/view',
            'app_assets': 'app_src/assets'
        },
        extensions: ['.js', '.vue', '.css', '.less', '.json', '.scss']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: { // node_modules内的依赖库
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    minChunks: 1,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    module: {
        noParse: /node_modules\/(iview\.js)/,
        rules: [{
                test: /\.js$/,
                loader: 'happypack/loader?id=happy-babel-js',
                include: [
                    APP_SRC,
                    resolve('/node_modules/yyzone/src'),
                    resolve('/node_modules/vue-photo-preview/src')
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig,
                include: [
                    APP_SRC, 
                    resolve('/node_modules/yyzone/src'), 
                    resolve('/node_modules/vue-photo-preview/src')
                ]
            },
            {
                test: /\.(c|le)ss$/,
                use: createCssAndLessLoader()
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'images/[name].[hash:8].[ext]'
                },
                include: [
                    APP_SRC,
                    resolve('/node_modules/yyzone/src'),
                    resolve('/node_modules/vue-photo-preview/dist')
                ]
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin([APP_DIST], {
        //     allowExternal: true
        // }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(NODE_ENV),
        }),
        utils.createHappyPlugin('happy-babel-js', [{
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                cacheDirectory: true
            }
        }]),
        utils.createHappyPlugin('happy-babel-vue', ['babel-loader?cacheDirectory=true']),
        utils.createHappyPlugin('happy-css', ['css-loader', 'vue-style-loader']),
        new HappyPack({
            loaders: [{
                path: 'vue-loader',
                query: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!less-loader?indentedSyntax'
                    }
                }
            }]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash:8].css",
            chunkFilename: "[id].css",
        }),
        new HtmlWebpackPlugin({
            phpHost: (config[NODE_ENV] || config.build).phpHost,
            favicon: resolve('/src/assets/images/dailyrecord.png'),
            template: resolve('/src/template/index.html'),
        })
    ],
    performance: {
        hints: 'warning', // 枚举
        maxAssetSize: 20240000, // 整数类型（以字节为单位）
        maxEntrypointSize: 202400000, // 整数类型（以字节为单位
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    }
}
