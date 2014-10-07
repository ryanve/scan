!function(root, name) {
  if (typeof document == 'undefined') { 
    return require('aok').warn('Open ./test/index.html to run tests');
  }

  var doc = root.document
    , aok = root.aok
    , scan = root[name]
    , docElem = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , hasByClass = byClass in doc
    , hasQsa = 'querySelectorAll' in doc
    , divs = doc.getElementById('test-elements')[byTag]('div')
    , html = scan('html')
    , body = scan('body');

  if (3 > divs.length) aok.error('Tests require 3+ divs.');

  function isElement() {
    return 1 === this.nodeType;
  }
  
  function every(o, fn, scope) {
    for (var l = o.length, i = 0; i < l;) if (!fn.call(scope, o[i], i++, o)) return false;
    return true;
  }
  
  /**
   * @this {Function}
   * @param {Array} arr [expectedResult, scope, *args]
   */
  function complies(arr) {
    return arr[0] === this.apply(arr[1], arr.slice(2));
  }
  
  /**
   * @this {Function}
   * @param {Array} arr [expectedLength, scope, *args]
   */
  function tallies(arr) {
    return arr[0] === this.apply(arr[1], arr.slice(2)).length;
  }
  
  aok('instance', scan() instanceof scan && scan() instanceof Array);
  aok('constructor', scan().constructor !== Array);
  aok('pushStack-instance', scan().pushStack([]) instanceof scan);
  aok('pushStack-values', scan.prototype.pushStack([0, 1]).join() === '0,1');
  aok('chaining', aok.can(function() {
    return scan().not().not();
  }));

  aok('selectTag', function() {
    return scan.qsa('div').length === doc[byTag]('div').length;
  });
  
  hasByClass && aok('selectClass', function() {
    return scan.qsa('.div').length === doc[byClass]('div').length;
  });
  
  aok('contains(str, substr)', function() {
    return every([
      [true, null, 'str', 's'],
      [true, null, 'str', 'tr'],
      [false, null, 'str', 'a']
    ], complies, scan.contains);
  });
  
  aok('contains(stack, value)', function() {
    return every([
      [true, null, [0, 1], 1],
      [false, null, [0, 1], 2],
      [false, null, {}, 1]
    ], complies, scan.contains);
  });
  
  aok('contains(container, node)', function() {
    return every([
      [false, null, doc, doc],
      [false, null, docElem, docElem],
      [true, null, docElem, docElem[byTag]('*')[0]],
      [false, null, docElem[byTag]('*')[0], docElem],
      [false, null, divs[0], divs[0].nextSibling],
      [true, null, doc, doc.body],
      [true, null, doc, docElem]
    ], complies, scan.contains);
  });
  
  aok('fnFindSelect', function() {
    var find = scan.fn.find;
    return scan('*').length > find.call(body, '*').length && every([
      [1, html, 'body'],
      [0, body, 'html'],
      // QSA effectively queries top-down and then filters by those contained
      [+hasQsa, html, 'html body']
    ], tallies, find);
  });
  
  aok('fnFindObject', function() {
    var find = scan.fn.find, parent = scan.id('test-elements');
    return find.call(parent, divs).length <= divs.length && every([
      [1, html, body[0]],
      [0, body, html[0]],
      [1, html, body],
      [0, body, html],
      [2, html, [body[0], body[0]]]
    ], tallies, find);
  });
  
  aok('fnFilter', function() {
    return every([
      [0, divs],
      [0, divs, ''],
      [0, divs, []],
      [1, divs, divs[0]],
      [1, divs, [divs[0], divs[0]]],
      [2, divs, [divs[0], divs[1]]],
      [divs.length, divs, isElement],
      [divs.length, divs, 'div']
    ], tallies, scan.fn.filter);
  });
  
  aok('fnNot', function() {
    return every([
      [divs.length, divs],
      [divs.length, divs, ''],
      [divs.length, divs, []],
      [divs.length-1, divs, divs[0]],
      [divs.length-1, divs, [divs[0], divs[0]]],
      [divs.length-2, divs, [divs[0], divs[1]]],
      [0, divs, isElement],
      [0, divs, 'div']
    ], tallies, scan.fn.not);
  });
  
  aok('matches', scan.matches(divs[0], 'div') === true);
}(this, 'scan');