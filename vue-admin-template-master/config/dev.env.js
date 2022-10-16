'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //后端接口地址
  BASE_API: '"http://localhost:9001"',
  OSS_PATH: '"https://education-19970101.oss-cn-beijing.aliyuncs.com"'
})
