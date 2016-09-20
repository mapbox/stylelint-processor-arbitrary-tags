'use strict';

const execall = require('execall');
const splitLines = require('split-lines');
const reindent = require('./lib/reindent');

const sourceToLineMap = new Map();

module.exports = function (options) {
  options = options || {};
  options.startTag = options.startTag || '\\<style[\\s\\S]*?>';
  options.endTag = options.endTag || '</\\s*?style>';
  options.body = options.body || '[\\s\\S]*?';

  const snippetRegexp = new RegExp(`(${options.startTag})(${options.body})${options.endTag}`, 'g');

  function transformCode(code, filepath) {
    const extractedToSourceLineMap = new Map();
    let extractedCode = '';
    let currentExtractedCodeLine = 0;

    execall(snippetRegexp, code).forEach((match) => {
      const openingTag = match.sub[0];
      const reindentData = reindent(match.sub[1]);
      const bodyText = reindentData.text;
      if (!bodyText) return;

      const startLine = splitLines(code.slice(0, match.index + openingTag.length)).length;
      const linesWithin = splitLines(bodyText).length;

      for (let i = 0; i < linesWithin; i++) {
        currentExtractedCodeLine += 1;
        extractedToSourceLineMap.set(currentExtractedCodeLine, {
          line: startLine + i,
          indentColumns: reindentData.indentColumns,
        });
      }

      extractedCode += bodyText + '\n\n';
      currentExtractedCodeLine += 1;
    });

    sourceToLineMap.set(filepath, extractedToSourceLineMap);
    return extractedCode;
  }

  function transformResult(result, filepath) {
    const extractedToSourceLineMap = sourceToLineMap.get(filepath);
    result.warnings.forEach((warning) => {
      if (!warning.line) return;
      const warningSourceMap = extractedToSourceLineMap.get(warning.line);
      warning.line = warningSourceMap.line;
      warning.column = warning.column + warningSourceMap.indentColumns;
    });
  }

  return {
    code: transformCode,
    result: transformResult,
  };
};
