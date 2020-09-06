const path = require("path");
const htmlwebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    main: "./src/index.js",
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
        exclude:/node_modules/
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
        template:'index.html'
    }),
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
