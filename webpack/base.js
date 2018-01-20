const path = require('path');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const htmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const cssnext = require('postcss-cssnext');

const APP_PATH = path.resolve(__dirname, '../');
const APP_SRC = path.join(APP_PATH, '/src');
const env = process.env.NODE_ENV,
// 是否是生产环境
isProduction = env === 'production' || 'test' || 'prev';

const APP_DIST = path.join(APP_PATH, isProduction ? './web' : 'web');
module.exports = {
    devtool: '#eval-source-map',
    entry: {
        app: [path.join(APP_SRC, "/main.js")],
        vendors: [
            'vue',
            'vuex',
            'vue-router',
            'axios',
        ],
    },
    output: {
        // publicPath: './',
        path: APP_DIST,
        filename: '[name].js',
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
            app_src: APP_SRC,
            app_component: 'app_src/components',
            app_view: 'app_src/view',
        },
        extensions: ['.js', '.json', '.vue', '.scss', '.css']
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /^node_modules$/,
                loader: 'url-loader?limit=1000&name=img/[name]-[hash].[ext]',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash].[ext]'
                }
            },
            {
                test: /\.(swf)(\?[a-z0-9]+)?$/,
                loader: 'file-loader',
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader',
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader?importLoaders=1!postcss-loader!less-loader',
            },
            {   
                test: /iview.src.*?js$/, loader: 'babel-loader' 
            },
            {
                test: /\.js$/,
                include: APP_SRC,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', {
                                modules: false
                            }]
                        ]
                    }
                }]
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            filename: 'vendors.js',
        }),
        new htmlWebpackPlugin({
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunks: ['manifest', 'vendor', 'app'],
            chunksSortMode: 'dependncy',
            favicon: path.join(APP_SRC, '/assets/images/dailyrecord.png'),
            template: path.join(APP_SRC, '/template/index.html'),
        }),
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(process.env.NODE_ENV),
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [cssnext({
                        browsers: [
                            "> 1%",
                            "last 2 versions",
                            "not ie <= 8"
                        ]
                    })];
                },
            },
            vue: {
                postcss: function () {
                    return [cssnext({
                        browsers: [
                            "> 1%",
                            "last 2 versions",
                            "not ie <= 8"
                        ]
                    })];
                },
            }
        }),
    ],
};
