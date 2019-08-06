const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清理 /dist 文件夹
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index:'./src/index.js'
    },
    devtool: 'inline-source-map',
    devServer:{
        contentBase: './dist'
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, './dist')

    },
    module:{
        rules:[
            {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                   'css-loader'
                 ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader:'file-loader',
                        options: {
                            name: 'img/[hash].[ext]'
                        }
                    }
                ]
            }
        ]
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