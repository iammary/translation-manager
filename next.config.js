const resolveTsconfigPathsToAlias = require('./resolve-tsconfig-path-to-webpack-alias')
const { DefinePlugin } = require('webpack')
const Dotenv = require('dotenv-webpack')
const path = require('path')

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins = config.plugins || []

    config.resolve.alias = {
      ...config.resolve.alias,
      ...resolveTsconfigPathsToAlias(),
    }

    config.plugins = [
      ...config.plugins,
      new DefinePlugin({
        __DEV__: dev,
        __CONTENT_TILE__: JSON.stringify(process.env.CONTENT_TILE),
      }),

      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),]

    config.module.rules.push(
      {
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        options: { mode: ['react-component'] }
      }
    )

    config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin')

    return config;
  }
}
