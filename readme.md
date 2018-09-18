# webpack教程之survivejs笔记

>[survivejs教程链接](https://survivejs.com/webpack/foreword)

##  一、功能性
###   1. css处理
- 处理样式中的import


<!--more-->

```js

options: {
    // 处理@import "./variables.sass";
    importLoaders: 1
}

```

- **提取css**

```js
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

```

- **purifyCSS精简**
将不需要的css剔除；

```js
// 精简css
exports.purifyCSS = ({paths}) => ({
    plugins: [new PurifyCSSPlugin({
        paths
    })]
});
```

- 自动补齐

```js
exports.autoprefix = () => ({
    loader: 'postcss-loader',
    options: {
        plugins: () => [require('autoprefixer')()]
    }
});
```

- **使用**

自动补齐添加`.browserslistrc`文件

```js
parts.extractCSS({
    // use: 'css-loader'
    use: ['css-loader', parts.autoprefix()]

}),
parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, {
        nodir: true
    })
}),
```

###  2. 图片处理
- url-loader:可以设置limit，和name;

###  3. js处理

加.env文件；
如果有按需加载的import语法，需要
`"plugins": ["syntax-dynamic-import"]`


###  4. 单个html
```js
{
    plugins:[
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ]
}
```
###  5. 多页处理
> 需要多个entry；需要output.publicPath;页面可通过chunks复用公共资源

定义：
```js
exports.page = ({
        path = '',
        template = require.resolve(
            'html-webpack-plugin/default_index.ejs'
        ),
        title,
        entry,
        chunks = []
    } = {}) => ({
    // 入口
    entry,

    plugins: [
        new HtmlWebpackPlugin({
            chunks,
            filename: `${path && path + '/'}index.html`,
            template,
            title
        })
    ]
});
```

使用：

```js
{
    output: {
        // Needed for code splitting to work in nested paths
        publicPath: '/'
    }
},
    
const pages = [
    parts.page({
        title: 'Webpack demo',
        entry: {
            app: PATHS.app
        },
        chunks: ['app', 'manifest', 'vendor']

    }),
    parts.page({
        title: 'Another demo',
        path: 'another',
        entry: {
            another: path.join(PATHS.app, 'another.js')
        },
        // 没用到，页面也引用了
        chunks: ['another','vendor','manifest']
        // chunks: ['another', 'manifest', 'vendor']

    })
];

return merge([commonConfig, config, {
    mode
}].concat(pages));

```


###  6. 清理功能

```js
exports.clean = path => ({
    plugins: [new CleanWebpackPlugin([path])]
});
```

###  7. 添加版本信息

```js
exports.attachRevision = () => ({
    plugins: [
        new webpack.BannerPlugin({
            banner: new GitRevisionPlugin().version()
        })
    ]
});
```


##  二、代码分割+懒加载+tree-shaking
- 默认自带tree-shaking功能，可以去掉不需要的代码

- **vendor打包**

```js
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
```

- 按需加载,常用在路由当中

```js
import ("./lazy").then
```

##  三、其他优秀
###  compose的模式
> 将定义与配置分离；

webpack.config.js
webpack.parts.js

###  构建分析
产出，然后有许多可视化工具分析

```json
"build:stats": "webpack --env production --profile --json > stats.json"
```


