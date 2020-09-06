const cleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const baseConfig = require("./webpack.base.config");
const { merge } = require("webpack-merge");

const devConfig = {
  mode: "development", //打包不被压缩
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: "../dist",
    open: true,
    hot: true, //
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new cleanWebpackPlugin(['dist'])
  ]
};

module.exports = merge(baseConfig, devConfig);
