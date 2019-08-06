const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清理 /dist 文件夹
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer:{
        contentBase: './dist'
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, './dist')

    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '分享的组件',
            template: './src/index.html'
        })
    ],
    optimization:{
        splitChunks:{
            chunks: 'all'
        }
    }
};