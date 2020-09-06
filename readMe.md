> webpack本质上是`模块打包工具`，能识别模块化语法，把模块打包到一起,不光是js文件，通过loader能打包css，图片文件等任何内容

## package.json
```JS
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",//外部引用的入口文件，发布npm包时使用
  "scripts": {//执行脚本
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "liuxiaoru",
  "license": "ISC"
}
```
## 安装
```JS
//全局安装
 npm install webpack webpack-cli -g
//局部安装
 npm install webpack webpack-cli -D

//npx 命令会去node_modules找对应模块
// webpack-cli作用，使我们能在命令行使用webpack命令
```
## webpack 配置

**默认配置文件**

`webpack.config.js`

**自定义打包配置文件**

```js
webpack --config build/webpack.dev.con.js
//在script脚本执行webpack，原理类似npx，会去node_modules寻找对应魔魁啊
```

**出口入口配置**
```js

 entry:{
        main:'./index.js'
    },
    output:{
        filename:'bundle.js',//打包名
        path:path.resolve(__dirname,'./dist')//打包路径，要绝对路径
        publicPath:''//如果打包文件放在cdn，此处配置cdn地址
    }
```
**目录结构优化**
- 源代码放到src目录下
- 打包配置文件放到build目录
- 配置打包脚本

**补充**

mode配置
- development 打包不被压缩
- production 打包压缩


## loader

**图片等文件打包url-loader**

```js
{
  test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
  loader: 'url-loader',
  options: {
  limit: 3000,//3000字节以内base64格式打包在js中，超过单独生成文件
  outputPath:'img/',//打包文件路径  dist/img/。。。。
  name: '[name]_[hash].[ext]'//打包文件名
  }

```

**css文件打包**
```js
//
{
  test: /\.(css|scss)$/,
   use: [
            "style-loader",
            {
            loader:"css-loader",
            options:{
                importLoaders:2//作用：sass文件里面引入的sass，也能走postcss-loader和sass-loader
                module:true//css模块化
            }
            },
            'sass-loader',
            'postcss-loader'
        ]
}
//自动添加厂商前缀 
安装 postcss-loader autoprefixer 
//postcss.config.js
module.exports = {
    "plugins": {
      "autoprefixer": {}
    }
  }
//css模块化方式
import style from 'index.css';

```

## Plugins

**htmlwebpackPlugin**
```js
//在打包结束后自动生成html文件，并把打包生成的js自动引入到html文件中
new htmlwebpackPlugin({
        filename: 'index.html',
        template:'index.html'//基于一个模版生成html
        
    })

```
**cleanWebpackPlugin**

```js
//打包之前先清空目录
new cleanWebpackPlugin(['dist'])

  ```
## souceMMap配置
```js
//一个映射关系，把打包文件映射到源代码中的位置

cheap：只映射到行，不映射到列
module：业务代码和三方模块都映射
eval：打包速度最快

//开发环境
devtool：'cheap-module-eval-source-map'
//生产环境
devtool：'cheap-module-source-map'
```


## webpackDevServer

```js
//开启本地服务器，方便发起请求，文件改变自动打包，刷新浏览器
//开发环境脚本，不会生成dist文件夹，打包内容放在电脑内存，提升打包速度
"scripts": {
    "dev": "webpack-dev-server --config build/webpack.dev.config.js"
  },

  //devServer配置
  devServer:{
    contentBase:'../dist',
    open:true//自动打开浏览器
    proxy:{//代理配置，解决跨域
      '/api':'http://localhost:3000'
    }
  },

```

## 热模块替换HMR（hotModuleReplacement ）
更新代码，实现自动打包不刷新页面，
```js
//devServer配置
devServer:{
    contentBase:'../dist',
    open:true,
    hot:true,//开启热模块更新
    hotOnly:true,//即使hmr不生效，也不刷新页面
  },

  //plugin配置
new webpack.HotModuleReplacementPlugin()

```

## babel编译ES6
把ES6编译成ES5
```js
//安装
cnpm install babel-loader @babel/core 
cnpm install @babel/preset-env -D 
//配置loader
{
    test:/\.js$/,
    loader:'babel-loader',
    exclude:/node_modules/,
    options:{
      presets:['@babel/preset-env']
    }
  }
//补充缺失函数，变量
cnpm install @babel/polyfill -D
//按需打包补充文件
options:{
    presets:[['@babel/preset-env',{
      useBuiltIns:"usage"
    }]]
  }
```

## treeShaking

剔除模块内不用的东西不打包，只支持EsModule模块引入方式，静态引入方式

