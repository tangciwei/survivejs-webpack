const HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack accepts an array of configurations. You can also return a Promise and eventually resolve to a configuration for example.
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ]
};

