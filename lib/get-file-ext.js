'use strict';

const path = require('path');

/**
* Gets the file extension based on its full name.
* This has a different behavior than node's path.extname because it
* will get a double-extension file, such as `file.ext.html` and
* return `.ext.html`.
*
* @param {String} filepath
* @return {String}
*/
module.exports = function (filepath) {
  const match = path.basename(filepath).match(/\..+$/);
  return match ? match[0] : '';
};