```js
//production环境，mode=production，不需要配置
//开发环境配置，mode=development
optimization:{
    useExports:true
  }
//package.json配置
//ESModule如果没有导出任何内容，会被忽略掉，要配置trashaking白名单
sideEffects:["*.css"]
```
## development和produciton区分打包

**区别**
- sorceMap配置
- develoment模式不压缩代码，production压缩代码
- trashanking，dev模式需要配置optimazition

拆分开发环境和生产环境配置，抽离公共配置，通过webpack-merge进行合并

## 代码分包 codeSpliting

**手动代码分割**
```js
//把三方库文件单独配置一个入口打包
entry:{
        main:'./index.js',
        lodash:'./lodash.js'
    },

//lodash.js
import _ from 'lodash';
window._ = _;
```
**配置插件**
```js
optimization:{
   splitChunks: {
      chunks: 'all',//同步异步都分割
      minSize: 20000,//超过这个值才打包
      minChunks: 1,//生成的chunk中引用模块的次数大于1次
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {//node_modules模块打包
          test: /[\\/]node_modules[\\/]/,
          priority: -10,//优先级高
          fileName:'vendor.js'
        },
        default:{//默认打包配置（不属于node_modules内的模块）
          priority: -20,//优先级低
          reuseExistingChunk: true,//检查，不重复打包
          filename:'common.js'
        }
      }
    }
  }
  }

//异步模块自动会进行代码分割，无需做任何配置
import('lodash').then(()=>{

})
```
## 懒加载
通过异步引入组件，三方库的方式
```js
//安装dynamic-import插件
import('lodash').then(()=>{

})
```
## chunk
webpack打包生成的每一个bundle，就是一个chunk

## css文件代码分割

**filename和chunkFilename**
```js
//入口文件js走的是filename，
//被入口文件引用的其他chunk，走chunkFilename
output: {
    filename: "[name].js",
    chunkFilename:"[name].chunk.js",
  },
```

**打包css**

css文件会被打包进js文件，通过MiniCssExtractPlugin插件将css单独打包
```js
//开发环境配置，
//注意
//1、base.config中对css的loader应当移到dev.config
//2、trashaling配置开发和生产环境都需要，注意把css文件设置白名单

//webpack.pro.config.js
 module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]


  //package.json,不对css文件进行trashaking
   "sideEffects": ["*.css"]
```

**压缩css文件**

借助optimize-css-assets-webpack-plugin插件
```js
//webpack.pro.config.js
optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
```


## 多页面打包配置
```js
//入口文件
 entry: {
    main: "./src/index.js",
    sub:'./src/sub.js'
  }

//新增html 
//runtime是必须的，vendor是三方库打包文件，
new htmlwebpackPlugin({
        template:'index.html',
        filename:'index.html',
        chunks:['runtime','vendor','main']
    }),
    new htmlwebpackPlugin({
      template:'sub.html',
      filename:'sub.html',
      chunks:['runtime','vendor','sub']
  }),



```

## webpack性能优化

**指定loader使用范围**

通过inclue和exclude减少loader编译的文件
```js
{
  test:/\.js$/,
  loader:'babel-loader',
  include:path.resolve(__dirname,'../src')
}
```
**减少不必要的插件**
- css代码开发环境没必要压缩，节省打包时间
- 保证插件可靠性

**合理配置resolve**

**控制包文件大小**

**DLLPlugin**

把三方库文件第一次打包的时候生成一个文件，再次打包不要去node_modules分析代码，加快打包速度

- 配置一个打包三方模块配置文件，通过全局变量暴露出去，生成一个json映射文件
```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode:'production',
    entry:{
        vendors:['lodash']
    },
    output:{
        filename:'[name].dll.js',
        path:path.resolve(__dirname,'../dll'),//打包输出位置
        library:'[name]'
        // vendor.dll.js中暴露出的全局变量名。
        // 主要是给DllPlugin中的name使用，
        // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    plugins:[
        new webpack.DllPlugin({
            name:'[name]',
            path:path.resolve(__dirname,'../dll/[name].manifest.json')
        })
    ]
}
```
- 通过插件把文件添加到html中
```js

new AddAssetHtmlWewbpackPlugin({
    filepath:path.resolve(__dirname,'../dll/vendors.dll.js')
  }),

```
- 打包时应用dllRreference插件，分析映射文件，直接去全局变量获取
```js
new webpack.DllReferencePlugin({
    manifest:path.resolve(__dirname,'../dll/vendors.manifest.json')
  })

```



