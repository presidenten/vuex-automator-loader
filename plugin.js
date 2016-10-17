var fs = require('fs');

function apply(options, compiler) {
  // now you have access to the compiler instance
  // and options
}

module.exports = function(filepath) {
  fs.closeSync(fs.openSync(filepath, 'w'));
  return {
    apply: apply.bind(this, filepath),
  };
};

