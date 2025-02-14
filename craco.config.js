module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /node_modules\/@formatjs\/fast-memoize/,
        use: [
          {
            loader: 'source-map-loader',
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                return false;
              },
            },
          },
        ],
      });
      return webpackConfig;
    },
  },
}; 