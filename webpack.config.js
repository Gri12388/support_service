const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const ISDEV = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
  entry: {
    index: {
      import: './src/index.src.tsx',
    },
  },
  output: {
    filename: ISDEV ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.ejs',
      filename: 'index.html',
      chunks: ['index'],
      publicPath: '/',
      title: 'Home',
      favicon: './src/assets/images/logo.svg',
      root: 'root',
    }),
    new miniCssExtractPlugin({
      filename: ISDEV ? '[name].css' : '[name].[contenthash].css',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
  }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [miniCssExtractPlugin.loader, 
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: {
                mode: 'local',
                localIdentName: ISDEV ? '[name]__[local]' : '[hash:base64]'
              }
            },
          }, 
          'resolve-url-loader', 
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          },
        ],
      },
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.m?tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: ISDEV ? 'assets/images/[base]' : 'assets/images/[hash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: ISDEV ? 'assets/fonts/[base]' : 'assets/fonts/[hash][ext]',
        },
      },
    ]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist', 'index'),
    },
    historyApiFallback: true,
    server: 'http',
    port: 3003,
    open: {
      app: {
        name: 'chrome',
      }
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      process: "process/browser"
   },
    fallback: {
      'buffer': require.resolve('buffer/'),
      'crypto': require.resolve('crypto-browserify'),
      'util': require.resolve('util/'),
      'stream': require.resolve('stream-browserify'),
      'process': require.resolve('process'),
      // 'buffer': false,
      // 'crypto': false,
      // 'util': false,
      // 'stream': false,
      // 'process': false
    }
  },
  mode: process.env.NODE_ENV,
  devtool: ISDEV ? 'eval-source-map' : false,
  context: path.resolve(__dirname),
};
