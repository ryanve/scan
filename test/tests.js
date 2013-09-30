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
    
    function isElement() {
        return 1 === this.nodeType;
    }
    
    // Use alert if console is unavail.
    aok.prototype.express.force = true;

    aok({id:'selectTag', test:function() {
        return scan.qsa('div').length === document[byTag]('div').length;
    }});
    
    hasByClass && aok({id:'selectClass', test:function() {
        return scan.qsa('.div').length === document[byClass]('div').length;
    }});
    
    aok({id:'contains', test:function() {
        return true === scan.contains('str', 's') &&
            true === scan.contains('str', 'tr') &&
            false === scan.contains('str', 'a') &&
            true === scan.contains(docElem, docElem[byTag]('*')[0]) &&
            false === scan.contains(docElem[byTag]('*')[0], docElem) &&
            false === scan.contains(docElem, docElem) &&
            true === scan.contains([0, 1], 1) &&
            false === scan.contains([0, 1], 2) &&
            false === scan.contains({}, 1);
    }});
    
    aok({id:'fnFindSelect', test:function() {
        var find = scan.fn.find;
        if (1 !== find.call(html, 'body').length) return false; 
        if (0 !== find.call(body, 'html').length) return false;
        // QSA effectively queries top-down and then filters by those contained
        if (hasQsa != find.call(html, 'html body').length) return false;
        return scan('*').length > find.call(body, '*').length;
    }});
    
    aok({id:'fnFindObject', test:function() {
        var find = scan.fn.find, main = scan('main'), div = scan('div');
        if (1 !== find.call(html, body[0]).length) return false;
        if (0 !== find.call(body, html[0]).length) return false;
        if (1 !== find.call(html, body).length) return false;
        if (0 !== find.call(body, html).length) return false;
        if (2 !== find.call(html, [body[0], body[0]]).length) return false;
        return find.call(main, div).length <= div.length;
    }});
    
    aok({id:'fnFilter', test:function() {
        var fn = scan.fn.filter;
        if (divs.length !== fn.call(divs, 'div').length) return false;
        return divs.length === fn.call(divs, isElement).length;
    }});
    
    aok({id:'fnNot', test:function() {
        var fn = scan.fn.not;
        if (0 !== fn.call(divs, 'div').length) return false;
        return 0 === fn.call(divs, isElement).length;
    }});
}(this, document));