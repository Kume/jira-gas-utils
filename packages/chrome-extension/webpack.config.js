const path = require('path');
const CopyFilePlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  return {
    entry: {
      index: './src/index.ts',
      load: './src/load.ts',
      background: './src/background.ts',
      content: './src/content.ts',
      popup: './src/popup.tsx',
    },

    target: 'node',

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'out'),
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },

    resolve: {
      extensions: ['.web.js', '.js', '.web.ts', '.ts', '.tsx', '.web.tsx', '.css'],
    },

    plugins: [
      new CopyFilePlugin({
        patterns: [
          {
            context: path.resolve(__dirname, 'assets'),
            from: path.resolve(__dirname, 'assets/**/*'),
            to: path.resolve(__dirname, 'out'),
          },
        ],
      }),
    ],
  };
};
