'use strict';

const test = require('tap').test;
const stylelint = require('stylelint');
const _ = require('lodash');
const path = require('path');

const pathToProcessor = path.join(__dirname, '../index.js');

const config = {
  processors: [pathToProcessor],
  rules: {
    'block-no-empty': true,
    indentation: 2,
    'max-empty-lines': 1,
  },
};

const markdownExpectedWarnings = [
  {
    line: 11,
    column: 6,
    rule: 'block-no-empty',
    severity: 'error',
    text: 'Unexpected empty block (block-no-empty)',
  },
  {
    line: 17,
    column: 5,
    rule: 'indentation',
    severity: 'error',
    text: 'Expected indentation of 0 spaces (indentation)',
  },
  {
    line: 18,
    column: 8,
    rule: 'block-no-empty',
    severity: 'error',
    text: 'Unexpected empty block (block-no-empty)',
  },
];

test('markdown', (t) => {
  const fixture = path.join(__dirname, './fixtures/markdown.md');
  stylelint.lint({
    files: fixture,
    config,
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results');
    const result = data.results[0];
    t.equal(result.source, fixture, 'filename');
    t.deepEqual(_.orderBy(result.warnings, ['line', 'column']), markdownExpectedWarnings);
    t.end();
  }).catch(t.threw);
});

const htmlExpectedWarnings = [
  {
    line: 4,
    column: 6,
    rule: 'block-no-empty',
    severity: 'error',
    text: 'Unexpected empty block (block-no-empty)',
  },
  {
    line: 8,
    column: 7,
    rule: 'indentation',
    severity: 'error',
    text: 'Expected indentation of 0 spaces (indentation)',
  },
  {
    line: 8,
    column: 12,
    rule: 'block-no-empty',
    severity: 'error',
    text: 'Unexpected empty block (block-no-empty)',
  },
  {
    line: 15,
    column: 5,
    rule: 'indentation',
    severity: 'error',
    text: 'Expected indentation of 0 spaces (indentation)',
  },
  {
    line: 15,
    column: 10,
    rule: 'block-no-empty',
    severity: 'error',
    text: 'Unexpected empty block (block-no-empty)',
  },
];

test('html', (t) => {
  const fixture = path.join(__dirname, './fixtures/html.html');
  stylelint.lint({
    files: [fixture],
    config,
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results');
    const result = data.results[0];
    t.equal(result.source, fixture, 'filename');

    t.deepEqual(_.orderBy(result.warnings, ['line', 'column']), htmlExpectedWarnings);
    t.end();
  }).catch(t.threw);
});

test('markdown and html', (t) => {
  const fixtureOne = path.join(__dirname, './fixtures/markdown.md');
  const fixtureTwo = path.join(__dirname, './fixtures/html.html');
  stylelint.lint({
    files: [fixtureOne, fixtureTwo],
    config,
  }).then((data) => {
    t.equal(data.results.length, 2, 'number of results');

    t.equal(data.results[0].source, fixtureOne);
    t.deepEqual(_.orderBy(data.results[0].warnings, ['line', 'column']), markdownExpectedWarnings);

    t.equal(data.results[1].source, fixtureTwo);
    t.deepEqual(_.orderBy(data.results[1].warnings, ['line', 'column']), htmlExpectedWarnings);

    t.end();
  }).catch(t.threw);
});

test('actual css', (t) => {
  const fixture = path.join(__dirname, './fixtures/css.css');
  stylelint.lint({
    files: [fixture],
    config,
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results');
    t.equal(data.results[0].warnings.length, 0, 'no warnings');
    t.end();
  }).catch(t.threw);
});

const liquidExpectedWarnings = [
  {
    line: 10,
    column: 6,
    rule: 'block-no-empty',
    severity: 'error',
    text: 'Unexpected empty block (block-no-empty)',
  },
  {
    line: 17,
    column: 10,
    rule: 'block-no-empty',
    severity: 'error',
    text: 'Unexpected empty block (block-no-empty)',
  },
];

test('liquid, custom tags', (t) => {
  const fixture = path.join(__dirname, './fixtures/liquid.md');

  const options = {
    startTag: '\\{%\\s*highlight css\\s*%\\}',
    endTag: '\\{%\\s*endhighlight\\s*%\\}',
  };

  stylelint.lint({
    files: [fixture],
    config: {
      processors: [[pathToProcessor, options]],
      rules: {
        'block-no-empty': true,
        indentation: 2,
      },
    },
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results');
    const result = data.results[0];
    t.equal(result.source, fixture, 'filename');
    t.deepEqual(_.orderBy(result.warnings, ['line', 'column']), liquidExpectedWarnings);
    t.end();
  }).catch(t.threw);
});

test('vue', (t) => {
  const fixture = path.join(__dirname, './fixtures/vue.vue');
  stylelint.lint({
    files: [fixture],
    config: {
      processors: [pathToProcessor],
      rules: {
        'selector-no-type': true,
        indentation: 2,
      },
    },
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results');
    const result = data.results[0];
    t.equal(result.source, fixture, 'filename');
    result.warnings.forEach((warning) => {
      t.equal(warning.rule, 'selector-no-type');
    });
    t.end();
  }).catch(t.threw);
});
