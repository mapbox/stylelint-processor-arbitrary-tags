'use strict';

const test = require('tap').test;
const getFileExt = require('../../lib/get-file-ext');

test('must return the extension including the dot', (t) => {
  const extname = getFileExt('myfile.txt');
  t.equal(extname, '.txt');
  t.end();
});

test('must return the extension from files inside directories', (t) => {
  const extname = getFileExt('/my/new/directory/myfile.doc');
  t.equal(extname, '.doc');
  t.end();
});

test('must return the extension from files inside dotted directories', (t) => {
  const extname = getFileExt('/my/new/dire.ctory/myfile.jpg');
  t.equal(extname, '.jpg');
  t.end();
});

test('must return the filename of dotfiles', (t) => {
  const extname = getFileExt('/.gitignore');
  t.equal(extname, '.gitignore');
  t.end();
});

test('must return an empty string when the file has no extension', (t) => {
  const extname = getFileExt('/my/new/directory/myfile');
  t.equal(extname, '');
  t.end();
});

test('must return an empty string when the parameter is an empty string', (t) => {
  const extname = getFileExt('');
  t.equal(extname, '');
  t.end();
});
