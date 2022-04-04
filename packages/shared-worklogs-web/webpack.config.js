const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

module.exports = (env) => {
  return {
    entry: './src/index.tsx',

    output: {
      // filename: 'index.js',
      path: path.resolve(__dirname, 'out'),
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['.web.js', '.js', '.web.ts', '.ts', '.tsx', '.web.tsx', '.css'],
    },

    devServer: {
      port: 8081,
      contentBase: path.resolve(__dirname, 'public'),
    },

    plugins: [
      !env.production && new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'JIRAサマリ',
        template: 'template.html',
        inject: 'body',
      }),
      env.production && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]),
    ].filter(Boolean),
  };
};
