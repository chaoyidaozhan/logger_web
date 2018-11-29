const merge = require('webpack-merge');
const config = require("./webpack.prod.js");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(config, {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
});
