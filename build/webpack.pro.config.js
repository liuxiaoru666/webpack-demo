const baseConfig = require("./webpack.base.config");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const proConfig = {
  mode: "production", //打包被压缩
  devtool: "cheap-module-source-map",

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename:"[name].css",
      chunkFilename:"[name].chunk.css"
    }),
    // new cleanWebpackPlugin(['dist'])
  ],
};

module.exports = merge(baseConfig, proConfig);
