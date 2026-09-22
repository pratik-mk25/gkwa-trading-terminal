
this.Element && function(t) {
  t.matches = t.matches || t.matchesSelector || t.webkitMatchesSelector ||
      t.msMatchesSelector || function(t) {
        for (var e = (this.parentNode || this.document).querySelectorAll(
            t), a = -1; e[++a] && e[a] != this;) {
          ;
        }
        return !!e[a];
      };
}(Element.prototype), this.Element && function(t) {
  t.closest = t.closest || function(t) {
    for (var e = this; e.matches && !e.matches(t);) {
      e = e.parentNode;
    }
    return e.matches ? e : null;
  };
}(Element.prototype), this.Element && function(t) {
  t.matches = t.matches || t.matchesSelector || t.webkitMatchesSelector ||
      t.msMatchesSelector || function(t) {
        for (var e = (this.parentNode || this.document).querySelectorAll(
            t), a = -1; e[++a] && e[a] != this;) {
          ;
        }
        return !!e[a];
      };
}(Element.prototype), function() {
  for (var t = 0, e = [
    'webkit',
    'moz'], a = 0; a < e.length &&
       !window.requestAnimationFrame; ++a) {
    window.requestAnimationFrame = window[e[a] +
    'RequestAnimationFrame'], window.cancelAnimationFrame = window[e[a] +
    'CancelAnimationFrame'] || window[e[a] + 'CancelRequestAnimationFrame'];
  }
  window.requestAnimationFrame || (window.requestAnimationFrame = function(e) {
    var a = (new Date).getTime(), n = Math.max(0, 16 - (a - t)),
        o = window.setTimeout(function() {e(a + n);}, n);
    return t = a + n, o;
  }), window.cancelAnimationFrame ||
  (window.cancelAnimationFrame = function(t) {clearTimeout(t);});
}(), [
  Element.prototype,
  Document.prototype,
  DocumentFragment.prototype].forEach(function(t) {
  t.hasOwnProperty('prepend') || Object.defineProperty(t, 'prepend', {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: function() {
      var t = Array.prototype.slice.call(arguments),
          e = document.createDocumentFragment();
      t.forEach(function(t) {
        var a = t instanceof Node;
        e.appendChild(a ? t : document.createTextNode(String(t)));
      }), this.insertBefore(e, this.firstChild);
    },
  });
}), window.mUtilElementDataStore = {}, window.mUtilElementDataStoreID = 0, window.mUtilDelegatedEventHandlers = {};
var mUtil = function() {
  var t = [], e = {sm: 544, md: 768, lg: 1024, xl: 1200}, a = function() {
    var e = !1;
    window.addEventListener('resize', function() {
      clearTimeout(e), e = setTimeout(function() {
        !function() {
          for (var e = 0; e < t.length; e++) {
            t[e].call();
          }
        }();
      }, 250);
    });
  };
  return {
    init: function(t) {t && t.breakpoints && (e = t.breakpoints), a();},
    addResizeHandler: function(e) {t.push(e);},
    removeResizeHandler: function(e) {
      for (var a = 0; a < t.length; a++) {
        e === t[a] && delete t[a];
      }
    },
    runResizeHandlers: function() {_runResizeHandlers();},
    resize: function() {
      if ('function' == typeof Event) {
        window.dispatchEvent(
            new Event('resize'));
      }
      else {
        var t = window.document.createEvent('UIEvents');
        t.initUIEvent('resize', !0, !1, window, 0), window.dispatchEvent(t);
      }
    },
    getURLParam: function(t) {
      var e, a, n = window.location.search.substring(1).split('&');
      for (e = 0; e < n.length; e++) {
        if ((a = n[e].split('='))[0] ==
            t) {
          return unescape(a[1]);
        }
      }
      return null;
    },
    isMobileDevice: function() {
      return this.getViewPort().width < this.getBreakpoint('lg');
    },
    isDesktopDevice: function() {return !mUtil.isMobileDevice();},
    getViewPort: function() {
      var t = window, e = 'inner';
      return 'innerWidth' in window ||
      (e = 'client', t = document.documentElement ||
          document.body), {width: t[e + 'Width'], height: t[e + 'Height']};
    },
    isInResponsiveRange: function(t) {
      var e = this.getViewPort().width;
      return 'general' == t ||
          ('desktop' == t && e >= this.getBreakpoint('lg') + 1 ||
              ('tablet' == t && e >= this.getBreakpoint('md') + 1 && e <
                  this.getBreakpoint('lg') ||
                  ('mobile' == t && e <= this.getBreakpoint('md') ||
                      ('desktop-and-tablet' == t && e >=
                          this.getBreakpoint('md') + 1 ||
                          ('tablet-and-mobile' == t && e <=
                              this.getBreakpoint('lg') ||
                              'minimal-desktop-and-below' == t && e <=
                              this.getBreakpoint('xl'))))));
    },
    getUniqueID: function(t) {
      return t + Math.floor(Math.random() * (new Date).getTime());
    },
    getBreakpoint: function(t) {return e[t];},
    isset: function(t, e) {
      var a;
      if (-1 !== (e = e || '').indexOf('[')) {
        throw new Error(
            'Unsupported object path notation.');
      }
      e = e.split('.');
      do {
        if (void 0 === t) {
          return !1;
        }
        if (a = e.shift(), !t.hasOwnProperty(a)) {
          return !1;
        }
        t = t[a];
      } while (e.length);
      return !0;
    },
    getHighestZindex: function(t) {
      for (var e, a, n = mUtil.get(t); n && n !== document;) {
        if (('absolute' === (e = mUtil.css(n, 'position')) || 'relative' ===
            e || 'fixed' === e) &&
            (a = parseInt(mUtil.css(n, 'z-index')), !isNaN(a) && 0 !==
            a)) {
          return a;
        }
        n = n.parentNode;
      }
      return null;
    },
    hasFixedPositionedParent: function(t) {
      for (; t && t !== document;) {
        if (position = mUtil.css(t, 'position'), 'fixed' ===
        position) {
          return !0;
        }
        t = t.parentNode;
      }
      return !1;
    },
    sleep: function(t) {
      for (var e = (new Date).getTime(), a = 0; a < 1e7 &&
      !((new Date).getTime() - e > t); a++) {
        ;
      }
    },
    getRandomInt: function(t, e) {
      return Math.floor(Math.random() * (e - t + 1)) + t;
    },
    isAngularVersion: function() {return void 0 !== window.Zone;},
    deepExtend: function(t) {
      t = t || {};
      for (var e = 1; e < arguments.length; e++) {
        var a = arguments[e];
        if (a) {
          for (var n in a) {
            a.hasOwnProperty(n) && ('object' == typeof a[n]
                ? t[n] = mUtil.deepExtend(t[n], a[n])
                : t[n] = a[n]);
          }
        }
      }
      return t;
    },
    extend: function(t) {
      t = t || {};
      for (var e = 1; e <
      arguments.length; e++) {
        if (arguments[e]) {
          for (var a in arguments[e]) {
            arguments[e].hasOwnProperty(
                a) && (t[a] = arguments[e][a]);
          }
        }
      }
      return t;
    },
    get: function(t) {
      var e;
      return t === document ? document : t && 1 === t.nodeType
          ? t
          : (e = document.getElementById(t))
              ? e
              : (e = document.getElementsByTagName(t))
                  ? e[0]
                  : (e = document.getElementsByClassName(t)) ? e[0] : null;
    },
    getByClass: function(t) {
      var e;
      return (e = document.getElementsByClassName(t)) ? e[0] : null;
    },
    hasClasses: function(t, e) {
      if (t) {
        for (var a = e.split(' '), n = 0; n < a.length; n++) {
          if (0 ==
              mUtil.hasClass(t, mUtil.trim(a[n]))) {
            return !1;
          }
        }
        return !0;
      }
    },
    hasClass: function(t, e) {
      if (t) {
        return t.classList ? t.classList.contains(e) : new RegExp(
            '\\b' + e + '\\b').test(t.className);
      }
    },
    addClass: function(t, e) {
      if (t && void 0 !== e) {
        var a = e.split(' ');
        if (t.classList) {
          for (var n = 0; n < a.length; n++) {
            a[n] &&
            a[n].length > 0 &&
            t.classList.add(mUtil.trim(a[n]));
          }
        }
        else if (!mUtil.hasClass(t,
            e)) {
          for (n = 0; n < a.length; n++) {
            t.className += ' ' +
                mUtil.trim(a[n]);
          }
        }
      }
    },
    removeClass: function(t, e) {
      if (t) {
        var a = e.split(' ');
        if (t.classList) {
          for (var n = 0; n < a.length; n++) {
            t.classList.remove(
                mUtil.trim(a[n]));
          }
        }
        else if (mUtil.hasClass(t, e)) {
          for (n = 0; n <
          a.length; n++) {
            t.className = t.className.replace(
                new RegExp('\\b' + mUtil.trim(a[n]) + '\\b', 'g'), '');
          }
        }
      }
    },
    triggerCustomEvent: function(t, e, a) {
      if (window.CustomEvent) {
        var n = new CustomEvent(e,
            {detail: a});
      }
      else {
        (n = document.createEvent(
            'CustomEvent')).initCustomEvent(e, !0, !0, a);
      }
      t.dispatchEvent(n);
    },
    trim: function(t) {return t.trim();},
    eventTriggered: function(t) {
      return !!t.currentTarget.dataset.triggered ||
          (t.currentTarget.dataset.triggered = !0, !1);
    },
    remove: function(t) {t && t.parentNode && t.parentNode.removeChild(t);},
    find: function(t, e) {return t.querySelector(e);},
    findAll: function(t, e) {return t.querySelectorAll(e);},
    insertAfter: function(t, e) {
      return e.parentNode.insertBefore(t, e.nextSibling);
    },
    parents: function(t, e) {
      function a(t, e) {
        for (var a = 0, n = t.length; a < n; a++) {
          if (t[a] == e) {
            return !0;
          }
        }
        return !1;
      }

      return function(t, e) {
        for (var n = document.querySelectorAll(e), o = t.parentNode; o &&
        !a(n, o);) {
          o = o.parentNode;
        }
        return o;
      }(t, e);
    },
    children: function(t, e, a) {
      if (t && t.childNodes) {
        for (var n = [], o = 0, i = t.childNodes.length; o < i; ++o) {
          1 ==
          t.childNodes[o].nodeType && mUtil.matches(t.childNodes[o], e, a) &&
          n.push(t.childNodes[o]);
        }
        return n;
      }
    },
    child: function(t, e, a) {
      var n = mUtil.children(t, e, a);
      return n ? n[0] : null;
    },
    matches: function(t, e, a) {
      var n = Element.prototype,
          o = n.matches || n.webkitMatchesSelector || n.mozMatchesSelector ||
              n.msMatchesSelector || function(t) {
                return -1 !==
                    [].indexOf.call(document.querySelectorAll(t), this);
              };
      return !(!t || !t.tagName) && o.call(t, e);
    },
    data: function(t) {
      return t = mUtil.get(t), {
        set: function(e, a) {
          void 0 === t.customDataTag &&
          (mUtilElementDataStoreID++, t.customDataTag = mUtilElementDataStoreID), void 0 ===
          mUtilElementDataStore[t.customDataTag] &&
          (mUtilElementDataStore[t.customDataTag] = {}), mUtilElementDataStore[t.customDataTag][e] = a;
        },
        get: function(e) {
          return this.has(e)
              ? mUtilElementDataStore[t.customDataTag][e]
              : null;
        },
        has: function(e) {
          return !(!mUtilElementDataStore[t.customDataTag] ||
              !mUtilElementDataStore[t.customDataTag][e]);
        },
        remove: function(e) {
          this.has(e) && delete mUtilElementDataStore[t.customDataTag][e];
        },
      };
    },
    outerWidth: function(t, e) {
      if (!0 === e) {
        var a = parseFloat(t.offsetWidth);
        return a += parseFloat(mUtil.css(t, 'margin-left')) +
            parseFloat(mUtil.css(t, 'margin-right')), parseFloat(a);
      }
      return a = parseFloat(t.offsetWidth);
    },
    offset: function(t) {
      var e, a;
      if (t = mUtil.get(t)) {
        return t.getClientRects().length
            ? (e = t.getBoundingClientRect(), a = t.ownerDocument.defaultView, {
              top: e.top + a.pageYOffset, left: e.left + a.pageXOffset,
            })
            : {top: 0, left: 0};
      }
    },
    height: function(t) {return mUtil.css(t, 'height');},
    visible: function(t) {
      return !(0 === t.offsetWidth && 0 === t.offsetHeight);
    },
    attr: function(t, e, a) {
      if (null != (t = mUtil.get(t))) {
        return void 0 === a
            ? t.getAttribute(e)
            : void t.setAttribute(e, a);
      }
    },
    hasAttr: function(t, e) {
      if (null != (t = mUtil.get(t))) {
        return !!t.getAttribute(e);
      }
    },
    removeAttr: function(t, e) {
      null != (t = mUtil.get(t)) && t.removeAttribute(e);
    },
    animate: function(t, e, a, n, o, i) {
      var l = {};
      if (l.linear = function(t, e, a, n) {
        return a * t / n + e;
      }, o = l.linear, 'number' == typeof t && 'number' == typeof e &&
      'number' == typeof a && 'function' == typeof n) {
        'function' != typeof i && (i = function() {});
        var r = window.requestAnimationFrame ||
            function(t) {window.setTimeout(t, 20);}, s = e - t;
        n(t);
        var d = window.performance && window.performance.now
            ? window.performance.now()
            : +new Date;
        r(function l(c) {
          var m = (c || +new Date) - d;
          m >= 0 && n(o(m, t, s, a)), m >= 0 && m >= a ? (n(e), i()) : r(l);
        });
      }
    },
    actualCss: function(t, e, a) {
      var n;
      if (t instanceof HTMLElement != !1) {
        return t.getAttribute(
            'm-hidden-' + e) && !1 !== a
            ? parseFloat(t.getAttribute('m-hidden-' + e))
            : (t.style.cssText = 'position: absolute; visibility: hidden; display: block;', 'width' ==
            e ? n = t.offsetWidth : 'height' == e &&
                (n = t.offsetHeight), t.style.cssText = '', t.setAttribute(
                'm-hidden-' + e, n), parseFloat(n));
      }
    },
    actualHeight: function(t, e) {return mUtil.actualCss(t, 'height', e);},
    actualWidth: function(t, e) {return mUtil.actualCss(t, 'width', e);},
    getScroll: function(t, e) {
      return e = 'scroll' + e, t == window || t == document
          ? self['scrollTop' == e ? 'pageYOffset' : 'pageXOffset'] ||
          browserSupportsBoxModel && document.documentElement[e] ||
          document.body[e]
          : t[e];
    },
    css: function(t, e, a) {
      if (t = mUtil.get(t)) {
        if (void 0 !== a) {
          t.style[e] = a;
        }
        else {
          var n = (t.ownerDocument || document).defaultView;
          if (n && n.getComputedStyle) {
            return e = e.replace(/([A-Z])/g, '-$1').
                toLowerCase(), n.getComputedStyle(t, null).getPropertyValue(e);
          }
          if (t.currentStyle) {
            return e = e.replace(/\-(\w)/g, function(
                t,
                e) {return e.toUpperCase();}), a = t.currentStyle[e], /^\d+(em|pt|%|ex)?$/i.test(
                a) ? function(e) {
              var a = t.style.left, n = t.runtimeStyle.left;
              return t.runtimeStyle.left = t.currentStyle.left, t.style.left = e ||
                  0, e = t.style.pixelLeft +
                  'px', t.style.left = a, t.runtimeStyle.left = n, e;
            }(a) : a;
          }
        }
      }
    },
    slide: function(t, e, a, n, o) {
      if (!(!t || 'up' == e && !1 === mUtil.visible(t) || 'down' == e && !0 ===
          mUtil.visible(t))) {
        a = a || 600;
        var i = mUtil.actualHeight(t), l = !1, r = !1;
        mUtil.css(t, 'padding-top') && !0 !==
        mUtil.data(t).has('slide-padding-top') && mUtil.data(t).
            set('slide-padding-top', mUtil.css(t, 'padding-top')), mUtil.css(t,
            'padding-bottom') && !0 !==
        mUtil.data(t).has('slide-padding-bottom') && mUtil.data(t).
            set('slide-padding-bottom',
                mUtil.css(t, 'padding-bottom')), mUtil.data(t).
            has('slide-padding-top') &&
        (l = parseInt(mUtil.data(t).get('slide-padding-top'))), mUtil.data(t).
            has('slide-padding-bottom') &&
        (r = parseInt(mUtil.data(t).get('slide-padding-bottom'))), 'up' == e
            ? (t.style.cssText = 'display: block; overflow: hidden;', l &&
            mUtil.animate(0, l, a,
                function(e) {t.style.paddingTop = l - e + 'px';}, 'linear'), r &&
            mUtil.animate(0, r, a,
                function(e) {t.style.paddingBottom = r - e + 'px';},
                'linear'), mUtil.animate(0, i, a,
                function(e) {t.style.height = i - e + 'px';}, 'linear',
                function() {n(), t.style.height = '', t.style.display = 'none';}))
            : 'down' == e &&
            (t.style.cssText = 'display: block; overflow: hidden;', l &&
            mUtil.animate(0, l, a, function(e) {t.style.paddingTop = e + 'px';},
                'linear', function() {t.style.paddingTop = '';}), r &&
            mUtil.animate(0, r, a,
                function(e) {t.style.paddingBottom = e + 'px';}, 'linear',
                function() {t.style.paddingBottom = '';}), mUtil.animate(0, i, a,
                function(e) {t.style.height = e + 'px';}, 'linear',
                function() {n(), t.style.height = '', t.style.display = '', t.style.overflow = '';}));
      }
    },
    slideUp: function(t, e, a) {mUtil.slide(t, 'up', e, a);},
    slideDown: function(t, e, a) {mUtil.slide(t, 'down', e, a);},
    show: function(t, e) {t.style.display = e || 'block';},
    hide: function(t) {t.style.display = 'none';},
    addEvent: function(t, e, a, n) {
      void 0 !== (t = mUtil.get(t)) && t.addEventListener(e, a);
    },
    removeEvent: function(t, e, a) {
      (t = mUtil.get(t)).removeEventListener(e, a);
    },
    on: function(t, e, a, n) {
      if (e) {
        var o = mUtil.getUniqueID('event');
        return mUtilDelegatedEventHandlers[o] = function(a) {
          for (var o = t.querySelectorAll(e), i = a.target; i && i !== t;) {
            for (var l = 0, r = o.length; l < r; l++) {
              i === o[l] &&
              n.call(i, a);
            }
            i = i.parentNode;
          }
        }, mUtil.addEvent(t, a, mUtilDelegatedEventHandlers[o]), o;
      }
    },
    off: function(t, e, a) {
      t && mUtilDelegatedEventHandlers[a] && (mUtil.removeEvent(t, e,
          mUtilDelegatedEventHandlers[a]), delete mUtilDelegatedEventHandlers[a]);
    },
    one: function(t, e, a) {
      (t = mUtil.get(t)).addEventListener(e, function(t) {
        return t.target.removeEventListener(t.type, arguments.callee), a(t);
      });
    },
    hash: function(t) {
      var e, a = 0;
      if (0 === t.length) {
        return a;
      }
      for (e = 0; e < t.length; e++) {
        a = (a << 5) - a + t.charCodeAt(e), a |= 0;
      }
      return a;
    },
    animateClass: function(t, e, a) {
      mUtil.addClass(t, 'animated ' + e), mUtil.one(t,
          'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function() {mUtil.removeClass(t, 'animated ' + e);}), a &&
      mUtil.one(t.animationEnd, a);
    },
    animateDelay: function(t, e) {
      for (var a = [
        'webkit-',
        'moz-',
        'ms-',
        'o-',
        ''], n = 0; n < a.length; n++) {
        mUtil.css(t, a[n] + 'animation-delay', e);
      }
    },
    animateDuration: function(t, e) {
      for (var a = [
        'webkit-',
        'moz-',
        'ms-',
        'o-',
        ''], n = 0; n < a.length; n++) {
        mUtil.css(t, a[n] + 'animation-duration',
            e);
      }
    },
    scrollTo: function(t, e, a) {
      a = a || 500;
      var n, o, i = (t = mUtil.get(t)) ? mUtil.offset(t).top : 0,
          l = window.pageYOffset || document.documentElement.scrollTop ||
              document.body.scrollTop || 0;
      i > l ? (n = i, o = l) : (n = l, o = i), e && (o += e), mUtil.animate(n,
          o, a,
          function(t) {document.documentElement.scrollTop = t, document.body.parentNode.scrollTop = t, document.body.scrollTop = t;});
    },
    scrollTop: function(t, e) {mUtil.scrollTo(null, t, e);},
    isArray: function(t) {return t && Array.isArray(t);},
    ready: function(t) {
      (document.attachEvent ? 'complete' === document.readyState : 'loading' !==
          document.readyState) ? t() : document.addEventListener(
          'DOMContentLoaded', t);
    },
    isEmpty: function(t) {
      for (var e in t) {
        if (t.hasOwnProperty(e)) {
          return !1;
        }
      }
      return !0;
    },
    numberString: function(t) {
      for (var e = (t += '').split('.'), a = e[0], n = e.length > 1
          ? '.' + e[1]
          : '', o = /(\d+)(\d{3})/; o.test(a);) {
        a = a.replace(o, '$1,$2');
      }
      return a + n;
    },
    detectIE: function() {
      var t = window.navigator.userAgent, e = t.indexOf('MSIE ');
      if (e > 0) {
        return parseInt(t.substring(e + 5, t.indexOf('.', e)), 10);
      }
      if (t.indexOf('Trident/') > 0) {
        var a = t.indexOf('rv:');
        return parseInt(t.substring(a + 3, t.indexOf('.', a)), 10);
      }
      var n = t.indexOf('Edge/');
      return n > 0 && parseInt(t.substring(n + 5, t.indexOf('.', n)), 10);
    },
    isRTL: function() {
      return 'rtl' == mUtil.attr(mUtil.get('html'), 'direction');
    },
    scrollerInit: function(t, e) {
      function a() {
        var a, n;
        n = e.height instanceof Function ? parseInt(e.height.call()) : parseInt(
            e.height), e.disableForMobile &&
        mUtil.isInResponsiveRange('tablet-and-mobile')
            ? (a = mUtil.data(t).
                get('ps')) ? (e.resetHeightOnDestroy
                ? mUtil.css(t, 'height', 'auto')
                : (mUtil.css(t, 'overflow', 'auto'), n > 0 &&
                mUtil.css(t, 'height', n + 'px')), a.destroy(), a = mUtil.data(
                t).
                remove('ps')) : n > 0 &&
                (mUtil.css(t, 'overflow', 'auto'), mUtil.css(t, 'height',
                    n + 'px'))
            : (n > 0 && mUtil.css(t, 'height', n + 'px'), mUtil.css(t,
                'overflow', 'hidden'), (a = mUtil.data(t).get('ps'))
                ? a.update()
                : (mUtil.addClass(t, 'm-scroller'), a = new PerfectScrollbar(t,
                    {
                      wheelSpeed: .5,
                      swipeEasing: !0,
                      wheelPropagation: !1,
                      minScrollbarLength: 40,
                      suppressScrollX: !0,
                    }), mUtil.data(t).set('ps', a)));
      }

      a(), e.handleWindowResize && mUtil.addResizeHandler(function() {a();});
    },
    scrollerUpdate: function(t) {
      var e;
      (e = mUtil.data(t).get('ps')) && (console.log('update!'), e.update());
    },
    scrollersUpdate: function(t) {
      for (var e = mUtil.findAll(t, '.ps'), a = 0, n = e.length; a <
      n; a++) {
        mUtil.scrollerUpdate(e[a]);
      }
    },
    scrollerTop: function(t) {mUtil.data(t).get('ps') && (t.scrollTop = 0);},
    scrollerDestroy: function(t) {
      var e;
      (e = mUtil.data(t).get('ps')) &&
      (e.destroy(), e = mUtil.data(t).remove('ps'));
    },
  };
}();
mUtil.ready(function() {mUtil.init();});
var mApp = function() {
  var t = {
    brand: '#716aca',
    metal: '#c4c5d6',
    light: '#ffffff',
    accent: '#00c5dc',
    primary: '#5867dd',
    success: '#34bfa3',
    info: '#36a3f7',
    warning: '#ffb822',
    danger: '#f4516c',
    focus: '#9816f4',
  }, e = function(t) {
    var e = t.data('skin') ? 'm-tooltip--skin-' + t.data('skin') : '',
        a = 'auto' == t.data('width') ? 'm-tooltop--auto-width' : '',
        n = t.data('trigger') ? t.data('trigger') : 'hover';
    t.data('placement') && t.data('placement');
    t.tooltip({
      trigger: n,
      template: '<div class="m-tooltip ' + e + ' ' + a +
          ' tooltip" role="tooltip">                <div class="arrow"></div>                <div class="tooltip-inner"></div>            </div>',
    });
  }, a = function() {
    $('[data-toggle="m-tooltip"]').
        each(function() {e($(this));});
  }, n = function(t) {
    var e = t.data('skin') ? 'm-popover--skin-' + t.data('skin') : '',
        a = t.data('trigger') ? t.data('trigger') : 'hover';
    t.popover({
      trigger: a,
      template: '            <div class="m-popover ' + e +
          ' popover" role="tooltip">                <div class="arrow"></div>                <h3 class="popover-header"></h3>                <div class="popover-body"></div>            </div>',
    });
  }, o = function() {
    $('[data-toggle="m-popover"]').
        each(function() {n($(this));});
  }, i = function(t, e) {t = $(t), new mPortlet(t[0], e);}, l = function() {
    $('[m-portlet="true"]').each(function() {
      var t = $(this);
      !0 !== t.data('portlet-initialized') &&
      (i(t, {}), t.data('portlet-initialized', !0));
    });
  }, r = function() {
    $('[data-tab-target]').
        each(function() {
          1 != $(this).data('tabs-initialized') && ($(this).click(function(t) {
            t.preventDefault();
            var e = $(this), a = e.closest('[data-tabs="true"]'),
                n = $(a.data('tabs-contents')), o = $(e.data('tab-target'));
            a.find('.m-tabs__item.m-tabs__item--active').
                removeClass('m-tabs__item--active'), e.addClass(
                'm-tabs__item--active'), n.find(
                '.m-tabs-content__item.m-tabs-content__item--active').
                removeClass('m-tabs-content__item--active'), o.addClass(
                'm-tabs-content__item--active');
          }), $(this).data('tabs-initialized', !0));
        });
  };
  return {
    init: function(e) {e && e.colors && (t = e.colors), mApp.initComponents();},
    initComponents: function() {
      jQuery.event.special.touchstart = {
        setup: function(t, e, a) {
          'function' == typeof this &&
          (e.includes('noPreventDefault') ? this.addEventListener('touchstart',
              a, {passive: !1}) : this.addEventListener('touchstart', a,
              {passive: !0}));
        },
      }, jQuery.event.special.touchmove = {
        setup: function(
            t, e, a) {
          'function' == typeof this &&
          (e.includes('noPreventDefault') ? this.addEventListener('touchmove',
              a, {passive: !1}) : this.addEventListener('touchmove', a,
              {passive: !0}));
        },
      }, jQuery.event.special.wheel = {
        setup: function(t, e, a) {
          'function' == typeof this &&
          (e.includes('noPreventDefault') ? this.addEventListener('wheel', a,
              {passive: !1}) : this.addEventListener('wheel', a, {passive: !0}));
        },
      }, $('[data-scrollable="true"]').each(function() {
        var t = $(this);
        mUtil.scrollerInit(this, {
          disableForMobile: !0,
          handleWindowResize: !0,
          height: function() {
            return mUtil.isInResponsiveRange('tablet-and-mobile') &&
            t.data('mobile-height') ? t.data('mobile-height') : t.data('height');
          },
        });
      }), a(), o(), $('body').
          on('click', '[data-close=alert]',
              function() {$(this).closest('.alert').hide();}), l(), $(
          '.custom-file-input').on('change', function() {
        var t = $(this).val();
        $(this).next('.custom-file-label').addClass('selected').html(t);
      }), r();
    },
    initCustomTabs: function() {r();},
    initTooltips: function() {a();},
    initTooltip: function(t) {e(t);},
    initPopovers: function() {o();},
    initPopover: function(t) {n(t);},
    initPortlet: function(t, e) {i(t, e);},
    initPortlets: function() {l();},
    block: function(t, e) {
      var a, n, o, i = $(t);
      if ('spinner' == (e = $.extend(!0, {
        opacity: .03,
        overlayColor: '#000000',
        state: 'brand',
        type: 'loader',
        size: 'lg',
        centerX: !0,
        centerY: !0,
        message: '',
        shadow: !0,
        width: 'auto',
      }, e)).type ? o = '<div class="m-spinner ' +
          (a = e.skin ? 'm-spinner--skin-' + e.skin : '') + ' ' +
          (n = e.state ? 'm-spinner--' + e.state : '') + '"></div' : (a = e.skin
          ? 'm-loader--skin-' + e.skin
          : '', n = e.state ? 'm-loader--' + e.state : '', size = e.size
          ? 'm-loader--' + e.size
          : '', o = '<div class="m-loader ' + a + ' ' + n + ' ' + size +
          '"></div'), e.message && e.message.length > 0) {
        var l = 'm-blockui ' + (!1 === e.shadow ? 'm-blockui-no-shadow' : '');
        html = '<div class="' + l + '"><span>' + e.message + '</span><span>' +
            o + '</span></div>';
        i = document.createElement('div');
        mUtil.get('body').prepend(i), mUtil.addClass(i,
            l), i.innerHTML = '<span>' + e.message + '</span><span>' + o +
            '</span>', e.width = mUtil.actualWidth(i) + 10, mUtil.remove(
            i), 'body' == t &&
        (html = '<div class="' + l + '" style="margin-left:-' + e.width / 2 +
            'px;"><span>' + e.message + '</span><span>' + o + '</span></div>');
      }
      else {
        html = o;
      }
      var r = {
        message: html,
        centerY: e.centerY,
        centerX: e.centerX,
        css: {
          top: '30%',
          left: '50%',
          border: '0',
          padding: '0',
          backgroundColor: 'none',
          width: e.width,
        },
        overlayCSS: {
          backgroundColor: e.overlayColor,
          opacity: e.opacity,
          cursor: 'wait',
          zIndex: '10',
        },
        onUnblock: function() {
          i && i[0] &&
          (mUtil.css(i[0], 'position', ''), mUtil.css(i[0], 'zoom', ''));
        },
      };
      'body' == t ? (r.css.top = '50%', $.blockUI(r)) : (i = $(t)).block(r);
    },
    unblock: function(t) {t && 'body' != t ? $(t).unblock() : $.unblockUI();},
    blockPage: function(t) {return mApp.block('body', t);},
    unblockPage: function() {return mApp.unblock('body');},
    progress: function(t, e) {
      var a = 'm-loader m-loader--' + (e && e.skin ? e.skin : 'light') +
          ' m-loader--' + (e && e.alignment ? e.alignment : 'right') +
          ' m-loader--' + (e && e.size ? 'm-spinner--' + e.size : '');
      mApp.unprogress(t), $(t).addClass(a), $(t).data('progress-classes', a);
    },
    unprogress: function(t) {$(t).removeClass($(t).data('progress-classes'));},
    getColor: function(e) {return t[e];},
  };
}();
$(document).ready(function() {mApp.init({});}), function(t) {
  if (void 0 === mUtil) {
    throw new Error(
        'mUtil is required and must be included before mDatatable.');
  }
  t.fn['mDatatable'] = function(options) {
    if (t(this).length === 0) {
      return;
    }
    var pluginName = 'mDatatable';
    var pfx = 'm-';
    var util = mUtil;
    var app = mApp;

    // global variables
    var datatable = this;

    // debug enabled?
    // 1) state will be cleared on each refresh
    // 2) enable some logs
    // 3) etc.
    datatable.debug = false;

    datatable.API = {
      record: null,
      value: null,
      params: null,
    };

    var Plugin = {
      /********************
       ** PRIVATE METHODS
       ********************/
      isInit: false,
      cellOffset: 110,
      iconOffset: 15,
      stateId: 'meta',
      ajaxParams: {},
      pagingObject: {},

      init: function(options) {
        var isHtmlTable = false;
        // data source option empty is normal table
        if (options.data.source === null) {
          Plugin.extractTable();
          isHtmlTable = true;
        }

        Plugin.setupBaseDOM.call();
        Plugin.setupDOM(datatable.table);
        // Plugin.spinnerCallback(true);

        // set custom query from options
        Plugin.setDataSourceQuery(Plugin.getOption('data.source.read.params.query'));

        // on event after layout had done setup, show datatable
        t(datatable).on(pfx + 'datatable--on-layout-updated', Plugin.afterRender);

        if (datatable.debug) Plugin.stateRemove(Plugin.stateId);

        // initialize extensions
        t.each(Plugin.getOption('extensions'), function(extName, extOptions) {
          if (typeof t.fn[pluginName][extName] === 'function')
            new t.fn[pluginName][extName](datatable, extOptions);
        });

        // get data
        if (options.data.type === 'remote' || options.data.type === 'local') {
          if (options.data.saveState === false
              || options.data.saveState.cookie === false
              && options.data.saveState.webstorage === false) {
            Plugin.stateRemove(Plugin.stateId);
          }
          // get data for local datatable and local table
          if (options.data.type === 'local' && typeof options.data.source === 'object') {
            datatable.dataSet = datatable.originalDataSet = Plugin.dataMapCallback(options.data.source);
          }
          Plugin.dataRender();
        }

        // if html table, remove and setup a new header
        if (isHtmlTable) {
          t(datatable.tableHead).find('tr').remove();
          t(datatable.tableFoot).find('tr').remove();
        }

        Plugin.setHeadTitle();
        if (Plugin.getOption('layout.footer')) {
          Plugin.setHeadTitle(datatable.tableFoot);
        }

        // hide header
        if (typeof options.layout.header !== 'undefined' &&
            options.layout.header === false) {
          t(datatable.table).find('thead').remove();
        }

        // hide footer
        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer === false) {
          t(datatable.table).find('tfoot').remove();
        }

        // for normal and local data type, run layoutUpdate
        if (options.data.type === null ||
            options.data.type === 'local') {
          Plugin.setupCellField.call();
          Plugin.setupTemplateCell.call();

          // setup nested datatable, if option enabled
          Plugin.setupSubDatatable.call();

          // setup extra system column properties
          Plugin.setupSystemColumn.call();
          Plugin.redraw();
        }

        var width;
        var initialWidth = false;
        t(window).resize(function() {
          // get initial width
          if (!initialWidth) {
            width = t(this).width();
            initialWidth = true;
          }
          // issue: URL Bar Resizing on mobile, https://developers.google.com/web/updates/2016/12/url-bar-resizing
          // trigger datatable resize on width change only
          if (t(this).width() !== width) {
            width = t(this).width();
            Plugin.fullRender();
          }
        });

        t(datatable).height('');

        t(Plugin.getOption('search.input')).on('keyup', function(e) {
          if (Plugin.getOption('search.onEnter') && e.which !== 13) return;
          Plugin.search(t(this).val());
        });

        return datatable;
      },

      /**
       * Extract static HTML table content into datasource
       */
      extractTable: function() {
        var columns = [];
        var headers = t(datatable).find('tr:first-child th').get().map(function(cell, i) {
          var field = t(cell).data('field');
          if (typeof field === 'undefined') {
            field = t(cell).text().trim();
          }
          var column = {field: field, title: field};
          for (var ii in options.columns) {
            if (options.columns[ii].field === field) {
              column = t.extend(true, {}, options.columns[ii], column);
            }
          }
          columns.push(column);
          return field;
        });
        // auto create columns config
        options.columns = columns;

        var rowProp = [];
        var source = [];

        t(datatable).find('tr').each(function() {
          if (t(this).find('td').length) {
            rowProp.push(t(this).prop('attributes'));
          }
          var td = {};
          t(this).find('td').each(function(i, cell) {
            td[headers[i]] = cell.innerHTML.trim();
          });
          if (!util.isEmpty(td)) {
            source.push(td);
          }
        });

        options.data.attr.rowProps = rowProp;
        options.data.source = source;
      },

      /**
       * One time layout update on init
       */
      layoutUpdate: function() {
        // setup nested datatable, if option enabled
        Plugin.setupSubDatatable.call();

        // setup extra system column properties
        Plugin.setupSystemColumn.call();

        // setup cell hover event
        Plugin.setupHover.call();

        if (typeof options.detail === 'undefined'
            // temporary disable lock column in subtable
            && Plugin.getDepth() === 1) {
          // lock columns handler
          Plugin.lockTable.call();
        }

        Plugin.columnHide.call();

        Plugin.resetScroll();

        // check if not is a locked column
        if (!Plugin.isLocked()) {
          Plugin.redraw.call();
          // check if its not a subtable and has autoHide option enabled
          if (!Plugin.isSubtable() && Plugin.getOption('rows.autoHide') === true) {
            Plugin.autoHide();
          }
          // reset row
          t(datatable.table).find('.' + pfx + 'datatable__row').css('height', '');
        }

        Plugin.rowEvenOdd.call();

        Plugin.sorting.call();

        Plugin.scrollbar.call();

        if (!Plugin.isInit) {
          // run once dropdown inside datatable
          Plugin.dropdownFix();
          t(datatable).trigger(pfx + 'datatable--on-init', {table: t(datatable.wrap).attr('id'), options: options});
          Plugin.isInit = true;
        }

        t(datatable).trigger(pfx + 'datatable--on-layout-updated', {table: t(datatable.wrap).attr('id')});
      },

      lockTable: function() {
        var lock = {
          lockEnabled: false,
          init: function() {
            // check if table should be locked columns
            lock.lockEnabled = Plugin.lockEnabledColumns();
            if (lock.lockEnabled.left.length === 0 &&
                lock.lockEnabled.right.length === 0) {
              return;
            }
            lock.enable();
          },
          enable: function() {
            var enableLock = function(tablePart) {
              // check if already has lock column
              if (t(tablePart).find('.' + pfx + 'datatable__lock').length > 0) {
                Plugin.log('Locked container already exist in: ', tablePart);
                return;
              }
              // check if no rows exists
              if (t(tablePart).find('.' + pfx + 'datatable__row').length === 0) {
                Plugin.log('No row exist in: ', tablePart);
                return;
              }

              // locked div container
              var lockLeft = t('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--left');
              var lockScroll = t('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--scroll');
              var lockRight = t('<div/>').addClass(pfx + 'datatable__lock ' + pfx + 'datatable__lock--right');

              t(tablePart).find('.' + pfx + 'datatable__row').each(function() {
                // create new row for lock columns and pass the data
                var rowLeft = t('<tr/>').addClass(pfx + 'datatable__row').data('obj', t(this).data('obj')).appendTo(lockLeft);
                var rowScroll = t('<tr/>').addClass(pfx + 'datatable__row').data('obj', t(this).data('obj')).appendTo(lockScroll);
                var rowRight = t('<tr/>').addClass(pfx + 'datatable__row').data('obj', t(this).data('obj')).appendTo(lockRight);
                t(this).find('.' + pfx + 'datatable__cell').each(function() {
                  var locked = t(this).data('locked');
                  if (typeof locked !== 'undefined') {
                    if (typeof locked.left !== 'undefined' || locked === true) {
                      // default locked to left
                      t(this).appendTo(rowLeft);
                    }
                    if (typeof locked.right !== 'undefined') {
                      t(this).appendTo(rowRight);
                    }
                  } else {
                    t(this).appendTo(rowScroll);
                  }
                });
                // remove old row
                t(this).remove();
              });

              if (lock.lockEnabled.left.length > 0) {
                t(datatable.wrap).addClass(pfx + 'datatable--lock');
                t(lockLeft).appendTo(tablePart);
              }
              if (lock.lockEnabled.left.length > 0 || lock.lockEnabled.right.length > 0) {
                t(lockScroll).appendTo(tablePart);
              }
              if (lock.lockEnabled.right.length > 0) {
                t(datatable.wrap).addClass(pfx + 'datatable--lock');
                t(lockRight).appendTo(tablePart);
              }
            };

            t(datatable.table).find('thead,tbody,tfoot').each(function() {
              var tablePart = this;
              if (t(this).find('.' + pfx + 'datatable__lock').length === 0) {
                t(this).ready(function() {
                  enableLock(tablePart);
                });
              }
            });
          },
        };
        lock.init();
        return lock;
      },

      /**
       * Render everything for resize
       */
      fullRender: function() {
        t(datatable.tableHead).empty();
        Plugin.setHeadTitle();
        if (Plugin.getOption('layout.footer')) {
          t(datatable.tableFoot).empty();
          Plugin.setHeadTitle(datatable.tableFoot);
        }

        Plugin.spinnerCallback(true);
        t(datatable.wrap).removeClass(pfx + 'datatable--loaded');

        Plugin.insertData();
      },

      lockEnabledColumns: function() {
        var screen = t(window).width();
        var columns = options.columns;
        var enabled = {left: [], right: []};
        t.each(columns, function(i, column) {
          if (typeof column.locked !== 'undefined') {
            if (typeof column.locked.left !== 'undefined') {
              if (util.getBreakpoint(column.locked.left) <= screen) {
                enabled['left'].push(column.locked.left);
              }
            }
            if (typeof column.locked.right !== 'undefined') {
              if (util.getBreakpoint(column.locked.right) <= screen) {
                enabled['right'].push(column.locked.right);
              }
            }
          }
        });
        return enabled;
      },

      /**
       * After render event, called by
       * '+pfx+'-datatable--on-layout-updated
       * @param e
       * @param args
       */
      afterRender: function(e, args) {
        t(datatable).ready(function() {
          // redraw locked columns table
          if (Plugin.isLocked()) {
            Plugin.redraw();
          }

          t(datatable.tableBody).css('visibility', '');
          t(datatable.wrap).addClass(pfx + 'datatable--loaded');

          Plugin.spinnerCallback(false);
        });
      },

      dropdownFix: function() {
        var dropdownMenu;
        t('body').on('show.bs.dropdown', '.' + pfx + 'datatable .' + pfx + 'datatable__body', function(e) {
          dropdownMenu = t(e.target).find('.dropdown-menu');
          t('body').append(dropdownMenu.detach());
          dropdownMenu.css('display', 'block');
          dropdownMenu.position({
            'my': 'right top',
            'at': 'right bottom',
            'of': t(e.relatedTarget),
          });
          // if datatable is inside modal
          if (datatable.closest('.modal').length) {
            // increase dropdown z-index
            dropdownMenu.css('z-index', '2000');
          }
        }).on('hide.bs.dropdown', '.' + pfx + 'datatable .' + pfx + 'datatable__body', function(e) {
          t(e.target).append(dropdownMenu.detach());
          dropdownMenu.hide();
        });
      },

      hoverTimer: 0,
      isScrolling: false,
      setupHover: function() {
        t(window).scroll(function(e) {
          // stop hover when scrolling
          clearTimeout(Plugin.hoverTimer);
          Plugin.isScrolling = true;
        });

        t(datatable.tableBody).find('.' + pfx + 'datatable__cell').off('mouseenter', 'mouseleave').on('mouseenter', function() {
          // reset scroll timer to hover class
          Plugin.hoverTimer = setTimeout(function() {
            Plugin.isScrolling = false;
          }, 200);
          if (Plugin.isScrolling) return;

          // normal table
          var row = t(this).closest('.' + pfx + 'datatable__row').addClass(pfx + 'datatable__row--hover');
          var index = t(row).index() + 1;

          // lock table
          t(row).closest('.' + pfx + 'datatable__lock').parent().find('.' + pfx + 'datatable__row:nth-child(' + index + ')').addClass(pfx + 'datatable__row--hover');
        }).on('mouseleave', function() {
          // normal table
          var row = t(this).closest('.' + pfx + 'datatable__row').removeClass(pfx + 'datatable__row--hover');
          var index = t(row).index() + 1;

          // look table
          t(row).closest('.' + pfx + 'datatable__lock').parent().find('.' + pfx + 'datatable__row:nth-child(' + index + ')').removeClass(pfx + 'datatable__row--hover');
        });
      },

      /**
       * Adjust width of locked table containers by resize handler
       * @returns {number}
       */
      adjustLockContainer: function() {
        if (!Plugin.isLocked()) return 0;

        // refer to head dimension
        var containerWidth = t(datatable.tableHead).width();
        var lockLeft = t(datatable.tableHead).find('.' + pfx + 'datatable__lock--left').width();
        var lockRight = t(datatable.tableHead).find('.' + pfx + 'datatable__lock--right').width();

        if (typeof lockLeft === 'undefined') lockLeft = 0;
        if (typeof lockRight === 'undefined') lockRight = 0;

        var lockScroll = Math.floor(containerWidth - lockLeft - lockRight);
        t(datatable.table).find('.' + pfx + 'datatable__lock--scroll').css('width', lockScroll);

        return lockScroll;
      },

      /**
       * todo; not in use
       */
      dragResize: function() {
        var pressed = false;
        var start = undefined;
        var startX, startWidth;
        t(datatable.tableHead).find('.' + pfx + 'datatable__cell').mousedown(function(e) {
          start = t(this);
          pressed = true;
          startX = e.pageX;
          startWidth = t(this).width();
          t(start).addClass(pfx + 'datatable__cell--resizing');

        }).mousemove(function(e) {
          if (pressed) {
            var i = t(start).index();
            var tableBody = t(datatable.tableBody);
            var ifLocked = t(start).closest('.' + pfx + 'datatable__lock');

            if (ifLocked) {
              var lockedIndex = t(ifLocked).index();
              tableBody = t(datatable.tableBody).find('.' + pfx + 'datatable__lock').eq(lockedIndex);
            }

            t(tableBody).find('.' + pfx + 'datatable__row').each(function(tri, tr) {
              t(tr).find('.' + pfx + 'datatable__cell').eq(i).width(startWidth + (e.pageX - startX)).children().width(startWidth + (e.pageX - startX));
            });

            t(start).children().css('width', startWidth + (e.pageX - startX));
          }

        }).mouseup(function() {
          t(start).removeClass(pfx + 'datatable__cell--resizing');
          pressed = false;
        });

        t(document).mouseup(function() {
          t(start).removeClass(pfx + 'datatable__cell--resizing');
          pressed = false;
        });
      },

      /**
       * To prepare placeholder for table before content is loading
       */
      initHeight: function() {
        if (options.layout.height && options.layout.scroll) {
          var theadHeight = t(datatable.tableHead).find('.' + pfx + 'datatable__row').outerHeight();
          var tfootHeight = t(datatable.tableFoot).find('.' + pfx + 'datatable__row').outerHeight();
          var bodyHeight = options.layout.height;
          if (theadHeight > 0) {
            bodyHeight -= theadHeight;
          }
          if (tfootHeight > 0) {
            bodyHeight -= tfootHeight;
          }

          // scrollbar offset
          bodyHeight -= 2;

          t(datatable.tableBody).css('max-height', bodyHeight);

          // set scrollable area fixed height
          t(datatable.tableBody).find('.' + pfx + 'datatable__lock--scroll').css('height', bodyHeight);
        }
      },

      /**
       * Setup base DOM (table, thead, tbody, tfoot) and create if not
       * exist.
       */
      setupBaseDOM: function() {
        // keep original state before datatable initialize
        datatable.initialDatatable = t(datatable).clone();

        // main element
        if (t(datatable).prop('tagName') === 'TABLE') {
          // if main init element is <table>, wrap with div
          datatable.table = t(datatable).removeClass(pfx + 'datatable').addClass(pfx + 'datatable__table');
          if (t(datatable.table).parents('.' + pfx + 'datatable').length === 0) {
            datatable.table.wrap(t('<div/>').addClass(pfx + 'datatable').addClass(pfx + 'datatable--' + options.layout.theme));
            datatable.wrap = t(datatable.table).parent();
          }
        } else {
          // create table
          datatable.wrap = t(datatable).addClass(pfx + 'datatable').addClass(pfx + 'datatable--' + options.layout.theme);
          datatable.table = t('<table/>').addClass(pfx + 'datatable__table').appendTo(datatable);
        }

        if (typeof options.layout.class !== 'undefined') {
          t(datatable.wrap).addClass(options.layout.class);
        }

        t(datatable.table).removeClass(pfx + 'datatable--destroyed').css('display', 'block');

        // force disable save state
        if (typeof t(datatable).attr('id') === 'undefined') {
          Plugin.setOption('data.saveState', false);
          t(datatable.table).attr('id', util.getUniqueID(pfx + 'datatable--'));
        }

        // predefine table height
        if (Plugin.getOption('layout.minHeight'))
          t(datatable.table).css('min-height', Plugin.getOption('layout.minHeight'));

        if (Plugin.getOption('layout.height'))
          t(datatable.table).css('max-height', Plugin.getOption('layout.height'));

        // for normal table load
        if (options.data.type === null) {
          t(datatable.table).css('width', '').css('display', '');
        }

        // create table head element
        datatable.tableHead = t(datatable.table).find('thead');
        if (t(datatable.tableHead).length === 0) {
          datatable.tableHead = t('<thead/>').prependTo(datatable.table);
        }

        // create table head element
        datatable.tableBody = t(datatable.table).find('tbody');
        if (t(datatable.tableBody).length === 0) {
          datatable.tableBody = t('<tbody/>').appendTo(datatable.table);
        }

        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer) {
          // create table foot element
          datatable.tableFoot = t(datatable.table).find('tfoot');
          if (t(datatable.tableFoot).length === 0) {
            datatable.tableFoot = t('<tfoot/>').appendTo(datatable.table);
          }
        }
      },

      /**
       * Set column data before table manipulation.
       */
      setupCellField: function(tableParts) {
        if (typeof tableParts === 'undefined') tableParts = t(datatable.table).children();
        var columns = options.columns;
        t.each(tableParts, function(part, tablePart) {
          t(tablePart).find('.' + pfx + 'datatable__row').each(function(tri, tr) {
            // prepare data
            t(tr).find('.' + pfx + 'datatable__cell').each(function(tdi, td) {
              if (typeof columns[tdi] !== 'undefined') {
                t(td).data(columns[tdi]);
              }
            });
          });
        });
      },

      /**
       * Set column template callback
       * @param tablePart
       */
      setupTemplateCell: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        var columns = options.columns;
        t(tablePart).find('.' + pfx + 'datatable__row').each(function(tri, tr) {
          // row data object, if any
          var obj = t(tr).data('obj');
          if (typeof obj === 'undefined') {
            return;
          }

          // @deprecated in v5.0.6
          // obj['getIndex'] = function() {
          // 	return tri;
          // };
          // @deprecated in v5.0.6
          // obj['getDatatable'] = function() {
          // 	return datatable;
          // };

          // @deprecated in v5.0.6
          var rowCallback = Plugin.getOption('rows.callback');
          if (typeof rowCallback === 'function') {
            rowCallback(t(tr), obj, tri);
          }
          // before template row callback
          var beforeTemplate = Plugin.getOption('rows.beforeTemplate');
          if (typeof beforeTemplate === 'function') {
            beforeTemplate(t(tr), obj, tri);
          }
          // if data object is undefined, collect from table
          if (typeof obj === 'undefined') {
            obj = {};
            t(tr).find('.' + pfx + 'datatable__cell').each(function(tdi, td) {
              // get column settings by field
              var column = t.grep(columns, function(n, i) {
                return t(td).data('field') === n.field;
              })[0];
              if (typeof column !== 'undefined') {
                obj[column['field']] = t(td).text();
              }
            });
          }

          t(tr).find('.' + pfx + 'datatable__cell').each(function(tdi, td) {
            // get column settings by field
            var column = t.grep(columns, function(n, i) {
              return t(td).data('field') === n.field;
            })[0];
            if (typeof column !== 'undefined') {
              // column template
              if (typeof column.template !== 'undefined') {
                var finalValue = '';
                // template string
                if (typeof column.template === 'string') {
                  finalValue = Plugin.dataPlaceholder(column.template, obj);
                }
                // template callback function
                if (typeof column.template === 'function') {
                  finalValue = column.template(obj, tri, datatable);
                }

                // sanitize using DOMPurify if installed
                if (typeof DOMPurify !== 'undefined') {
                  finalValue = DOMPurify.sanitize(finalValue);
                }

                var span = document.createElement('span');
                span.innerHTML = finalValue;

                // insert to cell, wrap with span
                t(td).html(span);

                // set span overflow
                if (typeof column.overflow !== 'undefined') {
                  t(span).css('overflow', column.overflow);
                  t(span).css('position', 'relative');
                }
              }
            }
          });

          // after template row callback
          var afterTemplate = Plugin.getOption('rows.afterTemplate');
          if (typeof afterTemplate === 'function') {
            afterTemplate(t(tr), obj, tri);
          }
        });
      },

      /**
       * Setup extra system column properties
       * Note: selector checkbox, subtable toggle
       */
      setupSystemColumn: function() {
        datatable.dataSet = datatable.dataSet || [];
        // no records available
        if (datatable.dataSet.length === 0) return;

        var columns = options.columns;
        t(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function(tri, tr) {
          t(tr).find('.' + pfx + 'datatable__cell').each(function(tdi, td) {
            // get column settings by field
            var column = t.grep(columns, function(n, i) {
              return t(td).data('field') === n.field;
            })[0];
            if (typeof column !== 'undefined') {
              var value = t(td).text();

              // enable column selector
              if (typeof column.selector !== 'undefined' && column.selector !== false) {
                // check if checkbox exist
                if (t(td).find('.' + pfx + 'checkbox [type="checkbox"]').length > 0) return;

                t(td).addClass(pfx + 'datatable__cell--check');

                // append checkbox
                var chk = t('<label/>').
                    addClass(pfx + 'checkbox ' + pfx + 'checkbox--single').
                    append(t('<input/>').attr('type', 'checkbox').attr('value', value).on('click', function() {
                      if (t(this).is(':checked')) {
                        // add checkbox active row class
                        Plugin.setActive(this);
                      } else {
                        // add checkbox active row class
                        Plugin.setInactive(this);
                      }
                    })).
                    append('&nbsp;<span></span>');

                // checkbox selector has outline style
                if (typeof column.selector.class !== 'undefined') {
                  t(chk).addClass(column.selector.class);
                }

                t(td).children().html(chk);
              }

              // enable column subtable toggle
              if (typeof column.subtable !== 'undefined' && column.subtable) {
                // check if subtable toggle exist
                if (t(td).find('.' + pfx + 'datatable__toggle-subtable').length > 0) return;
                // append subtable toggle
                t(td).
                    children().
                    html(t('<a/>').
                        addClass(pfx + 'datatable__toggle-subtable').
                        attr('href', '#').
                        attr('data-value', value).
                        append(t('<i/>').addClass(Plugin.getOption('layout.icons.rowDetail.collapse'))));
              }
            }
          });
        });

        // init checkbox for header/footer
        var initCheckbox = function(tr) {
          // get column settings by field
          var column = t.grep(columns, function(n, i) {
            return typeof n.selector !== 'undefined' && n.selector !== false;
          })[0];

          if (typeof column !== 'undefined') {
            // enable column selector
            if (typeof column.selector !== 'undefined' && column.selector !== false) {
              var td = t(tr).find('[data-field="' + column.field + '"]');
              // check if checkbox exist
              if (t(td).find('.' + pfx + 'checkbox [type="checkbox"]').length > 0) return;

              t(td).addClass(pfx + 'datatable__cell--check');

              // append checkbox
              var chk = t('<label/>').
                  addClass(pfx + 'checkbox ' + pfx + 'checkbox--single ' + pfx + 'checkbox--all').
                  append(t('<input/>').attr('type', 'checkbox').on('click', function() {
                    if (t(this).is(':checked')) {
                      Plugin.setActiveAll(true);
                    } else {
                      Plugin.setActiveAll(false);
                    }
                  })).
                  append('&nbsp;<span></span>');

              // checkbox selector has outline style
              if (typeof column.selector.class !== 'undefined') {
                t(chk).addClass(column.selector.class);
              }

              t(td).children().html(chk);
            }
          }
        };

        if (options.layout.header) {
          initCheckbox(t(datatable.tableHead).find('.' + pfx + 'datatable__row').first());
        }
        if (options.layout.footer) {
          initCheckbox(t(datatable.tableFoot).find('.' + pfx + 'datatable__row').first());
        }
      },

      /**
       * Adjust width to match container size
       */
      adjustCellsWidth: function() {
        // get table width
        var containerWidth = t(datatable.tableBody).innerWidth() - Plugin.iconOffset;

        // get total number of columns
        var columns = t(datatable.tableBody).
            find('.' + pfx + 'datatable__row:first-child').
            find('.' + pfx + 'datatable__cell').
            // exclude expand icon
            not('.' + pfx + 'datatable__toggle-detail').
            not(':hidden').length;

        if (columns > 0) {
          //  remove reserved sort icon width
          containerWidth = containerWidth - (Plugin.iconOffset * columns);
          var minWidth = Math.floor(containerWidth / columns);

          // minimum width
          if (minWidth <= Plugin.cellOffset) {
            minWidth = Plugin.cellOffset;
          }

          var maxWidthList = {};
          t(datatable.table).find('.' + pfx + 'datatable__row').
              find('.' + pfx + 'datatable__cell').
              // exclude expand icon
              not('.' + pfx + 'datatable__toggle-detail').
              not(':hidden').each(function(tdi, td) {

            var width = minWidth;
            var dataWidth = t(td).data('width');

            if (typeof dataWidth !== 'undefined') {

              if (dataWidth === 'auto') {
                var field = t(td).data('field');
                if (maxWidthList[field]) {
                  width = maxWidthList[field];
                }
                else {
                  var cells = t(datatable.table).find('.' + pfx + 'datatable__cell[data-field="' + field + '"]');
                  width = maxWidthList[field] = Math.max.apply(null,
                      t(cells).map(function() {
                        return t(this).outerWidth();
                      }).get());
                }
              }
              else {
                width = dataWidth;
              }
            }
            t(td).children().css('width', Math.ceil(width));
          });
        }

        return datatable;
      },

      /**
       * Adjust height to match container size
       */
      adjustCellsHeight: function() {
        t.each(t(datatable.table).children(), function(part, tablePart) {
          var totalRows = t(tablePart).find('.' + pfx + 'datatable__row').first().parent().find('.' + pfx + 'datatable__row').length;
          for (var i = 1; i <= totalRows; i++) {
            var rows = t(tablePart).find('.' + pfx + 'datatable__row:nth-child(' + i + ')');
            if (t(rows).length > 0) {
              var maxHeight = Math.max.apply(null, t(rows).map(function() {
                return t(this).outerHeight();
              }).get());
              t(rows).css('height', Math.ceil(maxHeight));
            }
          }
        });
      },

      /**
       * Setup table DOM and classes
       */
      setupDOM: function(table) {
        // set table classes
        t(table).find('> thead').addClass(pfx + 'datatable__head');
        t(table).find('> tbody').addClass(pfx + 'datatable__body');
        t(table).find('> tfoot').addClass(pfx + 'datatable__foot');
        t(table).find('tr').addClass(pfx + 'datatable__row');
        t(table).find('tr > th, tr > td').addClass(pfx + 'datatable__cell');
        t(table).find('tr > th, tr > td').each(function(i, td) {
          if (t(td).find('span').length === 0) {
            t(td).wrapInner(t('<span/>').css('width', Plugin.cellOffset));
          }
        });
      },

      /**
       * Default scrollbar
       * @returns {{tableLocked: null, init: init, onScrolling:
       *     onScrolling}}
       */
      scrollbar: function() {
        var scroll = {
          scrollable: null,
          tableLocked: null,
          initPosition: null,
          init: function() {
            var screen = util.getViewPort().width;
            // setup scrollable datatable
            if (options.layout.scroll) {
              // add scrollable datatable class
              t(datatable.wrap).addClass(pfx + 'datatable--scroll');

              var scrollable = t(datatable.tableBody).find('.' + pfx + 'datatable__lock--scroll');

              // check if scrollable area have rows
              if (t(scrollable).find('.' + pfx + 'datatable__row').length > 0 && t(scrollable).length > 0) {
                scroll.scrollHead = t(datatable.tableHead).find('> .' + pfx + 'datatable__lock--scroll > .' + pfx + 'datatable__row');
                scroll.scrollFoot = t(datatable.tableFoot).find('> .' + pfx + 'datatable__lock--scroll > .' + pfx + 'datatable__row');
                scroll.tableLocked = t(datatable.tableBody).find('.' + pfx + 'datatable__lock:not(.' + pfx + 'datatable__lock--scroll)');
                if (Plugin.getOption('layout.customScrollbar') && util.detectIE() != 10 && screen > util.getBreakpoint('lg')) {
                  scroll.initCustomScrollbar(scrollable[0]);
                } else {
                  scroll.initDefaultScrollbar(scrollable);
                }
              } else if (t(datatable.tableBody).find('.' + pfx + 'datatable__row').length > 0) {
                scroll.scrollHead = t(datatable.tableHead).find('> .' + pfx + 'datatable__row');
                scroll.scrollFoot = t(datatable.tableFoot).find('> .' + pfx + 'datatable__row');
                if (Plugin.getOption('layout.customScrollbar') && util.detectIE() != 10 && screen > util.getBreakpoint('lg')) {
                  scroll.initCustomScrollbar(datatable.tableBody);
                } else {
                  scroll.initDefaultScrollbar(datatable.tableBody);
                }
              }
            }
          },
          initDefaultScrollbar: function(scrollable) {
            // get initial scroll position
            scroll.initPosition = t(scrollable).scrollLeft();
            t(scrollable).css('overflow-y', 'auto').off().on('scroll', scroll.onScrolling);
            if (Plugin.getOption('rows.autoHide') !== true) {
              t(scrollable).css('overflow-x', 'auto');
            }
          },
          onScrolling: function(e) {
            var left = t(this).scrollLeft();
            var top = t(this).scrollTop();
            if (util.isRTL()) {
              // deduct initial position for RTL
              left = left - scroll.initPosition;
            }
            t(scroll.scrollHead).css('left', -left);
            t(scroll.scrollFoot).css('left', -left);
            t(scroll.tableLocked).each(function(i, table) {
              if (Plugin.isLocked()) {
                // scrollbar offset
                top -= 1;
              }
              t(table).css('top', -top);
            });
          },
          initCustomScrollbar: function(scrollable) {
            scroll.scrollable = scrollable;
            // create a new instance for table body with scrollbar
            Plugin.initScrollbar(scrollable);
            // get initial scroll position
            scroll.initPosition = t(scrollable).scrollLeft();
            t(scrollable).off().on('scroll', scroll.onScrolling);
          },
        };
        scroll.init();
        return scroll;
      },

      /**
       * Init custom scrollbar and reset position
       * @param element
       * @param options
       */
      initScrollbar: function(element, options) {
        if (!element || !element.nodeName) {
          return;
        }
        t(datatable.tableBody).css('overflow', '');
        if (util.hasClass(element, 'ps')) {
          t(element).data('ps').update();
        } else {
          var ps = new PerfectScrollbar(element, Object.assign({}, {
            wheelSpeed: 0.5,
            swipeEasing: true,
            // wheelPropagation: false,
            minScrollbarLength: 40,
            maxScrollbarLength: 300,
            suppressScrollX: Plugin.getOption('rows.autoHide') && !Plugin.isLocked()
          }, options));
          t(element).data('ps', ps);

          // reset perfect scrollbar on resize
          t(window).resize(function() {
            ps.update();
          });
        }
      },

      /**
       * Set column title from options.columns settings
       */
      setHeadTitle: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableHead;
        tablePart = t(tablePart)[0];
        var columns = options.columns;
        var row = tablePart.getElementsByTagName('tr')[0];
        var ths = tablePart.getElementsByTagName('td');

        if (typeof row === 'undefined') {
          row = document.createElement('tr');
          tablePart.appendChild(row);
        }

        t.each(columns, function(i, column) {
          var th = ths[i];
          if (typeof th === 'undefined') {
            th = document.createElement('th');
            row.appendChild(th);
          }

          // set column title
          if (typeof column['title'] !== 'undefined') {
            th.innerHTML = column.title;
            th.setAttribute('data-field', column.field);
            util.addClass(th, column.class);
            // set disable autoHide or force enable
            if (typeof column.autoHide !== 'undefined') {
              if (column.autoHide !== true) {
                th.setAttribute('data-autohide-disabled', column.autoHide);
              } else {
                th.setAttribute('data-autohide-enabled', column.autoHide);
              }
            }
            t(th).data(column);
          }

          // set header attr option
          if (typeof column.attr !== 'undefined') {
            t.each(column.attr, function(key, val) {
              th.setAttribute(key, val);
            });
          }

          // apply text align to thead/tfoot
          if (typeof column.textAlign !== 'undefined') {
            var align = typeof datatable.textAlign[column.textAlign] !== 'undefined' ? datatable.textAlign[column.textAlign] : '';
            util.addClass(th, align);
          }
        });
        Plugin.setupDOM(tablePart);
      },

      /**
       * Initiate to get remote or local data via ajax
       */
      dataRender: function(action) {
        t(datatable.table).siblings('.' + pfx + 'datatable__pager').removeClass(pfx + 'datatable--paging-loaded');

        var buildMeta = function() {
          datatable.dataSet = datatable.dataSet || [];
          Plugin.localDataUpdate();
          // local pagination meta
          var meta = Plugin.getDataSourceParam('pagination');
          if (meta.perpage === 0) {
            meta.perpage = options.data.pageSize || 10;
          }
          meta.total = datatable.dataSet.length;
          var start = Math.max(meta.perpage * (meta.page - 1), 0);
          var end = Math.min(start + meta.perpage, meta.total);
          datatable.dataSet = t(datatable.dataSet).slice(start, end);
          return meta;
        };

        var afterGetData = function(result) {
          var localPagingCallback = function(ctx, meta) {
            if (!t(ctx.pager).hasClass(pfx + 'datatable--paging-loaded')) {
              t(ctx.pager).remove();
              ctx.init(meta);
            }
            t(ctx.pager).off().on(pfx + 'datatable--on-goto-page', function(e) {
              t(ctx.pager).remove();
              ctx.init(meta);
            });

            var start = Math.max(meta.perpage * (meta.page - 1), 0);
            var end = Math.min(start + meta.perpage, meta.total);

            Plugin.localDataUpdate();
            datatable.dataSet = t(datatable.dataSet).slice(start, end);

            // insert data into table content
            Plugin.insertData();
          };

          t(datatable.wrap).removeClass(pfx + 'datatable--error');
          // pagination enabled
          if (options.pagination) {
            if (options.data.serverPaging && options.data.type !== 'local') {
              // server pagination
              var serverMeta = Plugin.getObject('meta', result || null);
              if (serverMeta !== null) {
                Plugin.pagingObject = Plugin.paging(serverMeta);
              } else {
                // no meta object from server response, fallback to local pagination
                Plugin.pagingObject = Plugin.paging(buildMeta(), localPagingCallback);
              }
            } else {
              // local pagination can be used by remote data also
              Plugin.pagingObject = Plugin.paging(buildMeta(), localPagingCallback);
            }
          } else {
            // pagination is disabled
            Plugin.localDataUpdate();
          }
          // insert data into table content
          Plugin.insertData();
        };

        // get local datasource
        if (options.data.type === 'local'
            // for remote json datasource
            // || typeof options.data.source.read === 'undefined' && datatable.dataSet !== null
            // for remote datasource, server sorting is disabled and data already received from remote
            || options.data.serverSorting === false && action === 'sort'
            || options.data.serverFiltering === false && action === 'search'
        ) {
          setTimeout(function() {
            afterGetData();
            Plugin.setAutoColumns();
          });
          return;
        }

        // getting data from remote only
        Plugin.getData().done(afterGetData);
      },

      /**
       * Process ajax data
       */
      insertData: function() {
        datatable.dataSet = datatable.dataSet || [];
        var params = Plugin.getDataSourceParam();

        // get row attributes
        var pagination = params.pagination;
        var start = (Math.max(pagination.page, 1) - 1) * pagination.perpage;
        var end = Math.min(pagination.page, pagination.pages) * pagination.perpage;
        var rowProps = {};
        if (typeof options.data.attr.rowProps !== 'undefined' && options.data.attr.rowProps.length) {
          rowProps = options.data.attr.rowProps.slice(start, end);
        }

        var tableBody = document.createElement('tbody');
        tableBody.style.visibility = 'hidden';
        var colLength = options.columns.length;

        t.each(datatable.dataSet, function(rowIndex, row) {
          var tr = document.createElement('tr');
          tr.setAttribute('data-row', rowIndex);
          // keep data object to row
          t(tr).data('obj', row);

          if (typeof rowProps[rowIndex] !== 'undefined') {
            t.each(rowProps[rowIndex], function() {
              tr.setAttribute(this.name, this.value);
            });
          }

          var cellIndex = 0;
          var tds = [];
          for (var a = 0; a < colLength; a += 1) {
            var column = options.columns[a];
            var classes = [];
            // add sorted class to cells
            if (Plugin.getObject('sort.field', params) === column.field) {
              classes.push(pfx + 'datatable__cell--sorted');
            }

            // apply text align
            if (typeof column.textAlign !== 'undefined') {
              var align = typeof datatable.textAlign[column.textAlign] !== 'undefined' ? datatable.textAlign[column.textAlign] : '';
              classes.push(align);
            }

            // var classAttr = '';
            if (typeof column.class !== 'undefined') {
              classes.push(column.class);
            }

            var td = document.createElement('td');
            util.addClass(td, classes.join(' '));
            td.setAttribute('data-field', column.field);
            // set disable autoHide or force enable
            if (typeof column.autoHide !== 'undefined') {
              if (column.autoHide !== true) {
                td.setAttribute('data-autohide-disabled', column.autoHide);
              } else {
                td.setAttribute('data-autohide-enabled', column.autoHide);
              }
            }
            td.innerHTML = Plugin.getObject(column.field, row);
            tr.appendChild(td);
          }

          tableBody.appendChild(tr);
        });

        // display no records message
        if (datatable.dataSet.length === 0) {
          var errorSpan = document.createElement('span');
          util.addClass(errorSpan, pfx + 'datatable--error');
          errorSpan.innerHTML = Plugin.getOption('translate.records.noRecords');
          tableBody.appendChild(errorSpan);
          t(datatable.wrap).addClass(pfx + 'datatable--error ' + pfx + 'datatable--loaded');
          Plugin.spinnerCallback(false);
        }

        // replace existing table body
        t(datatable.tableBody).replaceWith(tableBody);
        datatable.tableBody = tableBody;

        // layout update
        Plugin.setupDOM(datatable.table);
        Plugin.setupCellField([datatable.tableBody]);
        Plugin.setupTemplateCell(datatable.tableBody);
        Plugin.layoutUpdate();
      },

      updateTableComponents: function() {
        datatable.tableHead = t(datatable.table).children('thead');
        datatable.tableBody = t(datatable.table).children('tbody');
        datatable.tableFoot = t(datatable.table).children('tfoot');
      },

      /**
       * Call ajax for raw JSON data
       */
      getData: function() {
        // Plugin.spinnerCallback(true);

        var ajaxParams = {
          dataType: 'json',
          method: 'POST',
          data: {},
          timeout: Plugin.getOption('data.source.read.timeout') || 30000,
        };

        if (options.data.type === 'local') {
          ajaxParams.url = options.data.source;
        }

        if (options.data.type === 'remote') {
          var data = Plugin.getDataSourceParam();
          // remove if server params is not enabled
          if (!Plugin.getOption('data.serverPaging')) {
            delete data['pagination'];
          }
          if (!Plugin.getOption('data.serverSorting')) {
            delete data['sort'];
          }
          ajaxParams.data = t.extend({}, ajaxParams.data, data, Plugin.getOption('data.source.read.params'));
          ajaxParams = t.extend({}, ajaxParams, Plugin.getOption('data.source.read'));

          if (typeof ajaxParams.url !== 'string') ajaxParams.url = Plugin.getOption('data.source.read');
          if (typeof ajaxParams.url !== 'string') ajaxParams.url = Plugin.getOption('data.source');
          // ajaxParams.data = t.extend(ajaxParams.data, data.pagination);
        }

        return t.ajax(ajaxParams).done(function(response, textStatus, jqXHR) {
          datatable.lastResponse = response;
          // extendible data map callback for custom datasource
          datatable.dataSet = datatable.originalDataSet = Plugin.dataMapCallback(response);
          Plugin.setAutoColumns();
          t(datatable).trigger(pfx + 'datatable--on-ajax-done', [datatable.dataSet]);
        }).fail(function(jqXHR, textStatus, errorThrown) {
          t(datatable).trigger(pfx + 'datatable--on-ajax-fail', [jqXHR]);
          t(datatable.tableBody).html(t('<span/>').addClass(pfx + 'datatable--error').html(Plugin.getOption('translate.records.noRecords')));
          t(datatable.wrap).addClass(pfx + 'datatable--error ' + pfx + 'datatable--loaded');
          Plugin.spinnerCallback(false);
        }).always(function() {
        });
      },

      /**
       * Pagination object
       * @param meta if null, local pagination, otherwise remote
       *     pagination
       * @param callback for update data when navigating page
       */
      paging: function(meta, callback) {
        var pg = {
          meta: null,
          pager: null,
          paginateEvent: null,
          pagerLayout: {pagination: null, info: null},
          callback: null,
          init: function(meta) {
            pg.meta = meta;

            // parse pagination meta to integer
            pg.meta.page = parseInt(pg.meta.page);
            pg.meta.pages = parseInt(pg.meta.pages);
            pg.meta.perpage = parseInt(pg.meta.perpage);
            pg.meta.total = parseInt(pg.meta.total);

            // always recount total pages
            pg.meta.pages = Math.max(Math.ceil(pg.meta.total / pg.meta.perpage), 1);

            // current page must be not over than total pages
            if (pg.meta.page > pg.meta.pages) pg.meta.page = pg.meta.pages;

            // set unique event name between tables
            pg.paginateEvent = Plugin.getTablePrefix();

            pg.pager = t(datatable.table).siblings('.' + pfx + 'datatable__pager');
            if (t(pg.pager).hasClass(pfx + 'datatable--paging-loaded')) return;

            // if class .'+pfx+'datatable--paging-loaded not exist, recreate pagination
            t(pg.pager).remove();

            // if no pages available
            if (pg.meta.pages === 0) return;

            // update datasource params
            Plugin.setDataSourceParam('pagination', {
              page: pg.meta.page,
              pages: pg.meta.pages,
              perpage: pg.meta.perpage,
              total: pg.meta.total,
            });

            // default callback function, contains remote pagination handler
            pg.callback = pg.serverCallback;
            // custom callback function
            if (typeof callback === 'function') pg.callback = callback;

            pg.addPaginateEvent();
            pg.populate();

            pg.meta.page = Math.max(pg.meta.page || 1, pg.meta.page);

            t(datatable).trigger(pg.paginateEvent, pg.meta);

            pg.pagingBreakpoint.call();
            t(window).resize(pg.pagingBreakpoint);
          },
          serverCallback: function(ctx, meta) {
            Plugin.dataRender();
          },
          populate: function() {
            var icons = Plugin.getOption('layout.icons.pagination');
            var title = Plugin.getOption('translate.toolbar.pagination.items.default');
            // pager root element
            pg.pager = t('<div/>').addClass(pfx + 'datatable__pager ' + pfx + 'datatable--paging-loaded');
            // numbering links
            var pagerNumber = t('<ul/>').addClass(pfx + 'datatable__pager-nav');
            pg.pagerLayout['pagination'] = pagerNumber;

            // pager first/previous button
            t('<li/>').
                append(t('<a/>').
                    attr('title', title.first).
                    addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--first').
                    append(t('<i/>').addClass(icons.first)).
                    on('click', pg.gotoMorePage).
                    attr('data-page', 1)).
                appendTo(pagerNumber);
            t('<li/>').
                append(t('<a/>').
                    attr('title', title.prev).
                    addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--prev').
                    append(t('<i/>').addClass(icons.prev)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);

            // more previous pages
            t('<li/>').
                append(t('<a/>').
                    attr('title', title.more).
                    addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--more-prev').
                    html(t('<i/>').addClass(icons.more)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);

            t('<li/>').append(t('<input/>').attr('type', 'text').addClass(pfx + 'pager-input form-control').attr('title', title.input).on('keyup', function() {
              // on keyup update [data-page]
              t(this).attr('data-page', Math.abs(t(this).val()));
            }).on('keypress', function(e) {
              // on keypressed enter button
              if (e.which === 13) pg.gotoMorePage(e);
            })).appendTo(pagerNumber);

            var pagesNumber = Plugin.getOption('toolbar.items.pagination.pages.desktop.pagesNumber');
            var end = Math.ceil(pg.meta.page / pagesNumber) * pagesNumber;
            var start = end - pagesNumber;
            if (end > pg.meta.pages) {
              end = pg.meta.pages;
            }
            for (var x = start; x < end; x++) {
              var pageNumber = x + 1;
              t('<li/>').
                  append(t('<a/>').
                      addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link-number').
                      text(pageNumber).
                      attr('data-page', pageNumber).
                      attr('title', pageNumber).
                      on('click', pg.gotoPage)).
                  appendTo(pagerNumber);
            }

            // more next pages
            t('<li/>').
                append(t('<a/>').
                    attr('title', title.more).
                    addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--more-next').
                    html(t('<i/>').addClass(icons.more)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);

            // pager next/last button
            t('<li/>').
                append(t('<a/>').
                    attr('title', title.next).
                    addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--next').
                    append(t('<i/>').addClass(icons.next)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            t('<li/>').
                append(t('<a/>').
                    attr('title', title.last).
                    addClass(pfx + 'datatable__pager-link ' + pfx + 'datatable__pager-link--last').
                    append(t('<i/>').addClass(icons.last)).
                    on('click', pg.gotoMorePage).
                    attr('data-page', pg.meta.pages)).
                appendTo(pagerNumber);

            // page info
            if (Plugin.getOption('toolbar.items.info')) {
              pg.pagerLayout['info'] = t('<div/>').addClass(pfx + 'datatable__pager-info').append(t('<span/>').addClass(pfx + 'datatable__pager-detail'));
            }

            t.each(Plugin.getOption('toolbar.layout'), function(i, layout) {
              t(pg.pagerLayout[layout]).appendTo(pg.pager);
            });

            // page size select
            var pageSizeSelect = t('<select/>').
                addClass('selectpicker ' + pfx + 'datatable__pager-size').
                attr('title', Plugin.getOption('translate.toolbar.pagination.items.default.select')).
                attr('data-width', '60px').
                val(pg.meta.perpage).
                on('change', pg.updatePerpage).
                prependTo(pg.pagerLayout['info']);

            var pageSizes = Plugin.getOption('toolbar.items.pagination.pageSizeSelect');
            // default value here, to fix override option by user
            if (pageSizes.length == 0) pageSizes = [10, 20, 30, 50, 100];
            t.each(pageSizes, function(i, size) {
              var display = size;
              if (size === -1) display = Plugin.getOption('translate.toolbar.pagination.items.default.all');
              t('<option/>').attr('value', size).html(display).appendTo(pageSizeSelect);
            });

            // init selectpicker to dropdown
            t(datatable).ready(function() {
              t('.selectpicker').
                  selectpicker().
                  on('hide.bs.select', function() {
                    // fix dropup arrow icon on hide
                    t(this).closest('.bootstrap-select').removeClass('dropup');
                  }).
                  siblings('.dropdown-toggle').
                  attr('title', Plugin.getOption('translate.toolbar.pagination.items.default.select'));
            });

            pg.paste();
          },
          paste: function() {
            // insert pagination based on placement position, top|bottom
            t.each(t.unique(Plugin.getOption('toolbar.placement')),
                function(i, position) {
                  if (position === 'bottom') {
                    t(pg.pager).clone(true).insertAfter(datatable.table);
                  }
                  if (position === 'top') {
                    // pager top need some extra space
                    t(pg.pager).clone(true).addClass(pfx + 'datatable__pager--top').insertBefore(datatable.table);
                  }
                });
          },
          gotoMorePage: function(e) {
            e.preventDefault();
            // t(this) is a link of .'+pfx+'datatable__pager-link

            if (t(this).attr('disabled') === 'disabled') return false;

            var page = t(this).attr('data-page');

            // event from text input
            if (typeof page === 'undefined') {
              page = t(e.target).attr('data-page');
            }

            pg.openPage(parseInt(page));
            return false;
          },
          gotoPage: function(e) {
            e.preventDefault();
            // prevent from click same page number
            if (t(this).hasClass(pfx + 'datatable__pager-link--active')) return;

            pg.openPage(parseInt(t(this).data('page')));
          },
          openPage: function(page) {
            // currentPage is 1-based index
            pg.meta.page = parseInt(page);

            t(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.callback(pg, pg.meta);

            // update page callback function
            t(pg.pager).trigger(pfx + 'datatable--on-goto-page', pg.meta);
          },
          updatePerpage: function(e) {
            e.preventDefault();
            // if (Plugin.getOption('layout.height') === null) {
            // fix white space, when perpage is set from many records to less records
            // t('html, body').animate({scrollTop: t(datatable).position().top});
            // }

            pg.pager = t(datatable.table).siblings('.' + pfx + 'datatable__pager').removeClass(pfx + 'datatable--paging-loaded');

            // on change select page size
            if (e.originalEvent) {
              pg.meta.perpage = parseInt(t(this).val());
            }

            t(pg.pager).find('select.' + pfx + 'datatable__pager-size').val(pg.meta.perpage).attr('data-selected', pg.meta.perpage);

            // update datasource params
            Plugin.setDataSourceParam('pagination', {
              page: pg.meta.page,
              pages: pg.meta.pages,
              perpage: pg.meta.perpage,
              total: pg.meta.total,
            });

            // update page callback function
            t(pg.pager).trigger(pfx + 'datatable--on-update-perpage', pg.meta);
            t(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.callback(pg, pg.meta);

            // update pagination info
            pg.updateInfo.call();
          },
          addPaginateEvent: function(e) {
            // pagination event
            t(datatable).off(pg.paginateEvent).on(pg.paginateEvent, function(e, meta) {
              Plugin.spinnerCallback(true);

              pg.pager = t(datatable.table).siblings('.' + pfx + 'datatable__pager');
              var pagerNumber = t(pg.pager).find('.' + pfx + 'datatable__pager-nav');

              // set sync active page class
              t(pagerNumber).find('.' + pfx + 'datatable__pager-link--active').removeClass(pfx + 'datatable__pager-link--active');
              t(pagerNumber).find('.' + pfx + 'datatable__pager-link-number[data-page="' + meta.page + '"]').addClass(pfx + 'datatable__pager-link--active');

              // set next and previous link page number
              t(pagerNumber).find('.' + pfx + 'datatable__pager-link--prev').attr('data-page', Math.max(meta.page - 1, 1));
              t(pagerNumber).find('.' + pfx + 'datatable__pager-link--next').attr('data-page', Math.min(meta.page + 1, meta.pages));

              // current page input value sync
              t(pg.pager).each(function() {
                t(this).find('.' + pfx + 'pager-input[type="text"]').prop('value', meta.page);
              });

              t(pg.pager).find('.' + pfx + 'datatable__pager-nav').show();
              if (meta.pages <= 1) {
                // hide pager if has 1 page
                t(pg.pager).find('.' + pfx + 'datatable__pager-nav').hide();
              }

              // update datasource params
              Plugin.setDataSourceParam('pagination', {
                page: pg.meta.page,
                pages: pg.meta.pages,
                perpage: pg.meta.perpage,
                total: pg.meta.total,
              });

              t(pg.pager).find('select.' + pfx + 'datatable__pager-size').val(meta.perpage).attr('data-selected', meta.perpage);

              // clear active rows
              t(datatable.table).find('.' + pfx + 'checkbox > [type="checkbox"]').prop('checked', false);
              t(datatable.table).find('.' + pfx + 'datatable__row--active').removeClass(pfx + 'datatable__row--active');

              pg.updateInfo.call();
              pg.pagingBreakpoint.call();
              // Plugin.resetScroll();
            });
          },
          updateInfo: function() {
            var start = Math.max(pg.meta.perpage * (pg.meta.page - 1) + 1, 1);
            var end = Math.min(start + pg.meta.perpage - 1, pg.meta.total);
            // page info update
            t(pg.pager).find('.' + pfx + 'datatable__pager-info').find('.' + pfx + 'datatable__pager-detail').html(Plugin.dataPlaceholder(
                Plugin.getOption('translate.toolbar.pagination.items.info'), {
                  start: start,
                  end: pg.meta.perpage === -1 ? pg.meta.total : end,
                  pageSize: pg.meta.perpage === -1 ||
                  pg.meta.perpage >= pg.meta.total
                      ? pg.meta.total
                      : pg.meta.perpage,
                  total: pg.meta.total,
                }));
          },

          /**
           * Update pagination layout breakpoint
           */
          pagingBreakpoint: function() {
            // keep page links reference
            var pagerNumber = t(datatable.table).siblings('.' + pfx + 'datatable__pager').find('.' + pfx + 'datatable__pager-nav');
            if (t(pagerNumber).length === 0) return;

            var currentPage = Plugin.getCurrentPage();
            var pagerInput = t(pagerNumber).find('.' + pfx + 'pager-input').closest('li');

            // reset
            t(pagerNumber).find('li').show();

            // pagination update
            t.each(Plugin.getOption('toolbar.items.pagination.pages'),
                function(mode, option) {
                  if (util.isInResponsiveRange(mode)) {
                    switch (mode) {
                      case 'desktop':
                      case 'tablet':
                        var end = Math.ceil(currentPage / option.pagesNumber) *
                            option.pagesNumber;
                        var start = end - option.pagesNumber;
                        t(pagerInput).hide();
                        pg.meta = Plugin.getDataSourceParam('pagination');
                        pg.paginationUpdate();
                        break;

                      case 'mobile':
                        t(pagerInput).show();
                        t(pagerNumber).find('.' + pfx + 'datatable__pager-link--more-prev').closest('li').hide();
                        t(pagerNumber).find('.' + pfx + 'datatable__pager-link--more-next').closest('li').hide();
                        t(pagerNumber).find('.' + pfx + 'datatable__pager-link-number').closest('li').hide();
                        break;
                    }

                    return false;
                  }
                });
          },

          /**
           * Update pagination number and button display
           */
          paginationUpdate: function() {
            var pager = t(datatable.table).siblings('.' + pfx + 'datatable__pager').find('.' + pfx + 'datatable__pager-nav'),
                pagerMorePrev = t(pager).find('.' + pfx + 'datatable__pager-link--more-prev'),
                pagerMoreNext = t(pager).find('.' + pfx + 'datatable__pager-link--more-next'),
                pagerFirst = t(pager).find('.' + pfx + 'datatable__pager-link--first'),
                pagerPrev = t(pager).find('.' + pfx + 'datatable__pager-link--prev'),
                pagerNext = t(pager).find('.' + pfx + 'datatable__pager-link--next'),
                pagerLast = t(pager).find('.' + pfx + 'datatable__pager-link--last');

            // get visible page
            var pagerNumber = t(pager).find('.' + pfx + 'datatable__pager-link-number');
            // get page before of first visible
            var morePrevPage = Math.max(t(pagerNumber).first().data('page') - 1,
                1);
            t(pagerMorePrev).each(function(i, prev) {
              t(prev).attr('data-page', morePrevPage);
            });
            // show/hide <li>
            if (morePrevPage === 1) {
              t(pagerMorePrev).parent().hide();
            } else {
              t(pagerMorePrev).parent().show();
            }

            // get page after of last visible
            var moreNextPage = Math.min(t(pagerNumber).last().data('page') + 1,
                pg.meta.pages);
            t(pagerMoreNext).each(function(i, prev) {
              t(pagerMoreNext).attr('data-page', moreNextPage).show();
            });

            // show/hide <li>
            if (moreNextPage === pg.meta.pages
                // missing dot fix when last hidden page is one left
                && moreNextPage === t(pagerNumber).last().data('page')) {
              t(pagerMoreNext).parent().hide();
            } else {
              t(pagerMoreNext).parent().show();
            }

            // begin/end of pages
            if (pg.meta.page === 1) {
              t(pagerFirst).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
              t(pagerPrev).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
            } else {
              t(pagerFirst).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
              t(pagerPrev).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
            }
            if (pg.meta.page === pg.meta.pages) {
              t(pagerNext).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
              t(pagerLast).attr('disabled', true).addClass(pfx + 'datatable__pager-link--disabled');
            } else {
              t(pagerNext).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
              t(pagerLast).removeAttr('disabled').removeClass(pfx + 'datatable__pager-link--disabled');
            }

            // display more buttons
            var nav = Plugin.getOption('toolbar.items.pagination.navigation');
            if (!nav.first) t(pagerFirst).remove();
            if (!nav.prev) t(pagerPrev).remove();
            if (!nav.next) t(pagerNext).remove();
            if (!nav.last) t(pagerLast).remove();
          },
        };
        pg.init(meta);
        return pg;
      },

      /**
       * Hide/show table cell defined by
       * options[columns][i][responsive][visible/hidden]
       */
      columnHide: function() {
        var screen = util.getViewPort().width;
        // foreach columns setting
        t.each(options.columns, function(i, column) {
          if (typeof column.responsive !== 'undefined') {
            var field = column.field;
            var tds = t.grep(t(datatable.table).find('.' + pfx + 'datatable__cell'), function(n, i) {
              return field === t(n).data('field');
            });
            if (util.getBreakpoint(column.responsive.hidden) >= screen) {
              t(tds).hide();
            } else {
              t(tds).show();
            }
            if (util.getBreakpoint(column.responsive.visible) <= screen) {
              t(tds).show();
            } else {
              t(tds).hide();
            }
          }
        });
      },

      /**
       * Setup sub datatable
       */
      setupSubDatatable: function() {
        var subTableCallback = Plugin.getOption('detail.content');
        if (typeof subTableCallback !== 'function') return;

        // subtable already exist
        if (t(datatable.table).find('.' + pfx + 'datatable__subtable').length > 0) return;

        t(datatable.wrap).addClass(pfx + 'datatable--subtable');

        options.columns[0]['subtable'] = true;

        // toggle on open sub table
        var toggleSubTable = function(e) {
          e.preventDefault();
          // get parent row of this subtable
          var parentRow = t(this).closest('.' + pfx + 'datatable__row');

          // get subtable row for sub table
          var subTableRow = t(parentRow).next('.' + pfx + 'datatable__row-subtable');
          if (t(subTableRow).length === 0) {
            // prepare DOM for sub table, each <tr> as parent and add <tr> as child table
            subTableRow = t('<tr/>').
                addClass(pfx + 'datatable__row-subtable ' + pfx + 'datatable__row-loading').
                hide().
                append(t('<td/>').addClass(pfx + 'datatable__subtable').attr('colspan', Plugin.getTotalColumns()));
            t(parentRow).after(subTableRow);
            // add class to even row
            if (t(parentRow).hasClass(pfx + 'datatable__row--even')) {
              t(subTableRow).addClass(pfx + 'datatable__row-subtable--even');
            }
          }

          t(subTableRow).toggle();

          var subTable = t(subTableRow).find('.' + pfx + 'datatable__subtable');

          // get id from first column of parent row
          var primaryKey = t(this).closest('[data-field]:first-child').find('.' + pfx + 'datatable__toggle-subtable').data('value');

          var icon = t(this).find('i').removeAttr('class');

          // prevent duplicate datatable init
          if (t(parentRow).hasClass(pfx + 'datatable__row--subtable-expanded')) {
            t(icon).addClass(Plugin.getOption('layout.icons.rowDetail.collapse'));
            // remove expand class from parent row
            t(parentRow).removeClass(pfx + 'datatable__row--subtable-expanded');
            // trigger event on collapse
            t(datatable).trigger(pfx + 'datatable--on-collapse-subtable', [parentRow]);
          } else {
            // expand and run callback function
            t(icon).addClass(Plugin.getOption('layout.icons.rowDetail.expand'));
            // add expand class to parent row
            t(parentRow).addClass(pfx + 'datatable__row--subtable-expanded');
            // trigger event on expand
            t(datatable).trigger(pfx + 'datatable--on-expand-subtable', [parentRow]);
          }

          // prevent duplicate datatable init
          if (t(subTable).find('.' + pfx + 'datatable').length === 0) {
            // get data by primary id
            t.map(datatable.dataSet, function(n, i) {
              // primary id must be at the first column, otherwise e.data will be undefined
              if (primaryKey === n[options.columns[0].field]) {
                e.data = n;
                return true;
              }
              return false;
            });

            // deprecated in v5.0.6
            e.detailCell = subTable;

            e.parentRow = parentRow;
            e.subTable = subTable;

            // run callback with event
            subTableCallback(e);

            t(subTable).children('.' + pfx + 'datatable').on(pfx + 'datatable--on-init', function(e) {
              t(subTableRow).removeClass(pfx + 'datatable__row-loading');
            });
            if (Plugin.getOption('data.type') === 'local') {
              t(subTableRow).removeClass(pfx + 'datatable__row-loading');
            }
          }
        };

        var columns = options.columns;
        t(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function(tri, tr) {
          t(tr).find('.' + pfx + 'datatable__cell').each(function(tdi, td) {
            // get column settings by field
            var column = t.grep(columns, function(n, i) {
              return t(td).data('field') === n.field;
            })[0];
            if (typeof column !== 'undefined') {
              var value = t(td).text();
              // enable column subtable toggle
              if (typeof column.subtable !== 'undefined' && column.subtable) {
                // check if subtable toggle exist
                if (t(td).find('.' + pfx + 'datatable__toggle-subtable').length > 0) return;
                // append subtable toggle
                t(td).
                    html(t('<a/>').
                        addClass(pfx + 'datatable__toggle-subtable').
                        attr('href', '#').
                        attr('data-value', value).
                        attr('title', Plugin.getOption('detail.title')).
                        on('click', toggleSubTable).
                        append(t('<i/>').css('width', t(td).data('width')).addClass(Plugin.getOption('layout.icons.rowDetail.collapse'))));
              }
            }
          });
        });

        // t(datatable.tableHead).find('.'+pfx+'-datatable__row').first()
      },

      /**
       * Datasource mapping callback
       */
      dataMapCallback: function(raw) {
        // static dataset array
        var dataSet = raw;
        // dataset mapping callback
        if (typeof Plugin.getOption('data.source.read.map') === 'function') {
          return Plugin.getOption('data.source.read.map')(raw);
        } else {
          // default data mapping fallback
          if (typeof raw !== 'undefined' && typeof raw.data !== 'undefined') {
            dataSet = raw.data;
          }
        }
        return dataSet;
      },

      isSpinning: false,
      /**
       * BlockUI spinner callback
       * @param block
       * @param target
       */
      spinnerCallback: function(block, target) {
        if (typeof target === 'undefined') target = datatable;
        // get spinner options
        var spinnerOptions = Plugin.getOption('layout.spinner');
        // spinner is disabled
        if (typeof spinnerOptions === 'undefined' || !spinnerOptions) {
          return;
        }
        if (block) {
          if (!Plugin.isSpinning) {
            if (typeof spinnerOptions.message !== 'undefined' && spinnerOptions.message === true) {
              // use default spinner message from translation
              spinnerOptions.message = Plugin.getOption('translate.records.processing');
            }
            Plugin.isSpinning = true;
            if (typeof app !== 'undefined') {
              app.block(target, spinnerOptions);
            }
          }
        } else {
          Plugin.isSpinning = false;
          if (typeof app !== 'undefined') {
            app.unblock(target);
          }
        }
      },

      /**
       * Default sort callback function
       * @param data
       * @param sort
       * @param column
       * @returns {*|Array.<T>|{sort, field}|{asc, desc}}
       */
      sortCallback: function(data, sort, column) {
        var type = column['type'] || 'string';
        var format = column['format'] || '';
        var field = column['field'];

        return t(data).sort(function(a, b) {
          var aField = a[field];
          var bField = b[field];

          switch (type) {
            case 'date':
              if (typeof moment === 'undefined') {
                throw new Error('Moment.js is required.');
              }
              var diff = moment(aField, format).diff(moment(bField, format));
              if (sort === 'asc') {
                return diff > 0 ? 1 : diff < 0 ? -1 : 0;
              } else {
                return diff < 0 ? 1 : diff > 0 ? -1 : 0;
              }
              break;

            case 'number':
              if (isNaN(parseFloat(aField)) && aField != null) {
                aField = Number(aField.replace(/[^0-9\.-]+/g, ''));
              }
              if (isNaN(parseFloat(bField)) && bField != null) {
                bField = Number(bField.replace(/[^0-9\.-]+/g, ''));
              }
              aField = parseFloat(aField);
              bField = parseFloat(bField);
              if (sort === 'asc') {
                return aField > bField ? 1 : aField < bField ? -1 : 0;
              } else {
                return aField < bField ? 1 : aField > bField ? -1 : 0;
              }
              break;

            case 'string':
            default:
              if (sort === 'asc') {
                return aField > bField ? 1 : aField < bField ? -1 : 0;
              } else {
                return aField < bField ? 1 : aField > bField ? -1 : 0;
              }
              break;
          }
        });
      },

      /**
       * Custom debug log
       * @param text
       * @param obj
       */
      log: function(text, obj) {
        if (typeof obj === 'undefined') obj = '';
        if (datatable.debug) {
          console.log(text, obj);
        }
      },

      /**
       * Auto hide columnds overflow in row
       */
      autoHide: function() {
        var hiddenExist = false;
        // force hide enabled
        var hidDefault = t(datatable.table).find('[data-autohide-enabled]');
        if (hidDefault.length) {
          hiddenExist = true;
          hidDefault.hide();
        }

        var toggleHiddenColumns = function(e) {
          e.preventDefault();

          var row = t(this).closest('.' + pfx + 'datatable__row');
          var detailRow = t(row).next();

          if (!t(detailRow).hasClass(pfx + 'datatable__row-detail')) {
            t(this).find('i').removeClass(Plugin.getOption('layout.icons.rowDetail.collapse')).addClass(Plugin.getOption('layout.icons.rowDetail.expand'));

            var hiddenCells = t(row).find('.' + pfx + 'datatable__cell:hidden');
            var clonedCells = hiddenCells.clone().show();

            detailRow = t('<tr/>').addClass(pfx + 'datatable__row-detail').insertAfter(row);
            var detailRowTd = t('<td/>').addClass(pfx + 'datatable__detail').attr('colspan', Plugin.getTotalColumns()).appendTo(detailRow);

            var detailSubTable = t('<table/>');
            t(clonedCells).each(function() {
              var field = t(this).data('field');
              var column = t.grep(options.columns, function(n, i) {
                return field === n.field;
              })[0];
              t(detailSubTable).
                  append(t('<tr class="' + pfx + 'datatable__row"></tr>').
                      append(t('<td class="' + pfx + 'datatable__cell"></td>').append(t('<span/>').append(column.title))).
                      append(this));
            });
            t(detailRowTd).append(detailSubTable);

          } else {
            t(this).find('i').removeClass(Plugin.getOption('layout.icons.rowDetail.expand')).addClass(Plugin.getOption('layout.icons.rowDetail.collapse'));
            t(detailRow).remove();
          }
        };

        setTimeout(function () {
          t(datatable.table).find('.' + pfx + 'datatable__cell').show();
          t(datatable.tableBody).each(function() {
            var recursive = 0;
            while (t(this)[0].offsetWidth < t(this)[0].scrollWidth && recursive < options.columns.length) {
              t(datatable.table).find('.' + pfx + 'datatable__row').each(function(i) {
                var cell = t(this).find('.' + pfx + 'datatable__cell:not(:hidden):not([data-autohide-disabled])').last();
                t(cell).hide();
                hiddenExist = true;
              });
              recursive++;
            }
          });

          if (hiddenExist) {
            // toggle show hidden columns
            t(datatable.tableBody).find('.' + pfx + 'datatable__row').each(function() {
              // if no toggle yet
              if(t(this).find('.' + pfx + 'datatable__toggle-detail').length === 0) {
                // add toggle
                t(this).prepend(t('<td/>').
                    addClass(pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail').
                    append(t('<a/>').
                        addClass(pfx + 'datatable__toggle-detail').
                        attr('href', '').
                        on('click', toggleHiddenColumns).
                        append('<i class="' + Plugin.getOption('layout.icons.rowDetail.collapse') + '"></i>')));
              }

              // check if subtable toggle exist
              if (t(datatable.tableHead).find('.' + pfx + 'datatable__toggle-detail').length === 0) {
                // add empty column to the header and footer
                t(datatable.tableHead).
                    find('.' + pfx + 'datatable__row').
                    first().
                    prepend('<th class="' + pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail"><span></span></th>');
                t(datatable.tableFoot).
                    find('.' + pfx + 'datatable__row').
                    first().
                    prepend('<th class="' + pfx + 'datatable__cell ' + pfx + 'datatable__toggle-detail"><span></span></th>');
              } else {
                t(datatable.tableHead).find('.' + pfx + 'datatable__toggle-detail').find('span');
              }
            });
          }
        });

        Plugin.adjustCellsWidth.call();
      },

      /**
       * To enable auto columns features for remote data source
       */
      setAutoColumns: function() {
        if (Plugin.getOption('data.autoColumns')) {
          t.each(datatable.dataSet[0], function(k, v) {
            var found = t.grep(options.columns, function(n, i) {
              return k === n.field;
            });
            if (found.length === 0) {
              options.columns.push({field: k, title: k});
            }
          });
          t(datatable.tableHead).find('.' + pfx + 'datatable__row').remove();
          Plugin.setHeadTitle();
          if (Plugin.getOption('layout.footer')) {
            t(datatable.tableFoot).find('.' + pfx + 'datatable__row').remove();
            Plugin.setHeadTitle(datatable.tableFoot);
          }
        }
      },

      /********************
       ** HELPERS
       ********************/

      /**
       * Check if table is a locked colums table
       */
      isLocked: function() {
        var isLocked = Plugin.lockEnabledColumns();
        return isLocked.left.length > 0 || isLocked.right.length > 0;
      },

      isSubtable: function() {
        return util.hasClass(datatable.wrap[0], pfx + 'datatable--subtable') || false;
      },

      /**
       * Get total extra space of an element for width calculation,
       * including padding, margin, border
       * @param element
       * @returns {number}
       */
      getExtraSpace: function(element) {
        var padding = parseInt(t(element).css('paddingRight')) +
            parseInt(t(element).css('paddingLeft'));
        var margin = parseInt(t(element).css('marginRight')) +
            parseInt(t(element).css('marginLeft'));
        var border = Math.ceil(
            t(element).css('border-right-width').replace('px', ''));
        return padding + margin + border;
      },

      /**
       * Insert data of array into {{ }} template placeholder
       * @param template
       * @param data
       * @returns {*}
       */
      dataPlaceholder: function(template, data) {
        var result = template;
        t.each(data, function(key, val) {
          result = result.replace('{{' + key + '}}', val);
        });
        return result;
      },

      /**
       * Get table unique ID
       * Note: table unique change each time refreshed
       * @param suffix
       * @returns {*}
       */
      getTableId: function(suffix) {
        if (typeof suffix === 'undefined') suffix = '';
        var id = t(datatable).attr('id');
        if (typeof id === 'undefined') {
          id = t(datatable).attr('class').split(' ')[0];
        }
        return id + suffix;
      },

      /**
       * Get table prefix with depth number
       */
      getTablePrefix: function(suffix) {
        if (typeof suffix !== 'undefined') suffix = '-' + suffix;
        return Plugin.getTableId() + '-' + Plugin.getDepth() + suffix;
      },

      /**
       * Get current table depth of sub table
       * @returns {number}
       */
      getDepth: function() {
        var depth = 0;
        var table = datatable.table;
        do {
          table = t(table).parents('.' + pfx + 'datatable__table');
          depth++;
        } while (t(table).length > 0);
        return depth;
      },

      /**
       * Keep state item
       * @param key
       * @param value
       */
      stateKeep: function(key, value) {
        key = Plugin.getTablePrefix(key);
        if (Plugin.getOption('data.saveState') === false) return;
        if (Plugin.getOption('data.saveState.webstorage') && localStorage) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        if (Plugin.getOption('data.saveState.cookie')) {
          Cookies.set(key, JSON.stringify(value));
        }
      },

      /**
       * Get state item
       * @param key
       * @param defValue
       */
      stateGet: function(key, defValue) {
        key = Plugin.getTablePrefix(key);
        if (Plugin.getOption('data.saveState') === false) return;
        var value = null;
        if (Plugin.getOption('data.saveState.webstorage') && localStorage) {
          value = localStorage.getItem(key);
        } else {
          value = Cookies.get(key);
        }
        if (typeof value !== 'undefined' && value !== null) {
          return JSON.parse(value);
        }
      },

      /**
       * Update data in state without clear existing
       * @param key
       * @param value
       */
      stateUpdate: function(key, value) {
        var ori = Plugin.stateGet(key);
        if (typeof ori === 'undefined' || ori === null) ori = {};
        Plugin.stateKeep(key, t.extend({}, ori, value));
      },

      /**
       * Remove state item
       * @param key
       */
      stateRemove: function(key) {
        key = Plugin.getTablePrefix(key);
        if (localStorage) {
          localStorage.removeItem(key);
        }
        Cookies.remove(key);
      },

      /**
       * Get total columns.
       */
      getTotalColumns: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        return t(tablePart).find('.' + pfx + 'datatable__row').first().find('.' + pfx + 'datatable__cell').length;
      },

      /**
       * Get table row. Useful to get row when current table is in lock
       * mode. Can be used for both lock and normal table mode. By
       * default, returning result will be in a list of <td>.
       * @param tablePart
       * @param row 1-based index
       * @param tdOnly Optional. Default true
       * @returns {*}
       */
      getOneRow: function(tablePart, row, tdOnly) {
        if (typeof tdOnly === 'undefined') tdOnly = true;
        // get list of <tr>
        var result = t(tablePart).find('.' + pfx + 'datatable__row:not(.' + pfx + 'datatable__row-detail):nth-child(' + row + ')');
        if (tdOnly) {
          // get list of <td> or <th>
          result = result.find('.' + pfx + 'datatable__cell');
        }
        return result;
      },

      /**
       * Sort table row at HTML level by column index.
       * todo; Not in use.
       * @param header Header sort clicked
       * @param sort asc|desc. Optional. Default asc
       * @param int Boolean. Optional. Comparison value parse to integer.
       *     Default false
       */
      sortColumn: function(header, sort, int) {
        if (typeof sort === 'undefined') sort = 'asc'; // desc
        if (typeof int === 'undefined') int = false;

        var column = t(header).index();
        var rows = t(datatable.tableBody).find('.' + pfx + 'datatable__row');
        var hIndex = t(header).closest('.' + pfx + 'datatable__lock').index();
        if (hIndex !== -1) {
          rows = t(datatable.tableBody).find('.' + pfx + 'datatable__lock:nth-child(' + (hIndex + 1) + ')').find('.' + pfx + 'datatable__row');
        }

        var container = t(rows).parent();
        t(rows).sort(function(a, b) {
          var tda = t(a).find('td:nth-child(' + column + ')').text();
          var tdb = t(b).find('td:nth-child(' + column + ')').text();

          if (int) {
            // useful for integer type sorting
            tda = parseInt(tda);
            tdb = parseInt(tdb);
          }

          if (sort === 'asc') {
            return tda > tdb ? 1 : tda < tdb ? -1 : 0;
          } else {
            return tda < tdb ? 1 : tda > tdb ? -1 : 0;
          }
        }).appendTo(container);
      },

      /**
       * Perform sort remote and local
       */
      sorting: function() {
        var sortObj = {
          init: function() {
            if (options.sortable) {
              t(datatable.tableHead).
                  find('.' + pfx + 'datatable__cell:not(.' + pfx + 'datatable__cell--check)').
                  addClass(pfx + 'datatable__cell--sort').
                  off('click').
                  on('click', sortObj.sortClick);
              // first init
              sortObj.setIcon();
            }
          },
          setIcon: function() {
            var meta = Plugin.getDataSourceParam('sort');
            if (t.isEmptyObject(meta)) return;

            var column = Plugin.getColumnByField(meta.field);
            // sort is disabled for this column
            if (typeof column !== 'undefined' && typeof column.sortable !== 'undefined' && column.sortable === false) return;

            // sort icon beside column header
            var td = t(datatable.tableHead).find('.' + pfx + 'datatable__cell[data-field="' + meta.field + '"]').attr('data-sort', meta.sort);
            var sorting = t(td).find('span');
            var icon = t(sorting).find('i');

            var icons = Plugin.getOption('layout.icons.sort');
            // update sort icon; desc & asc
            if (t(icon).length > 0) {
              t(icon).removeAttr('class').addClass(icons[meta.sort]);
            } else {
              t(sorting).append(t('<i/>').addClass(icons[meta.sort]));
            }

            // set sorted class to header on init
            t(td).addClass(pfx + 'datatable__cell--sorted');
          },
          sortClick: function(e) {
            var meta = Plugin.getDataSourceParam('sort');
            var field = t(this).data('field');
            var column = Plugin.getColumnByField(field);
            // sort is disabled for this column
            if (typeof column.sortable !== 'undefined' && column.sortable === false) return;

            // set sorted class to header
            t(datatable.tableHead).find('th').removeClass(pfx + 'datatable__cell--sorted');
            util.addClass(this, pfx + 'datatable__cell--sorted');

            t(datatable.tableHead).find('.' + pfx + 'datatable__cell > span > i').remove();

            if (options.sortable) {
              Plugin.spinnerCallback(true);

              var sort = 'desc';
              if (Plugin.getObject('field', meta) === field) {
                sort = Plugin.getObject('sort', meta);
              }

              // toggle sort
              sort = typeof sort === 'undefined' || sort === 'desc'
                  ? 'asc'
                  : 'desc';

              // update field and sort params
              meta = {field: field, sort: sort};
              Plugin.setDataSourceParam('sort', meta);

              sortObj.setIcon();

              setTimeout(function() {
                Plugin.dataRender('sort');
                t(datatable).trigger(pfx + 'datatable--on-sort', meta);
              }, 300);
            }
          },
        };
        sortObj.init();
      },

      /**
       * Update JSON data list linked with sort, filter and pagination.
       * Call this method, before using dataSet variable.
       * @returns {*|null}
       */
      localDataUpdate: function() {
        var params = Plugin.getDataSourceParam();
        if (typeof datatable.originalDataSet === 'undefined') {
          datatable.originalDataSet = datatable.dataSet;
        }

        var field = Plugin.getObject('sort.field', params);
        var sort = Plugin.getObject('sort.sort', params);
        var column = Plugin.getColumnByField(field);
        if (typeof column !== 'undefined' && Plugin.getOption('data.serverSorting') !== true) {
          if (typeof column.sortCallback === 'function') {
            datatable.dataSet = column.sortCallback(datatable.originalDataSet, sort, column);
          } else {
            datatable.dataSet = Plugin.sortCallback(datatable.originalDataSet, sort, column);
          }
        } else {
          datatable.dataSet = datatable.originalDataSet;
        }

        // if server filter enable, don't pass local filter
        if (typeof params.query === 'object' && !Plugin.getOption('data.serverFiltering')) {
          params.query = params.query || {};

          var nestedSearch = function(obj) {
            for (var field in obj) {
              if (!obj.hasOwnProperty(field)) continue;
              if (typeof obj[field] === 'string') {
                if (obj[field].toLowerCase() == search || obj[field].toLowerCase().indexOf(search) !== -1) {
                  return true;
                }
              } else if (typeof obj[field] === 'number') {
                if (obj[field] === search) {
                  return true;
                }
              } else if (typeof obj[field] === 'object') {
                if (nestedSearch(obj[field])) {
                  return true;
                }
              }
            }
            return false;
          };

          var search = t(Plugin.getOption('search.input')).val();
          if (typeof search !== 'undefined' && search !== '') {
            search = search.toLowerCase();
            datatable.dataSet = t.grep(datatable.dataSet, nestedSearch);
            // remove generalSearch as we don't need this for next columns filter
            delete params.query[Plugin.getGeneralSearchKey()];
          }

          // remove empty element from array
          t.each(params.query, function(k, v) {
            if (v === '') {
              delete params.query[k];
            }
          });

          // filter array by query
          datatable.dataSet = Plugin.filterArray(datatable.dataSet, params.query);

          // reset array index
          datatable.dataSet = datatable.dataSet.filter(function() {
            return true;
          });
        }

        return datatable.dataSet;
      },

      /**
       * Utility helper to filter array by object pair of {key:value}
       * @param list
       * @param args
       * @param operator
       * @returns {*}
       */
      filterArray: function(list, args, operator) {
        if (typeof list !== 'object') {
          return [];
        }

        if (typeof operator === 'undefined') operator = 'AND';

        if (typeof args !== 'object') {
          return list;
        }

        operator = operator.toUpperCase();

        if (t.inArray(operator, ['AND', 'OR', 'NOT']) === -1) {
          return [];
        }

        var count = Object.keys(args).length;
        var filtered = [];

        t.each(list, function(key, obj) {
          var to_match = obj;

          var matched = 0;
          t.each(args, function(m_key, m_value) {
            m_value = m_value instanceof Array ? m_value : [m_value];
            var match_property = Plugin.getObject(m_key, to_match);
            if (typeof match_property !== 'undefined' && match_property) {
              var lhs = match_property.toString().toLowerCase();
              m_value.forEach(function(item, index) {
                if (item.toString().toLowerCase() == lhs || lhs.indexOf(item.toString().toLowerCase()) !== -1) {
                  matched++;
                }
              });
            }
          });

          if (('AND' == operator && matched == count) ||
              ('OR' == operator && matched > 0) ||
              ('NOT' == operator && 0 == matched)) {
            filtered[key] = obj;
          }
        });

        list = filtered;

        return list;
      },

      /**
       * Reset lock column scroll to 0 when resize
       */
      resetScroll: function() {
        if (typeof options.detail === 'undefined' && Plugin.getDepth() === 1) {
          t(datatable.table).find('.' + pfx + 'datatable__row').css('left', 0);
          t(datatable.table).find('.' + pfx + 'datatable__lock').css('top', 0);
          t(datatable.tableBody).scrollTop(0);
        }
      },

      /**
       * Get column options by field
       * @param field
       * @returns {boolean}
       */
      getColumnByField: function(field) {
        if (typeof field === 'undefined') return;
        var result;
        t.each(options.columns, function(i, column) {
          if (field === column.field) {
            result = column;
            return false;
          }
        });
        return result;
      },

      /**
       * Get default sort column
       */
      getDefaultSortColumn: function() {
        var result;
        t.each(options.columns, function(i, column) {
          if (typeof column.sortable !== 'undefined'
              && t.inArray(column.sortable, ['asc', 'desc']) !== -1) {
            result = {sort: column.sortable, field: column.field};
            return false;
          }
        });
        return result;
      },

      /**
       * Helper to get element dimensions, when the element is hidden
       * @param element
       * @param includeMargin
       * @returns {{width: number, height: number, innerWidth: number,
       *     innerHeight: number, outerWidth: number, outerHeight:
       *     number}}
       */
      getHiddenDimensions: function(element, includeMargin) {
        var props = {
              position: 'absolute',
              visibility: 'hidden',
              display: 'block',
            },
            dim = {
              width: 0,
              height: 0,
              innerWidth: 0,
              innerHeight: 0,
              outerWidth: 0,
              outerHeight: 0,
            },
            hiddenParents = t(element).parents().addBack().not(':visible');
        includeMargin = (typeof includeMargin === 'boolean')
            ? includeMargin
            : false;

        var oldProps = [];
        hiddenParents.each(function() {
          var old = {};

          for (var name in props) {
            old[name] = this.style[name];
            this.style[name] = props[name];
          }

          oldProps.push(old);
        });

        dim.width = t(element).width();
        dim.outerWidth = t(element).outerWidth(includeMargin);
        dim.innerWidth = t(element).innerWidth();
        dim.height = t(element).height();
        dim.innerHeight = t(element).innerHeight();
        dim.outerHeight = t(element).outerHeight(includeMargin);

        hiddenParents.each(function(i) {
          var old = oldProps[i];
          for (var name in props) {
            this.style[name] = old[name];
          }
        });

        return dim;
      },

      getGeneralSearchKey: function() {
        var searchInput = t(Plugin.getOption('search.input'));
        return t(searchInput).prop('name') || t(searchInput).prop('id');
      },

      /**
       * Get value by dot notation path string and to prevent undefined
       * errors
       * @param path String Dot notation path in string
       * @param object Object to iterate
       * @returns {*}
       */
      getObject: function(path, object) {
        return path.split('.').reduce(function(obj, i) {
          return obj !== null && typeof obj[i] !== 'undefined' ? obj[i] : null;
        }, object);
      },

      /**
       * Extend object
       * @param obj
       * @param path
       * @param value
       * @returns {*}
       */
      extendObj: function(obj, path, value) {
        var levels = path.split('.'),
            i = 0;

        function createLevel(child) {
          var name = levels[i++];
          if (typeof child[name] !== 'undefined' && child[name] !== null) {
            if (typeof child[name] !== 'object' &&
                typeof child[name] !== 'function') {
              child[name] = {};
            }
          } else {
            child[name] = {};
          }
          if (i === levels.length) {
            child[name] = value;
          } else {
            createLevel(child[name]);
          }
        }

        createLevel(obj);
        return obj;
      },

      rowEvenOdd: function() {
        // row even class
        t(datatable.tableBody).find('.' + pfx + 'datatable__row').removeClass(pfx + 'datatable__row--even');
        if (t(datatable.wrap).hasClass(pfx + 'datatable--subtable')) {
          t(datatable.tableBody).find('.' + pfx + 'datatable__row:not(.' + pfx + 'datatable__row-detail):even').addClass(pfx + 'datatable__row--even');
        } else {
          t(datatable.tableBody).find('.' + pfx + 'datatable__row:nth-child(even)').addClass(pfx + 'datatable__row--even');
        }
      },

      /********************
       ** PUBLIC API METHODS
       ********************/

      // delay timer
      timer: 0,

      /**
       * Redraw datatable by recalculating its DOM elements, etc.
       * @returns {jQuery}
       */
      redraw: function() {
        Plugin.adjustCellsWidth.call();
        if (Plugin.isLocked()) {
          // fix hiding cell width issue
          Plugin.scrollbar();
          Plugin.resetScroll();
          Plugin.adjustCellsHeight.call();
        }
        Plugin.adjustLockContainer.call();
        Plugin.initHeight.call();
        return datatable;
      },

      /**
       * Shortcode to reload
       * @returns {jQuery}
       */
      load: function() {
        Plugin.reload();
        return datatable;
      },

      /**
       * Datasource reload
       * @returns {jQuery}
       */
      reload: function() {
        var delay = (function() {
          return function(callback, ms) {
            clearTimeout(Plugin.timer);
            Plugin.timer = setTimeout(callback, ms);
          };
        })();
        delay(function() {
          // local only. remote pagination will skip this block
          if (!options.data.serverFiltering) {
            Plugin.localDataUpdate();
          }
          Plugin.dataRender();
          t(datatable).trigger(pfx + 'datatable--on-reloaded');
        }, Plugin.getOption('search.delay'));
        return datatable;
      },

      /**
       * Get record by record ID
       * @param id
       * @returns {jQuery}
       */
      getRecord: function(id) {
        if (typeof datatable.tableBody === 'undefined') datatable.tableBody = t(datatable.table).children('tbody');
        t(datatable.tableBody).find('.' + pfx + 'datatable__cell:first-child').each(function(i, cell) {
          if (id == t(cell).text()) {
            var rowNumber = t(cell).closest('.' + pfx + 'datatable__row').index() + 1;
            datatable.API.record = datatable.API.value = Plugin.getOneRow(datatable.tableBody, rowNumber);
            return datatable;
          }
        });
        return datatable;
      },

      /**
       * @deprecated in v5.0.6
       * Get column of current record ID
       * @param columnName
       * @returns {jQuery}
       */
      getColumn: function(columnName) {
        Plugin.setSelectedRecords();
        datatable.API.value = t(datatable.API.record).find('[data-field="' + columnName + '"]');
        return datatable;
      },

      /**
       * Destroy datatable to original DOM state before datatable was
       * initialized
       * @returns {jQuery}
       */
      destroy: function() {
        t(datatable).parent().find('.' + pfx + 'datatable__pager').remove();
        var initialDatatable = t(datatable.initialDatatable).addClass(pfx + 'datatable--destroyed').show();
        t(datatable).replaceWith(initialDatatable);
        datatable = initialDatatable;
        t(datatable).trigger(pfx + 'datatable--on-destroy');
        Plugin.isInit = false;
        initialDatatable = null;
        return initialDatatable;
      },

      /**
       * Sort by column field
       * @param field
       * @param sort
       */
      sort: function(field, sort) {
        // toggle sort
        sort = typeof sort === 'undefined' ? 'asc' : sort;

        Plugin.spinnerCallback(true);

        // update field and sort params
        var meta = {field: field, sort: sort};
        Plugin.setDataSourceParam('sort', meta);

        setTimeout(function() {
          Plugin.dataRender('sort');
          t(datatable).trigger(pfx + 'datatable--on-sort', meta);
          t(datatable.tableHead).find('.' + pfx + 'datatable__cell > span > i').remove();
        }, 300);

        return datatable;
      },

      /**
       * @deprecated in v5.0.6
       * Get current selected column value
       * @returns {jQuery}
       */
      getValue: function() {
        return t(datatable.API.value).text();
      },

      /**
       * Set checkbox active
       * @param cell JQuery selector or checkbox ID
       */
      setActive: function(cell) {
        if (typeof cell === 'string') {
          // set by checkbox id
          cell = t(datatable.tableBody).find('.' + pfx + 'checkbox--single > [type="checkbox"][value="' + cell + '"]');
        }

        t(cell).prop('checked', true);

        var ids = [];
        t(cell).each(function(i, td) {
          // normal table
          var row = t(td).closest('tr').addClass(pfx + 'datatable__row--active');
          var colIndex = t(row).index() + 1;

          // lock table
          t(row).closest('tbody').find('tr:nth-child(' + colIndex + ')').not('.' + pfx + 'datatable__row-subtable').addClass(pfx + 'datatable__row--active');

          var id = t(td).attr('value');
          if (typeof id !== 'undefined') {
            ids.push(id);
          }
        });

        t(datatable).trigger(pfx + 'datatable--on-check', [ids]);
      },

      /**
       * Set checkbox inactive
       * @param cell JQuery selector or checkbox ID
       */
      setInactive: function(cell) {
        if (typeof cell === 'string') {
          // set by checkbox id
          cell = t(datatable.tableBody).find('.' + pfx + 'checkbox--single > [type="checkbox"][value="' + cell + '"]');
        }

        t(cell).prop('checked', false);

        var ids = [];
        t(cell).each(function(i, td) {
          // normal table
          var row = t(td).closest('tr').removeClass(pfx + 'datatable__row--active');
          var colIndex = t(row).index() + 1;

          // lock table
          t(row).closest('tbody').find('tr:nth-child(' + colIndex + ')').not('.' + pfx + 'datatable__row-subtable').removeClass(pfx + 'datatable__row--active');

          var id = t(td).attr('value');
          if (typeof id !== 'undefined') {
            ids.push(id);
          }
        });

        t(datatable).trigger(pfx + 'datatable--on-uncheck', [ids]);
      },

      /**
       * Set all checkboxes active or inactive
       * @param active
       */
      setActiveAll: function(active) {
        var checkboxes = t(datatable.table).
            find('> tbody, > thead').
            find('tr').not('.' + pfx + 'datatable__row-subtable').
            find('.' + pfx + 'datatable__cell--check [type="checkbox"]');
        if (active) {
          Plugin.setActive(checkboxes);
        } else {
          Plugin.setInactive(checkboxes);
        }
      },

      /**
       * @deprecated in v5.0.6
       * Get selected rows which are active
       * @returns {jQuery}
       */
      setSelectedRecords: function() {
        datatable.API.record = t(datatable.tableBody).find('.' + pfx + 'datatable__row--active');
        return datatable;
      },

      /**
       * Get selected records
       * @returns {null}
       */
      getSelectedRecords: function() {
        // support old method
        Plugin.setSelectedRecords();
        datatable.API.record = datatable.rows('.' + pfx + 'datatable__row--active').nodes();
        return datatable.API.record;
      },

      /**
       * Get options by dots notation path
       * @param path String Dot notation path in string
       * @returns {*}
       */
      getOption: function(path) {
        return Plugin.getObject(path, options);
      },

      /**
       * Set global options nodes by dots notation path
       * @param path
       * @param object
       */
      setOption: function(path, object) {
        options = Plugin.extendObj(options, path, object);
      },

      /**
       * Search filter for local & remote
       * @param value
       * @param columns. Optional list of columns to be filtered.
       */
      search: function(value, columns) {
        if (typeof columns !== 'undefined') columns = t.makeArray(columns);
        var delay = (function() {
          return function(callback, ms) {
            clearTimeout(Plugin.timer);
            Plugin.timer = setTimeout(callback, ms);
          };
        })();

        delay(function() {
          // get query parameters
          var query = Plugin.getDataSourceQuery();

          // search not by columns
          if (typeof columns === 'undefined' && typeof value !== 'undefined') {
            var key = Plugin.getGeneralSearchKey();
            query[key] = value;
          }

          // search by columns, support multiple columns
          if (typeof columns === 'object') {
            t.each(columns, function(k, column) {
              query[column] = value;
            });
            // remove empty element from arrays
            t.each(query, function(k, v) {
              if (v === '' || t.isEmptyObject(v)) {
                delete query[k];
              }
            });
          }

          Plugin.setDataSourceQuery(query);

          // local filter only. remote pagination will skip this block
          if (!options.data.serverFiltering) {
            Plugin.localDataUpdate();
          }
          Plugin.dataRender('search');
        }, Plugin.getOption('search.delay'));
      },

      /**
       * Set datasource params extract
       * @param param
       * @param value
       */
      setDataSourceParam: function(param, value) {
        datatable.API.params = t.extend({}, {
          pagination: {page: 1, perpage: Plugin.getOption('data.pageSize')},
          sort: Plugin.getDefaultSortColumn(),
          query: {},
        }, datatable.API.params, Plugin.stateGet(Plugin.stateId));

        datatable.API.params = Plugin.extendObj(datatable.API.params, param, value);

        Plugin.stateKeep(Plugin.stateId, datatable.API.params);
      },

      /**
       * Get datasource params
       * @param param
       */
      getDataSourceParam: function(param) {
        datatable.API.params = t.extend({}, {
          pagination: {page: 1, perpage: Plugin.getOption('data.pageSize')},
          sort: Plugin.getDefaultSortColumn(),
          query: {},
        }, datatable.API.params, Plugin.stateGet(Plugin.stateId));

        if (typeof param === 'string') {
          return Plugin.getObject(param, datatable.API.params);
        }

        return datatable.API.params;
      },

      /**
       * Shortcode to datatable.getDataSourceParam('query');
       * @returns {*}
       */
      getDataSourceQuery: function() {
        return Plugin.getDataSourceParam('query') || {};
      },

      /**
       * Shortcode to datatable.setDataSourceParam('query', query);
       * @param query
       */
      setDataSourceQuery: function(query) {
        Plugin.setDataSourceParam('query', query);
      },

      /**
       * Get current page number
       * @returns {number}
       */
      getCurrentPage: function() {
        return t(datatable.table).
            siblings('.' + pfx + 'datatable__pager').
            last().
            find('.' + pfx + 'datatable__pager-nav').
            find('.' + pfx + 'datatable__pager-link.' + pfx + 'datatable__pager-link--active').
            data('page') || 1;
      },

      /**
       * Get selected dropdown page size
       * @returns {*|number}
       */
      getPageSize: function() {
        return t(datatable.table).siblings('.' + pfx + 'datatable__pager').last().find('select.' + pfx + 'datatable__pager-size').val() || 10;
      },

      /**
       * Get total rows
       */
      getTotalRows: function() {
        return datatable.API.params.pagination.total;
      },

      /**
       * Get full dataset in grid
       * @returns {*|null|Array}
       */
      getDataSet: function() {
        return datatable.originalDataSet;
      },

      /**
       * @deprecated in v5.0.6
       * Hide column by column's field name
       * @param fieldName
       */
      hideColumn: function(fieldName) {
        // add hide option for this column
        t.map(options.columns, function(column) {
          if (fieldName === column.field) {
            column.responsive = {hidden: 'xl'};
          }
          return column;
        });
        // hide current displayed column
        var tds = t.grep(t(datatable.table).find('.' + pfx + 'datatable__cell'), function(n, i) {
          return fieldName === t(n).data('field');
        });
        t(tds).hide();
      },

      /**
       * @deprecated in v5.0.6
       * Show column by column's field name
       * @param fieldName
       */
      showColumn: function(fieldName) {
        // add hide option for this column
        t.map(options.columns, function(column) {
          if (fieldName === column.field) {
            delete column.responsive;
          }
          return column;
        });
        // hide current displayed column
        var tds = t.grep(t(datatable.table).find('.' + pfx + 'datatable__cell'), function(n, i) {
          return fieldName === t(n).data('field');
        });
        t(tds).show();
      },

      nodeTr: [],
      nodeTd: [],
      nodeCols: [],
      recentNode: [],

      table: function() {
        if (typeof datatable.table !== 'undefined') {
          return datatable.table;
        }
      },

      /**
       * Select a single row from the table
       * @param selector
       * @returns {jQuery}
       */
      row: function(selector) {
        Plugin.rows(selector);
        Plugin.nodeTr = Plugin.recentNode = t(Plugin.nodeTr).first();
        return datatable;
      },

      /**
       * Select multiple rows from the table
       * @param selector
       * @returns {jQuery}
       */
      rows: function(selector) {
        if (Plugin.isLocked()) {
          Plugin.nodeTr = Plugin.recentNode = t(datatable.tableBody).find(selector).filter('.' + pfx + 'datatable__lock--scroll > .' + pfx + 'datatable__row');
        } else {
          Plugin.nodeTr = Plugin.recentNode = t(datatable.tableBody).find(selector).filter('.' + pfx + 'datatable__row');
        }
        return datatable;
      },

      /**
       * Select a single column from the table
       * @param index zero-based index
       * @returns {jQuery}
       */
      column: function(index) {
        Plugin.nodeCols = Plugin.recentNode = t(datatable.tableBody).find('.' + pfx + 'datatable__cell:nth-child(' + (index + 1) + ')');
        return datatable;
      },

      /**
       * Select multiple columns from the table
       * @param selector
       * @returns {jQuery}
       */
      columns: function(selector) {
        var context = datatable.table;
        if (Plugin.nodeTr === Plugin.recentNode) {
          context = Plugin.nodeTr;
        }
        var columns = t(context).find('.' + pfx + 'datatable__cell[data-field="' + selector + '"]');
        if (columns.length > 0) {
          Plugin.nodeCols = Plugin.recentNode = columns;
        } else {
          Plugin.nodeCols = Plugin.recentNode = t(context).find(selector).filter('.' + pfx + 'datatable__cell');
        }
        return datatable;
      },

      cell: function(selector) {
        Plugin.cells(selector);
        Plugin.nodeTd = Plugin.recentNode = t(Plugin.nodeTd).first();
        return datatable;
      },

      cells: function(selector) {
        var cells = t(datatable.tableBody).find('.' + pfx + 'datatable__cell');
        if (typeof selector !== 'undefined') {
          cells = t(cells).filter(selector);
        }
        Plugin.nodeTd = Plugin.recentNode = cells;
        return datatable;
      },

      /**
       * Delete the selected row from the table
       * @returns {jQuery}
       */
      remove: function() {
        if (t(Plugin.nodeTr.length) && Plugin.nodeTr === Plugin.recentNode) {
          t(Plugin.nodeTr).remove();
        }
        Plugin.layoutUpdate();
        return datatable;
      },

      /**
       * Show or hide the columns or rows
       */
      visible: function(bool) {
        if (t(Plugin.recentNode.length)) {
          var locked = Plugin.lockEnabledColumns();
          if (Plugin.recentNode === Plugin.nodeCols) {
            var index = Plugin.recentNode.index();

            if (Plugin.isLocked()) {
              var scrollColumns = t(Plugin.recentNode).closest('.' + pfx + 'datatable__lock--scroll').length;
              if (scrollColumns) {
                // is at center of scrollable area
                index += locked.left.length + 1;
              } else if (t(Plugin.recentNode).closest('.' + pfx + 'datatable__lock--right').length) {
                // is at the right locked table
                index += locked.left.length + scrollColumns + 1;
              }
            }
          }

          if (bool) {
            if (Plugin.recentNode === Plugin.nodeCols) {
              delete options.columns[index].responsive;
            }
            t(Plugin.recentNode).show();
          } else {
            if (Plugin.recentNode === Plugin.nodeCols) {
              Plugin.setOption('columns.' + index + '.responsive', {hidden: 'xl'});
            }
            t(Plugin.recentNode).hide();
          }
          Plugin.redraw();
        }
      },

      /**
       * Get the the DOM element for the selected rows or columns
       * @returns {Array}
       */
      nodes: function() {
        return Plugin.recentNode;
      },

      /**
       * will be implemented soon
       * @returns {jQuery}
       */
      dataset: function() {
        return datatable;
      },

      /**
       * Open page by number
       * @param page number
       */
      gotoPage: function (page) {
        Plugin.pagingObject.openPage(page);
      },

    };

    /**
     * Public API methods can be used directly by datatable
     */
    t.each(Plugin, function(funcName, func) {
      datatable[funcName] = func;
    });

    // initialize main datatable plugin
    if (typeof options !== 'undefined') {
      if (typeof options === 'string') {
        var method = options;
        datatable = t(this).data(pluginName);
        if (typeof datatable !== 'undefined') {
          options = datatable.options;
          Plugin[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
      } else {
        if (!datatable.data(pluginName) && !t(this).hasClass(pfx + 'datatable--loaded')) {
          datatable.dataSet = null;
          datatable.textAlign = {
            left: pfx + 'datatable__cell--left',
            center: pfx + 'datatable__cell--center',
            right: pfx + 'datatable__cell--right',
          };

          // merge default and user defined options
          options = t.extend(true, {}, t.fn[pluginName].defaults, options);

          datatable.options = options;

          // init plugin process
          Plugin.init.apply(this, [options]);

          t(datatable.wrap).data(pluginName, datatable);
        }
      }
    } else {
      // get existing instance datatable
      datatable = t(this).data(pluginName);
      if (typeof datatable === 'undefined') {
        t.error(pluginName + ' not initialized');
      }
      options = datatable.options;
    }

    return datatable;
  }, t.fn.mDatatable.defaults = {
    data: {
      type: 'local',
      source: null,
      pageSize: 10,
      saveState: {cookie: !1, webstorage: !0},
      serverPaging: !1,
      serverFiltering: !1,
      serverSorting: !1,
      autoColumns: !1,
      attr: {rowProps: []},
    },
    layout: {
      theme: 'default',
      class: 'm-datatable--brand',
      scroll: !1,
      height: null,
      minHeight: 300,
      footer: !1,
      header: !0,
      customScrollbar: !0,
      spinner: {
        overlayColor: '#000000',
        opacity: 0,
        type: 'loader',
        state: 'brand',
        message: !0,
      },
      icons: {
        sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
        pagination: {
          next: 'la la-angle-right',
          prev: 'la la-angle-left',
          first: 'la la-angle-double-left',
          last: 'la la-angle-double-right',
          more: 'la la-ellipsis-h',
        },
        rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'},
      },
    },
    sortable: !0,
    resizable: !1,
    filterable: !1,
    pagination: !0,
    editable: !1,
    columns: [],
    search: {onEnter: !1, input: null, delay: 400},
    rows: {
      callback: function() {},
      beforeTemplate: function() {},
      afterTemplate: function() {},
      autoHide: !1,
    },
    toolbar: {
      layout: ['pagination', 'info'],
      placement: ['bottom'],
      items: {
        pagination: {
          type: 'default',
          pages: {
            desktop: {layout: 'default', pagesNumber: 6},
            tablet: {layout: 'default', pagesNumber: 3},
            mobile: {layout: 'compact'},
          },
          navigation: {prev: !0, next: !0, first: !0, last: !0},
          pageSizeSelect: [],
        }, info: !0,
      },
    },
    translate: {
      records: {
        processing: 'Please wait...',
        noRecords: 'No records found',
      },
      toolbar: {
        pagination: {
          items: {
            default: {
              first: 'First',
              prev: 'Previous',
              next: 'Next',
              last: 'Last',
              more: 'More pages',
              input: 'Page number',
              select: 'Select page size',
            }, info: 'Displaying {{start}} - {{end}} of {{total}} records',
          },
        },
      },
    },
    extensions: {},
  };
}(jQuery);
var mDropdown = function(t, e) {
  var a = this, n = mUtil.get(t), o = mUtil.get('body');
  if (n) {
    var i = {
      toggle: 'click',
      hoverTimeout: 300,
      skin: 'light',
      height: 'auto',
      maxHeight: !1,
      minHeight: !1,
      persistent: !1,
      mobileOverlay: !0,
    }, l = {
      construct: function(t) {
        return mUtil.data(n).has('dropdown')
            ? a = mUtil.data(n).get('dropdown')
            : (l.init(t), l.setup(), mUtil.data(n).set('dropdown', a)), a;
      },
      init: function(t) {
        a.options = mUtil.deepExtend({}, i,
            t), a.events = [], a.eventHandlers = {}, a.open = !1, a.layout = {}, a.layout.close = mUtil.find(
            n, '.m-dropdown__close'), a.layout.toggle = mUtil.find(n,
            '.m-dropdown__toggle'), a.layout.arrow = mUtil.find(n,
            '.m-dropdown__arrow'), a.layout.wrapper = mUtil.find(n,
            '.m-dropdown__wrapper'), a.layout.defaultDropPos = mUtil.hasClass(n,
            'm-dropdown--up')
            ? 'up'
            : 'down', a.layout.currentDropPos = a.layout.defaultDropPos, 'hover' ==
        mUtil.attr(n, 'm-dropdown-toggle') && (a.options.toggle = 'hover');
      },
      setup: function() {
        a.options.placement && mUtil.addClass(n,
            'm-dropdown--' + a.options.placement), a.options.align &&
        mUtil.addClass(n,
            'm-dropdown--align-' + a.options.align), a.options.width &&
        mUtil.css(a.layout.wrapper, 'width', a.options.width + 'px'), '1' ==
        mUtil.attr(n, 'm-dropdown-persistent') &&
        (a.options.persistent = !0), 'hover' == a.options.toggle &&
        mUtil.addEvent(n, 'mouseout', l.hideMouseout), l.setZindex();
      },
      toggle: function() {return a.open ? l.hide() : l.show();},
      setContent: function(t) {
        t = mUtil.find(n, '.m-dropdown__content').innerHTML = t;
        return a;
      },
      show: function() {
        if ('hover' == a.options.toggle &&
            mUtil.hasAttr(n, 'hover')) {
          return l.clearHovered(), a;
        }
        if (a.open) {
          return a;
        }
        if (a.layout.arrow && l.adjustArrowPos(), l.eventTrigger(
            'beforeShow'), l.hideOpened(), mUtil.addClass(n,
            'm-dropdown--open'), mUtil.isMobileDevice() &&
        a.options.mobileOverlay) {
          var t = mUtil.css(n, 'z-index') - 1,
              e = mUtil.insertAfter(document.createElement('DIV'), n);
          mUtil.addClass(e, 'm-dropdown__dropoff'), mUtil.css(e, 'z-index',
              t), mUtil.data(e).set('dropdown', n), mUtil.data(n).
              set('dropoff', e), mUtil.addEvent(e, 'click',
              function(t) {l.hide(), mUtil.remove(this), t.preventDefault();});
        }
        return n.focus(), n.setAttribute('aria-expanded',
            'true'), a.open = !0, mUtil.scrollersUpdate(n), l.eventTrigger(
            'afterShow'), a;
      },
      clearHovered: function() {
        var t = mUtil.attr(n, 'timeout');
        mUtil.removeAttr(n, 'hover'), mUtil.removeAttr(n,
            'timeout'), clearTimeout(t);
      },
      hideHovered: function(t) {
        if (!0 === t) {
          if (!1 === l.eventTrigger('beforeHide')) {
            return;
          }
          l.clearHovered(), mUtil.removeClass(n,
              'm-dropdown--open'), a.open = !1, l.eventTrigger('afterHide');
        }
        else {
          if (!0 === mUtil.hasAttr(n, 'hover')) {
            return;
          }
          if (!1 === l.eventTrigger('beforeHide')) {
            return;
          }
          var e = setTimeout(function() {
            mUtil.attr(n, 'hover') && (l.clearHovered(), mUtil.removeClass(n,
                'm-dropdown--open'), a.open = !1, l.eventTrigger('afterHide'));
          }, a.options.hoverTimeout);
          mUtil.attr(n, 'hover', '1'), mUtil.attr(n, 'timeout', e);
        }
      },
      hideClicked: function() {
        !1 !== l.eventTrigger('beforeHide') &&
        (mUtil.removeClass(n, 'm-dropdown--open'), mUtil.data(n).
            remove('dropoff'), a.open = !1, l.eventTrigger('afterHide'));
      },
      hide: function(t) {
        return !1 === a.open ? a : (mUtil.isDesktopDevice() && 'hover' ==
        a.options.toggle ? l.hideHovered(t) : l.hideClicked(), 'down' ==
        a.layout.defaultDropPos && 'up' == a.layout.currentDropPos &&
        (mUtil.removeClass(n, 'm-dropdown--up'), a.layout.arrow.prependTo(
            a.layout.wrapper), a.layout.currentDropPos = 'down'), a);
      },
      hideMouseout: function() {mUtil.isDesktopDevice() && l.hide();},
      hideOpened: function() {
        for (var t = mUtil.findAll(o,
            '.m-dropdown.m-dropdown--open'), e = 0, a = t.length; e < a; e++) {
          var n = t[e];
          mUtil.data(n).get('dropdown').hide(!0);
        }
      },
      adjustArrowPos: function() {
        var t = mUtil.outerWidth(n),
            e = mUtil.hasClass(a.layout.arrow, 'm-dropdown__arrow--right')
                ? 'right'
                : 'left', o = 0;
        a.layout.arrow && (mUtil.isInResponsiveRange('mobile') &&
        mUtil.hasClass(n, 'm-dropdown--mobile-full-width')
            ? (o = mUtil.offset(n).left + t / 2 -
                Math.abs(parseInt(mUtil.css(a.layout.arrow, 'width')) / 2) -
                parseInt(mUtil.css(a.layout.wrapper, 'left')), mUtil.css(
                a.layout.arrow, 'right', 'auto'), mUtil.css(a.layout.arrow,
                'left', o + 'px'), mUtil.css(a.layout.arrow, 'margin-left',
                'auto'), mUtil.css(a.layout.arrow, 'margin-right', 'auto'))
            : mUtil.hasClass(a.layout.arrow, 'm-dropdown__arrow--adjust') &&
            (o = t / 2 - Math.abs(parseInt(mUtil.css(a.layout.arrow, 'width')) /
                2), mUtil.hasClass(n, 'm-dropdown--align-push') &&
            (o += 20), 'right' == e ? mUtil.isRTL()
                ? (mUtil.css(a.layout.arrow, 'right', 'auto'), mUtil.css(
                    a.layout.arrow, 'left', o + 'px'))
                : (mUtil.css(a.layout.arrow, 'left', 'auto'), mUtil.css(
                    a.layout.arrow, 'right', o + 'px')) : mUtil.isRTL()
                ? (mUtil.css(a.layout.arrow, 'left', 'auto'), mUtil.css(
                    a.layout.arrow, 'right', o + 'px'))
                : (mUtil.css(a.layout.arrow, 'right', 'auto'), mUtil.css(
                    a.layout.arrow, 'left', o + 'px'))));
      },
      setZindex: function() {
        var t = 101, e = mUtil.getHighestZindex(n);
        e >= t && (t = e + 1), mUtil.css(a.layout.wrapper, 'z-index', t);
      },
      isPersistent: function() {return a.options.persistent;},
      isShown: function() {return a.open;},
      eventTrigger: function(t, e) {
        for (var n = 0; n < a.events.length; n++) {
          var o = a.events[n];
          o.name == t && (1 == o.one
              ? 0 == o.fired &&
              (a.events[n].fired = !0, o.handler.call(this, a, e))
              : o.handler.call(this, a, e));
        }
      },
      addEvent: function(t, e, n) {
        a.events.push({name: t, handler: e, one: n, fired: !1});
      },
    };
    return a.setDefaults = function(t) {i = t;}, a.show = function() {return l.show();}, a.hide = function() {return l.hide();}, a.toggle = function() {return l.toggle();}, a.isPersistent = function() {return l.isPersistent();}, a.isShown = function() {return l.isShown();}, a.setContent = function(t) {
      return l.setContent(t);
    }, a.on = function(t, e) {return l.addEvent(t, e);}, a.one = function(
        t, e) {
      return l.addEvent(t, e, !0);
    }, l.construct.apply(a, [e]), !0, a;
  }
};
mUtil.on(document, '[m-dropdown-toggle="click"] .m-dropdown__toggle', 'click',
    function(t) {
      var e = this.closest('.m-dropdown');
      e && ((mUtil.data(e).has('dropdown')
          ? mUtil.data(e).get('dropdown')
          : new mDropdown(e)).toggle(), t.preventDefault());
    }), mUtil.on(document, '[m-dropdown-toggle="hover"] .m-dropdown__toggle',
    'click', function(t) {
      if (mUtil.isDesktopDevice()) {
        '#' == mUtil.attr(this, 'href') &&
        t.preventDefault();
      }
      else if (mUtil.isMobileDevice()) {
        var e = this.closest('.m-dropdown');
        e && ((mUtil.data(e).has('dropdown')
            ? mUtil.data(e).get('dropdown')
            : new mDropdown(e)).toggle(), t.preventDefault());
      }
    }), mUtil.on(document, '[m-dropdown-toggle="hover"]', 'mouseover',
    function(t) {
      if (mUtil.isDesktopDevice()) {
        this && ((mUtil.data(this).has('dropdown')
            ? mUtil.data(this).get('dropdown')
            : new mDropdown(this)).show(), t.preventDefault());
      }
    }), document.addEventListener('click', function(t) {
  var e, a = mUtil.get('body'), n = t.target;
  if (e = a.querySelectorAll(
      '.m-dropdown.m-dropdown--open')) {
    for (var o = 0, i = e.length; o <
    i; o++) {
      var l = e[o];
      if (!1 === mUtil.data(l).has('dropdown')) {
        return;
      }
      var r = mUtil.data(l).get('dropdown'),
          s = mUtil.find(l, '.m-dropdown__toggle');
      mUtil.hasClass(l, 'm-dropdown--disable-close') &&
      (t.preventDefault(), t.stopPropagation()), s && n !== s && !1 ===
      s.contains(n) && !1 === n.contains(s) ? !0 === r.isPersistent() ? !1 ===
          l.contains(n) && r.hide() : r.hide() : !1 === l.contains(n) &&
          r.hide();
    }
  }
});
var mHeader = function(t, e) {
  var a = this, n = mUtil.get(t), o = mUtil.get('body');
  if (void 0 !== n) {
    var i = {
      classic: !1,
      offset: {mobile: 150, desktop: 200},
      minimize: {mobile: !1, desktop: !1},
    }, l = {
      construct: function(t) {
        return mUtil.data(n).has('header')
            ? a = mUtil.data(n).get('header')
            : (l.init(t), l.build(), mUtil.data(n).set('header', a)), a;
      },
      init: function(t) {a.events = [], a.options = mUtil.deepExtend({}, i, t);},
      build: function() {
        var t = 0;
        !1 === a.options.minimize.mobile && !1 === a.options.minimize.desktop ||
        window.addEventListener('scroll', function() {
          var e, n, i, l = 0;
          mUtil.isInResponsiveRange('desktop')
              ? (l = a.options.offset.desktop, e = a.options.minimize.desktop.on, n = a.options.minimize.desktop.off)
              : mUtil.isInResponsiveRange('tablet-and-mobile') &&
              (l = a.options.offset.mobile, e = a.options.minimize.mobile.on, n = a.options.minimize.mobile.off), i = window.pageYOffset, mUtil.isInResponsiveRange(
              'tablet-and-mobile') && a.options.classic &&
          a.options.classic.mobile || mUtil.isInResponsiveRange('desktop') &&
          a.options.classic && a.options.classic.desktop ? i > l
              ? (mUtil.addClass(o, e), mUtil.removeClass(o, n))
              : (mUtil.addClass(o, n), mUtil.removeClass(o, e)) : (i > l && t <
          i ? (mUtil.addClass(o, e), mUtil.removeClass(o, n)) : (mUtil.addClass(
              o, n), mUtil.removeClass(o, e)), t = i);
        });
      },
      eventTrigger: function(t, e) {
        for (var n = 0; n < a.events.length; n++) {
          var o = a.events[n];
          o.name == t && (1 == o.one
              ? 0 == o.fired &&
              (a.events[n].fired = !0, o.handler.call(this, a, e))
              : o.handler.call(this, a, e));
        }
      },
      addEvent: function(t, e, n) {
        a.events.push({name: t, handler: e, one: n, fired: !1});
      },
    };
    return a.setDefaults = function(t) {i = t;}, a.on = function(
        t, e) {
      return l.addEvent(t, e);
    }, l.construct.apply(a, [e]), !0, a;
  }
}, mMenu = function(t, e) {
  var a = this, n = !1, o = mUtil.get(t), i = mUtil.get('body');
  if (o) {
    var l = {
      accordion: {
        slideSpeed: 200,
        autoScroll: !1,
        autoScrollSpeed: 1200,
        expandAll: !0,
      }, dropdown: {timeout: 500},
    }, r = {
      construct: function(t) {
        return mUtil.data(o).has('menu')
            ? a = mUtil.data(o).get('menu')
            : (r.init(t), r.reset(), r.build(), mUtil.data(o).
                set('menu', a)), a;
      },
      init: function(t) {
        a.events = [], a.eventHandlers = {}, a.options = mUtil.deepExtend({}, l,
            t), a.pauseDropdownHoverTime = 0, a.uid = mUtil.getUniqueID();
      },
      reload: function() {r.reset(), r.build();},
      build: function() {
        a.eventHandlers.event_1 = mUtil.on(o, '.m-menu__toggle', 'click',
            r.handleSubmenuAccordion), ('dropdown' === r.getSubmenuMode() ||
            r.isConditionalSubmenuDropdown()) &&
        (a.eventHandlers.event_2 = mUtil.on(o,
            '[m-menu-submenu-toggle="hover"]', 'mouseover',
            r.handleSubmenuDrodownHoverEnter), a.eventHandlers.event_3 = mUtil.on(
            o, '[m-menu-submenu-toggle="hover"]', 'mouseout',
            r.handleSubmenuDrodownHoverExit), a.eventHandlers.event_4 = mUtil.on(
            o,
            '[m-menu-submenu-toggle="click"] > .m-menu__toggle, [m-menu-submenu-toggle="click"] > .m-menu__link .m-menu__toggle',
            'click',
            r.handleSubmenuDropdownClick), a.eventHandlers.event_5 = mUtil.on(o,
            '[m-menu-submenu-toggle="tab"] > .m-menu__toggle, [m-menu-submenu-toggle="tab"] > .m-menu__link .m-menu__toggle',
            'click',
            r.handleSubmenuDropdownTabClick)), a.eventHandlers.event_6 = mUtil.on(
            o,
            '.m-menu__item:not(.m-menu__item--submenu) > .m-menu__link:not(.m-menu__toggle):not(.m-menu__link--toggle-skip)',
            'click', r.handleLinkClick), a.options.scroll &&
        a.options.scroll.height && r.scrollerInit();
      },
      reset: function() {
        mUtil.off(o, 'click', a.eventHandlers.event_1), mUtil.off(o,
            'mouseover', a.eventHandlers.event_2), mUtil.off(o, 'mouseout',
            a.eventHandlers.event_3), mUtil.off(o, 'click',
            a.eventHandlers.event_4), mUtil.off(o, 'click',
            a.eventHandlers.event_5), mUtil.off(o, 'click',
            a.eventHandlers.event_6);
      },
      scrollerInit: function() {
        a.options.scroll && a.options.scroll.height && mUtil.scrollerInit(o, {
          disableForMobile: !0,
          resetHeightOnDestroy: !0,
          handleWindowResize: !0,
          height: a.options.scroll.height,
        });
      },
      scrollerUpdate: function() {
        a.options.scroll && a.options.scroll.height && mUtil.scrollerUpdate(o);
      },
      scrollerTop: function() {
        a.options.scroll && a.options.scroll.height && mUtil.scrollerTop(o);
      },
      getSubmenuMode: function(t) {
        return mUtil.isInResponsiveRange('desktop')
            ? t && mUtil.hasAttr(t, 'm-menu-submenu-toggle') ? mUtil.attr(t,
                'm-menu-submenu-toggle') : mUtil.isset(a.options.submenu,
                'desktop.state.body') ? mUtil.hasClass(i,
                a.options.submenu.desktop.state.body)
                ? a.options.submenu.desktop.state.mode
                : a.options.submenu.desktop.default : mUtil.isset(
                a.options.submenu, 'desktop')
                ? a.options.submenu.desktop
                : void 0
            : mUtil.isInResponsiveRange('tablet') &&
            mUtil.isset(a.options.submenu, 'tablet')
                ? a.options.submenu.tablet
                : !(!mUtil.isInResponsiveRange('mobile') ||
                !mUtil.isset(a.options.submenu, 'mobile')) &&
                a.options.submenu.mobile;
      },
      isConditionalSubmenuDropdown: function() {
        return !(!mUtil.isInResponsiveRange('desktop') ||
            !mUtil.isset(a.options.submenu, 'desktop.state.body'));
      },
      handleLinkClick: function(t) {
        !1 === r.eventTrigger('linkClick', this) &&
        t.preventDefault(), ('dropdown' === r.getSubmenuMode(this) ||
            r.isConditionalSubmenuDropdown()) &&
        r.handleSubmenuDropdownClose(t, this);
      },
      handleSubmenuDrodownHoverEnter: function(t) {
        if ('accordion' !== r.getSubmenuMode(this) && !1 !==
            a.resumeDropdownHover()) {
          '1' == this.getAttribute('data-hover') &&
          (this.removeAttribute('data-hover'), clearTimeout(
              this.getAttribute('data-timeout')), this.removeAttribute(
              'data-timeout')), r.showSubmenuDropdown(this);
        }
      },
      handleSubmenuDrodownHoverExit: function(t) {
        if (!1 !== a.resumeDropdownHover() && 'accordion' !==
            r.getSubmenuMode(this)) {
          var e = this, n = a.options.dropdown.timeout, o = setTimeout(
              function() {
                '1' == e.getAttribute('data-hover') &&
                r.hideSubmenuDropdown(e, !0);
              }, n);
          e.setAttribute('data-hover', '1'), e.setAttribute('data-timeout', o);
        }
      },
      handleSubmenuDropdownClick: function(t) {
        if ('accordion' !== r.getSubmenuMode(this)) {
          var e = this.closest('.m-menu__item');
          'accordion' != e.getAttribute('m-menu-submenu-mode') &&
          (!1 === mUtil.hasClass(e, 'm-menu__item--hover')
              ? (mUtil.addClass(e,
                  'm-menu__item--open-dropdown'), r.showSubmenuDropdown(e))
              : (mUtil.removeClass(e,
                  'm-menu__item--open-dropdown'), r.hideSubmenuDropdown(e,
                  !0)), t.preventDefault());
        }
      },
      handleSubmenuDropdownTabClick: function(t) {
        if ('accordion' !== r.getSubmenuMode(this)) {
          var e = this.closest('.m-menu__item');
          'accordion' != e.getAttribute('m-menu-submenu-mode') &&
          (0 == mUtil.hasClass(e, 'm-menu__item--hover') && (mUtil.addClass(e,
              'm-menu__item--open-dropdown'), r.showSubmenuDropdown(
              e)), t.preventDefault());
        }
      },
      handleSubmenuDropdownClose: function(t, e) {
        if ('accordion' !== r.getSubmenuMode(e)) {
          var a = o.querySelectorAll(
              '.m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)');
          if (a.length > 0 && !1 === mUtil.hasClass(e, 'm-menu__toggle') &&
              0 === e.querySelectorAll(
                  '.m-menu__toggle').length) {
            for (var n = 0, i = a.length; n <
            i; n++) {
              r.hideSubmenuDropdown(a[0], !0);
            }
          }
        }
      },
      handleSubmenuAccordion: function(t, e) {
        var n, o = e || this;
        if ('dropdown' === r.getSubmenuMode(e) &&
            (n = o.closest('.m-menu__item')) && 'accordion' != n.getAttribute(
                'm-menu-submenu-mode')) {
          t.preventDefault();
        }
        else {
          var i = o.closest('.m-menu__item'),
              l = mUtil.child(i, '.m-menu__submenu, .m-menu__inner');
          if (!mUtil.hasClass(o.closest('.m-menu__item'),
              'm-menu__item--open-always') && i && l) {
            t.preventDefault();
            var s = a.options.accordion.slideSpeed;
            if (!1 === mUtil.hasClass(i, 'm-menu__item--open')) {
              if (!1 === a.options.accordion.expandAll) {
                var d = o.closest('.m-menu__nav, .m-menu__subnav'),
                    c = mUtil.children(d,
                        '.m-menu__item.m-menu__item--open.m-menu__item--submenu:not(.m-menu__item--expanded):not(.m-menu__item--open-always)');
                if (d && c) {
                  for (var m = 0, u = c.length; m < u; m++) {
                    var p = c[0], f = mUtil.child(p, '.m-menu__submenu');
                    f && mUtil.slideUp(f, s, function() {
                      r.scrollerUpdate(), mUtil.removeClass(p,
                          'm-menu__item--open');
                    });
                  }
                }
              }
              mUtil.slideDown(l, s, function() {
                r.scrollToItem(o), r.scrollerUpdate(), r.eventTrigger(
                    'submenuToggle', l);
              }), mUtil.addClass(i, 'm-menu__item--open');
            }
            else {
              mUtil.slideUp(l, s, function() {
                r.scrollToItem(o), r.eventTrigger('submenuToggle', l);
              }), mUtil.removeClass(i, 'm-menu__item--open');
            }
          }
        }
      },
      scrollToItem: function(t) {
        mUtil.isInResponsiveRange('desktop') &&
        a.options.accordion.autoScroll && '1' !==
        o.getAttribute('m-menu-scrollable') &&
        mUtil.scrollTo(t, a.options.accordion.autoScrollSpeed);
      },
      hideSubmenuDropdown: function(t, e) {
        e && (mUtil.removeClass(t, 'm-menu__item--hover'), mUtil.removeClass(t,
            'm-menu__item--active-tab')), t.removeAttribute(
            'data-hover'), t.getAttribute('m-menu-dropdown-toggle-class') &&
        mUtil.removeClass(i, t.getAttribute('m-menu-dropdown-toggle-class'));
        var a = t.getAttribute('data-timeout');
        t.removeAttribute('data-timeout'), clearTimeout(a);
      },
      showSubmenuDropdown: function(t) {
        var e = o.querySelectorAll(
            '.m-menu__item--submenu.m-menu__item--hover, .m-menu__item--submenu.m-menu__item--active-tab');
        if (e) {
          for (var a = 0, n = e.length; a < n; a++) {
            var l = e[a];
            t !== l && !1 === l.contains(t) && !1 === t.contains(l) &&
            r.hideSubmenuDropdown(l, !0);
          }
        }
        r.adjustSubmenuDropdownArrowPos(t), mUtil.addClass(t,
            'm-menu__item--hover'), t.getAttribute(
            'm-menu-dropdown-toggle-class') &&
        mUtil.addClass(i, t.getAttribute('m-menu-dropdown-toggle-class'));
      },
      createSubmenuDropdownClickDropoff: function(t) {
        var e, a = (e = mUtil.child(t, '.m-menu__submenu') ? mUtil.css(e,
            'z-index') : 0) - 1, n = document.createElement(
            '<div class="m-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' +
            a + '"></div>');
        i.appendChild(n), mUtil.addEvent(n, 'click', function(e) {
          e.stopPropagation(), e.preventDefault(), mUtil.remove(
              this), r.hideSubmenuDropdown(t, !0);
        });
      },
      adjustSubmenuDropdownArrowPos: function(t) {
        var e = mUtil.child(t, '.m-menu__submenu'),
            a = mUtil.child(e, '.m-menu__arrow.m-menu__arrow--adjust');
        mUtil.child(e, '.m-menu__subnav');
        if (a) {
          var n = 0;
          mUtil.child(t, '.m-menu__link');
          mUtil.hasClass(e, 'm-menu__submenu--classic') ||
          mUtil.hasClass(e, 'm-menu__submenu--fixed') ? (mUtil.hasClass(e,
              'm-menu__submenu--right') ? (n = mUtil.outerWidth(t) /
              2, mUtil.hasClass(e, 'm-menu__submenu--pull') &&
          (mUtil.isRTL() ? n += Math.abs(
              parseFloat(mUtil.css(e, 'margin-left'))) : n += Math.abs(
              parseFloat(mUtil.css(e, 'margin-right')))), n = parseInt(
              mUtil.css(e, 'width')) - n) : mUtil.hasClass(e,
              'm-menu__submenu--left') &&
              (n = mUtil.outerWidth(t) / 2, mUtil.hasClass(e,
                  'm-menu__submenu--pull') && (mUtil.isRTL() ? n += Math.abs(
                  parseFloat(mUtil.css(e, 'margin-right'))) : n += Math.abs(
                  parseFloat(mUtil.css(e, 'margin-left'))))), mUtil.isRTL()
              ? mUtil.css(a, 'right', n + 'px')
              : mUtil.css(a, 'left', n + 'px')) : (mUtil.hasClass(e,
              'm-menu__submenu--center') ||
              mUtil.hasClass(e, 'm-menu__submenu--full')) &&
              (n = mUtil.offset(t).left - (mUtil.getViewPort().width -
                  parseInt(mUtil.css(e, 'width'))) / 2, n += mUtil.outerWidth(
                  t) / 2, mUtil.css(a, 'left', n + 'px'), mUtil.isRTL() &&
              mUtil.css(a, 'right', 'auto'));
        }
      },
      pauseDropdownHover: function(t) {
        var e = new Date;
        a.pauseDropdownHoverTime = e.getTime() + t;
      },
      resumeDropdownHover: function() {
        return (new Date).getTime() > a.pauseDropdownHoverTime;
      },
      resetActiveItem: function(t) {
        for (var e, n, i = 0, l = (e = o.querySelectorAll(
            '.m-menu__item--active')).length; i < l; i++) {
          var r = e[0];
          mUtil.removeClass(r, 'm-menu__item--active'), mUtil.hide(
              mUtil.child(r, '.m-menu__submenu'));
          for (var s = 0, d = (n = mUtil.parents(r,
              '.m-menu__item--submenu')).length; s < d; s++) {
            var c = n[i];
            mUtil.removeClass(c, 'm-menu__item--open'), mUtil.hide(
                mUtil.child(c, '.m-menu__submenu'));
          }
        }
        if (!1 === a.options.accordion.expandAll && (e = o.querySelectorAll(
            '.m-menu__item--open'))) {
          for (i = 0, l = e.length; i <
          l; i++) {
            mUtil.removeClass(n[0], 'm-menu__item--open');
          }
        }
      },
      setActiveItem: function(t) {
        r.resetActiveItem(), mUtil.addClass(t, 'm-menu__item--active');
        for (var e = mUtil.parents(t,
            '.m-menu__item--submenu'), a = 0, n = e.length; a <
             n; a++) {
          mUtil.addClass(e[a], 'm-menu__item--open');
        }
      },
      getBreadcrumbs: function(t) {
        var e, a = [], n = mUtil.child(t, '.m-menu__link');
        a.push({
          text: e = mUtil.child(n, '.m-menu__link-text') ? e.innerHTML : '',
          title: n.getAttribute('title'),
          href: n.getAttribute('href'),
        });
        for (var o = mUtil.parents(t,
            '.m-menu__item--submenu'), i = 0, l = o.length; i < l; i++) {
          var r = mUtil.child(o[i], '.m-menu__link');
          a.push({
            text: e = mUtil.child(r, '.m-menu__link-text')
                ? e.innerHTML
                : '',
            title: r.getAttribute('title'),
            href: r.getAttribute('href'),
          });
        }
        return a.reverse();
      },
      getPageTitle: function(t) {
        var e;
        return mUtil.child(t, '.m-menu__link-text') ? e.innerHTML : '';
      },
      eventTrigger: function(t, e) {
        for (var n = 0; n < a.events.length; n++) {
          var o = a.events[n];
          o.name == t && (1 == o.one
              ? 0 == o.fired &&
              (a.events[n].fired = !0, o.handler.call(this, a, e))
              : o.handler.call(this, a, e));
        }
      },
      addEvent: function(t, e, n) {
        a.events.push({name: t, handler: e, one: n, fired: !1});
      },
    };
    return a.setDefaults = function(t) {l = t;}, a.scrollerUpdate = function() {return r.scrollerUpdate();}, a.scrollerTop = function() {return r.scrollerTop();}, a.setActiveItem = function(t) {
      return r.setActiveItem(t);
    }, a.reload = function() {return r.reload();}, a.getBreadcrumbs = function(t) {
      return r.getBreadcrumbs(t);
    }, a.getPageTitle = function(t) {
      return r.getPageTitle(t);
    }, a.getSubmenuMode = function(t) {
      return r.getSubmenuMode(t);
    }, a.hideDropdown = function(t) {
      r.hideSubmenuDropdown(t, !0);
    }, a.pauseDropdownHover = function(t) {
      r.pauseDropdownHover(t);
    }, a.resumeDropdownHover = function() {return r.resumeDropdownHover();}, a.on = function(
        t, e) {
      return r.addEvent(t, e);
    }, a.one = function(t, e) {return r.addEvent(t, e, !0);}, r.construct.apply(
        a, [e]), mUtil.addResizeHandler(function() {n && a.reload();}), n = !0, a;
  }
};
document.addEventListener('click', function(t) {
  var e;
  if (e = mUtil.get('body').
      querySelectorAll(
          '.m-menu__nav .m-menu__item.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]')) {
    for (var a = 0, n = e.length; a <
    n; a++) {
      var o = e[a].closest('.m-menu__nav').parentNode;
      if (o) {
        var i, l = mUtil.data(o).get('menu');
        if (!l) {
          break;
        }
        if (!l || 'dropdown' !== l.getSubmenuMode()) {
          break;
        }
        if (t.target !== o && !1 ===
            o.contains(t.target)) {
          if (i = o.querySelectorAll(
              '.m-menu__item--submenu.m-menu__item--hover:not(.m-menu__item--tabs)[m-menu-submenu-toggle="click"]')) {
            for (var r = 0, s = i.length; r <
            s; r++) {
              l.hideDropdown(i[r]);
            }
          }
        }
      }
    }
  }
});
var mOffcanvas = function(t, e) {
  var a = this, n = mUtil.get(t), o = mUtil.get('body');
  if (n) {
    var i = {}, l = {
      construct: function(t) {
        return mUtil.data(n).has('offcanvas')
            ? a = mUtil.data(n).get('offcanvas')
            : (l.init(t), l.build(), mUtil.data(n).set('offcanvas', a)), a;
      },
      init: function(t) {
        a.events = [], a.options = mUtil.deepExtend({}, i,
            t), a.overlay, a.classBase = a.options.baseClass, a.classShown = a.classBase +
            '--on', a.classOverlay = a.classBase +
            '-overlay', a.state = mUtil.hasClass(n, a.classShown)
            ? 'shown'
            : 'hidden';
      },
      build: function() {
        if (a.options.toggleBy) {
          if ('string' ==
              typeof a.options.toggleBy) {
            mUtil.addEvent(a.options.toggleBy,
                'click', l.toggle);
          }
          else if (a.options.toggleBy &&
              a.options.toggleBy[0] &&
              a.options.toggleBy[0].target) {
            for (var t in a.options.toggleBy) {
              mUtil.addEvent(
                  a.options.toggleBy[t].target, 'click',
                  l.toggle);
            }
          }
          else {
            a.options.toggleBy && a.options.toggleBy.target &&
            mUtil.addEvent(a.options.toggleBy.target, 'click', l.toggle);
          }
        }
        var e = mUtil.get(a.options.closeBy);
        e && mUtil.addEvent(e, 'click', l.hide);
      },
      toggle: function() {
        l.eventTrigger('toggle'), 'shown' == a.state ? l.hide(this) : l.show(
            this);
      },
      show: function(t) {
        'shown' != a.state && (l.eventTrigger('beforeShow'), l.togglerClass(t,
            'show'), mUtil.addClass(o, a.classShown), mUtil.addClass(n,
            a.classShown), a.state = 'shown', a.options.overlay &&
        (a.overlay = mUtil.insertAfter(document.createElement('DIV'),
            n), mUtil.addClass(a.overlay, a.classOverlay), mUtil.addEvent(
            a.overlay, 'click', function(e) {
              e.stopPropagation(), e.preventDefault(), l.hide(t);
            })), l.eventTrigger('afterShow'));
      },
      hide: function(t) {
        'hidden' != a.state && (l.eventTrigger('beforeHide'), l.togglerClass(t,
            'hide'), mUtil.removeClass(o, a.classShown), mUtil.removeClass(n,
            a.classShown), a.state = 'hidden', a.options.overlay && a.overlay &&
        mUtil.remove(a.overlay), l.eventTrigger('afterHide'));
      },
      togglerClass: function(t, e) {
        var n, o = mUtil.attr(t, 'id');
        if (a.options.toggleBy && a.options.toggleBy[0] &&
            a.options.toggleBy[0].target) {
          for (var i in a.options.toggleBy) {
            a.options.toggleBy[i].target ===
            o && (n = a.options.toggleBy[i]);
          }
        }
        else {
          a.options.toggleBy &&
          a.options.toggleBy.target && (n = a.options.toggleBy);
        }
        if (n) {
          var l = mUtil.get(n.target);
          'show' === e && mUtil.addClass(l, n.state), 'hide' === e &&
          mUtil.removeClass(l, n.state);
        }
      },
      eventTrigger: function(t, e) {
        for (var n = 0; n < a.events.length; n++) {
          var o = a.events[n];
          o.name == t && (1 == o.one
              ? 0 == o.fired &&
              (a.events[n].fired = !0, o.handler.call(this, a, e))
              : o.handler.call(this, a, e));
        }
      },
      addEvent: function(t, e, n) {
        a.events.push({name: t, handler: e, one: n, fired: !1});
      },
    };
    return a.setDefaults = function(t) {i = t;}, a.hide = function() {return l.hide();}, a.show = function() {return l.show();}, a.on = function(
        t, e) {
      return l.addEvent(t, e);
    }, a.one = function(t, e) {return l.addEvent(t, e, !0);}, l.construct.apply(
        a, [e]), !0, a;
  }
}, mPortlet = function(t, e) {
  var a = this, n = mUtil.get(t), o = mUtil.get('body');
  if (n) {
    var l = {
      bodyToggleSpeed: 400,
      tooltips: !0,
      tools: {
        toggle: {collapse: 'Collapse', expand: 'Expand'},
        reload: 'Reload',
        remove: 'Remove',
        fullscreen: {on: 'Fullscreen', off: 'Exit Fullscreen'},
      },
      sticky: {offset: 300, zIndex: 101},
    }, r = {
      construct: function(t) {
        return mUtil.data(n).has('portlet')
            ? a = mUtil.data(n).get('portlet')
            : (r.init(t), r.build(), mUtil.data(n).set('portlet', a)), a;
      },
      init: function(t) {
        a.element = n, a.events = [], a.options = mUtil.deepExtend({}, l,
            t), a.head = mUtil.child(n,
            '.m-portlet__head'), a.foot = mUtil.child(n,
            '.m-portlet__foot'), mUtil.child(n, '.m-portlet__body')
            ? a.body = mUtil.child(n, '.m-portlet__body')
            : 0 !== mUtil.child(n, '.m-form').length &&
            (a.body = mUtil.child(n, '.m-form'));
      },
      build: function() {
        var t = mUtil.find(a.head, '[m-portlet-tool=remove]');
        t && mUtil.addEvent(t, 'click',
            function(t) {t.preventDefault(), r.remove();});
        var e = mUtil.find(a.head, '[m-portlet-tool=reload]');
        e && mUtil.addEvent(e, 'click',
            function(t) {t.preventDefault(), r.reload();});
        var n = mUtil.find(a.head, '[m-portlet-tool=toggle]');
        n && mUtil.addEvent(n, 'click',
            function(t) {t.preventDefault(), r.toggle();});
        var o = mUtil.find(a.head, '[m-portlet-tool=fullscreen]');
        o && mUtil.addEvent(o, 'click',
            function(t) {t.preventDefault(), r.fullscreen();}), r.setupTooltips();
      },
      onScrollSticky: function() {
        window.pageYOffset > a.options.sticky.offset
            ? !1 === mUtil.hasClass(o, 'm-portlet--sticky') &&
            (r.eventTrigger('stickyOn'), mUtil.addClass(o,
                'm-portlet--sticky'), mUtil.addClass(n,
                'm-portlet--sticky'), r.updateSticky())
            : mUtil.hasClass(o, 'm-portlet--sticky') &&
            (r.eventTrigger('stickyOff'), mUtil.removeClass(o,
                'm-portlet--sticky'), mUtil.removeClass(n,
                'm-portlet--sticky'), r.resetSticky());
      },
      initSticky: function() {
        a.head && window.addEventListener('scroll', r.onScrollSticky);
      },
      updateSticky: function() {
        var t, e, n;
        a.head && (mUtil.hasClass(o, 'm-portlet--sticky') &&
            (t = a.options.sticky.position.top instanceof Function ? parseInt(
                a.options.sticky.position.top.call()) : parseInt(
                a.options.sticky.position.top), e = a.options.sticky.position.left instanceof
            Function
                ? parseInt(a.options.sticky.position.left.call())
                : parseInt(
                    a.options.sticky.position.left), n = a.options.sticky.position.right instanceof
            Function
                ? parseInt(a.options.sticky.position.right.call())
                : parseInt(a.options.sticky.position.right), mUtil.css(a.head,
                'z-index', a.options.sticky.zIndex), mUtil.css(a.head, 'top',
                t + 'px'), mUtil.isRTL() ? (mUtil.css(a.head, 'left',
                n + 'px'), mUtil.css(a.head, 'right', e + 'px')) : (mUtil.css(
                a.head, 'left', e + 'px'), mUtil.css(a.head, 'right',
                n + 'px'))));
      },
      resetSticky: function() {
        a.head && !1 === mUtil.hasClass(o, 'm-portlet--sticky') &&
        (mUtil.css(a.head, 'z-index', ''), mUtil.css(a.head, 'top',
            ''), mUtil.css(a.head, 'left', ''), mUtil.css(a.head, 'right', ''));
      },
      destroySticky: function() {
        a.head && (r.resetSticky(), window.removeEventListener('scroll',
            r.onScrollSticky));
      },
      remove: function() {
        !1 !== r.eventTrigger('beforeRemove') &&
        (mUtil.hasClass(o, 'm-portlet--fullscreen') &&
        mUtil.hasClass(n, 'm-portlet--fullscreen') &&
        r.fullscreen('off'), r.removeTooltips(), mUtil.remove(
            n), r.eventTrigger('afterRemove'));
      },
      setContent: function(t) {t && (a.body.innerHTML = t);},
      getBody: function() {return a.body;},
      getSelf: function() {return n;},
      setupTooltips: function() {
        if (a.options.tooltips) {
          var t = mUtil.hasClass(n, 'm-portlet--collapse') ||
              mUtil.hasClass(n, 'm-portlet--collapsed'),
              e = mUtil.hasClass(o, 'm-portlet--fullscreen') &&
                  mUtil.hasClass(n, 'm-portlet--fullscreen'),
              i = mUtil.find(a.head, '[m-portlet-tool=remove]');
          if (i) {
            var l = e ? 'bottom' : 'top', r = new Tooltip(i, {
              title: a.options.tools.remove,
              placement: l,
              offset: e ? '0,10px,0,0' : '0,5px',
              trigger: 'hover',
              template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' +
                  l +
                  '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>',
            });
            mUtil.data(i).set('tooltip', r);
          }
          var s = mUtil.find(a.head, '[m-portlet-tool=reload]');
          if (s) {
            l = e ? 'bottom' : 'top', r = new Tooltip(s, {
              title: a.options.tools.reload,
              placement: l,
              offset: e ? '0,10px,0,0' : '0,5px',
              trigger: 'hover',
              template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' +
                  l +
                  '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>',
            });
            mUtil.data(s).set('tooltip', r);
          }
          var d = mUtil.find(a.head, '[m-portlet-tool=toggle]');
          if (d) {
            l = e ? 'bottom' : 'top', r = new Tooltip(d, {
              title: t
                  ? a.options.tools.toggle.expand
                  : a.options.tools.toggle.collapse,
              placement: l,
              offset: e ? '0,10px,0,0' : '0,5px',
              trigger: 'hover',
              template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' +
                  l +
                  '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>',
            });
            mUtil.data(d).set('tooltip', r);
          }
          var c = mUtil.find(a.head, '[m-portlet-tool=fullscreen]');
          if (c) {
            l = e ? 'bottom' : 'top', r = new Tooltip(c, {
              title: e
                  ? a.options.tools.fullscreen.off
                  : a.options.tools.fullscreen.on,
              placement: l,
              offset: e ? '0,10px,0,0' : '0,5px',
              trigger: 'hover',
              template: '<div class="m-tooltip m-tooltip--portlet tooltip bs-tooltip-' +
                  l +
                  '" role="tooltip">                            <div class="tooltip-arrow arrow"></div>                            <div class="tooltip-inner"></div>                        </div>',
            });
            mUtil.data(c).set('tooltip', r);
          }
        }
      },
      removeTooltips: function() {
        if (a.options.tooltips) {
          var t = mUtil.find(a.head, '[m-portlet-tool=remove]');
          t && mUtil.data(t).has('tooltip') &&
          mUtil.data(t).get('tooltip').dispose();
          var e = mUtil.find(a.head, '[m-portlet-tool=reload]');
          e && mUtil.data(e).has('tooltip') &&
          mUtil.data(e).get('tooltip').dispose();
          var n = mUtil.find(a.head, '[m-portlet-tool=toggle]');
          n && mUtil.data(n).has('tooltip') &&
          mUtil.data(n).get('tooltip').dispose();
          var o = mUtil.find(a.head, '[m-portlet-tool=fullscreen]');
          o && mUtil.data(o).has('tooltip') &&
          mUtil.data(o).get('tooltip').dispose();
        }
      },
      reload: function() {r.eventTrigger('reload');},
      toggle: function() {
        mUtil.hasClass(n, 'm-portlet--collapse') ||
        mUtil.hasClass(n, 'm-portlet--collapsed') ? r.expand() : r.collapse();
      },
      collapse: function() {
        if (!1 !== r.eventTrigger('beforeCollapse')) {
          mUtil.slideUp(a.body, a.options.bodyToggleSpeed,
              function() {r.eventTrigger('afterCollapse');}), mUtil.addClass(n,
              'm-portlet--collapse');
          var t = mUtil.find(a.head, '[m-portlet-tool=toggle]');
          t && mUtil.data(t).has('tooltip') && mUtil.data(t).
              get('tooltip').
              updateTitleContent(a.options.tools.toggle.expand);
        }
      },
      expand: function() {
        if (!1 !== r.eventTrigger('beforeExpand')) {
          mUtil.slideDown(a.body, a.options.bodyToggleSpeed,
              function() {r.eventTrigger('afterExpand');}), mUtil.removeClass(n,
              'm-portlet--collapse'), mUtil.removeClass(n,
              'm-portlet--collapsed');
          var t = mUtil.find(a.head, '[m-portlet-tool=toggle]');
          t && mUtil.data(t).has('tooltip') && mUtil.data(t).
              get('tooltip').
              updateTitleContent(a.options.tools.toggle.collapse);
        }
      },
      fullscreen: function(t) {
        if ('off' === t || mUtil.hasClass(o, 'm-portlet--fullscreen') &&
            mUtil.hasClass(n, 'm-portlet--fullscreen')) {
          r.eventTrigger(
              'beforeFullscreenOff'), mUtil.removeClass(o,
              'm-portlet--fullscreen'), mUtil.removeClass(n,
              'm-portlet--fullscreen'), r.removeTooltips(), r.setupTooltips(), a.foot &&
          (mUtil.css(a.body, 'margin-bottom', ''), mUtil.css(a.foot,
              'margin-top',
              '')), r.eventTrigger('afterFullscreenOff');
        }
        else {
          if (r.eventTrigger('beforeFullscreenOn'), mUtil.addClass(n,
              'm-portlet--fullscreen'), mUtil.addClass(o,
              'm-portlet--fullscreen'), r.removeTooltips(), r.setupTooltips(), a.foot) {
            var e = parseInt(mUtil.css(a.foot, 'height')),
                i = parseInt(mUtil.css(a.foot, 'height')) +
                    parseInt(mUtil.css(a.head, 'height'));
            mUtil.css(a.body, 'margin-bottom', e + 'px'), mUtil.css(a.foot,
                'margin-top', '-' + i + 'px');
          }
          r.eventTrigger('afterFullscreenOn');
        }
      },
      eventTrigger: function(t) {
        for (i = 0; i < a.events.length; i++) {
          var e = a.events[i];
          e.name == t && (1 == e.one
              ? 0 == e.fired &&
              (a.events[i].fired = !0, e.handler.call(this, a))
              : e.handler.call(this, a));
        }
      },
      addEvent: function(t, e, n) {
        return a.events.push({name: t, handler: e, one: n, fired: !1}), a;
      },
    };
    return a.setDefaults = function(t) {l = t;}, a.remove = function() {
      return r.remove(html);
    }, a.initSticky = function() {return r.initSticky();}, a.updateSticky = function() {return r.updateSticky();}, a.resetSticky = function() {return r.resetSticky();}, a.destroySticky = function() {return r.destroySticky();}, a.reload = function() {return r.reload();}, a.setContent = function(t) {
      return r.setContent(t);
    }, a.toggle = function() {return r.toggle();}, a.collapse = function() {return r.collapse();}, a.expand = function() {return r.expand();}, a.fullscreen = function() {
      return r.fullscreen('on');
    }, a.unFullscreen = function() {
      return r.fullscreen('off');
    }, a.getBody = function() {return r.getBody();}, a.getSelf = function() {return r.getSelf();}, a.on = function(
        t, e) {
      return r.addEvent(t, e);
    }, a.one = function(t, e) {return r.addEvent(t, e, !0);}, r.construct.apply(
        a, [e]), a;
  }
}, mQuicksearch = function(t, e) {
  var a = this, n = mUtil.get(t), o = mUtil.get('body');
  if (n) {
    var l = {
      mode: 'default',
      minLength: 1,
      maxHeight: 300,
      requestTimeout: 200,
      inputTarget: 'm_quicksearch_input',
      iconCloseTarget: 'm_quicksearch_close',
      iconCancelTarget: 'm_quicksearch_cancel',
      iconSearchTarget: 'm_quicksearch_search',
      spinnerClass: 'm-loader m-loader--skin-light m-loader--right',
      hasResultClass: 'm-list-search--has-result',
      templates: {error: '<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">{{message}}</div></div>'},
    }, r = {
      construct: function(t) {
        return mUtil.data(n).has('quicksearch')
            ? a = mUtil.data(n).get('quicksearch')
            : (r.init(t), r.build(), mUtil.data(n).set('quicksearch', a)), a;
      },
      init: function(t) {
        a.element = n, a.events = [], a.options = mUtil.deepExtend({}, l,
            t), a.query = '', a.form = mUtil.find(n,
            'form'), a.input = mUtil.get(
            a.options.inputTarget), a.iconClose = mUtil.get(
            a.options.iconCloseTarget), 'default' == a.options.mode &&
        (a.iconSearch = mUtil.get(
            a.options.iconSearchTarget), a.iconCancel = mUtil.get(
            a.options.iconCancelTarget)), a.dropdown = new mDropdown(n,
            {mobileOverlay: !1}), a.cancelTimeout, a.processing = !1, a.requestTimeout = !1;
      },
      build: function() {
        mUtil.addEvent(a.input, 'keyup', r.search), 'default' == a.options.mode
            ? (mUtil.addEvent(a.input, 'focus', r.showDropdown), mUtil.addEvent(
                a.iconCancel, 'click', r.handleCancel), mUtil.addEvent(
                a.iconSearch, 'click', function() {
                  mUtil.isInResponsiveRange('tablet-and-mobile') &&
                  (mUtil.addClass(o,
                      'm-header-search--mobile-expanded'), a.input.focus());
                }), mUtil.addEvent(a.iconClose, 'click', function() {
              mUtil.isInResponsiveRange('tablet-and-mobile') &&
              (mUtil.removeClass(o,
                  'm-header-search--mobile-expanded'), r.closeDropdown());
            }))
            : 'dropdown' == a.options.mode && (a.dropdown.on('afterShow',
            function() {a.input.focus();}), mUtil.addEvent(a.iconClose, 'click',
            r.closeDropdown));
      },
      showProgress: function() {
        return a.processing = !0, mUtil.addClass(a.form,
            a.options.spinnerClass), r.handleCancelIconVisibility('off'), a;
      },
      hideProgress: function() {
        return a.processing = !1, mUtil.removeClass(a.form,
            a.options.spinnerClass), r.handleCancelIconVisibility(
            'on'), mUtil.addClass(n, a.options.hasResultClass), a;
      },
      search: function(t) {
        if (a.query = a.input.value, 0 === a.query.length &&
        (r.handleCancelIconVisibility('on'), mUtil.removeClass(n,
            a.options.hasResultClass), mUtil.removeClass(a.form,
            a.options.spinnerClass)), !(a.query.length < a.options.minLength ||
            1 == a.processing)) {
          return a.requestTimeout && clearTimeout(
              a.requestTimeout), a.requestTimeout = !1, a.requestTimeout = setTimeout(
              function() {r.eventTrigger('search');},
              a.options.requestTimeout), a;
        }
      },
      handleCancelIconVisibility: function(t) {
        'on' == t ? 0 === a.input.value.length ? (a.iconCancel &&
        mUtil.css(a.iconCancel, 'visibility', 'hidden'), a.iconClose &&
        mUtil.css(a.iconClose, 'visibility', 'visible')) : (clearTimeout(
            a.cancelTimeout), a.cancelTimeout = setTimeout(function() {
          a.iconCancel &&
          mUtil.css(a.iconCancel, 'visibility', 'visible'), a.iconClose &&
          mUtil.css(a.iconClose, 'visibility', 'visible');
        }, 500)) : (a.iconCancel &&
        mUtil.css(a.iconCancel, 'visibility', 'hidden'), a.iconClose &&
        mUtil.css(a.iconClose, 'visibility', 'hidden'));
      },
      handleCancel: function(t) {
        a.input.value = '', mUtil.css(a.iconCancel, 'visibility',
            'hidden'), mUtil.removeClass(n,
            a.options.hasResultClass), r.closeDropdown();
      },
      closeDropdown: function() {a.dropdown.hide();},
      showDropdown: function(t) {
        0 == a.dropdown.isShown() && a.input.value.length >
        a.options.minLength && 0 == a.processing &&
        (console.log('show!!!'), a.dropdown.show(), t &&
        (t.preventDefault(), t.stopPropagation()));
      },
      eventTrigger: function(t) {
        for (i = 0; i < a.events.length; i++) {
          var e = a.events[i];
          e.name == t && (1 == e.one
              ? 0 == e.fired &&
              (a.events[i].fired = !0, e.handler.call(this, a))
              : e.handler.call(this, a));
        }
      },
      addEvent: function(t, e, n) {
        return a.events.push({name: t, handler: e, one: n, fired: !1}), a;
      },
    };
    return a.setDefaults = function(t) {l = t;}, a.search = function() {return r.handleSearch();}, a.showResult = function(t) {
      return a.dropdown.setContent(t), r.showDropdown(), a;
    }, a.showError = function(t) {
      var e = a.options.templates.error.replace('{{message}}', t);
      return a.dropdown.setContent(e), r.showDropdown(), a;
    }, a.showProgress = function() {return r.showProgress();}, a.hideProgress = function() {return r.hideProgress();}, a.search = function() {return r.search();}, a.on = function(
        t, e) {
      return r.addEvent(t, e);
    }, a.one = function(t, e) {return r.addEvent(t, e, !0);}, r.construct.apply(
        a, [e]), a;
  }
}, mScrollTop = function(t, e) {
  var a = this, n = mUtil.get(t), o = mUtil.get('body');
  if (n) {
    var i = {offset: 300, speed: 600}, l = {
      construct: function(t) {
        return mUtil.data(n).has('scrolltop')
            ? a = mUtil.data(n).get('scrolltop')
            : (l.init(t), l.build(), mUtil.data(n).set('scrolltop', a)), a;
      },
      init: function(t) {a.events = [], a.options = mUtil.deepExtend({}, i, t);},
      build: function() {
        navigator.userAgent.match(/iPhone|iPad|iPod/i)
            ? (window.addEventListener('touchend',
            function() {l.handle();}), window.addEventListener('touchcancel',
            function() {l.handle();}), window.addEventListener('touchleave',
            function() {l.handle();}))
            : window.addEventListener('scroll',
            function() {l.handle();}), mUtil.addEvent(n, 'click', l.scroll);
      },
      handle: function() {
        window.pageYOffset > a.options.offset
            ? mUtil.addClass(o, 'm-scroll-top--shown')
            : mUtil.removeClass(o, 'm-scroll-top--shown');
      },
      scroll: function(t) {
        t.preventDefault(), mUtil.scrollTop(0, a.options.speed);
      },
      eventTrigger: function(t, e) {
        for (var n = 0; n < a.events.length; n++) {
          var o = a.events[n];
          o.name == t && (1 == o.one
              ? 0 == o.fired &&
              (a.events[n].fired = !0, o.handler.call(this, a, e))
              : o.handler.call(this, a, e));
        }
      },
      addEvent: function(t, e, n) {
        a.events.push({name: t, handler: e, one: n, fired: !1});
      },
    };
    return a.setDefaults = function(t) {i = t;}, a.on = function(
        t, e) {
      return l.addEvent(t, e);
    }, a.one = function(t, e) {return l.addEvent(t, e, !0);}, l.construct.apply(
        a, [e]), !0, a;
  }
}, mToggle = function(t, e) {
  var a = this, n = mUtil.get(t);
  mUtil.get('body');
  if (n) {
    var o = {togglerState: '', targetState: ''}, l = {
      construct: function(t) {
        return mUtil.data(n).has('toggle')
            ? a = mUtil.data(n).get('toggle')
            : (l.init(t), l.build(), mUtil.data(n).set('toggle', a)), a;
      },
      init: function(t) {
        a.element = n, a.events = [], a.options = mUtil.deepExtend({}, o,
            t), a.target = mUtil.get(
            a.options.target), a.targetState = a.options.targetState, a.togglerState = a.options.togglerState, a.state = mUtil.hasClasses(
            a.target, a.targetState) ? 'on' : 'off';
      },
      build: function() {mUtil.addEvent(n, 'mouseup', l.toggle);},
      toggle: function() {
        return 'off' == a.state
            ? l.toggleOn()
            : l.toggleOff(), a;
      },
      toggleOn: function() {
        return l.eventTrigger('beforeOn'), mUtil.addClass(a.target,
            a.targetState), a.togglerState &&
        mUtil.addClass(n, a.togglerState), a.state = 'on', l.eventTrigger(
            'afterOn'), l.eventTrigger('toggle'), a;
      },
      toggleOff: function() {
        return l.eventTrigger('beforeOff'), mUtil.removeClass(a.target,
            a.targetState), a.togglerState &&
        mUtil.removeClass(n, a.togglerState), a.state = 'off', l.eventTrigger(
            'afterOff'), l.eventTrigger('toggle'), a;
      },
      eventTrigger: function(t) {
        for (i = 0; i < a.events.length; i++) {
          var e = a.events[i];
          e.name == t && (1 == e.one
              ? 0 == e.fired &&
              (a.events[i].fired = !0, e.handler.call(this, a))
              : e.handler.call(this, a));
        }
      },
      addEvent: function(t, e, n) {
        return a.events.push({name: t, handler: e, one: n, fired: !1}), a;
      },
    };
    return a.setDefaults = function(t) {o = t;}, a.getState = function() {return a.state;}, a.toggle = function() {return l.toggle();}, a.toggleOn = function() {return l.toggleOn();}, a.toggle = function() {return l.toggleOff();}, a.on = function(
        t, e) {
      return l.addEvent(t, e);
    }, a.one = function(t, e) {return l.addEvent(t, e, !0);}, l.construct.apply(
        a, [e]), a;
  }
}, mWizard = function(t, e) {
  var a = this, n = mUtil.get(t);
  mUtil.get('body');
  if (n) {
    var o = {startStep: 1, manualStepForward: !1}, l = {
      construct: function(t) {
        return mUtil.data(n).has('wizard')
            ? a = mUtil.data(n).get('wizard')
            : (l.init(t), l.build(), mUtil.data(n).set('wizard', a)), a;
      },
      init: function(t) {
        a.element = n, a.events = [], a.options = mUtil.deepExtend({}, o,
            t), a.steps = mUtil.findAll(n,
            '.m-wizard__step'), a.progress = mUtil.find(n,
            '.m-wizard__progress .progress-bar'), a.btnSubmit = mUtil.find(n,
            '[data-wizard-action="submit"]'), a.btnNext = mUtil.find(n,
            '[data-wizard-action="next"]'), a.btnPrev = mUtil.find(n,
            '[data-wizard-action="prev"]'), a.btnLast = mUtil.find(n,
            '[data-wizard-action="last"]'), a.btnFirst = mUtil.find(n,
            '[data-wizard-action="first"]'), a.events = [], a.currentStep = 1, a.stopped = !1, a.totalSteps = a.steps.length, a.options.startStep >
        1 && l.goTo(a.options.startStep), l.updateUI();
      },
      build: function() {
        mUtil.addEvent(a.btnNext, 'click',
            function(t) {t.preventDefault(), l.goNext();}), mUtil.addEvent(
            a.btnPrev, 'click',
            function(t) {t.preventDefault(), l.goPrev();}), mUtil.addEvent(
            a.btnFirst, 'click',
            function(t) {t.preventDefault(), l.goFirst();}), mUtil.addEvent(
            a.btnLast, 'click',
            function(t) {t.preventDefault(), l.goLast();}), mUtil.on(n,
            '.m-wizard__step a.m-wizard__step-number', 'click', function() {
              for (var t, e = this.closest(
                  '.m-wizard__step'), n = mUtil.parents(this,
                  '.m-wizard__steps'), o = mUtil.findAll(n,
                  '.m-wizard__step'), i = 0, r = o.length; i < r; i++) {
                if (e ===
                    o[i]) {
                  t = i + 1;
                  break;
                }
              }
              t && (!1 === a.options.manualStepForward ? t < a.currentStep &&
                  l.goTo(t) : l.goTo(t));
            });
      },
      goTo: function(t) {
        if (!(t === a.currentStep || t > a.totalSteps || t < 0)) {
          var e;
          if (e = (t = t ? parseInt(t) : l.getNextStep()) > a.currentStep
              ? l.eventTrigger('beforeNext')
              : l.eventTrigger('beforePrev'), !0 !== a.stopped) {
            return !1 !==
            e && (l.eventTrigger(
                'beforeChange'), a.currentStep = t, l.updateUI(), l.eventTrigger(
                'change')), t > a.startStep
                ? l.eventTrigger('afterNext')
                : l.eventTrigger('afterPrev'), a;
          }
          a.stopped = !1;
        }
      },
      setStepClass: function() {
        l.isLastStep()
            ? mUtil.addClass(n, 'm-wizard--step-last')
            : mUtil.removeClass(n, 'm-wizard--step-last'), l.isFirstStep()
            ? mUtil.addClass(n, 'm-wizard--step-first')
            : mUtil.removeClass(n, 'm-wizard--step-first'), l.isBetweenStep()
            ? mUtil.addClass(n, 'm-wizard--step-between')
            : mUtil.removeClass(n, 'm-wizard--step-between');
      },
      updateUI: function(t) {
        l.updateProgress(), l.handleTarget(), l.setStepClass();
        for (var e = 0, n = a.steps.length; e < n; e++) {
          mUtil.removeClass(
              a.steps[e], 'm-wizard__step--current m-wizard__step--done');
        }
        for (e = 1; e < a.currentStep; e++) {
          mUtil.addClass(a.steps[e - 1],
              'm-wizard__step--done');
        }
        mUtil.addClass(a.steps[a.currentStep - 1], 'm-wizard__step--current');
      },
      stop: function() {a.stopped = !0;},
      start: function() {a.stopped = !1;},
      isLastStep: function() {return a.currentStep === a.totalSteps;},
      isFirstStep: function() {return 1 === a.currentStep;},
      isBetweenStep: function() {
        return !1 === l.isLastStep() && !1 === l.isFirstStep();
      },
      goNext: function() {return l.goTo(l.getNextStep());},
      goPrev: function() {return l.goTo(l.getPrevStep());},
      goLast: function() {return l.goTo(a.totalSteps);},
      goFirst: function() {return l.goTo(1);},
      updateProgress: function() {
        if (a.progress) {
          if (mUtil.hasClass(n, 'm-wizard--1')) {
            var t = a.currentStep / a.totalSteps * 100,
                e = mUtil.find(n, '.m-wizard__step-number'),
                o = parseInt(mUtil.css(e, 'width'));
            mUtil.css(a.progress, 'width', 'calc(' + t + '% + ' + o / 2 + 'px)');
          }
          else if (mUtil.hasClass(n, 'm-wizard--2')) {
            a.currentStep;
            var i = (a.currentStep - 1) * (1 / (a.totalSteps - 1) * 100);
            mUtil.isInResponsiveRange('minimal-desktop-and-below') ? mUtil.css(
                a.progress, 'height', i + '%') : mUtil.css(a.progress, 'width',
                i + '%');
          }
          else {
            t = a.currentStep / a.totalSteps * 100;
            mUtil.css(a.progress, 'width', t + '%');
          }
        }
      },
      handleTarget: function() {
        var t = a.steps[a.currentStep - 1],
            e = mUtil.get(mUtil.attr(t, 'm-wizard-target')),
            o = mUtil.find(n, '.m-wizard__form-step--current');
        mUtil.removeClass(o, 'm-wizard__form-step--current'), mUtil.addClass(e,
            'm-wizard__form-step--current');
      },
      getNextStep: function() {
        return a.totalSteps >= a.currentStep + 1
            ? a.currentStep + 1
            : a.totalSteps;
      },
      getPrevStep: function() {
        return a.currentStep - 1 >= 1
            ? a.currentStep - 1
            : 1;
      },
      eventTrigger: function(t) {
        for (i = 0; i < a.events.length; i++) {
          var e = a.events[i];
          e.name == t && (1 == e.one
              ? 0 == e.fired &&
              (a.events[i].fired = !0, e.handler.call(this, a))
              : e.handler.call(this, a));
        }
      },
      addEvent: function(t, e, n) {
        return a.events.push({name: t, handler: e, one: n, fired: !1}), a;
      },
    };
    return a.setDefaults = function(t) {o = t;}, a.goNext = function() {return l.goNext();}, a.goPrev = function() {return l.goPrev();}, a.goLast = function() {return l.goLast();}, a.stop = function() {return l.stop();}, a.start = function() {return l.start();}, a.goFirst = function() {return l.goFirst();}, a.goTo = function(t) {
      return l.goTo(t);
    }, a.getStep = function() {return a.currentStep;}, a.isLastStep = function() {return l.isLastStep();}, a.isFirstStep = function() {return l.isFirstStep();}, a.on = function(
        t, e) {
      return l.addEvent(t, e);
    }, a.one = function(t, e) {return l.addEvent(t, e, !0);}, l.construct.apply(
        a, [e]), a;
  }
};
!function(t) {
  t.fn.mDatatable = t.fn.mDatatable ||
      {}, t.fn.mDatatable.checkbox = function(e, a) {
    var n = {
      selectedAllRows: !1,
      selectedRows: [],
      unselectedRows: [],
      init: function() {
        n.selectorEnabled() &&
        (e.setDataSourceParam(a.vars.selectedAllRows, !1), e.stateRemove(
            'checkbox'), a.vars.requestIds &&
        e.setDataSourceParam(a.vars.requestIds, !0), t(e).
            on('m-datatable--on-reloaded', function() {
              e.stateRemove('checkbox'), e.setDataSourceParam(
                  a.vars.selectedAllRows,
                  !1), n.selectedAllRows = !1, n.selectedRows = [], n.unselectedRows = [];
            }), n.selectedAllRows = e.getDataSourceParam(
            a.vars.selectedAllRows), t(e).
            on('m-datatable--on-layout-updated', function(a, o) {
              o.table == t(e.wrap).attr('id') &&
              e.ready(function() {n.initVars(), n.initEvent(), n.initSelect();});
            }), t(e).
            on('m-datatable--on-check', function(a, o) {
              o.forEach(function(t) {
                n.selectedRows.push(t), n.unselectedRows = n.remove(
                    n.unselectedRows, t);
              });
              var i = {};
              i.selectedRows = t.unique(
                  n.selectedRows), i.unselectedRows = t.unique(
                  n.unselectedRows), e.stateKeep('checkbox', i);
            }), t(e).
            on('m-datatable--on-uncheck', function(a, o) {
              o.forEach(function(t) {
                n.unselectedRows.push(t), n.selectedRows = n.remove(
                    n.selectedRows, t);
              });
              var i = {};
              i.selectedRows = t.unique(
                  n.selectedRows), i.unselectedRows = t.unique(
                  n.unselectedRows), e.stateKeep('checkbox', i);
            }));
      },
      initEvent: function() {
        t(e.tableHead).
            find('.m-checkbox--all > [type="checkbox"]').
            click(function(o) {
              if (n.selectedRows = n.unselectedRows = [], e.stateRemove(
                  'checkbox'), t(this).is(':checked')
                  ? n.selectedAllRows = !0
                  : n.selectedAllRows = !1, !a.vars.requestIds) {
                t(this).
                    is(':checked') && (n.selectedRows = t.makeArray(
                    t(e.tableBody).
                        find('.m-checkbox--single > [type="checkbox"]').
                        map(function(e, a) {return t(a).val();})));
                var i = {};
                i.selectedRows = t.unique(n.selectedRows), e.stateKeep(
                    'checkbox', i);
              }
              e.setDataSourceParam(a.vars.selectedAllRows,
                  n.selectedAllRows), t(e).
                  trigger('m-datatable--on-click-checkbox', [t(this)]);
            }), t(e.tableBody).
            find('.m-checkbox--single > [type="checkbox"]').
            click(function(o) {
              var i = t(this).val();
              t(this).is(':checked')
                  ? (n.selectedRows.push(i), n.unselectedRows = n.remove(
                  n.unselectedRows, i))
                  : (n.unselectedRows.push(i), n.selectedRows = n.remove(
                  n.selectedRows, i)), !a.vars.requestIds &&
              n.selectedRows.length < 1 && t(e.tableHead).
                  find('.m-checkbox--all > [type="checkbox"]').
                  prop('checked', !1);
              var l = {};
              l.selectedRows = t.unique(
                  n.selectedRows), l.unselectedRows = t.unique(
                  n.unselectedRows), e.stateKeep('checkbox', l), t(e).
                  trigger('m-datatable--on-click-checkbox', [t(this)]);
            });
      },
      initSelect: function() {
        n.selectedAllRows && a.vars.requestIds
            ? (e.hasClass('m-datatable--error') || t(e.tableHead).
                find('.m-checkbox--all > [type="checkbox"]').
                prop('checked', !0), e.setActiveAll(!0), n.unselectedRows.forEach(
            function(t) {e.setInactive(t);}))
            : (n.selectedRows.forEach(
            function(t) {e.setActive(t);}), !e.hasClass('m-datatable--error') &&
            t(e.tableBody).
                find('.m-checkbox--single > [type="checkbox"]').
                not(':checked').length < 1 && t(e.tableHead).
                find('.m-checkbox--all > [type="checkbox"]').
                prop('checked', !0));
      },
      selectorEnabled: function() {
        return t.grep(e.options.columns,
            function(t, e) {return t.selector || !1;})[0];
      },
      initVars: function() {
        var t = e.stateGet('checkbox');
        void 0 !== t && (n.selectedRows = t.selectedRows ||
            [], n.unselectedRows = t.unselectedRows || []);
      },
      getSelectedId: function(t) {
        if (n.initVars(), n.selectedAllRows && a.vars.requestIds) {
          void 0 === t && (t = a.vars.rowIds);
          var o = e.getObject(t, e.lastResponse) || [];
          return o.length > 0 && n.unselectedRows.forEach(
              function(t) {o = n.remove(o, parseInt(t));}), o;
        }
        return n.selectedRows;
      },
      remove: function(t, e) {return t.filter(function(t) {return t !== e;});},
    };
    return e.checkbox = function() {return n;}, 'object' == typeof a &&
    (a = t.extend(!0, {}, t.fn.mDatatable.checkbox.default, a), n.init.apply(
        this, [a])), e;
  }, t.fn.mDatatable.checkbox.default = {
    vars: {
      selectedAllRows: 'selectedAllRows',
      requestIds: 'requestIds',
      rowIds: 'meta.rowIds',
    },
  };
}(jQuery);
var mLayout = function() {
  var t, e, a;
  return {
    init: function() {this.initHeader(), this.initAside();},
    initHeader: function() {
      var t, e, n;
      e = mUtil.get('m_header'), n = {offset: {}, minimize: {}}, 'hide' ==
      mUtil.attr(e, 'm-minimize-mobile')
          ? (n.minimize.mobile = {}, n.minimize.mobile.on = 'm-header--hide', n.minimize.mobile.off = 'm-header--show')
          : n.minimize.mobile = !1, 'hide' == mUtil.attr(e, 'm-minimize')
          ? (n.minimize.desktop = {}, n.minimize.desktop.on = 'm-header--hide', n.minimize.desktop.off = 'm-header--show')
          : n.minimize.desktop = !1, (t = mUtil.attr(e, 'm-minimize-offset')) &&
      (n.offset.desktop = t), (t = mUtil.attr(e, 'm-minimize-mobile-offset')) &&
      (n.offset.mobile = t), header = new mHeader('m_header',
          n), a = new mOffcanvas('m_header_menu', {
        overlay: !0,
        baseClass: 'm-aside-header-menu-mobile',
        closeBy: 'm_aside_header_menu_mobile_close_btn',
        toggleBy: {
          target: 'm_aside_header_menu_mobile_toggle',
          state: 'm-brand__toggler--active',
        },
      }), new mMenu('m_header_menu', {
        submenu: {
          desktop: 'dropdown',
          tablet: 'accordion',
          mobile: 'accordion',
        }, accordion: {slideSpeed: 200, expandAll: !1},
      }), $('#m_aside_header_topbar_mobile_toggle').
          click(function() {$('body').toggleClass('m-topbar--on');}), 0 !==
      $('#m_quicksearch').length &&
      (quicksearch = new mQuicksearch('m_quicksearch', {
        mode: mUtil.attr('m_quicksearch', 'm-quicksearch-mode'),
        minLength: 1,
      }), quicksearch.on('search', function(t) {
        t.showProgress(), $.ajax({
          url: 'https://keenthemes.com/metronic/preview/inc/api/quick_search.php',
          data: {query: t.query},
          dataType: 'html',
          success: function(e) {t.hideProgress(), t.showResult(e);},
          error: function(e) {
            t.hideProgress(), t.showError(
                'Connection error. Pleae try again later.');
          },
        });
      })), new mScrollTop('m_scroll_top', {offset: 300, speed: 600})
    },
    initAside: function() {
      var a, n;
      a = mUtil.get("m_ver_menu"), n = "1" === mUtil.attr(a, "m-menu-dropdown")
          ? "dropdown"
          : "accordion", t = new mMenu("m_ver_menu", {
        submenu: {
          desktop: {
            default: n,
            state: {body: "m-aside-left--minimize", mode: "dropdown"}
          }, tablet: "accordion", mobile: "accordion"
        }, accordion: {autoScroll: !1, expandAll: !1}
      }), function() {
        var a = mUtil.get("m_aside_left"),
            n = mUtil.hasClass(a, "m-aside-left--offcanvas-default")
                ? "m-aside-left--offcanvas-default"
                : "m-aside-left";
        e = new mOffcanvas("m_aside_left", {
          baseClass: n,
          overlay: !0,
          closeBy: "m_aside_left_close_btn",
          toggleBy: {
            target: "m_aside_left_offcanvas_toggle",
            state: "m-brand__toggler--active"
          }
        });
        for (var o = mUtil.findAll(a,
            ".m-menu__item--submenu-fullheight .m-menu__submenu > .m-menu__wrapper"), i = 0, l = o.length; i <
             l; i++) {
          var r = o[i];
          mUtil.scrollerInit(r, {
            disableForMobile: !0,
            resetHeightOnDestroy: !0,
            handleWindowResize: !0,
            height: function() {return mUtil.getViewPort().height}
          }), t.on("submenuToggle", function(t, e) {
            e && r && r.contains(e) && mUtil.scrollerUpdate(r)
          })
        }
      }()
    },
    getAsideMenu: function() {return t},
    closeMobileAsideMenuOffcanvas: function() {
      mUtil.isMobileDevice() && e.hide()
    },
    closeMobileHorMenuOffcanvas: function() {mUtil.isMobileDevice() && a.hide()}
  }
}();
$(document).
    ready(function() {!1 === mUtil.isAngularVersion() && mLayout.init()});
var mQuickSidebar = function() {
  var t = $("#m_quick_sidebar"), e = $("#m_quick_sidebar_tabs"),
      a = t.find(".m-quick-sidebar__content"), n = function() {
        var a, n, o, i;
        a = mUtil.find(mUtil.get("m_quick_sidebar_tabs_messenger"),
            ".m-messenger__messages"), n = $(
            "#m_quick_sidebar_tabs_messenger .m-messenger__form"), mUtil.scrollerInit(
            a, {
              disableForMobile: !0,
              resetHeightOnDestroy: !1,
              handleWindowResize: !0,
              height: function() {
                return t.outerHeight(!0) - e.outerHeight(!0) - n.outerHeight(!0) -
                    120
              }
            }), (o = mUtil.find(mUtil.get("m_quick_sidebar_tabs_settings"),
            ".m-list-settings")) && mUtil.scrollerInit(o, {
          disableForMobile: !0,
          resetHeightOnDestroy: !1,
          handleWindowResize: !0,
          height: function() {
            return mUtil.getViewPort().height - e.outerHeight(!0) - 60
          }
        }), (i = mUtil.find(mUtil.get("m_quick_sidebar_tabs_logs"),
            ".m-list-timeline")) && mUtil.scrollerInit(i, {
          disableForMobile: !0,
          resetHeightOnDestroy: !1,
          handleWindowResize: !0,
          height: function() {
            return mUtil.getViewPort().height - e.outerHeight(!0) - 60
          }
        })
      };
  return {
    init: function() {
      0 !== t.length && new mOffcanvas("m_quick_sidebar", {
        overlay: !0,
        baseClass: "m-quick-sidebar",
        closeBy: "m_quick_sidebar_close",
        toggleBy: "m_quick_sidebar_toggle"
      }).one("afterShow", function() {
        mApp.block(t), setTimeout(
            function() {mApp.unblock(t), a.removeClass("m--hide"), n()}, 1e3)
      })
    }
  }
}();
$(document).ready(function() {mQuickSidebar.init()});

