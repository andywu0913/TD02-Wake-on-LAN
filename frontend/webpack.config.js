const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'bundle.[fullhash].js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '/src'),
    ],
    alias: {
      SRC: path.resolve(__dirname, '/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  externals: {
    BackendURL: JSON.stringify(require('./config/backendAPI')[argv.mode]),
  },
  devServer: {
    port: 8889,
    historyApiFallback: true,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html',
    }),
  ],
});
