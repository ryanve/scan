(function(root, document) {
  var aok = root['aok']
    , scan = root['scan']
    , docElem = document.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , hasByClass = byClass in document
    , hasQsa = 'querySelectorAll' in document
    , divs = docElem[byTag]('div')
    , html = scan('html')
    , body = scan('body');

  3 > divs.length && aok.error('Tests require 3+ divs.');
  
  // Use alert if console is unavail.
  aok.prototype.express.force = true;

  function isElement() {
    return 1 === this.nodeType;
  }
  
  function every(ob, fn, scope) {
    var l = ob.length, i = 0;
    while (i < l) if (!fn.call(scope, ob[i], i++, ob)) return false;
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

  aok({id:'selectTag', test:function() {
    return scan.qsa('div').length === document[byTag]('div').length;
  }});
  
  hasByClass && aok({id:'selectClass', test:function() {
    return scan.qsa('.div').length === document[byClass]('div').length;
  }});
  
  aok({id:'contains', test:function() {
    return every([
      [true, null, 'str', 's'],
      [true, null, 'str', 'tr'],
      [false, null, 'str', 'a'],
      [true, null, [0, 1], 1],
      [false, null, [0, 1], 2],
      [false, null, {}, 1],
      [true, null, docElem, docElem[byTag]('*')[0]],
      [false, null, docElem[byTag]('*')[0], docElem],
      [false, null, docElem, docElem]
    ], complies, scan.contains);
  }});
  
  aok({id:'fnFindSelect', test:function() {
    var find = scan.fn.find;
    return scan('*').length > find.call(body, '*').length && every([
      [1, html, 'body'],
      [0, body, 'html'],
      // QSA effectively queries top-down and then filters by those contained
      [+hasQsa, html, 'html body']
    ], tallies, find);
  }});
  
  aok({id:'fnFindObject', test:function() {
    var find = scan.fn.find, main = scan('main');
    return find.call(main, divs).length <= divs.length && every([
      [1, html, body[0]],
      [0, body, html[0]],
      [1, html, body],
      [0, body, html],
      [2, html, [body[0], body[0]]]
    ], tallies, find);
  }});
  
  aok({id:'fnFilter', test:function() {
    return every([
      [0, divs],
      [0, divs, ''],
      [0, divs, []],
      [1, divs, divs[0]],
      [1, divs, [divs[0], divs[0]]],
      [2, divs, [divs[0], divs[1]]],
      [divs.length, divs, isElement],
      [divs.length, divs, 'div'],
    ], tallies, scan.fn.filter);
  }});
  
  aok({id:'fnNot', test:function() {
    return every([
      [divs.length, divs],
      [divs.length, divs, ''],
      [divs.length, divs, []],
      [divs.length-1, divs, divs[0]],
      [divs.length-1, divs, [divs[0], divs[0]]],
      [divs.length-2, divs, [divs[0], divs[1]]],
      [0, divs, isElement],
      [0, divs, 'div'],
    ], tallies, scan.fn.not);
  }});
}(this, document));