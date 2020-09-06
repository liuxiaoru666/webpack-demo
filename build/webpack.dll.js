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