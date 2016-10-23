# stylelint-processor-arbitrary-tags

[![Build Status](https://travis-ci.org/mapbox/stylelint-processor-arbitrary-tags.svg?branch=master)](https://travis-ci.org/mapbox/stylelint-processor-arbitrary-tags)

A [stylelint processor](http://stylelint.io/user-guide/configuration/#processors) that allows you to lint CSS within arbitrary tags.

The module uses a regular expression to identify code within the specified tags, then passes the code on to stylelint.

By default, it looks for code within `<style>` tags (see default options below). But you can change the regular expression to find code within other tags, like `{% highlight css %}...{% endhighlight %}` for Jekyll templates, or `/* start css */.../* end css */` within a JS file, or who knows what else.

## Install

```
npm install @mapbox/stylelint-processor-arbitrary-tags
```

## Options

### startTag

Type: `string` that's RegExp-ready

Default:
```
'[^`\'"]<style[\\s\\S]*?>'
```

### endTag

Type: `string` that's RegExp-ready

Default:
```
'</\\s*?style>'
```

### body

Type: `string` that's RegExp-ready

Default:
```
'[\\s\\S]*?'
```

### filterExtensions

Type: `array<string>` that's the file extension list that are allowed to be
processed. This enable you to create different settings for HTML and markdown,
for instance.


Default:
```js
[
  '.erb',
  '.handlebars',
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
]
```

## Caveats

**Do not use this processor with the `no-empty-source` rule**. If you do, you will have warnings whenever a file does not contain any matches for your regular expression.
