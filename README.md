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

### fileFilterRegex

Type: `array<RegExp>` that's an array of regular expressions describe files that you want to be processed with this module.
Matches will be processed; files that do not match will not be.

Given the following value, only `.html` files will be processed:

```js
fileFilterRegex: [/\.html$/]
```

This is useful when you want to create different settings for HTML and markdown, for instance.

When empty (`[]`), every file will pass through the filter and be processed by this module.

Default:

```js
[]
```

## Caveats

**Do not use this processor with the `no-empty-source` rule**. If you do, you will have warnings whenever a file does not contain any matches for your regular expression.
