const merge = require('webpack-merge');
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const parts = require('./webpack.parts');

const AggressiveSplittingPlugin = require('webpack').optimize.AggressiveMergingPlugin;

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

// ---------------------------
const commonConfig = merge([
    {
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack demo'
            })

        ]
    },
    parts.loadJavaScript({
        include: PATHS.app
    })

]);
// ---------------------------
const productionConfig = merge([
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

]);
// ---------------------------
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
    if (mode === 'production') {
        return merge(commonConfig, productionConfig, {
            mode
        });
    }

    return merge(commonConfig, developmentConfig, {
        mode
    });

};
