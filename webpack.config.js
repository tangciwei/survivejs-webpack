const merge = require('webpack-merge');
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'src')
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
            name: '[name].[ext]'
        }
    }),
    // 产生sorcemap
    // parts.generateSourceMaps({
    //     type: 'source-map'
    // })

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
