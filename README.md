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
