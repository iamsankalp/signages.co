module.exports = {
  devtool: 'eval-source-map',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015'],
          cacheDirectory: true
        }
      }
    ]
  }
};