# [scan](../../)

[<b>scan</b>](https://npmjs.org/package/scan) is a <a href="#browser-support"><code>querySelectorAll</code></a>-based selector engine designed for standalone use or integration into [jQuery](http://jquery.com/)-like libraries like [ender](https://github.com/ender-js).

## API ([0.6](../../releases))

### scan()
#### `scan(query, context?)`
- `scan(selector)` &rarr; elements that match `selector`
- `scan(selector, node|nodes)` &rarr; elements that match `selector` from `node` or any `nodes`
- `scan(node|nodes)` &rarr; array

### scan.contains()
#### `scan.contains(haystack, needle, start?)`
- `scan.contains(node, element)` &rarr; `true` if `node` contains `element`
- `scan.contains(stack, item, start?)` &rarr; `true` if `stack` contains `item`
- `scan.contains(str, substr, start?)` &rarr; `true` if `str` contains `substr`

### scan.find()
#### `scan.find(query, context?)`
#### `scan.find(stack, fn, scope?)`

### .find()
#### `.find(needle)`
- `scan.fn.find.call(nodes, selector)` &rarr; descendants that match `selector`
- `scan.fn.find.call(nodes, element|elements)` &rarr; `elements` that descend from any `nodes`
- `scan.fn.find.call(stack, fn, scope?)` &rarr; same as `scan.find(stack, fn, scope?)`

### .filter()
#### `.filter(needle)`
- `scan.fn.filter.call(nodes, selector)` &rarr; `nodes` filtered by `selector`
- `scan.fn.filter.call(nodes, fn)` &rarr; `nodes` filtered by `fn.call(node, i)`
- `scan.fn.filter.call(nodes, element|elements)` &rarr; `nodes` filtered by `element|elements`

### .not()
#### `.not(needle)`
- `scan.fn.filter.call(nodes, selector)` &rarr; `nodes` filtered *against* `selector`
- `scan.fn.filter.call(nodes, fn)` &rarr; `nodes` filtered *against* `fn.call(node, i)`
- `scan.fn.filter.call(nodes, element|elements)` &rarr; `nodes` filtered *against* `element|elements`
  
## <a name="browser-support"></a>Support

Selector queries use [`querySelectorAll` where available](http://caniuse.com/#feat=queryselector) or else degrade to [`getElementsByTagName`](https://developer.mozilla.org/en-US/docs/Web/API/element.getElementsByTagName).

- Lone tag selectors like `'p'` work in IE5.5+ and all other browsers
- The universal selector `'*'` works in IE6+ and all other browsers
- [CSS2+ selectors](http://www.w3.org/TR/CSS2/selector.html#pattern-matching) work in IE8+, FF3.5+, Opera 10+, and [all other browsers](http://caniuse.com/css-sel2)
- [CSS3+ selectors](http://www.w3.org/TR/css3-selectors/#selectors) work in IE9+, FF3.5+, Opera 10+, and [all other browsers](http://caniuse.com/css-sel3)

## Developers

<b>Contribute</b> by making edits in [`/src`](./src) or reporting [issues](../../issues).

```sh
$ npm install
$ grunt jshint:src
```

## Fund

<b>[Tip the developer](https://www.gittip.com/ryanve/)</b> =)

## License

MIT