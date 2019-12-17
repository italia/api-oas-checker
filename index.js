const uniq = require('uniq');

function myfunc() {
  return uniq([1, 2, 2, 3]).join(' ');
}
exports.myfunc = myfunc;
