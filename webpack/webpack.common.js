/*
 * @Author: nizhanjun
 * @Date:   2018-11-27 10:24:27
 * @Last Modified by:   nizhanjun
 * @Last Modified time: 2018-11-27 19:14:11
 */
const path = require('path')
const webpack = require("webpack")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HappyPack = require('happypack')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
})

const APP_ROOT = path.resolve(__dirname, '../')
const APP_DIST = path.join(APP_ROOT, 'dist')
const APP_SRC = path.join(APP_ROOT, '/src')

module.exports = {
    entry: [
        '@babel/polyfill',
        path.join(APP_ROOT, 'src/main.js')
    ],
    plugins: [
        new CleanWebpackPlugin([APP_DIST], {
            allowExternal: true
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(process.env.NODE_ENV),
        }),
        new MiniCssExtractPlugin({
            filename: "styles/[name].[chunkhash:8].css",
            chunkFilename: "styles/[id].css"
        }),
        new HappyPack({
            id: 'happyBabel',
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            threadPool: happyThreadPool,
            verbose: true,
        }),
        new HtmlWebpackPlugin({
            template: path.join(APP_SRC, '/template/index.html'),
        })
    ],
    output: {
        filename: '[name].[chunkhash].js',
        path: APP_DIST
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
                },
                common: {
                    chunks: "all",
                    test: /[\\/]src[\\/]js[\\/]/, //也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,  
                    name: "common", //生成文件名，依据output规则
                    minChunks: 2,
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
        rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                }],
                include: [
                    APP_SRC,
                    path.join(APP_ROOT, '/node_modules/yyzone/src'),
                ]
            },
            {
                test: /\.vue$/,
                use: [
                    'vue-loader'
                ],
                include: [
                    APP_SRC,
                    path.join(APP_ROOT, '/node_modules/yyzone/src'),
                ]
            },
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash].[ext]'
                    }
                }],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'images/[name].[hash].[ext]'
                        }
                    }
                ],
                include: APP_SRC
            }
        ]
    }
}
