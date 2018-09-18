const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

exports.devServer = ({host, port} = {}) => ({
    devServer: {
        stats: 'errors-only',
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        open: true,
        overlay: true
    }
});
// css嵌入到页面
exports.loadCSS = ({include, exclude} = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,

                use: ['style-loader', 'css-loader']
            },
            // {
            //   test: /\.less$/,
            //   use: ["style-loader", "css-loader", "less-loader"],
            // }
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 // 处理@import "./variables.sass";
            //                 importLoaders: 1
            //             }
            //         },
            //         'sass-loader'
            //     ]
            // }
        ]
    }
});
// 提取css
exports.extractCSS = ({
        include,
        exclude,
        use = []
    }) => {
    // Output extracted CSS to a file
    const plugin = new MiniCssExtractPlugin({
        // filename: '[name].css'
        filename: '[name].[contenthash:4].css'

    });

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,

                    use: [
                        MiniCssExtractPlugin.loader
                    ].concat(use)
                }
            ]
        },
        plugins: [plugin]
    };
};
// 精简css
exports.purifyCSS = ({paths}) => ({
    plugins: [new PurifyCSSPlugin({
        paths
    })]
});
// 自动补全
exports.autoprefix = () => ({
    loader: 'postcss-loader',
    options: {
        plugins: () => [require('autoprefixer')()]
    }
});
// 图片处理
exports.loadImages = ({
        include,
        exclude,
        options
    } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                include,
                exclude,
                use: {
                    loader: 'url-loader',
                    options
                }
            }
        ]
    }
});
// es6
exports.loadJavaScript = ({include, exclude} = {}) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                use: 'babel-loader'
            }
        ]
    }
});

exports.generateSourceMaps = ({type}) => ({
    devtool: type
});

exports.clean = path => ({
    plugins: [new CleanWebpackPlugin([path])]
});
exports.attachRevision = () => ({
    plugins: [
        new webpack.BannerPlugin({
            banner: new GitRevisionPlugin().version()
        })
    ]
});
// 多页
exports.page = ({
        path = '',
        template = require.resolve(
            'html-webpack-plugin/default_index.ejs'
        ),
        title,
        entry
    } = {}) => ({
    // 入口
    entry,

    plugins: [
        new HtmlWebpackPlugin({
            filename: `${path && path + '/'}index.html`,
            template,
            title
        })
    ]
});
