const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

const ISDEV = process.env.NODE_ENV === 'development' ? true : false;

module.exports = {
  entry: {
    index: {
      import: './src/index.src.jsx',
    },
  },
  output: {
    filename: ISDEV ? '[name]/[name].js' : '[name]/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.ejs',
      filename: 'index/index.html',
      chunks: ['index'],
      title: 'Home',
      root: 'root',
    }),
    new miniCssExtractPlugin({
      filename: ISDEV ? '[name]/[name].css' : '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [miniCssExtractPlugin.loader, 
          'css-loader', 
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
    port: 3000,
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
  mode: process.env.NODE_ENV,
  devtool: ISDEV ? 'eval-source-map' : false,
  context: path.resolve(__dirname),
};
