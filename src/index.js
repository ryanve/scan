!function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
  else root[name] = make();
}(this, 'scan', function() {

  var effin = scan.prototype = Scan.prototype = []
    , push = effin.push
    , doc = document
    , docElem = doc.documentElement
    , domL4 = !!doc.contains && !!docElem.contains
    , byAll = 'querySelectorAll'
    , byTag = 'getElementsByTagName'
    , query = doc[byAll] ? byAll : byTag
    , matcher = docElem.matches || detect(['webkit', 'moz', 'o', 'ms'], function(prefix) {
        return docElem[prefix + 'MatchesSelector'];
      })

      /**
       * @param {Element} e
       * @param {string} selector
       * @return {boolean} true if element matches selector
       */
    , matches = typeof matcher == 'function' ? function(e, selector) {
        return !!selector && !!matcher.call(e, selector);
      } : function(e, selector) {
        return include(qsa(selector, e.ownerDocument), e);
      };
      
  /**
   * @param {(string|Node|{length:number}|*)=} item
   * @param {(string|Node|{length:number})=} root
   * @return {Scan}
   */
  function scan(item, root) {
    return new Scan(item, root);
  }
  
  /**
   * @constructor
   * @this {Scan} instance
   * @param {?(string|Node|{length:number})=} item
   * @param {?(string|Node|{length:number})=} root
   */
  function Scan(item, root) {
    this.length = 0;
    this.constructor = Scan;
    if (item) push.apply(this, typeof item == 'string' ? qsa(item, root) : collect(item));
  }

  /**
   * @param {string=} selector
   * @param {(string|Node|{length:number})=} root
   * @return {Array}
   */
  function qsa(selector, root) {
    if (!selector) return [];
    root = null == root ? doc : typeof root == 'string' ? qsa(root) : root;
    return typeof root != 'object' ? [] : root.nodeType ? (
      root[query] ? ary(root[query](selector)) : []
    ) : amass(selector, root); // root was collection
  }

  /**
   * @param {{length:number}} list
   * @return {Array}
   */
  function ary(list) {
    for (var pure = [], l = list.length, i = 0; i < l;) pure[i] = list[i++];
    return pure;
  }
  
  /**
   * @param {{length:number}|Node|Window} o
   * @return {Array}
   */
  function collect(o) {
    return o.nodeType || o.window == o ? [o] : ary(o);
  }

  /**
   * @param {string} selector
   * @param {{length:number}} roots nodes from which to base queries
   * @return {Array} unique matches that descend from any `roots` item
   */
  function amass(selector, roots) {
    for (var u, j, group, els = [], e = 0, l = roots.length, i = 0; i < l;) {
      group = qsa(selector, roots[i++]);
      label:for (u = 0; group[u]; u++) {
        for (j = e; j--;) if (els[j] === group[u]) continue label;
        els[e++] = group[u];
      }
    }
    return els;
  }

  /**
   * @param {{length:number}} stack
   * @param {*} needle
   * @param {number=} start
   * @return {boolean}
   */
  function include(stack, needle, start) {
    var l = stack.length, i = start >> 0;
    for (0 > i && (i += l); i < l; i++) if (stack[i] === needle && i in stack) return true;
    return false;
  }

  /**
   * @param {Node|*} a element or document to search in
   * @param {Node|*} b element to search for
   * @return {boolean} true if A contains B
   */
  function wraps(a, b) {
    // Use parent b/c Node.contains is inclusive
    if (domL4 && a.contains) return (b = b.parentNode) === a || a.contains(b);
    while (b = b.parentNode) if (b === a) break;
    return !!b;
  }

  /**
   * combines jQuery.contains, _.contains, string.contains
   * @param {Node|{length:number}|string} ob
   * @param {*} needle
   * @param {?number=} start
   * @return {boolean}
   */
  function contains(ob, needle, start) {
    if (typeof ob == 'string') return !!~ob.indexOf(needle, start >> 0);
    return ob.nodeType ? wraps(ob, needle) : include(ob, needle, start);
  }
  
  /**
   * @param {{length:number}} nodes
   * @param {{length:number}|Element} needles
   * @return {Array} descendant needles
   */
  function contained(nodes, needles) {
    var j, l, ret = [], i = 0, h = nodes.length;
    needles = needles.nodeType ? [needles] : needles;
    for (l = needles.length; i < l; i++) {
      for (j = 0; j < h;) {
        if (wraps(nodes[j++], needles[i])) {
          ret.push(needles[i]);
          break;
        }
      }
    }
    return ret;
  }

  /**
   * @param {string} str
   * @return {Element|boolean}
   */
  function id(str) {
    return doc.getElementById(str) || false;
  }

  /**
   * @param {{length:number}} o
   * @param {Function} fn
   * @param {*=} scope
   */
  function detect(o, fn, scope) {
    for (var v, i = 0, l = o.length; i < l;) if (fn.call(scope, v = o[i], i++, o)) return v;
  }
  
  /**
   * @param {string|Node|{length:number}|*} o
   * @param {(string|Node|{length:number}|Function|null)=} fn
   * @param {*=} scope
   */
  function find(o, fn, scope) {
    return typeof fn == 'function' ? detect(o, fn, scope) : qsa(o, fn);
  }
  
  /**
   * @param {{length:number}} before
   * @param {{length:number}} after
   * @return {{length:number}}
   */
  function chain(before, after) {
    return before.pushStack ? before.pushStack(after) : after;
  }

  /**
   * @param {{length:number}} items
   * @return {{length:number}}
   */
  effin['pushStack'] = function(items) {
    for (var o = new this.constructor, i = 0, l = items.length; i < l;) push.call(o, items[i++]);
    return o;
  };
  
  /**
   * @this {{length:number}}
   * @param {{length:number}|Element|Function|string|*} needle
   * @param {*=} scope
   * @return {*}
   */
  effin['find'] = function(needle, scope) {
    var found;
    if (typeof needle == 'string') found = amass(needle, this);
    else if (typeof needle == 'object') found = contained(this, needle);
    else return detect(this, needle, scope);
    return chain(this, found);
  };
  
  // Comply w/ api.jquery.com/filter + api.jquery.com/not
  detect(['not', 'filter'], function(key, yes) {
    effin[key] = function(q) {
      var kept = [], isF = typeof q == 'function';
      if (!q) kept = yes ? kept : ary(this);
      else detect(this, function(v, j) {
        var keep = isF ? q.call(v, j) : include(this, v);
        if (keep == yes) kept.push(v);
      }, typeof q == 'string' ? qsa(q) : q.nodeType ? [q] : q);
      return chain(this, kept);
    };
  });

  scan['scan'] = scan;
  scan['qsa'] = qsa;
  scan['id'] = id;
  scan['wraps'] = wraps;
  scan['contains'] = contains;
  scan['matches'] = matches;
  scan['find'] = find;
  scan['fn'] = effin;
  return scan;
});