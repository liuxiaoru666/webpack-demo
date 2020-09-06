const path = require("path");
const htmlwebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWewbpackPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  entry: {
    main: "./src/index.js",
    sub:'./src/sub.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 3000,
          outputPath: "img/",
          name: "[name].[hash].[ext]",
        },
      },
      {
        test:/\.js$/,
        loader:'babel-loader',
        include:path.resolve(__dirname,'../src')
      }
    ],
  },
  output: {
    filename: "[name].js",
    chunkFilename:"[name].chunk.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath:''//cdn地址
  },
  plugins:[
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
  new AddAssetHtmlWewbpackPlugin({
    filepath:path.resolve(__dirname,'../dll/vendors.dll.js')
  }),
  new webpack.DllReferencePlugin({
    manifest:path.resolve(__dirname,'../dll/vendors.manifest.json')
  })
  ],
  optimization:{
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      name:true,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename:'vendor.js'
        },
        default:{
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
  
};
