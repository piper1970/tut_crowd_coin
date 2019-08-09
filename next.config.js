const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

module.exports = {
    webpack: (config, { isServer }) => {

      // Makes sure 'dotenv' can work properly
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty'
        }
      }
  
      return config
    }
  }