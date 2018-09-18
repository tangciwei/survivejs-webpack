const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.devServer = ({host, port} = {}) => ({
    devServer: {
        stats: 'errors-only',
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        open: true,
        overlay: true
    }
});

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
exports.extractCSS = ({
        include,
        exclude,
        use = []
    }) => {
    // Output extracted CSS to a file
    const plugin = new MiniCssExtractPlugin({
        filename: '[name].css'
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
