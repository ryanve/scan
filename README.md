# scan
#### standalone <a href="#browser-support"><code>querySelectorAll</code></a> selector engine with [jQuery](http://jquery.com)-like interface

```sh
$ npm install scan --save
```

### Basic usage

```js
var scan = require('scan')
scan('.example').find('a').not('[href^="#"]')
```

## API ([0.9](../../releases))

<ul>
<li> <code>scan()</code> instances are array-like and inherit from <code>scan.prototype</code> and <code>Array.prototype</code>
<li> <code>scan()</code> methods chain intuitively or are callable via <code>scan.prototype[method]<wbr>.call(array)</code>
<li> Methods are generally compatible with jQuery methods of the same name
</ul>

### scan(query, context?)
- `scan(selector)` &rarr; elements that match <var>selector</var>
- `scan(selector, node|nodes)` &rarr; elements that match <var>selector</var> from <var>node</var> or any <var>nodes</var>
- `scan(node|nodes)` &rarr; nodes wrapped in `scan` instance

<a name="scan.prototype.find"></a>
### .find(needle)
- `scan(query).find(selector)` &rarr; descendants that match <var>selector</var>
- `scan(query).find(element|elements)` &rarr; elements that descend from <var>query</var>
- `scan(stack).find(fn, scope?)` &rarr; the first value to pass `fn.call(scope, value, i, stack)`

<a name="scan.prototype.filter"></a>
### .filter(needle)
- `scan(query).filter(nodes, selector)` &rarr; stack filtered by <var>selector</var>
- `scan(query).filter(fn)` &rarr; stack filtered by `fn.call(element, i)`
- `scan(query).filter(element|elements)` &rarr; stack filtered by one or more elements
- `scan(array).filter(values)` &rarr; the intersection of 2 arrays

<a name="scan.prototype.not"></a>
### .not(needle)
- `scan(query).filter(selector)` &rarr; `nodes` filtered *against* `selector`
- `scan(query).not(fn)` &rarr; stack filtered *against* `fn.call(element, i)`
- `scan(query).not(element|elements)`&rarr; stack filtered *against* one or more elements
- `scan(array).not(values)` &rarr; the difference of 2 arrays

<a name="scan.find"></a>
### <span>#</span>find(needle)
- `scan.find(selector, context?)` &rarr; array of elements that match <var>selector</var>
- `scan.find(stack, fn, scope?)` &rarr; the first value to pass `fn.call(scope, value, i, stack)`

<a name="scan.matches"></a>
### <span>#</span>matches(element, selector)
- `scan.matches(element, selector)` &rarr; `true` if <var>element</var> matches <var>selector</var>

<a name="scan.contains"></a>
### <span>#</span>contains(haystack, needle)
- `scan.contains(node, element)` &rarr; `true` if <var>node</var> contains <var>element</var>
- `scan.contains(stack, item, start=0)` &rarr; `true` if <var>stack</var> contains <var>item</var>
- `scan.contains(str, substr, start=0)` &rarr; `true` if <var>str</var> contains <var>substr</var>

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
$ grunt test
```

## Fund
<b>[Tip the developer](https://www.gittip.com/ryanve/)</b> =)

## License
MIT