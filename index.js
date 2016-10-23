'use strict';

const execall = require('execall');
const splitLines = require('split-lines');
const reindent = require('./lib/reindent');
const getFileExt = require('./lib/get-file-ext');

const sourceToLineMap = new Map();

module.exports = function (options) {
  options = options || {};
  options.startTag = options.startTag || '[^`\'"]<style[\\s\\S]*?>';
  options.endTag = options.endTag || '</\\s*?style>';
  options.body = options.body || '[\\s\\S]*?';
  options.filterExtensions = options.filterExtensions || [
    '.erb',
    '.handelbars',
    '.hbs',
    '.htm',
    '.html',
    '.mustache',
    '.nunjucks',
    '.php',
    '.tag',
    '.twig',
    '.vue',
    '.we',
    '.xhtml',
    '.xml',
  ];

  const snippetRegexp = new RegExp(`(${options.startTag})(${options.body})\\s*${options.endTag}`, 'g');

  /**
  * Checks whether the given extension is allowed by extension filter
  */
  function isExtensionProcessable(filepath) {
    const fileExt = getFileExt(filepath);
    return options.filterExtensions.findIndex((ext) => ext === fileExt) !== -1;
  }

  function transformCode(sourceCode, filepath) {
    if (!isExtensionProcessable(filepath)) {
      return sourceCode;
    }

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
    if (!isExtensionProcessable(filepath)) {
      return;
    }

    const extractedToSourceLineMap = sourceToLineMap.get(filepath);
    const newWarnings = result.warnings.reduce((memo, warning) => {
      const warningSourceMap = extractedToSourceLineMap.get(warning.line);
      if (warning.line) {
        warning.line = warningSourceMap.line;
      }
      if (warning.column) {
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
