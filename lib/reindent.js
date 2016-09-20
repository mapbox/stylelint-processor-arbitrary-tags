// From https://github.com/sindresorhus/strip-indent,
// but providing in the result a note about the length of indentation
// that was stripped
'use strict';

module.exports = function (str) {
  const match = str.match(/^[ \t]*(?=\S)/gm);

  if (!match) {
    return {
      text: str,
      indentColumns: 0,
    };
  }

  const indent = Math.min.apply(Math, match.map((x) => x.length));
  const re = new RegExp(`^[ \\t]{${indent}}`, 'gm');

  return {
    text: indent > 0 ? str.replace(re, '') : str,
    indentColumns: indent,
  };
};
