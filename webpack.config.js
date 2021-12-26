const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = (_env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: path.resolve(__dirname, './src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isDevelopment
        ? '[name].[fullhash].bundle.js'
        : '[name].[contenthash].bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [
                  isDevelopment && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
          ],
        },
        // {
        //   test: /\.s[ac]ss$/i,
        //   exclude: /node_modules/,
        //   use: [
        //     "style-loader",
        //     "css-loader",
        //     "sass-loader",
        //     "postcss-loader"
        //   ],
        // },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(jpe?g|png|gif|eot|ttf|woff|woff2)$/i,
          loader: 'file-loader',
          exclude: /node_modules/,
          options: {
            name: '[path][name].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })],
    },
    devtool: 'source-map',
    devServer: {
      hot: true,
      contentBase: path.resolve(__dirname, 'build'),
      port: env.DEV_SERVER_PORT,
      historyApiFallback: true,
      host: 'localhost',
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
      }),
      new ErrorOverlayPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin({ overlay: false }),
    ].filter(Boolean),
  };
};
