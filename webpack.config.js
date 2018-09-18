const merge = require('webpack-merge');
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const parts = require('./webpack.parts');
// 分割
const AggressiveSplittingPlugin = webpack.optimize.AggressiveSplittingPlugin;

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

// ---------------------------公用
const commonConfig = merge([
    {
        output: {
            // Needed for code splitting to work in nested paths
            publicPath: '/'
        }
    },
    // {
    //     plugins: [
    //         new HtmlWebpackPlugin({
    //             title: 'Webpack demo'
    //         })

    //     ]
    // },
    parts.loadJavaScript({
        include: PATHS.app
    })

]);
// ---------------------------生产
const productionConfig = merge([
    parts.clean(PATHS.build),

    parts.extractCSS({
        // use: 'css-loader'
        use: ['css-loader', parts.autoprefix()]

    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, {
            nodir: true
        })
    }),
    parts.loadImages({
        options: {
            limit: 15000,
            // name: '[name].[ext]'
            // 图片增加hash
            name: '[name].[hash:4].[ext]'

        }
    }),
    // 增加文件指纹
    {
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash:4].js',
            // chunkFilename: 'chunk.[id].js'
        }
    },

    // 产生sorcemap
    // parts.generateSourceMaps({
    //     type: 'source-map'
    // }),
    // {
    //     optimization: {
    //         splitChunks: {
    //             chunks: 'initial'
    //         }
    //     }
    // },
    // 指明node_modules
    {
        optimization: {
            splitChunks: {
                // 分组打包ok
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial'
                    }
                }
            }
        }
    },
    // {
    //     plugins: [
    //         // HtmlWebpackPlugin会有bug
    //         new AggressiveSplittingPlugin({
    //             minSize: 10000,
    //             maxSize: 30000
    //         })
    //     ]
    // },
    // {
    //     plugins: [
    //         // 合并
    //         new AggressiveMergingPlugin({
    //             minSizeReduce: 2,
    //             moveToParents: true
    //         })
    //     ]
    // }
    // 增加版本信息
    parts.attachRevision()

]);
// ---------------------------开发
const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
    }),
    parts.loadCSS(),
    parts.loadImages()

]);

// 输出的是一个函数；
// 那么需要package.json有改变；--env development
// console.log(merge(commonConfig, developmentConfig, {
//     mode: 'development'
// }));
module.exports = mode => {
    // if (mode === 'production') {
    //     return merge(commonConfig, productionConfig, {
    //         mode
    //     });
    // }

    // return merge(commonConfig, developmentConfig, {
    //     mode
    // });

    const pages = [
        parts.page({
            title: 'Webpack demo',
            entry: {
                app: PATHS.app
            }
        }),
        parts.page({
            title: 'Another demo',
            path: 'another',
            entry: {
                another: path.join(PATHS.app, 'another.js')
            }
        })
    ];
    const config = mode === 'production' ? productionConfig : developmentConfig;
    // 返回数组
    return pages.map(page => merge(
        commonConfig,
        config,
        page,
        {
            mode
        }
    ));

};
