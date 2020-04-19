const path = require('path');
const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlPlugin = require('html-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
   const config = {
      mode: env,
      entry: './src',
      output: {
         path: path.resolve(__dirname, 'dist'),
         filename: '[contenthash].js',
         chunkFilename: '[name]-[contenthash].js'
      },
      resolve: {
         extensions: ['.js', '.ts']
      },
      module: {
         rules: [
            {
               test: /\.ts$/,
               use: 'ts-loader'
            },
            {
               test: /\.css$/,
               use: [CssExtractPlugin.loader, 'css-loader']
            },
            {
               test: /\.woff2?$/,
               loader: 'file-loader',
               options: {
                  name: 'fonts/[name]-[contenthash].[ext]'
               }
            }
         ]
      },
      plugins: [
         new CleanPlugin(),
         new HtmlPlugin({
            template: './index.html'
         }),
         new CssExtractPlugin({
            filename: '[contenthash].css'
         })
      ],
      optimization: {
         minimizer: [
            new TerserPlugin(),
            new OptimizeCssPlugin()
         ]
      },
      devtool: 'source-map'
   };

   if (env === 'production') {
      config.plugins.push(
         new CompressionPlugin({
            exclude: /\.map$/,
            minRatio: 1
         }),
         new CompressionPlugin({
            exclude: /\.map$/,
            minRatio: 1,
            algorithm: 'brotliCompress',
            filename: '[path].br[query]'
         })
      );
   }
   return config;
};
