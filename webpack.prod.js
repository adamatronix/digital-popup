const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
   mode: 'production',
   devtool: 'source-map',
   plugins: [
    new HtmlWebpackPlugin({
      title: 'Digital Popup',
      template: './src/index.html'
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
   optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});