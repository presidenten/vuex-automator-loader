const loaderUtils = require("loader-utils");
const path = require('path');
const fs = require('fs');

module.exports = {};

module.exports = function(source, map) {
  const config = loaderUtils.parseQuery(this.query);
  const relativePath = '.' + this.resourcePath.slice(config.srcRoot.length);
  const moduleName = relativePath.slice(relativePath.lastIndexOf('/') + 1).slice(0, -3);
  const file = fs.readFileSync(config.collector).toString();

  if(file.indexOf(moduleName) < 0) {
    const importStatement = 'import ' + moduleName + 'Module from \'' + relativePath + '\'; // eslint-disable-line\n';
    const exportStatement = 'export const ' + moduleName + ' = ' + moduleName + 'Module;  // eslint-disable-line\n\n'

    fs.appendFileSync(config.collector, importStatement + exportStatement);
  }
  return source;
};

module.exports.plugin = require('./plugin.js');
