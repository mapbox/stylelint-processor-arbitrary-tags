'use strict';

const execall = require('execall');
const splitLines = require('split-lines');
const reindent = require('./lib/reindent');

const sourceToLineMap = new Map();

module.exports = function (options) {
  options = options || {};
  options.startTag = options.startTag || '[^`\'"]<style[\\s\\S]*?>';
  options.endTag = options.endTag || '</\\s*?style>';
  options.body = options.body || '[\\s\\S]*?';

  const snippetRegexp = new RegExp(`(${options.startTag})(${options.body})\\s*${options.endTag}`, 'g');

  function transformCode(sourceCode, filepath) {
    const extractedToSourceLineMap = new Map();
    let extractedCode = '';
    let currentExtractedCodeLine = 0;

    execall(snippetRegexp, sourceCode).forEach((match) => {
      const reindentData = reindent(match.sub[1]);
      const chunkCode = reindentData.text;
      if (!chunkCode) return;

      const openingTag = match.sub[0];
      const startIndex = match.index + openingTag.length;
      const startLine = splitLines(sourceCode.slice(0, startIndex)).length;
      const linesWithin = splitLines(chunkCode).length;

      for (let i = 0; i < linesWithin; i++) {
        currentExtractedCodeLine += 1;
        extractedToSourceLineMap.set(currentExtractedCodeLine, {
          line: startLine + i,
          indentColumns: reindentData.indentColumns,
        });
      }

      extractedCode += chunkCode + '\n';
    });

    sourceToLineMap.set(filepath, extractedToSourceLineMap);
    return extractedCode;
  }

  function transformResult(result, filepath) {
    const extractedToSourceLineMap = sourceToLineMap.get(filepath);
    const newWarnings = result.warnings.reduce((memo, warning) => {
      // This might end up rendering to null when there's no content on the
      // file being parsed. It's likely that it has been flagged due a
      // `no-empty-source` rule.
      const warningSourceMap = extractedToSourceLineMap.get(warning.line);

      if (warning.line && warningSourceMap) {
        warning.line = warningSourceMap.line;
      }

      if (warning.column && warningSourceMap) {
        warning.column = warning.column + warningSourceMap.indentColumns;
      }

      memo.push(warning);
      return memo;
    }, []);

    return Object.assign(result, { warnings: newWarnings });
  }

  return {
    code: transformCode,
    result: transformResult,
  };
};
