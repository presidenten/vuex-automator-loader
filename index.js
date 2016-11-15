const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');
const camelCase = require('camelCase');

/**
 * Export the loader function
 */
module.exports = function(source, map) {
  const config = loaderUtils.parseQuery(this.query);
  const relativePath = '.' + this.resourcePath.slice(config.srcRoot.length).replace(/\\/g, '/');
  const moduleName = camelCase(relativePath.slice(relativePath.lastIndexOf('/') + 1).slice(0, -3));
  const file = fs.readFileSync(config.collector).toString();

  if(file.indexOf(moduleName) < 0) {
    const importStatement = 'import _' + moduleName + ' from \'' + relativePath + '\'; // eslint-disable-line\n';
    const exportStatement = 'export const ' + moduleName + ' = _' + moduleName + ';  // eslint-disable-line\n\n'

    fs.appendFileSync(config.collector, importStatement + exportStatement);
  }

  return source;
};

/**
 * Export the plugin function
 */
module.exports.plugin = require('./plugin.js');
