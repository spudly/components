const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = ({config}) => ({
  ...config,
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['javascript', 'typescript'],
    }),
    ...config.plugins,
  ],
  module: {
    ...config.module,
    rules: [
      ...config.module.rules.map(rule => ({
        ...rule,
        include:
          rule.use && rule.use[0].loader === 'babel-loader' ? [] : rule.include,
      })),
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
          },
        ],
      },
    ],
  },
  resolve: {
    ...config.resolve,
    extensions: ['.ts', '.tsx', ...config.resolve.extensions],
    mainFields: ['mainSrc', 'module', 'main'],
  },
});
