/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(40)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssridKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Vue=e()}(this,function(){"use strict";function t(t){return void 0===t||null===t}function e(t){return void 0!==t&&null!==t}function n(t){return!0===t}function r(t){return"string"==typeof t||"number"==typeof t||"symbol"==typeof t||"boolean"==typeof t}function i(t){return null!==t&&"object"==typeof t}function o(t){return"[object Object]"===Nn.call(t)}function a(t){var e=parseFloat(String(t));return e>=0&&Math.floor(e)===e&&isFinite(t)}function s(t){return null==t?"":"object"==typeof t?JSON.stringify(t,null,2):String(t)}function c(t){var e=parseFloat(t);return isNaN(e)?t:e}function u(t,e){for(var n=Object.create(null),r=t.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return e?function(t){return n[t.toLowerCase()]}:function(t){return n[t]}}function l(t,e){if(t.length){var n=t.indexOf(e);if(n>-1)return t.splice(n,1)}}function f(t,e){return Mn.call(t,e)}function p(t){var e=Object.create(null);return function(n){return e[n]||(e[n]=t(n))}}function d(t,e){function n(n){var r=arguments.length;return r?r>1?t.apply(e,arguments):t.call(e,n):t.call(e)}return n._length=t.length,n}function v(t,e){e=e||0;for(var n=t.length-e,r=new Array(n);n--;)r[n]=t[n+e];return r}function h(t,e){for(var n in e)t[n]=e[n];return t}function m(t){for(var e={},n=0;n<t.length;n++)t[n]&&h(e,t[n]);return e}function y(t,e,n){}function g(t,e){if(t===e)return!0;var n=i(t),r=i(e);if(!n||!r)return!n&&!r&&String(t)===String(e);try{var o=Array.isArray(t),a=Array.isArray(e);if(o&&a)return t.length===e.length&&t.every(function(t,n){return g(t,e[n])});if(o||a)return!1;var s=Object.keys(t),c=Object.keys(e);return s.length===c.length&&s.every(function(n){return g(t[n],e[n])})}catch(t){return!1}}function _(t,e){for(var n=0;n<t.length;n++)if(g(t[n],e))return n;return-1}function b(t){var e=!1;return function(){e||(e=!0,t.apply(this,arguments))}}function $(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function C(t,e,n,r){Object.defineProperty(t,e,{value:n,enumerable:!!r,writable:!0,configurable:!0})}function w(t){return"function"==typeof t&&/native code/.test(t.toString())}function x(t){return new mr(void 0,void 0,void 0,String(t))}function k(t,e){var n=t.componentOptions,r=new mr(t.tag,t.data,t.children,t.text,t.elm,t.context,n,t.asyncFactory);return r.ns=t.ns,r.isStatic=t.isStatic,r.key=t.key,r.isComment=t.isComment,r.fnContext=t.fnContext,r.fnOptions=t.fnOptions,r.fnScopeId=t.fnScopeId,r.isCloned=!0,e&&(t.children&&(r.children=A(t.children,!0)),n&&n.children&&(n.children=A(n.children,!0))),r}function A(t,e){for(var n=t.length,r=new Array(n),i=0;i<n;i++)r[i]=k(t[i],e);return r}function O(t,e,n){t.__proto__=e}function S(t,e,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];C(t,o,e[o])}}function T(t,e){if(i(t)&&!(t instanceof mr)){var n;return f(t,"__ob__")&&t.__ob__ instanceof wr?n=t.__ob__:Cr.shouldConvert&&!ur()&&(Array.isArray(t)||o(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new wr(t)),e&&n&&n.vmCount++,n}}function E(t,e,n,r,i){var o=new vr,a=Object.getOwnPropertyDescriptor(t,e);if(!a||!1!==a.configurable){var s=a&&a.get,c=a&&a.set,u=!i&&T(n);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):n;return vr.target&&(o.depend(),u&&(u.dep.depend(),Array.isArray(e)&&I(e))),e},set:function(e){var r=s?s.call(t):n;e===r||e!=e&&r!=r||(c?c.call(t,e):n=e,u=!i&&T(e),o.notify())}})}}function j(t,e,n){if(Array.isArray(t)&&a(e))return t.length=Math.max(t.length,e),t.splice(e,1,n),n;if(e in t&&!(e in Object.prototype))return t[e]=n,n;var r=t.__ob__;return t._isVue||r&&r.vmCount?n:r?(E(r.value,e,n),r.dep.notify(),n):(t[e]=n,n)}function N(t,e){if(Array.isArray(t)&&a(e))t.splice(e,1);else{var n=t.__ob__;t._isVue||n&&n.vmCount||f(t,e)&&(delete t[e],n&&n.dep.notify())}}function I(t){for(var e=void 0,n=0,r=t.length;n<r;n++)(e=t[n])&&e.__ob__&&e.__ob__.dep.depend(),Array.isArray(e)&&I(e)}function L(t,e){if(!e)return t;for(var n,r,i,a=Object.keys(e),s=0;s<a.length;s++)r=t[n=a[s]],i=e[n],f(t,n)?o(r)&&o(i)&&L(r,i):j(t,n,i);return t}function M(t,e,n){return n?function(){var r="function"==typeof e?e.call(n,n):e,i="function"==typeof t?t.call(n,n):t;return r?L(r,i):i}:e?t?function(){return L("function"==typeof e?e.call(this,this):e,"function"==typeof t?t.call(this,this):t)}:e:t}function D(t,e){return e?t?t.concat(e):Array.isArray(e)?e:[e]:t}function P(t,e,n,r){var i=Object.create(t||null);return e?h(i,e):i}function F(t,e,n){function r(r){var i=xr[r]||Or;u[r]=i(t[r],e[r],n,r)}"function"==typeof e&&(e=e.options),function(t,e){var n=t.props;if(n){var r,i,a={};if(Array.isArray(n))for(r=n.length;r--;)"string"==typeof(i=n[r])&&(a[Pn(i)]={type:null});else if(o(n))for(var s in n)i=n[s],a[Pn(s)]=o(i)?i:{type:i};t.props=a}}(e),function(t,e){var n=t.inject;if(n){var r=t.inject={};if(Array.isArray(n))for(var i=0;i<n.length;i++)r[n[i]]={from:n[i]};else if(o(n))for(var a in n){var s=n[a];r[a]=o(s)?h({from:a},s):{from:s}}}}(e),function(t){var e=t.directives;if(e)for(var n in e){var r=e[n];"function"==typeof r&&(e[n]={bind:r,update:r})}}(e);var i=e.extends;if(i&&(t=F(t,i,n)),e.mixins)for(var a=0,s=e.mixins.length;a<s;a++)t=F(t,e.mixins[a],n);var c,u={};for(c in t)r(c);for(c in e)f(t,c)||r(c);return u}function R(t,e,n,r){if("string"==typeof n){var i=t[e];if(f(i,n))return i[n];var o=Pn(n);if(f(i,o))return i[o];var a=Fn(o);if(f(i,a))return i[a];return i[n]||i[o]||i[a]}}function H(t,e,n,r){var i=e[t],o=!f(n,t),a=n[t];if(U(Boolean,i.type)&&(o&&!f(i,"default")?a=!1:U(String,i.type)||""!==a&&a!==Hn(t)||(a=!0)),void 0===a){a=function(t,e,n){if(!f(e,"default"))return;var r=e.default;if(t&&t.$options.propsData&&void 0===t.$options.propsData[n]&&void 0!==t._props[n])return t._props[n];return"function"==typeof r&&"Function"!==B(e.type)?r.call(t):r}(r,i,t);var s=Cr.shouldConvert;Cr.shouldConvert=!0,T(a),Cr.shouldConvert=s}return a}function B(t){var e=t&&t.toString().match(/^\s*function (\w+)/);return e?e[1]:""}function U(t,e){if(!Array.isArray(e))return B(e)===B(t);for(var n=0,r=e.length;n<r;n++)if(B(e[n])===B(t))return!0;return!1}function V(t,e,n){if(e)for(var r=e;r=r.$parent;){var i=r.$options.errorCaptured;if(i)for(var o=0;o<i.length;o++)try{if(!1===i[o].call(r,t,e,n))return}catch(t){z(t,r,"errorCaptured hook")}}z(t,e,n)}function z(t,e,n){if(Jn.errorHandler)try{return Jn.errorHandler.call(null,t,e,n)}catch(t){K(t,null,"config.errorHandler")}K(t,e,n)}function K(t,e,n){if(!Gn&&!Zn||"undefined"==typeof console)throw t;console.error(t)}function J(){Tr=!1;var t=Sr.slice(0);Sr.length=0;for(var e=0;e<t.length;e++)t[e]()}function q(t,e){var n;if(Sr.push(function(){if(t)try{t.call(e)}catch(t){V(t,e,"nextTick")}else n&&n(e)}),Tr||(Tr=!0,Er?Ar():kr()),!t&&"undefined"!=typeof Promise)return new Promise(function(t){n=t})}function W(t){G(t,Mr),Mr.clear()}function G(t,e){var n,r,o=Array.isArray(t);if((o||i(t))&&!Object.isFrozen(t)){if(t.__ob__){var a=t.__ob__.dep.id;if(e.has(a))return;e.add(a)}if(o)for(n=t.length;n--;)G(t[n],e);else for(n=(r=Object.keys(t)).length;n--;)G(t[r[n]],e)}}function Z(t){function e(){var t=arguments,n=e.fns;if(!Array.isArray(n))return n.apply(null,arguments);for(var r=n.slice(),i=0;i<r.length;i++)r[i].apply(null,t)}return e.fns=t,e}function X(e,n,r,i,o){var a,s,c,u;for(a in e)s=e[a],c=n[a],u=Dr(a),t(s)||(t(c)?(t(s.fns)&&(s=e[a]=Z(s)),r(u.name,s,u.once,u.capture,u.passive,u.params)):s!==c&&(c.fns=s,e[a]=c));for(a in n)t(e[a])&&i((u=Dr(a)).name,n[a],u.capture)}function Y(r,i,o){function a(){o.apply(this,arguments),l(s.fns,a)}r instanceof mr&&(r=r.data.hook||(r.data.hook={}));var s,c=r[i];t(c)?s=Z([a]):e(c.fns)&&n(c.merged)?(s=c).fns.push(a):s=Z([c,a]),s.merged=!0,r[i]=s}function Q(t,n,r,i,o){if(e(n)){if(f(n,r))return t[r]=n[r],o||delete n[r],!0;if(f(n,i))return t[r]=n[i],o||delete n[i],!0}return!1}function tt(t){return e(t)&&e(t.text)&&function(t){return!1===t}(t.isComment)}function et(i,o){var a,s,c,u,l=[];for(a=0;a<i.length;a++)t(s=i[a])||"boolean"==typeof s||(u=l[c=l.length-1],Array.isArray(s)?s.length>0&&(tt((s=et(s,(o||"")+"_"+a))[0])&&tt(u)&&(l[c]=x(u.text+s[0].text),s.shift()),l.push.apply(l,s)):r(s)?tt(u)?l[c]=x(u.text+s):""!==s&&l.push(x(s)):tt(s)&&tt(u)?l[c]=x(u.text+s.text):(n(i._isVList)&&e(s.tag)&&t(s.key)&&e(o)&&(s.key="__vlist"+o+"_"+a+"__"),l.push(s)));return l}function nt(t,e){return(t.__esModule||fr&&"Module"===t[Symbol.toStringTag])&&(t=t.default),i(t)?e.extend(t):t}function rt(t){return t.isComment&&t.asyncFactory}function it(t){if(Array.isArray(t))for(var n=0;n<t.length;n++){var r=t[n];if(e(r)&&(e(r.componentOptions)||rt(r)))return r}}function ot(t,e,n){n?Lr.$once(t,e):Lr.$on(t,e)}function at(t,e){Lr.$off(t,e)}function st(t,e,n){Lr=t,X(e,n||{},ot,at),Lr=void 0}function ct(t,e){var n={};if(!t)return n;for(var r=0,i=t.length;r<i;r++){var o=t[r],a=o.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot,o.context!==e&&o.fnContext!==e||!a||null==a.slot)(n.default||(n.default=[])).push(o);else{var s=a.slot,c=n[s]||(n[s]=[]);"template"===o.tag?c.push.apply(c,o.children||[]):c.push(o)}}for(var u in n)n[u].every(ut)&&delete n[u];return n}function ut(t){return t.isComment&&!t.asyncFactory||" "===t.text}function lt(t,e){e=e||{};for(var n=0;n<t.length;n++)Array.isArray(t[n])?lt(t[n],e):e[t[n].key]=t[n].fn;return e}function ft(t){for(;t&&(t=t.$parent);)if(t._inactive)return!0;return!1}function pt(t,e){if(e){if(t._directInactive=!1,ft(t))return}else if(t._directInactive)return;if(t._inactive||null===t._inactive){t._inactive=!1;for(var n=0;n<t.$children.length;n++)pt(t.$children[n]);vt(t,"activated")}}function dt(t,e){if(!(e&&(t._directInactive=!0,ft(t))||t._inactive)){t._inactive=!0;for(var n=0;n<t.$children.length;n++)dt(t.$children[n]);vt(t,"deactivated")}}function vt(t,e){var n=t.$options[e];if(n)for(var r=0,i=n.length;r<i;r++)try{n[r].call(t)}catch(n){V(n,t,e+" hook")}t._hasHookEvent&&t.$emit("hook:"+e)}function ht(){Ur=!0;var t,e;for(Fr.sort(function(t,e){return t.id-e.id}),Vr=0;Vr<Fr.length;Vr++)e=(t=Fr[Vr]).id,Hr[e]=null,t.run();var n=Rr.slice(),r=Fr.slice();Vr=Fr.length=Rr.length=0,Hr={},Br=Ur=!1,function(t){for(var e=0;e<t.length;e++)t[e]._inactive=!0,pt(t[e],!0)}(n),function(t){var e=t.length;for(;e--;){var n=t[e],r=n.vm;r._watcher===n&&r._isMounted&&vt(r,"updated")}}(r),lr&&Jn.devtools&&lr.emit("flush")}function mt(t,e,n){Jr.get=function(){return this[e][n]},Jr.set=function(t){this[e][n]=t},Object.defineProperty(t,n,Jr)}function yt(t){t._watchers=[];var e=t.$options;e.props&&function(t,e){var n=t.$options.propsData||{},r=t._props={},i=t.$options._propKeys=[],o=!t.$parent;Cr.shouldConvert=o;var a=function(o){i.push(o);var a=H(o,e,n,t);E(r,o,a),o in t||mt(t,"_props",o)};for(var s in e)a(s);Cr.shouldConvert=!0}(t,e.props),e.methods&&function(t,e){t.$options.props;for(var n in e)t[n]=null==e[n]?y:d(e[n],t)}(t,e.methods),e.data?function(t){var e=t.$options.data;e=t._data="function"==typeof e?function(t,e){try{return t.call(e,e)}catch(t){return V(t,e,"data()"),{}}}(e,t):e||{},o(e)||(e={});var n=Object.keys(e),r=t.$options.props,i=(t.$options.methods,n.length);for(;i--;){var a=n[i];r&&f(r,a)||$(a)||mt(t,"_data",a)}T(e,!0)}(t):T(t._data={},!0),e.computed&&function(t,e){var n=t._computedWatchers=Object.create(null),r=ur();for(var i in e){var o=e[i],a="function"==typeof o?o:o.get;r||(n[i]=new Kr(t,a||y,y,qr)),i in t||gt(t,i,o)}}(t,e.computed),e.watch&&e.watch!==ir&&function(t,e){for(var n in e){var r=e[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)bt(t,n,r[i]);else bt(t,n,r)}}(t,e.watch)}function gt(t,e,n){var r=!ur();"function"==typeof n?(Jr.get=r?_t(e):n,Jr.set=y):(Jr.get=n.get?r&&!1!==n.cache?_t(e):n.get:y,Jr.set=n.set?n.set:y),Object.defineProperty(t,e,Jr)}function _t(t){return function(){var e=this._computedWatchers&&this._computedWatchers[t];if(e)return e.dirty&&e.evaluate(),vr.target&&e.depend(),e.value}}function bt(t,e,n,r){return o(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=t[n]),t.$watch(e,n,r)}function $t(t,e){if(t){for(var n=Object.create(null),r=fr?Reflect.ownKeys(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}):Object.keys(t),i=0;i<r.length;i++){for(var o=r[i],a=t[o].from,s=e;s;){if(s._provided&&a in s._provided){n[o]=s._provided[a];break}s=s.$parent}if(!s&&"default"in t[o]){var c=t[o].default;n[o]="function"==typeof c?c.call(e):c}}return n}}function Ct(t,n){var r,o,a,s,c;if(Array.isArray(t)||"string"==typeof t)for(r=new Array(t.length),o=0,a=t.length;o<a;o++)r[o]=n(t[o],o);else if("number"==typeof t)for(r=new Array(t),o=0;o<t;o++)r[o]=n(o+1,o);else if(i(t))for(s=Object.keys(t),r=new Array(s.length),o=0,a=s.length;o<a;o++)c=s[o],r[o]=n(t[c],c,o);return e(r)&&(r._isVList=!0),r}function wt(t,e,n,r){var i,o=this.$scopedSlots[t];if(o)n=n||{},r&&(n=h(h({},r),n)),i=o(n)||e;else{var a=this.$slots[t];a&&(a._rendered=!0),i=a||e}var s=n&&n.slot;return s?this.$createElement("template",{slot:s},i):i}function xt(t){return R(this.$options,"filters",t)||Un}function kt(t,e,n,r){var i=Jn.keyCodes[e]||n;return i?Array.isArray(i)?-1===i.indexOf(t):i!==t:r?Hn(r)!==e:void 0}function At(t,e,n,r,o){if(n)if(i(n)){Array.isArray(n)&&(n=m(n));var a,s=function(i){if("class"===i||"style"===i||Ln(i))a=t;else{var s=t.attrs&&t.attrs.type;a=r||Jn.mustUseProp(e,s,i)?t.domProps||(t.domProps={}):t.attrs||(t.attrs={})}if(!(i in a)&&(a[i]=n[i],o)){(t.on||(t.on={}))["update:"+i]=function(t){n[i]=t}}};for(var c in n)s(c)}else;return t}function Ot(t,e){var n=this._staticTrees||(this._staticTrees=[]),r=n[t];return r&&!e?Array.isArray(r)?A(r):k(r):(r=n[t]=this.$options.staticRenderFns[t].call(this._renderProxy,null,this),Tt(r,"__static__"+t,!1),r)}function St(t,e,n){return Tt(t,"__once__"+e+(n?"_"+n:""),!0),t}function Tt(t,e,n){if(Array.isArray(t))for(var r=0;r<t.length;r++)t[r]&&"string"!=typeof t[r]&&Et(t[r],e+"_"+r,n);else Et(t,e,n)}function Et(t,e,n){t.isStatic=!0,t.key=e,t.isOnce=n}function jt(t,e){if(e)if(o(e)){var n=t.on=t.on?h({},t.on):{};for(var r in e){var i=n[r],a=e[r];n[r]=i?[].concat(i,a):a}}else;return t}function Nt(t){t._o=St,t._n=c,t._s=s,t._l=Ct,t._t=wt,t._q=g,t._i=_,t._m=Ot,t._f=xt,t._k=kt,t._b=At,t._v=x,t._e=gr,t._u=lt,t._g=jt}function It(t,e,r,i,o){var a=o.options;this.data=t,this.props=e,this.children=r,this.parent=i,this.listeners=t.on||jn,this.injections=$t(a.inject,i),this.slots=function(){return ct(r,i)};var s=Object.create(i),c=n(a._compiled),u=!c;c&&(this.$options=a,this.$slots=this.slots(),this.$scopedSlots=t.scopedSlots||jn),a._scopeId?this._c=function(t,e,n,r){var o=Dt(s,t,e,n,r,u);return o&&(o.fnScopeId=a._scopeId,o.fnContext=i),o}:this._c=function(t,e,n,r){return Dt(s,t,e,n,r,u)}}function Lt(t,e){for(var n in e)t[Pn(n)]=e[n]}function Mt(r,o,a,s,c){if(!t(r)){var u=a.$options._base;if(i(r)&&(r=u.extend(r)),"function"==typeof r){var l;if(t(r.cid)&&(l=r,void 0===(r=function(r,o,a){if(n(r.error)&&e(r.errorComp))return r.errorComp;if(e(r.resolved))return r.resolved;if(n(r.loading)&&e(r.loadingComp))return r.loadingComp;if(!e(r.contexts)){var s=r.contexts=[a],c=!0,u=function(){for(var t=0,e=s.length;t<e;t++)s[t].$forceUpdate()},l=b(function(t){r.resolved=nt(t,o),c||u()}),f=b(function(t){e(r.errorComp)&&(r.error=!0,u())}),p=r(l,f);return i(p)&&("function"==typeof p.then?t(r.resolved)&&p.then(l,f):e(p.component)&&"function"==typeof p.component.then&&(p.component.then(l,f),e(p.error)&&(r.errorComp=nt(p.error,o)),e(p.loading)&&(r.loadingComp=nt(p.loading,o),0===p.delay?r.loading=!0:setTimeout(function(){t(r.resolved)&&t(r.error)&&(r.loading=!0,u())},p.delay||200)),e(p.timeout)&&setTimeout(function(){t(r.resolved)&&f(null)},p.timeout))),c=!1,r.loading?r.loadingComp:r.resolved}r.contexts.push(a)}(l,u,a))))return function(t,e,n,r,i){var o=gr();return o.asyncFactory=t,o.asyncMeta={data:e,context:n,children:r,tag:i},o}(l,o,a,s,c);o=o||{},Ft(r),e(o.model)&&function(t,n){var r=t.model&&t.model.prop||"value",i=t.model&&t.model.event||"input";(n.props||(n.props={}))[r]=n.model.value;var o=n.on||(n.on={});e(o[i])?o[i]=[n.model.callback].concat(o[i]):o[i]=n.model.callback}(r.options,o);var f=function(n,r,i){var o=r.options.props;if(!t(o)){var a={},s=n.attrs,c=n.props;if(e(s)||e(c))for(var u in o){var l=Hn(u);Q(a,c,u,l,!0)||Q(a,s,u,l,!1)}return a}}(o,r);if(n(r.options.functional))return function(t,n,r,i,o){var a=t.options,s={},c=a.props;if(e(c))for(var u in c)s[u]=H(u,c,n||jn);else e(r.attrs)&&Lt(s,r.attrs),e(r.props)&&Lt(s,r.props);var l=new It(r,s,o,i,t),f=a.render.call(null,l._c,l);return f instanceof mr&&(f.fnContext=i,f.fnOptions=a,r.slot&&((f.data||(f.data={})).slot=r.slot)),f}(r,f,o,a,s);var p=o.on;if(o.on=o.nativeOn,n(r.options.abstract)){var d=o.slot;o={},d&&(o.slot=d)}!function(t){t.hook||(t.hook={});for(var e=0;e<Gr.length;e++){var n=Gr[e],r=t.hook[n],i=Wr[n];t.hook[n]=r?function(t,e){return function(n,r,i,o){t(n,r,i,o),e(n,r,i,o)}}(i,r):i}}(o);var v=r.options.name||c;return new mr("vue-component-"+r.cid+(v?"-"+v:""),o,void 0,void 0,void 0,a,{Ctor:r,propsData:f,listeners:p,tag:c,children:s},l)}}}function Dt(t,i,o,a,s,c){return(Array.isArray(o)||r(o))&&(s=a,a=o,o=void 0),n(c)&&(s=Xr),function(t,n,i,o,a){if(e(i)&&e(i.__ob__))return gr();e(i)&&e(i.is)&&(n=i.is);if(!n)return gr();Array.isArray(o)&&"function"==typeof o[0]&&((i=i||{}).scopedSlots={default:o[0]},o.length=0);a===Xr?o=function(t){return r(t)?[x(t)]:Array.isArray(t)?et(t):void 0}(o):a===Zr&&(o=function(t){for(var e=0;e<t.length;e++)if(Array.isArray(t[e]))return Array.prototype.concat.apply([],t);return t}(o));var s,c;if("string"==typeof n){var u;c=t.$vnode&&t.$vnode.ns||Jn.getTagNamespace(n),s=Jn.isReservedTag(n)?new mr(Jn.parsePlatformTagName(n),i,o,void 0,void 0,t):e(u=R(t.$options,"components",n))?Mt(u,i,t,o,n):new mr(n,i,o,void 0,void 0,t)}else s=Mt(n,i,t,o);return e(s)?(c&&Pt(s,c),s):gr()}(t,i,o,a,s)}function Pt(r,i,o){if(r.ns=i,"foreignObject"===r.tag&&(i=void 0,o=!0),e(r.children))for(var a=0,s=r.children.length;a<s;a++){var c=r.children[a];e(c.tag)&&(t(c.ns)||n(o))&&Pt(c,i,o)}}function Ft(t){var e=t.options;if(t.super){var n=Ft(t.super);if(n!==t.superOptions){t.superOptions=n;var r=function(t){var e,n=t.options,r=t.extendOptions,i=t.sealedOptions;for(var o in n)n[o]!==i[o]&&(e||(e={}),e[o]=function(t,e,n){{if(Array.isArray(t)){var r=[];n=Array.isArray(n)?n:[n],e=Array.isArray(e)?e:[e];for(var i=0;i<t.length;i++)(e.indexOf(t[i])>=0||n.indexOf(t[i])<0)&&r.push(t[i]);return r}return t}}(n[o],r[o],i[o]));return e}(t);r&&h(t.extendOptions,r),(e=t.options=F(n,t.extendOptions)).name&&(e.components[e.name]=t)}}return e}function Rt(t){this._init(t)}function Ht(t){t.cid=0;var e=1;t.extend=function(t){t=t||{};var n=this,r=n.cid,i=t._Ctor||(t._Ctor={});if(i[r])return i[r];var o=t.name||n.options.name,a=function(t){this._init(t)};return a.prototype=Object.create(n.prototype),a.prototype.constructor=a,a.cid=e++,a.options=F(n.options,t),a.super=n,a.options.props&&function(t){var e=t.options.props;for(var n in e)mt(t.prototype,"_props",n)}(a),a.options.computed&&function(t){var e=t.options.computed;for(var n in e)gt(t.prototype,n,e[n])}(a),a.extend=n.extend,a.mixin=n.mixin,a.use=n.use,zn.forEach(function(t){a[t]=n[t]}),o&&(a.options.components[o]=a),a.superOptions=n.options,a.extendOptions=t,a.sealedOptions=h({},a.options),i[r]=a,a}}function Bt(t){return t&&(t.Ctor.options.name||t.tag)}function Ut(t,e){return Array.isArray(t)?t.indexOf(e)>-1:"string"==typeof t?t.split(",").indexOf(e)>-1:!!function(t){return"[object RegExp]"===Nn.call(t)}(t)&&t.test(e)}function Vt(t,e){var n=t.cache,r=t.keys,i=t._vnode;for(var o in n){var a=n[o];if(a){var s=Bt(a.componentOptions);s&&!e(s)&&zt(n,o,r,i)}}}function zt(t,e,n,r){var i=t[e];!i||r&&i.tag===r.tag||i.componentInstance.$destroy(),t[e]=null,l(n,e)}function Kt(t){for(var n=t.data,r=t,i=t;e(i.componentInstance);)(i=i.componentInstance._vnode)&&i.data&&(n=Jt(i.data,n));for(;e(r=r.parent);)r&&r.data&&(n=Jt(n,r.data));return function(t,n){if(e(t)||e(n))return qt(t,Wt(n));return""}(n.staticClass,n.class)}function Jt(t,n){return{staticClass:qt(t.staticClass,n.staticClass),class:e(t.class)?[t.class,n.class]:n.class}}function qt(t,e){return t?e?t+" "+e:t:e||""}function Wt(t){return Array.isArray(t)?function(t){for(var n,r="",i=0,o=t.length;i<o;i++)e(n=Wt(t[i]))&&""!==n&&(r&&(r+=" "),r+=n);return r}(t):i(t)?function(t){var e="";for(var n in t)t[n]&&(e&&(e+=" "),e+=n);return e}(t):"string"==typeof t?t:""}function Gt(t){return bi(t)?"svg":"math"===t?"math":void 0}function Zt(t){if("string"==typeof t){var e=document.querySelector(t);return e||document.createElement("div")}return t}function Xt(t,e){var n=t.data.ref;if(n){var r=t.context,i=t.componentInstance||t.elm,o=r.$refs;e?Array.isArray(o[n])?l(o[n],i):o[n]===i&&(o[n]=void 0):t.data.refInFor?Array.isArray(o[n])?o[n].indexOf(i)<0&&o[n].push(i):o[n]=[i]:o[n]=i}}function Yt(r,i){return r.key===i.key&&(r.tag===i.tag&&r.isComment===i.isComment&&e(r.data)===e(i.data)&&function(t,n){if("input"!==t.tag)return!0;var r,i=e(r=t.data)&&e(r=r.attrs)&&r.type,o=e(r=n.data)&&e(r=r.attrs)&&r.type;return i===o||wi(i)&&wi(o)}(r,i)||n(r.isAsyncPlaceholder)&&r.asyncFactory===i.asyncFactory&&t(i.asyncFactory.error))}function Qt(t,n,r){var i,o,a={};for(i=n;i<=r;++i)e(o=t[i].key)&&(a[o]=i);return a}function te(t,e){(t.data.directives||e.data.directives)&&function(t,e){var n,r,i,o=t===Ai,a=e===Ai,s=ee(t.data.directives,t.context),c=ee(e.data.directives,e.context),u=[],l=[];for(n in c)r=s[n],i=c[n],r?(i.oldValue=r.value,ne(i,"update",e,t),i.def&&i.def.componentUpdated&&l.push(i)):(ne(i,"bind",e,t),i.def&&i.def.inserted&&u.push(i));if(u.length){var f=function(){for(var n=0;n<u.length;n++)ne(u[n],"inserted",e,t)};o?Y(e,"insert",f):f()}l.length&&Y(e,"postpatch",function(){for(var n=0;n<l.length;n++)ne(l[n],"componentUpdated",e,t)});if(!o)for(n in s)c[n]||ne(s[n],"unbind",t,t,a)}(t,e)}function ee(t,e){var n=Object.create(null);if(!t)return n;var r,i;for(r=0;r<t.length;r++)(i=t[r]).modifiers||(i.modifiers=Ti),n[function(t){return t.rawName||t.name+"."+Object.keys(t.modifiers||{}).join(".")}(i)]=i,i.def=R(e.$options,"directives",i.name);return n}function ne(t,e,n,r,i){var o=t.def&&t.def[e];if(o)try{o(n.elm,t,n,r,i)}catch(r){V(r,n.context,"directive "+t.name+" "+e+" hook")}}function re(n,r){var i=r.componentOptions;if(!(e(i)&&!1===i.Ctor.options.inheritAttrs||t(n.data.attrs)&&t(r.data.attrs))){var o,a,s=r.elm,c=n.data.attrs||{},u=r.data.attrs||{};e(u.__ob__)&&(u=r.data.attrs=h({},u));for(o in u)a=u[o],c[o]!==a&&ie(s,o,a);(Qn||er)&&u.value!==c.value&&ie(s,"value",u.value);for(o in c)t(u[o])&&(hi(o)?s.removeAttributeNS(vi,mi(o)):pi(o)||s.removeAttribute(o))}}function ie(t,e,n){if(di(e))yi(n)?t.removeAttribute(e):(n="allowfullscreen"===e&&"EMBED"===t.tagName?"true":e,t.setAttribute(e,n));else if(pi(e))t.setAttribute(e,yi(n)||"false"===n?"false":"true");else if(hi(e))yi(n)?t.removeAttributeNS(vi,mi(e)):t.setAttributeNS(vi,e,n);else if(yi(n))t.removeAttribute(e);else{if(Qn&&!tr&&"TEXTAREA"===t.tagName&&"placeholder"===e&&!t.__ieph){var r=function(e){e.stopImmediatePropagation(),t.removeEventListener("input",r)};t.addEventListener("input",r),t.__ieph=!0}t.setAttribute(e,n)}}function oe(n,r){var i=r.elm,o=r.data,a=n.data;if(!(t(o.staticClass)&&t(o.class)&&(t(a)||t(a.staticClass)&&t(a.class)))){var s=Kt(r),c=i._transitionClasses;e(c)&&(s=qt(s,Wt(c))),s!==i._prevClass&&(i.setAttribute("class",s),i._prevClass=s)}}function ae(t){function e(){(a||(a=[])).push(t.slice(v,i).trim()),v=i+1}var n,r,i,o,a,s=!1,c=!1,u=!1,l=!1,f=0,p=0,d=0,v=0;for(i=0;i<t.length;i++)if(r=n,n=t.charCodeAt(i),s)39===n&&92!==r&&(s=!1);else if(c)34===n&&92!==r&&(c=!1);else if(u)96===n&&92!==r&&(u=!1);else if(l)47===n&&92!==r&&(l=!1);else if(124!==n||124===t.charCodeAt(i+1)||124===t.charCodeAt(i-1)||f||p||d){switch(n){case 34:c=!0;break;case 39:s=!0;break;case 96:u=!0;break;case 40:d++;break;case 41:d--;break;case 91:p++;break;case 93:p--;break;case 123:f++;break;case 125:f--}if(47===n){for(var h=i-1,m=void 0;h>=0&&" "===(m=t.charAt(h));h--);m&&Ii.test(m)||(l=!0)}}else void 0===o?(v=i+1,o=t.slice(0,i).trim()):e();if(void 0===o?o=t.slice(0,i).trim():0!==v&&e(),a)for(i=0;i<a.length;i++)o=function(t,e){var n=e.indexOf("(");{if(n<0)return'_f("'+e+'")('+t+")";var r=e.slice(0,n),i=e.slice(n+1);return'_f("'+r+'")('+t+","+i}}(o,a[i]);return o}function se(t){console.error("[Vue compiler]: "+t)}function ce(t,e){return t?t.map(function(t){return t[e]}).filter(function(t){return t}):[]}function ue(t,e,n){(t.props||(t.props=[])).push({name:e,value:n}),t.plain=!1}function le(t,e,n){(t.attrs||(t.attrs=[])).push({name:e,value:n}),t.plain=!1}function fe(t,e,n){t.attrsMap[e]=n,t.attrsList.push({name:e,value:n})}function pe(t,e,n,r,i,o){(t.directives||(t.directives=[])).push({name:e,rawName:n,value:r,arg:i,modifiers:o}),t.plain=!1}function de(t,e,n,r,i,o){(r=r||jn).capture&&(delete r.capture,e="!"+e),r.once&&(delete r.once,e="~"+e),r.passive&&(delete r.passive,e="&"+e),"click"===e&&(r.right?(e="contextmenu",delete r.right):r.middle&&(e="mouseup"));var a;r.native?(delete r.native,a=t.nativeEvents||(t.nativeEvents={})):a=t.events||(t.events={});var s={value:n};r!==jn&&(s.modifiers=r);var c=a[e];Array.isArray(c)?i?c.unshift(s):c.push(s):a[e]=c?i?[s,c]:[c,s]:s,t.plain=!1}function ve(t,e,n){var r=he(t,":"+e)||he(t,"v-bind:"+e);if(null!=r)return ae(r);if(!1!==n){var i=he(t,e);if(null!=i)return JSON.stringify(i)}}function he(t,e,n){var r;if(null!=(r=t.attrsMap[e]))for(var i=t.attrsList,o=0,a=i.length;o<a;o++)if(i[o].name===e){i.splice(o,1);break}return n&&delete t.attrsMap[e],r}function me(t,e,n){var r=n||{},i="$$v";r.trim&&(i="(typeof $$v === 'string'? $$v.trim(): $$v)"),r.number&&(i="_n("+i+")");var o=ye(e,i);t.model={value:"("+e+")",expression:'"'+e+'"',callback:"function ($$v) {"+o+"}"}}function ye(t,e){var n=function(t){if(ei=t.length,t.indexOf("[")<0||t.lastIndexOf("]")<ei-1)return(ii=t.lastIndexOf("."))>-1?{exp:t.slice(0,ii),key:'"'+t.slice(ii+1)+'"'}:{exp:t,key:null};ni=t,ii=oi=ai=0;for(;!_e();)be(ri=ge())?$e(ri):91===ri&&function(t){var e=1;oi=ii;for(;!_e();)if(t=ge(),be(t))$e(t);else if(91===t&&e++,93===t&&e--,0===e){ai=ii;break}}(ri);return{exp:t.slice(0,oi),key:t.slice(oi+1,ai)}}(t);return null===n.key?t+"="+e:"$set("+n.exp+", "+n.key+", "+e+")"}function ge(){return ni.charCodeAt(++ii)}function _e(){return ii>=ei}function be(t){return 34===t||39===t}function $e(t){for(var e=t;!_e()&&(t=ge())!==e;);}function Ce(t,e,n,r,i){e=function(t){return t._withTask||(t._withTask=function(){Er=!0;var e=t.apply(null,arguments);return Er=!1,e})}(e),n&&(e=function(t,e,n){var r=si;return function i(){null!==t.apply(null,arguments)&&we(e,i,n,r)}}(e,t,r)),si.addEventListener(t,e,or?{capture:r,passive:i}:r)}function we(t,e,n,r){(r||si).removeEventListener(t,e._withTask||e,n)}function xe(n,r){if(!t(n.data.on)||!t(r.data.on)){var i=r.data.on||{},o=n.data.on||{};si=r.elm,function(t){if(e(t[Li])){var n=Qn?"change":"input";t[n]=[].concat(t[Li],t[n]||[]),delete t[Li]}e(t[Mi])&&(t.change=[].concat(t[Mi],t.change||[]),delete t[Mi])}(i),X(i,o,Ce,we,r.context),si=void 0}}function ke(n,r){if(!t(n.data.domProps)||!t(r.data.domProps)){var i,o,a=r.elm,s=n.data.domProps||{},u=r.data.domProps||{};e(u.__ob__)&&(u=r.data.domProps=h({},u));for(i in s)t(u[i])&&(a[i]="");for(i in u){if(o=u[i],"textContent"===i||"innerHTML"===i){if(r.children&&(r.children.length=0),o===s[i])continue;1===a.childNodes.length&&a.removeChild(a.childNodes[0])}if("value"===i){a._value=o;var l=t(o)?"":String(o);(function(t,n){return!t.composing&&("OPTION"===t.tagName||function(t,e){var n=!0;try{n=document.activeElement!==t}catch(t){}return n&&t.value!==e}(t,n)||function(t,n){var r=t.value,i=t._vModifiers;if(e(i)){if(i.lazy)return!1;if(i.number)return c(r)!==c(n);if(i.trim)return r.trim()!==n.trim()}return r!==n}(t,n))})(a,l)&&(a.value=l)}else a[i]=o}}}function Ae(t){var e=Oe(t.style);return t.staticStyle?h(t.staticStyle,e):e}function Oe(t){return Array.isArray(t)?m(t):"string"==typeof t?Fi(t):t}function Se(n,r){var i=r.data,o=n.data;if(!(t(i.staticStyle)&&t(i.style)&&t(o.staticStyle)&&t(o.style))){var a,s,c=r.elm,u=o.staticStyle,l=o.normalizedStyle||o.style||{},f=u||l,p=Oe(r.data.style)||{};r.data.normalizedStyle=e(p.__ob__)?h({},p):p;var d=function(t,e){var n,r={};if(e)for(var i=t;i.componentInstance;)(i=i.componentInstance._vnode)&&i.data&&(n=Ae(i.data))&&h(r,n);(n=Ae(t.data))&&h(r,n);for(var o=t;o=o.parent;)o.data&&(n=Ae(o.data))&&h(r,n);return r}(r,!0);for(s in f)t(d[s])&&Bi(c,s,"");for(s in d)(a=d[s])!==f[s]&&Bi(c,s,null==a?"":a)}}function Te(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(/\s+/).forEach(function(e){return t.classList.add(e)}):t.classList.add(e);else{var n=" "+(t.getAttribute("class")||"")+" ";n.indexOf(" "+e+" ")<0&&t.setAttribute("class",(n+e).trim())}}function Ee(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(/\s+/).forEach(function(e){return t.classList.remove(e)}):t.classList.remove(e),t.classList.length||t.removeAttribute("class");else{for(var n=" "+(t.getAttribute("class")||"")+" ",r=" "+e+" ";n.indexOf(r)>=0;)n=n.replace(r," ");(n=n.trim())?t.setAttribute("class",n):t.removeAttribute("class")}}function je(t){if(t){if("object"==typeof t){var e={};return!1!==t.css&&h(e,Ki(t.name||"v")),h(e,t),e}return"string"==typeof t?Ki(t):void 0}}function Ne(t){Qi(function(){Qi(t)})}function Ie(t,e){var n=t._transitionClasses||(t._transitionClasses=[]);n.indexOf(e)<0&&(n.push(e),Te(t,e))}function Le(t,e){t._transitionClasses&&l(t._transitionClasses,e),Ee(t,e)}function Me(t,e,n){var r=De(t,e),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s=i===qi?Zi:Yi,c=0,u=function(){t.removeEventListener(s,l),n()},l=function(e){e.target===t&&++c>=a&&u()};setTimeout(function(){c<a&&u()},o+1),t.addEventListener(s,l)}function De(t,e){var n,r=window.getComputedStyle(t),i=r[Gi+"Delay"].split(", "),o=r[Gi+"Duration"].split(", "),a=Pe(i,o),s=r[Xi+"Delay"].split(", "),c=r[Xi+"Duration"].split(", "),u=Pe(s,c),l=0,f=0;e===qi?a>0&&(n=qi,l=a,f=o.length):e===Wi?u>0&&(n=Wi,l=u,f=c.length):f=(n=(l=Math.max(a,u))>0?a>u?qi:Wi:null)?n===qi?o.length:c.length:0;return{type:n,timeout:l,propCount:f,hasTransform:n===qi&&to.test(r[Gi+"Property"])}}function Pe(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max.apply(null,e.map(function(e,n){return Fe(e)+Fe(t[n])}))}function Fe(t){return 1e3*Number(t.slice(0,-1))}function Re(n,r){var o=n.elm;e(o._leaveCb)&&(o._leaveCb.cancelled=!0,o._leaveCb());var a=je(n.data.transition);if(!t(a)&&!e(o._enterCb)&&1===o.nodeType){for(var s=a.css,u=a.type,l=a.enterClass,f=a.enterToClass,p=a.enterActiveClass,d=a.appearClass,v=a.appearToClass,h=a.appearActiveClass,m=a.beforeEnter,y=a.enter,g=a.afterEnter,_=a.enterCancelled,$=a.beforeAppear,C=a.appear,w=a.afterAppear,x=a.appearCancelled,k=a.duration,A=Pr,O=Pr.$vnode;O&&O.parent;)A=(O=O.parent).context;var S=!A._isMounted||!n.isRootInsert;if(!S||C||""===C){var T=S&&d?d:l,E=S&&h?h:p,j=S&&v?v:f,N=S?$||m:m,I=S&&"function"==typeof C?C:y,L=S?w||g:g,M=S?x||_:_,D=c(i(k)?k.enter:k),P=!1!==s&&!tr,F=Ue(I),R=o._enterCb=b(function(){P&&(Le(o,j),Le(o,E)),R.cancelled?(P&&Le(o,T),M&&M(o)):L&&L(o),o._enterCb=null});n.data.show||Y(n,"insert",function(){var t=o.parentNode,e=t&&t._pending&&t._pending[n.key];e&&e.tag===n.tag&&e.elm._leaveCb&&e.elm._leaveCb(),I&&I(o,R)}),N&&N(o),P&&(Ie(o,T),Ie(o,E),Ne(function(){Ie(o,j),Le(o,T),R.cancelled||F||(Be(D)?setTimeout(R,D):Me(o,u,R))})),n.data.show&&(r&&r(),I&&I(o,R)),P||F||R()}}}function He(n,r){function o(){x.cancelled||(n.data.show||((a.parentNode._pending||(a.parentNode._pending={}))[n.key]=n),v&&v(a),$&&(Ie(a,f),Ie(a,d),Ne(function(){Ie(a,p),Le(a,f),x.cancelled||C||(Be(w)?setTimeout(x,w):Me(a,l,x))})),h&&h(a,x),$||C||x())}var a=n.elm;e(a._enterCb)&&(a._enterCb.cancelled=!0,a._enterCb());var s=je(n.data.transition);if(t(s)||1!==a.nodeType)return r();if(!e(a._leaveCb)){var u=s.css,l=s.type,f=s.leaveClass,p=s.leaveToClass,d=s.leaveActiveClass,v=s.beforeLeave,h=s.leave,m=s.afterLeave,y=s.leaveCancelled,g=s.delayLeave,_=s.duration,$=!1!==u&&!tr,C=Ue(h),w=c(i(_)?_.leave:_),x=a._leaveCb=b(function(){a.parentNode&&a.parentNode._pending&&(a.parentNode._pending[n.key]=null),$&&(Le(a,p),Le(a,d)),x.cancelled?($&&Le(a,f),y&&y(a)):(r(),m&&m(a)),a._leaveCb=null});g?g(o):o()}}function Be(t){return"number"==typeof t&&!isNaN(t)}function Ue(n){if(t(n))return!1;var r=n.fns;return e(r)?Ue(Array.isArray(r)?r[0]:r):(n._length||n.length)>1}function Ve(t,e){!0!==e.data.show&&Re(e)}function ze(t,e,n){Ke(t,e,n),(Qn||er)&&setTimeout(function(){Ke(t,e,n)},0)}function Ke(t,e,n){var r=e.value,i=t.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=t.options.length;s<c;s++)if(a=t.options[s],i)o=_(r,qe(a))>-1,a.selected!==o&&(a.selected=o);else if(g(qe(a),r))return void(t.selectedIndex!==s&&(t.selectedIndex=s));i||(t.selectedIndex=-1)}}function Je(t,e){return e.every(function(e){return!g(e,t)})}function qe(t){return"_value"in t?t._value:t.value}function We(t){t.target.composing=!0}function Ge(t){t.target.composing&&(t.target.composing=!1,Ze(t.target,"input"))}function Ze(t,e){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0),t.dispatchEvent(n)}function Xe(t){return!t.componentInstance||t.data&&t.data.transition?t:Xe(t.componentInstance._vnode)}function Ye(t){var e=t&&t.componentOptions;return e&&e.Ctor.options.abstract?Ye(it(e.children)):t}function Qe(t){var e={},n=t.$options;for(var r in n.propsData)e[r]=t[r];var i=n._parentListeners;for(var o in i)e[Pn(o)]=i[o];return e}function tn(t,e){if(/\d-keep-alive$/.test(e.tag))return t("keep-alive",{props:e.componentOptions.propsData})}function en(t){t.elm._moveCb&&t.elm._moveCb(),t.elm._enterCb&&t.elm._enterCb()}function nn(t){t.data.newPos=t.elm.getBoundingClientRect()}function rn(t){var e=t.data.pos,n=t.data.newPos,r=e.left-n.left,i=e.top-n.top;if(r||i){t.data.moved=!0;var o=t.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)",o.transitionDuration="0s"}}function on(t,e){var n=e?zo:Vo;return t.replace(n,function(t){return Uo[t]})}function an(t,e,n){return{type:1,tag:t,attrsList:e,attrsMap:function(t){for(var e={},n=0,r=t.length;n<r;n++)e[t[n].name]=t[n].value;return e}(e),parent:n,children:[]}}function sn(t,e){function n(t){t.pre&&(s=!1),Lo(t.tag)&&(c=!1);for(var n=0;n<Io.length;n++)Io[n](t,e)}To=e.warn||se,Lo=e.isPreTag||Bn,Mo=e.mustUseProp||Bn,Do=e.getTagNamespace||Bn,jo=ce(e.modules,"transformNode"),No=ce(e.modules,"preTransformNode"),Io=ce(e.modules,"postTransformNode"),Eo=e.delimiters;var r,i,o=[],a=!1!==e.preserveWhitespace,s=!1,c=!1;return function(t,e){function n(e){l+=e,t=t.substring(e)}function r(t,n,r){var i,s;if(null==n&&(n=l),null==r&&(r=l),t&&(s=t.toLowerCase()),t)for(i=a.length-1;i>=0&&a[i].lowerCasedTag!==s;i--);else i=0;if(i>=0){for(var c=a.length-1;c>=i;c--)e.end&&e.end(a[c].tag,n,r);a.length=i,o=i&&a[i-1].tag}else"br"===s?e.start&&e.start(t,[],!0,n,r):"p"===s&&(e.start&&e.start(t,[],!1,n,r),e.end&&e.end(t,n,r))}for(var i,o,a=[],s=e.expectHTML,c=e.isUnaryTag||Bn,u=e.canBeLeftOpenTag||Bn,l=0;t;){if(i=t,o&&Ho(o)){var f=0,p=o.toLowerCase(),d=Bo[p]||(Bo[p]=new RegExp("([\\s\\S]*?)(</"+p+"[^>]*>)","i")),v=t.replace(d,function(t,n,r){return f=r.length,Ho(p)||"noscript"===p||(n=n.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),Jo(p,n)&&(n=n.slice(1)),e.chars&&e.chars(n),""});l+=t.length-v.length,t=v,r(p,l-f,l)}else{var h=t.indexOf("<");if(0===h){if(Ao.test(t)){var m=t.indexOf("--\x3e");if(m>=0){e.shouldKeepComment&&e.comment(t.substring(4,m)),n(m+3);continue}}if(Oo.test(t)){var y=t.indexOf("]>");if(y>=0){n(y+2);continue}}var g=t.match(ko);if(g){n(g[0].length);continue}var _=t.match(xo);if(_){var b=l;n(_[0].length),r(_[1],b,l);continue}var $=function(){var e=t.match(Co);if(e){var r={tagName:e[1],attrs:[],start:l};n(e[0].length);for(var i,o;!(i=t.match(wo))&&(o=t.match(_o));)n(o[0].length),r.attrs.push(o);if(i)return r.unarySlash=i[1],n(i[0].length),r.end=l,r}}();if($){!function(t){var n=t.tagName,i=t.unarySlash;s&&("p"===o&&go(n)&&r(o),u(n)&&o===n&&r(n));for(var l=c(n)||!!i,f=t.attrs.length,p=new Array(f),d=0;d<f;d++){var v=t.attrs[d];So&&-1===v[0].indexOf('""')&&(""===v[3]&&delete v[3],""===v[4]&&delete v[4],""===v[5]&&delete v[5]);var h=v[3]||v[4]||v[5]||"",m="a"===n&&"href"===v[1]?e.shouldDecodeNewlinesForHref:e.shouldDecodeNewlines;p[d]={name:v[1],value:on(h,m)}}l||(a.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:p}),o=n),e.start&&e.start(n,p,l,t.start,t.end)}($),Jo(o,t)&&n(1);continue}}var C=void 0,w=void 0,x=void 0;if(h>=0){for(w=t.slice(h);!(xo.test(w)||Co.test(w)||Ao.test(w)||Oo.test(w)||(x=w.indexOf("<",1))<0);)h+=x,w=t.slice(h);C=t.substring(0,h),n(h)}h<0&&(C=t,t=""),e.chars&&C&&e.chars(C)}if(t===i){e.chars&&e.chars(t);break}}r()}(t,{warn:To,expectHTML:e.expectHTML,isUnaryTag:e.isUnaryTag,canBeLeftOpenTag:e.canBeLeftOpenTag,shouldDecodeNewlines:e.shouldDecodeNewlines,shouldDecodeNewlinesForHref:e.shouldDecodeNewlinesForHref,shouldKeepComment:e.comments,start:function(t,a,u){var l=i&&i.ns||Do(t);Qn&&"svg"===l&&(a=function(t){for(var e=[],n=0;n<t.length;n++){var r=t[n];na.test(r.name)||(r.name=r.name.replace(ra,""),e.push(r))}return e}(a));var f=an(t,a,i);l&&(f.ns=l),function(t){return"style"===t.tag||"script"===t.tag&&(!t.attrsMap.type||"text/javascript"===t.attrsMap.type)}(f)&&!ur()&&(f.forbidden=!0);for(var p=0;p<No.length;p++)f=No[p](f,e)||f;if(s||(!function(t){null!=he(t,"v-pre")&&(t.pre=!0)}(f),f.pre&&(s=!0)),Lo(f.tag)&&(c=!0),s?function(t){var e=t.attrsList.length;if(e)for(var n=t.attrs=new Array(e),r=0;r<e;r++)n[r]={name:t.attrsList[r].name,value:JSON.stringify(t.attrsList[r].value)};else t.pre||(t.plain=!0)}(f):f.processed||(un(f),function(t){var e=he(t,"v-if");if(e)t.if=e,ln(t,{exp:e,block:t});else{null!=he(t,"v-else")&&(t.else=!0);var n=he(t,"v-else-if");n&&(t.elseif=n)}}(f),function(t){null!=he(t,"v-once")&&(t.once=!0)}(f),cn(f,e)),r?o.length||r.if&&(f.elseif||f.else)&&ln(r,{exp:f.elseif,block:f}):r=f,i&&!f.forbidden)if(f.elseif||f.else)!function(t,e){var n=function(t){var e=t.length;for(;e--;){if(1===t[e].type)return t[e];t.pop()}}(e.children);n&&n.if&&ln(n,{exp:t.elseif,block:t})}(f,i);else if(f.slotScope){i.plain=!1;var d=f.slotTarget||'"default"';(i.scopedSlots||(i.scopedSlots={}))[d]=f}else i.children.push(f),f.parent=i;u?n(f):(i=f,o.push(f))},end:function(){var t=o[o.length-1],e=t.children[t.children.length-1];e&&3===e.type&&" "===e.text&&!c&&t.children.pop(),o.length-=1,i=o[o.length-1],n(t)},chars:function(t){if(i&&(!Qn||"textarea"!==i.tag||i.attrsMap.placeholder!==t)){var e=i.children;if(t=c||t.trim()?function(t){return"script"===t.tag||"style"===t.tag}(i)?t:ea(t):a&&e.length?" ":""){var n;!s&&" "!==t&&(n=function(t,e){var n=e?fo(e):uo;if(n.test(t)){for(var r,i,o,a=[],s=[],c=n.lastIndex=0;r=n.exec(t);){(i=r.index)>c&&(s.push(o=t.slice(c,i)),a.push(JSON.stringify(o)));var u=ae(r[1].trim());a.push("_s("+u+")"),s.push({"@binding":u}),c=i+r[0].length}return c<t.length&&(s.push(o=t.slice(c)),a.push(JSON.stringify(o))),{expression:a.join("+"),tokens:s}}}(t,Eo))?e.push({type:2,expression:n.expression,tokens:n.tokens,text:t}):" "===t&&e.length&&" "===e[e.length-1].text||e.push({type:3,text:t})}}},comment:function(t){i.children.push({type:3,text:t,isComment:!0})}}),r}function cn(t,e){!function(t){var e=ve(t,"key");e&&(t.key=e)}(t),t.plain=!t.key&&!t.attrsList.length,function(t){var e=ve(t,"ref");e&&(t.ref=e,t.refInFor=function(t){var e=t;for(;e;){if(void 0!==e.for)return!0;e=e.parent}return!1}(t))}(t),function(t){if("slot"===t.tag)t.slotName=ve(t,"name");else{var e;"template"===t.tag?(e=he(t,"scope"),t.slotScope=e||he(t,"slot-scope")):(e=he(t,"slot-scope"))&&(t.slotScope=e);var n=ve(t,"slot");n&&(t.slotTarget='""'===n?'"default"':n,"template"===t.tag||t.slotScope||le(t,"slot",n))}}(t),function(t){var e;(e=ve(t,"is"))&&(t.component=e);null!=he(t,"inline-template")&&(t.inlineTemplate=!0)}(t);for(var n=0;n<jo.length;n++)t=jo[n](t,e)||t;!function(t){var e,n,r,i,o,a,s,c=t.attrsList;for(e=0,n=c.length;e<n;e++)if(r=i=c[e].name,o=c[e].value,Wo.test(r))if(t.hasBindings=!0,(a=function(t){var e=t.match(ta);if(e){var n={};return e.forEach(function(t){n[t.slice(1)]=!0}),n}}(r))&&(r=r.replace(ta,"")),Qo.test(r))r=r.replace(Qo,""),o=ae(o),s=!1,a&&(a.prop&&(s=!0,"innerHtml"===(r=Pn(r))&&(r="innerHTML")),a.camel&&(r=Pn(r)),a.sync&&de(t,"update:"+Pn(r),ye(o,"$event"))),s||!t.component&&Mo(t.tag,t.attrsMap.type,r)?ue(t,r,o):le(t,r,o);else if(qo.test(r))r=r.replace(qo,""),de(t,r,o,a,!1);else{var u=(r=r.replace(Wo,"")).match(Yo),l=u&&u[1];l&&(r=r.slice(0,-(l.length+1))),pe(t,r,i,o,l,a)}else le(t,r,JSON.stringify(o)),!t.component&&"muted"===r&&Mo(t.tag,t.attrsMap.type,r)&&ue(t,r,"true")}(t)}function un(t){var e;if(e=he(t,"v-for")){var n=function(t){var e=t.match(Go);if(!e)return;var n={};n.for=e[2].trim();var r=e[1].trim().replace(Xo,""),i=r.match(Zo);i?(n.alias=r.replace(Zo,""),n.iterator1=i[1].trim(),i[2]&&(n.iterator2=i[2].trim())):n.alias=r;return n}(e);n&&h(t,n)}}function ln(t,e){t.ifConditions||(t.ifConditions=[]),t.ifConditions.push(e)}function fn(t){return an(t.tag,t.attrsList.slice(),t.parent)}function pn(t){if(t.static=function(t){if(2===t.type)return!1;if(3===t.type)return!0;return!(!t.pre&&(t.hasBindings||t.if||t.for||In(t.tag)||!Fo(t.tag)||function(t){for(;t.parent;){if("template"!==(t=t.parent).tag)return!1;if(t.for)return!0}return!1}(t)||!Object.keys(t).every(Po)))}(t),1===t.type){if(!Fo(t.tag)&&"slot"!==t.tag&&null==t.attrsMap["inline-template"])return;for(var e=0,n=t.children.length;e<n;e++){var r=t.children[e];pn(r),r.static||(t.static=!1)}if(t.ifConditions)for(var i=1,o=t.ifConditions.length;i<o;i++){var a=t.ifConditions[i].block;pn(a),a.static||(t.static=!1)}}}function dn(t,e){if(1===t.type){if((t.static||t.once)&&(t.staticInFor=e),t.static&&t.children.length&&(1!==t.children.length||3!==t.children[0].type))return void(t.staticRoot=!0);if(t.staticRoot=!1,t.children)for(var n=0,r=t.children.length;n<r;n++)dn(t.children[n],e||!!t.for);if(t.ifConditions)for(var i=1,o=t.ifConditions.length;i<o;i++)dn(t.ifConditions[i].block,e)}}function vn(t,e,n){var r=e?"nativeOn:{":"on:{";for(var i in t)r+='"'+i+'":'+hn(i,t[i])+",";return r.slice(0,-1)+"}"}function hn(t,e){if(!e)return"function(){}";if(Array.isArray(e))return"["+e.map(function(e){return hn(t,e)}).join(",")+"]";var n=ca.test(e.value),r=sa.test(e.value);if(e.modifiers){var i="",o="",a=[];for(var s in e.modifiers)if(fa[s])o+=fa[s],ua[s]&&a.push(s);else if("exact"===s){var c=e.modifiers;o+=la(["ctrl","shift","alt","meta"].filter(function(t){return!c[t]}).map(function(t){return"$event."+t+"Key"}).join("||"))}else a.push(s);a.length&&(i+=function(t){return"if(!('button' in $event)&&"+t.map(mn).join("&&")+")return null;"}(a)),o&&(i+=o);return"function($event){"+i+(n?e.value+"($event)":r?"("+e.value+")($event)":e.value)+"}"}return n||r?e.value:"function($event){"+e.value+"}"}function mn(t){var e=parseInt(t,10);if(e)return"$event.keyCode!=="+e;var n=ua[t];return"_k($event.keyCode,"+JSON.stringify(t)+","+JSON.stringify(n)+",$event.key)"}function yn(t,e){var n=new da(e);return{render:"with(this){return "+(t?gn(t,n):'_c("div")')+"}",staticRenderFns:n.staticRenderFns}}function gn(t,e){if(t.staticRoot&&!t.staticProcessed)return _n(t,e);if(t.once&&!t.onceProcessed)return bn(t,e);if(t.for&&!t.forProcessed)return function(t,e,n,r){var i=t.for,o=t.alias,a=t.iterator1?","+t.iterator1:"",s=t.iterator2?","+t.iterator2:"";return t.forProcessed=!0,(r||"_l")+"(("+i+"),function("+o+a+s+"){return "+(n||gn)(t,e)+"})"}(t,e);if(t.if&&!t.ifProcessed)return $n(t,e);if("template"!==t.tag||t.slotTarget){if("slot"===t.tag)return function(t,e){var n=t.slotName||'"default"',r=kn(t,e),i="_t("+n+(r?","+r:""),o=t.attrs&&"{"+t.attrs.map(function(t){return Pn(t.name)+":"+t.value}).join(",")+"}",a=t.attrsMap["v-bind"];!o&&!a||r||(i+=",null");o&&(i+=","+o);a&&(i+=(o?"":",null")+","+a);return i+")"}(t,e);var n;if(t.component)n=function(t,e,n){var r=e.inlineTemplate?null:kn(e,n,!0);return"_c("+t+","+wn(e,n)+(r?","+r:"")+")"}(t.component,t,e);else{var r=t.plain?void 0:wn(t,e),i=t.inlineTemplate?null:kn(t,e,!0);n="_c('"+t.tag+"'"+(r?","+r:"")+(i?","+i:"")+")"}for(var o=0;o<e.transforms.length;o++)n=e.transforms[o](t,n);return n}return kn(t,e)||"void 0"}function _n(t,e){return t.staticProcessed=!0,e.staticRenderFns.push("with(this){return "+gn(t,e)+"}"),"_m("+(e.staticRenderFns.length-1)+(t.staticInFor?",true":"")+")"}function bn(t,e){if(t.onceProcessed=!0,t.if&&!t.ifProcessed)return $n(t,e);if(t.staticInFor){for(var n="",r=t.parent;r;){if(r.for){n=r.key;break}r=r.parent}return n?"_o("+gn(t,e)+","+e.onceId+++","+n+")":gn(t,e)}return _n(t,e)}function $n(t,e,n,r){return t.ifProcessed=!0,Cn(t.ifConditions.slice(),e,n,r)}function Cn(t,e,n,r){function i(t){return n?n(t,e):t.once?bn(t,e):gn(t,e)}if(!t.length)return r||"_e()";var o=t.shift();return o.exp?"("+o.exp+")?"+i(o.block)+":"+Cn(t,e,n,r):""+i(o.block)}function wn(t,e){var n="{",r=function(t,e){var n=t.directives;if(!n)return;var r,i,o,a,s="directives:[",c=!1;for(r=0,i=n.length;r<i;r++){o=n[r],a=!0;var u=e.directives[o.name];u&&(a=!!u(t,o,e.warn)),a&&(c=!0,s+='{name:"'+o.name+'",rawName:"'+o.rawName+'"'+(o.value?",value:("+o.value+"),expression:"+JSON.stringify(o.value):"")+(o.arg?',arg:"'+o.arg+'"':"")+(o.modifiers?",modifiers:"+JSON.stringify(o.modifiers):"")+"},")}if(c)return s.slice(0,-1)+"]"}(t,e);r&&(n+=r+","),t.key&&(n+="key:"+t.key+","),t.ref&&(n+="ref:"+t.ref+","),t.refInFor&&(n+="refInFor:true,"),t.pre&&(n+="pre:true,"),t.component&&(n+='tag:"'+t.tag+'",');for(var i=0;i<e.dataGenFns.length;i++)n+=e.dataGenFns[i](t);if(t.attrs&&(n+="attrs:{"+On(t.attrs)+"},"),t.props&&(n+="domProps:{"+On(t.props)+"},"),t.events&&(n+=vn(t.events,!1,e.warn)+","),t.nativeEvents&&(n+=vn(t.nativeEvents,!0,e.warn)+","),t.slotTarget&&!t.slotScope&&(n+="slot:"+t.slotTarget+","),t.scopedSlots&&(n+=function(t,e){return"scopedSlots:_u(["+Object.keys(t).map(function(n){return xn(n,t[n],e)}).join(",")+"])"}(t.scopedSlots,e)+","),t.model&&(n+="model:{value:"+t.model.value+",callback:"+t.model.callback+",expression:"+t.model.expression+"},"),t.inlineTemplate){var o=function(t,e){var n=t.children[0];if(1===n.type){var r=yn(n,e.options);return"inlineTemplate:{render:function(){"+r.render+"},staticRenderFns:["+r.staticRenderFns.map(function(t){return"function(){"+t+"}"}).join(",")+"]}"}}(t,e);o&&(n+=o+",")}return n=n.replace(/,$/,"")+"}",t.wrapData&&(n=t.wrapData(n)),t.wrapListeners&&(n=t.wrapListeners(n)),n}function xn(t,e,n){if(e.for&&!e.forProcessed)return function(t,e,n){var r=e.for,i=e.alias,o=e.iterator1?","+e.iterator1:"",a=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0,"_l(("+r+"),function("+i+o+a+"){return "+xn(t,e,n)+"})"}(t,e,n);return"{key:"+t+",fn:"+("function("+String(e.slotScope)+"){return "+("template"===e.tag?e.if?e.if+"?"+(kn(e,n)||"undefined")+":undefined":kn(e,n)||"undefined":gn(e,n))+"}")+"}"}function kn(t,e,n,r,i){var o=t.children;if(o.length){var a=o[0];if(1===o.length&&a.for&&"template"!==a.tag&&"slot"!==a.tag)return(r||gn)(a,e);var s=n?function(t,e){for(var n=0,r=0;r<t.length;r++){var i=t[r];if(1===i.type){if(An(i)||i.ifConditions&&i.ifConditions.some(function(t){return An(t.block)})){n=2;break}(e(i)||i.ifConditions&&i.ifConditions.some(function(t){return e(t.block)}))&&(n=1)}}return n}(o,e.maybeComponent):0,c=i||function(t,e){if(1===t.type)return gn(t,e);return 3===t.type&&t.isComment?function(t){return"_e("+JSON.stringify(t.text)+")"}(t):function(t){return"_v("+(2===t.type?t.expression:Sn(JSON.stringify(t.text)))+")"}(t)};return"["+o.map(function(t){return c(t,e)}).join(",")+"]"+(s?","+s:"")}}function An(t){return void 0!==t.for||"template"===t.tag||"slot"===t.tag}function On(t){for(var e="",n=0;n<t.length;n++){var r=t[n];e+='"'+r.name+'":'+Sn(r.value)+","}return e.slice(0,-1)}function Sn(t){return t.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function Tn(t,e){try{return new Function(t)}catch(n){return e.push({err:n,code:t}),y}}function En(t){return Ro=Ro||document.createElement("div"),Ro.innerHTML=t?'<a href="\n"/>':'<div a="\n"/>',Ro.innerHTML.indexOf("&#10;")>0}var jn=Object.freeze({}),Nn=Object.prototype.toString,In=u("slot,component",!0),Ln=u("key,ref,slot,slot-scope,is"),Mn=Object.prototype.hasOwnProperty,Dn=/-(\w)/g,Pn=p(function(t){return t.replace(Dn,function(t,e){return e?e.toUpperCase():""})}),Fn=p(function(t){return t.charAt(0).toUpperCase()+t.slice(1)}),Rn=/\B([A-Z])/g,Hn=p(function(t){return t.replace(Rn,"-$1").toLowerCase()}),Bn=function(t,e,n){return!1},Un=function(t){return t},Vn="data-server-rendered",zn=["component","directive","filter"],Kn=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured"],Jn={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:Bn,isReservedAttr:Bn,isUnknownElement:Bn,getTagNamespace:y,parsePlatformTagName:Un,mustUseProp:Bn,_lifecycleHooks:Kn},qn=/[^\w.$]/,Wn="__proto__"in{},Gn="undefined"!=typeof window,Zn="undefined"!=typeof WXEnvironment&&!!WXEnvironment.platform,Xn=Zn&&WXEnvironment.platform.toLowerCase(),Yn=Gn&&window.navigator.userAgent.toLowerCase(),Qn=Yn&&/msie|trident/.test(Yn),tr=Yn&&Yn.indexOf("msie 9.0")>0,er=Yn&&Yn.indexOf("edge/")>0,nr=Yn&&Yn.indexOf("android")>0||"android"===Xn,rr=Yn&&/iphone|ipad|ipod|ios/.test(Yn)||"ios"===Xn,ir=(Yn&&/chrome\/\d+/.test(Yn),{}.watch),or=!1;if(Gn)try{var ar={};Object.defineProperty(ar,"passive",{get:function(){or=!0}}),window.addEventListener("test-passive",null,ar)}catch(t){}var sr,cr,ur=function(){return void 0===sr&&(sr=!Gn&&"undefined"!=typeof global&&"server"===global.process.env.VUE_ENV),sr},lr=Gn&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,fr="undefined"!=typeof Symbol&&w(Symbol)&&"undefined"!=typeof Reflect&&w(Reflect.ownKeys);cr="undefined"!=typeof Set&&w(Set)?Set:function(){function t(){this.set=Object.create(null)}return t.prototype.has=function(t){return!0===this.set[t]},t.prototype.add=function(t){this.set[t]=!0},t.prototype.clear=function(){this.set=Object.create(null)},t}();var pr=y,dr=0,vr=function(){this.id=dr++,this.subs=[]};vr.prototype.addSub=function(t){this.subs.push(t)},vr.prototype.removeSub=function(t){l(this.subs,t)},vr.prototype.depend=function(){vr.target&&vr.target.addDep(this)},vr.prototype.notify=function(){for(var t=this.subs.slice(),e=0,n=t.length;e<n;e++)t[e].update()},vr.target=null;var hr=[],mr=function(t,e,n,r,i,o,a,s){this.tag=t,this.data=e,this.children=n,this.text=r,this.elm=i,this.ns=void 0,this.context=o,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=e&&e.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1},yr={child:{configurable:!0}};yr.child.get=function(){return this.componentInstance},Object.defineProperties(mr.prototype,yr);var gr=function(t){void 0===t&&(t="");var e=new mr;return e.text=t,e.isComment=!0,e},_r=Array.prototype,br=Object.create(_r);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){var e=_r[t];C(br,t,function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var i,o=e.apply(this,n),a=this.__ob__;switch(t){case"push":case"unshift":i=n;break;case"splice":i=n.slice(2)}return i&&a.observeArray(i),a.dep.notify(),o})});var $r=Object.getOwnPropertyNames(br),Cr={shouldConvert:!0},wr=function(t){if(this.value=t,this.dep=new vr,this.vmCount=0,C(t,"__ob__",this),Array.isArray(t)){(Wn?O:S)(t,br,$r),this.observeArray(t)}else this.walk(t)};wr.prototype.walk=function(t){for(var e=Object.keys(t),n=0;n<e.length;n++)E(t,e[n],t[e[n]])},wr.prototype.observeArray=function(t){for(var e=0,n=t.length;e<n;e++)T(t[e])};var xr=Jn.optionMergeStrategies;xr.data=function(t,e,n){return n?M(t,e,n):e&&"function"!=typeof e?t:M(t,e)},Kn.forEach(function(t){xr[t]=D}),zn.forEach(function(t){xr[t+"s"]=P}),xr.watch=function(t,e,n,r){if(t===ir&&(t=void 0),e===ir&&(e=void 0),!e)return Object.create(t||null);if(!t)return e;var i={};h(i,t);for(var o in e){var a=i[o],s=e[o];a&&!Array.isArray(a)&&(a=[a]),i[o]=a?a.concat(s):Array.isArray(s)?s:[s]}return i},xr.props=xr.methods=xr.inject=xr.computed=function(t,e,n,r){if(!t)return e;var i=Object.create(null);return h(i,t),e&&h(i,e),i},xr.provide=M;var kr,Ar,Or=function(t,e){return void 0===e?t:e},Sr=[],Tr=!1,Er=!1;if("undefined"!=typeof setImmediate&&w(setImmediate))Ar=function(){setImmediate(J)};else if("undefined"==typeof MessageChannel||!w(MessageChannel)&&"[object MessageChannelConstructor]"!==MessageChannel.toString())Ar=function(){setTimeout(J,0)};else{var jr=new MessageChannel,Nr=jr.port2;jr.port1.onmessage=J,Ar=function(){Nr.postMessage(1)}}if("undefined"!=typeof Promise&&w(Promise)){var Ir=Promise.resolve();kr=function(){Ir.then(J),rr&&setTimeout(y)}}else kr=Ar;var Lr,Mr=new cr,Dr=p(function(t){var e="&"===t.charAt(0),n="~"===(t=e?t.slice(1):t).charAt(0),r="!"===(t=n?t.slice(1):t).charAt(0);return t=r?t.slice(1):t,{name:t,once:n,capture:r,passive:e}}),Pr=null,Fr=[],Rr=[],Hr={},Br=!1,Ur=!1,Vr=0,zr=0,Kr=function(t,e,n,r,i){this.vm=t,i&&(t._watcher=this),t._watchers.push(this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++zr,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new cr,this.newDepIds=new cr,this.expression="","function"==typeof e?this.getter=e:(this.getter=function(t){if(!qn.test(t)){var e=t.split(".");return function(t){for(var n=0;n<e.length;n++){if(!t)return;t=t[e[n]]}return t}}}(e),this.getter||(this.getter=function(){})),this.value=this.lazy?void 0:this.get()};Kr.prototype.get=function(){!function(t){vr.target&&hr.push(vr.target),vr.target=t}(this);var t,e=this.vm;try{t=this.getter.call(e,e)}catch(t){if(!this.user)throw t;V(t,e,'getter for watcher "'+this.expression+'"')}finally{this.deep&&W(t),vr.target=hr.pop(),this.cleanupDeps()}return t},Kr.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},Kr.prototype.cleanupDeps=function(){for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var n=this.depIds;this.depIds=this.newDepIds,this.newDepIds=n,this.newDepIds.clear(),n=this.deps,this.deps=this.newDeps,this.newDeps=n,this.newDeps.length=0},Kr.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():function(t){var e=t.id;if(null==Hr[e]){if(Hr[e]=!0,Ur){for(var n=Fr.length-1;n>Vr&&Fr[n].id>t.id;)n--;Fr.splice(n+1,0,t)}else Fr.push(t);Br||(Br=!0,q(ht))}}(this)},Kr.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||i(t)||this.deep){var e=this.value;if(this.value=t,this.user)try{this.cb.call(this.vm,t,e)}catch(t){V(t,this.vm,'callback for watcher "'+this.expression+'"')}else this.cb.call(this.vm,t,e)}}},Kr.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},Kr.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},Kr.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||l(this.vm._watchers,this);for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1}};var Jr={enumerable:!0,configurable:!0,get:y,set:y},qr={lazy:!0};Nt(It.prototype);var Wr={init:function(t,n,r,i){if(!t.componentInstance||t.componentInstance._isDestroyed){(t.componentInstance=function(t,n,r,i){var o={_isComponent:!0,parent:n,_parentVnode:t,_parentElm:r||null,_refElm:i||null},a=t.data.inlineTemplate;return e(a)&&(o.render=a.render,o.staticRenderFns=a.staticRenderFns),new t.componentOptions.Ctor(o)}(t,Pr,r,i)).$mount(n?t.elm:void 0,n)}else if(t.data.keepAlive){var o=t;Wr.prepatch(o,o)}},prepatch:function(t,e){var n=e.componentOptions;!function(t,e,n,r,i){var o=!!(i||t.$options._renderChildren||r.data.scopedSlots||t.$scopedSlots!==jn);if(t.$options._parentVnode=r,t.$vnode=r,t._vnode&&(t._vnode.parent=r),t.$options._renderChildren=i,t.$attrs=r.data&&r.data.attrs||jn,t.$listeners=n||jn,e&&t.$options.props){Cr.shouldConvert=!1;for(var a=t._props,s=t.$options._propKeys||[],c=0;c<s.length;c++){var u=s[c];a[u]=H(u,t.$options.props,e,t)}Cr.shouldConvert=!0,t.$options.propsData=e}if(n){var l=t.$options._parentListeners;t.$options._parentListeners=n,st(t,n,l)}o&&(t.$slots=ct(i,r.context),t.$forceUpdate())}(e.componentInstance=t.componentInstance,n.propsData,n.listeners,e,n.children)},insert:function(t){var e=t.context,n=t.componentInstance;n._isMounted||(n._isMounted=!0,vt(n,"mounted")),t.data.keepAlive&&(e._isMounted?function(t){t._inactive=!1,Rr.push(t)}(n):pt(n,!0))},destroy:function(t){var e=t.componentInstance;e._isDestroyed||(t.data.keepAlive?dt(e,!0):e.$destroy())}},Gr=Object.keys(Wr),Zr=1,Xr=2,Yr=0;!function(t){t.prototype._init=function(t){this._uid=Yr++,this._isVue=!0,t&&t._isComponent?function(t,e){var n=t.$options=Object.create(t.constructor.options),r=e._parentVnode;n.parent=e.parent,n._parentVnode=r,n._parentElm=e._parentElm,n._refElm=e._refElm;var i=r.componentOptions;n.propsData=i.propsData,n._parentListeners=i.listeners,n._renderChildren=i.children,n._componentTag=i.tag,e.render&&(n.render=e.render,n.staticRenderFns=e.staticRenderFns)}(this,t):this.$options=F(Ft(this.constructor),t||{},this),this._renderProxy=this,this._self=this,function(t){var e=t.$options,n=e.parent;if(n&&!e.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(t)}t.$parent=n,t.$root=n?n.$root:t,t.$children=[],t.$refs={},t._watcher=null,t._inactive=null,t._directInactive=!1,t._isMounted=!1,t._isDestroyed=!1,t._isBeingDestroyed=!1}(this),function(t){t._events=Object.create(null),t._hasHookEvent=!1;var e=t.$options._parentListeners;e&&st(t,e)}(this),function(t){t._vnode=null,t._staticTrees=null;var e=t.$options,n=t.$vnode=e._parentVnode,r=n&&n.context;t.$slots=ct(e._renderChildren,r),t.$scopedSlots=jn,t._c=function(e,n,r,i){return Dt(t,e,n,r,i,!1)},t.$createElement=function(e,n,r,i){return Dt(t,e,n,r,i,!0)};var i=n&&n.data;E(t,"$attrs",i&&i.attrs||jn,0,!0),E(t,"$listeners",e._parentListeners||jn,0,!0)}(this),vt(this,"beforeCreate"),function(t){var e=$t(t.$options.inject,t);e&&(Cr.shouldConvert=!1,Object.keys(e).forEach(function(n){E(t,n,e[n])}),Cr.shouldConvert=!0)}(this),yt(this),function(t){var e=t.$options.provide;e&&(t._provided="function"==typeof e?e.call(t):e)}(this),vt(this,"created"),this.$options.el&&this.$mount(this.$options.el)}}(Rt),function(t){var e={};e.get=function(){return this._data};var n={};n.get=function(){return this._props},Object.defineProperty(t.prototype,"$data",e),Object.defineProperty(t.prototype,"$props",n),t.prototype.$set=j,t.prototype.$delete=N,t.prototype.$watch=function(t,e,n){if(o(e))return bt(this,t,e,n);(n=n||{}).user=!0;var r=new Kr(this,t,e,n);return n.immediate&&e.call(this,r.value),function(){r.teardown()}}}(Rt),function(t){var e=/^hook:/;t.prototype.$on=function(t,n){if(Array.isArray(t))for(var r=0,i=t.length;r<i;r++)this.$on(t[r],n);else(this._events[t]||(this._events[t]=[])).push(n),e.test(t)&&(this._hasHookEvent=!0);return this},t.prototype.$once=function(t,e){function n(){r.$off(t,n),e.apply(r,arguments)}var r=this;return n.fn=e,r.$on(t,n),r},t.prototype.$off=function(t,e){if(!arguments.length)return this._events=Object.create(null),this;if(Array.isArray(t)){for(var n=0,r=t.length;n<r;n++)this.$off(t[n],e);return this}var i=this._events[t];if(!i)return this;if(!e)return this._events[t]=null,this;if(e)for(var o,a=i.length;a--;)if((o=i[a])===e||o.fn===e){i.splice(a,1);break}return this},t.prototype.$emit=function(t){var e=this,n=e._events[t];if(n){n=n.length>1?v(n):n;for(var r=v(arguments,1),i=0,o=n.length;i<o;i++)try{n[i].apply(e,r)}catch(n){V(n,e,'event handler for "'+t+'"')}}return e}}(Rt),function(t){t.prototype._update=function(t,e){this._isMounted&&vt(this,"beforeUpdate");var n=this.$el,r=this._vnode,i=Pr;Pr=this,this._vnode=t,r?this.$el=this.__patch__(r,t):(this.$el=this.__patch__(this.$el,t,e,!1,this.$options._parentElm,this.$options._refElm),this.$options._parentElm=this.$options._refElm=null),Pr=i,n&&(n.__vue__=null),this.$el&&(this.$el.__vue__=this),this.$vnode&&this.$parent&&this.$vnode===this.$parent._vnode&&(this.$parent.$el=this.$el)},t.prototype.$forceUpdate=function(){this._watcher&&this._watcher.update()},t.prototype.$destroy=function(){if(!this._isBeingDestroyed){vt(this,"beforeDestroy"),this._isBeingDestroyed=!0;var t=this.$parent;!t||t._isBeingDestroyed||this.$options.abstract||l(t.$children,this),this._watcher&&this._watcher.teardown();for(var e=this._watchers.length;e--;)this._watchers[e].teardown();this._data.__ob__&&this._data.__ob__.vmCount--,this._isDestroyed=!0,this.__patch__(this._vnode,null),vt(this,"destroyed"),this.$off(),this.$el&&(this.$el.__vue__=null),this.$vnode&&(this.$vnode.parent=null)}}}(Rt),function(t){Nt(t.prototype),t.prototype.$nextTick=function(t){return q(t,this)},t.prototype._render=function(){var t=this,e=t.$options,n=e.render,r=e._parentVnode;if(t._isMounted)for(var i in t.$slots){var o=t.$slots[i];(o._rendered||o[0]&&o[0].elm)&&(t.$slots[i]=A(o,!0))}t.$scopedSlots=r&&r.data.scopedSlots||jn,t.$vnode=r;var a;try{a=n.call(t._renderProxy,t.$createElement)}catch(e){V(e,t,"render"),a=t._vnode}return a instanceof mr||(a=gr()),a.parent=r,a}}(Rt);var Qr=[String,RegExp,Array],ti={KeepAlive:{name:"keep-alive",abstract:!0,props:{include:Qr,exclude:Qr,max:[String,Number]},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){for(var t in this.cache)zt(this.cache,t,this.keys)},watch:{include:function(t){Vt(this,function(e){return Ut(t,e)})},exclude:function(t){Vt(this,function(e){return!Ut(t,e)})}},render:function(){var t=this.$slots.default,e=it(t),n=e&&e.componentOptions;if(n){var r=Bt(n),i=this.include,o=this.exclude;if(i&&(!r||!Ut(i,r))||o&&r&&Ut(o,r))return e;var a=this.cache,s=this.keys,c=null==e.key?n.Ctor.cid+(n.tag?"::"+n.tag:""):e.key;a[c]?(e.componentInstance=a[c].componentInstance,l(s,c),s.push(c)):(a[c]=e,s.push(c),this.max&&s.length>parseInt(this.max)&&zt(a,s[0],s,this._vnode)),e.data.keepAlive=!0}return e||t&&t[0]}}};!function(t){var e={};e.get=function(){return Jn},Object.defineProperty(t,"config",e),t.util={warn:pr,extend:h,mergeOptions:F,defineReactive:E},t.set=j,t.delete=N,t.nextTick=q,t.options=Object.create(null),zn.forEach(function(e){t.options[e+"s"]=Object.create(null)}),t.options._base=t,h(t.options.components,ti),function(t){t.use=function(t){var e=this._installedPlugins||(this._installedPlugins=[]);if(e.indexOf(t)>-1)return this;var n=v(arguments,1);return n.unshift(this),"function"==typeof t.install?t.install.apply(t,n):"function"==typeof t&&t.apply(null,n),e.push(t),this}}(t),function(t){t.mixin=function(t){return this.options=F(this.options,t),this}}(t),Ht(t),function(t){zn.forEach(function(e){t[e]=function(t,n){return n?("component"===e&&o(n)&&(n.name=n.name||t,n=this.options._base.extend(n)),"directive"===e&&"function"==typeof n&&(n={bind:n,update:n}),this.options[e+"s"][t]=n,n):this.options[e+"s"][t]}})}(t)}(Rt),Object.defineProperty(Rt.prototype,"$isServer",{get:ur}),Object.defineProperty(Rt.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Rt.version="2.5.13";var ei,ni,ri,ii,oi,ai,si,ci,ui=u("style,class"),li=u("input,textarea,option,select,progress"),fi=function(t,e,n){return"value"===n&&li(t)&&"button"!==e||"selected"===n&&"option"===t||"checked"===n&&"input"===t||"muted"===n&&"video"===t},pi=u("contenteditable,draggable,spellcheck"),di=u("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),vi="http://www.w3.org/1999/xlink",hi=function(t){return":"===t.charAt(5)&&"xlink"===t.slice(0,5)},mi=function(t){return hi(t)?t.slice(6,t.length):""},yi=function(t){return null==t||!1===t},gi={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},_i=u("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),bi=u("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),$i=function(t){return _i(t)||bi(t)},Ci=Object.create(null),wi=u("text,number,password,search,email,tel,url"),xi=Object.freeze({createElement:function(t,e){var n=document.createElement(t);return"select"!==t?n:(e.data&&e.data.attrs&&void 0!==e.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n)},createElementNS:function(t,e){return document.createElementNS(gi[t],e)},createTextNode:function(t){return document.createTextNode(t)},createComment:function(t){return document.createComment(t)},insertBefore:function(t,e,n){t.insertBefore(e,n)},removeChild:function(t,e){t.removeChild(e)},appendChild:function(t,e){t.appendChild(e)},parentNode:function(t){return t.parentNode},nextSibling:function(t){return t.nextSibling},tagName:function(t){return t.tagName},setTextContent:function(t,e){t.textContent=e},setAttribute:function(t,e,n){t.setAttribute(e,n)}}),ki={create:function(t,e){Xt(e)},update:function(t,e){t.data.ref!==e.data.ref&&(Xt(t,!0),Xt(e))},destroy:function(t){Xt(t,!0)}},Ai=new mr("",{},[]),Oi=["create","activate","update","remove","destroy"],Si={create:te,update:te,destroy:function(t){te(t,Ai)}},Ti=Object.create(null),Ei=[ki,Si],ji={create:re,update:re},Ni={create:oe,update:oe},Ii=/[\w).+\-_$\]]/,Li="__r",Mi="__c",Di={create:xe,update:xe},Pi={create:ke,update:ke},Fi=p(function(t){var e={},n=/:(.+)/;return t.split(/;(?![^(]*\))/g).forEach(function(t){if(t){var r=t.split(n);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}),Ri=/^--/,Hi=/\s*!important$/,Bi=function(t,e,n){if(Ri.test(e))t.style.setProperty(e,n);else if(Hi.test(n))t.style.setProperty(e,n.replace(Hi,""),"important");else{var r=Vi(e);if(Array.isArray(n))for(var i=0,o=n.length;i<o;i++)t.style[r]=n[i];else t.style[r]=n}},Ui=["Webkit","Moz","ms"],Vi=p(function(t){if(ci=ci||document.createElement("div").style,"filter"!==(t=Pn(t))&&t in ci)return t;for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=0;n<Ui.length;n++){var r=Ui[n]+e;if(r in ci)return r}}),zi={create:Se,update:Se},Ki=p(function(t){return{enterClass:t+"-enter",enterToClass:t+"-enter-to",enterActiveClass:t+"-enter-active",leaveClass:t+"-leave",leaveToClass:t+"-leave-to",leaveActiveClass:t+"-leave-active"}}),Ji=Gn&&!tr,qi="transition",Wi="animation",Gi="transition",Zi="transitionend",Xi="animation",Yi="animationend";Ji&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Gi="WebkitTransition",Zi="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Xi="WebkitAnimation",Yi="webkitAnimationEnd"));var Qi=Gn?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(t){return t()},to=/\b(transform|all)(,|$)/,eo=function(i){function o(t){var n=A.parentNode(t);e(n)&&A.removeChild(n,t)}function a(t,r,i,o,a){if(t.isRootInsert=!a,!function(t,r,i,o){var a=t.data;if(e(a)){var u=e(t.componentInstance)&&a.keepAlive;if(e(a=a.hook)&&e(a=a.init)&&a(t,!1,i,o),e(t.componentInstance))return s(t,r),n(u)&&function(t,n,r,i){for(var o,a=t;a.componentInstance;)if(a=a.componentInstance._vnode,e(o=a.data)&&e(o=o.transition)){for(o=0;o<x.activate.length;++o)x.activate[o](Ai,a);n.push(a);break}c(r,t.elm,i)}(t,r,i,o),!0}}(t,r,i,o)){var u=t.data,f=t.children,v=t.tag;e(v)?(t.elm=t.ns?A.createElementNS(t.ns,v):A.createElement(v,t),d(t),l(t,f,r),e(u)&&p(t,r),c(i,t.elm,o)):n(t.isComment)?(t.elm=A.createComment(t.text),c(i,t.elm,o)):(t.elm=A.createTextNode(t.text),c(i,t.elm,o))}}function s(t,n){e(t.data.pendingInsert)&&(n.push.apply(n,t.data.pendingInsert),t.data.pendingInsert=null),t.elm=t.componentInstance.$el,f(t)?(p(t,n),d(t)):(Xt(t),n.push(t))}function c(t,n,r){e(t)&&(e(r)?r.parentNode===t&&A.insertBefore(t,n,r):A.appendChild(t,n))}function l(t,e,n){if(Array.isArray(e))for(var i=0;i<e.length;++i)a(e[i],n,t.elm,null,!0);else r(t.text)&&A.appendChild(t.elm,A.createTextNode(String(t.text)))}function f(t){for(;t.componentInstance;)t=t.componentInstance._vnode;return e(t.tag)}function p(t,n){for(var r=0;r<x.create.length;++r)x.create[r](Ai,t);e(C=t.data.hook)&&(e(C.create)&&C.create(Ai,t),e(C.insert)&&n.push(t))}function d(t){var n;if(e(n=t.fnScopeId))A.setAttribute(t.elm,n,"");else for(var r=t;r;)e(n=r.context)&&e(n=n.$options._scopeId)&&A.setAttribute(t.elm,n,""),r=r.parent;e(n=Pr)&&n!==t.context&&n!==t.fnContext&&e(n=n.$options._scopeId)&&A.setAttribute(t.elm,n,"")}function v(t,e,n,r,i,o){for(;r<=i;++r)a(n[r],o,t,e)}function h(t){var n,r,i=t.data;if(e(i))for(e(n=i.hook)&&e(n=n.destroy)&&n(t),n=0;n<x.destroy.length;++n)x.destroy[n](t);if(e(n=t.children))for(r=0;r<t.children.length;++r)h(t.children[r])}function m(t,n,r,i){for(;r<=i;++r){var a=n[r];e(a)&&(e(a.tag)?(y(a),h(a)):o(a.elm))}}function y(t,n){if(e(n)||e(t.data)){var r,i=x.remove.length+1;for(e(n)?n.listeners+=i:n=function(t,e){function n(){0==--n.listeners&&o(t)}return n.listeners=e,n}(t.elm,i),e(r=t.componentInstance)&&e(r=r._vnode)&&e(r.data)&&y(r,n),r=0;r<x.remove.length;++r)x.remove[r](t,n);e(r=t.data.hook)&&e(r=r.remove)?r(t,n):n()}else o(t.elm)}function g(n,r,i,o,s){for(var c,u,l,f=0,p=0,d=r.length-1,h=r[0],y=r[d],g=i.length-1,b=i[0],$=i[g],C=!s;f<=d&&p<=g;)t(h)?h=r[++f]:t(y)?y=r[--d]:Yt(h,b)?(_(h,b,o),h=r[++f],b=i[++p]):Yt(y,$)?(_(y,$,o),y=r[--d],$=i[--g]):Yt(h,$)?(_(h,$,o),C&&A.insertBefore(n,h.elm,A.nextSibling(y.elm)),h=r[++f],$=i[--g]):Yt(y,b)?(_(y,b,o),C&&A.insertBefore(n,y.elm,h.elm),y=r[--d],b=i[++p]):(t(c)&&(c=Qt(r,f,d)),t(u=e(b.key)?c[b.key]:function(t,n,r,i){for(var o=r;o<i;o++){var a=n[o];if(e(a)&&Yt(t,a))return o}}(b,r,f,d))?a(b,o,n,h.elm):Yt(l=r[u],b)?(_(l,b,o),r[u]=void 0,C&&A.insertBefore(n,l.elm,h.elm)):a(b,o,n,h.elm),b=i[++p]);f>d?v(n,t(i[g+1])?null:i[g+1].elm,i,p,g,o):p>g&&m(0,r,f,d)}function _(r,i,o,a){if(r!==i){var s=i.elm=r.elm;if(n(r.isAsyncPlaceholder))e(i.asyncFactory.resolved)?$(r.elm,i,o):i.isAsyncPlaceholder=!0;else if(n(i.isStatic)&&n(r.isStatic)&&i.key===r.key&&(n(i.isCloned)||n(i.isOnce)))i.componentInstance=r.componentInstance;else{var c,u=i.data;e(u)&&e(c=u.hook)&&e(c=c.prepatch)&&c(r,i);var l=r.children,p=i.children;if(e(u)&&f(i)){for(c=0;c<x.update.length;++c)x.update[c](r,i);e(c=u.hook)&&e(c=c.update)&&c(r,i)}t(i.text)?e(l)&&e(p)?l!==p&&g(s,l,p,o,a):e(p)?(e(r.text)&&A.setTextContent(s,""),v(s,null,p,0,p.length-1,o)):e(l)?m(0,l,0,l.length-1):e(r.text)&&A.setTextContent(s,""):r.text!==i.text&&A.setTextContent(s,i.text),e(u)&&e(c=u.hook)&&e(c=c.postpatch)&&c(r,i)}}}function b(t,r,i){if(n(i)&&e(t.parent))t.parent.data.pendingInsert=r;else for(var o=0;o<r.length;++o)r[o].data.hook.insert(r[o])}function $(t,r,i,o){var a,c=r.tag,u=r.data,f=r.children;if(o=o||u&&u.pre,r.elm=t,n(r.isComment)&&e(r.asyncFactory))return r.isAsyncPlaceholder=!0,!0;if(e(u)&&(e(a=u.hook)&&e(a=a.init)&&a(r,!0),e(a=r.componentInstance)))return s(r,i),!0;if(e(c)){if(e(f))if(t.hasChildNodes())if(e(a=u)&&e(a=a.domProps)&&e(a=a.innerHTML)){if(a!==t.innerHTML)return!1}else{for(var d=!0,v=t.firstChild,h=0;h<f.length;h++){if(!v||!$(v,f[h],i,o)){d=!1;break}v=v.nextSibling}if(!d||v)return!1}else l(r,f,i);if(e(u)){var m=!1;for(var y in u)if(!O(y)){m=!0,p(r,i);break}!m&&u.class&&W(u.class)}}else t.data!==r.text&&(t.data=r.text);return!0}var C,w,x={},k=i.modules,A=i.nodeOps;for(C=0;C<Oi.length;++C)for(x[Oi[C]]=[],w=0;w<k.length;++w)e(k[w][Oi[C]])&&x[Oi[C]].push(k[w][Oi[C]]);var O=u("attrs,class,staticClass,staticStyle,key");return function(r,i,o,s,c,u){if(!t(i)){var l=!1,p=[];if(t(r))l=!0,a(i,p,c,u);else{var d=e(r.nodeType);if(!d&&Yt(r,i))_(r,i,p,s);else{if(d){if(1===r.nodeType&&r.hasAttribute(Vn)&&(r.removeAttribute(Vn),o=!0),n(o)&&$(r,i,p))return b(i,p,!0),r;r=function(t){return new mr(A.tagName(t).toLowerCase(),{},[],void 0,t)}(r)}var v=r.elm,y=A.parentNode(v);if(a(i,p,v._leaveCb?null:y,A.nextSibling(v)),e(i.parent))for(var g=i.parent,C=f(i);g;){for(var w=0;w<x.destroy.length;++w)x.destroy[w](g);if(g.elm=i.elm,C){for(var k=0;k<x.create.length;++k)x.create[k](Ai,g);var O=g.data.hook.insert;if(O.merged)for(var S=1;S<O.fns.length;S++)O.fns[S]()}else Xt(g);g=g.parent}e(y)?m(0,[r],0,0):e(r.tag)&&h(r)}}return b(i,p,l),i.elm}e(r)&&h(r)}}({nodeOps:xi,modules:[ji,Ni,Di,Pi,zi,Gn?{create:Ve,activate:Ve,remove:function(t,e){!0!==t.data.show?He(t,e):e()}}:{}].concat(Ei)});tr&&document.addEventListener("selectionchange",function(){var t=document.activeElement;t&&t.vmodel&&Ze(t,"input")});var no={inserted:function(t,e,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?Y(n,"postpatch",function(){no.componentUpdated(t,e,n)}):ze(t,e,n.context),t._vOptions=[].map.call(t.options,qe)):("textarea"===n.tag||wi(t.type))&&(t._vModifiers=e.modifiers,e.modifiers.lazy||(t.addEventListener("change",Ge),nr||(t.addEventListener("compositionstart",We),t.addEventListener("compositionend",Ge)),tr&&(t.vmodel=!0)))},componentUpdated:function(t,e,n){if("select"===n.tag){ze(t,e,n.context);var r=t._vOptions,i=t._vOptions=[].map.call(t.options,qe);if(i.some(function(t,e){return!g(t,r[e])})){(t.multiple?e.value.some(function(t){return Je(t,i)}):e.value!==e.oldValue&&Je(e.value,i))&&Ze(t,"change")}}}},ro={model:no,show:{bind:function(t,e,n){var r=e.value,i=(n=Xe(n)).data&&n.data.transition,o=t.__vOriginalDisplay="none"===t.style.display?"":t.style.display;r&&i?(n.data.show=!0,Re(n,function(){t.style.display=o})):t.style.display=r?o:"none"},update:function(t,e,n){var r=e.value;if(r!==e.oldValue){(n=Xe(n)).data&&n.data.transition?(n.data.show=!0,r?Re(n,function(){t.style.display=t.__vOriginalDisplay}):He(n,function(){t.style.display="none"})):t.style.display=r?t.__vOriginalDisplay:"none"}},unbind:function(t,e,n,r,i){i||(t.style.display=t.__vOriginalDisplay)}}},io={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]},oo={name:"transition",props:io,abstract:!0,render:function(t){var e=this,n=this.$slots.default;if(n&&(n=n.filter(function(t){return t.tag||rt(t)})).length){var i=this.mode,o=n[0];if(function(t){for(;t=t.parent;)if(t.data.transition)return!0}(this.$vnode))return o;var a=Ye(o);if(!a)return o;if(this._leaving)return tn(t,o);var s="__transition-"+this._uid+"-";a.key=null==a.key?a.isComment?s+"comment":s+a.tag:r(a.key)?0===String(a.key).indexOf(s)?a.key:s+a.key:a.key;var c=(a.data||(a.data={})).transition=Qe(this),u=this._vnode,l=Ye(u);if(a.data.directives&&a.data.directives.some(function(t){return"show"===t.name})&&(a.data.show=!0),l&&l.data&&!function(t,e){return e.key===t.key&&e.tag===t.tag}(a,l)&&!rt(l)&&(!l.componentInstance||!l.componentInstance._vnode.isComment)){var f=l.data.transition=h({},c);if("out-in"===i)return this._leaving=!0,Y(f,"afterLeave",function(){e._leaving=!1,e.$forceUpdate()}),tn(t,o);if("in-out"===i){if(rt(a))return u;var p,d=function(){p()};Y(c,"afterEnter",d),Y(c,"enterCancelled",d),Y(f,"delayLeave",function(t){p=t})}}return o}}},ao=h({tag:String,moveClass:String},io);delete ao.mode;var so={Transition:oo,TransitionGroup:{props:ao,render:function(t){for(var e=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=Qe(this),s=0;s<i.length;s++){var c=i[s];c.tag&&null!=c.key&&0!==String(c.key).indexOf("__vlist")&&(o.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a)}if(r){for(var u=[],l=[],f=0;f<r.length;f++){var p=r[f];p.data.transition=a,p.data.pos=p.elm.getBoundingClientRect(),n[p.key]?u.push(p):l.push(p)}this.kept=t(e,null,u),this.removed=l}return t(e,null,o)},beforeUpdate:function(){this.__patch__(this._vnode,this.kept,!1,!0),this._vnode=this.kept},updated:function(){var t=this.prevChildren,e=this.moveClass||(this.name||"v")+"-move";t.length&&this.hasMove(t[0].elm,e)&&(t.forEach(en),t.forEach(nn),t.forEach(rn),this._reflow=document.body.offsetHeight,t.forEach(function(t){if(t.data.moved){var n=t.elm,r=n.style;Ie(n,e),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(Zi,n._moveCb=function t(r){r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Zi,t),n._moveCb=null,Le(n,e))})}}))},methods:{hasMove:function(t,e){if(!Ji)return!1;if(this._hasMove)return this._hasMove;var n=t.cloneNode();t._transitionClasses&&t._transitionClasses.forEach(function(t){Ee(n,t)}),Te(n,e),n.style.display="none",this.$el.appendChild(n);var r=De(n);return this.$el.removeChild(n),this._hasMove=r.hasTransform}}}};Rt.config.mustUseProp=fi,Rt.config.isReservedTag=$i,Rt.config.isReservedAttr=ui,Rt.config.getTagNamespace=Gt,Rt.config.isUnknownElement=function(t){if(!Gn)return!0;if($i(t))return!1;if(t=t.toLowerCase(),null!=Ci[t])return Ci[t];var e=document.createElement(t);return t.indexOf("-")>-1?Ci[t]=e.constructor===window.HTMLUnknownElement||e.constructor===window.HTMLElement:Ci[t]=/HTMLUnknownElement/.test(e.toString())},h(Rt.options.directives,ro),h(Rt.options.components,so),Rt.prototype.__patch__=Gn?eo:y,Rt.prototype.$mount=function(t,e){return t=t&&Gn?Zt(t):void 0,function(t,e,n){t.$el=e,t.$options.render||(t.$options.render=gr),vt(t,"beforeMount");var r;return r=function(){t._update(t._render(),n)},new Kr(t,r,y,null,!0),n=!1,null==t.$vnode&&(t._isMounted=!0,vt(t,"mounted")),t}(this,t,e)},Rt.nextTick(function(){Jn.devtools&&lr&&lr.emit("init",Rt)},0);var co,uo=/\{\{((?:.|\n)+?)\}\}/g,lo=/[-.*+?^${}()|[\]\/\\]/g,fo=p(function(t){var e=t[0].replace(lo,"\\$&"),n=t[1].replace(lo,"\\$&");return new RegExp(e+"((?:.|\\n)+?)"+n,"g")}),po={staticKeys:["staticClass"],transformNode:function(t,e){e.warn;var n=he(t,"class");n&&(t.staticClass=JSON.stringify(n));var r=ve(t,"class",!1);r&&(t.classBinding=r)},genData:function(t){var e="";return t.staticClass&&(e+="staticClass:"+t.staticClass+","),t.classBinding&&(e+="class:"+t.classBinding+","),e}},vo={staticKeys:["staticStyle"],transformNode:function(t,e){e.warn;var n=he(t,"style");n&&(t.staticStyle=JSON.stringify(Fi(n)));var r=ve(t,"style",!1);r&&(t.styleBinding=r)},genData:function(t){var e="";return t.staticStyle&&(e+="staticStyle:"+t.staticStyle+","),t.styleBinding&&(e+="style:("+t.styleBinding+"),"),e}},ho=function(t){return co=co||document.createElement("div"),co.innerHTML=t,co.textContent},mo=u("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),yo=u("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),go=u("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),_o=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,bo="[a-zA-Z_][\\w\\-\\.]*",$o="((?:"+bo+"\\:)?"+bo+")",Co=new RegExp("^<"+$o),wo=/^\s*(\/?)>/,xo=new RegExp("^<\\/"+$o+"[^>]*>"),ko=/^<!DOCTYPE [^>]+>/i,Ao=/^<!--/,Oo=/^<!\[/,So=!1;"x".replace(/x(.)?/g,function(t,e){So=""===e});var To,Eo,jo,No,Io,Lo,Mo,Do,Po,Fo,Ro,Ho=u("script,style,textarea",!0),Bo={},Uo={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t"},Vo=/&(?:lt|gt|quot|amp);/g,zo=/&(?:lt|gt|quot|amp|#10|#9);/g,Ko=u("pre,textarea",!0),Jo=function(t,e){return t&&Ko(t)&&"\n"===e[0]},qo=/^@|^v-on:/,Wo=/^v-|^@|^:/,Go=/(.*?)\s+(?:in|of)\s+(.*)/,Zo=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,Xo=/^\(|\)$/g,Yo=/:(.*)$/,Qo=/^:|^v-bind:/,ta=/\.[^.]+/g,ea=p(ho),na=/^xmlns:NS\d+/,ra=/^NS\d+:/,ia=[po,vo,{preTransformNode:function(t,e){if("input"===t.tag){var n=t.attrsMap;if(n["v-model"]&&(n["v-bind:type"]||n[":type"])){var r=ve(t,"type"),i=he(t,"v-if",!0),o=i?"&&("+i+")":"",a=null!=he(t,"v-else",!0),s=he(t,"v-else-if",!0),c=fn(t);un(c),fe(c,"type","checkbox"),cn(c,e),c.processed=!0,c.if="("+r+")==='checkbox'"+o,ln(c,{exp:c.if,block:c});var u=fn(t);he(u,"v-for",!0),fe(u,"type","radio"),cn(u,e),ln(c,{exp:"("+r+")==='radio'"+o,block:u});var l=fn(t);return he(l,"v-for",!0),fe(l,":type",r),cn(l,e),ln(c,{exp:i,block:l}),a?c.else=!0:s&&(c.elseif=s),c}}}}],oa={expectHTML:!0,modules:ia,directives:{model:function(t,e,n){var r=e.value,i=e.modifiers,o=t.tag,a=t.attrsMap.type;if(t.component)return me(t,r,i),!1;if("select"===o)!function(t,e,n){var r='var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return '+(n&&n.number?"_n(val)":"val")+"});";r=r+" "+ye(e,"$event.target.multiple ? $$selectedVal : $$selectedVal[0]"),de(t,"change",r,null,!0)}(t,r,i);else if("input"===o&&"checkbox"===a)!function(t,e,n){var r=n&&n.number,i=ve(t,"value")||"null",o=ve(t,"true-value")||"true",a=ve(t,"false-value")||"false";ue(t,"checked","Array.isArray("+e+")?_i("+e+","+i+")>-1"+("true"===o?":("+e+")":":_q("+e+","+o+")")),de(t,"change","var $$a="+e+",$$el=$event.target,$$c=$$el.checked?("+o+"):("+a+");if(Array.isArray($$a)){var $$v="+(r?"_n("+i+")":i)+",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&("+e+"=$$a.concat([$$v]))}else{$$i>-1&&("+e+"=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{"+ye(e,"$$c")+"}",null,!0)}(t,r,i);else if("input"===o&&"radio"===a)!function(t,e,n){var r=n&&n.number,i=ve(t,"value")||"null";ue(t,"checked","_q("+e+","+(i=r?"_n("+i+")":i)+")"),de(t,"change",ye(e,i),null,!0)}(t,r,i);else if("input"===o||"textarea"===o)!function(t,e,n){var r=t.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,c=!o&&"range"!==r,u=o?"change":"range"===r?Li:"input",l="$event.target.value";s&&(l="$event.target.value.trim()"),a&&(l="_n("+l+")");var f=ye(e,l);c&&(f="if($event.target.composing)return;"+f),ue(t,"value","("+e+")"),de(t,u,f,null,!0),(s||a)&&de(t,"blur","$forceUpdate()")}(t,r,i);else if(!Jn.isReservedTag(o))return me(t,r,i),!1;return!0},text:function(t,e){e.value&&ue(t,"textContent","_s("+e.value+")")},html:function(t,e){e.value&&ue(t,"innerHTML","_s("+e.value+")")}},isPreTag:function(t){return"pre"===t},isUnaryTag:mo,mustUseProp:fi,canBeLeftOpenTag:yo,isReservedTag:$i,getTagNamespace:Gt,staticKeys:function(t){return t.reduce(function(t,e){return t.concat(e.staticKeys||[])},[]).join(",")}(ia)},aa=p(function(t){return u("type,tag,attrsList,attrsMap,plain,parent,children,attrs"+(t?","+t:""))}),sa=/^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/,ca=/^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/,ua={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},la=function(t){return"if("+t+")return null;"},fa={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:la("$event.target !== $event.currentTarget"),ctrl:la("!$event.ctrlKey"),shift:la("!$event.shiftKey"),alt:la("!$event.altKey"),meta:la("!$event.metaKey"),left:la("'button' in $event && $event.button !== 0"),middle:la("'button' in $event && $event.button !== 1"),right:la("'button' in $event && $event.button !== 2")},pa={on:function(t,e){t.wrapListeners=function(t){return"_g("+t+","+e.value+")"}},bind:function(t,e){t.wrapData=function(n){return"_b("+n+",'"+t.tag+"',"+e.value+","+(e.modifiers&&e.modifiers.prop?"true":"false")+(e.modifiers&&e.modifiers.sync?",true":"")+")"}},cloak:y},da=function(t){this.options=t,this.warn=t.warn||se,this.transforms=ce(t.modules,"transformCode"),this.dataGenFns=ce(t.modules,"genData"),this.directives=h(h({},pa),t.directives);var e=t.isReservedTag||Bn;this.maybeComponent=function(t){return!e(t.tag)},this.onceId=0,this.staticRenderFns=[]},va=(new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)"),function(t){return function(e){function n(n,r){var i=Object.create(e),o=[],a=[];if(i.warn=function(t,e){(e?a:o).push(t)},r){r.modules&&(i.modules=(e.modules||[]).concat(r.modules)),r.directives&&(i.directives=h(Object.create(e.directives||null),r.directives));for(var s in r)"modules"!==s&&"directives"!==s&&(i[s]=r[s])}var c=t(n,i);return c.errors=o,c.tips=a,c}return{compile:n,compileToFunctions:function(t){var e=Object.create(null);return function(n,r,i){(r=h({},r)).warn,delete r.warn;var o=r.delimiters?String(r.delimiters)+n:n;if(e[o])return e[o];var a=t(n,r),s={},c=[];return s.render=Tn(a.render,c),s.staticRenderFns=a.staticRenderFns.map(function(t){return Tn(t,c)}),e[o]=s}}(n)}}}(function(t,e){var n=sn(t.trim(),e);!1!==e.optimize&&function(t,e){t&&(Po=aa(e.staticKeys||""),Fo=e.isReservedTag||Bn,pn(t),dn(t,!1))}(n,e);var r=yn(n,e);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}})(oa).compileToFunctions),ha=!!Gn&&En(!1),ma=!!Gn&&En(!0),ya=p(function(t){var e=Zt(t);return e&&e.innerHTML}),ga=Rt.prototype.$mount;return Rt.prototype.$mount=function(t,e){if((t=t&&Zt(t))===document.body||t===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=ya(r));else{if(!r.nodeType)return this;r=r.innerHTML}else t&&(r=function(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)),e.innerHTML}(t));if(r){var i=va(r,{shouldDecodeNewlines:ha,shouldDecodeNewlinesForHref:ma,delimiters:n.delimiters,comments:n.comments},this),o=i.render,a=i.staticRenderFns;n.render=o,n.staticRenderFns=a}}return ga.call(this,t,e)},Rt.compile=va,Rt});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(34).setImmediate))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class BrowserHelpers{

    static addEvent (object, type, callback) {
        if (object === null || typeof(object) === 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on"+type] = callback;
        }
    }


}

/* harmony default export */ __webpack_exports__["a"] = (BrowserHelpers);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Modal_vue__ = __webpack_require__(19);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d4961080_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Modal_vue__ = __webpack_require__(76);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(74)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d4961080_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/modal/Modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d4961080", Component.options)
  } else {
    hotAPI.reload("data-v-d4961080", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["v-clipboard"]=t():e["v-clipboard"]=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){var t=document.createElement("textarea"),n=!1;t.value=e,t.style.cssText="position:fixed;pointer-events:none;z-index:-9999;opacity:0;",document.body.appendChild(t),t.select();try{n=document.execCommand("copy")}catch(e){}return document.body.removeChild(t),n};t.default={install:function(e){e.prototype.$clipboard=o,e.directive("clipboard",{bind:function(e,t,n){e.addEventListener("click",function(e){if(t.hasOwnProperty("value")){var r=t.value,c={value:r,srcEvent:e},i=n.context;o(r)?i.$emit("copy",c):i.$emit("copyError",c)}})}})}}}])});
//# sourceMappingURL=index.min.js.map

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_ShowBalance_vue__ = __webpack_require__(20);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f1fe1ea_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ShowBalance_vue__ = __webpack_require__(79);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(77)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_ShowBalance_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f1fe1ea_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ShowBalance_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Balance/ShowBalance.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1f1fe1ea", Component.options)
  } else {
    hotAPI.reload("data-v-1f1fe1ea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Wallet_Wallet_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Mining_Mining_vue__ = __webpack_require__(95);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({

    components:{
        "Wallet":__WEBPACK_IMPORTED_MODULE_0__Wallet_Wallet_vue__["a" /* default */],
        "Mining":__WEBPACK_IMPORTED_MODULE_1__Mining_Mining_vue__["a" /* default */],
    },

    data: () => {
        return {

        }
    },

    methods: {

    }
});


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_icons_icon_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Address_Address_vue__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_helpers_Browser_helpers__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_Wallet_Address_Balance_ShowSumBalances_vue__ = __webpack_require__(90);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

    var Vue = __webpack_require__(3);

    
    
    
    

    /* harmony default export */ __webpack_exports__["a"] = ({

        components:{
            "icon":__WEBPACK_IMPORTED_MODULE_0_components_UI_icons_icon_vue__["a" /* default */],
            "Address":__WEBPACK_IMPORTED_MODULE_1__Address_Address_vue__["a" /* default */],
            "ShowSumBalances":__WEBPACK_IMPORTED_MODULE_3_components_Wallet_Address_Balance_ShowSumBalances_vue__["a" /* default */],
        },

        data:  () => {
            return {
                opened: false,
                addresses: [],
                currency: "0x01",

                walletButtonMarginOpened: 0,
                walletButtonMarginClosed: 0,
                buttonTopDistanceOpen: 0,
                buttonTopDistanceClose: 0,
                walletMarginOpened: 0,
                walletMarginClosed: 0,
                walletMenuMarginTopOpen: 0,
                walletMenuMarginTopClose: 0,
                walletMenuHeightOpen: 0,
                walletMenuHeightClosed: 0,
                walletContentHeight: 315,
                walletButtonRadiusLeftOpen: 0,
                walletButtonRadiusLeftClose: 0,
                walletButtonRadiusRightOpen: 0,
                walletButtonRadiusRightClose: 0
            }
        },

        mounted(){

                //in browser
              if (typeof window === "undefined") return false;

              this.changeScreenBehavior();

              WebDollar.Blockchain.Wallet.emitter.on("wallet/address-changes", (address)=>{
                  console.log("wallet/address-changes", address)
                  this.addNewAddress(address);
              });

              WebDollar.Blockchain.Wallet.emitter.on("wallet/changes", ()=>{
                  this.loadAllAddresses();
              });

              //onLoad
              __WEBPACK_IMPORTED_MODULE_2_helpers_Browser_helpers__["a" /* default */].addEvent(window, "load", (event) => {
                  this.changeScreenBehavior();
                  this.walletResizeFix();
              });

              //onResize
              __WEBPACK_IMPORTED_MODULE_2_helpers_Browser_helpers__["a" /* default */].addEvent(window, "resize", (event) => {
                  this.changeScreenBehavior();
                  this.walletResizeFix();
              });

              this.loadAllAddresses();

        },

        methods: {

            changeScreenBehavior(){

                if (window.screenWidth < 831){

                    this.walletButtonMarginOpened = 452;
                    this.walletButtonMarginClosed = 43;

                    this.walletMarginOpened = 42;
                    this.walletMarginClosed = -325;

                    this.buttonTopDistanceOpen = '0';
                    this.buttonTopDistanceClose = 'auto';

                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;
                    this.walletMenuMarginTopClose='0';

                    this.walletMenuHeightOpen='100%';
                    this.walletMenuHeightClosed='358px';

                    this.walletContentHeight= window.outerHeight-90;

                    this.walletButtonRadiusLeftOpen= 0;
                    this.walletButtonRadiusLeftClose= 15;

                    this.walletButtonRadiusRightOpen= 0;
                    this.walletButtonRadiusRightClose= 15;

                }else{

                    this.walletContentHeight= 315;

                    this.walletButtonMarginOpened = 392;
                    this.walletButtonMarginClosed = 30;

                    this.walletMarginOpened = 34;
                    this.walletMarginClosed = -325;

                    this.buttonTopDistanceOpen = 'auto';
                    this.buttonTopDistanceClose = 'auto';

                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;
                    this.walletMenuMarginTopClose='0';

                    this.walletMenuHeightOpen='358px';
                    this.walletMenuHeightClosed='0';

                    this.walletButtonRadiusLeftOpen= 60;
                    this.walletButtonRadiusLeftClose= 60;

                    this.walletButtonRadiusRightOpen= 0;
                    this.walletButtonRadiusRightClose= 0;

                }

            },

            toggleWallet(){

                this.opened = !this.opened;

                if(window.screenWidth < 831){
                    if (this.opened===true)
                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');
                    else
                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');

                }else
                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');


            },

            walletResizeFix(){

                if(window.screenWidth < 831)
                    if (this.opened===true)
                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');
                    else
                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');

                else
                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');


            },

            handleAddNewAddress(){
                WebDollar.Blockchain.Wallet.createNewAddress();
            },

            async importAddress(){

                // dropzone tutorial https://www.html5rocks.com/en/tutorials/file/dndfiles/

                // Check for the various File API support.
                if ((window.File && window.FileReader && window.FileList && window.Blob) === false){
                    alert('The File APIs are not fully supported in this browser.');
                }

                let fileInput = this.$refs['importedAddress'];

                if ('files' in fileInput) {
                    if (fileInput.files.length === 0) {
                        alert ( "Select one or more files." );
                    } else {

                        for (let i = 0; i < fileInput.files.length; i++) {

                            let file = fileInput.files[i];
                            let extension = file.name.split('.').pop();

//                            console.log(file);
//                            console.log(extension);

                            if (extension === "webd") {
                                let reader = new FileReader();

                                try {
                                    reader.onload = async (e) => {

                                        //console.log(reader.result);
                                        let data = JSON.parse(reader.result);

                                        let answer = await WebDollar.Blockchain.Wallet.importAddressFromPrivateKey(data);

                                        if (answer.result === true){
                                            console.log("Address Imported", answer.address);
                                        } else {
                                            alert(answer.message);
                                        }


                                    };

                                } catch (exception){
                                    alert("Your Uploaded file is not JSON");
                                }

                                reader.readAsText(file);
                            } else {
                                alert ( "File not supported!" )
                            }

                        }


                    }
                }



            },

            addNewAddress(address){

                if (address === null || address === undefined) return false;

                for (let i=0; i<this.addresses.length; i++)
                    if (address.toString() === this.addresses[i].address.toString()){
                        return false;
                    }

                this.addAddressToWalletWatch(address);
            },

            loadAllAddresses(){

                for (let index in this.addresses){
                    WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[index ].subscription);
                    this.addresses[ index ].subscription = null;
                    console.log("unsubscribe....");
                }


                this.addresses = [];

                for (let i=0; i<WebDollar.Blockchain.Wallet.addresses.length; i++) {
                    this.addAddressToWalletWatch(WebDollar.Blockchain.Wallet.addresses[i].address);
                }

            },

            addAddressToWalletWatch(address){

                let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{


                    console.log("balance changed", address, data);

                    for (let i=0; i<this.addresses.length; i++)
                        if (this.addresses[i].address === address ){

                            this.addresses[i].balances = data.balances;
                            this.addresses[i] = Object.assign( {}, this.addresses[i], { });
                            this.$refs['showSumBalances'].refreshSum(this.addresses, this.currency);

                            break;
                        }

                    // immutable array
                    // this.addresses = Object.assign( {}, this.addresses, { });

                    this.$forceUpdate();

                });

                if (data !== null) {

                    let element =  {address: address, balances: data.balances, subscription: data.subscription};
                    this.addresses.push (element);

                }

            },

            deleteAddress(address){

                if (address === null || address === undefined) return false;

                for (let keyAddress in this.addresses)
                    if (address.toString() === this.addresses[keyAddress].address.toString()){

                        WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[keyAddress].subscription);
                        this.addresses.splice(i,1);
                        return true;
                    }

                return false;
            }

        }

    });



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_icon_vue__ = __webpack_require__(12);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4a4e8449_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_icon_vue__ = __webpack_require__(66);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(44)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_icon_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4a4e8449_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_icon_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/icon.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4a4e8449", Component.options)
  } else {
    hotAPI.reload("data-v-4a4e8449", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__res_svg_chevron_down_vue__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__res_svg_chevron_up_vue__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__res_svg_key_vue__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__res_svg_lock_closed_vue__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__res_svg_lock_open_vue__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__res_svg_plus_vue__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__res_svg_plus_square_vue__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__res_svg_x_vue__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__res_svg_upload_vue__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__res_svg_download_vue__ = __webpack_require__(64);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//













/* harmony default export */ __webpack_exports__["a"] = ({

    props:{
        icon: {default: ''}
    },

    components:{
        "svgKey": __WEBPACK_IMPORTED_MODULE_2__res_svg_key_vue__["a" /* default */],
        "svgChevronDown": __WEBPACK_IMPORTED_MODULE_0__res_svg_chevron_down_vue__["a" /* default */],
        "svgChevronUp": __WEBPACK_IMPORTED_MODULE_1__res_svg_chevron_up_vue__["a" /* default */],
        "svgLockClosed": __WEBPACK_IMPORTED_MODULE_3__res_svg_lock_closed_vue__["a" /* default */],
        "svgLockOpen": __WEBPACK_IMPORTED_MODULE_4__res_svg_lock_open_vue__["a" /* default */],
        "svgPlus": __WEBPACK_IMPORTED_MODULE_5__res_svg_plus_vue__["a" /* default */],
        "svgPlusSquare": __WEBPACK_IMPORTED_MODULE_6__res_svg_plus_square_vue__["a" /* default */],
        "svgX": __WEBPACK_IMPORTED_MODULE_7__res_svg_x_vue__["a" /* default */],
        "svgDownload": __WEBPACK_IMPORTED_MODULE_9__res_svg_download_vue__["a" /* default */],
        "svgUpload": __WEBPACK_IMPORTED_MODULE_8__res_svg_upload_vue__["a" /* default */],
    },

    methods:{

        handleClick(e){
            this.$emit('click',e );
        }

    }

});


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

});


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

});


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

});


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

});


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_file_saver__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_file_saver___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_file_saver__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_UI_icons_icon_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Modals_Transaction_modal_vue__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Modals_Lock_modal_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Modals_Delete_modal_vue__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_Wallet_Address_Balance_ShowBalance_vue__ = __webpack_require__(8);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









/* harmony default export */ __webpack_exports__["a"] = ({

    props:{
        address:{default:''},
    },

    components:{
        "TransactionModal":__WEBPACK_IMPORTED_MODULE_2__Modals_Transaction_modal_vue__["a" /* default */],
        "ShowBalance":__WEBPACK_IMPORTED_MODULE_5_components_Wallet_Address_Balance_ShowBalance_vue__["a" /* default */],
        "icon":__WEBPACK_IMPORTED_MODULE_1_components_UI_icons_icon_vue__["a" /* default */],
        "LockModal":__WEBPACK_IMPORTED_MODULE_3__Modals_Lock_modal_vue__["a" /* default */],
        "DeleteModal":__WEBPACK_IMPORTED_MODULE_4__Modals_Delete_modal_vue__["a" /* default */],
    },

    computed: {
        getAddressPic(){
            return WebDollar.Blockchain.Wallet.getAddressPic(this.address);
        }
    },

    methods:{

        handleTransferFunds(e){

            this.$refs['refTransactionModal'].showModal(e);

        },

        async handleExport(e){

            let answer = await WebDollar.Blockchain.Wallet.exportPrivateKeyFromAddress(this.address);

            if (answer.result){

                let addressFile = new Blob([JSON.stringify(answer.data)], {type: "application/json;charset=utf-8"});
                __WEBPACK_IMPORTED_MODULE_0__node_modules_file_saver___default.a.saveAs(addressFile, this.address + ".webd");

            } else {
                alert(answer.message)
            }

        },

        handleLock(e){

            this.$refs['refLockModal'].showModal(e);

        },

        handleDelete(e){

            this.$refs['refDeleteModal'].showModal(e);

        },

    }

});


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_Wallet_Address_Balance_ShowBalance_vue__ = __webpack_require__(8);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var Vue = __webpack_require__(3);





Vue.use(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default.a)

/* harmony default export */ __webpack_exports__["a"] = ({

    props: {

        address: {default: null},
        toAddress: {default: null},
        toAmount: {default: 0.0},
    },

    components: {
        "Modal": __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__["a" /* default */],
        "ShowBalance":__WEBPACK_IMPORTED_MODULE_2_components_Wallet_Address_Balance_ShowBalance_vue__["a" /* default */],
    },

    data: () => {
        return {
            isTransfer: false,
            isSell: false,
            isBuy: false,
            isTransactionList: false,
            clipboardText: 'Copy to Clipboard',
        }
    },

    methods: {

        showTransfer() {
            this.isTransfer = true;
            this.isSell = false;
            this.isBuy = false;
            this.isTransactionList=false;
        },
        showBuy() {
            this.isTransfer = false;
            this.isSell = false;
            this.isBuy = true;
            this.isTransactionList = false;
        },
        showSell() {
            this.isTransfer = false;
            this.isSell = true;
            this.isBuy = false;
            this.isTransactionList = false;
        },
        showTransactions(){
            this.isTransfer = false;
            this.isSell = false;
            this.isBuy = false;
            this.isTransactionList = true;
        },
        closeModal() {
            this.$refs['refModal'].closeModal();
        },

        showModal(e) {
            if (this.$refs['refModal'].modalOpened === false){
                this.$refs['refModal'].showModal();
            }
        },
        copyToClipboard(){
            this.clipboardText = 'Copied';
            this.$clipboard(this.address)
        }

    },

    mounted() {

        this.clipboardText = 'Copy to Clipboard';

        if (typeof window === 'undefined') return;

    },

});



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

    name: "Modal",

    data: () => {
        return {
            modalOpened: false,
        }
    },

    props:{

        title: {default: 'Modal Title'},
        buttons: {default: ()=>{return [{text:"cancel"}]}}

    },

    methods:{

        closeModal(e){

            if(e!=undefined) e.stopPropagation();

            this.modalOpened = false;
            console.log("closeModal2");

        },

        showModal(e){

            if (e !== undefined)
                e.stopPropagation();

            console.log("showModal");
            this.modalOpened = true;
        },

    }

});



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

    name: "ShowBalance",

    props: ['address', 'currency'],

    data(){
      return {
          balances: {},
          subscription: null,
        }
    },

    mounted(){

        if (typeof window === "undefined") return;

        this.currency = this.currency || '0x01';

        if (typeof this.address === "object" && typeof this.address.hasOwnProperty("balances") ){ //it is an address object
            this.balances = this.address.balances;
            return;
        }

        let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(this.address, (data)=>{
            this.balances = data.balances;
        });

        if (data !== null) {
            this.subscription = data.subscription;
            this.balances = data.balances;
        }

    },

    watch: {
        address: function (newVal, oldVal) { // watch it

            if (typeof newVal === "object" && typeof newVal.hasOwnProperty("balances") ){ //it is an address object
                this.balances = newVal.balances;
                return;
            }

            WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.subscription);

            let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(newVal, (data)=>{
                this.balances = data.balances;
            });


            if (data !== null) {
                this.subscription = data.subscription;
                this.balances = data.balances;
            }

        },

        currency: function (newVal, oldVal) { // watch it

        }
    }

});



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var Vue = __webpack_require__(3);




Vue.use(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default.a);

/* harmony default export */ __webpack_exports__["a"] = ({

    props: {
        address: {default: null},
        toAddress: {default: null},
        toAmount: {default: 0.0},
    },

    components: {
        "Modal":__WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__["a" /* default */],
    },

    data: () => {
        return {
            clipboardText: 'Copy to Clipboard',
            walletAddressPassword: '',
            errorMessage: ''
        }
    },

    methods: {

        closeModal() {
            this.$refs['refPassModal'].closeModal();
        },

        showModal(e) {

            if (this.$refs['refPassModal'].modalOpened === false){
                this.$refs['refPassModal'].showModal();
            }

        },
        copyToClipboard(){

            this.clipboardText = 'Copied';
            this.$clipboard(this.walletAddressPassword);

        },

        generatePasswrod(){

            var wordsArray = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z'];
            this.walletAddressPassword = wordsArray[Math.floor(Math.random()*wordsArray.length)];

            for (var i=0;i<=11;i++){

                var randomWord = wordsArray[Math.floor(Math.random()*wordsArray.length)];
                var index = this.walletAddressPassword.lastIndexOf(randomWord);


                if (index==-1){
                    this.walletAddressPassword += (" "+randomWord);
                }else{
                    i--;
                }

            }

        },

        encryptPassword(){

            var okPassword=true;
            var wordsArray = this.walletAddressPassword.split(' ');
            var wordsArraySize = wordsArray.length-1;

            if (wordsArraySize != 12){

                this.errorMessage = "The password should contain 12 words, but you have only "+wordsArraySize+" words.";
                okPassword=false;

            }

            if (okPassword==true){

                for (var i=0; i<=wordsArraySize; i++){

                    var index = wordsArray.lastIndexOf(wordsArray[i]);

                    if  (index != i){

                        this.errorMessage = "The password should contain different words, but you are repeating '"+wordsArray[i]+"' word.";
                        okPassword=false;

                    }

                }

            }

            if(okPassword==true){

                this.errorMessage = '';
                this.setPassword();

            }

        },

        setPassword(){

            this.copyToClipboard();
            this.closeModal();
            alert('Your password was saved in clipboard');

        }

    },

    mounted() {

        if (typeof window === 'undefined') return;

    },

});



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var Vue = __webpack_require__(3);




Vue.use(__WEBPACK_IMPORTED_MODULE_1__node_modules_v_clipboard___default.a)

/* harmony default export */ __webpack_exports__["a"] = ({

    props: {
        address: {default: null},
        toAddress: {default: null},
        toAmount: {default: 0.0},

    },

    components: {
        "Modal":__WEBPACK_IMPORTED_MODULE_0_components_UI_modal_Modal_vue__["a" /* default */],
    },

    data: () => {
        return {
            inputValue: ''
        }
    },

    methods: {

        async deleteAddress(){

            if (this.inputValue.toUpperCase().trim() === 'DELETE'){

                // WebDollar.Blockchain.wallet. - DELETE
                let answer = await WebDollar.Blockchain.Wallet.deleteAddress(this.address);

                console.log(answer);
            }

            this.closeModal();

        },

        closeModal(e) {

            if (this.$refs['refModal'] !== undefined)
                this.$refs['refModal'].closeModal(e);
        },

        showModal(e) {

            if (this.$refs['refModal'].modalOpened === false){
                console.log("shooow modal");
                this.$refs['refModal'].showModal(e);
            }

        }

    },

    mounted() {

        if (typeof window === 'undefined') return;

    },

});



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

    name: "ShowSumBalances",

    props: ['addresses', 'currency'],

    data(){
        return {
            sum: 0,
        }
    },

    mounted(){

    },

    methods:{

        refreshSum(addresses, currency){

            let newSum = 0;

            //it should use BigNumber as math...

            console.log('changed to newxxxx', addresses);

            if (addresses === undefined || addresses === null) return ;

            for (let index in this.addresses){

                if (addresses[index].balances !== undefined && addresses[index].balances !== null && addresses[index].balances[currency] !== undefined)
                    newSum += parseFloat( addresses[index].balances[currency]);
            }

            this.sum = newSum;

        }

    },

    watch: {
        addresses: function (newVal, oldVal) { // watch it

            console.log('changed to new', newVal);
            this.refreshSum(newVal, this.currency);

        },

        currency: function (newVal, oldVal) { // watch it

            this.refreshSum(this.addresses, newVal);

        }
    }

});



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_Wallet_Address_Balance_ShowBalance_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__slider_vue__ = __webpack_require__(98);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({

    name: 'Mining',

    components: {
        "ShowBalance":__WEBPACK_IMPORTED_MODULE_0_components_Wallet_Address_Balance_ShowBalance_vue__["a" /* default */],
        "slider":__WEBPACK_IMPORTED_MODULE_1__slider_vue__["a" /* default */]
    },

    data: function () {
        return {

            started: false,
            hashesPerSecond: 0,
            workers: 0,
            minerAddress:'',
        }
    },

    computed:{
    },

    props:{

    },

    mounted() {

        if (typeof window === 'undefined') return;

        WebDollar.Blockchain.Mining.emitter.on("mining/hash-rate", (hashesPerSecond)=>{
            this.hashesPerSecond = hashesPerSecond;
        });

        WebDollar.Blockchain.Mining.emitter.on("mining/status-changed", (status)=>{

            this.started = WebDollar.Blockchain.Mining.started;

        });

        WebDollar.Blockchain.Mining.emitter.on("mining/reset", ()=>{

            this.started = WebDollar.Blockchain.Mining.started;

        });

        WebDollar.Blockchain.Mining.emitter.on("mining/workers-changed", (workers)=>{

            this.workers = workers;
            if (this.workers !== this.$refs['refMiningSlider'].data)
                this.$refs['refMiningSlider'].$refs['slider'].setValue(this.workers);

        });

        this.minerAddress = WebDollar.Blockchain.Mining.minerAddressBase;
        WebDollar.Blockchain.Mining.emitter.on("mining/miner-address-changed", (minerAddress)=>{
            this.minerAddress = minerAddress;
        });


        WebDollar.Blockchain.emitter.on("blockchain/status-webdollar", (data)=> {

            if (data.message === "Ready")
                this.$refs['refMiningSlider'].disabled = false;

        });

    },

    methods: {

        async startStopMining() {

            if (!WebDollar.Blockchain.Mining.started)
                WebDollar.Blockchain.Mining.startMining();
            else
                WebDollar.Blockchain.Mining.stopMining();

            return true;

        },

        destroyOneMiningWorker(number){

            WebDollar.Blockchain.Mining.decreaseWorkers(number||1);

        },

        createOneMiningWorker(number){

            WebDollar.Blockchain.Mining.increaseWorkers(number||1);

        },

        changeWorkers(value){

            WebDollar.Blockchain.Mining.setWorkers(value);

        }

    }


});



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_slider_component__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_slider_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_slider_component__);
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'slider',

    components: {
        "vueSlider": __WEBPACK_IMPORTED_MODULE_0_vue_slider_component___default.a
    },

    data() {
        return {
            value: 0,
            disabled:true,
            screenWidth: window.innerWidth,
            logicalProcessors: 8,
            sliderMobileWidth: 200,
        }
    },

    methods: {
        change(value) {

            console.log("value", value);

            if (value > (this.value||1) *3){

                value = (this.value||1) *3;
                this.$refs['slider'].setValue(value);
                return;

            }

            this.$emit('sliderChanged', value)
        },
        addEvent(object, type, callback) {
            if (object === null || typeof(object) === 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on" + type] = callback;
            }
        },
    },

    mounted() {

        if (typeof window === "undefined") return false;

        this.addEvent(window, "resize", (event) => {

            this.screenWidth = window.innerWidth;

            if (window.innerWidth<550){
                this.sliderMobileWidth = window.innerWidth-150+'px';
            }else{
                this.sliderMobileWidth = '100%';
            }

        });

        this.screenWidth = window.innerWidth;
        if (window.innerWidth<550){
            this.sliderMobileWidth = window.innerWidth-150+'px';
        }else{
            this.sliderMobileWidth = '100%';
        }

        this.logicalProcessors = window.navigator.hardwareConcurrency === undefined ? 8 : 2 * window.navigator.hardwareConcurrency;

    }
});


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_Circle_Map__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_Circles__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Maps_tester__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__res_Network_Native_Map_Canvas_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__res_dialog_Network_Native_Map_Dialog_vue__ = __webpack_require__(115);
//
//
//
//
//
//
//
//
//











/* harmony default export */ __webpack_exports__["a"] = ({

    components:{

        "NetworkNativeMapCanvas": __WEBPACK_IMPORTED_MODULE_3__res_Network_Native_Map_Canvas_vue__["a" /* default */],
        "NetworkNativeMapDialog": __WEBPACK_IMPORTED_MODULE_4__res_dialog_Network_Native_Map_Dialog_vue__["a" /* default */],

    },

    mounted() {

        if (typeof window === "undefined") return;

        this._markers = [];
        this._markerMyself = null;

        this.createMap();
        //this.createTestConnections();
    },

    methods:{

        createMap(){

            if (typeof window === 'undefined') return;

            let mapSelector = ' svg.WebDollarNativeMap';

            this._mapElem = document.querySelector(mapSelector);
            if (this._mapElem === null){
                throw "map is not specified. Invalid selector"+mapSelector+". Try  svg.WebDollarNativeMap";
            }

            this._circleMap = new __WEBPACK_IMPORTED_MODULE_0__helpers_Circle_Map__["a" /* default */](this._mapElem);

            this._mapElem.onmousemove = e => this._mapHighlight(e);

            this._circles = new __WEBPACK_IMPORTED_MODULE_1__helpers_Circles__["a" /* default */]();

            this.initialize();
        },

        async initialize(){


            WebDollar.Node.NodesList.emitter.on("nodes-list/connected", async (nodesListObject) => {

                let geoLocation = await nodesListObject.socket.node.sckAddress.getGeoLocation();

                this._addMarker(geoLocation, nodesListObject.socket);

            } );

            WebDollar.Node.NodesList.emitter.on("nodes-list/disconnected", async (nodesListObject) => {

                //deleting the marker
                let markerIndex = this._findMarkerIndexBySocket(nodesListObject.socket);

                if (markerIndex !== -1) this._removeMarker(this._markers[markerIndex])
            });

            //Waitlist p2p
            WebDollar.Node.NodesWaitlist.emitter.on("waitlist/new-node", async (nodesWaitlistObject)=>{

                let geoLocation = await nodesWaitlistObject.sckAddresses[0].getGeoLocation();

                this._addMarker(geoLocation, nodesWaitlistObject);

            });

            WebDollar.Node.NodesWaitlist.emitter.on("waitlist/delete-node", async (nodesWaitlistObject)=>{

                //deleting the marker
                let markerIndex = this._findMarkerIndexBySocket(nodesWaitlistObject);

                if (markerIndex !== -1) this._removeMarker(this._markers[markerIndex])
            });

            await this._showMyself();

        },

        async _showMyself(){
            let geoLocation = await WebDollar.Applications.GeoHelper.getLocationFromAddress('', true);

            this._addMarker( geoLocation, 'myself');
        },

        _addMarker(geoLocation, socket){

            let marker = {
                socket: socket,
                desc: this._getInfoWindowContent(geoLocation, socket),
            };


            this._markers.push(marker);

            if (socket === "myself") this.highlightMe(marker); else
            if (socket === "fake") this.highlightConnectedPeer(marker);
            else
                this.highlightConnectedPeer(marker)

        },

        highlightMe(marker){

            this._markerMyself = marker;

            let cell = this._circleMap.getCellByLocation(marker.desc.pos.lat, marker.desc.pos.lng);
            if (cell) {
                marker.cell = cell;

                this._circleMap.highlightCell(cell, 'peer-own', marker.desc, marker.desc.uuid);

                this._circles.inc(cell);

                //add links to current nodes
                for (let i = 0; i< this._markers.length; i++)
                    if (this._markers[i] !== marker && this._markers[i].status === "connected")
                        this._circleMap.addLink(cell, this._markers[i].cell);

                this._circleMap.putCellOnTop(cell);

            }
        },

        highlightConnectedPeer(marker){

            let cell = this._circleMap.getCellByLocation(marker.desc.pos.lat, marker.desc.pos.lng);
            if (cell) {

                marker.cell = cell;

                let cellClass;

                if (marker.desc.nodeType === "myself") cellClass = "peer-own"; else
                if (marker.desc.nodeType === "browser") cellClass = "peer-connected-browser";
                if (marker.desc.nodeType === "terminal") cellClass = "peer-connected-terminal";

                this._circleMap.highlightCell(cell, cellClass , marker.desc, marker.desc.uuid);

                this._circles.inc(cell);

                //add links to the myselfMarker
                if (marker.desc.status === "connected")
                    if (this._markerMyself !== null && this._markerMyself !== undefined && this._markerMyself !== marker)
                        this._circleMap.addLink(cell, this._markerMyself.cell);

                this._circleMap.putCellOnTop(cell);

            }
        },


        _getInfoWindowContent(geoLocation, socket){

            let address = '', nodeType = '', status = "node", nodeProtocol = '', nodeIndex=0, uuid='';

            if (socket === 'myself') {
                status = "connected";
                address = geoLocation.address;
                uuid = '0';
                nodeType = "myself";
            } else
            if (socket === 'fake') {
                address = geoLocation.country;
                uuid = geoLocation.city;

                if (Math.floor(Math.random()*2) === 0) status = "connected";
                else  status = "not connected";

                if (Math.floor(Math.random()*2) === 0) nodeType = "browser";
                else nodeType = "terminal"

            } else
            if (typeof socket === "object" && socket.node !== undefined && socket.node.protocol !== undefined && socket.node.protocol.helloValidated ) {
                address = socket.node.sckAddress.toString();
                uuid = socket.node.sckAddress.uuid;

                status = "connected";

                switch (socket.node.type){
                    case 'client': nodeType = 'terminal'; break;
                    case 'server' : nodeType = 'terminal'; break;
                    case 'webpeer' : nodeType = 'browser'; break;
                }

                nodeProtocol = socket.node.type;
                nodeIndex = socket.node.index;
            }
            else if (socket instanceof WebDollar.Node.NodesWaitlist.NodesWaitlistObject ){ //its a waitlist

                address = socket.sckAddresses[0].toString();
                uuid = socket.sckAddresses[0].uuid;

                switch (socket.type){
                    case WebDollar.Node.NodesWaitlist.NODES_WAITLIST_OBJECT_TYPE.WEB_RTC_PEER: nodeType = 'browser'; break;
                    case WebDollar.Node.NodesWaitlist.NODES_WAITLIST_OBJECT_TYPE.NODE_PEER_TERMINAL_SERVER: nodeType = 'terminal'; break;
                }

                status = "not connected";
                nodeProtocol = nodeType;
                nodeIndex = -1;
            }

            let position = {lat: geoLocation.lat||0, lng: geoLocation.lng||0};

            return {
                status: status,
                city: geoLocation.city||'',
                country: geoLocation.country||'',
                address: address,
                uuid: uuid||nodeIndex,
                protocol: nodeProtocol,
                isp: geoLocation.isp||'',
                pos: position,
                nodeType: nodeType,
            }

        },

        _mapHighlight(e) {

            if (e.target.data) {
                const data = e.target.data;
                this.$refs['refDialog'].show(data);
            } else
                this.$refs['refDialog'].hide();

        },

        _removeMarker(marker){

            if (marker.cell !== undefined && marker.cell !== null) {

                // Only remove highlight if there are no more peers on this cell.
                if (this._circles.del(marker.cell) === 0) {
                    // Either change class if there are still known peers there.
                    if (this._circles.get(marker.cell) > 0) {
                        this._circleMap.highlightCell(marker.cell, 'peer-connected-browser', undefined, marker.desc.uuid);
                    }
                    // Or remove class at all.
                    else
                        this._circleMap.unhighlightCell(marker.cell, marker.desc.uuid);

                    if (this._markerMyself !== marker && this._markerMyself !== null)
                        this._circleMap.removeLink(this._markerMyself.cell, marker.cell);
                }

            }

            //delete marker from the list
            for (let i=0; i<this._markers.length; i++)
                if (this._markers[i] === marker) {
                    this._markers.splice(i, 1);
                    break;
                }

        },

        createTestConnections(){

            let mapsTester = new __WEBPACK_IMPORTED_MODULE_2__Maps_tester__["a" /* default */](this);
            mapsTester.testConnections();

        },

        _createTestConnectionsManual(){
            let cell1 = this._circleMap.getCellByLocation(66.160507,  -153.369141);
            let cell2 = this._circleMap.getCellByLocation(73.500823,  -21.755973);
            let cell3 = this._circleMap.getCellByLocation(-28.083,  23.044);
            let cell4 = this._circleMap.getCellByLocation(-20.72,  127.10);

            let data = {
                status: status,
                city: "Bucharest",
                country: "RO",
                protocol: "peer",
                addr: "76.44.22.11"
            };

            this._circleMap.addLink(cell1, cell2);
            this._circleMap.addLink(cell2, cell3);
            this._circleMap.addLink(cell3, cell4);

            this._circleMap.highlightCell(cell1, 'known-peer', data, 1);
            this._circleMap.highlightCell(cell2, 'own-peer', data, 2);
            this._circleMap.highlightCell(cell3, 'own-peer', data, 3);
            this._circleMap.highlightCell(cell4, 'own-peer', data, 4);

        },

        _findMarkerIndexBySocket(socket){

            for (let i=0; i< this._markers.length; i++ )
                if (this._markers[i].socket === socket)
                    return i;

            return -1;

        },

    },



});



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

});



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Network_Native_Map_Dialog_Element_vue__ = __webpack_require__(118);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({

    components:{
        "NetworkNativeMapDialogElement":__WEBPACK_IMPORTED_MODULE_0__Network_Native_Map_Dialog_Element_vue__["a" /* default */],
    },

    data: () => {
        return {

            display: false,
            desc: {},
        }
    },

    methods: {

        show(desc) {

            this.desc = desc;

            this.display = 1;
        },

        hide() {
            this.display = 0;
        },
    }

});



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({

    props:{
        nodeType:'',
        status:'',
        country:'',
        city:'',
        address:'',

    },

    computed:{

        getAddress(){

            if (typeof this.address ==="string") return this.address;
            else
            if (typeof this.address === "object" && typeof this.address.addressString === 'string') return this.address.addressString;
            else return "NOT DEFINED";

        }

    }

});



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_initialize_params_Initialize_Params__ = __webpack_require__(31);




let exportObject = {

    Helpers:{
        BrowserHelpers: __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__["a" /* default */],
    },
    InitializeParams: __WEBPACK_IMPORTED_MODULE_1_initialize_params_Initialize_Params__["a" /* default */],
};


if (false)
    module.exports =  exportObject;

//browser minimized script
if ( typeof global.window !== 'undefined')
    global.window.WebDollarUserInterface = exportObject;

if ( typeof window !== 'undefined')
    window.WebDollarUserInterface = exportObject;


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(4)))

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_initialize_Global_Initialization__ = __webpack_require__(32);




class InitializeParams{

    constructor(){

        this.maps = {
            activated: true,
            type: "NativeMap",
            style: "dark",
            id: "WebDollarMap",
        };

        this.mining = {
            activated: true,
            style: "dark",
            id: "WebDollar",
        };

        this.wallet = {
            activated: true,
            style: "dark",
            id: "WebDollar",
        };


        /**
         * On Window Load
         */
        __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__["a" /* default */].addEvent(window, "load", (event) => {
            console.log("User-Interface-Loaded");
            this.load();

        });

        __webpack_require__(33);
        __webpack_require__(105);

    }

    load(){
        __WEBPACK_IMPORTED_MODULE_1__global_initialize_Global_Initialization__["a" /* default */].initializeGlobalSettings();
    }



}

/* harmony default export */ __webpack_exports__["a"] = (new InitializeParams());

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__ = __webpack_require__(5);


class GlobalInitialization {

    constructor() {

    }

    initializeGlobalSettings() {

        //-----------------------
        // Int Script
        //-----------------------

        if (document.getElementById("WebdollarFont") === null)
            document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", `<link id="WebdollarFont" href="public/assets/fonts/avenir-light.woff" rel="stylesheet">`);

        if (document.getElementById("WebdollarViewPort") === null)
            document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", `<meta id="WebdollarViewPort" name="viewport" content="width=device-width, initial-scale=1.0"/>`)

        window.screenHeight = window.innerHeight;
        window.screenWidth = window.innerWidth;

        __WEBPACK_IMPORTED_MODULE_0_helpers_Browser_helpers__["a" /* default */].addEvent(window, "resize", (event) => {
            window.screenHeight = window.innerHeight;
            window.screenWidth = window.innerWidth;
        });
    }


}

/* harmony default export */ __webpack_exports__["a"] = (new GlobalInitialization());

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_Dashboard_vue__ = __webpack_require__(37);
var Vue = __webpack_require__(3);



//for safari workaround
document.addEventListener("DOMContentLoaded", function (event) {
    if (document.getElementById('WebDollar') === null)
        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", `<div id="WebDollar" > </div>`);

    new Vue({
        el: '#WebDollar',
        render: h => h(__WEBPACK_IMPORTED_MODULE_0_components_Dashboard_vue__["a" /* default */])
    })
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(35);
// On some exotic environments, it's not clear which object `setimmeidate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(36)))

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Dashboard_vue__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_aae30ed8_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Dashboard_vue__ = __webpack_require__(104);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(38)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Dashboard_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_aae30ed8_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Dashboard_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Dashboard.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-aae30ed8", Component.options)
  } else {
    hotAPI.reload("data-v-aae30ed8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("30555c5a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-aae30ed8\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dashboard.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-aae30ed8\",\"scoped\":false,\"hasInlineConfig\":true}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dashboard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n#webDollar * {\n    box-sizing: content-box;\n}\n#webDollar *:before,\n#webDollar *:after {\n    box-sizing: content-box;\n}\n::-webkit-scrollbar {\n    width: 0;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n    border-radius: 10px;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n    opacity:0.1;\n    border-radius: 10px;\n    background: rgba(0,0,0,0.5);\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);\n}\n#webDollar{\n    font-family: 'avenir',sans-serif;\n}\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/src/components/Dashboard.vue"],"names":[],"mappings":";AAUA;IAGA,wBAAA;CACA;AACA;;IAIA,wBAAA;CACA;AAEA;IACA,SAAA;CACA;;AAEA,WAAA;AACA;IAEA,oBAAA;CACA;;AAEA,YAAA;AACA;IACA,YAAA;IAEA,oBAAA;IACA,4BAAA;IACA,kDAAA;CACA;AAEA;IACA,iCAAA;CACA","file":"Dashboard.vue","sourcesContent":["<template>\n    <div id=\"webDollar\">\n\n        <Mining></Mining>\n        <Wallet></Wallet>\n\n    </div>\n</template>\n\n<style>\n\n    #webDollar * {\n        -webkit-box-sizing: content-box;\n        -moz-box-sizing: content-box;\n        box-sizing: content-box;\n    }\n    #webDollar *:before,\n    #webDollar *:after {\n        -webkit-box-sizing: content-box;\n        -moz-box-sizing: content-box;\n        box-sizing: content-box;\n    }\n\n    ::-webkit-scrollbar {\n        width: 0;\n    }\n\n    /* Track */\n    ::-webkit-scrollbar-track {\n        -webkit-border-radius: 10px;\n        border-radius: 10px;\n    }\n\n    /* Handle */\n    ::-webkit-scrollbar-thumb {\n        opacity:0.1;\n        -webkit-border-radius: 10px;\n        border-radius: 10px;\n        background: rgba(0,0,0,0.5);\n        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);\n    }\n\n    #webDollar{\n        font-family: 'avenir',sans-serif;\n    }\n</style>\n\n<script>\n\n    import Wallet from \"./Wallet/Wallet.vue\"\n    import Mining from \"./Mining/Mining.vue\"\n\n    export default {\n\n        components:{\n            \"Wallet\":Wallet,\n            \"Mining\":Mining,\n        },\n\n        data: () => {\n            return {\n\n            }\n        },\n\n        methods: {\n\n        }\n    }\n</script>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 40 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Wallet_vue__ = __webpack_require__(10);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8087f122_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Wallet_vue__ = __webpack_require__(94);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(42)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Wallet_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8087f122_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Wallet_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Wallet.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8087f122", Component.options)
  } else {
    hotAPI.reload("data-v-8087f122", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("60b99c0b", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8087f122\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Wallet.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8087f122\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Wallet.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n#myWalletImport{\n    display: none;\n}\n.vue-slider-component.vue-slider-horizontal .vue-slider-dot{\n    left:-5px;\n}\n#walletButtonText{\n    color: #1f1f1f;\n}\n.mainAddress{\n    background-color: #fec02c14;\n}\n#walletButton {\n    margin: 0 auto;\n    position: fixed;\n    z-index: 85;\n    bottom: 0;\n    width: 299px!important;\n    right: 0;\n    text-align: center;\n    height: 50px;\n    border-top-left-radius: 60px;\n    cursor: pointer;\n    background-color: #fec02c;\n    color: #1f1f1f;\n    margin-bottom: 20px;\n    border: solid 1px #444444;\n    border-right: solid 1px #fec02c;\n    transition: all .3s linear;\n}\n#walletButton:hover{\n    background-color: #fec02c;\n    transition: all .3s linear;\n}\n.walletSection{\n    display: inline-block;\n    vertical-align: top;\n    height: 315px;\n    overflow-y: auto;\n    overflow-x: hidden;\n    width: 100%;\n}\n.walletController{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr;\n        grid-template-columns: 1fr 1fr;\n    position: relative;\n    width: 100%;\n    border-bottom: solid 1px #333333;\n    background-color: #313131;\n}\n.walletController .btn{\n    text-align: center;\n    color: #b5b5b5;\n    cursor: pointer;\n    padding: 8px 19px 6px 19px!important;\n}\n.walletController .btn:hover{\n    background-color: #44403f;\n    transition: all .3s linear;\n}\n.walletController .btn:first-child{\n    border-right: solid 1px #3c3b3b;\n}\n.allWallets div{\n    border: solid 1px #545454;\n}\n#walletButton:hover{\n    transition: all .3s linear;\n}\n#walletButton span{\n    width: 100%;\n    line-height: 50px;\n    font-size: 20px;\n    font-weight: bolder;\n    transition: all .3s linear;\n}\n#walletButton span:hover{\n    transition: all .3s linear;\n}\n#walletMenu{\n    margin: 0 auto;\n    position: fixed;\n    bottom: 0;\n    right: 0;\n    width: 300px;\n    background-color: #1f1f1f;\n    height: 358px;\n    margin-bottom:-100px;\n    z-index: 90;\n    border-top: solid 1px #3d3d3d;\n    border-left: solid 1px #444;\n    transition: all .3s linear;\n}\n.buttonIcon{\n    display: inline-block;\n    margin-right: 10px;\n}\n#walletButton .buttonIcon{\n    fill: #000;\n    transition: all .3s linear;\n}\n.walletAddress b{\n    font-weight:100;\n}\nlabel.myLabel input[type=\"file\"] {\n    position: fixed;\n    top: -1000px;\n}\n\n/* Small Devices, Tablets */\n@media only screen and (max-width : 831px) {\n#walletMenu{\n        width: 100%;\n        margin-top: 40px!important;\n}\n#walletButton{\n        width: 100%!important;\n        border:0;\n        height: 40px;\n        border-top-left-radius: 15px;\n        border-top-right-radius: 15px;\n        margin-bottom: 90px;\n}\n#walletButton span{\n        line-height: 40px;\n        font-size: 22px;\n}\n.walletController .btn{\n        padding: 10px 19px 6px 19px!important;\n        margin-left: 10px;\n}\n.webdollarFont{\n        width: 24px!important;\n}\n#allWalets .walletAddress{\n        margin: 15px 0 0 10px!important;\n}\n#allWalets .walletAddress img{\n        height: 60px!important;\n}\n.walletAddress b{\n        font-size: 22px!important;\n        line-height: 60px!important;\n}\n.walletController{\n        position: relative;\n        width: 100%;\n        border-bottom: solid 5px #333333;\n        background-color: #313131;\n        border-top: solid 5px #313131;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/src/components/Wallet/Wallet.vue"],"names":[],"mappings":";AA2XA;IACA,cAAA;CACA;AAEA;IACA,UAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,4BAAA;CACA;AAEA;IACA,eAAA;IACA,gBAAA;IACA,YAAA;IACA,UAAA;IACA,uBAAA;IACA,SAAA;IACA,mBAAA;IACA,aAAA;IACA,6BAAA;IACA,gBAAA;IACA,0BAAA;IACA,eAAA;IACA,oBAAA;IACA,0BAAA;IACA,gCAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,sBAAA;IACA,oBAAA;IACA,cAAA;IACA,iBAAA;IACA,mBAAA;IACA,YAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,0BAAA;QAAA,+BAAA;IACA,mBAAA;IACA,YAAA;IACA,iCAAA;IACA,0BAAA;CACA;AAEA;IACA,mBAAA;IACA,eAAA;IACA,gBAAA;IACA,qCAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,gCAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,2BAAA;CACA;AAEA;IACA,YAAA;IACA,kBAAA;IACA,gBAAA;IACA,oBAAA;IACA,2BAAA;CACA;AAEA;IACA,2BAAA;CACA;AAEA;IACA,eAAA;IACA,gBAAA;IACA,UAAA;IACA,SAAA;IACA,aAAA;IACA,0BAAA;IACA,cAAA;IACA,qBAAA;IACA,YAAA;IACA,8BAAA;IACA,4BAAA;IACA,2BAAA;CACA;AAEA;IACA,sBAAA;IACA,mBAAA;CACA;AAEA;IACA,WAAA;IACA,2BAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,gBAAA;IACA,aAAA;CACA;;AAEA,4BAAA;AACA;AACA;QACA,YAAA;QACA,2BAAA;CACA;AACA;QACA,sBAAA;QACA,SAAA;QACA,aAAA;QACA,6BAAA;QACA,8BAAA;QACA,oBAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;CACA;AACA;QACA,sCAAA;QACA,kBAAA;CACA;AACA;QACA,sBAAA;CACA;AACA;QACA,gCAAA;CACA;AACA;QACA,uBAAA;CACA;AACA;QACA,0BAAA;QACA,4BAAA;CACA;AACA;QACA,mBAAA;QACA,YAAA;QACA,iCAAA;QACA,0BAAA;QACA,8BAAA;CACA;CAEA","file":"Wallet.vue","sourcesContent":["<template>\n\n    <div class=\"dashboardWallet\" ref=\"dashboardWallet\">\n\n        <div id=\"walletButton\" ref=\"walletMenuButton\" @click=\"this.toggleWallet\" :style=\"{\n                    marginBottom: this.opened ? this.walletButtonMarginOpened+'px': this.walletButtonMarginClosed+'px',\n                    top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose,\n                    borderTopLeftRadius: this.opened ? this.walletButtonRadiusLeftOpen+'px' : this.walletButtonRadiusLeftClose+'px',\n                    borderTopRightRadius: this.opened ? this.walletButtonRadiusRightOpen+'px' : this.walletButtonRadiusRightClose+'px'}\">\n\n            <span id=\"walletButtonText\">\n                <icon class=\"buttonIcon\" :icon=\"this.opened ? 'chevron-down' : 'chevron-up'\"></icon>\n                Wallet\n                <ShowSumBalances :addresses=\"this.addresses\" :currency=\"this.currency\" ref=\"showSumBalances\" />\n            </span>\n        </div>\n\n        <div id=\"walletMenu\" ref=\"walletMenu\" :style=\"{\n                    marginBottom: this.opened ? this.walletMarginOpened+'px': this.walletMarginClosed+'px',\n                    top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose,\n                    marginTop: this.opened ? this.walletMenuMarginTopOpen : this.walletMenuMarginTopClose,\n                    height: this.opened ? this.walletMenuHeightOpen : this.walletMenuHeightClosed}\">\n\n            <div id=\"dashboardWallet\">\n\n                <div class=\"walletController\">\n\n                    <div class=\"btn\" @click=\"this.handleAddNewAddress\">\n                        Add Address\n                    </div>\n                    <label class=\"myLabel\">\n\n                        <input ref=\"importedAddress\" type=\"file\" v-on:change=\"this.importAddress\" multiple size=\"50\" />\n\n                        <div class=\"btn\">\n                            Import Address\n                        </div>\n\n                    </label>\n\n                </div>\n\n                <div class=\"walletSection walletsContainer\" :style=\"{\n                    height: this.walletContentHeight}\">\n                    <div id=\"allWalets\">\n\n                        <Address v-for=\"walletAddress in this.addresses\"\n\n                                     :key=\"walletAddress.address\"\n                                     :id=\"'address'+walletAddress.address\"\n                                     :address=\"walletAddress.address\"\n                                     style=\"padding-right: 20px\"\n\n                        >\n\n                        </Address>\n\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n\n</template>\n\n\n\n<script>\n    var Vue = require('vue/dist/vue.min.js');\n\n    import icon from \"components/UI/icons/icon.vue\"\n    import Address from \"./Address/Address.vue\"\n    import BrowserHelpers from \"helpers/Browser.helpers\"\n    import ShowSumBalances from \"components/Wallet/Address/Balance/ShowSumBalances.vue\"\n\n    export default{\n\n        components:{\n            \"icon\":icon,\n            \"Address\":Address,\n            \"ShowSumBalances\":ShowSumBalances,\n        },\n\n        data:  () => {\n            return {\n                opened: false,\n                addresses: [],\n                currency: \"0x01\",\n\n                walletButtonMarginOpened: 0,\n                walletButtonMarginClosed: 0,\n                buttonTopDistanceOpen: 0,\n                buttonTopDistanceClose: 0,\n                walletMarginOpened: 0,\n                walletMarginClosed: 0,\n                walletMenuMarginTopOpen: 0,\n                walletMenuMarginTopClose: 0,\n                walletMenuHeightOpen: 0,\n                walletMenuHeightClosed: 0,\n                walletContentHeight: 315,\n                walletButtonRadiusLeftOpen: 0,\n                walletButtonRadiusLeftClose: 0,\n                walletButtonRadiusRightOpen: 0,\n                walletButtonRadiusRightClose: 0\n            }\n        },\n\n        mounted(){\n\n                //in browser\n              if (typeof window === \"undefined\") return false;\n\n              this.changeScreenBehavior();\n\n              WebDollar.Blockchain.Wallet.emitter.on(\"wallet/address-changes\", (address)=>{\n                  console.log(\"wallet/address-changes\", address)\n                  this.addNewAddress(address);\n              });\n\n              WebDollar.Blockchain.Wallet.emitter.on(\"wallet/changes\", ()=>{\n                  this.loadAllAddresses();\n              });\n\n              //onLoad\n              BrowserHelpers.addEvent(window, \"load\", (event) => {\n                  this.changeScreenBehavior();\n                  this.walletResizeFix();\n              });\n\n              //onResize\n              BrowserHelpers.addEvent(window, \"resize\", (event) => {\n                  this.changeScreenBehavior();\n                  this.walletResizeFix();\n              });\n\n              this.loadAllAddresses();\n\n        },\n\n        methods: {\n\n            changeScreenBehavior(){\n\n                if (window.screenWidth < 831){\n\n                    this.walletButtonMarginOpened = 452;\n                    this.walletButtonMarginClosed = 43;\n\n                    this.walletMarginOpened = 42;\n                    this.walletMarginClosed = -325;\n\n                    this.buttonTopDistanceOpen = '0';\n                    this.buttonTopDistanceClose = 'auto';\n\n                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;\n                    this.walletMenuMarginTopClose='0';\n\n                    this.walletMenuHeightOpen='100%';\n                    this.walletMenuHeightClosed='358px';\n\n                    this.walletContentHeight= window.outerHeight-90;\n\n                    this.walletButtonRadiusLeftOpen= 0;\n                    this.walletButtonRadiusLeftClose= 15;\n\n                    this.walletButtonRadiusRightOpen= 0;\n                    this.walletButtonRadiusRightClose= 15;\n\n                }else{\n\n                    this.walletContentHeight= 315;\n\n                    this.walletButtonMarginOpened = 392;\n                    this.walletButtonMarginClosed = 30;\n\n                    this.walletMarginOpened = 34;\n                    this.walletMarginClosed = -325;\n\n                    this.buttonTopDistanceOpen = 'auto';\n                    this.buttonTopDistanceClose = 'auto';\n\n                    this.walletMenuMarginTopOpen=this.$refs['walletMenuButton'].clientHeight;\n                    this.walletMenuMarginTopClose='0';\n\n                    this.walletMenuHeightOpen='358px';\n                    this.walletMenuHeightClosed='0';\n\n                    this.walletButtonRadiusLeftOpen= 60;\n                    this.walletButtonRadiusLeftClose= 60;\n\n                    this.walletButtonRadiusRightOpen= 0;\n                    this.walletButtonRadiusRightClose= 0;\n\n                }\n\n            },\n\n            toggleWallet(){\n\n                this.opened = !this.opened;\n\n                if(window.screenWidth < 831){\n                    if (this.opened===true)\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');\n                    else\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n                }else\n                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n\n            },\n\n            walletResizeFix(){\n\n                if(window.screenWidth < 831)\n                    if (this.opened===true)\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:none');\n                    else\n                        document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n                else\n                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');\n\n\n            },\n\n            handleAddNewAddress(){\n                WebDollar.Blockchain.Wallet.createNewAddress();\n            },\n\n            async importAddress(){\n\n                // dropzone tutorial https://www.html5rocks.com/en/tutorials/file/dndfiles/\n\n                // Check for the various File API support.\n                if ((window.File && window.FileReader && window.FileList && window.Blob) === false){\n                    alert('The File APIs are not fully supported in this browser.');\n                }\n\n                let fileInput = this.$refs['importedAddress'];\n\n                if ('files' in fileInput) {\n                    if (fileInput.files.length === 0) {\n                        alert ( \"Select one or more files.\" );\n                    } else {\n\n                        for (let i = 0; i < fileInput.files.length; i++) {\n\n                            let file = fileInput.files[i];\n                            let extension = file.name.split('.').pop();\n\n//                            console.log(file);\n//                            console.log(extension);\n\n                            if (extension === \"webd\") {\n                                let reader = new FileReader();\n\n                                try {\n                                    reader.onload = async (e) => {\n\n                                        //console.log(reader.result);\n                                        let data = JSON.parse(reader.result);\n\n                                        let answer = await WebDollar.Blockchain.Wallet.importAddressFromPrivateKey(data);\n\n                                        if (answer.result === true){\n                                            console.log(\"Address Imported\", answer.address);\n                                        } else {\n                                            alert(answer.message);\n                                        }\n\n\n                                    };\n\n                                } catch (exception){\n                                    alert(\"Your Uploaded file is not JSON\");\n                                }\n\n                                reader.readAsText(file);\n                            } else {\n                                alert ( \"File not supported!\" )\n                            }\n\n                        }\n\n\n                    }\n                }\n\n\n\n            },\n\n            addNewAddress(address){\n\n                if (address === null || address === undefined) return false;\n\n                for (let i=0; i<this.addresses.length; i++)\n                    if (address.toString() === this.addresses[i].address.toString()){\n                        return false;\n                    }\n\n                this.addAddressToWalletWatch(address);\n            },\n\n            loadAllAddresses(){\n\n                for (let index in this.addresses){\n                    WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[index ].subscription);\n                    this.addresses[ index ].subscription = null;\n                    console.log(\"unsubscribe....\");\n                }\n\n\n                this.addresses = [];\n\n                for (let i=0; i<WebDollar.Blockchain.Wallet.addresses.length; i++) {\n                    this.addAddressToWalletWatch(WebDollar.Blockchain.Wallet.addresses[i].address);\n                }\n\n            },\n\n            addAddressToWalletWatch(address){\n\n                let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, (data)=>{\n\n\n                    console.log(\"balance changed\", address, data);\n\n                    for (let i=0; i<this.addresses.length; i++)\n                        if (this.addresses[i].address === address ){\n\n                            this.addresses[i].balances = data.balances;\n                            this.addresses[i] = Object.assign( {}, this.addresses[i], { });\n                            this.$refs['showSumBalances'].refreshSum(this.addresses, this.currency);\n\n                            break;\n                        }\n\n                    // immutable array\n                    // this.addresses = Object.assign( {}, this.addresses, { });\n\n                    this.$forceUpdate();\n\n                });\n\n                if (data !== null) {\n\n                    let element =  {address: address, balances: data.balances, subscription: data.subscription};\n                    this.addresses.push (element);\n\n                }\n\n            },\n\n            deleteAddress(address){\n\n                if (address === null || address === undefined) return false;\n\n                for (let keyAddress in this.addresses)\n                    if (address.toString() === this.addresses[keyAddress].address.toString()){\n\n                        WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[keyAddress].subscription);\n                        this.addresses.splice(i,1);\n                        return true;\n                    }\n\n                return false;\n            }\n\n        }\n\n    }\n\n</script>\n\n<style>\n\n    #myWalletImport{\n        display: none;\n    }\n\n    .vue-slider-component.vue-slider-horizontal .vue-slider-dot{\n        left:-5px;\n    }\n\n    #walletButtonText{\n        color: #1f1f1f;\n    }\n\n    .mainAddress{\n        background-color: #fec02c14;\n    }\n\n    #walletButton {\n        margin: 0 auto;\n        position: fixed;\n        z-index: 85;\n        bottom: 0;\n        width: 299px!important;\n        right: 0;\n        text-align: center;\n        height: 50px;\n        border-top-left-radius: 60px;\n        cursor: pointer;\n        background-color: #fec02c;\n        color: #1f1f1f;\n        margin-bottom: 20px;\n        border: solid 1px #444444;\n        border-right: solid 1px #fec02c;\n        transition: all .3s linear;\n    }\n\n    #walletButton:hover{\n        background-color: #fec02c;\n        transition: all .3s linear;\n    }\n\n    .walletSection{\n        display: inline-block;\n        vertical-align: top;\n        height: 315px;\n        overflow-y: auto;\n        overflow-x: hidden;\n        width: 100%;\n    }\n\n    .walletController{\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        position: relative;\n        width: 100%;\n        border-bottom: solid 1px #333333;\n        background-color: #313131;\n    }\n\n    .walletController .btn{\n        text-align: center;\n        color: #b5b5b5;\n        cursor: pointer;\n        padding: 8px 19px 6px 19px!important;\n    }\n\n    .walletController .btn:hover{\n        background-color: #44403f;\n        transition: all .3s linear;\n    }\n\n    .walletController .btn:first-child{\n        border-right: solid 1px #3c3b3b;\n    }\n\n    .allWallets div{\n        border: solid 1px #545454;\n    }\n\n    #walletButton:hover{\n        transition: all .3s linear;\n    }\n\n    #walletButton span{\n        width: 100%;\n        line-height: 50px;\n        font-size: 20px;\n        font-weight: bolder;\n        transition: all .3s linear;\n    }\n\n    #walletButton span:hover{\n        transition: all .3s linear;\n    }\n\n    #walletMenu{\n        margin: 0 auto;\n        position: fixed;\n        bottom: 0;\n        right: 0;\n        width: 300px;\n        background-color: #1f1f1f;\n        height: 358px;\n        margin-bottom:-100px;\n        z-index: 90;\n        border-top: solid 1px #3d3d3d;\n        border-left: solid 1px #444;\n        transition: all .3s linear;\n    }\n\n    .buttonIcon{\n        display: inline-block;\n        margin-right: 10px;\n    }\n\n    #walletButton .buttonIcon{\n        fill: #000;\n        transition: all .3s linear;\n    }\n\n    .walletAddress b{\n        font-weight:100;\n    }\n\n    label.myLabel input[type=\"file\"] {\n        position: fixed;\n        top: -1000px;\n    }\n\n    /* Small Devices, Tablets */\n    @media only screen and (max-width : 831px) {\n        #walletMenu{\n            width: 100%;\n            margin-top: 40px!important;\n        }\n        #walletButton{\n            width: 100%!important;\n            border:0;\n            height: 40px;\n            border-top-left-radius: 15px;\n            border-top-right-radius: 15px;\n            margin-bottom: 90px;\n        }\n        #walletButton span{\n            line-height: 40px;\n            font-size: 22px;\n        }\n        .walletController .btn{\n            padding: 10px 19px 6px 19px!important;\n            margin-left: 10px;\n        }\n        .webdollarFont{\n            width: 24px!important;\n        }\n        #allWalets .walletAddress{\n            margin: 15px 0 0 10px!important;\n        }\n        #allWalets .walletAddress img{\n            height: 60px!important;\n        }\n        .walletAddress b{\n            font-size: 22px!important;\n            line-height: 60px!important;\n        }\n        .walletController{\n            position: relative;\n            width: 100%;\n            border-bottom: solid 5px #333333;\n            background-color: #313131;\n            border-top: solid 5px #313131;\n        }\n\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("89af2446", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4a4e8449\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./icon.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4a4e8449\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./icon.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.webdollarFont{\n    cursor: pointer;\n    color: #f6cd69;\n    transition: all .5s linear;\n    text-decoration: none;\n    width: 14px;\n}\n.webdollarFont path{\n    fill: #f6cd69;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/UI/icons/src/components/UI/icons/icon.vue"],"names":[],"mappings":";AAmEA;IACA,gBAAA;IACA,eAAA;IACA,2BAAA;IACA,sBAAA;IACA,YAAA;CACA;AAEA;IACA,cAAA;CACA","file":"icon.vue","sourcesContent":["<!--\nDownload svgs from https://icomoon.io/app/#/select/image\n-->\n\n<template>\n\n    <div @click=\"this.handleClick\">\n\n        <svgChevronUp v-if=\"this.icon === 'chevron-up'\"></svgChevronUp>\n        <svgChevronDown v-if=\"this.icon === 'chevron-down'\"></svgChevronDown>\n        <svgKey v-if=\"this.icon === 'key'\"></svgKey>\n        <svgLockClosed v-if=\"this.icon === 'lock-closed'\"></svgLockClosed>\n        <svgLockOpen v-if=\"this.icon === 'lock-open'\"></svgLockOpen>\n        <svgPlus v-if=\"this.icon === 'plus'\"></svgPlus>\n        <svgPlusSquare v-if=\"this.icon === 'plus-square'\"></svgPlusSquare>\n        <svgX v-if=\"this.icon === 'x'\"></svgX>\n        <svgUpload v-if=\"this.icon === 'upload'\"></svgUpload>\n        <svgDownload v-if=\"this.icon === 'download'\"></svgDownload>\n\n    </div>\n\n</template>\n\n\n<script>\n\n    import svgChevronDown from \"./res/svg-chevron-down.vue\"\n    import svgChevronUp from \"./res/svg-chevron-up.vue\"\n    import svgKey from \"./res/svg-key.vue\"\n    import svgLockClosed from \"./res/svg-lock-closed.vue\"\n    import svgLockOpen from \"./res/svg-lock-open.vue\"\n    import svgPlus from \"./res/svg-plus.vue\"\n    import svgPlusSquare from \"./res/svg-plus-square.vue\"\n    import svgX from \"./res/svg-x.vue\"\n    import svgUpload from \"./res/svg-upload.vue\"\n    import svgDownload from \"./res/svg-download.vue\"\n\n    export default{\n\n        props:{\n            icon: {default: ''}\n        },\n\n        components:{\n            \"svgKey\": svgKey,\n            \"svgChevronDown\": svgChevronDown,\n            \"svgChevronUp\": svgChevronUp,\n            \"svgLockClosed\": svgLockClosed,\n            \"svgLockOpen\": svgLockOpen,\n            \"svgPlus\": svgPlus,\n            \"svgPlusSquare\": svgPlusSquare,\n            \"svgX\": svgX,\n            \"svgDownload\": svgDownload,\n            \"svgUpload\": svgUpload,\n        },\n\n        methods:{\n\n            handleClick(e){\n                this.$emit('click',e );\n            }\n\n        }\n\n    }\n</script>\n\n<style>\n    .webdollarFont{\n        cursor: pointer;\n        color: #f6cd69;\n        transition: all .5s linear;\n        text-decoration: none;\n        width: 14px;\n    }\n\n    .webdollarFont path{\n        fill: #f6cd69;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_chevron_down_vue__ = __webpack_require__(13);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_21e1e19c_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_chevron_down_vue__ = __webpack_require__(47);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_chevron_down_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_21e1e19c_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_chevron_down_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-chevron-down.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-21e1e19c", Component.options)
  } else {
    hotAPI.reload("data-v-21e1e19c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      attrs: {
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "14",
        height: "14",
        viewBox: "0 0 14 14"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M13.148 6.312l-5.797 5.789q-0.148 0.148-0.352 0.148t-0.352-0.148l-5.797-5.789q-0.148-0.148-0.148-0.355t0.148-0.355l1.297-1.289q0.148-0.148 0.352-0.148t0.352 0.148l4.148 4.148 4.148-4.148q0.148-0.148 0.352-0.148t0.352 0.148l1.297 1.289q0.148 0.148 0.148 0.355t-0.148 0.355z"
        }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-21e1e19c", esExports)
  }
}

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_chevron_up_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_77029795_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_chevron_up_vue__ = __webpack_require__(49);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_chevron_up_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_77029795_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_chevron_up_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-chevron-up.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-77029795", Component.options)
  } else {
    hotAPI.reload("data-v-77029795", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      attrs: {
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "14",
        height: "14",
        viewBox: "0 0 14 14"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M13.148 10.398l-1.297 1.289q-0.148 0.148-0.352 0.148t-0.352-0.148l-4.148-4.148-4.148 4.148q-0.148 0.148-0.352 0.148t-0.352-0.148l-1.297-1.289q-0.148-0.148-0.148-0.355t0.148-0.355l5.797-5.789q0.148-0.148 0.352-0.148t0.352 0.148l5.797 5.789q0.148 0.148 0.148 0.355t-0.148 0.355z"
        }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-77029795", esExports)
  }
}

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8bec5932_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_key_vue__ = __webpack_require__(51);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8bec5932_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_key_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-key.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8bec5932", Component.options)
  } else {
    hotAPI.reload("data-v-8bec5932", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        width: "24",
        height: "24",
        xmlns: "http://www.w3.org/2000/svg",
        "fill-rule": "evenodd",
        "clip-rule": "evenodd"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M12.804 9c1.038-1.793 2.977-3 5.196-3 3.311 0 6 2.689 6 6s-2.689 6-6 6c-2.219 0-4.158-1.207-5.196-3h-3.804l-1.506-1.503-1.494 1.503-1.48-1.503-1.52 1.503-3-3.032 2.53-2.968h10.274zm7.696 1.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"
        }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8bec5932", esExports)
  }
}

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1e2525d6_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_lock_closed_vue__ = __webpack_require__(53);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1e2525d6_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_lock_closed_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-lock-closed.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1e2525d6", Component.options)
  } else {
    hotAPI.reload("data-v-1e2525d6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"
        }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1e2525d6", esExports)
  }
}

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_41a59834_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_lock_open_vue__ = __webpack_require__(55);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_41a59834_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_lock_open_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-lock-open.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-41a59834", Component.options)
  } else {
    hotAPI.reload("data-v-41a59834", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"
        }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-41a59834", esExports)
  }
}

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_048b517c_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_plus_vue__ = __webpack_require__(57);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_048b517c_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_plus_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-plus.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-048b517c", Component.options)
  } else {
    hotAPI.reload("data-v-048b517c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24"
      }
    },
    [_c("path", { attrs: { d: "M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z" } })]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-048b517c", esExports)
  }
}

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4c036d90_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_plus_square_vue__ = __webpack_require__(59);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4c036d90_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_plus_square_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-plus-square.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4c036d90", Component.options)
  } else {
    hotAPI.reload("data-v-4c036d90", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-5v5h-4v-5h-5v-4h5v-5h4v5h5v4z"
        }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4c036d90", esExports)
  }
}

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_13313d00_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_x_vue__ = __webpack_require__(61);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_13313d00_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_x_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-x.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-13313d00", Component.options)
  } else {
    hotAPI.reload("data-v-13313d00", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24"
      }
    },
    [
      _c("path", {
        attrs: {
          d:
            "M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
        }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-13313d00", esExports)
  }
}

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_upload_vue__ = __webpack_require__(15);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6a688829_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_upload_vue__ = __webpack_require__(63);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_upload_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6a688829_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_upload_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-upload.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6a688829", Component.options)
  } else {
    hotAPI.reload("data-v-6a688829", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24"
      }
    },
    [_c("path", { attrs: { d: "M12 0.75l-11.25 11.25h6.75v12h9v-12h6.75z" } })]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6a688829", esExports)
  }
}

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_download_vue__ = __webpack_require__(16);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5814e330_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_download_vue__ = __webpack_require__(65);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_svg_download_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5814e330_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_svg_download_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/UI/icons/res/svg-download.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5814e330", Component.options)
  } else {
    hotAPI.reload("data-v-5814e330", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "webdollarFont",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24"
      }
    },
    [
      _c("path", {
        attrs: { d: "M12 23.25l11.25-11.25h-6.75v-12h-9v12h-6.75z" }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5814e330", esExports)
  }
}

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { on: { click: this.handleClick } },
    [
      this.icon === "chevron-up" ? _c("svgChevronUp") : _vm._e(),
      this.icon === "chevron-down" ? _c("svgChevronDown") : _vm._e(),
      this.icon === "key" ? _c("svgKey") : _vm._e(),
      this.icon === "lock-closed" ? _c("svgLockClosed") : _vm._e(),
      this.icon === "lock-open" ? _c("svgLockOpen") : _vm._e(),
      this.icon === "plus" ? _c("svgPlus") : _vm._e(),
      this.icon === "plus-square" ? _c("svgPlusSquare") : _vm._e(),
      this.icon === "x" ? _c("svgX") : _vm._e(),
      this.icon === "upload" ? _c("svgUpload") : _vm._e(),
      this.icon === "download" ? _c("svgDownload") : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4a4e8449", esExports)
  }
}

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Address_vue__ = __webpack_require__(17);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fd10b33_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Address_vue__ = __webpack_require__(89);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(68)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Address_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fd10b33_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Address_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Address.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6fd10b33", Component.options)
  } else {
    hotAPI.reload("data-v-6fd10b33", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(69);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("45018b1c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6fd10b33\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Address.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6fd10b33\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Address.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n#allWalets .walletAddress{\n    padding: 0!important;\n    padding-right: 0;\n    width: 100%;\n    border-top-left-radius: 50px;\n    border-bottom-left-radius: 50px;\n    margin: 15px 10px;\n    transition: all .3s linear;\n}\n#allWalets .walletAddress .addressIdentityBox{\n    cursor: pointer;\n}\n#allWalets .walletAddress:last-child{\n    margin-bottom: 1px;\n}\n#allWalets .walletAddress img{\n    height: 40px;\n    display: inline-block;\n    vertical-align: top;\n    border-radius: 100%;\n}\n#allWalets .walletAddress:hover{\n    margin: 15px 20px;\n    background-color: #313131;\n    transition: all .3s linear;\n}\n.walletAddress b{\n    text-align: center;\n    display: inline-block;\n    color: #fcbd2d;\n    line-height: 40px;\n    padding-top: 1px;\n    margin-left: 7px;\n    font-size: 12px;\n    vertical-align: top;\n}\n.addressButton{\n    display:inline-block;\n    padding: 7px 12px;\n    vertical-align: top;\n    height: 27px;\n    margin-right: -4px;\n    cursor: pointer;\n    transition: all .3s linear;\n}\n.addressButton:hover{\n    background-color: #1f1f1f;\n    transition: all .3s linear;\n}\n.actionsBox{\n    float: right;\n    display: none;\n    margin-right: 25px;\n}\n.addressIdentityBox{\n    display: inline-block;\n}\n.hoverAddress:hover .actionsBox{\n    display: inline-block;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/src/components/Wallet/Address/Address.vue"],"names":[],"mappings":";AAqGA;IACA,qBAAA;IACA,iBAAA;IACA,YAAA;IACA,6BAAA;IACA,gCAAA;IACA,kBAAA;IACA,2BAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,mBAAA;CACA;AAEA;IACA,aAAA;IACA,sBAAA;IACA,oBAAA;IACA,oBAAA;CACA;AAEA;IACA,kBAAA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,mBAAA;IACA,sBAAA;IACA,eAAA;IACA,kBAAA;IACA,iBAAA;IACA,iBAAA;IACA,gBAAA;IACA,oBAAA;CACA;AAEA;IACA,qBAAA;IACA,kBAAA;IACA,oBAAA;IACA,aAAA;IACA,mBAAA;IACA,gBAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,aAAA;IACA,cAAA;IACA,mBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,sBAAA;CACA","file":"Address.vue","sourcesContent":["<template>\n    <div class=\"walletAddress hoverAddress\">\n\n        <div class=\"addressIdentityBox\" v-on:click.stop=\"handleTransferFunds\">\n            <img class=\"walletAddressImage\" :src=\"this.getAddressPic\" >\n\n            <b><ShowBalance :address=\"this.address\" currency=\"0x01\"/> WEBD</b>\n        </div>\n\n        <div class=\"actionsBox hoverAddress\" :style=\"{marginBottom: this.opened ? this.walletButtonMarginOpened+'px': this.walletButtonMarginClosed+'px'}\">\n            <div class=\"addressButton\" v-on:click.stop=\"handleExport\">\n                <icon class=\"btn\" alt=\"Secure Wallet\" text=\"Download Address\" icon=\"download\" />\n            </div>\n\n            <div class=\"addressButton\" v-on:click.stop=\"handleLock\">\n                <icon class=\"btn\" alt=\"Secure Wallet\" text=\"Lock Address\" icon=\"lock-open\" />\n            </div>\n\n            <div class=\"addressButton\" v-on:click.stop=\"handleDelete\">\n                <icon class=\"btn\" alt=\"Secure Wallet\" text=\"Delete Address\" icon=\"x\" />\n            </div>\n        </div>\n\n        <TransactionModal ref=\"refTransactionModal\" :address=\"this.address\" />\n        <LockModal ref=\"refLockModal\" :address=\"this.address\" />\n        <DeleteModal ref=\"refDeleteModal\" :address=\"this.address\" />\n\n    </div>\n</template>\n\n\n<script>\n\n    import FileSaver from './../../../../node_modules/file-saver'\n    import icon from \"components/UI/icons/icon.vue\"\n    import TransactionModal from \"./Modals/Transaction.modal.vue\"\n    import LockModal from \"./Modals/Lock.modal.vue\"\n    import DeleteModal from \"./Modals/Delete.modal.vue\"\n    import ShowBalance from \"components/Wallet/Address/Balance/ShowBalance.vue\"\n\n    export default{\n\n        props:{\n            address:{default:''},\n        },\n\n        components:{\n            \"TransactionModal\":TransactionModal,\n            \"ShowBalance\":ShowBalance,\n            \"icon\":icon,\n            \"LockModal\":LockModal,\n            \"DeleteModal\":DeleteModal,\n        },\n\n        computed: {\n            getAddressPic(){\n                return WebDollar.Blockchain.Wallet.getAddressPic(this.address);\n            }\n        },\n\n        methods:{\n\n            handleTransferFunds(e){\n\n                this.$refs['refTransactionModal'].showModal(e);\n\n            },\n\n            async handleExport(e){\n\n                let answer = await WebDollar.Blockchain.Wallet.exportPrivateKeyFromAddress(this.address);\n\n                if (answer.result){\n\n                    let addressFile = new Blob([JSON.stringify(answer.data)], {type: \"application/json;charset=utf-8\"});\n                    FileSaver.saveAs(addressFile, this.address + \".webd\");\n\n                } else {\n                    alert(answer.message)\n                }\n\n            },\n\n            handleLock(e){\n\n                this.$refs['refLockModal'].showModal(e);\n\n            },\n\n            handleDelete(e){\n\n                this.$refs['refDeleteModal'].showModal(e);\n\n            },\n\n        }\n\n    }\n</script>\n\n<style>\n\n    #allWalets .walletAddress{\n        padding: 0!important;\n        padding-right: 0;\n        width: 100%;\n        border-top-left-radius: 50px;\n        border-bottom-left-radius: 50px;\n        margin: 15px 10px;\n        transition: all .3s linear;\n    }\n\n    #allWalets .walletAddress .addressIdentityBox{\n        cursor: pointer;\n    }\n\n    #allWalets .walletAddress:last-child{\n        margin-bottom: 1px;\n    }\n\n    #allWalets .walletAddress img{\n        height: 40px;\n        display: inline-block;\n        vertical-align: top;\n        border-radius: 100%;\n    }\n\n    #allWalets .walletAddress:hover{\n        margin: 15px 20px;\n        background-color: #313131;\n        transition: all .3s linear;\n    }\n\n    .walletAddress b{\n        text-align: center;\n        display: inline-block;\n        color: #fcbd2d;\n        line-height: 40px;\n        padding-top: 1px;\n        margin-left: 7px;\n        font-size: 12px;\n        vertical-align: top;\n    }\n\n    .addressButton{\n        display:inline-block;\n        padding: 7px 12px;\n        vertical-align: top;\n        height: 27px;\n        margin-right: -4px;\n        cursor: pointer;\n        transition: all .3s linear;\n    }\n\n    .addressButton:hover{\n        background-color: #1f1f1f;\n        transition: all .3s linear;\n    }\n\n    .actionsBox{\n        float: right;\n        display: none;\n        margin-right: 25px;\n    }\n\n    .addressIdentityBox{\n        display: inline-block;\n    }\n\n    .hoverAddress:hover .actionsBox{\n        display: inline-block;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if (("function" !== "undefined" && __webpack_require__(71) !== null) && (__webpack_require__(72) !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_modal_vue__ = __webpack_require__(18);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b1961e5_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_modal_vue__ = __webpack_require__(80);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Transaction_modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b1961e5_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Transaction_modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Transaction.modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b1961e5", Component.options)
  } else {
    hotAPI.reload("data-v-0b1961e5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(75);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("2c59824d", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d4961080\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Modal.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d4961080\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.modal input:focus, .modal textarea:focus{\n    outline: none;\n}\n.content{\n    padding: 20px;\n    padding-top: 30px;\n}\n.modal{\n    width: 50%;\n    height: auto;\n    border-radius: 5px;\n    max-width: 550px;\n    min-width: 450px;\n    position: fixed;\n    margin: 0 auto;\n    border: solid 1px #313131;\n    left: 0;\n    right: 0;\n    text-align: center;\n    background-color: #1f1f1f;\n    z-index: 1600;\n    top: 50%;\n    -ms-transform: translateY(-50%);\n        transform: translateY(-50%);\n}\n.modal #walletID{\n    word-wrap: break-word;\n    display: block;\n    line-height: 12px;\n    margin: 10px 0;\n    font-weight: 100;\n}\n.modalBackground{\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    display: block;\n    z-index: 1000;\n    top:0;\n    left: 0;\n    background-color: rgba(0, 0, 0, 0.83);\n}\n.modal .close{\n    position: fixed;\n    top: -10px;\n    right: 10px!important;\n    font-size: 40px;\n    display: block;\n    color: #ffc12c;\n    cursor: pointer;\n}\n.modal .title{\n    background-color: #262626;\n    padding: 10px 0;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    line-height: 22px;\n    color: #ffc12c;\n}\n.modal .footer .button{\n    display: inline;\n    cursor: pointer;\n}\n.modal b{\n    margin-left: 0;\n}\n.modal .twoColums{\n    border-bottom: solid 1px #313131;\n    background-color: #151515;\n}\n.modal .ballance{\n    color: #ffc12c!important;\n    font-size: 24px;\n    margin-top: 20px;\n}\n.modal .transfer{\n    padding: 0 10px;\n}\n.modal .transfer input{\n    border: none;\n    background-color: #333333;\n    padding: 10px 0 10px 10px;\n    margin: 10px 0;\n    color: #fff\n}\n.modal .transfer .address{\n    width: 100%;\n    display: block;\n}\n.modal .transfer .amount {\n    width: 100%;\n}\n.modal .transfer .title{\n    background-color: #1f1f1f;\n    padding-top: 30px;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    padding-bottom: 20px;\n    color: #d4d4d4;\n}\n.modal .transfer .button{\n    margin-top: 10px;\n    background-color: #ffc12c;\n    color: #1f1f1f;\n    margin-bottom: 15px;\n    width: 100%;\n    font-size: 14px;\n    border: none;\n    padding: 15px 0 15px 0;\n    border-radius: 5px;\n    transition: all 0.5s ease;\n}\n.modal .transfer .button:hover{\n    background-color: #fbdb8d;\n    color: #000000;\n    transition: all 0.5s ease\n}\n.twoColums{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr;\n        grid-template-columns: 1fr 1fr;\n}\n.addressActions{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr 1fr 1fr;\n        grid-template-columns: 1fr 1fr 1fr 1fr;\n    border-bottom: solid 1px #313131;\n    border-top: solid 3px #000;\n}\n.addressActions .actionButton{\n    display: inline-block;\n    background-color: #333;\n    color: #ffc12c;\n    padding: 5px;\n    padding-top: 8px;\n    border-left: solid 1px #6d6d6d;\n    border-collapse: collapse;\n    transition: all 0.5s ease\n}\n.addressActions .actionButton:hover{\n    background-color: #232222;\n    color: #ffdd8c;\n    transition: all 0.5s ease\n}\n.addressActions .actionButton:first-child{\n    border-left:none;\n}\n.activeActionButton{\n    background-color: #ffc12c!important;\n    color: #000!important;\n}\n.twoColums .section{\n    overflow: hidden;\n    padding: 20px;\n    color: #D5D5D5;\n}\n.twoColums .section:first-child{\n    border-right: solid 1px #313131;\n}\n.copyToClipboard{\n    background-color: #353535;\n    border-radius: 5px;\n    padding: 7px 0 5px 0;\n    border: solid 1px #777;\n    font-size: 12px;\n    padding: 7px 0 5px 0;\n    width: 150px;\n    margin: 0 auto;\n    transition: all 0.5s ease\n}\n.copyToClipboard:hover{\n    background-color: #000;\n    transition: all 0.5s ease\n}\n.copyToClipboardSuccess{\n    color: #149008;\n    font-size: 14px;\n}\n.transferListContainer{\n    list-style: none;\n    padding: 0;\n    max-height: 200px;\n    overflow: scroll;\n}\n.transferListElement{\n    font-size: 12px;\n    color: #fff;\n    list-style: none;\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 2fr;\n        grid-template-columns: 1fr 2fr;\n    grid-column-gap: 15px;\n    white-space: nowrap ;\n    text-align: left;\n    background-color: #151515;\n    padding: 5px 10px;\n}\n.destinations{\n    list-style: none;\n    padding: 0;\n}\n.money, .destinationAddress{\n    display: inline-block;\n}\n.destinationAddress{\n    width: 70%;\n    overflow: hidden;\n}\n.money{\n    width: 20%;\n    padding-left: 10px;\n    display: inline-block;\n    float: right;\n    text-align: right;\n}\n.currency{\n    margin-left: 5px;\n}\n.pairListElement{\n    background-color: #333333;\n}\n.transferListContainer .money{\n    color:#ffc12c;\n}\n.transferListContainer .source{\n    color: #c5c5c5;\n}\n.transferList .header{\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr 1fr 1fr;\n        grid-template-columns: 1fr 1fr 1fr;\n}\n.headerElement{\n    display: inline-block;\n    text-align: center;\n    color: #d4d4d4;\n    margin-top: 15px;\n    font-size: 14px;\n}\n@media (max-width:831px){\n#walletID{\n        font-size: 12px!important;\n        line-height: 14px!important;\n}\n}\n@media (max-width:600px)  {\n.modal{\n        width: 100%;\n        max-width: none;\n        min-width: none;\n        max-height: 100%;\n        overflow-y: auto;\n}\n.twoColums{\n        display: inline-block;\n}\n.twoColums .section:first-child {\n        border-bottom: solid 1px #313131;\n        border-right: none;\n}\n.modal .ballance{\n        margin-top: 0;\n}\n.addressActions .actionButton{\n        line-height: 50px;\n        font-size: 20px;\n}\n.modal .transfer input{\n        padding: 15px 0 15px 10px;\n        font-size: 16px;\n}\n.modal .transfer .button{\n        line-height: 26px;\n        font-size: 20px;\n        margin-bottom: 50px;\n}\n.modal .title{\n        padding: 20px 0;\n}\n.modal .close{\n        top:0;\n        right: 30px!important;\n}\n.modal .twoColums{\n        width: 100%;\n        -ms-grid-columns: 1fr;\n            grid-template-columns: 1fr;\n}\n.modal{\n        min-width: auto;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/UI/modal/src/components/UI/modal/Modal.vue"],"names":[],"mappings":";AA0EA;IACA,cAAA;CACA;AAEA;IACA,cAAA;IACA,kBAAA;CACA;AAEA;IACA,WAAA;IACA,aAAA;IACA,mBAAA;IACA,iBAAA;IACA,iBAAA;IACA,gBAAA;IACA,eAAA;IACA,0BAAA;IACA,QAAA;IACA,SAAA;IACA,mBAAA;IACA,0BAAA;IACA,cAAA;IACA,SAAA;IACA,gCAAA;QAAA,4BAAA;CACA;AAEA;IACA,sBAAA;IACA,eAAA;IACA,kBAAA;IACA,eAAA;IACA,iBAAA;CACA;AAEA;IACA,gBAAA;IACA,aAAA;IACA,YAAA;IACA,eAAA;IACA,cAAA;IACA,MAAA;IACA,QAAA;IACA,sCAAA;CACA;AAEA;IACA,gBAAA;IACA,WAAA;IACA,sBAAA;IACA,gBAAA;IACA,eAAA;IACA,eAAA;IACA,gBAAA;CACA;AAEA;IACA,0BAAA;IACA,gBAAA;IACA,0BAAA;IACA,oBAAA;IACA,kBAAA;IACA,eAAA;CACA;AAEA;IACA,gBAAA;IACA,gBAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,iCAAA;IACA,0BAAA;CACA;AAEA;IACA,yBAAA;IACA,gBAAA;IACA,iBAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,aAAA;IACA,0BAAA;IACA,0BAAA;IACA,eAAA;IACA,WAAA;CACA;AAEA;IACA,YAAA;IACA,eAAA;CACA;AAEA;IACA,YAAA;CACA;AAEA;IACA,0BAAA;IACA,kBAAA;IACA,0BAAA;IACA,oBAAA;IACA,qBAAA;IACA,eAAA;CACA;AAEA;IACA,iBAAA;IACA,0BAAA;IACA,eAAA;IACA,oBAAA;IACA,YAAA;IACA,gBAAA;IACA,aAAA;IACA,uBAAA;IACA,mBAAA;IACA,0BAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,yBAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,0BAAA;QAAA,+BAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,kCAAA;QAAA,uCAAA;IACA,iCAAA;IACA,2BAAA;CACA;AAEA;IACA,sBAAA;IACA,uBAAA;IACA,eAAA;IACA,aAAA;IACA,iBAAA;IACA,+BAAA;IACA,0BAAA;IACA,yBAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,yBAAA;CACA;AAEA;IACA,iBAAA;CACA;AAEA;IACA,oCAAA;IACA,sBAAA;CACA;AAEA;IACA,iBAAA;IACA,cAAA;IACA,eAAA;CACA;AAEA;IACA,gCAAA;CACA;AAEA;IACA,0BAAA;IACA,mBAAA;IACA,qBAAA;IACA,uBAAA;IACA,gBAAA;IACA,qBAAA;IACA,aAAA;IACA,eAAA;IACA,yBAAA;CACA;AAEA;IACA,uBAAA;IACA,yBAAA;CACA;AAEA;IACA,eAAA;IACA,gBAAA;CACA;AAEA;IACA,iBAAA;IACA,WAAA;IACA,kBAAA;IACA,iBAAA;CACA;AAEA;IACA,gBAAA;IACA,YAAA;IACA,iBAAA;IACA,kBAAA;IAAA,cAAA;IACA,0BAAA;QAAA,+BAAA;IACA,sBAAA;IACA,qBAAA;IACA,iBAAA;IACA,0BAAA;IACA,kBAAA;CACA;AAEA;IACA,iBAAA;IACA,WAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,WAAA;IACA,iBAAA;CACA;AAEA;IACA,WAAA;IACA,mBAAA;IACA,sBAAA;IACA,aAAA;IACA,kBAAA;CACA;AAEA;IACA,iBAAA;CACA;AAEA;IACA,0BAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,kBAAA;IAAA,cAAA;IACA,8BAAA;QAAA,mCAAA;CACA;AAEA;IACA,sBAAA;IACA,mBAAA;IACA,eAAA;IACA,iBAAA;IACA,gBAAA;CACA;AAEA;AAEA;QACA,0BAAA;QACA,4BAAA;CACA;CAEA;AAEA;AAEA;QACA,YAAA;QACA,gBAAA;QACA,gBAAA;QACA,iBAAA;QACA,iBAAA;CACA;AACA;QACA,sBAAA;CACA;AACA;QACA,iCAAA;QACA,mBAAA;CACA;AACA;QACA,cAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;CACA;AACA;QACA,0BAAA;QACA,gBAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;QACA,oBAAA;CACA;AACA;QACA,gBAAA;CACA;AACA;QACA,MAAA;QACA,sBAAA;CACA;AACA;QACA,YAAA;QACA,sBAAA;YAAA,2BAAA;CACA;AACA;QACA,gBAAA;CACA;CACA","file":"Modal.vue","sourcesContent":["<template>\n\n    <div v-if=\"this.modalOpened\">\n        <div class=\"modalBackground\" @click=\"this.closeModal\"> </div>\n        <div class=\"modal\" ref=\"refModal\">\n\n            <div class=\"close\" @click=\"this.closeModal\">\n                x\n            </div>\n\n            <div class=\"header\">\n                <div class=\"title\">\n                    {{this.title}}\n                </div>\n            </div>\n\n            <div class=\"content\">\n                <slot name=\"content\"></slot>\n            </div>\n\n        </div>\n    </div>\n\n</template>\n\n\n<script>\n\n    export default{\n\n        name: \"Modal\",\n\n        data: () => {\n            return {\n                modalOpened: false,\n            }\n        },\n\n        props:{\n\n            title: {default: 'Modal Title'},\n            buttons: {default: ()=>{return [{text:\"cancel\"}]}}\n\n        },\n\n        methods:{\n\n            closeModal(e){\n\n                if(e!=undefined) e.stopPropagation();\n\n                this.modalOpened = false;\n                console.log(\"closeModal2\");\n\n            },\n\n            showModal(e){\n\n                if (e !== undefined)\n                    e.stopPropagation();\n\n                console.log(\"showModal\");\n                this.modalOpened = true;\n            },\n\n        }\n\n    }\n\n</script>\n\n\n\n<style>\n\n    .modal input:focus, .modal textarea:focus{\n        outline: none;\n    }\n\n    .content{\n        padding: 20px;\n        padding-top: 30px;\n    }\n\n    .modal{\n        width: 50%;\n        height: auto;\n        border-radius: 5px;\n        max-width: 550px;\n        min-width: 450px;\n        position: fixed;\n        margin: 0 auto;\n        border: solid 1px #313131;\n        left: 0;\n        right: 0;\n        text-align: center;\n        background-color: #1f1f1f;\n        z-index: 1600;\n        top: 50%;\n        transform: translateY(-50%);\n    }\n\n    .modal #walletID{\n        word-wrap: break-word;\n        display: block;\n        line-height: 12px;\n        margin: 10px 0;\n        font-weight: 100;\n    }\n\n    .modalBackground{\n        position: fixed;\n        height: 100%;\n        width: 100%;\n        display: block;\n        z-index: 1000;\n        top:0;\n        left: 0;\n        background-color: rgba(0, 0, 0, 0.83);\n    }\n\n    .modal .close{\n        position: fixed;\n        top: -10px;\n        right: 10px!important;\n        font-size: 40px;\n        display: block;\n        color: #ffc12c;\n        cursor: pointer;\n    }\n\n    .modal .title{\n        background-color: #262626;\n        padding: 10px 0;\n        text-transform: uppercase;\n        letter-spacing: 4px;\n        line-height: 22px;\n        color: #ffc12c;\n    }\n\n    .modal .footer .button{\n        display: inline;\n        cursor: pointer;\n    }\n\n    .modal b{\n        margin-left: 0;\n    }\n\n    .modal .twoColums{\n        border-bottom: solid 1px #313131;\n        background-color: #151515;\n    }\n\n    .modal .ballance{\n        color: #ffc12c!important;\n        font-size: 24px;\n        margin-top: 20px;\n    }\n\n    .modal .transfer{\n        padding: 0 10px;\n    }\n\n    .modal .transfer input{\n        border: none;\n        background-color: #333333;\n        padding: 10px 0 10px 10px;\n        margin: 10px 0;\n        color: #fff\n    }\n\n    .modal .transfer .address{\n        width: 100%;\n        display: block;\n    }\n\n    .modal .transfer .amount {\n        width: 100%;\n    }\n\n    .modal .transfer .title{\n        background-color: #1f1f1f;\n        padding-top: 30px;\n        text-transform: uppercase;\n        letter-spacing: 4px;\n        padding-bottom: 20px;\n        color: #d4d4d4;\n    }\n\n    .modal .transfer .button{\n        margin-top: 10px;\n        background-color: #ffc12c;\n        color: #1f1f1f;\n        margin-bottom: 15px;\n        width: 100%;\n        font-size: 14px;\n        border: none;\n        padding: 15px 0 15px 0;\n        border-radius: 5px;\n        transition: all 0.5s ease;\n    }\n\n    .modal .transfer .button:hover{\n        background-color: #fbdb8d;\n        color: #000000;\n        transition: all 0.5s ease\n    }\n\n    .twoColums{\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n    }\n\n    .addressActions{\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr 1fr;\n        border-bottom: solid 1px #313131;\n        border-top: solid 3px #000;\n    }\n\n    .addressActions .actionButton{\n        display: inline-block;\n        background-color: #333;\n        color: #ffc12c;\n        padding: 5px;\n        padding-top: 8px;\n        border-left: solid 1px #6d6d6d;\n        border-collapse: collapse;\n        transition: all 0.5s ease\n    }\n\n    .addressActions .actionButton:hover{\n        background-color: #232222;\n        color: #ffdd8c;\n        transition: all 0.5s ease\n    }\n\n    .addressActions .actionButton:first-child{\n        border-left:none;\n    }\n\n    .activeActionButton{\n        background-color: #ffc12c!important;\n        color: #000!important;\n    }\n\n    .twoColums .section{\n        overflow: hidden;\n        padding: 20px;\n        color: #D5D5D5;\n    }\n\n    .twoColums .section:first-child{\n        border-right: solid 1px #313131;\n    }\n\n    .copyToClipboard{\n        background-color: #353535;\n        border-radius: 5px;\n        padding: 7px 0 5px 0;\n        border: solid 1px #777;\n        font-size: 12px;\n        padding: 7px 0 5px 0;\n        width: 150px;\n        margin: 0 auto;\n        transition: all 0.5s ease\n    }\n\n    .copyToClipboard:hover{\n        background-color: #000;\n        transition: all 0.5s ease\n    }\n\n    .copyToClipboardSuccess{\n        color: #149008;\n        font-size: 14px;\n    }\n\n    .transferListContainer{\n        list-style: none;\n        padding: 0;\n        max-height: 200px;\n        overflow: scroll;\n    }\n\n    .transferListElement{\n        font-size: 12px;\n        color: #fff;\n        list-style: none;\n        display: grid;\n        grid-template-columns: 1fr 2fr;\n        grid-column-gap: 15px;\n        white-space: nowrap ;\n        text-align: left;\n        background-color: #151515;\n        padding: 5px 10px;\n    }\n\n    .destinations{\n        list-style: none;\n        padding: 0;\n    }\n\n    .money, .destinationAddress{\n        display: inline-block;\n    }\n\n    .destinationAddress{\n        width: 70%;\n        overflow: hidden;\n    }\n\n    .money{\n        width: 20%;\n        padding-left: 10px;\n        display: inline-block;\n        float: right;\n        text-align: right;\n    }\n\n    .currency{\n        margin-left: 5px;\n    }\n\n    .pairListElement{\n        background-color: #333333;\n    }\n\n    .transferListContainer .money{\n        color:#ffc12c;\n    }\n\n    .transferListContainer .source{\n        color: #c5c5c5;\n    }\n\n    .transferList .header{\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr;\n    }\n\n    .headerElement{\n        display: inline-block;\n        text-align: center;\n        color: #d4d4d4;\n        margin-top: 15px;\n        font-size: 14px;\n    }\n\n    @media (max-width:831px){\n\n        #walletID{\n            font-size: 12px!important;\n            line-height: 14px!important;\n        }\n\n    }\n\n    @media (max-width:600px)  {\n\n        .modal{\n            width: 100%;\n            max-width: none;\n            min-width: none;\n            max-height: 100%;\n            overflow-y: auto;\n        }\n        .twoColums{\n            display: inline-block;\n        }\n        .twoColums .section:first-child {\n            border-bottom: solid 1px #313131;\n            border-right: none;\n        }\n        .modal .ballance{\n            margin-top: 0;\n        }\n        .addressActions .actionButton{\n            line-height: 50px;\n            font-size: 20px;\n        }\n        .modal .transfer input{\n            padding: 15px 0 15px 10px;\n            font-size: 16px;\n        }\n        .modal .transfer .button{\n            line-height: 26px;\n            font-size: 20px;\n            margin-bottom: 50px;\n        }\n        .modal .title{\n            padding: 20px 0;\n        }\n        .modal .close{\n            top:0;\n            right: 30px!important;\n        }\n        .modal .twoColums{\n            width: 100%;\n            grid-template-columns: 1fr;\n        }\n        .modal{\n            min-width: auto;\n        }\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return this.modalOpened
    ? _c("div", [
        _c("div", {
          staticClass: "modalBackground",
          on: { click: this.closeModal }
        }),
        _c("div", { ref: "refModal", staticClass: "modal" }, [
          _c("div", { staticClass: "close", on: { click: this.closeModal } }, [
            _vm._v("\n            x\n        ")
          ]),
          _c("div", { staticClass: "header" }, [
            _c("div", { staticClass: "title" }, [
              _vm._v(
                "\n                " + _vm._s(this.title) + "\n            "
              )
            ])
          ]),
          _c("div", { staticClass: "content" }, [_vm._t("content")], 2)
        ])
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d4961080", esExports)
  }
}

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(78);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("d1ca6472", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1f1fe1ea\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ShowBalance.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1f1fe1ea\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ShowBalance.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.show-balance-span{\n    display: inline-block;\n    margin-right: 4px;\n    color: #fec02c;\n    vertical-align: top;\n    margin-top: 0;\n    text-align: center;\n}\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Balance/src/components/Wallet/Address/Balance/ShowBalance.vue"],"names":[],"mappings":";AA4EA;IACA,sBAAA;IACA,kBAAA;IACA,eAAA;IACA,oBAAA;IACA,cAAA;IACA,mBAAA;CACA","file":"ShowBalance.vue","sourcesContent":["<template>\n\n    <div class=\"show-balance-span\">\n        {{ (this.balances !== null && this.balances !== undefined && this.balances.hasOwnProperty(this.currency)) ? Math.round(this.balances[this.currency] * 1000)/1000 : 0 }}\n    </div>\n\n</template>\n\n<script>\n\n    export default{\n\n        name: \"ShowBalance\",\n\n        props: ['address', 'currency'],\n\n        data(){\n          return {\n              balances: {},\n              subscription: null,\n            }\n        },\n\n        mounted(){\n\n            if (typeof window === \"undefined\") return;\n\n            this.currency = this.currency || '0x01';\n\n            if (typeof this.address === \"object\" && typeof this.address.hasOwnProperty(\"balances\") ){ //it is an address object\n                this.balances = this.address.balances;\n                return;\n            }\n\n            let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(this.address, (data)=>{\n                this.balances = data.balances;\n            });\n\n            if (data !== null) {\n                this.subscription = data.subscription;\n                this.balances = data.balances;\n            }\n\n        },\n\n        watch: {\n            address: function (newVal, oldVal) { // watch it\n\n                if (typeof newVal === \"object\" && typeof newVal.hasOwnProperty(\"balances\") ){ //it is an address object\n                    this.balances = newVal.balances;\n                    return;\n                }\n\n                WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.subscription);\n\n                let data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(newVal, (data)=>{\n                    this.balances = data.balances;\n                });\n\n\n                if (data !== null) {\n                    this.subscription = data.subscription;\n                    this.balances = data.balances;\n                }\n\n            },\n\n            currency: function (newVal, oldVal) { // watch it\n\n            }\n        }\n\n    }\n\n</script>\n\n<style>\n    .show-balance-span{\n        display: inline-block;\n        margin-right: 4px;\n        color: #fec02c;\n        vertical-align: top;\n        margin-top: 0;\n        text-align: center;\n    }\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "show-balance-span" }, [
    _vm._v(
      "\n    " +
        _vm._s(
          this.balances !== null &&
          this.balances !== undefined &&
          this.balances.hasOwnProperty(this.currency)
            ? Math.round(this.balances[this.currency] * 1000) / 1000
            : 0
        ) +
        "\n"
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1f1fe1ea", esExports)
  }
}

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return this.address !== null && this.address !== undefined
    ? _c(
        "div",
        [
          _c("Modal", { ref: "refModal", attrs: { title: "Wallet Address" } }, [
            _c("div", { attrs: { slot: "content" }, slot: "content" }, [
              _c("div", { staticClass: "twoColums" }, [
                _c("div", { staticClass: "section" }, [
                  _c("div", { staticStyle: { "font-size": "20px" } }, [
                    _vm._v(
                      "\n                        Address\n                    "
                    )
                  ]),
                  _c(
                    "b",
                    {
                      staticStyle: { color: "gray" },
                      attrs: { id: "walletID" }
                    },
                    [_vm._v(_vm._s(this.address.toString()))]
                  ),
                  _c(
                    "div",
                    {
                      class:
                        this.clipboardText != "Copied"
                          ? "copyToClipboard"
                          : "copyToClipboardSuccess",
                      on: { click: _vm.copyToClipboard }
                    },
                    [
                      _vm._v(
                        "\n                        " +
                          _vm._s(this.clipboardText) +
                          "\n                    "
                      )
                    ]
                  )
                ]),
                _c("div", { staticClass: "section" }, [
                  _c("div", { staticStyle: { "font-size": "20px" } }, [
                    _vm._v(
                      "\n                        Balance\n                    "
                    )
                  ]),
                  _c(
                    "b",
                    { staticClass: "ballance", staticStyle: { color: "gray" } },
                    [
                      _c("ShowBalance", {
                        attrs: { address: this.address, currency: "0x01" }
                      }),
                      _vm._v("WEBD")
                    ],
                    1
                  )
                ])
              ]),
              _c("div", { staticClass: "addressActions" }, [
                _c(
                  "div",
                  {
                    class: [
                      this.isTransfer
                        ? "actionButton activeActionButton"
                        : "actionButton"
                    ],
                    on: { click: this.showTransfer }
                  },
                  [_vm._v("\n                    Transfer\n                ")]
                ),
                _c(
                  "div",
                  {
                    class: [
                      this.isBuy
                        ? "actionButton activeActionButton"
                        : "actionButton"
                    ],
                    on: { click: this.showBuy }
                  },
                  [_vm._v("\n                    Buy\n                ")]
                ),
                _c(
                  "div",
                  {
                    class: [
                      this.isSell
                        ? "actionButton activeActionButton"
                        : "actionButton"
                    ],
                    on: { click: this.showSell }
                  },
                  [_vm._v("\n                    Sell\n                ")]
                ),
                _c(
                  "div",
                  {
                    class: [
                      this.isTransactionList
                        ? "actionButton activeActionButton"
                        : "actionButton"
                    ],
                    on: { click: this.showTransactions }
                  },
                  [
                    _vm._v(
                      "\n                    Transactions\n                "
                    )
                  ]
                )
              ]),
              _c(
                "form",
                {
                  staticClass: "transfer",
                  style: { display: this.isTransfer ? "block" : "none" }
                },
                [
                  _c("p", { staticClass: "title" }, [_vm._v("Transfer WEBD")]),
                  _c("input", {
                    staticClass: "address",
                    attrs: { placeholder: "Recipient Address" }
                  }),
                  _c("input", {
                    staticClass: "amount",
                    attrs: { placeholder: "WEBD Amount" }
                  }),
                  _c(
                    "button",
                    { staticClass: "button", attrs: { type: "submit" } },
                    [
                      _vm._v(
                        "\n                    SEND WEBD\n                "
                      )
                    ]
                  )
                ]
              ),
              _c("div", {
                staticClass: "transferList",
                style: { display: this.isTransactionList ? "block" : "none" }
              }),
              _c(
                "form",
                {
                  staticClass: "buy",
                  style: { display: this.isBuy ? "block" : "none" }
                },
                [
                  _c("p", { staticClass: "title" }, [
                    _vm._v("Temporary unavailable")
                  ])
                ]
              ),
              _c(
                "form",
                {
                  staticClass: "sell",
                  style: { display: this.isSell ? "block" : "none" }
                },
                [
                  _c("p", { staticClass: "title" }, [
                    _vm._v("Temporary unavailable")
                  ])
                ]
              )
            ])
          ])
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0b1961e5", esExports)
  }
}

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Lock_modal_vue__ = __webpack_require__(21);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b585992_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Lock_modal_vue__ = __webpack_require__(84);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(82)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Lock_modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b585992_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Lock_modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Lock.modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3b585992", Component.options)
  } else {
    hotAPI.reload("data-v-3b585992", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(83);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("74e0d8fa", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b585992\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Lock.modal.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b585992\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Lock.modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.descriptionTextPass{\n    color: #bdbdbd;\n    padding: 30px 10px;\n}\n.inputDeleteModalPass{\n    width: 100%;\n    width: -webkit-fill-available;\n    background-color: #2d2d2d;\n    border: none;\n    margin: 0 auto;\n    left: 0;\n    right: 0;\n    color: #ccc;\n    padding: 7px 0;\n    font-weight: 100;\n    font-size: 14px;\n    padding-left: 5px;\n}\n.modalButtonPass{\n    background-color: #131313;\n    color: #969696;\n    font-size: 12px;\n    width: 140px;\n    font-weight: bolder;\n    border-radius: 5px;\n    letter-spacing: 2px;\n    text-transform: uppercase;\n    padding: 8px 20px;\n    margin: 0 auto;\n    cursor: pointer;\n    border: solid 1px #5f5d5d;\n    transition: all .3s linear;\n}\n.modalButtonPass:hover{\n    background-color: #f6ba2c;\n    color: #000000;\n    transition: all .3s linear;\n}\n.inputAndGeneratorPass{\n    width: 100%;\n    margin: 0 auto;\n    display: -ms-grid;\n    display: grid;\n    -ms-grid-columns: 1fr;\n        grid-template-columns: 1fr;\n    border: solid 1px #5f5d5d;\n    margin-bottom: 20px;\n}\n.generatorButtonPass{\n    margin: 0!important;\n    width: 100%!important;\n    border-radius: 0!important;\n    border: none;\n    height: 15px!important;\n    padding: 8px 0!important;\n}\n.errorMessage{\n    color: #de604d;\n    padding-bottom: 20px;\n    display: block;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/src/components/Wallet/Address/Modals/Lock.modal.vue"],"names":[],"mappings":";AAsKA;IACA,eAAA;IACA,mBAAA;CACA;AAEA;IACA,YAAA;IACA,8BAAA;IACA,0BAAA;IACA,aAAA;IACA,eAAA;IACA,QAAA;IACA,SAAA;IACA,YAAA;IACA,eAAA;IACA,iBAAA;IACA,gBAAA;IACA,kBAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,gBAAA;IACA,aAAA;IACA,oBAAA;IACA,mBAAA;IACA,oBAAA;IACA,0BAAA;IACA,kBAAA;IACA,eAAA;IACA,gBAAA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,2BAAA;CACA;AAEA;IACA,YAAA;IACA,eAAA;IACA,kBAAA;IAAA,cAAA;IACA,sBAAA;QAAA,2BAAA;IACA,0BAAA;IACA,oBAAA;CACA;AAEA;IACA,oBAAA;IACA,sBAAA;IACA,2BAAA;IACA,aAAA;IACA,uBAAA;IACA,yBAAA;CACA;AAEA;IACA,eAAA;IACA,qBAAA;IACA,eAAA;CACA","file":"Lock.modal.vue","sourcesContent":["<template>\n\n    <div>\n\n        <Modal title=\"Wallet Address Secure\" ref=\"refPassModal\">\n\n            <div slot=\"content\">\n\n                <div >\n\n                    <div class=\"inputAndGeneratorPass\">\n                        <div>\n                            <input placeholder=\"Your 12 words Password\" v-model=\"walletAddressPassword\" class=\"inputDeleteModalPass\"/>\n                        </div>\n                        <div>\n                            <div @click=\"this.generatePasswrod\" class=\"modalButtonPass generatorButtonPass\">\n                                Generate random password\n                            </div>\n                        </div>\n                    </div>\n\n                    <span class=\"errorMessage\">{{this.errorMessage}}</span>\n\n                    <div @click=\"this.encryptPassword\" class=\"modalButtonPass\">\n                        Set Password\n                    </div>\n\n                </div>\n\n            </div>\n\n        </Modal>\n\n    </div>\n\n</template>\n\n<script>\n\n    var Vue = require('vue/dist/vue.min.js');\n    import Modal from \"components/UI/modal/Modal.vue\";\n\n    import Clipboard from './../../../../../node_modules/v-clipboard';\n\n    Vue.use(Clipboard);\n\n    export default {\n\n        props: {\n            address: {default: null},\n            toAddress: {default: null},\n            toAmount: {default: 0.0},\n        },\n\n        components: {\n            \"Modal\":Modal,\n        },\n\n        data: () => {\n            return {\n                clipboardText: 'Copy to Clipboard',\n                walletAddressPassword: '',\n                errorMessage: ''\n            }\n        },\n\n        methods: {\n\n            closeModal() {\n                this.$refs['refPassModal'].closeModal();\n            },\n\n            showModal(e) {\n\n                if (this.$refs['refPassModal'].modalOpened === false){\n                    this.$refs['refPassModal'].showModal();\n                }\n\n            },\n            copyToClipboard(){\n\n                this.clipboardText = 'Copied';\n                this.$clipboard(this.walletAddressPassword);\n\n            },\n\n            generatePasswrod(){\n\n                var wordsArray = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z'];\n                this.walletAddressPassword = wordsArray[Math.floor(Math.random()*wordsArray.length)];\n\n                for (var i=0;i<=11;i++){\n\n                    var randomWord = wordsArray[Math.floor(Math.random()*wordsArray.length)];\n                    var index = this.walletAddressPassword.lastIndexOf(randomWord);\n\n\n                    if (index==-1){\n                        this.walletAddressPassword += (\" \"+randomWord);\n                    }else{\n                        i--;\n                    }\n\n                }\n\n            },\n\n            encryptPassword(){\n\n                var okPassword=true;\n                var wordsArray = this.walletAddressPassword.split(' ');\n                var wordsArraySize = wordsArray.length-1;\n\n                if (wordsArraySize != 12){\n\n                    this.errorMessage = \"The password should contain 12 words, but you have only \"+wordsArraySize+\" words.\";\n                    okPassword=false;\n\n                }\n\n                if (okPassword==true){\n\n                    for (var i=0; i<=wordsArraySize; i++){\n\n                        var index = wordsArray.lastIndexOf(wordsArray[i]);\n\n                        if  (index != i){\n\n                            this.errorMessage = \"The password should contain different words, but you are repeating '\"+wordsArray[i]+\"' word.\";\n                            okPassword=false;\n\n                        }\n\n                    }\n\n                }\n\n                if(okPassword==true){\n\n                    this.errorMessage = '';\n                    this.setPassword();\n\n                }\n\n            },\n\n            setPassword(){\n\n                this.copyToClipboard();\n                this.closeModal();\n                alert('Your password was saved in clipboard');\n\n            }\n\n        },\n\n        mounted() {\n\n            if (typeof window === 'undefined') return;\n\n        },\n\n    }\n\n</script>\n\n<style>\n    .descriptionTextPass{\n        color: #bdbdbd;\n        padding: 30px 10px;\n    }\n\n    .inputDeleteModalPass{\n        width: 100%;\n        width: -webkit-fill-available;\n        background-color: #2d2d2d;\n        border: none;\n        margin: 0 auto;\n        left: 0;\n        right: 0;\n        color: #ccc;\n        padding: 7px 0;\n        font-weight: 100;\n        font-size: 14px;\n        padding-left: 5px;\n    }\n\n    .modalButtonPass{\n        background-color: #131313;\n        color: #969696;\n        font-size: 12px;\n        width: 140px;\n        font-weight: bolder;\n        border-radius: 5px;\n        letter-spacing: 2px;\n        text-transform: uppercase;\n        padding: 8px 20px;\n        margin: 0 auto;\n        cursor: pointer;\n        border: solid 1px #5f5d5d;\n        transition: all .3s linear;\n    }\n\n    .modalButtonPass:hover{\n        background-color: #f6ba2c;\n        color: #000000;\n        transition: all .3s linear;\n    }\n\n    .inputAndGeneratorPass{\n        width: 100%;\n        margin: 0 auto;\n        display: grid;\n        grid-template-columns: 1fr;\n        border: solid 1px #5f5d5d;\n        margin-bottom: 20px;\n    }\n\n    .generatorButtonPass{\n        margin: 0!important;\n        width: 100%!important;\n        border-radius: 0!important;\n        border: none;\n        height: 15px!important;\n        padding: 8px 0!important;\n    }\n\n    .errorMessage{\n        color: #de604d;\n        padding-bottom: 20px;\n        display: block;\n    }\n\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "Modal",
        { ref: "refPassModal", attrs: { title: "Wallet Address Secure" } },
        [
          _c("div", { attrs: { slot: "content" }, slot: "content" }, [
            _c("div", [
              _c("div", { staticClass: "inputAndGeneratorPass" }, [
                _c("div", [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.walletAddressPassword,
                        expression: "walletAddressPassword"
                      }
                    ],
                    staticClass: "inputDeleteModalPass",
                    attrs: { placeholder: "Your 12 words Password" },
                    domProps: { value: _vm.walletAddressPassword },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.walletAddressPassword = $event.target.value
                      }
                    }
                  })
                ]),
                _c("div", [
                  _c(
                    "div",
                    {
                      staticClass: "modalButtonPass generatorButtonPass",
                      on: { click: this.generatePasswrod }
                    },
                    [
                      _vm._v(
                        "\n                            Generate random password\n                        "
                      )
                    ]
                  )
                ])
              ]),
              _c("span", { staticClass: "errorMessage" }, [
                _vm._v(_vm._s(this.errorMessage))
              ]),
              _c(
                "div",
                {
                  staticClass: "modalButtonPass",
                  on: { click: this.encryptPassword }
                },
                [_vm._v("\n                    Set Password\n                ")]
              )
            ])
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3b585992", esExports)
  }
}

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Delete_modal_vue__ = __webpack_require__(22);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dc2c73dc_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Delete_modal_vue__ = __webpack_require__(88);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(86)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Delete_modal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dc2c73dc_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Delete_modal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Modals/Delete.modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dc2c73dc", Component.options)
  } else {
    hotAPI.reload("data-v-dc2c73dc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(87);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("278bc59e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dc2c73dc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Delete.modal.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dc2c73dc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Delete.modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.descriptionText{\n\n    color: #bdbdbd;\n    padding: 30px 10px;\n}\n.inputDeleteModal{\n    width: 90%;\n    background-color: #2d2d2d;\n    border: solid 1px #565656;\n    margin: 0 auto;\n    left: 0;\n    right: 0;\n    color: #ccc;\n    padding: 7px;\n    font-weight: 100;\n    text-align: center;\n    font-size: 14px;\n    margin-bottom: 20px;\n}\n.modalButton{\n    background-color: #131313;\n    color: #969696;\n    font-size: 12px;\n    width: 140px;\n    border: solid 1px #5f5d5d;\n    font-weight: bolder;\n    border-radius: 5px;\n    letter-spacing: 2px;\n    text-transform: uppercase;\n    padding: 8px;\n    margin: 0 auto;\n    margin-bottom: 20px;\n    transition: all .3s linear;\n}\n.modalButton:hover{\n    background-color: #f6ba2c;\n    color: #000000;\n    transition: all .3s linear;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Modals/src/components/Wallet/Address/Modals/Delete.modal.vue"],"names":[],"mappings":";AAuGA;;IAEA,eAAA;IACA,mBAAA;CAEA;AAEA;IACA,WAAA;IACA,0BAAA;IACA,0BAAA;IACA,eAAA;IACA,QAAA;IACA,SAAA;IACA,YAAA;IACA,aAAA;IACA,iBAAA;IACA,mBAAA;IACA,gBAAA;IACA,oBAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,gBAAA;IACA,aAAA;IACA,0BAAA;IACA,oBAAA;IACA,mBAAA;IACA,oBAAA;IACA,0BAAA;IACA,aAAA;IACA,eAAA;IACA,oBAAA;IACA,2BAAA;CACA;AAEA;IACA,0BAAA;IACA,eAAA;IACA,2BAAA;CACA","file":"Delete.modal.vue","sourcesContent":["<template>\n\n    <div>\n\n        <Modal title=\"Delete Address\" ref=\"refModal\">\n\n            <div slot=\"content\">\n\n                <div class=\"descriptionText\">\n\n                    For Delete this Address Type <b>DELETE</b> below\n\n                </div>\n\n                <div >\n\n                    <input v-model=\"inputValue\" class=\"inputDeleteModal\"/>\n\n                    <div @click=\"this.deleteAddress\" class=\"modalButton\">\n                        Delete\n                    </div>\n\n                </div>\n\n            </div>\n\n        </Modal>\n\n    </div>\n\n</template>\n\n<script>\n\n    var Vue = require('vue/dist/vue.min.js');\n    import Modal from \"components/UI/modal/Modal.vue\"\n\n    import Clipboard from './../../../../../node_modules/v-clipboard'\n\n    Vue.use(Clipboard)\n\n    export default {\n\n        props: {\n            address: {default: null},\n            toAddress: {default: null},\n            toAmount: {default: 0.0},\n\n        },\n\n        components: {\n            \"Modal\":Modal,\n        },\n\n        data: () => {\n            return {\n                inputValue: ''\n            }\n        },\n\n        methods: {\n\n            async deleteAddress(){\n\n                if (this.inputValue.toUpperCase().trim() === 'DELETE'){\n\n                    // WebDollar.Blockchain.wallet. - DELETE\n                    let answer = await WebDollar.Blockchain.Wallet.deleteAddress(this.address);\n\n                    console.log(answer);\n                }\n\n                this.closeModal();\n\n            },\n\n            closeModal(e) {\n\n                if (this.$refs['refModal'] !== undefined)\n                    this.$refs['refModal'].closeModal(e);\n            },\n\n            showModal(e) {\n\n                if (this.$refs['refModal'].modalOpened === false){\n                    console.log(\"shooow modal\");\n                    this.$refs['refModal'].showModal(e);\n                }\n\n            }\n\n        },\n\n        mounted() {\n\n            if (typeof window === 'undefined') return;\n\n        },\n\n    }\n\n</script>\n\n<style>\n    .descriptionText{\n\n        color: #bdbdbd;\n        padding: 30px 10px;\n\n    }\n\n    .inputDeleteModal{\n        width: 90%;\n        background-color: #2d2d2d;\n        border: solid 1px #565656;\n        margin: 0 auto;\n        left: 0;\n        right: 0;\n        color: #ccc;\n        padding: 7px;\n        font-weight: 100;\n        text-align: center;\n        font-size: 14px;\n        margin-bottom: 20px;\n    }\n\n    .modalButton{\n        background-color: #131313;\n        color: #969696;\n        font-size: 12px;\n        width: 140px;\n        border: solid 1px #5f5d5d;\n        font-weight: bolder;\n        border-radius: 5px;\n        letter-spacing: 2px;\n        text-transform: uppercase;\n        padding: 8px;\n        margin: 0 auto;\n        margin-bottom: 20px;\n        transition: all .3s linear;\n    }\n\n    .modalButton:hover{\n        background-color: #f6ba2c;\n        color: #000000;\n        transition: all .3s linear;\n    }\n\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("Modal", { ref: "refModal", attrs: { title: "Delete Address" } }, [
        _c("div", { attrs: { slot: "content" }, slot: "content" }, [
          _c("div", { staticClass: "descriptionText" }, [
            _vm._v("\n\n                For Delete this Address Type "),
            _c("b", [_vm._v("DELETE")]),
            _vm._v(" below\n\n            ")
          ]),
          _c("div", [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.inputValue,
                  expression: "inputValue"
                }
              ],
              staticClass: "inputDeleteModal",
              domProps: { value: _vm.inputValue },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.inputValue = $event.target.value
                }
              }
            }),
            _c(
              "div",
              { staticClass: "modalButton", on: { click: this.deleteAddress } },
              [_vm._v("\n                    Delete\n                ")]
            )
          ])
        ])
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-dc2c73dc", esExports)
  }
}

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "walletAddress hoverAddress" },
    [
      _c(
        "div",
        {
          staticClass: "addressIdentityBox",
          on: {
            click: function($event) {
              $event.stopPropagation()
              _vm.handleTransferFunds($event)
            }
          }
        },
        [
          _c("img", {
            staticClass: "walletAddressImage",
            attrs: { src: this.getAddressPic }
          }),
          _c(
            "b",
            [
              _c("ShowBalance", {
                attrs: { address: this.address, currency: "0x01" }
              }),
              _vm._v(" WEBD")
            ],
            1
          )
        ]
      ),
      _c(
        "div",
        {
          staticClass: "actionsBox hoverAddress",
          style: {
            marginBottom: this.opened
              ? this.walletButtonMarginOpened + "px"
              : this.walletButtonMarginClosed + "px"
          }
        },
        [
          _c(
            "div",
            {
              staticClass: "addressButton",
              on: {
                click: function($event) {
                  $event.stopPropagation()
                  _vm.handleExport($event)
                }
              }
            },
            [
              _c("icon", {
                staticClass: "btn",
                attrs: {
                  alt: "Secure Wallet",
                  text: "Download Address",
                  icon: "download"
                }
              })
            ],
            1
          ),
          _c(
            "div",
            {
              staticClass: "addressButton",
              on: {
                click: function($event) {
                  $event.stopPropagation()
                  _vm.handleLock($event)
                }
              }
            },
            [
              _c("icon", {
                staticClass: "btn",
                attrs: {
                  alt: "Secure Wallet",
                  text: "Lock Address",
                  icon: "lock-open"
                }
              })
            ],
            1
          ),
          _c(
            "div",
            {
              staticClass: "addressButton",
              on: {
                click: function($event) {
                  $event.stopPropagation()
                  _vm.handleDelete($event)
                }
              }
            },
            [
              _c("icon", {
                staticClass: "btn",
                attrs: {
                  alt: "Secure Wallet",
                  text: "Delete Address",
                  icon: "x"
                }
              })
            ],
            1
          )
        ]
      ),
      _c("TransactionModal", {
        ref: "refTransactionModal",
        attrs: { address: this.address }
      }),
      _c("LockModal", {
        ref: "refLockModal",
        attrs: { address: this.address }
      }),
      _c("DeleteModal", {
        ref: "refDeleteModal",
        attrs: { address: this.address }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6fd10b33", esExports)
  }
}

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_ShowSumBalances_vue__ = __webpack_require__(23);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4fface31_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ShowSumBalances_vue__ = __webpack_require__(93);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(91)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_ShowSumBalances_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4fface31_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ShowSumBalances_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Wallet/Address/Balance/ShowSumBalances.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4fface31", Component.options)
  } else {
    hotAPI.reload("data-v-4fface31", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(92);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("28708a8e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fface31\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ShowSumBalances.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4fface31\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ShowSumBalances.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.show-sum-balances{\n    display: inline;\n    color: #1f1f1f;\n}\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Wallet/Address/Balance/src/components/Wallet/Address/Balance/ShowSumBalances.vue"],"names":[],"mappings":";AAqEA;IACA,gBAAA;IACA,eAAA;CACA","file":"ShowSumBalances.vue","sourcesContent":["<template>\n\n    <span class=\"show-sum-balances\">\n        {{  Math.round(this.sum * 100000)/100000 }}\n    </span>\n\n</template>\n\n<script>\n\n    export default{\n\n        name: \"ShowSumBalances\",\n\n        props: ['addresses', 'currency'],\n\n        data(){\n            return {\n                sum: 0,\n            }\n        },\n\n        mounted(){\n\n        },\n\n        methods:{\n\n            refreshSum(addresses, currency){\n\n                let newSum = 0;\n\n                //it should use BigNumber as math...\n\n                console.log('changed to newxxxx', addresses);\n\n                if (addresses === undefined || addresses === null) return ;\n\n                for (let index in this.addresses){\n\n                    if (addresses[index].balances !== undefined && addresses[index].balances !== null && addresses[index].balances[currency] !== undefined)\n                        newSum += parseFloat( addresses[index].balances[currency]);\n                }\n\n                this.sum = newSum;\n\n            }\n\n        },\n\n        watch: {\n            addresses: function (newVal, oldVal) { // watch it\n\n                console.log('changed to new', newVal);\n                this.refreshSum(newVal, this.currency);\n\n            },\n\n            currency: function (newVal, oldVal) { // watch it\n\n                this.refreshSum(this.addresses, newVal);\n\n            }\n        }\n\n    }\n\n</script>\n\n<style>\n    .show-sum-balances{\n        display: inline;\n        color: #1f1f1f;\n    }\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("span", { staticClass: "show-sum-balances" }, [
    _vm._v("\n    " + _vm._s(Math.round(this.sum * 100000) / 100000) + "\n")
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4fface31", esExports)
  }
}

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { ref: "dashboardWallet", staticClass: "dashboardWallet" }, [
    _c(
      "div",
      {
        ref: "walletMenuButton",
        style: {
          marginBottom: this.opened
            ? this.walletButtonMarginOpened + "px"
            : this.walletButtonMarginClosed + "px",
          top: this.opened
            ? this.buttonTopDistanceOpen
            : this.buttonTopDistanceClose,
          borderTopLeftRadius: this.opened
            ? this.walletButtonRadiusLeftOpen + "px"
            : this.walletButtonRadiusLeftClose + "px",
          borderTopRightRadius: this.opened
            ? this.walletButtonRadiusRightOpen + "px"
            : this.walletButtonRadiusRightClose + "px"
        },
        attrs: { id: "walletButton" },
        on: { click: this.toggleWallet }
      },
      [
        _c(
          "span",
          { attrs: { id: "walletButtonText" } },
          [
            _c("icon", {
              staticClass: "buttonIcon",
              attrs: { icon: this.opened ? "chevron-down" : "chevron-up" }
            }),
            _vm._v("\n            Wallet\n            "),
            _c("ShowSumBalances", {
              ref: "showSumBalances",
              attrs: { addresses: this.addresses, currency: this.currency }
            })
          ],
          1
        )
      ]
    ),
    _c(
      "div",
      {
        ref: "walletMenu",
        style: {
          marginBottom: this.opened
            ? this.walletMarginOpened + "px"
            : this.walletMarginClosed + "px",
          top: this.opened
            ? this.buttonTopDistanceOpen
            : this.buttonTopDistanceClose,
          marginTop: this.opened
            ? this.walletMenuMarginTopOpen
            : this.walletMenuMarginTopClose,
          height: this.opened
            ? this.walletMenuHeightOpen
            : this.walletMenuHeightClosed
        },
        attrs: { id: "walletMenu" }
      },
      [
        _c("div", { attrs: { id: "dashboardWallet" } }, [
          _c("div", { staticClass: "walletController" }, [
            _c(
              "div",
              { staticClass: "btn", on: { click: this.handleAddNewAddress } },
              [_vm._v("\n                    Add Address\n                ")]
            ),
            _c("label", { staticClass: "myLabel" }, [
              _c("input", {
                ref: "importedAddress",
                attrs: { type: "file", multiple: "", size: "50" },
                on: { change: this.importAddress }
              }),
              _c("div", { staticClass: "btn" }, [
                _vm._v(
                  "\n                        Import Address\n                    "
                )
              ])
            ])
          ]),
          _c(
            "div",
            {
              staticClass: "walletSection walletsContainer",
              style: {
                height: this.walletContentHeight
              }
            },
            [
              _c(
                "div",
                { attrs: { id: "allWalets" } },
                _vm._l(this.addresses, function(walletAddress) {
                  return _c("Address", {
                    key: walletAddress.address,
                    staticStyle: { "padding-right": "20px" },
                    attrs: {
                      id: "address" + walletAddress.address,
                      address: walletAddress.address
                    }
                  })
                })
              )
            ]
          )
        ])
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8087f122", esExports)
  }
}

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Mining_vue__ = __webpack_require__(24);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0954b78f_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Mining_vue__ = __webpack_require__(103);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(96)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Mining_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0954b78f_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Mining_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Mining/Mining.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0954b78f", Component.options)
  } else {
    hotAPI.reload("data-v-0954b78f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(97);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("c89c56c6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0954b78f\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Mining.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0954b78f\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Mining.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n#miningLoader{\n    vertical-align: top;\n    width: 30px;\n    height: 30px;\n}\n#dashboardMining{\n    overflow: hidden;\n    position: fixed;\n    bottom: 0px;\n    height: 33px;\n    background-color: #262626;\n    display: block;\n    left: 0;\n    padding-bottom: 3px;\n    right: 0;\n    z-index: 95;\n    border-top: solid 1px #444444;\n}\n.miningPowerThreads{\n    font-size: 14px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 8px;\n    text-transform: uppercase;\n    padding-bottom: 5px;\n    color: #fff;\n    letter-spacing: 5px;\n    margin: 0;\n}\n.walletStartMining{\n    position: relative;\n    display: inline-block!important;\n    vertical-align: top;\n    left: 0;\n    right: 0;\n    font-size: 20px;\n    color: #f20;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n.walletStartMining a{\n    padding-top: 5px;\n    display: block;\n    color: #000;\n}\n.walletStartMining a:hover{\n    color: #ffc12c;\n}\n.walletStartMining:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n.minningController p{\n    font-size: 20px;\n    margin-right: -4px;\n}\n#miningDetails{\n    vertical-align: top;\n    display: inline-block;\n    line-height: 32px;\n    margin-top: 1px;\n    margin-left: 35px;\n}\n#miningDetails p{\n    margin-top: 0;\n    font-size: 12px;\n    color: #D5D5D5;\n}\n#threadsControll{\n    display: inline-block;\n    vertical-align: top;\n    width: 100%;\n    background-color: #1f1f1f;\n}\n#threadsControll .leftButton {\n    float: left;\n}\n#threadsControll .rightButton {\n    float: right;\n}\n#threadsControll .button p{\n    padding-top: 3px;\n    padding-bottom: 4px;\n    line-height: 27px;\n    margin: 0;\n}\n#allWalets{\n    /*border-top: solid 1px #7b7b7b;*/\n    display: block;\n    /*padding-top: 10px;*/\n}\n.miningPowerText{\n    font-size: 10px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 5px;\n    margin: 0;\n    color: #fff;\n}\n.miningPowerText .secondWord{\n    height: auto;\n    line-height: 10px;\n    margin: 0;\n    font-weight: bold;\n    color: #fff;\n    margin-right: -4px;\n}\n#threadsControll .button{\n    display: inline-block;\n    background-color: #1f1f1f;\n    color: #fff;\n    font-size: 26px;\n    border: solid 1px #565656;\n    width: 31px;\n    border-top: none;\n    border-bottom: none;\n    text-align: center;\n    cursor: pointer;\n    transition: all .3s linear;\n}\n#threadsControll .button:hover{\n    background-color: #000;\n    transition: all .3s linear;\n}\n#threadsControll .button:first-child{\n    margin-top: 0;\n}\n#threadsNumber{\n    font-size: 20px;\n    padding: 0 10px;\n    text-align: center;\n    padding-bottom: 8px;\n    line-height: 25px;\n    display: inline-block;\n    color: #fff;\n    background-color: #d23c25;\n    vertical-align: top;\n    padding-top: 6px;\n    border-right: solid 1px #444;\n    width: 40px;\n    padding-left: 0;\n    padding-right:0;\n}\n.whiteText{\n    color: #c5c5c5;\n    font-weight: 100;\n}\n#minningController{\n    width: 100%;\n    border-top:none;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n    vertical-align: top;\n}\n#createWalletAddress{\n    border: solid 1px #7b7b7b;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n}\n#createWalletAddress p:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n#createWalletAddress p{\n    padding: 10px;\n    padding-top: 14px;\n    background-color: #353535;\n    color: #bbb;\n    display: inline-block;\n    width: 214px;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n.WEBD{\n    display: inline-block;\n    margin-left: 20px;\n    font-size: 20px;\n    color: #fec02c;\n    vertical-align: top;\n    margin-top: 0;\n    float: right;\n    min-width: 300px;\n    text-align: center;\n    border-left: solid 1px #444444;\n    line-height: 42px;\n}\n#miningDetails p{\n    display: inline-block;\n}\n.miningBar{\n    display: inline-block;\n    width: 330px;\n    margin-left: 0;\n}\n@media only screen and (max-width : 831px) {\n.miningBar{\n        padding: 4px 0px;\n}\n.show-balance-span{\n        font-size: 20px;\n}\n#dashboardMining{\n        margin-bottom: 0;\n}\n#minningController, .walletStartMining, .WEBD{\n        display: inline-block;\n        width: 100%;\n}\n#minningController{\n        background-color: #0000;\n        margin-bottom: 0;\n        height: 33px;\n        border-top: none;\n        margin-top: 50px;\n}\n#threadsControll .button p{\n        line-height: 43px;\n}\n#threadsControll .button{\n        width: 80px;\n}\n.miningPowerThreads{\n        line-height: 38px;\n        font-size: 16px;\n        margin-right: -4px;\n}\n#miningDetails{\n        display: none;\n}\n.miningPowerText{\n        display: none;\n}\n#threadsNumber{\n        margin: 0 auto;\n        text-align: center;\n        float:left;\n        position: relative;\n        display: block;\n        line-height: 34px;\n        width: 35px;\n        padding-top: 6px;\n        padding-left: 0;\n}\n.WEBD{\n        text-align: right;\n        margin-right: 10px;\n        min-width: auto;\n        width: auto;\n        border:none;\n        line-height: 42px;\n}\n.miningPowerThreads{\n        display:none;\n}\n#threadsControll .button{\n        float:left;\n}\n.walletStartMining{\n        margin-top:-29px;\n}\n#threadsControll{\n        background-color: #f200;\n}\n#threadsControll .button p {\n        line-height: 35px;\n        font-size: 35px;\n        padding-top: 7px;\n}\n#threadsControll .button:first-child{\n        border:none;\n}\n#minningController{\n        margin-top:0\n}\n#dashboardMining{\n        height:40px;\n}\n.walletStartMining:hover{\n        background-color: #f200;\n}\n}\n@media only screen and (max-width : 600px) {\n.whiteText{\n            display: none;\n}\n}\n@media only screen and (max-width : 500px) {\n.miningBar{\n        width: 50%;\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Mining/src/components/Mining/Mining.vue"],"names":[],"mappings":";AAiJA;IACA,oBAAA;IACA,YAAA;IACA,aAAA;CACA;AAEA;IACA,iBAAA;IACA,gBAAA;IACA,YAAA;IACA,aAAA;IACA,0BAAA;IACA,eAAA;IACA,QAAA;IACA,oBAAA;IACA,SAAA;IACA,YAAA;IACA,8BAAA;CACA;AAEA;IACA,gBAAA;IACA,sBAAA;IACA,gBAAA;IACA,oBAAA;IACA,iBAAA;IACA,0BAAA;IACA,oBAAA;IACA,YAAA;IACA,oBAAA;IACA,UAAA;CACA;AAGA;IACA,mBAAA;IACA,gCAAA;IACA,oBAAA;IACA,QAAA;IACA,SAAA;IACA,gBAAA;IACA,YAAA;IACA,gBAAA;IACA,mBAAA;IACA,2BAAA;CACA;AAEA;IACA,iBAAA;IACA,eAAA;IACA,YAAA;CACA;AAEA;IACA,eAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,gBAAA;IACA,mBAAA;CACA;AAEA;IACA,oBAAA;IACA,sBAAA;IACA,kBAAA;IACA,gBAAA;IACA,kBAAA;CACA;AAEA;IACA,cAAA;IACA,gBAAA;IACA,eAAA;CACA;AAEA;IACA,sBAAA;IACA,oBAAA;IACA,YAAA;IACA,0BAAA;CACA;AAEA;IACA,YAAA;CACA;AAEA;IACA,aAAA;CACA;AAEA;IACA,iBAAA;IACA,oBAAA;IACA,kBAAA;IACA,UAAA;CACA;AAEA;IACA,kCAAA;IACA,eAAA;IACA,sBAAA;CACA;AAEA;IACA,gBAAA;IACA,sBAAA;IACA,gBAAA;IACA,oBAAA;IACA,iBAAA;IACA,UAAA;IACA,YAAA;CACA;AAGA;IACA,aAAA;IACA,kBAAA;IACA,UAAA;IACA,kBAAA;IACA,YAAA;IACA,mBAAA;CACA;AAGA;IACA,sBAAA;IACA,0BAAA;IACA,YAAA;IACA,gBAAA;IACA,0BAAA;IACA,YAAA;IACA,iBAAA;IACA,oBAAA;IACA,mBAAA;IACA,gBAAA;IACA,2BAAA;CACA;AAEA;IACA,uBAAA;IACA,2BAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,gBAAA;IACA,gBAAA;IACA,mBAAA;IACA,oBAAA;IACA,kBAAA;IACA,sBAAA;IACA,YAAA;IACA,0BAAA;IACA,oBAAA;IACA,iBAAA;IACA,6BAAA;IACA,YAAA;IACA,gBAAA;IACA,gBAAA;CACA;AAEA;IACA,eAAA;IACA,iBAAA;CACA;AAEA;IACA,YAAA;IACA,gBAAA;IACA,kBAAA;IACA,oBAAA;IACA,sBAAA;IACA,oBAAA;CACA;AAEA;IACA,0BAAA;IACA,kBAAA;IACA,oBAAA;IACA,sBAAA;CACA;AAEA;IACA,0BAAA;IACA,2BAAA;CACA;AAEA;IACA,cAAA;IACA,kBAAA;IACA,0BAAA;IACA,YAAA;IACA,sBAAA;IACA,aAAA;IACA,gBAAA;IACA,mBAAA;IACA,2BAAA;CACA;AAEA;IACA,sBAAA;IACA,kBAAA;IACA,gBAAA;IACA,eAAA;IACA,oBAAA;IACA,cAAA;IACA,aAAA;IACA,iBAAA;IACA,mBAAA;IACA,+BAAA;IACA,kBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,sBAAA;IACA,aAAA;IACA,eAAA;CACA;AAEA;AAEA;QACA,iBAAA;CACA;AAEA;QACA,gBAAA;CACA;AAEA;QACA,iBAAA;CACA;AACA;QACA,sBAAA;QACA,YAAA;CACA;AACA;QACA,wBAAA;QACA,iBAAA;QACA,aAAA;QACA,iBAAA;QACA,iBAAA;CACA;AACA;QACA,kBAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;QACA,mBAAA;CACA;AACA;QACA,cAAA;CACA;AACA;QACA,cAAA;CACA;AACA;QACA,eAAA;QACA,mBAAA;QACA,WAAA;QACA,mBAAA;QACA,eAAA;QACA,kBAAA;QACA,YAAA;QACA,iBAAA;QACA,gBAAA;CACA;AACA;QACA,kBAAA;QACA,mBAAA;QACA,gBAAA;QACA,YAAA;QACA,YAAA;QACA,kBAAA;CACA;AACA;QACA,aAAA;CACA;AACA;QACA,WAAA;CACA;AACA;QACA,iBAAA;CACA;AACA;QACA,wBAAA;CACA;AACA;QACA,kBAAA;QACA,gBAAA;QACA,iBAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,YAAA;CACA;AACA;QACA,wBAAA;CACA;CAEA;AAEA;AAEA;YACA,cAAA;CACA;CAEA;AAEA;AAEA;QACA,WAAA;CACA;CAEA","file":"Mining.vue","sourcesContent":["<template>\n    <div id=\"dashboardMining\" class=\"walletSection\" >\n\n        <div id=\"minningController\">\n            <p class=\"miningPowerText\">Mining <br/> <span class=\"secondWord\">Power</span></p>\n            <strong id=\"threadsNumber\" :style=\"{background: this.workers ? 0 : '#d23c25'}\">{{this.workers}}</strong>\n\n            <div type=\"button\" class=\"miningBar\">\n                <slider ref=\"refMiningSlider\" @sliderChanged=\"this.changeWorkers\"/>\n            </div>\n\n            <div id=\"miningDetails\">\n                <p class=\"\" :style=\"{display: this.hashesPerSecond==0 && this.started==true ? 'none' : 'inline-block'}\">{{this.started ? this.hashesPerSecond + ' hashes/sec' : 'not started'}} </p>\n                <svg :style=\"{display: this.hashesPerSecond==0 && this.started==true ? 'inline-block' : 'none'}\" version=\"1.1\" id=\"miningLoader\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                     width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n                      <path fill=\"#fec02c\" d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\n                        <animateTransform attributeType=\"xml\"\n                          attributeName=\"transform\"\n                          type=\"rotate\"\n                          from=\"0 25 25\"\n                          to=\"360 25 25\"\n                          dur=\"0.6s\"\n                          repeatCount=\"indefinite\"/>\n                        </path>\n                </svg>\n            </div>\n            <p class=\"WEBD\"> <ShowBalance :address=\"this.minerAddress\" currency=\"0x01\"/> <b class=\"whiteText\">WEBD MINED</b></p>\n        </div>\n\n    </div>\n</template>\n\n<script>\n\n    import ShowBalance from \"components/Wallet/Address/Balance/ShowBalance.vue\";\n    import slider from \"./slider.vue\";\n\n    export default{\n\n        name: 'Mining',\n\n        components: {\n            \"ShowBalance\":ShowBalance,\n            \"slider\":slider\n        },\n\n        data: function () {\n            return {\n\n                started: false,\n                hashesPerSecond: 0,\n                workers: 0,\n                minerAddress:'',\n            }\n        },\n\n        computed:{\n        },\n\n        props:{\n\n        },\n\n        mounted() {\n\n            if (typeof window === 'undefined') return;\n\n            WebDollar.Blockchain.Mining.emitter.on(\"mining/hash-rate\", (hashesPerSecond)=>{\n                this.hashesPerSecond = hashesPerSecond;\n            });\n\n            WebDollar.Blockchain.Mining.emitter.on(\"mining/status-changed\", (status)=>{\n\n                this.started = WebDollar.Blockchain.Mining.started;\n\n            });\n\n            WebDollar.Blockchain.Mining.emitter.on(\"mining/reset\", ()=>{\n\n                this.started = WebDollar.Blockchain.Mining.started;\n\n            });\n\n            WebDollar.Blockchain.Mining.emitter.on(\"mining/workers-changed\", (workers)=>{\n\n                this.workers = workers;\n                if (this.workers !== this.$refs['refMiningSlider'].data)\n                    this.$refs['refMiningSlider'].$refs['slider'].setValue(this.workers);\n\n            });\n\n            this.minerAddress = WebDollar.Blockchain.Mining.minerAddressBase;\n            WebDollar.Blockchain.Mining.emitter.on(\"mining/miner-address-changed\", (minerAddress)=>{\n                this.minerAddress = minerAddress;\n            });\n\n\n            WebDollar.Blockchain.emitter.on(\"blockchain/status-webdollar\", (data)=> {\n\n                if (data.message === \"Ready\")\n                    this.$refs['refMiningSlider'].disabled = false;\n\n            });\n\n        },\n\n        methods: {\n\n            async startStopMining() {\n\n                if (!WebDollar.Blockchain.Mining.started)\n                    WebDollar.Blockchain.Mining.startMining();\n                else\n                    WebDollar.Blockchain.Mining.stopMining();\n\n                return true;\n\n            },\n\n            destroyOneMiningWorker(number){\n\n                WebDollar.Blockchain.Mining.decreaseWorkers(number||1);\n\n            },\n\n            createOneMiningWorker(number){\n\n                WebDollar.Blockchain.Mining.increaseWorkers(number||1);\n\n            },\n\n            changeWorkers(value){\n\n                WebDollar.Blockchain.Mining.setWorkers(value);\n\n            }\n\n        }\n\n\n    }\n\n</script>\n\n<style>\n\n    #miningLoader{\n        vertical-align: top;\n        width: 30px;\n        height: 30px;\n    }\n\n    #dashboardMining{\n        overflow: hidden;\n        position: fixed;\n        bottom: 0px;\n        height: 33px;\n        background-color: #262626;\n        display: block;\n        left: 0;\n        padding-bottom: 3px;\n        right: 0;\n        z-index: 95;\n        border-top: solid 1px #444444;\n    }\n\n    .miningPowerThreads{\n        font-size: 14px;\n        display: inline-block;\n        padding: 0 10px;\n        vertical-align: top;\n        padding-top: 8px;\n        text-transform: uppercase;\n        padding-bottom: 5px;\n        color: #fff;\n        letter-spacing: 5px;\n        margin: 0;\n    }\n\n\n    .walletStartMining{\n        position: relative;\n        display: inline-block!important;\n        vertical-align: top;\n        left: 0;\n        right: 0;\n        font-size: 20px;\n        color: #f20;\n        cursor: pointer;\n        text-align: center;\n        transition: all .3s linear;\n    }\n\n    .walletStartMining a{\n        padding-top: 5px;\n        display: block;\n        color: #000;\n    }\n\n    .walletStartMining a:hover{\n        color: #ffc12c;\n    }\n\n    .walletStartMining:hover{\n        background-color: #191919;\n        transition: all .3s linear;\n    }\n\n    .minningController p{\n        font-size: 20px;\n        margin-right: -4px;\n    }\n\n    #miningDetails{\n        vertical-align: top;\n        display: inline-block;\n        line-height: 32px;\n        margin-top: 1px;\n        margin-left: 35px;\n    }\n\n    #miningDetails p{\n        margin-top: 0;\n        font-size: 12px;\n        color: #D5D5D5;\n    }\n\n    #threadsControll{\n        display: inline-block;\n        vertical-align: top;\n        width: 100%;\n        background-color: #1f1f1f;\n    }\n\n    #threadsControll .leftButton {\n        float: left;\n    }\n\n    #threadsControll .rightButton {\n        float: right;\n    }\n\n    #threadsControll .button p{\n        padding-top: 3px;\n        padding-bottom: 4px;\n        line-height: 27px;\n        margin: 0;\n    }\n\n    #allWalets{\n        /*border-top: solid 1px #7b7b7b;*/\n        display: block;\n        /*padding-top: 10px;*/\n    }\n\n    .miningPowerText{\n        font-size: 10px;\n        display: inline-block;\n        padding: 0 10px;\n        vertical-align: top;\n        padding-top: 5px;\n        margin: 0;\n        color: #fff;\n    }\n\n\n    .miningPowerText .secondWord{\n        height: auto;\n        line-height: 10px;\n        margin: 0;\n        font-weight: bold;\n        color: #fff;\n        margin-right: -4px;\n    }\n\n\n    #threadsControll .button{\n        display: inline-block;\n        background-color: #1f1f1f;\n        color: #fff;\n        font-size: 26px;\n        border: solid 1px #565656;\n        width: 31px;\n        border-top: none;\n        border-bottom: none;\n        text-align: center;\n        cursor: pointer;\n        transition: all .3s linear;\n    }\n\n    #threadsControll .button:hover{\n        background-color: #000;\n        transition: all .3s linear;\n    }\n\n    #threadsControll .button:first-child{\n        margin-top: 0;\n    }\n\n    #threadsNumber{\n        font-size: 20px;\n        padding: 0 10px;\n        text-align: center;\n        padding-bottom: 8px;\n        line-height: 25px;\n        display: inline-block;\n        color: #fff;\n        background-color: #d23c25;\n        vertical-align: top;\n        padding-top: 6px;\n        border-right: solid 1px #444;\n        width: 40px;\n        padding-left: 0;\n        padding-right:0;\n    }\n\n    .whiteText{\n        color: #c5c5c5;\n        font-weight: 100;\n    }\n\n    #minningController{\n        width: 100%;\n        border-top:none;\n        padding-bottom: 0;\n        margin-bottom: 15px;\n        display: inline-block;\n        vertical-align: top;\n    }\n\n    #createWalletAddress{\n        border: solid 1px #7b7b7b;\n        padding-bottom: 0;\n        margin-bottom: 15px;\n        display: inline-block;\n    }\n\n    #createWalletAddress p:hover{\n        background-color: #191919;\n        transition: all .3s linear;\n    }\n\n    #createWalletAddress p{\n        padding: 10px;\n        padding-top: 14px;\n        background-color: #353535;\n        color: #bbb;\n        display: inline-block;\n        width: 214px;\n        cursor: pointer;\n        text-align: center;\n        transition: all .3s linear;\n    }\n\n    .WEBD{\n        display: inline-block;\n        margin-left: 20px;\n        font-size: 20px;\n        color: #fec02c;\n        vertical-align: top;\n        margin-top: 0;\n        float: right;\n        min-width: 300px;\n        text-align: center;\n        border-left: solid 1px #444444;\n        line-height: 42px;\n    }\n\n    #miningDetails p{\n        display: inline-block;\n    }\n\n    .miningBar{\n        display: inline-block;\n        width: 330px;\n        margin-left: 0;\n    }\n\n    @media only screen and (max-width : 831px) {\n\n        .miningBar{\n            padding: 4px 0px;\n        }\n\n        .show-balance-span{\n            font-size: 20px;\n        }\n\n        #dashboardMining{\n            margin-bottom: 0;\n        }\n        #minningController, .walletStartMining, .WEBD{\n            display: inline-block;\n            width: 100%;\n        }\n        #minningController{\n            background-color: #0000;\n            margin-bottom: 0;\n            height: 33px;\n            border-top: none;\n            margin-top: 50px;\n        }\n        #threadsControll .button p{\n            line-height: 43px;\n        }\n        #threadsControll .button{\n            width: 80px;\n        }\n        .miningPowerThreads{\n            line-height: 38px;\n            font-size: 16px;\n            margin-right: -4px;\n        }\n        #miningDetails{\n            display: none;\n        }\n        .miningPowerText{\n            display: none;\n        }\n        #threadsNumber{\n            margin: 0 auto;\n            text-align: center;\n            float:left;\n            position: relative;\n            display: block;\n            line-height: 34px;\n            width: 35px;\n            padding-top: 6px;\n            padding-left: 0;\n        }\n        .WEBD{\n            text-align: right;\n            margin-right: 10px;\n            min-width: auto;\n            width: auto;\n            border:none;\n            line-height: 42px;\n        }\n        .miningPowerThreads{\n            display:none;\n        }\n        #threadsControll .button{\n            float:left;\n        }\n        .walletStartMining{\n            margin-top:-29px;\n        }\n        #threadsControll{\n            background-color: #f200;\n        }\n        #threadsControll .button p {\n            line-height: 35px;\n            font-size: 35px;\n            padding-top: 7px;\n        }\n        #threadsControll .button:first-child{\n            border:none;\n        }\n        #minningController{\n            margin-top:0\n        }\n        #dashboardMining{\n            height:40px;\n        }\n        .walletStartMining:hover{\n            background-color: #f200;\n        }\n\n    }\n\n        @media only screen and (max-width : 600px) {\n\n            .whiteText{\n                display: none;\n            }\n\n        }\n\n        @media only screen and (max-width : 500px) {\n\n        .miningBar{\n            width: 50%;\n        }\n\n    }\n\n</style>\n\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_slider_vue__ = __webpack_require__(25);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2b39a900_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_slider_vue__ = __webpack_require__(102);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(99)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_slider_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2b39a900_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_slider_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/Mining/slider.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b39a900", Component.options)
  } else {
    hotAPI.reload("data-v-2b39a900", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(100);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("539512a0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b39a900\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./slider.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b39a900\",\"scoped\":false,\"hasInlineConfig\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./slider.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.miningSlider {\n    padding-top: 15px !important;\n    padding-bottom: 15px !important;\n    padding-left: 20px !important;\n    background-color: #262626;\n}\n.vue-slider-component .vue-slider-piecewise {\n    background-color: #424242 !important;\n}\n.vue-slider-component .vue-slider-process {\n    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fec02c+29,bc0505+100 */\n    background: #fec02c !important; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n    background: linear-gradient(to right, #fec02c 29%, #bc0505 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fec02c', endColorstr='#bc0505', GradientType=1) !important; /* IE6-9 */\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/Mining/src/components/Mining/slider.vue"],"names":[],"mappings":";AAuFA;IACA,6BAAA;IACA,gCAAA;IACA,8BAAA;IACA,0BAAA;CACA;AAEA;IACA,qCAAA;CACA;AAEA;IACA,kHAAA;IACA,+BAAA,CAAA,kBAAA,CACA,cAAA,CACA,6BAAA;IACA,4EAAA,CAAA,sDAAA;IACA,8HAAA,CAAA,WAAA;CACA","file":"slider.vue","sourcesContent":["<template>\n    <div>\n        <vue-slider id=\"miningWorkersSlider\" class=\"miningSlider\" ref=\"slider\" @callback=\"this.change\" :piecewise=\"true\"\n                    :width=\"this.screenWidth < 750 ? this.sliderMobileWidth : 330\" :tooltip=\"false\" :min=\"0\" :max=\"this.logicalProcessors\"\n                    v-model=\"value\" :disabled=\"this.disabled\"></vue-slider>\n    </div>\n</template>\n\n\n<script>\n\n    import vueSlider from 'vue-slider-component';\n\n    export default {\n        name: 'slider',\n\n        components: {\n            \"vueSlider\": vueSlider\n        },\n\n        data() {\n            return {\n                value: 0,\n                disabled:true,\n                screenWidth: window.innerWidth,\n                logicalProcessors: 8,\n                sliderMobileWidth: 200,\n            }\n        },\n\n        methods: {\n            change(value) {\n\n                console.log(\"value\", value);\n\n                if (value > (this.value||1) *3){\n\n                    value = (this.value||1) *3;\n                    this.$refs['slider'].setValue(value);\n                    return;\n\n                }\n\n                this.$emit('sliderChanged', value)\n            },\n            addEvent(object, type, callback) {\n                if (object === null || typeof(object) === 'undefined') return;\n                if (object.addEventListener) {\n                    object.addEventListener(type, callback, false);\n                } else if (object.attachEvent) {\n                    object.attachEvent(\"on\" + type, callback);\n                } else {\n                    object[\"on\" + type] = callback;\n                }\n            },\n        },\n\n        mounted() {\n\n            if (typeof window === \"undefined\") return false;\n\n            this.addEvent(window, \"resize\", (event) => {\n\n                this.screenWidth = window.innerWidth;\n\n                if (window.innerWidth<550){\n                    this.sliderMobileWidth = window.innerWidth-150+'px';\n                }else{\n                    this.sliderMobileWidth = '100%';\n                }\n\n            });\n\n            this.screenWidth = window.innerWidth;\n            if (window.innerWidth<550){\n                this.sliderMobileWidth = window.innerWidth-150+'px';\n            }else{\n                this.sliderMobileWidth = '100%';\n            }\n\n            this.logicalProcessors = window.navigator.hardwareConcurrency === undefined ? 8 : 2 * window.navigator.hardwareConcurrency;\n\n        }\n    }\n</script>\n\n<style>\n\n    .miningSlider {\n        padding-top: 15px !important;\n        padding-bottom: 15px !important;\n        padding-left: 20px !important;\n        background-color: #262626;\n    }\n\n    .vue-slider-component .vue-slider-piecewise {\n        background-color: #424242 !important;\n    }\n\n    .vue-slider-component .vue-slider-process {\n        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fec02c+29,bc0505+100 */\n        background: #fec02c !important; /* Old browsers */\n        background: -moz-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* FF3.6-15 */\n        background: -webkit-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* Chrome10-25,Safari5.1-6 */\n        background: linear-gradient(to right, #fec02c 29%, #bc0505 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fec02c', endColorstr='#bc0505', GradientType=1) !important; /* IE6-9 */\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define("vue-slider-component",[],e):"object"==typeof exports?exports["vue-slider-component"]=e():t["vue-slider-component"]=e()}(this,function(){return function(t){function e(s){if(i[s])return i[s].exports;var r=i[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var i={};return e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,i){i(7);var s=i(5)(i(1),i(6),null,null);t.exports=s.exports},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"VueSliderComponent",data:function(){return{flag:!1,size:0,currentValue:0,currentSlider:0}},props:{width:{type:[Number,String],default:"auto"},height:{type:[Number,String],default:6},data:{type:Array,default:null},dotSize:{type:Number,default:16},dotWidth:{type:Number,required:!1},dotHeight:{type:Number,required:!1},min:{type:Number,default:0},max:{type:Number,default:100},interval:{type:Number,default:1},show:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1},piecewise:{type:Boolean,default:!1},tooltip:{type:[String,Boolean],default:"always"},eventType:{type:String,default:"auto"},direction:{type:String,default:"horizontal"},reverse:{type:Boolean,default:!1},lazy:{type:Boolean,default:!1},clickable:{type:Boolean,default:!0},speed:{type:Number,default:.5},realTime:{type:Boolean,default:!1},stopPropagation:{type:Boolean,default:!1},value:{type:[String,Number,Array],default:0},piecewiseLabel:{type:Boolean,default:!1},sliderStyle:[Array,Object,Function],tooltipDir:[Array,String],formatter:[String,Function],piecewiseStyle:Object,piecewiseActiveStyle:Object,processStyle:Object,bgStyle:Object,tooltipStyle:[Array,Object,Function],labelStyle:Object,labelActiveStyle:Object},computed:{dotWidthVal:function(){return"number"==typeof this.dotWidth?this.dotWidth:this.dotSize},dotHeightVal:function(){return"number"==typeof this.dotHeight?this.dotHeight:this.dotSize},flowDirection:function(){return"vue-slider-"+this.direction+(this.reverse?"-reverse":"")},tooltipDirection:function(){var t=this.tooltipDir||("vertical"===this.direction?"left":"top");return Array.isArray(t)?this.isRange?t:t[1]:this.isRange?[t,t]:t},tooltipStatus:function(){return"hover"===this.tooltip&&this.flag?"vue-slider-always":this.tooltip?"vue-slider-"+this.tooltip:""},tooltipClass:function(){return["vue-slider-tooltip-"+this.tooltipDirection,"vue-slider-tooltip"]},isDisabled:function(){return"none"===this.eventType||this.disabled},disabledClass:function(){return this.disabled?"vue-slider-disabled":""},isRange:function(){return Array.isArray(this.value)},slider:function(){return this.isRange?[this.$refs.dot0,this.$refs.dot1]:this.$refs.dot},minimum:function(){return this.data?0:this.min},val:{get:function(){return this.data?this.isRange?[this.data[this.currentValue[0]],this.data[this.currentValue[1]]]:this.data[this.currentValue]:this.currentValue},set:function(t){if(this.data)if(this.isRange){var e=this.data.indexOf(t[0]),i=this.data.indexOf(t[1]);e>-1&&i>-1&&(this.currentValue=[e,i])}else{var s=this.data.indexOf(t);s>-1&&(this.currentValue=s)}else this.currentValue=t}},currentIndex:function(){return this.isRange?this.data?this.currentValue:[(this.currentValue[0]-this.minimum)/this.spacing,(this.currentValue[1]-this.minimum)/this.spacing]:(this.currentValue-this.minimum)/this.spacing},indexRange:function(){return this.isRange?this.currentIndex:[0,this.currentIndex]},maximum:function(){return this.data?this.data.length-1:this.max},multiple:function(){var t=(""+this.interval).split(".")[1];return t?Math.pow(10,t.length):1},spacing:function(){return this.data?1:this.interval},total:function(){return this.data?this.data.length-1:(~~((this.maximum-this.minimum)*this.multiple)%(this.interval*this.multiple)!=0&&console.error("[Vue-slider warn]: Prop[interval] is illegal, Please make sure that the interval can be divisible"),(this.maximum-this.minimum)/this.interval)},gap:function(){return this.size/this.total},position:function(){return this.isRange?[(this.currentValue[0]-this.minimum)/this.spacing*this.gap,(this.currentValue[1]-this.minimum)/this.spacing*this.gap]:(this.currentValue-this.minimum)/this.spacing*this.gap},limit:function(){return this.isRange?[[0,this.position[1]],[this.position[0],this.size]]:[0,this.size]},valueLimit:function(){return this.isRange?[[this.minimum,this.currentValue[1]],[this.currentValue[0],this.maximum]]:[this.minimum,this.maximum]},wrapStyles:function(){return"vertical"===this.direction?{height:"number"==typeof this.height?this.height+"px":this.height,padding:this.dotHeightVal/2+"px "+this.dotWidthVal/2+"px"}:{width:"number"==typeof this.width?this.width+"px":this.width,padding:this.dotHeightVal/2+"px "+this.dotWidthVal/2+"px"}},sliderStyles:function(){return Array.isArray(this.sliderStyle)?this.isRange?this.sliderStyle:this.sliderStyle[1]:"function"==typeof this.sliderStyle?this.sliderStyle(this.val,this.currentIndex):this.isRange?[this.sliderStyle,this.sliderStyle]:this.sliderStyle},tooltipStyles:function(){return Array.isArray(this.tooltipStyle)?this.isRange?this.tooltipStyle:this.tooltipStyle[1]:"function"==typeof this.tooltipStyle?this.tooltipStyle(this.val,this.currentIndex):this.isRange?[this.tooltipStyle,this.tooltipStyle]:this.tooltipStyle},elemStyles:function(){return"vertical"===this.direction?{width:this.width+"px",height:"100%"}:{height:this.height+"px"}},dotStyles:function(){return"vertical"===this.direction?{width:this.dotWidthVal+"px",height:this.dotHeightVal+"px",left:-(this.dotWidthVal-this.width)/2+"px"}:{width:this.dotWidthVal+"px",height:this.dotHeightVal+"px",top:-(this.dotHeightVal-this.height)/2+"px"}},piecewiseDotStyle:function(){return"vertical"===this.direction?{width:this.width+"px",height:this.width+"px"}:{width:this.height+"px",height:this.height+"px"}},piecewiseDotWrap:function(){if(!this.piecewise&&!this.piecewiseLabel)return!1;for(var t=[],e=0;e<=this.total;e++){var i="vertical"===this.direction?{bottom:this.gap*e-this.width/2+"px",left:0}:{left:this.gap*e-this.height/2+"px",top:0},s=this.reverse?this.total-e:e,r=this.data?this.data[s]:this.spacing*s+this.min;t.push({style:i,label:this.formatter?this.formatting(r):r,inRange:s>=this.indexRange[0]&&s<=this.indexRange[1]})}return t}},watch:{value:function(t){this.flag||this.setValue(t,!0)},max:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},min:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},show:function(t){var e=this;t&&!this.size&&this.$nextTick(function(){e.refresh()})}},methods:{bindEvents:function(){document.addEventListener("touchmove",this.moving,{passive:!1}),document.addEventListener("touchend",this.moveEnd,{passive:!1}),document.addEventListener("mousemove",this.moving),document.addEventListener("mouseup",this.moveEnd),document.addEventListener("mouseleave",this.moveEnd),window.addEventListener("resize",this.refresh)},unbindEvents:function(){window.removeEventListener("resize",this.refresh),document.removeEventListener("touchmove",this.moving),document.removeEventListener("touchend",this.moveEnd),document.removeEventListener("mousemove",this.moving),document.removeEventListener("mouseup",this.moveEnd),document.removeEventListener("mouseleave",this.moveEnd)},formatting:function(t){return"string"==typeof this.formatter?this.formatter.replace(/\{value\}/,t):this.formatter(t)},getPos:function(t){return this.realTime&&this.getStaticData(),"vertical"===this.direction?this.reverse?t.pageY-this.offset:this.size-(t.pageY-this.offset):this.reverse?this.size-(t.clientX-this.offset):t.clientX-this.offset},wrapClick:function(t){if(this.isDisabled||!this.clickable)return!1;var e=this.getPos(t);this.isRange&&(this.currentSlider=e>(this.position[1]-this.position[0])/2+this.position[0]?1:0),this.setValueOnPos(e)},moveStart:function(t,e){if(this.stopPropagation&&t.stopPropagation(),this.isDisabled)return!1;this.isRange&&(this.currentSlider=e),this.flag=!0,this.$emit("drag-start",this)},moving:function(t){if(this.stopPropagation&&t.stopPropagation(),!this.flag)return!1;t.preventDefault(),t.targetTouches&&t.targetTouches[0]&&(t=t.targetTouches[0]),this.setValueOnPos(this.getPos(t),!0)},moveEnd:function(t){if(this.stopPropagation&&t.stopPropagation(),!this.flag)return!1;this.$emit("drag-end",this),this.lazy&&this.isDiff(this.val,this.value)&&this.syncValue(),this.flag=!1,this.setPosition()},setValueOnPos:function(t,e){var i=this.isRange?this.limit[this.currentSlider]:this.limit,s=this.isRange?this.valueLimit[this.currentSlider]:this.valueLimit;if(t>=i[0]&&t<=i[1]){this.setTransform(t);var r=(Math.round(t/this.gap)*(this.spacing*this.multiple)+this.minimum*this.multiple)/this.multiple;this.setCurrentValue(r,e)}else t<i[0]?(this.setTransform(i[0]),this.setCurrentValue(s[0]),1===this.currentSlider&&(this.currentSlider=0)):(this.setTransform(i[1]),this.setCurrentValue(s[1]),0===this.currentSlider&&(this.currentSlider=1))},isDiff:function(t,e){return Object.prototype.toString.call(t)!==Object.prototype.toString.call(e)||(Array.isArray(t)&&t.length===e.length?t.some(function(t,i){return t!==e[i]}):t!==e)},setCurrentValue:function(t,e){if(t<this.minimum||t>this.maximum)return!1;this.isRange?this.isDiff(this.currentValue[this.currentSlider],t)&&(this.currentValue.splice(this.currentSlider,1,t),this.lazy&&this.flag||this.syncValue()):this.isDiff(this.currentValue,t)&&(this.currentValue=t,this.lazy&&this.flag||this.syncValue()),e||this.setPosition()},setIndex:function(t){if(Array.isArray(t)&&this.isRange){var e=void 0;e=this.data?[this.data[t[0]],this.data[t[1]]]:[this.spacing*t[0]+this.minimum,this.spacing*t[1]+this.minimum],this.setValue(e)}else t=this.spacing*t+this.minimum,this.isRange&&(this.currentSlider=t>(this.currentValue[1]-this.currentValue[0])/2+this.currentValue[0]?1:0),this.setCurrentValue(t)},setValue:function(t,e,i){var s=this;if(this.isDiff(this.val,t)){var r=this.limitValue(t);this.val=!1!==r?this.isRange?r.concat():r:this.isRange?t.concat():t,this.syncValue(e)}this.$nextTick(function(){return s.setPosition(i)})},setPosition:function(t){this.flag||this.setTransitionTime(void 0===t?this.speed:t),this.isRange?(this.currentSlider=0,this.setTransform(this.position[this.currentSlider]),this.currentSlider=1,this.setTransform(this.position[this.currentSlider])):this.setTransform(this.position),this.flag||this.setTransitionTime(0)},setTransform:function(t){var e=("vertical"===this.direction?this.dotHeightVal/2-t:t-this.dotWidthVal/2)*(this.reverse?-1:1),i="vertical"===this.direction?"translateY("+e+"px)":"translateX("+e+"px)",s=(0===this.currentSlider?this.position[1]-t:t-this.position[0])+"px",r=(0===this.currentSlider?t:this.position[0])+"px";this.isRange?(this.slider[this.currentSlider].style.transform=i,this.slider[this.currentSlider].style.WebkitTransform=i,this.slider[this.currentSlider].style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=s,this.$refs.process.style[this.reverse?"top":"bottom"]=r):(this.$refs.process.style.width=s,this.$refs.process.style[this.reverse?"right":"left"]=r)):(this.slider.style.transform=i,this.slider.style.WebkitTransform=i,this.slider.style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=t+"px",this.$refs.process.style[this.reverse?"top":"bottom"]=0):(this.$refs.process.style.width=t+"px",this.$refs.process.style[this.reverse?"right":"left"]=0))},setTransitionTime:function(t){if(t||this.$refs.process.offsetWidth,this.isRange){for(var e=0;e<this.slider.length;e++)this.slider[e].style.transitionDuration=t+"s",this.slider[e].style.WebkitTransitionDuration=t+"s";this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"}else this.slider.style.transitionDuration=t+"s",this.slider.style.WebkitTransitionDuration=t+"s",this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"},limitValue:function(t){var e=this;if(this.data)return t;var i=!1;return this.isRange?t=t.map(function(t){return t<e.min?(i=!0,e.min):t>e.max?(i=!0,e.max):t}):t>this.max?(i=!0,t=this.max):t<this.min&&(i=!0,t=this.min),i&&t},syncValue:function(t){t||this.$emit("callback",this.val),this.$emit("input",this.isRange?this.val.concat():this.val)},getValue:function(){return this.val},getIndex:function(){return this.currentIndex},getStaticData:function(){this.$refs.elem&&(this.size="vertical"===this.direction?this.$refs.elem.offsetHeight:this.$refs.elem.offsetWidth,this.offset="vertical"===this.direction?this.$refs.elem.getBoundingClientRect().top+window.pageYOffset||document.documentElement.scrollTop:this.$refs.elem.getBoundingClientRect().left)},refresh:function(){this.$refs.elem&&(this.getStaticData(),this.setPosition())}},mounted:function(){var t=this;"undefined"!=typeof window&&"undefined"!=typeof document&&this.$nextTick(function(){t.getStaticData(),t.setValue(t.value,!0,0),t.bindEvents()})},beforeDestroy:function(){this.unbindEvents()}}},function(t,e,i){"use strict";var s=i(0);t.exports=s},function(t,e,i){e=t.exports=i(4)(),e.push([t.i,'.vue-slider-component{position:relative;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.vue-slider-component.vue-slider-disabled{opacity:.5;cursor:not-allowed}.vue-slider-component.vue-slider-has-label{margin-bottom:15px}.vue-slider-component.vue-slider-disabled .vue-slider-dot{cursor:not-allowed}.vue-slider-component .vue-slider{position:relative;display:block;border-radius:15px;background-color:#ccc}.vue-slider-component .vue-slider:after{content:"";position:absolute;left:0;top:0;width:100%;height:100%;z-index:2}.vue-slider-component .vue-slider-process{position:absolute;border-radius:15px;background-color:#3498db;transition:all 0s;z-index:1}.vue-slider-component.vue-slider-horizontal .vue-slider-process{width:0;height:100%;top:0;left:0;will-change:width}.vue-slider-component.vue-slider-vertical .vue-slider-process{width:100%;height:0;bottom:0;left:0;will-change:height}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-process{width:0;height:100%;top:0;right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-process{width:100%;height:0;top:0;left:0}.vue-slider-component .vue-slider-dot{position:absolute;border-radius:50%;background-color:#fff;box-shadow:.5px .5px 2px 1px rgba(0,0,0,.32);transition:all 0s;will-change:transform;cursor:pointer;z-index:3}.vue-slider-component.vue-slider-horizontal .vue-slider-dot{left:0}.vue-slider-component.vue-slider-vertical .vue-slider-dot{bottom:0}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-dot{right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-dot{top:0}.vue-slider-component .vue-slider-tooltip-wrap{display:none;position:absolute;z-index:9}.vue-slider-component .vue-slider-tooltip{display:block;font-size:14px;white-space:nowrap;padding:2px 5px;min-width:20px;text-align:center;color:#fff;border-radius:5px;border:1px solid #3498db;background-color:#3498db}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top{top:-9px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom{bottom:-9px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left{top:50%;left:-9px;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right{top:50%;right:-9px;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top .vue-slider-tooltip:before{content:"";position:absolute;bottom:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-top-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip:before{content:"";position:absolute;top:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-bottom-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left .vue-slider-tooltip:before{content:"";position:absolute;top:50%;right:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-left-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right .vue-slider-tooltip:before{content:"";position:absolute;top:50%;left:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-right-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-dot.vue-slider-hover:hover .vue-slider-tooltip-wrap{display:block}.vue-slider-component .vue-slider-dot.vue-slider-always .vue-slider-tooltip-wrap{display:block!important}.vue-slider-component .vue-slider-piecewise{position:absolute;width:100%;padding:0;margin:0;left:0;top:0;height:100%;list-style:none}.vue-slider-component .vue-slider-piecewise-item{position:absolute;width:8px;height:8px}.vue-slider-component .vue-slider-piecewise-dot{position:absolute;left:50%;top:50%;width:100%;height:100%;display:inline-block;background-color:rgba(0,0,0,.16);border-radius:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:2;transition:all .3s}.vue-slider-component .vue-slider-piecewise-item:first-child .vue-slider-piecewise-dot,.vue-slider-component .vue-slider-piecewise-item:last-child .vue-slider-piecewise-dot{visibility:hidden}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-horizontal .vue-slider-piecewise-label{position:absolute;display:inline-block;top:100%;left:50%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(-50%,8px);transform:translate(-50%,8px);visibility:visible}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-vertical .vue-slider-piecewise-label{position:absolute;display:inline-block;top:50%;left:100%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(8px,-50%);transform:translate(8px,-50%);visibility:visible}.vue-slider-component .vue-slider-sr-only{clip:rect(1px,1px,1px,1px);height:1px;width:1px;overflow:hidden;position:absolute!important}',""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var i=this[e];i[2]?t.push("@media "+i[2]+"{"+i[1]+"}"):t.push(i[1])}return t.join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var s={},r=0;r<this.length;r++){var n=this[r][0];"number"==typeof n&&(s[n]=!0)}for(r=0;r<e.length;r++){var o=e[r];"number"==typeof o[0]&&s[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(t,e){t.exports=function(t,e,i,s){var r,n=t=t||{},o=typeof t.default;"object"!==o&&"function"!==o||(r=t,n=t.default);var l="function"==typeof n?n.options:n;if(e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns),i&&(l._scopeId=i),s){var a=Object.create(l.computed||null);Object.keys(s).forEach(function(t){var e=s[t];a[t]=function(){return e}}),l.computed=a}return{esModule:r,exports:n,options:l}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],ref:"wrap",class:["vue-slider-component",t.flowDirection,t.disabledClass,{"vue-slider-has-label":t.piecewiseLabel}],style:t.wrapStyles,on:{click:t.wrapClick}},[i("div",{ref:"elem",staticClass:"vue-slider",style:[t.elemStyles,t.bgStyle],attrs:{"aria-hidden":"true"}},[t.isRange?[i("div",{ref:"dot0",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[0]],on:{mousedown:function(e){t.moveStart(e,0)},touchstart:function(e){t.moveStart(e,0)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[0],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[0]},[t._v(t._s(t.formatter?t.formatting(t.val[0]):t.val[0]))])],{value:t.val[0],index:0})],2)]),t._v(" "),i("div",{ref:"dot1",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[1]],on:{mousedown:function(e){t.moveStart(e,1)},touchstart:function(e){t.moveStart(e,1)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[1],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[1]},[t._v(t._s(t.formatter?t.formatting(t.val[1]):t.val[1]))])],{value:t.val[1],index:1})],2)])]:[i("div",{ref:"dot",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles],on:{mousedown:t.moveStart,touchstart:t.moveStart}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection,"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles},[t._v(t._s(t.formatter?t.formatting(t.val):t.val))])],{value:t.val})],2)])],t._v(" "),i("ul",{staticClass:"vue-slider-piecewise"},t._l(t.piecewiseDotWrap,function(e,s){return i("li",{key:s,staticClass:"vue-slider-piecewise-item",style:[t.piecewiseDotStyle,e.style]},[t._t("piecewise",[t.piecewise?i("span",{staticClass:"vue-slider-piecewise-dot",style:[t.piecewiseStyle,e.inRange?t.piecewiseActiveStyle:null]}):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1,active:e.inRange}),t._v(" "),t._t("label",[t.piecewiseLabel?i("span",{staticClass:"vue-slider-piecewise-label",style:[t.labelStyle,e.inRange?t.labelActiveStyle:null]},[t._v("\n            "+t._s(e.label)+"\n          ")]):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1,active:e.inRange})],2)})),t._v(" "),i("div",{ref:"process",staticClass:"vue-slider-process",style:t.processStyle})],2),t._v(" "),t.isRange||t.data?t._e():i("input",{directives:[{name:"model",rawName:"v-model",value:t.val,expression:"val"}],staticClass:"vue-slider-sr-only",attrs:{type:"range",min:t.min,max:t.max},domProps:{value:t.val},on:{__r:function(e){t.val=e.target.value}}})])},staticRenderFns:[]}},function(t,e,i){var s=i(3);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);i(8)("743d98f5",s,!0)},function(t,e,i){function s(t){for(var e=0;e<t.length;e++){var i=t[e],s=h[i.id];if(s){s.refs++;for(var r=0;r<s.parts.length;r++)s.parts[r](i.parts[r]);for(;r<i.parts.length;r++)s.parts.push(n(i.parts[r]));s.parts.length>i.parts.length&&(s.parts.length=i.parts.length)}else{for(var o=[],r=0;r<i.parts.length;r++)o.push(n(i.parts[r]));h[i.id]={id:i.id,refs:1,parts:o}}}}function r(){var t=document.createElement("style");return t.type="text/css",d.appendChild(t),t}function n(t){var e,i,s=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(s){if(f)return v;s.parentNode.removeChild(s)}if(m){var n=c++;s=p||(p=r()),e=o.bind(null,s,n,!1),i=o.bind(null,s,n,!0)}else s=r(),e=l.bind(null,s),i=function(){s.parentNode.removeChild(s)};return e(t),function(s){if(s){if(s.css===t.css&&s.media===t.media&&s.sourceMap===t.sourceMap)return;e(t=s)}else i()}}function o(t,e,i,s){var r=i?"":s.css;if(t.styleSheet)t.styleSheet.cssText=g(e,r);else{var n=document.createTextNode(r),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(n,o[e]):t.appendChild(n)}}function l(t,e){var i=e.css,s=e.media,r=e.sourceMap;if(s&&t.setAttribute("media",s),r&&(i+="\n/*# sourceURL="+r.sources[0]+" */",i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}var a="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!a)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var u=i(9),h={},d=a&&(document.head||document.getElementsByTagName("head")[0]),p=null,c=0,f=!1,v=function(){},m="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());t.exports=function(t,e,i){f=i;var r=u(t,e);return s(r),function(e){for(var i=[],n=0;n<r.length;n++){var o=r[n],l=h[o.id];l.refs--,i.push(l)}e?(r=u(t,e),s(r)):r=[];for(var n=0;n<i.length;n++){var l=i[n];if(0===l.refs){for(var a=0;a<l.parts.length;a++)l.parts[a]();delete h[l.id]}}}};var g=function(){var t=[];return function(e,i){return t[e]=i,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t,e){for(var i=[],s={},r=0;r<e.length;r++){var n=e[r],o=n[0],l=n[1],a=n[2],u=n[3],h={id:t+":"+r,css:l,media:a,sourceMap:u};s[o]?s[o].parts.push(h):i.push(s[o]={id:o,parts:[h]})}return i}}])});

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("vue-slider", {
        ref: "slider",
        staticClass: "miningSlider",
        attrs: {
          id: "miningWorkersSlider",
          piecewise: true,
          width: this.screenWidth < 750 ? this.sliderMobileWidth : 330,
          tooltip: false,
          min: 0,
          max: this.logicalProcessors,
          disabled: this.disabled
        },
        on: { callback: this.change },
        model: {
          value: _vm.value,
          callback: function($$v) {
            _vm.value = $$v
          },
          expression: "value"
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2b39a900", esExports)
  }
}

/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "walletSection", attrs: { id: "dashboardMining" } },
    [
      _c("div", { attrs: { id: "minningController" } }, [
        _vm._m(0),
        _c(
          "strong",
          {
            style: { background: this.workers ? 0 : "#d23c25" },
            attrs: { id: "threadsNumber" }
          },
          [_vm._v(_vm._s(this.workers))]
        ),
        _c(
          "div",
          { staticClass: "miningBar", attrs: { type: "button" } },
          [
            _c("slider", {
              ref: "refMiningSlider",
              on: { sliderChanged: this.changeWorkers }
            })
          ],
          1
        ),
        _c("div", { attrs: { id: "miningDetails" } }, [
          _c(
            "p",
            {
              style: {
                display:
                  this.hashesPerSecond == 0 && this.started == true
                    ? "none"
                    : "inline-block"
              }
            },
            [
              _vm._v(
                _vm._s(
                  this.started
                    ? this.hashesPerSecond + " hashes/sec"
                    : "not started"
                ) + " "
              )
            ]
          ),
          _c(
            "svg",
            {
              staticStyle: { "enable-background": "new 0 0 50 50" },
              style: {
                display:
                  this.hashesPerSecond == 0 && this.started == true
                    ? "inline-block"
                    : "none"
              },
              attrs: {
                version: "1.1",
                id: "miningLoader",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                x: "0px",
                y: "0px",
                width: "40px",
                height: "40px",
                viewBox: "0 0 50 50",
                "xml:space": "preserve"
              }
            },
            [
              _c(
                "path",
                {
                  attrs: {
                    fill: "#fec02c",
                    d:
                      "M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                  }
                },
                [
                  _c("animateTransform", {
                    attrs: {
                      attributeType: "xml",
                      attributeName: "transform",
                      type: "rotate",
                      from: "0 25 25",
                      to: "360 25 25",
                      dur: "0.6s",
                      repeatCount: "indefinite"
                    }
                  })
                ],
                1
              )
            ]
          )
        ]),
        _c(
          "p",
          { staticClass: "WEBD" },
          [
            _c("ShowBalance", {
              attrs: { address: this.minerAddress, currency: "0x01" }
            }),
            _c("b", { staticClass: "whiteText" }, [_vm._v("WEBD MINED")])
          ],
          1
        )
      ])
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "miningPowerText" }, [
      _vm._v("Mining "),
      _c("br"),
      _c("span", { staticClass: "secondWord" }, [_vm._v("Power")])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0954b78f", esExports)
  }
}

/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "webDollar" } },
    [_c("Mining"), _c("Wallet")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-aae30ed8", esExports)
  }
}

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_maps_Native_Map_Network_Native_Map_vue__ = __webpack_require__(106);

var Vue = __webpack_require__(3);



//for safari workaround
document.addEventListener("DOMContentLoaded", function (event) {

    if (document.getElementById('WebDollarMap') === null)
        return;

    new Vue({
        el: '#WebDollarMap',
        render: h => h(__WEBPACK_IMPORTED_MODULE_0_components_maps_Native_Map_Network_Native_Map_vue__["a" /* default */])
    })
});

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_vue__ = __webpack_require__(26);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6f992934_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_vue__ = __webpack_require__(123);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6f992934_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/maps/Native-Map/Network-Native-Map.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6f992934", Component.options)
  } else {
    hotAPI.reload("data-v-6f992934", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Projection__ = __webpack_require__(108);


class CircleMap {

    constructor(svgElement) {

        this._svg = svgElement;
        // temporarily unhide all the circlesto get the bounding rects

        svgElement.classList.remove('hide-circles');

        let mapDimensions = this.getDimensions(); // also enforces a style update
        this._circleDiameter = 0;
        let circles = svgElement.querySelectorAll('circle');

        for (let i = 0; i < circles.length; ++i) {
            circles[i].cellId = i;
            let boundingBox = circles[i].getBoundingClientRect();
            // values relative to map width / height such that they work also when we resize the map
            circles[i].centerX = (boundingBox.left + boundingBox.width/2 - mapDimensions.left) / mapDimensions.width;
            circles[i].centerY = (boundingBox.top + boundingBox.height/2 - mapDimensions.top) / mapDimensions.height;
            // the circles differ very slightly in size, so we take the biggest
            this._circleDiameter = Math.max(this._circleDiameter, boundingBox.width / mapDimensions.width);
        }
        this._cells = circles;
        this._links = [];
        // after we got the circle bounding rects, we can hide them again
        svgElement.classList.add('hide-circles');
    }

    getDimensions() {
        return this._svg.getBoundingClientRect();
    }

    unhighlightCell(cell, index) {
        cell.setAttribute('class', '');
        delete cell.data[index]
        if (cell.data === {})
            cell.data = null;
    }

    putCellOnTop(cell){
        // put my own cell on top of everything else. In svg the stacking is not affected by z-index, but
        // only by document order. So we make the cell the last child
        cell.parentElement.appendChild(cell);
    }

    highlightCell(cell, className, data, index) {

        if (cell.getAttribute('class') === 'peer-own') return;

        cell.setAttribute('class', className);

        // deleted

        // if (className === 'peer-own')
        //     cell.parentElement.appendChild(cell);


        // XXX another hack
        if (data) {
            if (cell.data === undefined) cell.data = {};
            cell.data[index] = data;
        }
    }

    _convertCoordinates(latitude, longitude) {
        let mapDimensions = this.getDimensions();
        // the map that we have is cropped out from the full robinson projected map. We have to make
        // the computation on the full/original map, so we calculate the full size.
        let fullMapWidth = 1.0946808510638297 * mapDimensions.width;
        let fullMapHeight = fullMapWidth / 1.97165551906973; // RobinsonProjection maps have a fixed aspect ratio
        let projection = new __WEBPACK_IMPORTED_MODULE_0__Projection__["a" /* default */](fullMapWidth, fullMapHeight);
        let point = projection.project(latitude, longitude);
        // the origin is centered in the middle of the map, so we translate it
        // to the top left corner
        point.x = fullMapWidth/2 + point.x;
        point.y = fullMapHeight/2 - point.y;
        // the map that we have is robinson projected and then cropped out and scaled
        point.x = Math.max(0, point.x - 0.07045675413022352*fullMapWidth);
        point.y = Math.max(0, point.y - 0.012380952380952381*fullMapHeight);
        return point;
    }

    _testCoordinateConversion(latitude, longitude) {
        let testDot = window.testDot;
        if (!testDot) {
            testDot = document.createElement('div');
            testDot.style.background = 'red';
            testDot.style.width = '5px';
            testDot.style.height = '5px';
            testDot.style.position = 'absolute';
            document.body.appendChild(testDot);
            window.testDot = testDot;
        }
        let convertedCoordinates = this._convertCoordinates(latitude, longitude);
        console.log(convertedCoordinates);
        testDot.style.left = convertedCoordinates.x-2+'px';
        testDot.style.top = convertedCoordinates.y-2+'px';
    }

    _getClosestCell(x, y) {
        let mapDimensions = this.getDimensions();
        let bestDistance = 0;
        let bestCell = null;


        for (let i = 0; i < this._cells.length; ++i) {
            // Calculate position from bounding box.
            let cell = this._cells[i];
            let centerX = cell.centerX * mapDimensions.width;
            let centerY = cell.centerY * mapDimensions.height;
            let xDist = centerX - x;
            let yDist = centerY - y;
            let distance = xDist*xDist + yDist*yDist;

            // Update best cell accordingly.
            if (!bestCell || distance < bestDistance) {
                bestDistance = distance;
                bestCell = cell;
            }
        }


        // Return best cell only if its distance in terms of cells is not too far.
        let circleDiameter = this._circleDiameter * mapDimensions.width;
        return bestDistance > CircleMap.MAX_CELL_DISTANCE * circleDiameter ? null : bestCell;
    }

    getCellByLocation(latitude, longitude) {
        let convertedCoordinates = this._convertCoordinates(latitude, longitude);
        let closestCell = this._getClosestCell(convertedCoordinates.x, convertedCoordinates.y);
        return closestCell;
    }

    addLink(startCell, endCell) {

        if (!startCell || !endCell)
            return;

        // search whether we already drew that link
        for (let i=0, link; link = this._links[i]; ++i)
            if (link.start === startCell && link.end === endCell || link.end === startCell && link.start === endCell)
                return;

        // draw the link
        let svgBoundingRect = this.getDimensions();
        let viewBox = this._svg.viewBox;
        let viewBoxWidth = viewBox.baseVal.width;
        let viewBoxHeight = viewBox.baseVal.height;
        let pathEl = document.createElementNS(this._svg.namespaceURI, 'path');

        let path = 'M'+(startCell.centerX*viewBoxWidth)+' '+(startCell.centerY*viewBoxHeight) +'L'+(endCell.centerX*viewBoxWidth)+' '+(endCell.centerY*viewBoxHeight);

        pathEl.setAttributeNS(null,'d', path);
        pathEl.classList.add('link');

        this._links.push({
            start: startCell,
            end: endCell,
            path: pathEl
        });

        // insert the path before the startCell such that it will not be drawn over the startCell
        startCell.parentElement.append(pathEl);
        //startCell.parentElement.insertBefore(pathEl, startCell);
    }

    removeLink(startCell, endCell) {

        for (let i=0, link; link = this._links[i]; ++i)
            if (link.start === startCell && link.end === endCell || link.end === startCell && link.start === endCell) {
                // we found the link
                startCell.parentElement.removeChild(link.path);
                this._links.splice(i, 1);
                return;
            }

    }
}

CircleMap.MAX_CELL_DISTANCE = 12; // in terms of cells


/* harmony default export */ __webpack_exports__["a"] = (CircleMap);

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * It's a Robison Projection
 *
 * https://en.wikipedia.org/wiki/Robinson_projection
 */


class Projection {

    constructor(width) {

        this.X = [594090, 593258.274, 591357.186, 588149.1, 583515.198, 578049.5700000001, 570326.4, 560048.643, 547513.3439999999, 532423.4580000001, 515610.71099999995, 496065.14999999997, 474440.274, 451330.173, 426913.07399999996, 399941.388, 369108.11699999997, 339938.298, 316174.698]

        this.Y = [0, 58689.82, 117379.64, 176069.46000000002, 234759.28, 293449.10000000003, 352138.92000000004, 410828.74000000005, 470275.848, 527356.431, 584626.336, 640760.3089999999, 695379.706, 748105.883, 798465.5349999999, 845890.696, 889245.434, 923986.021, 946610]

        this.EPS = 1e-8;
        this.INTERVAL = 5;

        this.radians = Math.PI / 180;
        this.degrees = 180 / Math.PI;

        this._width = width;
        this._r = this._width / 5.332539516;
    }

    _project(lat, lng)
    {
        // 5 degree intervals, so find right indices
        let lI = Math.floor((Math.abs(lat)-this.EPS)/this.INTERVAL);
        lI = Math.max(lI, 0);
        let hI = lI + 1;
        let ratio = (Math.abs(lat)-lI*this.INTERVAL) / this.INTERVAL;

        // interpolate x and y
        let xDist = this.X[hI]/700000-this.X[lI]/700000;
        let yDist = this.Y[hI]/700000-this.Y[lI]/700000;

        let x = ((xDist*ratio)+this.X[lI]/700000) * (Math.abs(lng) * this.radians);
        x = lng < 0 ? -x : x;
        let y = (yDist*ratio)+this.Y[lI]/700000;
        y = lat < 0 ? -y : y;

        return {
            x : x,
            y : y
        };
    }

    project(lat, lng) {
        let p = this._project(lat, lng);
        return {
            x: p.x * this._r,
            y: p.y * this._r
        };
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Projection);

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Circles {

    constructor() {
        this.cells = {};
    }

    inc(cell) {
        if (!this.cells[cell.cellId])
            this.cells[cell.cellId] = 0;

        this.cells[cell.cellId]++;
    }

    del(cell) {

        if (!this.cells[cell.cellId]) this.cells[cell.cellId] = 0;

        if (this.cells[cell.cellId] > 0) return --this.cells[cell.cellId];

        return 0;
    }

    get(cell) {
        return this.cells[cell.cellId] || 0;
    }
    
}

/* harmony default export */ __webpack_exports__["a"] = (Circles);

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MapsTester{

    constructor(parent){

        this.parent = parent;
    }

    testConnections(){

        this._createFakeMarker({country: 'USA', lat: 37.980388, lng:-92.539714 }, 2000);
        this._createFakeMarker({country: 'USA', lat: 36.828015, lng:-119.458796 }, 3100);
        this._createFakeMarker({country: 'Brazil', lat: -10.252334, lng:-55.143146}, 4200);
        this._createFakeMarker({country: 'Germany', lat: 51.809770, lng:8.688927}, 2000);
        this._createFakeMarker({country: 'France', lat: 44.745281, lng:2.080051}, 1500);
        this._createFakeMarker({country: 'Russia', lat: 56.875767, lng:41.410924}, 3500);
        this._createFakeMarker({country: 'India', lat: 17.001243, lng:78.807492}, 2500);
        this._createFakeMarker({country: 'UK', lat: 53.376271, lng:-0.660215}, 1500);
        this._createFakeMarker({country: 'China', lat: 29.832851, lng: 120.072671}, 5000);
        this._createFakeMarker({country: 'South Africa', lat: -29.256599, lng: 24.324561}, 5000);
        this._createFakeMarker({country: 'Portugal', lat: 38.989770, lng: -7.430283}, 5100);
        this._createFakeMarker({country: 'Australia', lat: -34.041968, lng: 150.994123}, 5200);
        this._createFakeMarker({country: 'Saint Petersburg', lat: 59.884495, lng: 30.434003}, 5100);
        this._createFakeMarker({country: 'Saudi', lat: 24.759399, lng: 46.640036}, 4800);
        this._createFakeMarker({country: 'Mexico', lat: 19.409722, lng: -98.991313}, 2200);
        this._createFakeMarker({country: 'USA', lat: 31.124374, lng: -97.531948}, 2200);
        this._createFakeMarker({country: 'South Korea', lat: 37.542154, lng: 126.988170}, 3400);
        this._createFakeMarker({country: 'Buenos Aires', lat: -34.534501, lng:-58.438049}, 3400);


    }

    _createFakeMarker( coordinates, timeOut){

        setTimeout( ()=>{

            //console.log("coordinates", coordinates);
            this.parent._addMarker(coordinates, "fake");

        }, timeOut)

    }


}

/* harmony default export */ __webpack_exports__["a"] = (MapsTester);

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_Canvas_vue__ = __webpack_require__(27);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_df567280_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_Canvas_vue__ = __webpack_require__(114);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(112)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_Canvas_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_df567280_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_Canvas_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/maps/Native-Map/res/Network-Native-Map-Canvas.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-df567280", Component.options)
  } else {
    hotAPI.reload("data-v-df567280", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(113);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("36e719df", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-df567280\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Network-Native-Map-Canvas.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-df567280\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Network-Native-Map-Canvas.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n<style>\n\n    /* map styling */\n\n\nsvg .WebDollarNativeMap{\n\n    margin: auto;\n    opacity: 1;\n    transition: 1s opacity;\n\n    /* we have the map as background image such that we can display:none the hexagons\n    in the svg which greatly improves performance on firefox */\n\n    /*\n        SVG file!!!!!!!!!!!!\n     */\n    background-image: url('');\n}\nsvg.WebDollarNativeMap.hide-circles circle {\n    fill: #26292b;\n}\n.peer-own {\n    display: block !important;\n    fill: white !important;\n    animation: connected 1800ms ease 8;\n}\n.peer-connected-terminal {\n    display: block !important;\n    fill: #fec02c !important;\n    animation: connected 1800ms ease 3;\n}\n.peer-connected-browser {\n    display: block !important;\n    fill: #ff0000 !important;\n    animation: connected 1800ms ease 3;\n}\n.peer-own,\n.peer-connected-terminal,\n.peer-connected-browser {\n    will-change: opacity;\n}\n.link {\n    stroke: #dedede;\n    stroke-width: 1;\n    stroke-dasharray: 5 5;\n    opacity: 0.5;\n}\n@media  screen and  (max-width: 480px) {\nsvg.WebDollarNativeMap{\n        box-sizing: border-box;\n        -ms-transform: scale(1.15);\n            transform: scale(1.15);\n}\n}\n@media   screen and  (max-width: 800px) {\n\n    /* disable map animations when map is in background */\n.peer-own,  .peer-connected-browser, .peer-connected-terminal {\n        animation: none;\n        will-change: initial;\n}\nsvg.WebDollarNativeMap{\n        box-sizing: border-box;\n        -ms-transform: scale(1.05);\n            transform: scale(1.05);\n}\n}\n\n\n/* Large Screen */\n@media screen and (min-width: 1080px) {\nsvg.WebDollarNativeMap {\n        box-sizing: border-box;\n        -ms-transform: scale(0.9);\n            transform: scale(0.9);\n}\n}\n@media screen and (min-width: 1400px) {\nsvg.WebDollarNativeMap {\n        box-sizing: border-box;\n        -ms-transform: scale(0.8);\n            transform: scale(0.8);\n}\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/maps/Native-Map/res/src/components/maps/Native-Map/res/Network-Native-Map-Canvas.vue"],"names":[],"mappings":";AA2iEA;;;;;;;IAOA,aAAA;IACA,WAAA;IACA,uBAAA;;IAEA;+DACA;;IAEA;;OAEA;IACA,0BAAA;CACA;AAGA;IACA,cAAA;CACA;AAEA;IACA,0BAAA;IACA,uBAAA;IAEA,mCAAA;CACA;AAEA;IACA,0BAAA;IACA,yBAAA;IAEA,mCAAA;CACA;AAEA;IACA,0BAAA;IACA,yBAAA;IAEA,mCAAA;CACA;AAEA;;;IAGA,qBAAA;CACA;AAGA;IACA,gBAAA;IACA,gBAAA;IACA,sBAAA;IACA,aAAA;CACA;AAGA;AACA;QACA,uBAAA;QACA,2BAAA;YAAA,uBAAA;CACA;CACA;AAEA;;IAEA,sDAAA;AACA;QAEA,gBAAA;QACA,qBAAA;CACA;AAEA;QACA,uBAAA;QACA,2BAAA;YAAA,uBAAA;CACA;CAEA;;;AAGA,kBAAA;AAEA;AACA;QACA,uBAAA;QACA,0BAAA;YAAA,sBAAA;CACA;CACA;AAEA;AACA;QACA,uBAAA;QACA,0BAAA;YAAA,sBAAA;CACA;CACA","file":"Network-Native-Map-Canvas.vue","sourcesContent":["<template>\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1082 502\" preserveAspectRatio=\"xMinYMin meet\" xml:space=\"preserve\" class=\"hide-circles WebDollarNativeMap\">\n        <circle cx=\"909.4049999999999\" cy=\"270.32666666666665\" r=\"3.6\" />\n        <circle cx=\"942.5949999999999\" cy=\"309.0416666666667\" r=\"3.6\" />\n        <circle cx=\"950.9049999999999\" cy=\"304.16833333333335\" r=\"3.6\" />\n        <circle cx=\"13.805\" cy=\"222.02166666666668\" r=\"3.6\" />\n        <circle cx=\"5.45\" cy=\"217.17833333333337\" r=\"3.6\" />\n        <circle cx=\"46.903333333333336\" cy=\"105.98666666666666\" r=\"3.6\" />\n        <circle cx=\"55.245000000000005\" cy=\"101.14333333333332\" r=\"3.6\" />\n        <circle cx=\"271.06166666666667\" cy=\"23.80666666666667\" r=\"3.6\" />\n        <circle cx=\"279.38500000000005\" cy=\"18.933333333333334\" r=\"3.6\" />\n        <circle cx=\"262.75499999999994\" cy=\"18.93666666666667\" r=\"3.6\" />\n        <circle cx=\"246.21833333333333\" cy=\"212.3283333333333\" r=\"3.6\" />\n        <circle cx=\"254.57500000000002\" cy=\"217.1716666666667\" r=\"3.6\" />\n        <circle cx=\"279.49999999999994\" cy=\"221.98333333333332\" r=\"3.6\" />\n        <circle cx=\"271.14500000000004\" cy=\"226.83833333333334\" r=\"3.6\" />\n        <circle cx=\"304.39\" cy=\"236.50333333333333\" r=\"3.6\" />\n        <circle cx=\"345.76666666666665\" cy=\"9.238333333333332\" r=\"3.6\" />\n        <circle cx=\"337.4366666666666\" cy=\"14.103333333333332\" r=\"3.6\" />\n        <circle cx=\"345.7616666666667\" cy=\"18.965\" r=\"3.6\" />\n        <circle cx=\"370.66\" cy=\"14.141666666666667\" r=\"3.6\" />\n        <circle cx=\"378.97499999999997\" cy=\"9.268333333333333\" r=\"3.6\" />\n        <circle cx=\"387.32500000000005\" cy=\"4.428333333333333\" r=\"3.6\" />\n        <circle cx=\"362.365\" cy=\"9.261666666666665\" r=\"3.6\" />\n        <circle cx=\"354.0783333333333\" cy=\"14.121666666666668\" r=\"3.6\" />\n        <circle cx=\"345.98499999999996\" cy=\"483.0466666666667\" r=\"3.6\" />\n        <circle cx=\"279.53\" cy=\"260.6666666666667\" r=\"3.6\" />\n        <circle cx=\"204.725\" cy=\"188.17500000000004\" r=\"3.6\" />\n        <circle cx=\"204.71\" cy=\"178.50333333333333\" r=\"3.6\" />\n        <circle cx=\"279.4983333333334\" cy=\"270.33666666666664\" r=\"3.6\" />\n        <circle cx=\"296.09333333333336\" cy=\"309.0083333333333\" r=\"3.6\" />\n        <circle cx=\"287.77\" cy=\"294.50333333333333\" r=\"3.6\" />\n        <circle cx=\"287.79333333333335\" cy=\"304.17499999999995\" r=\"3.6\" />\n        <circle cx=\"287.77\" cy=\"275.16333333333336\" r=\"3.6\" />\n        <circle cx=\"204.71\" cy=\"168.83333333333331\" r=\"3.6\" />\n        <circle cx=\"287.77\" cy=\"284.8333333333333\" r=\"3.6\" />\n        <circle cx=\"196.41666666666666\" cy=\"163.98833333333334\" r=\"3.6\" />\n        <circle cx=\"171.47\" cy=\"120.49333333333334\" r=\"3.6\" />\n        <circle cx=\"179.76\" cy=\"134.98666666666665\" r=\"3.6\" />\n        <circle cx=\"163.135\" cy=\"115.65666666666665\" r=\"3.6\" />\n        <circle cx=\"179.76\" cy=\"125.31666666666666\" r=\"3.6\" />\n        <circle cx=\"188.1\" cy=\"159.15333333333334\" r=\"3.6\" />\n        <circle cx=\"179.76\" cy=\"144.65333333333334\" r=\"3.6\" />\n        <circle cx=\"179.77999999999997\" cy=\"154.32\" r=\"3.6\" />\n        <circle cx=\"296.11333333333334\" cy=\"318.6766666666667\" r=\"3.6\" />\n        <circle cx=\"320.93\" cy=\"101.13666666666667\" r=\"3.6\" />\n        <circle cx=\"320.97499999999997\" cy=\"304.18833333333333\" r=\"3.6\" />\n        <circle cx=\"321.00666666666666\" cy=\"323.5216666666667\" r=\"3.6\" />\n        <circle cx=\"337.595\" cy=\"333.1766666666667\" r=\"3.6\" />\n        <circle cx=\"329.3\" cy=\"328.34666666666664\" r=\"3.6\" />\n        <circle cx=\"329.27000000000004\" cy=\"279.9916666666667\" r=\"3.6\" />\n        <circle cx=\"320.965\" cy=\"294.5133333333333\" r=\"3.6\" />\n        <circle cx=\"320.94\" cy=\"110.81\" r=\"3.6\" />\n        <circle cx=\"320.965\" cy=\"284.8433333333333\" r=\"3.6\" />\n        <circle cx=\"312.66666666666663\" cy=\"328.3566666666666\" r=\"3.6\" />\n        <circle cx=\"163.14\" cy=\"105.99\" r=\"3.6\" />\n        <circle cx=\"321.00666666666666\" cy=\"333.19166666666666\" r=\"3.6\" />\n        <circle cx=\"304.4083333333333\" cy=\"323.5216666666667\" r=\"3.6\" />\n        <circle cx=\"337.605\" cy=\"342.84499999999997\" r=\"3.6\" />\n        <circle cx=\"329.3\" cy=\"338.01666666666665\" r=\"3.6\" />\n        <circle cx=\"329.31\" cy=\"347.68333333333334\" r=\"3.6\" />\n        <circle cx=\"321.0133333333334\" cy=\"342.8633333333333\" r=\"3.6\" />\n        <circle cx=\"321.0233333333333\" cy=\"352.52666666666664\" r=\"3.6\" />\n        <circle cx=\"320.99666666666667\" cy=\"313.84666666666664\" r=\"3.6\" />\n        <circle cx=\"312.645\" cy=\"309.02500000000003\" r=\"3.6\" />\n        <circle cx=\"312.66666666666663\" cy=\"318.69\" r=\"3.6\" />\n        <circle cx=\"304.3983333333333\" cy=\"313.8583333333333\" r=\"3.6\" />\n        <circle cx=\"296.0733333333333\" cy=\"299.3383333333333\" r=\"3.6\" />\n        <circle cx=\"304.37833333333333\" cy=\"304.17833333333334\" r=\"3.6\" />\n        <circle cx=\"312.625\" cy=\"299.3533333333333\" r=\"3.6\" />\n        <circle cx=\"312.625\" cy=\"280.0133333333334\" r=\"3.6\" />\n        <circle cx=\"320.9833333333333\" cy=\"275.18333333333334\" r=\"3.6\" />\n        <circle cx=\"312.625\" cy=\"289.68333333333334\" r=\"3.6\" />\n        <circle cx=\"287.85\" cy=\"255.8016666666667\" r=\"3.6\" />\n        <circle cx=\"254.55333333333337\" cy=\"188.165\" r=\"3.6\" />\n        <circle cx=\"246.21833333333333\" cy=\"183.34333333333336\" r=\"3.6\" />\n        <circle cx=\"254.56499999999997\" cy=\"197.82666666666668\" r=\"3.6\" />\n        <circle cx=\"237.905\" cy=\"178.49833333333333\" r=\"3.6\" />\n        <circle cx=\"320.9266666666667\" cy=\"120.47166666666668\" r=\"3.6\" />\n        <circle cx=\"296.07166666666666\" cy=\"289.66833333333335\" r=\"3.6\" />\n        <circle cx=\"296.07166666666666\" cy=\"279.99833333333333\" r=\"3.6\" />\n        <circle cx=\"296.10166666666663\" cy=\"270.33333333333337\" r=\"3.6\" />\n        <circle cx=\"254.50333333333333\" cy=\"81.81\" r=\"3.6\" />\n        <circle cx=\"237.885\" cy=\"91.47333333333334\" r=\"3.6\" />\n        <circle cx=\"212.955\" cy=\"96.32333333333332\" r=\"3.6\" />\n        <circle cx=\"229.58833333333334\" cy=\"96.30833333333334\" r=\"3.6\" />\n        <circle cx=\"204.67999999999998\" cy=\"91.48333333333333\" r=\"3.6\" />\n        <circle cx=\"221.29333333333332\" cy=\"91.48333333333333\" r=\"3.6\" />\n        <circle cx=\"312.58500000000004\" cy=\"115.64333333333332\" r=\"3.6\" />\n        <circle cx=\"196.38666666666668\" cy=\"96.30833333333334\" r=\"3.6\" />\n        <circle cx=\"179.76999999999998\" cy=\"96.30833333333334\" r=\"3.6\" />\n        <circle cx=\"188.06999999999996\" cy=\"91.47333333333334\" r=\"3.6\" />\n        <circle cx=\"171.48000000000002\" cy=\"91.48333333333333\" r=\"3.6\" />\n        <circle cx=\"312.58000000000004\" cy=\"86.63\" r=\"3.6\" />\n        <circle cx=\"312.59000000000003\" cy=\"96.30666666666666\" r=\"3.6\" />\n        <circle cx=\"312.59000000000003\" cy=\"105.97333333333334\" r=\"3.6\" />\n        <circle cx=\"312.54\" cy=\"76.97166666666666\" r=\"3.6\" />\n        <circle cx=\"320.875\" cy=\"72.11666666666667\" r=\"3.6\" />\n        <circle cx=\"163.14\" cy=\"96.32333333333332\" r=\"3.6\" />\n        <circle cx=\"262.835\" cy=\"86.61833333333333\" r=\"3.6\" />\n        <circle cx=\"246.21666666666667\" cy=\"86.63666666666666\" r=\"3.6\" />\n        <circle cx=\"171.47833333333335\" cy=\"149.50666666666666\" r=\"3.6\" />\n        <circle cx=\"329.3\" cy=\"318.6766666666667\" r=\"3.6\" />\n        <circle cx=\"337.595\" cy=\"323.50666666666666\" r=\"3.6\" />\n        <circle cx=\"329.28000000000003\" cy=\"309.0083333333333\" r=\"3.6\" />\n        <circle cx=\"345.91333333333324\" cy=\"338.0166666666667\" r=\"3.6\" />\n        <circle cx=\"345.91333333333324\" cy=\"328.34666666666664\" r=\"3.6\" />\n        <circle cx=\"337.615\" cy=\"284.8333333333333\" r=\"3.6\" />\n        <circle cx=\"329.22166666666664\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"329.23\" cy=\"105.96333333333332\" r=\"3.6\" />\n        <circle cx=\"329.26\" cy=\"289.66833333333335\" r=\"3.6\" />\n        <circle cx=\"329.26\" cy=\"299.3383333333333\" r=\"3.6\" />\n        <circle cx=\"312.67833333333334\" cy=\"347.695\" r=\"3.6\" />\n        <circle cx=\"312.69\" cy=\"357.3666666666666\" r=\"3.6\" />\n        <circle cx=\"321.02833333333336\" cy=\"362.19666666666666\" r=\"3.6\" />\n        <circle cx=\"312.66666666666663\" cy=\"338.02666666666664\" r=\"3.6\" />\n        <circle cx=\"329.32\" cy=\"357.34999999999997\" r=\"3.6\" />\n        <circle cx=\"329.32\" cy=\"367.0183333333334\" r=\"3.6\" />\n        <circle cx=\"337.6166666666667\" cy=\"352.5133333333333\" r=\"3.6\" />\n        <circle cx=\"320.93\" cy=\"91.47000000000001\" r=\"3.6\" />\n        <circle cx=\"337.52\" cy=\"81.78666666666668\" r=\"3.6\" />\n        <circle cx=\"212.93500000000003\" cy=\"76.985\" r=\"3.6\" />\n        <circle cx=\"229.56666666666663\" cy=\"76.96833333333333\" r=\"3.6\" />\n        <circle cx=\"221.26\" cy=\"72.15\" r=\"3.6\" />\n        <circle cx=\"196.365\" cy=\"76.96833333333333\" r=\"3.6\" />\n        <circle cx=\"204.64666666666665\" cy=\"72.13833333333334\" r=\"3.6\" />\n        <circle cx=\"171.4483333333333\" cy=\"72.15\" r=\"3.6\" />\n        <circle cx=\"163.12\" cy=\"76.985\" r=\"3.6\" />\n        <circle cx=\"179.75\" cy=\"76.96833333333333\" r=\"3.6\" />\n        <circle cx=\"188.04833333333332\" cy=\"72.135\" r=\"3.6\" />\n        <circle cx=\"345.845\" cy=\"76.93666666666668\" r=\"3.6\" />\n        <circle cx=\"329.22166666666664\" cy=\"86.62333333333333\" r=\"3.6\" />\n        <circle cx=\"337.5\" cy=\"62.468333333333334\" r=\"3.6\" />\n        <circle cx=\"329.16499999999996\" cy=\"57.613333333333344\" r=\"3.6\" />\n        <circle cx=\"304.4083333333333\" cy=\"333.19166666666666\" r=\"3.6\" />\n        <circle cx=\"262.795\" cy=\"67.31333333333332\" r=\"3.6\" />\n        <circle cx=\"237.865\" cy=\"72.135\" r=\"3.6\" />\n        <circle cx=\"246.17666666666665\" cy=\"67.29666666666667\" r=\"3.6\" />\n        <circle cx=\"254.47000000000003\" cy=\"62.46333333333333\" r=\"3.6\" />\n        <circle cx=\"345.92333333333335\" cy=\"347.6816666666667\" r=\"3.6\" />\n        <circle cx=\"188.06999999999996\" cy=\"81.80333333333333\" r=\"3.6\" />\n        <circle cx=\"196.38666666666668\" cy=\"86.63833333333332\" r=\"3.6\" />\n        <circle cx=\"154.815\" cy=\"81.82166666666667\" r=\"3.6\" />\n        <circle cx=\"179.76999999999998\" cy=\"86.63833333333332\" r=\"3.6\" />\n        <circle cx=\"212.955\" cy=\"86.65333333333335\" r=\"3.6\" />\n        <circle cx=\"154.85166666666666\" cy=\"101.17\" r=\"3.6\" />\n        <circle cx=\"154.81833333333333\" cy=\"120.49333333333334\" r=\"3.6\" />\n        <circle cx=\"171.47000000000003\" cy=\"81.80666666666667\" r=\"3.6\" />\n        <circle cx=\"163.14\" cy=\"86.65333333333335\" r=\"3.6\" />\n        <circle cx=\"320.91999999999996\" cy=\"81.79666666666667\" r=\"3.6\" />\n        <circle cx=\"329.21999999999997\" cy=\"76.94500000000001\" r=\"3.6\" />\n        <circle cx=\"296.11333333333334\" cy=\"328.34666666666664\" r=\"3.6\" />\n        <circle cx=\"221.28166666666667\" cy=\"81.80666666666667\" r=\"3.6\" />\n        <circle cx=\"163.13\" cy=\"125.32666666666667\" r=\"3.6\" />\n        <circle cx=\"254.48166666666665\" cy=\"72.12833333333333\" r=\"3.6\" />\n        <circle cx=\"246.1966666666667\" cy=\"76.965\" r=\"3.6\" />\n        <circle cx=\"229.58833333333334\" cy=\"86.63833333333332\" r=\"3.6\" />\n        <circle cx=\"237.885\" cy=\"81.80333333333333\" r=\"3.6\" />\n        <circle cx=\"262.835\" cy=\"76.96\" r=\"3.6\" />\n        <circle cx=\"271.215\" cy=\"255.8216666666667\" r=\"3.6\" />\n        <circle cx=\"271.195\" cy=\"275.185\" r=\"3.6\" />\n        <circle cx=\"271.22499999999997\" cy=\"265.5033333333334\" r=\"3.6\" />\n        <circle cx=\"171.46833333333333\" cy=\"130.16166666666666\" r=\"3.6\" />\n        <circle cx=\"279.4733333333333\" cy=\"279.99833333333333\" r=\"3.6\" />\n        <circle cx=\"279.4733333333333\" cy=\"299.33833333333337\" r=\"3.6\" />\n        <circle cx=\"287.815\" cy=\"323.50666666666666\" r=\"3.6\" />\n        <circle cx=\"287.815\" cy=\"313.84\" r=\"3.6\" />\n        <circle cx=\"279.49499999999995\" cy=\"309.0083333333333\" r=\"3.6\" />\n        <circle cx=\"279.4733333333333\" cy=\"289.66833333333335\" r=\"3.6\" />\n        <circle cx=\"179.80166666666665\" cy=\"163.98833333333334\" r=\"3.6\" />\n        <circle cx=\"229.61833333333334\" cy=\"173.6583333333333\" r=\"3.6\" />\n        <circle cx=\"171.5\" cy=\"159.16\" r=\"3.6\" />\n        <circle cx=\"171.46833333333333\" cy=\"139.83166666666668\" r=\"3.6\" />\n        <circle cx=\"196.41666666666666\" cy=\"173.6583333333333\" r=\"3.6\" />\n        <circle cx=\"196.41666666666666\" cy=\"183.32833333333335\" r=\"3.6\" />\n        <circle cx=\"196.4433333333333\" cy=\"193.00666666666666\" r=\"3.6\" />\n        <circle cx=\"188.1\" cy=\"168.82333333333332\" r=\"3.6\" />\n        <circle cx=\"204.66833333333332\" cy=\"81.81833333333334\" r=\"3.6\" />\n        <circle cx=\"221.28333333333333\" cy=\"130.16166666666666\" r=\"3.6\" />\n        <circle cx=\"229.57500000000002\" cy=\"134.98666666666665\" r=\"3.6\" />\n        <circle cx=\"254.50666666666666\" cy=\"120.47500000000001\" r=\"3.6\" />\n        <circle cx=\"246.20666666666668\" cy=\"125.31333333333335\" r=\"3.6\" />\n        <circle cx=\"237.875\" cy=\"130.14666666666668\" r=\"3.6\" />\n        <circle cx=\"229.57499999999996\" cy=\"144.65333333333334\" r=\"3.6\" />\n        <circle cx=\"237.89499999999998\" cy=\"149.48499999999999\" r=\"3.6\" />\n        <circle cx=\"212.94500000000002\" cy=\"134.99666666666667\" r=\"3.6\" />\n        <circle cx=\"221.28333333333333\" cy=\"139.83166666666668\" r=\"3.6\" />\n        <circle cx=\"254.50333333333333\" cy=\"139.81666666666666\" r=\"3.6\" />\n        <circle cx=\"271.135\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"254.50333333333333\" cy=\"130.14666666666668\" r=\"3.6\" />\n        <circle cx=\"246.20666666666668\" cy=\"134.98333333333332\" r=\"3.6\" />\n        <circle cx=\"279.43\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"262.795\" cy=\"134.98333333333332\" r=\"3.6\" />\n        <circle cx=\"262.795\" cy=\"125.31333333333335\" r=\"3.6\" />\n        <circle cx=\"246.22833333333332\" cy=\"154.315\" r=\"3.6\" />\n        <circle cx=\"246.20666666666668\" cy=\"144.65\" r=\"3.6\" />\n        <circle cx=\"237.875\" cy=\"139.81666666666663\" r=\"3.6\" />\n        <circle cx=\"237.875\" cy=\"120.47666666666667\" r=\"3.6\" />\n        <circle cx=\"246.21\" cy=\"115.64333333333332\" r=\"3.6\" />\n        <circle cx=\"262.8\" cy=\"115.64333333333332\" r=\"3.6\" />\n        <circle cx=\"229.57500000000002\" cy=\"125.31666666666668\" r=\"3.6\" />\n        <circle cx=\"254.51166666666668\" cy=\"110.80833333333334\" r=\"3.6\" />\n        <circle cx=\"204.67166666666665\" cy=\"120.49166666666666\" r=\"3.6\" />\n        <circle cx=\"204.67\" cy=\"130.16166666666666\" r=\"3.6\" />\n        <circle cx=\"221.28666666666666\" cy=\"120.49333333333333\" r=\"3.6\" />\n        <circle cx=\"212.94500000000002\" cy=\"125.32666666666667\" r=\"3.6\" />\n        <circle cx=\"287.72499999999997\" cy=\"130.13\" r=\"3.6\" />\n        <circle cx=\"287.755\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"271.135\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"279.44\" cy=\"144.64333333333335\" r=\"3.6\" />\n        <circle cx=\"262.795\" cy=\"144.65\" r=\"3.6\" />\n        <circle cx=\"279.43\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"296.0516666666667\" cy=\"134.98\" r=\"3.6\" />\n        <circle cx=\"271.1383333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n        <circle cx=\"254.51333333333332\" cy=\"149.47833333333332\" r=\"3.6\" />\n        <circle cx=\"121.65333333333332\" cy=\"62.47666666666666\" r=\"3.6\" />\n        <circle cx=\"246.13500000000002\" cy=\"28.60166666666667\" r=\"3.6\" />\n        <circle cx=\"204.63\" cy=\"43.126666666666665\" r=\"3.6\" />\n        <circle cx=\"171.41333333333333\" cy=\"43.12166666666667\" r=\"3.6\" />\n        <circle cx=\"188.04666666666665\" cy=\"43.10166666666667\" r=\"3.6\" />\n        <circle cx=\"129.945\" cy=\"57.633333333333326\" r=\"3.6\" />\n        <circle cx=\"370.76500000000004\" cy=\"304.1683333333333\" r=\"3.6\" />\n        <circle cx=\"154.91\" cy=\"178.50333333333333\" r=\"3.6\" />\n        <circle cx=\"295.99499999999995\" cy=\"28.588333333333335\" r=\"3.6\" />\n        <circle cx=\"312.53999999999996\" cy=\"18.93666666666667\" r=\"3.6\" />\n        <circle cx=\"221.225\" cy=\"43.12166666666667\" r=\"3.6\" />\n        <circle cx=\"105.07333333333334\" cy=\"81.82166666666667\" r=\"3.6\" />\n        <circle cx=\"121.63166666666666\" cy=\"72.16833333333334\" r=\"3.6\" />\n        <circle cx=\"146.54333333333332\" cy=\"38.263333333333335\" r=\"3.6\" />\n        <circle cx=\"321.08\" cy=\"497.58500000000004\" r=\"3.6\" />\n        <circle cx=\"154.92166666666665\" cy=\"197.86\" r=\"3.6\" />\n        <circle cx=\"105.01333333333334\" cy=\"52.80833333333333\" r=\"3.6\" />\n        <circle cx=\"80.14833333333333\" cy=\"86.63833333333334\" r=\"3.6\" />\n        <circle cx=\"71.80166666666666\" cy=\"91.49000000000001\" r=\"3.6\" />\n        <circle cx=\"312.725\" cy=\"425.0466666666667\" r=\"3.6\" />\n        <circle cx=\"154.85666666666665\" cy=\"91.46999999999998\" r=\"3.6\" />\n        <circle cx=\"204.67\" cy=\"139.83166666666668\" r=\"3.6\" />\n        <circle cx=\"287.805\" cy=\"265.49333333333334\" r=\"3.6\" />\n        <circle cx=\"154.82666666666665\" cy=\"110.82333333333332\" r=\"3.6\" />\n        <circle cx=\"304.3066666666667\" cy=\"91.45666666666666\" r=\"3.6\" />\n        <circle cx=\"304.375\" cy=\"275.1716666666667\" r=\"3.6\" />\n        <circle cx=\"304.365\" cy=\"284.8433333333333\" r=\"3.6\" />\n        <circle cx=\"196.38\" cy=\"115.64666666666666\" r=\"3.6\" />\n        <circle cx=\"304.3666666666667\" cy=\"294.5133333333334\" r=\"3.6\" />\n        <circle cx=\"221.335\" cy=\"178.51\" r=\"3.6\" />\n        <circle cx=\"154.83833333333334\" cy=\"62.47666666666667\" r=\"3.6\" />\n        <circle cx=\"171.47\" cy=\"197.84333333333333\" r=\"3.6\" />\n        <circle cx=\"321.02833333333336\" cy=\"371.8633333333333\" r=\"3.6\" />\n        <circle cx=\"146.545\" cy=\"57.63333333333333\" r=\"3.6\" />\n        <circle cx=\"320.84166666666664\" cy=\"33.43833333333333\" r=\"3.6\" />\n        <circle cx=\"312.72\" cy=\"434.7166666666667\" r=\"3.6\" />\n        <circle cx=\"321.03833333333336\" cy=\"381.53999999999996\" r=\"3.6\" />\n        <circle cx=\"188.06499999999997\" cy=\"110.80666666666667\" r=\"3.6\" />\n        <circle cx=\"204.67666666666665\" cy=\"110.82333333333334\" r=\"3.6\" />\n        <circle cx=\"237.885\" cy=\"101.13999999999999\" r=\"3.6\" />\n        <circle cx=\"279.45\" cy=\"105.95166666666667\" r=\"3.6\" />\n        <circle cx=\"287.72999999999996\" cy=\"110.79333333333334\" r=\"3.6\" />\n        <circle cx=\"296.0066666666667\" cy=\"105.94\" r=\"3.6\" />\n        <circle cx=\"295.97499999999997\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"246.21666666666667\" cy=\"96.30666666666667\" r=\"3.6\" />\n        <circle cx=\"254.51333333333332\" cy=\"91.47333333333334\" r=\"3.6\" />\n        <circle cx=\"262.805\" cy=\"96.30666666666667\" r=\"3.6\" />\n        <circle cx=\"271.15\" cy=\"91.46833333333335\" r=\"3.6\" />\n        <circle cx=\"279.46\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"320.9\" cy=\"130.165\" r=\"3.6\" />\n        <circle cx=\"312.69\" cy=\"270.325\" r=\"3.6\" />\n        <circle cx=\"329.22999999999996\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"304.4166666666667\" cy=\"265.5133333333333\" r=\"3.6\" />\n        <circle cx=\"304.33000000000004\" cy=\"101.13666666666667\" r=\"3.6\" />\n        <circle cx=\"304.3283333333334\" cy=\"110.80499999999999\" r=\"3.6\" />\n        <circle cx=\"304.32166666666666\" cy=\"120.47166666666665\" r=\"3.6\" />\n        <circle cx=\"312.58000000000004\" cy=\"125.31333333333335\" r=\"3.6\" />\n        <circle cx=\"221.29333333333332\" cy=\"101.15333333333332\" r=\"3.6\" />\n        <circle cx=\"188.06000000000003\" cy=\"130.14666666666668\" r=\"3.6\" />\n        <circle cx=\"229.58833333333334\" cy=\"105.97666666666667\" r=\"3.6\" />\n        <circle cx=\"188.06000000000003\" cy=\"139.8166666666667\" r=\"3.6\" />\n        <circle cx=\"188.06000000000003\" cy=\"120.47666666666665\" r=\"3.6\" />\n        <circle cx=\"212.98499999999999\" cy=\"173.67333333333332\" r=\"3.6\" />\n        <circle cx=\"212.98499999999999\" cy=\"164.00333333333333\" r=\"3.6\" />\n        <circle cx=\"196.39666666666665\" cy=\"154.31833333333333\" r=\"3.6\" />\n        <circle cx=\"179.765\" cy=\"115.64666666666666\" r=\"3.6\" />\n        <circle cx=\"204.69999999999996\" cy=\"159.17333333333335\" r=\"3.6\" />\n        <circle cx=\"188.08\" cy=\"149.48499999999999\" r=\"3.6\" />\n        <circle cx=\"204.67999999999998\" cy=\"101.15333333333335\" r=\"3.6\" />\n        <circle cx=\"196.38666666666668\" cy=\"105.97666666666667\" r=\"3.6\" />\n        <circle cx=\"212.955\" cy=\"105.99\" r=\"3.6\" />\n        <circle cx=\"296.13\" cy=\"260.6666666666667\" r=\"3.6\" />\n        <circle cx=\"171.4766666666667\" cy=\"110.82000000000001\" r=\"3.6\" />\n        <circle cx=\"171.48000000000002\" cy=\"101.15333333333332\" r=\"3.6\" />\n        <circle cx=\"179.76999999999998\" cy=\"105.97666666666667\" r=\"3.6\" />\n        <circle cx=\"188.06999999999996\" cy=\"101.13999999999999\" r=\"3.6\" />\n        <circle cx=\"296.02833333333336\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"287.72499999999997\" cy=\"120.46333333333332\" r=\"3.6\" />\n        <circle cx=\"279.43499999999995\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"296.035\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"304.33\" cy=\"130.1483333333333\" r=\"3.6\" />\n        <circle cx=\"212.94499999999996\" cy=\"144.66666666666666\" r=\"3.6\" />\n        <circle cx=\"254.51333333333332\" cy=\"101.13999999999999\" r=\"3.6\" />\n        <circle cx=\"271.14166666666665\" cy=\"110.80166666666668\" r=\"3.6\" />\n        <circle cx=\"262.805\" cy=\"105.97333333333334\" r=\"3.6\" />\n        <circle cx=\"271.145\" cy=\"101.13666666666667\" r=\"3.6\" />\n        <circle cx=\"229.59666666666666\" cy=\"154.31833333333333\" r=\"3.6\" />\n        <circle cx=\"246.21666666666667\" cy=\"105.97333333333334\" r=\"3.6\" />\n        <circle cx=\"237.915\" cy=\"159.15333333333334\" r=\"3.6\" />\n        <circle cx=\"246.25\" cy=\"163.98666666666668\" r=\"3.6\" />\n        <circle cx=\"221.29333333333332\" cy=\"149.50666666666666\" r=\"3.6\" />\n        <circle cx=\"254.5333333333334\" cy=\"159.16\" r=\"3.6\" />\n        <circle cx=\"271.145\" cy=\"149.48666666666668\" r=\"3.6\" />\n        <circle cx=\"262.81500000000005\" cy=\"154.315\" r=\"3.6\" />\n        <circle cx=\"304.41833333333335\" cy=\"255.82666666666668\" r=\"3.6\" />\n        <circle cx=\"254.5533333333333\" cy=\"168.83\" r=\"3.6\" />\n        <circle cx=\"221.32500000000002\" cy=\"168.83333333333334\" r=\"3.6\" />\n        <circle cx=\"212.965\" cy=\"154.33499999999998\" r=\"3.6\" />\n        <circle cx=\"229.61833333333334\" cy=\"163.98833333333334\" r=\"3.6\" />\n        <circle cx=\"221.31500000000003\" cy=\"159.16\" r=\"3.6\" />\n        <circle cx=\"237.915\" cy=\"168.82333333333332\" r=\"3.6\" />\n        <circle cx=\"262.8666666666667\" cy=\"164.00333333333333\" r=\"3.6\" />\n        <circle cx=\"271.18\" cy=\"159.14833333333334\" r=\"3.6\" />\n        <circle cx=\"237.88\" cy=\"110.80666666666667\" r=\"3.6\" />\n        <circle cx=\"254.56333333333336\" cy=\"178.49333333333334\" r=\"3.6\" />\n        <circle cx=\"246.25\" cy=\"173.65666666666667\" r=\"3.6\" />\n        <circle cx=\"221.29166666666666\" cy=\"110.82\" r=\"3.6\" />\n        <circle cx=\"213.01500000000001\" cy=\"183.36166666666665\" r=\"3.6\" />\n        <circle cx=\"212.95000000000002\" cy=\"115.65666666666668\" r=\"3.6\" />\n        <circle cx=\"229.58166666666668\" cy=\"115.64666666666669\" r=\"3.6\" />\n        <circle cx=\"196.37666666666667\" cy=\"144.65333333333334\" r=\"3.6\" />\n        <circle cx=\"196.37666666666667\" cy=\"125.31666666666668\" r=\"3.6\" />\n        <circle cx=\"204.67999999999998\" cy=\"149.49499999999998\" r=\"3.6\" />\n        <circle cx=\"196.37666666666667\" cy=\"134.98666666666665\" r=\"3.6\" />\n        <circle cx=\"154.81000000000003\" cy=\"72.16000000000001\" r=\"3.6\" />\n        <circle cx=\"296.1566666666667\" cy=\"386.35833333333335\" r=\"3.6\" />\n        <circle cx=\"287.82500000000005\" cy=\"362.19000000000005\" r=\"3.6\" />\n        <circle cx=\"296.135\" cy=\"376.68833333333333\" r=\"3.6\" />\n        <circle cx=\"287.81500000000005\" cy=\"371.8533333333333\" r=\"3.6\" />\n        <circle cx=\"287.855\" cy=\"391.1933333333333\" r=\"3.6\" />\n        <circle cx=\"304.46999999999997\" cy=\"458.87833333333333\" r=\"3.6\" />\n        <circle cx=\"304.46000000000004\" cy=\"449.21666666666664\" r=\"3.6\" />\n        <circle cx=\"296.16833333333335\" cy=\"434.70666666666665\" r=\"3.6\" />\n        <circle cx=\"287.845\" cy=\"429.8666666666666\" r=\"3.6\" />\n        <circle cx=\"254.55666666666664\" cy=\"304.18\" r=\"3.6\" />\n        <circle cx=\"262.885\" cy=\"328.3566666666666\" r=\"3.6\" />\n        <circle cx=\"287.83500000000004\" cy=\"352.5133333333333\" r=\"3.6\" />\n        <circle cx=\"254.5816666666667\" cy=\"323.53000000000003\" r=\"3.6\" />\n        <circle cx=\"246.225\" cy=\"309.03000000000003\" r=\"3.6\" />\n        <circle cx=\"254.57833333333338\" cy=\"313.8616666666667\" r=\"3.6\" />\n        <circle cx=\"279.52500000000003\" cy=\"347.68333333333334\" r=\"3.6\" />\n        <circle cx=\"271.22499999999997\" cy=\"342.8633333333333\" r=\"3.6\" />\n        <circle cx=\"262.875\" cy=\"338.0316666666667\" r=\"3.6\" />\n        <circle cx=\"296.13666666666666\" cy=\"444.39166666666665\" r=\"3.6\" />\n        <circle cx=\"354.24666666666667\" cy=\"381.53333333333336\" r=\"3.6\" />\n        <circle cx=\"362.50500000000005\" cy=\"367.0333333333333\" r=\"3.6\" />\n        <circle cx=\"354.2266666666667\" cy=\"371.8633333333333\" r=\"3.6\" />\n        <circle cx=\"345.9549999999999\" cy=\"386.35833333333335\" r=\"3.6\" />\n        <circle cx=\"379.115\" cy=\"328.34666666666664\" r=\"3.6\" />\n        <circle cx=\"379.125\" cy=\"338.02333333333337\" r=\"3.6\" />\n        <circle cx=\"370.82500000000005\" cy=\"342.8633333333333\" r=\"3.6\" />\n        <circle cx=\"370.83500000000004\" cy=\"352.52666666666664\" r=\"3.6\" />\n        <circle cx=\"370.84\" cy=\"362.19666666666666\" r=\"3.6\" />\n        <circle cx=\"337.69\" cy=\"410.54333333333335\" r=\"3.6\" />\n        <circle cx=\"337.65999999999997\" cy=\"400.86000000000007\" r=\"3.6\" />\n        <circle cx=\"329.36999999999995\" cy=\"434.70666666666665\" r=\"3.6\" />\n        <circle cx=\"304.47166666666664\" cy=\"478.23999999999995\" r=\"3.6\" />\n        <circle cx=\"304.49\" cy=\"468.55833333333334\" r=\"3.6\" />\n        <circle cx=\"312.8233333333333\" cy=\"483.06333333333333\" r=\"3.6\" />\n        <circle cx=\"329.36499999999995\" cy=\"425.0433333333333\" r=\"3.6\" />\n        <circle cx=\"296.13666666666666\" cy=\"463.715\" r=\"3.6\" />\n        <circle cx=\"329.36\" cy=\"415.36666666666673\" r=\"3.6\" />\n        <circle cx=\"345.9766666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n        <circle cx=\"188.025\" cy=\"52.79666666666666\" r=\"3.6\" />\n        <circle cx=\"179.73\" cy=\"57.63333333333333\" r=\"3.6\" />\n        <circle cx=\"138.245\" cy=\"62.46333333333333\" r=\"3.6\" />\n        <circle cx=\"196.34333333333333\" cy=\"57.63333333333333\" r=\"3.6\" />\n        <circle cx=\"171.4383333333333\" cy=\"52.81166666666667\" r=\"3.6\" />\n        <circle cx=\"138.245\" cy=\"52.79666666666666\" r=\"3.6\" />\n        <circle cx=\"146.545\" cy=\"47.96666666666667\" r=\"3.6\" />\n        <circle cx=\"163.10000000000002\" cy=\"57.64666666666667\" r=\"3.6\" />\n        <circle cx=\"154.83833333333334\" cy=\"52.81166666666667\" r=\"3.6\" />\n        <circle cx=\"204.63666666666666\" cy=\"52.81166666666667\" r=\"3.6\" />\n        <circle cx=\"262.76500000000004\" cy=\"47.96333333333334\" r=\"3.6\" />\n        <circle cx=\"254.465\" cy=\"43.12833333333334\" r=\"3.6\" />\n        <circle cx=\"246.13666666666666\" cy=\"38.31166666666667\" r=\"3.6\" />\n        <circle cx=\"212.915\" cy=\"57.64666666666667\" r=\"3.6\" />\n        <circle cx=\"271.105\" cy=\"52.79333333333332\" r=\"3.6\" />\n        <circle cx=\"237.84333333333333\" cy=\"52.796666666666674\" r=\"3.6\" />\n        <circle cx=\"221.25\" cy=\"52.81166666666667\" r=\"3.6\" />\n        <circle cx=\"229.545\" cy=\"57.63333333333333\" r=\"3.6\" />\n        <circle cx=\"171.47\" cy=\"207.51166666666666\" r=\"3.6\" />\n        <circle cx=\"196.45833333333334\" cy=\"221.99499999999998\" r=\"3.6\" />\n        <circle cx=\"204.75\" cy=\"226.84\" r=\"3.6\" />\n        <circle cx=\"188.12\" cy=\"217.16666666666666\" r=\"3.6\" />\n        <circle cx=\"179.82166666666663\" cy=\"212.33666666666667\" r=\"3.6\" />\n        <circle cx=\"254.53833333333333\" cy=\"294.5116666666667\" r=\"3.6\" />\n        <circle cx=\"229.69000000000003\" cy=\"241.34500000000003\" r=\"3.6\" />\n        <circle cx=\"246.29000000000005\" cy=\"260.68833333333333\" r=\"3.6\" />\n        <circle cx=\"213.025\" cy=\"231.68500000000003\" r=\"3.6\" />\n        <circle cx=\"146.545\" cy=\"67.29833333333333\" r=\"3.6\" />\n        <circle cx=\"221.38\" cy=\"236.51166666666668\" r=\"3.6\" />\n        <circle cx=\"171.48499999999999\" cy=\"188.1933333333333\" r=\"3.6\" />\n        <circle cx=\"146.59833333333333\" cy=\"154.31833333333333\" r=\"3.6\" />\n        <circle cx=\"138.295\" cy=\"159.15333333333334\" r=\"3.6\" />\n        <circle cx=\"138.255\" cy=\"139.81666666666666\" r=\"3.6\" />\n        <circle cx=\"146.57833333333335\" cy=\"144.65333333333334\" r=\"3.6\" />\n        <circle cx=\"146.61833333333334\" cy=\"163.98833333333334\" r=\"3.6\" />\n        <circle cx=\"163.16\" cy=\"183.35\" r=\"3.6\" />\n        <circle cx=\"146.58666666666667\" cy=\"173.67499999999998\" r=\"3.6\" />\n        <circle cx=\"179.8166666666667\" cy=\"222.01\" r=\"3.6\" />\n        <circle cx=\"229.68500000000003\" cy=\"251.005\" r=\"3.6\" />\n        <circle cx=\"246.19333333333336\" cy=\"299.3533333333333\" r=\"3.6\" />\n        <circle cx=\"213.035\" cy=\"241.36166666666668\" r=\"3.6\" />\n        <circle cx=\"221.35500000000002\" cy=\"246.205\" r=\"3.6\" />\n        <circle cx=\"237.995\" cy=\"255.83333333333337\" r=\"3.6\" />\n        <circle cx=\"262.87\" cy=\"347.6983333333333\" r=\"3.6\" />\n        <circle cx=\"271.205\" cy=\"352.545\" r=\"3.6\" />\n        <circle cx=\"254.57333333333335\" cy=\"333.1933333333333\" r=\"3.6\" />\n        <circle cx=\"246.23499999999999\" cy=\"318.69\" r=\"3.6\" />\n        <circle cx=\"171.47\" cy=\"217.18166666666664\" r=\"3.6\" />\n        <circle cx=\"146.57833333333332\" cy=\"183.34166666666667\" r=\"3.6\" />\n        <circle cx=\"146.60666666666665\" cy=\"192.98\" r=\"3.6\" />\n        <circle cx=\"138.29500000000002\" cy=\"168.82333333333332\" r=\"3.6\" />\n        <circle cx=\"279.53\" cy=\"357.35166666666663\" r=\"3.6\" />\n        <circle cx=\"204.74\" cy=\"236.53999999999996\" r=\"3.6\" />\n        <circle cx=\"196.42666666666665\" cy=\"231.69000000000003\" r=\"3.6\" />\n        <circle cx=\"279.4083333333333\" cy=\"57.623333333333335\" r=\"3.6\" />\n        <circle cx=\"188.12\" cy=\"226.84666666666666\" r=\"3.6\" />\n        <circle cx=\"379.155\" cy=\"367.0183333333334\" r=\"3.6\" />\n        <circle cx=\"370.84999999999997\" cy=\"371.86999999999995\" r=\"3.6\" />\n        <circle cx=\"138.26500000000001\" cy=\"149.49\" r=\"3.6\" />\n        <circle cx=\"362.535\" cy=\"376.72166666666664\" r=\"3.6\" />\n        <circle cx=\"354.28999999999996\" cy=\"391.2033333333333\" r=\"3.6\" />\n        <circle cx=\"354.29\" cy=\"400.8733333333333\" r=\"3.6\" />\n        <circle cx=\"379.15500000000003\" cy=\"357.3500000000001\" r=\"3.6\" />\n        <circle cx=\"387.47333333333336\" cy=\"333.1766666666667\" r=\"3.6\" />\n        <circle cx=\"387.47333333333336\" cy=\"323.50666666666666\" r=\"3.6\" />\n        <circle cx=\"379.15000000000003\" cy=\"347.68\" r=\"3.6\" />\n        <circle cx=\"329.40000000000003\" cy=\"492.71166666666664\" r=\"3.6\" />\n        <circle cx=\"304.44666666666666\" cy=\"487.8966666666667\" r=\"3.6\" />\n        <circle cx=\"296.14666666666665\" cy=\"473.37833333333333\" r=\"3.6\" />\n        <circle cx=\"296.105\" cy=\"454.03833333333336\" r=\"3.6\" />\n        <circle cx=\"287.845\" cy=\"439.5366666666667\" r=\"3.6\" />\n        <circle cx=\"287.82500000000005\" cy=\"381.53000000000003\" r=\"3.6\" />\n        <circle cx=\"312.78166666666664\" cy=\"492.7183333333333\" r=\"3.6\" />\n        <circle cx=\"337.7183333333333\" cy=\"420.19833333333327\" r=\"3.6\" />\n        <circle cx=\"345.9933333333334\" cy=\"405.70666666666665\" r=\"3.6\" />\n        <circle cx=\"105.01833333333333\" cy=\"62.471666666666664\" r=\"3.6\" />\n        <circle cx=\"296.01000000000005\" cy=\"38.29\" r=\"3.6\" />\n        <circle cx=\"312.51500000000004\" cy=\"38.29666666666667\" r=\"3.6\" />\n        <circle cx=\"320.8433333333333\" cy=\"23.796666666666667\" r=\"3.6\" />\n        <circle cx=\"287.65999999999997\" cy=\"33.446666666666665\" r=\"3.6\" />\n        <circle cx=\"271.105\" cy=\"43.116666666666674\" r=\"3.6\" />\n        <circle cx=\"262.785\" cy=\"38.275\" r=\"3.6\" />\n        <circle cx=\"254.465\" cy=\"33.446666666666665\" r=\"3.6\" />\n        <circle cx=\"138.265\" cy=\"72.15833333333335\" r=\"3.6\" />\n        <circle cx=\"237.80833333333337\" cy=\"33.46\" r=\"3.6\" />\n        <circle cx=\"329.17\" cy=\"28.60166666666667\" r=\"3.6\" />\n        <circle cx=\"354.18666666666667\" cy=\"304.1716666666666\" r=\"3.6\" />\n        <circle cx=\"362.46166666666664\" cy=\"309.02500000000003\" r=\"3.6\" />\n        <circle cx=\"337.4983333333334\" cy=\"33.425000000000004\" r=\"3.6\" />\n        <circle cx=\"387.47333333333336\" cy=\"313.84\" r=\"3.6\" />\n        <circle cx=\"379.1133333333333\" cy=\"308.99666666666667\" r=\"3.6\" />\n        <circle cx=\"345.81333333333333\" cy=\"38.26333333333333\" r=\"3.6\" />\n        <circle cx=\"354.10666666666674\" cy=\"43.123333333333335\" r=\"3.6\" />\n        <circle cx=\"354.15000000000003\" cy=\"101.13666666666666\" r=\"3.6\" />\n        <circle cx=\"279.4083333333333\" cy=\"47.94166666666666\" r=\"3.6\" />\n        <circle cx=\"96.70166666666667\" cy=\"67.27999999999999\" r=\"3.6\" />\n        <circle cx=\"88.395\" cy=\"72.14\" r=\"3.6\" />\n        <circle cx=\"379.1133333333334\" cy=\"318.6766666666667\" r=\"3.6\" />\n        <circle cx=\"88.46499999999999\" cy=\"81.81666666666666\" r=\"3.6\" />\n        <circle cx=\"113.31500000000001\" cy=\"57.64666666666667\" r=\"3.6\" />\n        <circle cx=\"129.945\" cy=\"67.29833333333333\" r=\"3.6\" />\n        <circle cx=\"113.31500000000001\" cy=\"67.31333333333333\" r=\"3.6\" />\n        <circle cx=\"105.04833333333333\" cy=\"72.14333333333333\" r=\"3.6\" />\n        <circle cx=\"96.75333333333333\" cy=\"76.96833333333333\" r=\"3.6\" />\n        <circle cx=\"196.34333333333333\" cy=\"47.96666666666667\" r=\"3.6\" />\n        <circle cx=\"179.73\" cy=\"47.96666666666667\" r=\"3.6\" />\n        <circle cx=\"163.10000000000002\" cy=\"47.97666666666667\" r=\"3.6\" />\n        <circle cx=\"229.55499999999998\" cy=\"47.961666666666666\" r=\"3.6\" />\n        <circle cx=\"121.62166666666666\" cy=\"52.79500000000001\" r=\"3.6\" />\n        <circle cx=\"212.915\" cy=\"47.97666666666667\" r=\"3.6\" />\n        <circle cx=\"129.935\" cy=\"47.96000000000001\" r=\"3.6\" />\n        <circle cx=\"138.235\" cy=\"43.120000000000005\" r=\"3.6\" />\n        <circle cx=\"154.84833333333333\" cy=\"43.13666666666666\" r=\"3.6\" />\n        <circle cx=\"370.82\" cy=\"333.19166666666666\" r=\"3.6\" />\n        <circle cx=\"345.91333333333336\" cy=\"318.6766666666667\" r=\"3.6\" />\n        <circle cx=\"337.595\" cy=\"313.84\" r=\"3.6\" />\n        <circle cx=\"354.2066666666667\" cy=\"323.5216666666667\" r=\"3.6\" />\n        <circle cx=\"362.48499999999996\" cy=\"328.3566666666666\" r=\"3.6\" />\n        <circle cx=\"337.58500000000004\" cy=\"294.4866666666667\" r=\"3.6\" />\n        <circle cx=\"337.52\" cy=\"101.12333333333333\" r=\"3.6\" />\n        <circle cx=\"345.7833333333333\" cy=\"115.63666666666666\" r=\"3.6\" />\n        <circle cx=\"321.07\" cy=\"400.8733333333333\" r=\"3.6\" />\n        <circle cx=\"337.52\" cy=\"91.45333333333333\" r=\"3.6\" />\n        <circle cx=\"337.575\" cy=\"304.175\" r=\"3.6\" />\n        <circle cx=\"337.6166666666667\" cy=\"371.8533333333333\" r=\"3.6\" />\n        <circle cx=\"329.32\" cy=\"376.68833333333333\" r=\"3.6\" />\n        <circle cx=\"329.34000000000003\" cy=\"386.3583333333333\" r=\"3.6\" />\n        <circle cx=\"321.06\" cy=\"391.19666666666666\" r=\"3.6\" />\n        <circle cx=\"354.22166666666664\" cy=\"352.53333333333336\" r=\"3.6\" />\n        <circle cx=\"354.21166666666664\" cy=\"342.85833333333335\" r=\"3.6\" />\n        <circle cx=\"345.935\" cy=\"357.34999999999997\" r=\"3.6\" />\n        <circle cx=\"337.6166666666667\" cy=\"362.18333333333334\" r=\"3.6\" />\n        <circle cx=\"354.20666666666665\" cy=\"333.19166666666666\" r=\"3.6\" />\n        <circle cx=\"229.545\" cy=\"67.29833333333333\" r=\"3.6\" />\n        <circle cx=\"221.25\" cy=\"62.47666666666666\" r=\"3.6\" />\n        <circle cx=\"212.915\" cy=\"67.31333333333335\" r=\"3.6\" />\n        <circle cx=\"237.84333333333336\" cy=\"62.46333333333333\" r=\"3.6\" />\n        <circle cx=\"246.17666666666665\" cy=\"57.63\" r=\"3.6\" />\n        <circle cx=\"204.63666666666666\" cy=\"62.47666666666667\" r=\"3.6\" />\n        <circle cx=\"179.73\" cy=\"67.29833333333333\" r=\"3.6\" />\n        <circle cx=\"188.025\" cy=\"62.46333333333333\" r=\"3.6\" />\n        <circle cx=\"196.34333333333333\" cy=\"67.29833333333333\" r=\"3.6\" />\n        <circle cx=\"345.875\" cy=\"86.62\" r=\"3.6\" />\n        <circle cx=\"246.14666666666665\" cy=\"47.94666666666668\" r=\"3.6\" />\n        <circle cx=\"337.47\" cy=\"52.771666666666675\" r=\"3.6\" />\n        <circle cx=\"295.96666666666664\" cy=\"57.63499999999999\" r=\"3.6\" />\n        <circle cx=\"345.81333333333333\" cy=\"57.626666666666665\" r=\"3.6\" />\n        <circle cx=\"304.28000000000003\" cy=\"62.47833333333333\" r=\"3.6\" />\n        <circle cx=\"171.4383333333333\" cy=\"62.47666666666666\" r=\"3.6\" />\n        <circle cx=\"271.115\" cy=\"62.46666666666667\" r=\"3.6\" />\n        <circle cx=\"262.76500000000004\" cy=\"57.63\" r=\"3.6\" />\n        <circle cx=\"254.47000000000003\" cy=\"52.79666666666666\" r=\"3.6\" />\n        <circle cx=\"262.89\" cy=\"260.66999999999996\" r=\"3.6\" />\n        <circle cx=\"221.29666666666665\" cy=\"217.18333333333337\" r=\"3.6\" />\n        <circle cx=\"196.47500000000002\" cy=\"202.66333333333333\" r=\"3.6\" />\n        <circle cx=\"188.12\" cy=\"197.82666666666668\" r=\"3.6\" />\n        <circle cx=\"271.17999999999995\" cy=\"284.84333333333336\" r=\"3.6\" />\n        <circle cx=\"271.18\" cy=\"294.5133333333334\" r=\"3.6\" />\n        <circle cx=\"262.87666666666667\" cy=\"270.3433333333333\" r=\"3.6\" />\n        <circle cx=\"188.11\" cy=\"188.16\" r=\"3.6\" />\n        <circle cx=\"262.83500000000004\" cy=\"280.0083333333334\" r=\"3.6\" />\n        <circle cx=\"188.1\" cy=\"178.49333333333334\" r=\"3.6\" />\n        <circle cx=\"163.15\" cy=\"154.335\" r=\"3.6\" />\n        <circle cx=\"271.19\" cy=\"304.19\" r=\"3.6\" />\n        <circle cx=\"163.13\" cy=\"134.99666666666667\" r=\"3.6\" />\n        <circle cx=\"154.84666666666666\" cy=\"130.14666666666665\" r=\"3.6\" />\n        <circle cx=\"163.13\" cy=\"144.66666666666666\" r=\"3.6\" />\n        <circle cx=\"179.80166666666665\" cy=\"173.6583333333333\" r=\"3.6\" />\n        <circle cx=\"163.17\" cy=\"164.00333333333333\" r=\"3.6\" />\n        <circle cx=\"171.51\" cy=\"168.83333333333334\" r=\"3.6\" />\n        <circle cx=\"287.815\" cy=\"333.1766666666667\" r=\"3.6\" />\n        <circle cx=\"312.73\" cy=\"396.04333333333335\" r=\"3.6\" />\n        <circle cx=\"312.69\" cy=\"376.7033333333333\" r=\"3.6\" />\n        <circle cx=\"312.71\" cy=\"386.375\" r=\"3.6\" />\n        <circle cx=\"304.46999999999997\" cy=\"410.5433333333333\" r=\"3.6\" />\n        <circle cx=\"304.47\" cy=\"400.8733333333334\" r=\"3.6\" />\n        <circle cx=\"312.73\" cy=\"415.38000000000005\" r=\"3.6\" />\n        <circle cx=\"296.17833333333334\" cy=\"405.69666666666666\" r=\"3.6\" />\n        <circle cx=\"304.4683333333333\" cy=\"420.21333333333337\" r=\"3.6\" />\n        <circle cx=\"296.17833333333334\" cy=\"415.36666666666673\" r=\"3.6\" />\n        <circle cx=\"279.51500000000004\" cy=\"328.34666666666664\" r=\"3.6\" />\n        <circle cx=\"296.11333333333334\" cy=\"338.01666666666665\" r=\"3.6\" />\n        <circle cx=\"312.73\" cy=\"405.7133333333333\" r=\"3.6\" />\n        <circle cx=\"271.21\" cy=\"313.84666666666664\" r=\"3.6\" />\n        <circle cx=\"279.51499999999993\" cy=\"318.6766666666667\" r=\"3.6\" />\n        <circle cx=\"304.42333333333335\" cy=\"352.5333333333333\" r=\"3.6\" />\n        <circle cx=\"304.4133333333333\" cy=\"342.8583333333333\" r=\"3.6\" />\n        <circle cx=\"304.42833333333334\" cy=\"362.19666666666666\" r=\"3.6\" />\n        <circle cx=\"312.69\" cy=\"367.0333333333333\" r=\"3.6\" />\n        <circle cx=\"304.43833333333333\" cy=\"381.52833333333336\" r=\"3.6\" />\n        <circle cx=\"337.6383333333333\" cy=\"381.52500000000003\" r=\"3.6\" />\n        <circle cx=\"345.935\" cy=\"376.68833333333333\" r=\"3.6\" />\n        <circle cx=\"337.65999999999997\" cy=\"391.1933333333333\" r=\"3.6\" />\n        <circle cx=\"329.36\" cy=\"396.02833333333336\" r=\"3.6\" />\n        <circle cx=\"345.93499999999995\" cy=\"367.01833333333326\" r=\"3.6\" />\n        <circle cx=\"362.50500000000005\" cy=\"357.3666666666666\" r=\"3.6\" />\n        <circle cx=\"329.36\" cy=\"405.6966666666667\" r=\"3.6\" />\n        <circle cx=\"362.49499999999995\" cy=\"347.695\" r=\"3.6\" />\n        <circle cx=\"354.2266666666667\" cy=\"362.19666666666666\" r=\"3.6\" />\n        <circle cx=\"321.07000000000005\" cy=\"410.54333333333335\" r=\"3.6\" />\n        <circle cx=\"312.78\" cy=\"454.05333333333334\" r=\"3.6\" />\n        <circle cx=\"312.74999999999994\" cy=\"444.40333333333336\" r=\"3.6\" />\n        <circle cx=\"321.105\" cy=\"468.54999999999995\" r=\"3.6\" />\n        <circle cx=\"312.7916666666667\" cy=\"473.41166666666663\" r=\"3.6\" />\n        <circle cx=\"312.77\" cy=\"463.70666666666665\" r=\"3.6\" />\n        <circle cx=\"321.0683333333334\" cy=\"420.21000000000004\" r=\"3.6\" />\n        <circle cx=\"321.0683333333333\" cy=\"439.5566666666667\" r=\"3.6\" />\n        <circle cx=\"321.06\" cy=\"429.8833333333334\" r=\"3.6\" />\n        <circle cx=\"362.48499999999996\" cy=\"338.0266666666667\" r=\"3.6\" />\n        <circle cx=\"329.16999999999996\" cy=\"38.276666666666664\" r=\"3.6\" />\n        <circle cx=\"337.47\" cy=\"43.11500000000001\" r=\"3.6\" />\n        <circle cx=\"345.7966666666667\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"345.85833333333335\" cy=\"96.27666666666666\" r=\"3.6\" />\n        <circle cx=\"354.10666666666674\" cy=\"52.79333333333333\" r=\"3.6\" />\n        <circle cx=\"304.29833333333335\" cy=\"52.798333333333325\" r=\"3.6\" />\n        <circle cx=\"295.995\" cy=\"47.913333333333334\" r=\"3.6\" />\n        <circle cx=\"312.57\" cy=\"47.97666666666667\" r=\"3.6\" />\n        <circle cx=\"320.895\" cy=\"43.125\" r=\"3.6\" />\n        <circle cx=\"362.48499999999996\" cy=\"318.69\" r=\"3.6\" />\n        <circle cx=\"345.8066666666667\" cy=\"105.97500000000001\" r=\"3.6\" />\n        <circle cx=\"146.525\" cy=\"96.30833333333334\" r=\"3.6\" />\n        <circle cx=\"370.82\" cy=\"323.52166666666665\" r=\"3.6\" />\n        <circle cx=\"354.1966666666667\" cy=\"313.85833333333335\" r=\"3.6\" />\n        <circle cx=\"370.81\" cy=\"313.84666666666664\" r=\"3.6\" />\n        <circle cx=\"354.1466666666667\" cy=\"110.80499999999999\" r=\"3.6\" />\n        <circle cx=\"163.10000000000002\" cy=\"67.31333333333335\" r=\"3.6\" />\n        <circle cx=\"345.89333333333326\" cy=\"299.32666666666665\" r=\"3.6\" />\n        <circle cx=\"345.89333333333326\" cy=\"309.0083333333333\" r=\"3.6\" />\n        <circle cx=\"196.47500000000002\" cy=\"212.33333333333334\" r=\"3.6\" />\n        <circle cx=\"188.12\" cy=\"207.49666666666667\" r=\"3.6\" />\n        <circle cx=\"179.82166666666663\" cy=\"202.66666666666666\" r=\"3.6\" />\n        <circle cx=\"179.8116666666667\" cy=\"192.99666666666667\" r=\"3.6\" />\n        <circle cx=\"221.32833333333335\" cy=\"226.83666666666667\" r=\"3.6\" />\n        <circle cx=\"238.02666666666667\" cy=\"236.4983333333333\" r=\"3.6\" />\n        <circle cx=\"254.53\" cy=\"284.8466666666667\" r=\"3.6\" />\n        <circle cx=\"262.845\" cy=\"289.68333333333334\" r=\"3.6\" />\n        <circle cx=\"254.59500000000003\" cy=\"265.5183333333334\" r=\"3.6\" />\n        <circle cx=\"179.80166666666665\" cy=\"183.32833333333335\" r=\"3.6\" />\n        <circle cx=\"154.87\" cy=\"139.83166666666665\" r=\"3.6\" />\n        <circle cx=\"154.88\" cy=\"149.495\" r=\"3.6\" />\n        <circle cx=\"154.9\" cy=\"159.17333333333335\" r=\"3.6\" />\n        <circle cx=\"304.46\" cy=\"439.5516666666667\" r=\"3.6\" />\n        <circle cx=\"171.51\" cy=\"178.50333333333333\" r=\"3.6\" />\n        <circle cx=\"262.845\" cy=\"299.3533333333333\" r=\"3.6\" />\n        <circle cx=\"163.17\" cy=\"173.67333333333332\" r=\"3.6\" />\n        <circle cx=\"154.91\" cy=\"168.83333333333334\" r=\"3.6\" />\n        <circle cx=\"146.54666666666665\" cy=\"134.97\" r=\"3.6\" />\n        <circle cx=\"296.17833333333334\" cy=\"396.02833333333336\" r=\"3.6\" />\n        <circle cx=\"304.4283333333333\" cy=\"371.8633333333333\" r=\"3.6\" />\n        <circle cx=\"304.4583333333333\" cy=\"391.2083333333333\" r=\"3.6\" />\n        <circle cx=\"287.695\" cy=\"52.776666666666664\" r=\"3.6\" />\n        <circle cx=\"287.855\" cy=\"400.85999999999996\" r=\"3.6\" />\n        <circle cx=\"287.855\" cy=\"410.52666666666664\" r=\"3.6\" />\n        <circle cx=\"304.46166666666664\" cy=\"429.87999999999994\" r=\"3.6\" />\n        <circle cx=\"296.175\" cy=\"425.0366666666667\" r=\"3.6\" />\n        <circle cx=\"287.85333333333335\" cy=\"420.195\" r=\"3.6\" />\n        <circle cx=\"271.21999999999997\" cy=\"333.19166666666666\" r=\"3.6\" />\n        <circle cx=\"262.865\" cy=\"309.02500000000003\" r=\"3.6\" />\n        <circle cx=\"271.22\" cy=\"323.5216666666667\" r=\"3.6\" />\n        <circle cx=\"279.51499999999993\" cy=\"338.01666666666665\" r=\"3.6\" />\n        <circle cx=\"262.885\" cy=\"318.69000000000005\" r=\"3.6\" />\n        <circle cx=\"296.135\" cy=\"367.0183333333334\" r=\"3.6\" />\n        <circle cx=\"296.135\" cy=\"357.34999999999997\" r=\"3.6\" />\n        <circle cx=\"296.125\" cy=\"347.6816666666667\" r=\"3.6\" />\n        <circle cx=\"287.82500000000005\" cy=\"342.84499999999997\" r=\"3.6\" />\n        <circle cx=\"412.455\" cy=\"492.73\" r=\"3.6\" />\n        <circle cx=\"420.52500000000003\" cy=\"33.45666666666667\" r=\"3.6\" />\n        <circle cx=\"428.81500000000005\" cy=\"28.60833333333333\" r=\"3.6\" />\n        <circle cx=\"403.91499999999996\" cy=\"52.79333333333333\" r=\"3.6\" />\n        <circle cx=\"403.91\" cy=\"43.12499999999999\" r=\"3.6\" />\n        <circle cx=\"428.8149999999999\" cy=\"18.93833333333333\" r=\"3.6\" />\n        <circle cx=\"412.195\" cy=\"38.29333333333334\" r=\"3.6\" />\n        <circle cx=\"387.27500000000003\" cy=\"52.776666666666664\" r=\"3.6\" />\n        <circle cx=\"395.57\" cy=\"28.625\" r=\"3.6\" />\n        <circle cx=\"420.52\" cy=\"23.78333333333333\" r=\"3.6\" />\n        <circle cx=\"403.8933333333334\" cy=\"23.78333333333333\" r=\"3.6\" />\n        <circle cx=\"412.185\" cy=\"18.953333333333337\" r=\"3.6\" />\n        <circle cx=\"395.59\" cy=\"47.93000000000001\" r=\"3.6\" />\n        <circle cx=\"412.205\" cy=\"9.261666666666668\" r=\"3.6\" />\n        <circle cx=\"428.81333333333333\" cy=\"9.258333333333333\" r=\"3.6\" />\n        <circle cx=\"445.41166666666663\" cy=\"9.235\" r=\"3.6\" />\n        <circle cx=\"461.9866666666667\" cy=\"9.261666666666668\" r=\"3.6\" />\n        <circle cx=\"395.6000000000001\" cy=\"67.31\" r=\"3.6\" />\n        <circle cx=\"453.7033333333334\" cy=\"43.14833333333333\" r=\"3.6\" />\n        <circle cx=\"395.555\" cy=\"38.281666666666666\" r=\"3.6\" />\n        <circle cx=\"412.185\" cy=\"28.623333333333335\" r=\"3.6\" />\n        <circle cx=\"403.90000000000003\" cy=\"33.45\" r=\"3.6\" />\n        <circle cx=\"445.4116666666667\" cy=\"18.938333333333333\" r=\"3.6\" />\n        <circle cx=\"437.1133333333333\" cy=\"23.77333333333333\" r=\"3.6\" />\n        <circle cx=\"453.7050000000001\" cy=\"23.78333333333333\" r=\"3.6\" />\n        <circle cx=\"395.62000000000006\" cy=\"57.61666666666667\" r=\"3.6\" />\n        <circle cx=\"403.925\" cy=\"62.468333333333334\" r=\"3.6\" />\n        <circle cx=\"428.845\" cy=\"47.95333333333334\" r=\"3.6\" />\n        <circle cx=\"420.55\" cy=\"52.79833333333334\" r=\"3.6\" />\n        <circle cx=\"412.23499999999996\" cy=\"57.64666666666667\" r=\"3.6\" />\n        <circle cx=\"387.27500000000003\" cy=\"62.44666666666668\" r=\"3.6\" />\n        <circle cx=\"387.25500000000005\" cy=\"23.77333333333333\" r=\"3.6\" />\n        <circle cx=\"445.4216666666666\" cy=\"38.278333333333336\" r=\"3.6\" />\n        <circle cx=\"470.3200000000001\" cy=\"23.786666666666665\" r=\"3.6\" />\n        <circle cx=\"478.60999999999996\" cy=\"9.263333333333334\" r=\"3.6\" />\n        <circle cx=\"395.57\" cy=\"18.919999999999998\" r=\"3.6\" />\n        <circle cx=\"437.165\" cy=\"43.12833333333333\" r=\"3.6\" />\n        <circle cx=\"462.0316666666667\" cy=\"38.29\" r=\"3.6\" />\n        <circle cx=\"428.825\" cy=\"38.27666666666667\" r=\"3.6\" />\n        <circle cx=\"445.41166666666663\" cy=\"28.60833333333333\" r=\"3.6\" />\n        <circle cx=\"437.1233333333333\" cy=\"33.443333333333335\" r=\"3.6\" />\n        <circle cx=\"453.71166666666676\" cy=\"33.45\" r=\"3.6\" />\n        <circle cx=\"461.99666666666667\" cy=\"28.641666666666666\" r=\"3.6\" />\n        <circle cx=\"412.205\" cy=\"47.96333333333333\" r=\"3.6\" />\n        <circle cx=\"420.535\" cy=\"43.12\" r=\"3.6\" />\n        <circle cx=\"420.52\" cy=\"14.116666666666665\" r=\"3.6\" />\n        <circle cx=\"437.1133333333333\" cy=\"14.103333333333332\" r=\"3.6\" />\n        <circle cx=\"403.8833333333334\" cy=\"14.11166666666667\" r=\"3.6\" />\n        <circle cx=\"453.705\" cy=\"14.116666666666669\" r=\"3.6\" />\n        <circle cx=\"461.965\" cy=\"18.95333333333333\" r=\"3.6\" />\n        <circle cx=\"470.31500000000005\" cy=\"14.123333333333335\" r=\"3.6\" />\n        <circle cx=\"470.305\" cy=\"62.48500000000001\" r=\"3.6\" />\n        <circle cx=\"461.99666666666667\" cy=\"57.61166666666667\" r=\"3.6\" />\n        <circle cx=\"478.62999999999994\" cy=\"57.61166666666667\" r=\"3.6\" />\n        <circle cx=\"486.99999999999994\" cy=\"101.12333333333333\" r=\"3.6\" />\n        <circle cx=\"503.54999999999995\" cy=\"81.80333333333333\" r=\"3.6\" />\n        <circle cx=\"503.5416666666667\" cy=\"101.145\" r=\"3.6\" />\n        <circle cx=\"511.905\" cy=\"96.30666666666667\" r=\"3.6\" />\n        <circle cx=\"503.5416666666667\" cy=\"91.46833333333332\" r=\"3.6\" />\n        <circle cx=\"544.4785714285714\" cy=\"18.662857142857142\" r=\"3.6\" />\n        <circle cx=\"560.6916666666666\" cy=\"18.958333333333332\" r=\"3.6\" />\n        <circle cx=\"552.3666666666667\" cy=\"14.098333333333331\" r=\"3.6\" />\n        <circle cx=\"568.995\" cy=\"14.086666666666666\" r=\"3.6\" />\n        <circle cx=\"552.4699999999999\" cy=\"159.13666666666668\" r=\"3.6\" />\n        <circle cx=\"610.495\" cy=\"9.266666666666666\" r=\"3.6\" />\n        <circle cx=\"627.0899999999999\" cy=\"9.253333333333332\" r=\"3.6\" />\n        <circle cx=\"643.7216666666667\" cy=\"38.275\" r=\"3.6\" />\n        <circle cx=\"635.37\" cy=\"33.428333333333335\" r=\"3.6\" />\n        <circle cx=\"651.9716666666667\" cy=\"23.776666666666667\" r=\"3.6\" />\n        <circle cx=\"643.685\" cy=\"28.58666666666667\" r=\"3.6\" />\n        <circle cx=\"660.2633333333334\" cy=\"18.908333333333335\" r=\"3.6\" />\n        <circle cx=\"660.4133333333333\" cy=\"357.325\" r=\"3.6\" />\n        <circle cx=\"652.11\" cy=\"381.5383333333334\" r=\"3.6\" />\n        <circle cx=\"652.08\" cy=\"362.1816666666667\" r=\"3.6\" />\n        <circle cx=\"668.7133333333333\" cy=\"342.83\" r=\"3.6\" />\n        <circle cx=\"668.745\" cy=\"352.4916666666666\" r=\"3.6\" />\n        <circle cx=\"652.08\" cy=\"371.8516666666667\" r=\"3.6\" />\n        <circle cx=\"660.4533333333334\" cy=\"367.00666666666666\" r=\"3.6\" />\n        <circle cx=\"660.4533333333334\" cy=\"376.6766666666667\" r=\"3.6\" />\n        <circle cx=\"710.5749999999999\" cy=\"9.26\" r=\"3.6\" />\n        <circle cx=\"718.4266666666667\" cy=\"14.11\" r=\"3.6\" />\n        <circle cx=\"818.0166666666668\" cy=\"23.773333333333337\" r=\"3.6\" />\n        <circle cx=\"859.58\" cy=\"105.95833333333336\" r=\"3.6\" />\n        <circle cx=\"859.58\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"859.5749999999999\" cy=\"115.62833333333334\" r=\"3.6\" />\n        <circle cx=\"859.58\" cy=\"86.62333333333333\" r=\"3.6\" />\n        <circle cx=\"842.9350000000001\" cy=\"144.65\" r=\"3.6\" />\n        <circle cx=\"851.2783333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n        <circle cx=\"834.6599999999999\" cy=\"149.475\" r=\"3.6\" />\n        <circle cx=\"851.275\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"851.275\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"851.2866666666667\" cy=\"91.47000000000001\" r=\"3.6\" />\n        <circle cx=\"793.11\" cy=\"86.63666666666666\" r=\"3.6\" />\n        <circle cx=\"801.4383333333334\" cy=\"81.79666666666667\" r=\"3.6\" />\n        <circle cx=\"809.7400000000001\" cy=\"86.62333333333333\" r=\"3.6\" />\n        <circle cx=\"528.5283333333334\" cy=\"221.98833333333334\" r=\"3.6\" />\n        <circle cx=\"834.66\" cy=\"91.46999999999998\" r=\"3.6\" />\n        <circle cx=\"818.0366666666667\" cy=\"91.45333333333333\" r=\"3.6\" />\n        <circle cx=\"842.9466666666666\" cy=\"86.63666666666666\" r=\"3.6\" />\n        <circle cx=\"826.3683333333333\" cy=\"86.62333333333333\" r=\"3.6\" />\n        <circle cx=\"784.8216666666667\" cy=\"81.80833333333334\" r=\"3.6\" />\n        <circle cx=\"751.6533333333333\" cy=\"159.14666666666668\" r=\"3.6\" />\n        <circle cx=\"743.305\" cy=\"154.315\" r=\"3.6\" />\n        <circle cx=\"735.035\" cy=\"149.475\" r=\"3.6\" />\n        <circle cx=\"759.9583333333334\" cy=\"163.97666666666666\" r=\"3.6\" />\n        <circle cx=\"726.7283333333334\" cy=\"144.63666666666668\" r=\"3.6\" />\n        <circle cx=\"768.255\" cy=\"159.13666666666668\" r=\"3.6\" />\n        <circle cx=\"709.7887499999999\" cy=\"134.96375\" r=\"3.6\" />\n        <circle cx=\"718.4266666666666\" cy=\"139.79666666666668\" r=\"3.6\" />\n        <circle cx=\"776.5499999999998\" cy=\"154.30666666666667\" r=\"3.6\" />\n        <circle cx=\"818.07\" cy=\"159.13666666666668\" r=\"3.6\" />\n        <circle cx=\"809.75\" cy=\"154.30666666666667\" r=\"3.6\" />\n        <circle cx=\"826.4\" cy=\"163.97666666666666\" r=\"3.6\" />\n        <circle cx=\"834.69\" cy=\"168.82166666666666\" r=\"3.6\" />\n        <circle cx=\"801.4466666666667\" cy=\"149.48666666666668\" r=\"3.6\" />\n        <circle cx=\"834.68\" cy=\"159.15833333333333\" r=\"3.6\" />\n        <circle cx=\"784.8333333333334\" cy=\"149.475\" r=\"3.6\" />\n        <circle cx=\"793.1183333333333\" cy=\"154.315\" r=\"3.6\" />\n        <circle cx=\"560.7333333333333\" cy=\"105.95666666666666\" r=\"3.6\" />\n        <circle cx=\"560.7283333333334\" cy=\"115.62666666666667\" r=\"3.6\" />\n        <circle cx=\"702.13875\" cy=\"139.7975\" r=\"3.6\" />\n        <circle cx=\"552.4266666666666\" cy=\"139.79666666666665\" r=\"3.6\" />\n        <circle cx=\"560.725\" cy=\"96.28166666666668\" r=\"3.6\" />\n        <circle cx=\"560.7133333333334\" cy=\"125.30166666666668\" r=\"3.6\" />\n        <circle cx=\"602.255\" cy=\"101.12166666666667\" r=\"3.6\" />\n        <circle cx=\"577.3516666666666\" cy=\"86.60166666666667\" r=\"3.6\" />\n        <circle cx=\"593.9633333333334\" cy=\"96.27666666666669\" r=\"3.6\" />\n        <circle cx=\"585.66\" cy=\"91.43666666666667\" r=\"3.6\" />\n        <circle cx=\"520.2133333333334\" cy=\"168.8216666666667\" r=\"3.6\" />\n        <circle cx=\"520.235\" cy=\"207.49333333333334\" r=\"3.6\" />\n        <circle cx=\"511.895\" cy=\"212.33333333333334\" r=\"3.6\" />\n        <circle cx=\"520.235\" cy=\"217.16333333333333\" r=\"3.6\" />\n        <circle cx=\"520.1883333333334\" cy=\"159.13166666666666\" r=\"3.6\" />\n        <circle cx=\"520.23\" cy=\"197.82000000000002\" r=\"3.6\" />\n        <circle cx=\"610.515\" cy=\"96.28666666666668\" r=\"3.6\" />\n        <circle cx=\"520.2133333333334\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"520.22\" cy=\"188.16\" r=\"3.6\" />\n        <circle cx=\"718.44\" cy=\"81.78666666666668\" r=\"3.6\" />\n        <circle cx=\"768.225\" cy=\"81.78666666666668\" r=\"3.6\" />\n        <circle cx=\"726.7199999999999\" cy=\"76.95666666666668\" r=\"3.6\" />\n        <circle cx=\"710.1442857142857\" cy=\"77.23285714285716\" r=\"3.6\" />\n        <circle cx=\"702.14125\" cy=\"81.78125\" r=\"3.6\" />\n        <circle cx=\"743.275\" cy=\"76.965\" r=\"3.6\" />\n        <circle cx=\"759.9050000000001\" cy=\"76.95666666666668\" r=\"3.6\" />\n        <circle cx=\"735.0016666666667\" cy=\"72.125\" r=\"3.6\" />\n        <circle cx=\"751.6\" cy=\"72.13666666666667\" r=\"3.6\" />\n        <circle cx=\"693.48\" cy=\"86.62\" r=\"3.6\" />\n        <circle cx=\"685.2033333333334\" cy=\"91.45166666666667\" r=\"3.6\" />\n        <circle cx=\"635.4449999999999\" cy=\"101.10666666666667\" r=\"3.6\" />\n        <circle cx=\"826.3566666666667\" cy=\"144.63666666666668\" r=\"3.6\" />\n        <circle cx=\"618.855\" cy=\"101.12166666666667\" r=\"3.6\" />\n        <circle cx=\"627.1483333333333\" cy=\"105.94666666666666\" r=\"3.6\" />\n        <circle cx=\"643.7633333333333\" cy=\"105.94666666666667\" r=\"3.6\" />\n        <circle cx=\"676.91\" cy=\"96.27666666666669\" r=\"3.6\" />\n        <circle cx=\"660.3383333333334\" cy=\"96.27666666666669\" r=\"3.6\" />\n        <circle cx=\"668.595\" cy=\"101.10666666666667\" r=\"3.6\" />\n        <circle cx=\"776.54\" cy=\"86.62333333333333\" r=\"3.6\" />\n        <circle cx=\"685.2033333333334\" cy=\"101.12166666666667\" r=\"3.6\" />\n        <circle cx=\"702.1487500000001\" cy=\"91.45375000000001\" r=\"3.6\" />\n        <circle cx=\"693.48\" cy=\"96.28666666666668\" r=\"3.6\" />\n        <circle cx=\"676.91\" cy=\"105.94666666666667\" r=\"3.6\" />\n        <circle cx=\"735.0233333333332\" cy=\"81.80833333333334\" r=\"3.6\" />\n        <circle cx=\"668.59\" cy=\"110.77500000000002\" r=\"3.6\" />\n        <circle cx=\"726.7416666666667\" cy=\"86.62333333333333\" r=\"3.6\" />\n        <circle cx=\"743.295\" cy=\"86.63666666666666\" r=\"3.6\" />\n        <circle cx=\"709.7987499999999\" cy=\"86.62\" r=\"3.6\" />\n        <circle cx=\"718.44\" cy=\"91.45333333333333\" r=\"3.6\" />\n        <circle cx=\"618.8516666666666\" cy=\"110.79\" r=\"3.6\" />\n        <circle cx=\"627.14\" cy=\"115.61833333333333\" r=\"3.6\" />\n        <circle cx=\"610.515\" cy=\"105.95666666666666\" r=\"3.6\" />\n        <circle cx=\"602.2516666666667\" cy=\"110.79333333333334\" r=\"3.6\" />\n        <circle cx=\"593.9616666666667\" cy=\"105.94666666666667\" r=\"3.6\" />\n        <circle cx=\"635.4399999999999\" cy=\"110.77666666666669\" r=\"3.6\" />\n        <circle cx=\"660.3383333333334\" cy=\"105.94666666666666\" r=\"3.6\" />\n        <circle cx=\"643.76\" cy=\"115.61666666666667\" r=\"3.6\" />\n        <circle cx=\"652.015\" cy=\"110.79\" r=\"3.6\" />\n        <circle cx=\"851.2866666666667\" cy=\"101.13666666666667\" r=\"3.6\" />\n        <circle cx=\"842.9466666666666\" cy=\"96.30666666666667\" r=\"3.6\" />\n        <circle cx=\"834.66\" cy=\"101.13666666666666\" r=\"3.6\" />\n        <circle cx=\"851.2816666666666\" cy=\"110.80166666666668\" r=\"3.6\" />\n        <circle cx=\"826.3683333333333\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"842.9350000000001\" cy=\"134.98333333333332\" r=\"3.6\" />\n        <circle cx=\"834.65\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"842.935\" cy=\"125.31333333333332\" r=\"3.6\" />\n        <circle cx=\"842.9416666666666\" cy=\"115.64333333333333\" r=\"3.6\" />\n        <circle cx=\"793.11\" cy=\"96.30666666666667\" r=\"3.6\" />\n        <circle cx=\"768.225\" cy=\"91.45333333333333\" r=\"3.6\" />\n        <circle cx=\"818.0366666666667\" cy=\"101.12333333333333\" r=\"3.6\" />\n        <circle cx=\"776.54\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"759.9250000000001\" cy=\"86.62333333333333\" r=\"3.6\" />\n        <circle cx=\"784.8316666666666\" cy=\"91.46999999999998\" r=\"3.6\" />\n        <circle cx=\"809.7400000000001\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"801.4483333333333\" cy=\"91.47000000000001\" r=\"3.6\" />\n        <circle cx=\"751.62\" cy=\"81.79666666666667\" r=\"3.6\" />\n        <circle cx=\"577.3616666666667\" cy=\"96.27666666666669\" r=\"3.6\" />\n        <circle cx=\"602.3483333333334\" cy=\"255.82333333333335\" r=\"3.6\" />\n        <circle cx=\"618.9499999999999\" cy=\"246.15333333333334\" r=\"3.6\" />\n        <circle cx=\"610.61\" cy=\"250.99333333333334\" r=\"3.6\" />\n        <circle cx=\"627.25\" cy=\"241.30166666666665\" r=\"3.6\" />\n        <circle cx=\"635.485\" cy=\"197.80166666666665\" r=\"3.6\" />\n        <circle cx=\"577.4583333333333\" cy=\"250.97833333333335\" r=\"3.6\" />\n        <circle cx=\"577.4583333333333\" cy=\"260.6466666666667\" r=\"3.6\" />\n        <circle cx=\"594.055\" cy=\"260.6466666666667\" r=\"3.6\" />\n        <circle cx=\"585.7299999999999\" cy=\"265.4733333333333\" r=\"3.6\" />\n        <circle cx=\"652.0516666666666\" cy=\"168.79999999999998\" r=\"3.6\" />\n        <circle cx=\"676.9200000000001\" cy=\"154.28833333333333\" r=\"3.6\" />\n        <circle cx=\"643.8033333333333\" cy=\"192.96666666666667\" r=\"3.6\" />\n        <circle cx=\"685.2033333333334\" cy=\"149.45833333333334\" r=\"3.6\" />\n        <circle cx=\"660.3683333333333\" cy=\"163.95833333333334\" r=\"3.6\" />\n        <circle cx=\"668.625\" cy=\"159.12333333333333\" r=\"3.6\" />\n        <circle cx=\"652.0616666666666\" cy=\"188.14\" r=\"3.6\" />\n        <circle cx=\"577.4583333333334\" cy=\"241.3083333333333\" r=\"3.6\" />\n        <circle cx=\"652.0516666666666\" cy=\"178.47\" r=\"3.6\" />\n        <circle cx=\"528.5083333333334\" cy=\"173.64333333333332\" r=\"3.6\" />\n        <circle cx=\"569.0616666666666\" cy=\"120.46333333333332\" r=\"3.6\" />\n        <circle cx=\"569.0683333333333\" cy=\"110.78999999999998\" r=\"3.6\" />\n        <circle cx=\"569.0300000000001\" cy=\"130.145\" r=\"3.6\" />\n        <circle cx=\"528.5083333333334\" cy=\"163.97666666666666\" r=\"3.6\" />\n        <circle cx=\"585.66\" cy=\"101.10666666666667\" r=\"3.6\" />\n        <circle cx=\"569.07\" cy=\"101.12166666666667\" r=\"3.6\" />\n        <circle cx=\"693.4699999999999\" cy=\"144.63333333333335\" r=\"3.6\" />\n        <circle cx=\"569.1533333333333\" cy=\"236.47666666666666\" r=\"3.6\" />\n        <circle cx=\"569.04\" cy=\"91.435\" r=\"3.6\" />\n        <circle cx=\"552.4833333333333\" cy=\"226.81333333333336\" r=\"3.6\" />\n        <circle cx=\"536.825\" cy=\"217.15333333333334\" r=\"3.6\" />\n        <circle cx=\"544.995\" cy=\"221.98625\" r=\"3.6\" />\n        <circle cx=\"560.8050000000001\" cy=\"231.655\" r=\"3.6\" />\n        <circle cx=\"528.5083333333334\" cy=\"183.30999999999997\" r=\"3.6\" />\n        <circle cx=\"528.5183333333333\" cy=\"192.98\" r=\"3.6\" />\n        <circle cx=\"528.5283333333334\" cy=\"202.64833333333334\" r=\"3.6\" />\n        <circle cx=\"528.5283333333334\" cy=\"212.3183333333333\" r=\"3.6\" />\n        <circle cx=\"652.0200000000001\" cy=\"101.12\" r=\"3.6\" />\n        <circle cx=\"552.4200000000001\" cy=\"101.12333333333333\" r=\"3.6\" />\n        <circle cx=\"577.3366666666667\" cy=\"76.94166666666666\" r=\"3.6\" />\n        <circle cx=\"552.4200000000001\" cy=\"110.79333333333334\" r=\"3.6\" />\n        <circle cx=\"585.66\" cy=\"81.77\" r=\"3.6\" />\n        <circle cx=\"610.515\" cy=\"86.62\" r=\"3.6\" />\n        <circle cx=\"618.855\" cy=\"91.45166666666667\" r=\"3.6\" />\n        <circle cx=\"593.9616666666667\" cy=\"86.60666666666667\" r=\"3.6\" />\n        <circle cx=\"551.9371428571429\" cy=\"120.73571428571428\" r=\"3.6\" />\n        <circle cx=\"602.255\" cy=\"91.45166666666667\" r=\"3.6\" />\n        <circle cx=\"627.1483333333333\" cy=\"96.27666666666669\" r=\"3.6\" />\n        <circle cx=\"511.895\" cy=\"202.66333333333333\" r=\"3.6\" />\n        <circle cx=\"544.5557142857143\" cy=\"135.25285714285715\" r=\"3.6\" />\n        <circle cx=\"511.88499999999993\" cy=\"192.995\" r=\"3.6\" />\n        <circle cx=\"503.61999999999995\" cy=\"217.16333333333333\" r=\"3.6\" />\n        <circle cx=\"503.62000000000006\" cy=\"207.49333333333337\" r=\"3.6\" />\n        <circle cx=\"511.875\" cy=\"183.32666666666668\" r=\"3.6\" />\n        <circle cx=\"511.86499999999995\" cy=\"163.98\" r=\"3.6\" />\n        <circle cx=\"511.875\" cy=\"173.65666666666667\" r=\"3.6\" />\n        <circle cx=\"660.3383333333334\" cy=\"86.60666666666667\" r=\"3.6\" />\n        <circle cx=\"734.9916666666667\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"743.255\" cy=\"67.29666666666667\" r=\"3.6\" />\n        <circle cx=\"726.6983333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n        <circle cx=\"718.4183333333334\" cy=\"72.115\" r=\"3.6\" />\n        <circle cx=\"759.8833333333332\" cy=\"67.28666666666666\" r=\"3.6\" />\n        <circle cx=\"768.2049999999999\" cy=\"72.115\" r=\"3.6\" />\n        <circle cx=\"635.4449999999999\" cy=\"91.43666666666667\" r=\"3.6\" />\n        <circle cx=\"776.52\" cy=\"76.95666666666668\" r=\"3.6\" />\n        <circle cx=\"709.75875\" cy=\"67.28375000000001\" r=\"3.6\" />\n        <circle cx=\"751.5900000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"668.595\" cy=\"91.43666666666667\" r=\"3.6\" />\n        <circle cx=\"652.0200000000001\" cy=\"91.45\" r=\"3.6\" />\n        <circle cx=\"495.32666666666665\" cy=\"221.98833333333334\" r=\"3.6\" />\n        <circle cx=\"643.7633333333333\" cy=\"96.27666666666669\" r=\"3.6\" />\n        <circle cx=\"693.4583333333334\" cy=\"76.95500000000001\" r=\"3.6\" />\n        <circle cx=\"701.7585714285715\" cy=\"71.84285714285714\" r=\"3.6\" />\n        <circle cx=\"685.1916666666666\" cy=\"81.78833333333334\" r=\"3.6\" />\n        <circle cx=\"676.91\" cy=\"86.60666666666667\" r=\"3.6\" />\n        <circle cx=\"610.5533333333334\" cy=\"289.6666666666667\" r=\"3.6\" />\n        <circle cx=\"618.92\" cy=\"313.83\" r=\"3.6\" />\n        <circle cx=\"610.595\" cy=\"328.3433333333333\" r=\"3.6\" />\n        <circle cx=\"577.44\" cy=\"337.99833333333333\" r=\"3.6\" />\n        <circle cx=\"610.575\" cy=\"309.005\" r=\"3.6\" />\n        <circle cx=\"610.595\" cy=\"318.67333333333335\" r=\"3.6\" />\n        <circle cx=\"577.4499999999999\" cy=\"347.6666666666667\" r=\"3.6\" />\n        <circle cx=\"594.0516666666667\" cy=\"347.6683333333333\" r=\"3.6\" />\n        <circle cx=\"594.0416666666667\" cy=\"337.99833333333333\" r=\"3.6\" />\n        <circle cx=\"495.34666666666664\" cy=\"231.6583333333333\" r=\"3.6\" />\n        <circle cx=\"610.5533333333334\" cy=\"299.33666666666664\" r=\"3.6\" />\n        <circle cx=\"643.895\" cy=\"250.97666666666666\" r=\"3.6\" />\n        <circle cx=\"627.2399999999999\" cy=\"260.6466666666667\" r=\"3.6\" />\n        <circle cx=\"635.5366666666667\" cy=\"255.81000000000003\" r=\"3.6\" />\n        <circle cx=\"643.7833333333333\" cy=\"231.645\" r=\"3.6\" />\n        <circle cx=\"784.8016666666666\" cy=\"72.125\" r=\"3.6\" />\n        <circle cx=\"618.935\" cy=\"265.485\" r=\"3.6\" />\n        <circle cx=\"610.5533333333334\" cy=\"279.99666666666667\" r=\"3.6\" />\n        <circle cx=\"610.5866666666667\" cy=\"270.32666666666665\" r=\"3.6\" />\n        <circle cx=\"602.335\" cy=\"333.17333333333335\" r=\"3.6\" />\n        <circle cx=\"569.15\" cy=\"333.17333333333335\" r=\"3.6\" />\n        <circle cx=\"545.035\" cy=\"241.32375\" r=\"3.6\" />\n        <circle cx=\"536.865\" cy=\"236.48666666666665\" r=\"3.6\" />\n        <circle cx=\"552.5133333333334\" cy=\"246.15666666666667\" r=\"3.6\" />\n        <circle cx=\"511.915\" cy=\"231.67\" r=\"3.6\" />\n        <circle cx=\"503.6499999999999\" cy=\"236.50833333333333\" r=\"3.6\" />\n        <circle cx=\"520.245\" cy=\"226.83833333333334\" r=\"3.6\" />\n        <circle cx=\"560.825\" cy=\"250.99333333333334\" r=\"3.6\" />\n        <circle cx=\"528.5500000000001\" cy=\"231.65833333333333\" r=\"3.6\" />\n        <circle cx=\"536.845\" cy=\"226.82000000000002\" r=\"3.6\" />\n        <circle cx=\"577.4399999999999\" cy=\"318.65833333333336\" r=\"3.6\" />\n        <circle cx=\"577.4399999999999\" cy=\"328.3283333333333\" r=\"3.6\" />\n        <circle cx=\"560.825\" cy=\"260.66333333333336\" r=\"3.6\" />\n        <circle cx=\"577.4\" cy=\"299.3233333333333\" r=\"3.6\" />\n        <circle cx=\"577.4\" cy=\"289.6566666666667\" r=\"3.6\" />\n        <circle cx=\"569.1216666666668\" cy=\"275.17\" r=\"3.6\" />\n        <circle cx=\"577.4\" cy=\"279.9866666666666\" r=\"3.6\" />\n        <circle cx=\"577.42\" cy=\"308.9883333333333\" r=\"3.6\" />\n        <circle cx=\"643.8133333333334\" cy=\"202.63666666666666\" r=\"3.6\" />\n        <circle cx=\"793.0883333333335\" cy=\"76.965\" r=\"3.6\" />\n        <circle cx=\"627.2399999999999\" cy=\"250.97833333333332\" r=\"3.6\" />\n        <circle cx=\"635.475\" cy=\"207.46666666666667\" r=\"3.6\" />\n        <circle cx=\"635.475\" cy=\"217.13333333333335\" r=\"3.6\" />\n        <circle cx=\"602.3333333333334\" cy=\"265.50166666666667\" r=\"3.6\" />\n        <circle cx=\"618.9499999999999\" cy=\"255.82333333333335\" r=\"3.6\" />\n        <circle cx=\"602.3016666666666\" cy=\"275.1566666666667\" r=\"3.6\" />\n        <circle cx=\"602.2916666666666\" cy=\"284.83166666666665\" r=\"3.6\" />\n        <circle cx=\"610.61\" cy=\"260.66333333333336\" r=\"3.6\" />\n        <circle cx=\"668.625\" cy=\"168.79\" r=\"3.6\" />\n        <circle cx=\"676.94\" cy=\"163.95833333333334\" r=\"3.6\" />\n        <circle cx=\"685.2233333333334\" cy=\"159.13833333333335\" r=\"3.6\" />\n        <circle cx=\"652.0716666666667\" cy=\"197.81000000000003\" r=\"3.6\" />\n        <circle cx=\"693.4899999999999\" cy=\"154.305\" r=\"3.6\" />\n        <circle cx=\"660.4033333333333\" cy=\"192.96333333333334\" r=\"3.6\" />\n        <circle cx=\"660.3783333333334\" cy=\"183.3033333333333\" r=\"3.6\" />\n        <circle cx=\"660.3683333333333\" cy=\"173.6266666666667\" r=\"3.6\" />\n        <circle cx=\"569.165\" cy=\"246.15333333333334\" r=\"3.6\" />\n        <circle cx=\"585.6949999999999\" cy=\"284.81666666666666\" r=\"3.6\" />\n        <circle cx=\"569.1516666666665\" cy=\"265.485\" r=\"3.6\" />\n        <circle cx=\"577.425\" cy=\"270.32\" r=\"3.6\" />\n        <circle cx=\"585.6949999999999\" cy=\"275.1466666666667\" r=\"3.6\" />\n        <circle cx=\"569.1649999999998\" cy=\"255.82333333333335\" r=\"3.6\" />\n        <circle cx=\"544.6685714285715\" cy=\"231.9285714285714\" r=\"3.6\" />\n        <circle cx=\"701.7900000000001\" cy=\"149.19285714285715\" r=\"3.6\" />\n        <circle cx=\"552.5033333333334\" cy=\"236.49166666666667\" r=\"3.6\" />\n        <circle cx=\"560.825\" cy=\"241.32333333333335\" r=\"3.6\" />\n        <circle cx=\"602.3233333333334\" cy=\"313.8433333333333\" r=\"3.6\" />\n        <circle cx=\"602.335\" cy=\"323.50333333333333\" r=\"3.6\" />\n        <circle cx=\"594.0416666666666\" cy=\"328.3283333333333\" r=\"3.6\" />\n        <circle cx=\"602.2916666666666\" cy=\"294.50166666666667\" r=\"3.6\" />\n        <circle cx=\"602.3016666666666\" cy=\"304.165\" r=\"3.6\" />\n        <circle cx=\"585.6949999999999\" cy=\"294.4866666666666\" r=\"3.6\" />\n        <circle cx=\"585.7183333333334\" cy=\"304.155\" r=\"3.6\" />\n        <circle cx=\"585.74\" cy=\"323.49333333333334\" r=\"3.6\" />\n        <circle cx=\"585.74\" cy=\"313.8233333333333\" r=\"3.6\" />\n        <circle cx=\"635.5666666666667\" cy=\"246.12666666666664\" r=\"3.6\" />\n        <circle cx=\"867.875\" cy=\"101.12333333333333\" r=\"3.6\" />\n        <circle cx=\"709.7887499999999\" cy=\"144.63375000000002\" r=\"3.6\" />\n        <circle cx=\"867.87\" cy=\"110.79333333333334\" r=\"3.6\" />\n        <circle cx=\"876.1816666666667\" cy=\"76.97166666666668\" r=\"3.6\" />\n        <circle cx=\"867.8750000000001\" cy=\"81.78666666666668\" r=\"3.6\" />\n        <circle cx=\"859.57\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"851.2866666666667\" cy=\"149.48666666666668\" r=\"3.6\" />\n        <circle cx=\"859.57\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"842.9583333333334\" cy=\"154.315\" r=\"3.6\" />\n        <circle cx=\"867.8650000000001\" cy=\"120.46333333333332\" r=\"3.6\" />\n        <circle cx=\"818.0366666666667\" cy=\"81.78666666666668\" r=\"3.6\" />\n        <circle cx=\"826.3466666666667\" cy=\"76.95666666666668\" r=\"3.6\" />\n        <circle cx=\"809.7199999999999\" cy=\"76.95666666666668\" r=\"3.6\" />\n        <circle cx=\"801.4150000000001\" cy=\"72.13666666666667\" r=\"3.6\" />\n        <circle cx=\"834.6500000000001\" cy=\"81.80833333333334\" r=\"3.6\" />\n        <circle cx=\"851.2766666666668\" cy=\"81.79666666666667\" r=\"3.6\" />\n        <circle cx=\"859.56\" cy=\"76.95666666666668\" r=\"3.6\" />\n        <circle cx=\"842.9250000000001\" cy=\"76.965\" r=\"3.6\" />\n        <circle cx=\"876.2066666666666\" cy=\"96.27333333333333\" r=\"3.6\" />\n        <circle cx=\"751.6633333333333\" cy=\"168.82166666666666\" r=\"3.6\" />\n        <circle cx=\"776.5699999999998\" cy=\"163.97666666666666\" r=\"3.6\" />\n        <circle cx=\"842.98\" cy=\"163.98666666666668\" r=\"3.6\" />\n        <circle cx=\"768.255\" cy=\"168.80666666666667\" r=\"3.6\" />\n        <circle cx=\"759.9583333333334\" cy=\"173.64333333333332\" r=\"3.6\" />\n        <circle cx=\"718.4483333333333\" cy=\"149.465\" r=\"3.6\" />\n        <circle cx=\"726.7516666666667\" cy=\"154.30833333333334\" r=\"3.6\" />\n        <circle cx=\"735.055\" cy=\"159.15833333333333\" r=\"3.6\" />\n        <circle cx=\"743.3250000000002\" cy=\"163.98666666666668\" r=\"3.6\" />\n        <circle cx=\"834.69\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"826.4\" cy=\"173.64333333333332\" r=\"3.6\" />\n        <circle cx=\"842.98\" cy=\"173.65666666666667\" r=\"3.6\" />\n        <circle cx=\"784.8533333333334\" cy=\"159.15833333333333\" r=\"3.6\" />\n        <circle cx=\"818.07\" cy=\"168.80666666666667\" r=\"3.6\" />\n        <circle cx=\"793.14\" cy=\"163.98666666666668\" r=\"3.6\" />\n        <circle cx=\"809.7700000000001\" cy=\"163.97666666666666\" r=\"3.6\" />\n        <circle cx=\"801.4699999999999\" cy=\"159.14666666666668\" r=\"3.6\" />\n        <circle cx=\"710.147142857143\" cy=\"115.89999999999999\" r=\"3.6\" />\n        <circle cx=\"743.295\" cy=\"105.97333333333334\" r=\"3.6\" />\n        <circle cx=\"735.035\" cy=\"101.13666666666666\" r=\"3.6\" />\n        <circle cx=\"726.7416666666667\" cy=\"105.95833333333333\" r=\"3.6\" />\n        <circle cx=\"718.4333333333333\" cy=\"110.79333333333334\" r=\"3.6\" />\n        <circle cx=\"759.9250000000001\" cy=\"105.95833333333333\" r=\"3.6\" />\n        <circle cx=\"776.5333333333333\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"768.2199999999999\" cy=\"110.79333333333334\" r=\"3.6\" />\n        <circle cx=\"709.7987499999999\" cy=\"105.9575\" r=\"3.6\" />\n        <circle cx=\"751.6300000000001\" cy=\"101.13666666666666\" r=\"3.6\" />\n        <circle cx=\"676.9\" cy=\"125.28333333333335\" r=\"3.6\" />\n        <circle cx=\"618.855\" cy=\"149.47\" r=\"3.6\" />\n        <circle cx=\"602.3083333333333\" cy=\"207.48166666666665\" r=\"3.6\" />\n        <circle cx=\"618.92\" cy=\"207.48333333333335\" r=\"3.6\" />\n        <circle cx=\"594.015\" cy=\"202.63666666666666\" r=\"3.6\" />\n        <circle cx=\"685.1966666666666\" cy=\"120.46\" r=\"3.6\" />\n        <circle cx=\"693.475\" cy=\"115.62666666666667\" r=\"3.6\" />\n        <circle cx=\"701.7971428571428\" cy=\"110.51857142857143\" r=\"3.6\" />\n        <circle cx=\"784.8299999999999\" cy=\"110.80499999999999\" r=\"3.6\" />\n        <circle cx=\"826.3800000000001\" cy=\"154.30666666666667\" r=\"3.6\" />\n        <circle cx=\"776.5299999999999\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"768.215\" cy=\"130.13000000000002\" r=\"3.6\" />\n        <circle cx=\"759.915\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"784.8249999999999\" cy=\"120.47166666666665\" r=\"3.6\" />\n        <circle cx=\"751.6199999999999\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"726.735\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"793.1033333333334\" cy=\"115.64333333333332\" r=\"3.6\" />\n        <circle cx=\"735.0266666666666\" cy=\"120.47166666666665\" r=\"3.6\" />\n        <circle cx=\"743.285\" cy=\"125.31333333333333\" r=\"3.6\" />\n        <circle cx=\"793.0966666666667\" cy=\"125.31333333333333\" r=\"3.6\" />\n        <circle cx=\"818.025\" cy=\"120.46333333333332\" r=\"3.6\" />\n        <circle cx=\"809.735\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"801.445\" cy=\"110.80166666666668\" r=\"3.6\" />\n        <circle cx=\"826.3616666666667\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"801.44\" cy=\"120.47499999999998\" r=\"3.6\" />\n        <circle cx=\"809.73\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"826.3566666666666\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"818.0250000000001\" cy=\"130.13000000000002\" r=\"3.6\" />\n        <circle cx=\"569.105\" cy=\"188.14499999999998\" r=\"3.6\" />\n        <circle cx=\"602.2916666666666\" cy=\"188.13833333333332\" r=\"3.6\" />\n        <circle cx=\"602.3033333333333\" cy=\"197.81499999999997\" r=\"3.6\" />\n        <circle cx=\"602.2716666666666\" cy=\"178.45333333333335\" r=\"3.6\" />\n        <circle cx=\"618.8266666666667\" cy=\"168.80333333333334\" r=\"3.6\" />\n        <circle cx=\"585.7149999999999\" cy=\"207.46666666666667\" r=\"3.6\" />\n        <circle cx=\"602.3083333333333\" cy=\"217.14999999999998\" r=\"3.6\" />\n        <circle cx=\"594.015\" cy=\"212.30333333333337\" r=\"3.6\" />\n        <circle cx=\"610.5966666666667\" cy=\"202.62833333333333\" r=\"3.6\" />\n        <circle cx=\"610.5666666666667\" cy=\"212.3166666666667\" r=\"3.6\" />\n        <circle cx=\"593.9216666666666\" cy=\"154.295\" r=\"3.6\" />\n        <circle cx=\"552.4683333333334\" cy=\"197.8166666666667\" r=\"3.6\" />\n        <circle cx=\"552.4583333333334\" cy=\"188.14166666666665\" r=\"3.6\" />\n        <circle cx=\"627.13\" cy=\"144.61333333333334\" r=\"3.6\" />\n        <circle cx=\"560.765\" cy=\"183.30666666666664\" r=\"3.6\" />\n        <circle cx=\"560.785\" cy=\"202.64666666666665\" r=\"3.6\" />\n        <circle cx=\"635.4250000000001\" cy=\"139.77833333333334\" r=\"3.6\" />\n        <circle cx=\"577.4\" cy=\"154.28666666666666\" r=\"3.6\" />\n        <circle cx=\"569.07\" cy=\"178.455\" r=\"3.6\" />\n        <circle cx=\"618.8466666666667\" cy=\"159.145\" r=\"3.6\" />\n        <circle cx=\"585.705\" cy=\"188.12666666666667\" r=\"3.6\" />\n        <circle cx=\"577.4150000000001\" cy=\"202.63666666666666\" r=\"3.6\" />\n        <circle cx=\"585.7233333333332\" cy=\"178.4383333333333\" r=\"3.6\" />\n        <circle cx=\"577.4033333333334\" cy=\"192.9666666666667\" r=\"3.6\" />\n        <circle cx=\"602.2316666666667\" cy=\"149.44333333333336\" r=\"3.6\" />\n        <circle cx=\"602.2566666666667\" cy=\"159.16166666666666\" r=\"3.6\" />\n        <circle cx=\"585.7149999999999\" cy=\"197.7966666666667\" r=\"3.6\" />\n        <circle cx=\"602.2033333333334\" cy=\"139.79000000000002\" r=\"3.6\" />\n        <circle cx=\"610.535\" cy=\"144.61666666666667\" r=\"3.6\" />\n        <circle cx=\"560.775\" cy=\"192.9766666666667\" r=\"3.6\" />\n        <circle cx=\"735.0316666666666\" cy=\"110.80499999999999\" r=\"3.6\" />\n        <circle cx=\"569.115\" cy=\"197.80833333333337\" r=\"3.6\" />\n        <circle cx=\"577.3933333333334\" cy=\"183.29666666666665\" r=\"3.6\" />\n        <circle cx=\"610.525\" cy=\"154.305\" r=\"3.6\" />\n        <circle cx=\"593.9933333333332\" cy=\"183.29666666666665\" r=\"3.6\" />\n        <circle cx=\"594.005\" cy=\"192.96666666666667\" r=\"3.6\" />\n        <circle cx=\"577.3950000000001\" cy=\"173.61666666666667\" r=\"3.6\" />\n        <circle cx=\"594.0416666666667\" cy=\"318.65833333333336\" r=\"3.6\" />\n        <circle cx=\"901.005\" cy=\"43.10166666666666\" r=\"3.6\" />\n        <circle cx=\"917.64\" cy=\"43.086666666666666\" r=\"3.6\" />\n        <circle cx=\"876.1350000000001\" cy=\"38.24333333333333\" r=\"3.6\" />\n        <circle cx=\"934.225\" cy=\"43.10666666666666\" r=\"3.6\" />\n        <circle cx=\"826.3083333333334\" cy=\"38.251666666666665\" r=\"3.6\" />\n        <circle cx=\"784.77\" cy=\"33.435\" r=\"3.6\" />\n        <circle cx=\"859.5400000000001\" cy=\"38.266666666666666\" r=\"3.6\" />\n        <circle cx=\"959.1383333333333\" cy=\"47.93666666666667\" r=\"3.6\" />\n        <circle cx=\"842.9149999999998\" cy=\"38.27\" r=\"3.6\" />\n        <circle cx=\"801.3650000000001\" cy=\"33.434999999999995\" r=\"3.6\" />\n        <circle cx=\"743.29\" cy=\"115.64333333333332\" r=\"3.6\" />\n        <circle cx=\"917.62\" cy=\"52.77666666666667\" r=\"3.6\" />\n        <circle cx=\"934.23\" cy=\"52.79333333333333\" r=\"3.6\" />\n        <circle cx=\"909.3216666666667\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"942.5050000000001\" cy=\"57.629999999999995\" r=\"3.6\" />\n        <circle cx=\"942.5050000000001\" cy=\"67.29666666666667\" r=\"3.6\" />\n        <circle cx=\"934.23\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"950.8449999999999\" cy=\"52.79333333333332\" r=\"3.6\" />\n        <circle cx=\"901.0750000000002\" cy=\"159.165\" r=\"3.6\" />\n        <circle cx=\"751.5450000000001\" cy=\"23.76166666666667\" r=\"3.6\" />\n        <circle cx=\"503.60166666666674\" cy=\"275.19\" r=\"3.6\" />\n        <circle cx=\"793.1816666666665\" cy=\"212.35833333333335\" r=\"3.6\" />\n        <circle cx=\"569.16\" cy=\"420.2\" r=\"3.6\" />\n        <circle cx=\"768.3649999999999\" cy=\"265.5\" r=\"3.6\" />\n        <circle cx=\"950.8699999999999\" cy=\"101.15833333333335\" r=\"3.6\" />\n        <circle cx=\"975.7583333333332\" cy=\"57.63166666666667\" r=\"3.6\" />\n        <circle cx=\"842.995\" cy=\"309.0416666666667\" r=\"3.6\" />\n        <circle cx=\"892.7533333333332\" cy=\"135.00166666666667\" r=\"3.6\" />\n        <circle cx=\"585.8216666666666\" cy=\"420.20666666666665\" r=\"3.6\" />\n        <circle cx=\"660.2750000000001\" cy=\"47.905\" r=\"3.6\" />\n        <circle cx=\"710.1014285714285\" cy=\"28.874285714285715\" r=\"3.6\" />\n        <circle cx=\"487.01499999999993\" cy=\"275.18833333333333\" r=\"3.6\" />\n        <circle cx=\"734.9583333333334\" cy=\"23.763333333333335\" r=\"3.6\" />\n        <circle cx=\"676.8283333333334\" cy=\"38.25\" r=\"3.6\" />\n        <circle cx=\"577.3216666666666\" cy=\"38.25166666666667\" r=\"3.6\" />\n        <circle cx=\"635.425\" cy=\"52.741666666666674\" r=\"3.6\" />\n        <circle cx=\"610.495\" cy=\"47.92166666666666\" r=\"3.6\" />\n        <circle cx=\"925.9366666666666\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"594.0183333333333\" cy=\"308.9883333333333\" r=\"3.6\" />\n        <circle cx=\"569.12\" cy=\"207.48166666666665\" r=\"3.6\" />\n        <circle cx=\"593.9983333333333\" cy=\"299.3233333333333\" r=\"3.6\" />\n        <circle cx=\"585.75\" cy=\"342.83\" r=\"3.6\" />\n        <circle cx=\"593.9983333333333\" cy=\"279.9866666666666\" r=\"3.6\" />\n        <circle cx=\"503.62999999999994\" cy=\"226.82666666666663\" r=\"3.6\" />\n        <circle cx=\"511.895\" cy=\"222.0033333333333\" r=\"3.6\" />\n        <circle cx=\"876.23\" cy=\"86.62\" r=\"3.6\" />\n        <circle cx=\"867.8750000000001\" cy=\"91.45333333333333\" r=\"3.6\" />\n        <circle cx=\"593.9983333333333\" cy=\"289.6566666666667\" r=\"3.6\" />\n        <circle cx=\"751.6233333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n        <circle cx=\"759.9200000000001\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"594.0266666666668\" cy=\"270.31666666666666\" r=\"3.6\" />\n        <circle cx=\"751.6283333333334\" cy=\"110.80166666666668\" r=\"3.6\" />\n        <circle cx=\"768.215\" cy=\"120.46333333333332\" r=\"3.6\" />\n        <circle cx=\"834.6566666666666\" cy=\"110.80499999999999\" r=\"3.6\" />\n        <circle cx=\"842.9466666666667\" cy=\"105.97333333333331\" r=\"3.6\" />\n        <circle cx=\"759.915\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"585.74\" cy=\"333.16333333333336\" r=\"3.6\" />\n        <circle cx=\"826.415\" cy=\"260.655\" r=\"3.6\" />\n        <circle cx=\"909.3666666666667\" cy=\"76.95333333333333\" r=\"3.6\" />\n        <circle cx=\"826.4000000000001\" cy=\"241.32666666666663\" r=\"3.6\" />\n        <circle cx=\"826.41\" cy=\"251.0016666666667\" r=\"3.6\" />\n        <circle cx=\"843.045\" cy=\"280.0133333333334\" r=\"3.6\" />\n        <circle cx=\"760.04\" cy=\"241.32666666666668\" r=\"3.6\" />\n        <circle cx=\"759.9783333333334\" cy=\"221.98833333333332\" r=\"3.6\" />\n        <circle cx=\"760.0099999999999\" cy=\"231.66166666666666\" r=\"3.6\" />\n        <circle cx=\"834.7516666666667\" cy=\"246.1716666666667\" r=\"3.6\" />\n        <circle cx=\"560.8000000000001\" cy=\"270.3266666666667\" r=\"3.6\" />\n        <circle cx=\"585.76\" cy=\"362.1666666666667\" r=\"3.6\" />\n        <circle cx=\"585.76\" cy=\"352.49666666666667\" r=\"3.6\" />\n        <circle cx=\"859.5799999999999\" cy=\"144.64333333333335\" r=\"3.6\" />\n        <circle cx=\"834.7416666666667\" cy=\"236.50833333333333\" r=\"3.6\" />\n        <circle cx=\"834.7216666666667\" cy=\"226.82666666666663\" r=\"3.6\" />\n        <circle cx=\"552.5133333333334\" cy=\"265.49666666666667\" r=\"3.6\" />\n        <circle cx=\"478.73333333333335\" cy=\"231.65833333333333\" r=\"3.6\" />\n        <circle cx=\"668.585\" cy=\"130.11333333333332\" r=\"3.6\" />\n        <circle cx=\"577.3583333333332\" cy=\"115.61666666666666\" r=\"3.6\" />\n        <circle cx=\"577.3533333333332\" cy=\"125.28333333333332\" r=\"3.6\" />\n        <circle cx=\"569\" cy=\"139.79333333333332\" r=\"3.6\" />\n        <circle cx=\"577.3616666666667\" cy=\"105.94666666666666\" r=\"3.6\" />\n        <circle cx=\"577.3533333333332\" cy=\"134.94833333333335\" r=\"3.6\" />\n        <circle cx=\"610.5416666666666\" cy=\"115.64499999999998\" r=\"3.6\" />\n        <circle cx=\"602.2483333333333\" cy=\"120.46\" r=\"3.6\" />\n        <circle cx=\"627.1233333333333\" cy=\"125.28000000000002\" r=\"3.6\" />\n        <circle cx=\"593.9549999999999\" cy=\"115.61666666666667\" r=\"3.6\" />\n        <circle cx=\"585.6566666666666\" cy=\"110.77666666666669\" r=\"3.6\" />\n        <circle cx=\"536.825\" cy=\"207.48333333333335\" r=\"3.6\" />\n        <circle cx=\"544.995\" cy=\"212.31625\" r=\"3.6\" />\n        <circle cx=\"536.825\" cy=\"197.81333333333336\" r=\"3.6\" />\n        <circle cx=\"552.4733333333334\" cy=\"217.15333333333334\" r=\"3.6\" />\n        <circle cx=\"536.855\" cy=\"159.13000000000002\" r=\"3.6\" />\n        <circle cx=\"536.835\" cy=\"168.78833333333333\" r=\"3.6\" />\n        <circle cx=\"536.815\" cy=\"188.14499999999998\" r=\"3.6\" />\n        <circle cx=\"536.8050000000001\" cy=\"178.47333333333333\" r=\"3.6\" />\n        <circle cx=\"709.7987499999999\" cy=\"96.2875\" r=\"3.6\" />\n        <circle cx=\"735.035\" cy=\"91.46999999999998\" r=\"3.6\" />\n        <circle cx=\"743.295\" cy=\"96.30666666666667\" r=\"3.6\" />\n        <circle cx=\"726.7416666666667\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"560.785\" cy=\"221.98666666666665\" r=\"3.6\" />\n        <circle cx=\"718.44\" cy=\"101.12333333333333\" r=\"3.6\" />\n        <circle cx=\"768.225\" cy=\"101.12333333333333\" r=\"3.6\" />\n        <circle cx=\"635.4350000000001\" cy=\"120.44666666666667\" r=\"3.6\" />\n        <circle cx=\"776.54\" cy=\"105.95833333333333\" r=\"3.6\" />\n        <circle cx=\"759.9250000000001\" cy=\"96.29\" r=\"3.6\" />\n        <circle cx=\"751.6300000000001\" cy=\"91.47000000000001\" r=\"3.6\" />\n        <circle cx=\"660.3316666666666\" cy=\"115.61666666666666\" r=\"3.6\" />\n        <circle cx=\"652.0083333333333\" cy=\"120.46\" r=\"3.6\" />\n        <circle cx=\"643.7533333333333\" cy=\"125.28333333333335\" r=\"3.6\" />\n        <circle cx=\"668.585\" cy=\"120.44666666666667\" r=\"3.6\" />\n        <circle cx=\"676.9066666666666\" cy=\"115.61666666666667\" r=\"3.6\" />\n        <circle cx=\"693.48\" cy=\"105.95666666666666\" r=\"3.6\" />\n        <circle cx=\"702.1487500000001\" cy=\"101.12375\" r=\"3.6\" />\n        <circle cx=\"685.2016666666667\" cy=\"110.79166666666667\" r=\"3.6\" />\n        <circle cx=\"660.3466666666667\" cy=\"154.28833333333333\" r=\"3.6\" />\n        <circle cx=\"726.7283333333334\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"735.025\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"743.285\" cy=\"144.65\" r=\"3.6\" />\n        <circle cx=\"718.4266666666666\" cy=\"130.13000000000002\" r=\"3.6\" />\n        <circle cx=\"709.7887499999999\" cy=\"125.29625\" r=\"3.6\" />\n        <circle cx=\"751.6300000000001\" cy=\"149.48666666666668\" r=\"3.6\" />\n        <circle cx=\"693.4699999999999\" cy=\"134.96333333333334\" r=\"3.6\" />\n        <circle cx=\"685.1933333333333\" cy=\"139.79333333333332\" r=\"3.6\" />\n        <circle cx=\"569.13\" cy=\"226.82333333333335\" r=\"3.6\" />\n        <circle cx=\"793.0966666666667\" cy=\"144.65\" r=\"3.6\" />\n        <circle cx=\"801.4366666666666\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"676.9000000000001\" cy=\"144.61833333333334\" r=\"3.6\" />\n        <circle cx=\"809.73\" cy=\"144.63666666666668\" r=\"3.6\" />\n        <circle cx=\"818.0483333333332\" cy=\"149.465\" r=\"3.6\" />\n        <circle cx=\"776.5299999999999\" cy=\"144.63666666666668\" r=\"3.6\" />\n        <circle cx=\"768.235\" cy=\"149.465\" r=\"3.6\" />\n        <circle cx=\"759.9366666666666\" cy=\"154.30666666666667\" r=\"3.6\" />\n        <circle cx=\"784.8216666666667\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"702.13875\" cy=\"130.13\" r=\"3.6\" />\n        <circle cx=\"585.755\" cy=\"255.80999999999997\" r=\"3.6\" />\n        <circle cx=\"668.605\" cy=\"149.45499999999998\" r=\"3.6\" />\n        <circle cx=\"602.3483333333334\" cy=\"246.1533333333333\" r=\"3.6\" />\n        <circle cx=\"618.9399999999999\" cy=\"236.47666666666666\" r=\"3.6\" />\n        <circle cx=\"610.61\" cy=\"241.32333333333335\" r=\"3.6\" />\n        <circle cx=\"577.4366666666666\" cy=\"231.63833333333335\" r=\"3.6\" />\n        <circle cx=\"585.755\" cy=\"246.1433333333333\" r=\"3.6\" />\n        <circle cx=\"585.755\" cy=\"236.47333333333333\" r=\"3.6\" />\n        <circle cx=\"594.055\" cy=\"250.97833333333332\" r=\"3.6\" />\n        <circle cx=\"643.7933333333333\" cy=\"173.6266666666667\" r=\"3.6\" />\n        <circle cx=\"643.7933333333333\" cy=\"163.95833333333334\" r=\"3.6\" />\n        <circle cx=\"652.0516666666666\" cy=\"159.13000000000002\" r=\"3.6\" />\n        <circle cx=\"784.8316666666666\" cy=\"101.13666666666666\" r=\"3.6\" />\n        <circle cx=\"635.485\" cy=\"188.12666666666667\" r=\"3.6\" />\n        <circle cx=\"627.185\" cy=\"192.97\" r=\"3.6\" />\n        <circle cx=\"643.7933333333333\" cy=\"183.29666666666665\" r=\"3.6\" />\n        <circle cx=\"627.25\" cy=\"231.63333333333333\" r=\"3.6\" />\n        <circle cx=\"643.7533333333333\" cy=\"134.94833333333335\" r=\"3.6\" />\n        <circle cx=\"544.97125\" cy=\"183.30749999999998\" r=\"3.6\" />\n        <circle cx=\"577.3566666666667\" cy=\"144.62666666666664\" r=\"3.6\" />\n        <circle cx=\"544.6214285714285\" cy=\"173.91428571428574\" r=\"3.6\" />\n        <circle cx=\"585.7133333333333\" cy=\"139.78333333333333\" r=\"3.6\" />\n        <circle cx=\"552.4616666666666\" cy=\"178.46833333333333\" r=\"3.6\" />\n        <circle cx=\"610.5566666666667\" cy=\"125.30166666666666\" r=\"3.6\" />\n        <circle cx=\"594.055\" cy=\"241.3083333333333\" r=\"3.6\" />\n        <circle cx=\"585.6533333333333\" cy=\"120.44666666666667\" r=\"3.6\" />\n        <circle cx=\"585.6833333333333\" cy=\"130.13166666666666\" r=\"3.6\" />\n        <circle cx=\"569.12\" cy=\"217.15\" r=\"3.6\" />\n        <circle cx=\"585.735\" cy=\"226.80499999999998\" r=\"3.6\" />\n        <circle cx=\"635.425\" cy=\"130.11999999999998\" r=\"3.6\" />\n        <circle cx=\"577.4150000000001\" cy=\"221.97\" r=\"3.6\" />\n        <circle cx=\"544.6357142857142\" cy=\"193.25142857142856\" r=\"3.6\" />\n        <circle cx=\"594.035\" cy=\"231.63833333333332\" r=\"3.6\" />\n        <circle cx=\"544.9950000000001\" cy=\"202.64625\" r=\"3.6\" />\n        <circle cx=\"560.785\" cy=\"212.3166666666667\" r=\"3.6\" />\n        <circle cx=\"552.4733333333334\" cy=\"207.48333333333332\" r=\"3.6\" />\n        <circle cx=\"593.975\" cy=\"125.29666666666668\" r=\"3.6\" />\n        <circle cx=\"618.92\" cy=\"217.15333333333334\" r=\"3.6\" />\n        <circle cx=\"627.18\" cy=\"173.62666666666667\" r=\"3.6\" />\n        <circle cx=\"610.5466666666666\" cy=\"183.30666666666664\" r=\"3.6\" />\n        <circle cx=\"577.4150000000001\" cy=\"212.30333333333337\" r=\"3.6\" />\n        <circle cx=\"610.5816666666666\" cy=\"192.99\" r=\"3.6\" />\n        <circle cx=\"594.015\" cy=\"221.97\" r=\"3.6\" />\n        <circle cx=\"585.7149999999999\" cy=\"217.13333333333333\" r=\"3.6\" />\n        <circle cx=\"602.3183333333335\" cy=\"226.8116666666667\" r=\"3.6\" />\n        <circle cx=\"610.5666666666667\" cy=\"221.98666666666665\" r=\"3.6\" />\n        <circle cx=\"618.8566666666667\" cy=\"178.455\" r=\"3.6\" />\n        <circle cx=\"652.0083333333333\" cy=\"139.79\" r=\"3.6\" />\n        <circle cx=\"660.3249999999999\" cy=\"125.28333333333335\" r=\"3.6\" />\n        <circle cx=\"660.325\" cy=\"134.94833333333335\" r=\"3.6\" />\n        <circle cx=\"627.18\" cy=\"163.95833333333334\" r=\"3.6\" />\n        <circle cx=\"652.0083333333333\" cy=\"130.12333333333333\" r=\"3.6\" />\n        <circle cx=\"627.16\" cy=\"154.28833333333333\" r=\"3.6\" />\n        <circle cx=\"635.455\" cy=\"149.45499999999998\" r=\"3.6\" />\n        <circle cx=\"643.7533333333333\" cy=\"144.61833333333334\" r=\"3.6\" />\n        <circle cx=\"635.475\" cy=\"178.45666666666668\" r=\"3.6\" />\n        <circle cx=\"768.215\" cy=\"139.79666666666668\" r=\"3.6\" />\n        <circle cx=\"776.5299999999999\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"784.8216666666667\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"793.0966666666667\" cy=\"134.98333333333332\" r=\"3.6\" />\n        <circle cx=\"726.7283333333334\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"743.285\" cy=\"134.98333333333332\" r=\"3.6\" />\n        <circle cx=\"735.025\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"751.6199999999999\" cy=\"139.81333333333333\" r=\"3.6\" />\n        <circle cx=\"759.915\" cy=\"144.63666666666668\" r=\"3.6\" />\n        <circle cx=\"801.4366666666666\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"818.0299999999999\" cy=\"110.79333333333334\" r=\"3.6\" />\n        <circle cx=\"602.3383333333335\" cy=\"236.48833333333332\" r=\"3.6\" />\n        <circle cx=\"826.3683333333333\" cy=\"105.95833333333333\" r=\"3.6\" />\n        <circle cx=\"801.4483333333333\" cy=\"101.13666666666666\" r=\"3.6\" />\n        <circle cx=\"826.3566666666666\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"834.65\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"818.0250000000001\" cy=\"139.79666666666668\" r=\"3.6\" />\n        <circle cx=\"809.73\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"834.6533333333333\" cy=\"120.47166666666668\" r=\"3.6\" />\n        <circle cx=\"718.4266666666666\" cy=\"120.46333333333332\" r=\"3.6\" />\n        <circle cx=\"627.18\" cy=\"183.2966666666667\" r=\"3.6\" />\n        <circle cx=\"793.11\" cy=\"105.97333333333334\" r=\"3.6\" />\n        <circle cx=\"635.475\" cy=\"159.12333333333333\" r=\"3.6\" />\n        <circle cx=\"610.5883333333334\" cy=\"231.655\" r=\"3.6\" />\n        <circle cx=\"643.7733333333333\" cy=\"154.28833333333333\" r=\"3.6\" />\n        <circle cx=\"618.92\" cy=\"226.82000000000002\" r=\"3.6\" />\n        <circle cx=\"618.8916666666667\" cy=\"188.145\" r=\"3.6\" />\n        <circle cx=\"635.475\" cy=\"168.79\" r=\"3.6\" />\n        <circle cx=\"693.4699999999999\" cy=\"125.29666666666667\" r=\"3.6\" />\n        <circle cx=\"652.0300000000001\" cy=\"149.46166666666667\" r=\"3.6\" />\n        <circle cx=\"643.7833333333333\" cy=\"221.98666666666665\" r=\"3.6\" />\n        <circle cx=\"685.1933333333333\" cy=\"130.1266666666667\" r=\"3.6\" />\n        <circle cx=\"702.14\" cy=\"120.46374999999999\" r=\"3.6\" />\n        <circle cx=\"676.9000000000001\" cy=\"134.94833333333335\" r=\"3.6\" />\n        <circle cx=\"660.325\" cy=\"144.61833333333334\" r=\"3.6\" />\n        <circle cx=\"668.585\" cy=\"139.78333333333333\" r=\"3.6\" />\n        <circle cx=\"809.7400000000001\" cy=\"105.95833333333333\" r=\"3.6\" />\n        <circle cx=\"544.9325\" cy=\"289.66625\" r=\"3.6\" />\n        <circle cx=\"544.9549999999999\" cy=\"280.01\" r=\"3.6\" />\n        <circle cx=\"552.455\" cy=\"294.50333333333333\" r=\"3.6\" />\n        <circle cx=\"552.465\" cy=\"304.1683333333333\" r=\"3.6\" />\n        <circle cx=\"544.6414285714287\" cy=\"270.6114285714286\" r=\"3.6\" />\n        <circle cx=\"552.0157142857142\" cy=\"313.57142857142856\" r=\"3.6\" />\n        <circle cx=\"520.275\" cy=\"255.84166666666667\" r=\"3.6\" />\n        <circle cx=\"528.57\" cy=\"260.6666666666667\" r=\"3.6\" />\n        <circle cx=\"536.84\" cy=\"265.49333333333334\" r=\"3.6\" />\n        <circle cx=\"511.9350000000001\" cy=\"260.6766666666667\" r=\"3.6\" />\n        <circle cx=\"569.2100000000002\" cy=\"400.8566666666666\" r=\"3.6\" />\n        <circle cx=\"569.1800000000002\" cy=\"381.5266666666667\" r=\"3.6\" />\n        <circle cx=\"569.1999999999999\" cy=\"391.185\" r=\"3.6\" />\n        <circle cx=\"560.8516666666668\" cy=\"396.02666666666664\" r=\"3.6\" />\n        <circle cx=\"560.83\" cy=\"367.01666666666665\" r=\"3.6\" />\n        <circle cx=\"544.6342857142856\" cy=\"347.95714285714286\" r=\"3.6\" />\n        <circle cx=\"552.0414285714287\" cy=\"352.79\" r=\"3.6\" />\n        <circle cx=\"503.5566666666667\" cy=\"139.81333333333336\" r=\"3.6\" />\n        <circle cx=\"560.82\" cy=\"376.6916666666666\" r=\"3.6\" />\n        <circle cx=\"478.71000000000004\" cy=\"202.64833333333334\" r=\"3.6\" />\n        <circle cx=\"503.6466666666667\" cy=\"265.5183333333334\" r=\"3.6\" />\n        <circle cx=\"487\" cy=\"188.14499999999998\" r=\"3.6\" />\n        <circle cx=\"470.42\" cy=\"207.49333333333334\" r=\"3.6\" />\n        <circle cx=\"495.2716666666666\" cy=\"154.33333333333334\" r=\"3.6\" />\n        <circle cx=\"495.2633333333333\" cy=\"144.63666666666666\" r=\"3.6\" />\n        <circle cx=\"470.42\" cy=\"217.16333333333333\" r=\"3.6\" />\n        <circle cx=\"486.98\" cy=\"178.46833333333333\" r=\"3.6\" />\n        <circle cx=\"487\" cy=\"168.78833333333333\" r=\"3.6\" />\n        <circle cx=\"478.695\" cy=\"192.9766666666667\" r=\"3.6\" />\n        <circle cx=\"478.75333333333333\" cy=\"260.6666666666667\" r=\"3.6\" />\n        <circle cx=\"487.0266666666667\" cy=\"265.49333333333334\" r=\"3.6\" />\n        <circle cx=\"495.36666666666673\" cy=\"260.6666666666667\" r=\"3.6\" />\n        <circle cx=\"470.43\" cy=\"226.83833333333334\" r=\"3.6\" />\n        <circle cx=\"470.43000000000006\" cy=\"255.86\" r=\"3.6\" />\n        <circle cx=\"462.09\" cy=\"231.665\" r=\"3.6\" />\n        <circle cx=\"462.11999999999995\" cy=\"241.33666666666662\" r=\"3.6\" />\n        <circle cx=\"470.46000000000004\" cy=\"246.17166666666665\" r=\"3.6\" />\n        <circle cx=\"552.5166666666668\" cy=\"362.18333333333334\" r=\"3.6\" />\n        <circle cx=\"718.48\" cy=\"188.14499999999998\" r=\"3.6\" />\n        <circle cx=\"660.4000000000001\" cy=\"260.63000000000005\" r=\"3.6\" />\n        <circle cx=\"685.2483333333333\" cy=\"207.46666666666667\" r=\"3.6\" />\n        <circle cx=\"709.8325\" cy=\"183.3075\" r=\"3.6\" />\n        <circle cx=\"693.505\" cy=\"192.98499999999999\" r=\"3.6\" />\n        <circle cx=\"668.715\" cy=\"236.49166666666665\" r=\"3.6\" />\n        <circle cx=\"685.265\" cy=\"217.155\" r=\"3.6\" />\n        <circle cx=\"668.665\" cy=\"226.80499999999998\" r=\"3.6\" />\n        <circle cx=\"676.9633333333334\" cy=\"221.97\" r=\"3.6\" />\n        <circle cx=\"701.83\" cy=\"187.87000000000003\" r=\"3.6\" />\n        <circle cx=\"751.685\" cy=\"236.51333333333332\" r=\"3.6\" />\n        <circle cx=\"743.335\" cy=\"222.01\" r=\"3.6\" />\n        <circle cx=\"751.695\" cy=\"226.83833333333334\" r=\"3.6\" />\n        <circle cx=\"751.6650000000001\" cy=\"246.17166666666665\" r=\"3.6\" />\n        <circle cx=\"726.7616666666667\" cy=\"202.665\" r=\"3.6\" />\n        <circle cx=\"743.3449999999999\" cy=\"212.33333333333334\" r=\"3.6\" />\n        <circle cx=\"726.7816666666668\" cy=\"192.97833333333335\" r=\"3.6\" />\n        <circle cx=\"735.085\" cy=\"207.4933333333333\" r=\"3.6\" />\n        <circle cx=\"660.4050000000001\" cy=\"270.32500000000005\" r=\"3.6\" />\n        <circle cx=\"610.655\" cy=\"386.3666666666666\" r=\"3.6\" />\n        <circle cx=\"610.615\" cy=\"376.68666666666667\" r=\"3.6\" />\n        <circle cx=\"610.615\" cy=\"367.01666666666665\" r=\"3.6\" />\n        <circle cx=\"602.3850000000001\" cy=\"391.1966666666667\" r=\"3.6\" />\n        <circle cx=\"577.5016666666667\" cy=\"405.6783333333333\" r=\"3.6\" />\n        <circle cx=\"618.9633333333334\" cy=\"362.18666666666667\" r=\"3.6\" />\n        <circle cx=\"585.8000000000001\" cy=\"410.5133333333333\" r=\"3.6\" />\n        <circle cx=\"594.1016666666667\" cy=\"396.0133333333333\" r=\"3.6\" />\n        <circle cx=\"569.18\" cy=\"410.54\" r=\"3.6\" />\n        <circle cx=\"594.125\" cy=\"405.6933333333333\" r=\"3.6\" />\n        <circle cx=\"635.4833333333332\" cy=\"284.81666666666666\" r=\"3.6\" />\n        <circle cx=\"643.7983333333333\" cy=\"279.9866666666666\" r=\"3.6\" />\n        <circle cx=\"635.5133333333332\" cy=\"294.50333333333333\" r=\"3.6\" />\n        <circle cx=\"652.0550000000001\" cy=\"275.16\" r=\"3.6\" />\n        <circle cx=\"635.59\" cy=\"342.82666666666665\" r=\"3.6\" />\n        <circle cx=\"635.5849999999999\" cy=\"333.16333333333336\" r=\"3.6\" />\n        <circle cx=\"627.2383333333333\" cy=\"347.6666666666667\" r=\"3.6\" />\n        <circle cx=\"618.9483333333334\" cy=\"352.51\" r=\"3.6\" />\n        <circle cx=\"826.42\" cy=\"212.3183333333333\" r=\"3.6\" />\n        <circle cx=\"892.6899999999999\" cy=\"57.63\" r=\"3.6\" />\n        <circle cx=\"884.4616666666666\" cy=\"139.8133333333333\" r=\"3.6\" />\n        <circle cx=\"901.0300000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n        <circle cx=\"884.43\" cy=\"52.79333333333333\" r=\"3.6\" />\n        <circle cx=\"909.3316666666666\" cy=\"67.29333333333334\" r=\"3.6\" />\n        <circle cx=\"901.0750000000002\" cy=\"101.135\" r=\"3.6\" />\n        <circle cx=\"892.7233333333334\" cy=\"125.31333333333332\" r=\"3.6\" />\n        <circle cx=\"892.7283333333334\" cy=\"115.64333333333333\" r=\"3.6\" />\n        <circle cx=\"901.0683333333333\" cy=\"110.80166666666668\" r=\"3.6\" />\n        <circle cx=\"876.1383333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"826.3250000000002\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"867.8350000000002\" cy=\"52.77666666666667\" r=\"3.6\" />\n        <circle cx=\"834.62\" cy=\"52.79333333333333\" r=\"3.6\" />\n        <circle cx=\"809.6999999999999\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"817.995\" cy=\"52.77666666666667\" r=\"3.6\" />\n        <circle cx=\"842.9049999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n        <circle cx=\"859.5400000000001\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"851.245\" cy=\"52.79333333333332\" r=\"3.6\" />\n        <circle cx=\"867.9166666666666\" cy=\"188.14499999999998\" r=\"3.6\" />\n        <circle cx=\"876.2599999999999\" cy=\"163.97333333333333\" r=\"3.6\" />\n        <circle cx=\"826.42\" cy=\"221.98833333333334\" r=\"3.6\" />\n        <circle cx=\"826.41\" cy=\"231.67499999999998\" r=\"3.6\" />\n        <circle cx=\"834.7566666666667\" cy=\"265.52\" r=\"3.6\" />\n        <circle cx=\"809.7800000000001\" cy=\"192.98000000000002\" r=\"3.6\" />\n        <circle cx=\"826.42\" cy=\"202.6483333333333\" r=\"3.6\" />\n        <circle cx=\"843.0300000000001\" cy=\"251.01166666666666\" r=\"3.6\" />\n        <circle cx=\"801.485\" cy=\"188.16\" r=\"3.6\" />\n        <circle cx=\"818.09\" cy=\"197.81333333333336\" r=\"3.6\" />\n        <circle cx=\"760.0400000000001\" cy=\"250.99666666666667\" r=\"3.6\" />\n        <circle cx=\"801.4000000000001\" cy=\"43.120000000000005\" r=\"3.6\" />\n        <circle cx=\"859.6199999999999\" cy=\"192.98000000000002\" r=\"3.6\" />\n        <circle cx=\"867.9066666666668\" cy=\"178.47333333333333\" r=\"3.6\" />\n        <circle cx=\"867.9066666666668\" cy=\"168.80666666666664\" r=\"3.6\" />\n        <circle cx=\"851.335\" cy=\"197.81999999999996\" r=\"3.6\" />\n        <circle cx=\"843.0500000000001\" cy=\"231.65166666666664\" r=\"3.6\" />\n        <circle cx=\"843.04\" cy=\"241.33666666666667\" r=\"3.6\" />\n        <circle cx=\"851.3400000000001\" cy=\"207.49333333333334\" r=\"3.6\" />\n        <circle cx=\"528.47\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"593.9216666666666\" cy=\"57.59833333333333\" r=\"3.6\" />\n        <circle cx=\"569.03\" cy=\"52.77333333333333\" r=\"3.6\" />\n        <circle cx=\"577.3216666666667\" cy=\"47.928333333333335\" r=\"3.6\" />\n        <circle cx=\"602.215\" cy=\"62.443333333333335\" r=\"3.6\" />\n        <circle cx=\"585.62\" cy=\"52.76333333333333\" r=\"3.6\" />\n        <circle cx=\"627.1083333333333\" cy=\"67.26833333333333\" r=\"3.6\" />\n        <circle cx=\"635.405\" cy=\"62.43333333333334\" r=\"3.6\" />\n        <circle cx=\"618.8149999999999\" cy=\"62.443333333333335\" r=\"3.6\" />\n        <circle cx=\"610.475\" cy=\"57.613333333333344\" r=\"3.6\" />\n        <circle cx=\"528.4599999999999\" cy=\"76.965\" r=\"3.6\" />\n        <circle cx=\"643.7233333333334\" cy=\"67.26833333333333\" r=\"3.6\" />\n        <circle cx=\"511.825\" cy=\"125.32000000000001\" r=\"3.6\" />\n        <circle cx=\"560.7233333333332\" cy=\"57.63166666666666\" r=\"3.6\" />\n        <circle cx=\"520.1733333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n        <circle cx=\"528.465\" cy=\"105.95333333333333\" r=\"3.6\" />\n        <circle cx=\"552.3866666666667\" cy=\"62.451666666666675\" r=\"3.6\" />\n        <circle cx=\"536.7516666666667\" cy=\"72.115\" r=\"3.6\" />\n        <circle cx=\"544.9012500000001\" cy=\"67.28375\" r=\"3.6\" />\n        <circle cx=\"718.3949999999999\" cy=\"43.10999999999999\" r=\"3.6\" />\n        <circle cx=\"751.5749999999999\" cy=\"33.45666666666667\" r=\"3.6\" />\n        <circle cx=\"743.2433333333333\" cy=\"38.29333333333334\" r=\"3.6\" />\n        <circle cx=\"734.9766666666666\" cy=\"33.45\" r=\"3.6\" />\n        <circle cx=\"759.8733333333333\" cy=\"38.276666666666664\" r=\"3.6\" />\n        <circle cx=\"768.1833333333334\" cy=\"43.10999999999999\" r=\"3.6\" />\n        <circle cx=\"784.785\" cy=\"43.12500000000001\" r=\"3.6\" />\n        <circle cx=\"726.6883333333334\" cy=\"38.27833333333333\" r=\"3.6\" />\n        <circle cx=\"776.4983333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"702.10375\" cy=\"43.1075\" r=\"3.6\" />\n        <circle cx=\"676.8683333333332\" cy=\"57.59833333333333\" r=\"3.6\" />\n        <circle cx=\"668.5533333333334\" cy=\"62.43333333333334\" r=\"3.6\" />\n        <circle cx=\"660.295\" cy=\"57.598333333333336\" r=\"3.6\" />\n        <circle cx=\"793.0649999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n        <circle cx=\"685.1616666666667\" cy=\"52.77333333333334\" r=\"3.6\" />\n        <circle cx=\"710.1085714285715\" cy=\"38.55142857142857\" r=\"3.6\" />\n        <circle cx=\"651.9783333333334\" cy=\"62.44\" r=\"3.6\" />\n        <circle cx=\"693.4366666666666\" cy=\"47.94333333333333\" r=\"3.6\" />\n        <circle cx=\"818.09\" cy=\"217.15333333333334\" r=\"3.6\" />\n        <circle cx=\"602.405\" cy=\"400.8616666666667\" r=\"3.6\" />\n        <circle cx=\"594.155\" cy=\"415.34666666666664\" r=\"3.6\" />\n        <circle cx=\"610.715\" cy=\"396.02666666666664\" r=\"3.6\" />\n        <circle cx=\"577.5016666666667\" cy=\"415.3483333333333\" r=\"3.6\" />\n        <circle cx=\"544.6385714285715\" cy=\"357.62142857142857\" r=\"3.6\" />\n        <circle cx=\"618.97\" cy=\"381.52333333333337\" r=\"3.6\" />\n        <circle cx=\"560.8516666666666\" cy=\"405.6933333333333\" r=\"3.6\" />\n        <circle cx=\"676.9983333333333\" cy=\"231.64833333333334\" r=\"3.6\" />\n        <circle cx=\"560.82\" cy=\"386.3616666666667\" r=\"3.6\" />\n        <circle cx=\"635.605\" cy=\"352.49666666666667\" r=\"3.6\" />\n        <circle cx=\"668.7366666666666\" cy=\"265.4816666666666\" r=\"3.6\" />\n        <circle cx=\"660.39\" cy=\"279.9866666666666\" r=\"3.6\" />\n        <circle cx=\"668.7366666666666\" cy=\"255.80499999999998\" r=\"3.6\" />\n        <circle cx=\"618.97\" cy=\"371.8533333333333\" r=\"3.6\" />\n        <circle cx=\"652.0849999999999\" cy=\"284.8466666666667\" r=\"3.6\" />\n        <circle cx=\"643.8149999999999\" cy=\"289.665\" r=\"3.6\" />\n        <circle cx=\"627.2566666666667\" cy=\"357.3433333333333\" r=\"3.6\" />\n        <circle cx=\"544.135\" cy=\"309.01166666666666\" r=\"3.6\" />\n        <circle cx=\"552.5166666666668\" cy=\"371.8533333333333\" r=\"3.6\" />\n        <circle cx=\"544.9325\" cy=\"299.33625\" r=\"3.6\" />\n        <circle cx=\"462.05999999999995\" cy=\"222.0033333333333\" r=\"3.6\" />\n        <circle cx=\"462.06\" cy=\"202.66333333333333\" r=\"3.6\" />\n        <circle cx=\"453.7966666666667\" cy=\"236.51\" r=\"3.6\" />\n        <circle cx=\"486.94000000000005\" cy=\"149.47166666666666\" r=\"3.6\" />\n        <circle cx=\"453.8066666666667\" cy=\"246.17333333333332\" r=\"3.6\" />\n        <circle cx=\"486.9283333333333\" cy=\"139.79666666666665\" r=\"3.6\" />\n        <circle cx=\"470.39000000000004\" cy=\"197.80499999999998\" r=\"3.6\" />\n        <circle cx=\"478.675\" cy=\"183.30666666666664\" r=\"3.6\" />\n        <circle cx=\"462.05999999999995\" cy=\"212.33333333333334\" r=\"3.6\" />\n        <circle cx=\"528.5300000000001\" cy=\"270.33833333333337\" r=\"3.6\" />\n        <circle cx=\"511.9550000000001\" cy=\"270.3683333333334\" r=\"3.6\" />\n        <circle cx=\"520.2616666666667\" cy=\"265.50333333333333\" r=\"3.6\" />\n        <circle cx=\"536.8\" cy=\"275.17\" r=\"3.6\" />\n        <circle cx=\"470.385\" cy=\"265.50333333333333\" r=\"3.6\" />\n        <circle cx=\"462.1116666666667\" cy=\"251.01166666666666\" r=\"3.6\" />\n        <circle cx=\"478.7166666666667\" cy=\"270.33833333333337\" r=\"3.6\" />\n        <circle cx=\"495.34\" cy=\"270.33333333333337\" r=\"3.6\" />\n        <circle cx=\"851.335\" cy=\"304.18666666666667\" r=\"3.6\" />\n        <circle cx=\"876.285\" cy=\"202.64666666666665\" r=\"3.6\" />\n        <circle cx=\"884.5266666666666\" cy=\"188.155\" r=\"3.6\" />\n        <circle cx=\"867.9566666666666\" cy=\"207.50166666666664\" r=\"3.6\" />\n        <circle cx=\"685.285\" cy=\"226.8116666666667\" r=\"3.6\" />\n        <circle cx=\"834.6733333333335\" cy=\"294.51666666666665\" r=\"3.6\" />\n        <circle cx=\"495.25499999999994\" cy=\"134.93833333333333\" r=\"3.6\" />\n        <circle cx=\"892.7433333333333\" cy=\"154.305\" r=\"3.6\" />\n        <circle cx=\"859.69\" cy=\"241.32666666666668\" r=\"3.6\" />\n        <circle cx=\"859.69\" cy=\"250.99666666666667\" r=\"3.6\" />\n        <circle cx=\"942.535\" cy=\"96.31166666666667\" r=\"3.6\" />\n        <circle cx=\"959.1483333333332\" cy=\"57.623333333333335\" r=\"3.6\" />\n        <circle cx=\"959.1583333333332\" cy=\"67.28666666666668\" r=\"3.6\" />\n        <circle cx=\"950.9000000000001\" cy=\"91.47333333333334\" r=\"3.6\" />\n        <circle cx=\"967.4650000000001\" cy=\"52.75833333333333\" r=\"3.6\" />\n        <circle cx=\"826.3716666666666\" cy=\"280.01500000000004\" r=\"3.6\" />\n        <circle cx=\"917.7216666666667\" cy=\"110.795\" r=\"3.6\" />\n        <circle cx=\"909.3716666666666\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"934.235\" cy=\"91.47333333333331\" r=\"3.6\" />\n        <circle cx=\"884.5216666666666\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"726.7316666666667\" cy=\"212.31833333333336\" r=\"3.6\" />\n        <circle cx=\"735.0566666666667\" cy=\"217.17999999999998\" r=\"3.6\" />\n        <circle cx=\"718.48\" cy=\"197.82000000000002\" r=\"3.6\" />\n        <circle cx=\"751.6650000000001\" cy=\"255.84166666666667\" r=\"3.6\" />\n        <circle cx=\"743.335\" cy=\"231.6766666666667\" r=\"3.6\" />\n        <circle cx=\"693.5933333333332\" cy=\"212.31666666666663\" r=\"3.6\" />\n        <circle cx=\"710.2014285714286\" cy=\"193.25428571428571\" r=\"3.6\" />\n        <circle cx=\"701.8199999999999\" cy=\"197.55285714285714\" r=\"3.6\" />\n        <circle cx=\"784.8850000000001\" cy=\"207.4933333333333\" r=\"3.6\" />\n        <circle cx=\"809.775\" cy=\"221.98666666666665\" r=\"3.6\" />\n        <circle cx=\"809.785\" cy=\"212.3216666666667\" r=\"3.6\" />\n        <circle cx=\"801.5\" cy=\"207.49333333333334\" r=\"3.6\" />\n        <circle cx=\"768.315\" cy=\"226.83166666666668\" r=\"3.6\" />\n        <circle cx=\"809.8166666666666\" cy=\"231.665\" r=\"3.6\" />\n        <circle cx=\"776.63\" cy=\"221.98666666666665\" r=\"3.6\" />\n        <circle cx=\"818.085\" cy=\"275.14666666666665\" r=\"3.6\" />\n        <circle cx=\"776.6083333333332\" cy=\"212.3283333333333\" r=\"3.6\" />\n        <circle cx=\"760.0233333333332\" cy=\"260.6616666666667\" r=\"3.6\" />\n        <circle cx=\"901.07\" cy=\"130.14833333333334\" r=\"3.6\" />\n        <circle cx=\"892.7733333333334\" cy=\"144.655\" r=\"3.6\" />\n        <circle cx=\"901.0616666666666\" cy=\"120.47500000000001\" r=\"3.6\" />\n        <circle cx=\"876.2366666666667\" cy=\"173.62666666666667\" r=\"3.6\" />\n        <circle cx=\"859.6300000000001\" cy=\"202.64833333333334\" r=\"3.6\" />\n        <circle cx=\"909.3666666666667\" cy=\"115.63333333333334\" r=\"3.6\" />\n        <circle cx=\"867.9266666666666\" cy=\"197.81333333333336\" r=\"3.6\" />\n        <circle cx=\"876.2433333333333\" cy=\"192.99166666666667\" r=\"3.6\" />\n        <circle cx=\"876.2083333333334\" cy=\"183.30999999999997\" r=\"3.6\" />\n        <circle cx=\"942.5766666666665\" cy=\"86.61833333333334\" r=\"3.6\" />\n        <circle cx=\"934.245\" cy=\"81.79833333333333\" r=\"3.6\" />\n        <circle cx=\"859.6349999999999\" cy=\"212.32666666666668\" r=\"3.6\" />\n        <circle cx=\"950.8233333333333\" cy=\"72.155\" r=\"3.6\" />\n        <circle cx=\"950.8449999999999\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"934.2199999999999\" cy=\"72.14999999999999\" r=\"3.6\" />\n        <circle cx=\"909.3716666666666\" cy=\"105.95166666666667\" r=\"3.6\" />\n        <circle cx=\"917.62\" cy=\"62.446666666666665\" r=\"3.6\" />\n        <circle cx=\"925.9066666666666\" cy=\"67.30499999999999\" r=\"3.6\" />\n        <circle cx=\"768.275\" cy=\"207.48333333333332\" r=\"3.6\" />\n        <circle cx=\"793.15\" cy=\"192.995\" r=\"3.6\" />\n        <circle cx=\"801.495\" cy=\"197.82000000000002\" r=\"3.6\" />\n        <circle cx=\"818.09\" cy=\"207.48333333333332\" r=\"3.6\" />\n        <circle cx=\"793.16\" cy=\"202.66333333333333\" r=\"3.6\" />\n        <circle cx=\"809.79\" cy=\"202.6483333333333\" r=\"3.6\" />\n        <circle cx=\"784.88\" cy=\"197.82666666666668\" r=\"3.6\" />\n        <circle cx=\"768.275\" cy=\"217.15333333333334\" r=\"3.6\" />\n        <circle cx=\"942.535\" cy=\"47.945\" r=\"3.6\" />\n        <circle cx=\"776.5933333333332\" cy=\"202.6483333333333\" r=\"3.6\" />\n        <circle cx=\"834.6833333333333\" cy=\"284.8516666666667\" r=\"3.6\" />\n        <circle cx=\"843.005\" cy=\"299.3433333333333\" r=\"3.6\" />\n        <circle cx=\"851.36\" cy=\"255.86499999999998\" r=\"3.6\" />\n        <circle cx=\"851.3800000000001\" cy=\"246.17166666666665\" r=\"3.6\" />\n        <circle cx=\"851.375\" cy=\"236.49333333333334\" r=\"3.6\" />\n        <circle cx=\"859.6350000000001\" cy=\"221.98666666666668\" r=\"3.6\" />\n        <circle cx=\"834.6983333333333\" cy=\"275.1666666666667\" r=\"3.6\" />\n        <circle cx=\"818.1100000000001\" cy=\"226.82000000000002\" r=\"3.6\" />\n        <circle cx=\"843.0450000000001\" cy=\"289.68333333333334\" r=\"3.6\" />\n        <circle cx=\"693.415\" cy=\"38.26833333333333\" r=\"3.6\" />\n        <circle cx=\"627.1083333333333\" cy=\"57.598333333333336\" r=\"3.6\" />\n        <circle cx=\"602.215\" cy=\"52.77333333333334\" r=\"3.6\" />\n        <circle cx=\"618.8199999999999\" cy=\"52.77\" r=\"3.6\" />\n        <circle cx=\"593.9499999999999\" cy=\"47.913333333333334\" r=\"3.6\" />\n        <circle cx=\"925.9366666666666\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"676.8383333333334\" cy=\"47.91\" r=\"3.6\" />\n        <circle cx=\"643.7233333333334\" cy=\"57.59833333333333\" r=\"3.6\" />\n        <circle cx=\"585.6516666666666\" cy=\"43.076666666666675\" r=\"3.6\" />\n        <circle cx=\"685.1566666666668\" cy=\"43.10999999999999\" r=\"3.6\" />\n        <circle cx=\"651.9616666666667\" cy=\"52.76166666666666\" r=\"3.6\" />\n        <circle cx=\"520.1483333333333\" cy=\"110.78333333333335\" r=\"3.6\" />\n        <circle cx=\"536.72\" cy=\"62.440000000000005\" r=\"3.6\" />\n        <circle cx=\"528.4166666666666\" cy=\"67.28333333333333\" r=\"3.6\" />\n        <circle cx=\"511.83\" cy=\"115.63833333333332\" r=\"3.6\" />\n        <circle cx=\"544.8787500000001\" cy=\"57.60125\" r=\"3.6\" />\n        <circle cx=\"560.6833333333333\" cy=\"47.93833333333333\" r=\"3.6\" />\n        <circle cx=\"568.9999999999999\" cy=\"43.089999999999996\" r=\"3.6\" />\n        <circle cx=\"552.3766666666667\" cy=\"52.77666666666667\" r=\"3.6\" />\n        <circle cx=\"668.5533333333334\" cy=\"52.76333333333333\" r=\"3.6\" />\n        <circle cx=\"867.8350000000002\" cy=\"43.10999999999999\" r=\"3.6\" />\n        <circle cx=\"851.2400000000001\" cy=\"43.120000000000005\" r=\"3.6\" />\n        <circle cx=\"503.5233333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n        <circle cx=\"817.995\" cy=\"43.10999999999999\" r=\"3.6\" />\n        <circle cx=\"892.6899999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n        <circle cx=\"884.4399999999999\" cy=\"43.116666666666674\" r=\"3.6\" />\n        <circle cx=\"909.3216666666667\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"809.7049999999999\" cy=\"38.26833333333334\" r=\"3.6\" />\n        <circle cx=\"834.6150000000001\" cy=\"43.12500000000001\" r=\"3.6\" />\n        <circle cx=\"726.6483333333332\" cy=\"28.59\" r=\"3.6\" />\n        <circle cx=\"743.2333333333332\" cy=\"28.623333333333335\" r=\"3.6\" />\n        <circle cx=\"718.3849999999999\" cy=\"33.443333333333335\" r=\"3.6\" />\n        <circle cx=\"793.055\" cy=\"38.29333333333334\" r=\"3.6\" />\n        <circle cx=\"701.71\" cy=\"33.15428571428571\" r=\"3.6\" />\n        <circle cx=\"759.8716666666666\" cy=\"28.60166666666667\" r=\"3.6\" />\n        <circle cx=\"776.4883333333333\" cy=\"38.27833333333333\" r=\"3.6\" />\n        <circle cx=\"768.2033333333333\" cy=\"33.425000000000004\" r=\"3.6\" />\n        <circle cx=\"801.48\" cy=\"168.82166666666666\" r=\"3.6\" />\n        <circle cx=\"577.4616666666667\" cy=\"367.00666666666666\" r=\"3.6\" />\n        <circle cx=\"569.1166666666667\" cy=\"304.1766666666667\" r=\"3.6\" />\n        <circle cx=\"569.1066666666667\" cy=\"284.83166666666665\" r=\"3.6\" />\n        <circle cx=\"569.1066666666667\" cy=\"294.50166666666667\" r=\"3.6\" />\n        <circle cx=\"560.7666666666668\" cy=\"279.99666666666667\" r=\"3.6\" />\n        <circle cx=\"528.57\" cy=\"241.32666666666668\" r=\"3.6\" />\n        <circle cx=\"759.9683333333332\" cy=\"192.98000000000002\" r=\"3.6\" />\n        <circle cx=\"545.035\" cy=\"250.9925\" r=\"3.6\" />\n        <circle cx=\"536.865\" cy=\"246.15666666666667\" r=\"3.6\" />\n        <circle cx=\"552.5133333333334\" cy=\"255.82666666666668\" r=\"3.6\" />\n        <circle cx=\"569.1650000000001\" cy=\"352.51000000000005\" r=\"3.6\" />\n        <circle cx=\"569.1550000000001\" cy=\"342.84666666666664\" r=\"3.6\" />\n        <circle cx=\"569.14\" cy=\"313.83\" r=\"3.6\" />\n        <circle cx=\"577.4616666666667\" cy=\"357.33666666666664\" r=\"3.6\" />\n        <circle cx=\"560.81\" cy=\"338.0133333333333\" r=\"3.6\" />\n        <circle cx=\"569.1500000000001\" cy=\"323.50333333333333\" r=\"3.6\" />\n        <circle cx=\"560.81\" cy=\"328.3433333333333\" r=\"3.6\" />\n        <circle cx=\"552.495\" cy=\"333.1766666666667\" r=\"3.6\" />\n        <circle cx=\"511.9350000000001\" cy=\"241.33666666666667\" r=\"3.6\" />\n        <circle cx=\"503.585\" cy=\"168.81166666666667\" r=\"3.6\" />\n        <circle cx=\"528.4699999999999\" cy=\"134.97666666666666\" r=\"3.6\" />\n        <circle cx=\"503.605\" cy=\"188.155\" r=\"3.6\" />\n        <circle cx=\"503.59999999999997\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"536.765\" cy=\"130.13\" r=\"3.6\" />\n        <circle cx=\"544.5914285714287\" cy=\"96.56142857142856\" r=\"3.6\" />\n        <circle cx=\"544.9412500000001\" cy=\"105.95750000000001\" r=\"3.6\" />\n        <circle cx=\"544.5828571428572\" cy=\"115.90142857142857\" r=\"3.6\" />\n        <circle cx=\"544.115\" cy=\"125.29666666666667\" r=\"3.6\" />\n        <circle cx=\"495.32666666666665\" cy=\"202.64833333333334\" r=\"3.6\" />\n        <circle cx=\"487.04999999999995\" cy=\"246.15666666666667\" r=\"3.6\" />\n        <circle cx=\"487.03\" cy=\"226.82000000000002\" r=\"3.6\" />\n        <circle cx=\"487.05\" cy=\"236.48666666666665\" r=\"3.6\" />\n        <circle cx=\"503.615\" cy=\"197.82666666666668\" r=\"3.6\" />\n        <circle cx=\"495.36666666666673\" cy=\"241.32666666666668\" r=\"3.6\" />\n        <circle cx=\"487.01\" cy=\"217.15333333333334\" r=\"3.6\" />\n        <circle cx=\"503.66\" cy=\"246.17166666666665\" r=\"3.6\" />\n        <circle cx=\"495.32666666666665\" cy=\"212.3183333333333\" r=\"3.6\" />\n        <circle cx=\"627.2083333333334\" cy=\"270.32\" r=\"3.6\" />\n        <circle cx=\"668.6750000000001\" cy=\"207.4483333333333\" r=\"3.6\" />\n        <circle cx=\"676.91\" cy=\"192.97833333333332\" r=\"3.6\" />\n        <circle cx=\"676.91\" cy=\"183.31500000000003\" r=\"3.6\" />\n        <circle cx=\"693.5099999999999\" cy=\"173.64\" r=\"3.6\" />\n        <circle cx=\"685.235\" cy=\"178.47166666666666\" r=\"3.6\" />\n        <circle cx=\"652.0916666666667\" cy=\"236.49166666666667\" r=\"3.6\" />\n        <circle cx=\"660.39\" cy=\"212.30333333333337\" r=\"3.6\" />\n        <circle cx=\"652.0916666666666\" cy=\"226.81499999999997\" r=\"3.6\" />\n        <circle cx=\"652.0716666666666\" cy=\"217.14666666666668\" r=\"3.6\" />\n        <circle cx=\"702.1787499999999\" cy=\"168.80625000000003\" r=\"3.6\" />\n        <circle cx=\"743.3250000000002\" cy=\"183.32666666666668\" r=\"3.6\" />\n        <circle cx=\"735.065\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"743.335\" cy=\"192.995\" r=\"3.6\" />\n        <circle cx=\"751.68\" cy=\"197.82000000000002\" r=\"3.6\" />\n        <circle cx=\"718.4699999999999\" cy=\"168.80666666666667\" r=\"3.6\" />\n        <circle cx=\"726.7716666666666\" cy=\"173.64333333333332\" r=\"3.6\" />\n        <circle cx=\"709.8325\" cy=\"163.97250000000003\" r=\"3.6\" />\n        <circle cx=\"643.8783333333332\" cy=\"260.635\" r=\"3.6\" />\n        <circle cx=\"585.76\" cy=\"371.83666666666664\" r=\"3.6\" />\n        <circle cx=\"602.35\" cy=\"352.51500000000004\" r=\"3.6\" />\n        <circle cx=\"602.34\" cy=\"342.84\" r=\"3.6\" />\n        <circle cx=\"594.0616666666667\" cy=\"357.33666666666664\" r=\"3.6\" />\n        <circle cx=\"618.93\" cy=\"333.17333333333335\" r=\"3.6\" />\n        <circle cx=\"610.595\" cy=\"338.0133333333333\" r=\"3.6\" />\n        <circle cx=\"585.78\" cy=\"381.50500000000005\" r=\"3.6\" />\n        <circle cx=\"594.0616666666667\" cy=\"367.00666666666666\" r=\"3.6\" />\n        <circle cx=\"594.0616666666666\" cy=\"376.6766666666667\" r=\"3.6\" />\n        <circle cx=\"618.89\" cy=\"284.83166666666665\" r=\"3.6\" />\n        <circle cx=\"618.93\" cy=\"323.50333333333333\" r=\"3.6\" />\n        <circle cx=\"618.9050000000001\" cy=\"275.17\" r=\"3.6\" />\n        <circle cx=\"618.89\" cy=\"294.50166666666667\" r=\"3.6\" />\n        <circle cx=\"536.785\" cy=\"91.43666666666667\" r=\"3.6\" />\n        <circle cx=\"635.515\" cy=\"265.4733333333333\" r=\"3.6\" />\n        <circle cx=\"627.245\" cy=\"318.65833333333336\" r=\"3.6\" />\n        <circle cx=\"618.9\" cy=\"304.1766666666667\" r=\"3.6\" />\n        <circle cx=\"626.8042857142857\" cy=\"308.6142857142857\" r=\"3.6\" />\n        <circle cx=\"520.265\" cy=\"236.49666666666664\" r=\"3.6\" />\n        <circle cx=\"834.695\" cy=\"188.155\" r=\"3.6\" />\n        <circle cx=\"851.3100000000001\" cy=\"159.14666666666668\" r=\"3.6\" />\n        <circle cx=\"842.98\" cy=\"183.32666666666668\" r=\"3.6\" />\n        <circle cx=\"851.32\" cy=\"168.8216666666667\" r=\"3.6\" />\n        <circle cx=\"793.14\" cy=\"173.65666666666667\" r=\"3.6\" />\n        <circle cx=\"643.8133333333334\" cy=\"212.3033333333333\" r=\"3.6\" />\n        <circle cx=\"826.4\" cy=\"183.31000000000003\" r=\"3.6\" />\n        <circle cx=\"876.1383333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n        <circle cx=\"818.07\" cy=\"178.47333333333333\" r=\"3.6\" />\n        <circle cx=\"851.32\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"884.4716666666668\" cy=\"101.13666666666667\" r=\"3.6\" />\n        <circle cx=\"876.1783333333333\" cy=\"105.95833333333333\" r=\"3.6\" />\n        <circle cx=\"552.4399999999999\" cy=\"81.78666666666668\" r=\"3.6\" />\n        <circle cx=\"876.1750000000001\" cy=\"115.62833333333333\" r=\"3.6\" />\n        <circle cx=\"867.8649999999999\" cy=\"130.13000000000002\" r=\"3.6\" />\n        <circle cx=\"867.8649999999999\" cy=\"139.79666666666665\" r=\"3.6\" />\n        <circle cx=\"859.61\" cy=\"154.295\" r=\"3.6\" />\n        <circle cx=\"876.1683333333334\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"809.7700000000001\" cy=\"173.64333333333332\" r=\"3.6\" />\n        <circle cx=\"718.4699999999999\" cy=\"159.13666666666668\" r=\"3.6\" />\n        <circle cx=\"702.17125\" cy=\"159.13125\" r=\"3.6\" />\n        <circle cx=\"685.235\" cy=\"168.8033333333333\" r=\"3.6\" />\n        <circle cx=\"710.1757142857142\" cy=\"154.58285714285716\" r=\"3.6\" />\n        <circle cx=\"693.5099999999999\" cy=\"163.97333333333333\" r=\"3.6\" />\n        <circle cx=\"660.4\" cy=\"202.63166666666666\" r=\"3.6\" />\n        <circle cx=\"676.94\" cy=\"173.62666666666667\" r=\"3.6\" />\n        <circle cx=\"652.0716666666667\" cy=\"207.48\" r=\"3.6\" />\n        <circle cx=\"668.625\" cy=\"178.45666666666668\" r=\"3.6\" />\n        <circle cx=\"751.665\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"759.9583333333334\" cy=\"183.31000000000003\" r=\"3.6\" />\n        <circle cx=\"768.255\" cy=\"178.47333333333333\" r=\"3.6\" />\n        <circle cx=\"726.7716666666666\" cy=\"163.97666666666666\" r=\"3.6\" />\n        <circle cx=\"751.6700000000001\" cy=\"188.16\" r=\"3.6\" />\n        <circle cx=\"776.5699999999998\" cy=\"173.64333333333332\" r=\"3.6\" />\n        <circle cx=\"735.065\" cy=\"168.82166666666666\" r=\"3.6\" />\n        <circle cx=\"784.8633333333333\" cy=\"168.82166666666666\" r=\"3.6\" />\n        <circle cx=\"743.3250000000002\" cy=\"173.65666666666667\" r=\"3.6\" />\n        <circle cx=\"884.4516666666667\" cy=\"72.13166666666667\" r=\"3.6\" />\n        <circle cx=\"867.855\" cy=\"72.115\" r=\"3.6\" />\n        <circle cx=\"676.89\" cy=\"76.93833333333333\" r=\"3.6\" />\n        <circle cx=\"660.3166666666667\" cy=\"76.93833333333333\" r=\"3.6\" />\n        <circle cx=\"652.0200000000001\" cy=\"81.78\" r=\"3.6\" />\n        <circle cx=\"685.1716666666666\" cy=\"72.10833333333333\" r=\"3.6\" />\n        <circle cx=\"643.7633333333333\" cy=\"86.60666666666667\" r=\"3.6\" />\n        <circle cx=\"709.75875\" cy=\"57.613749999999996\" r=\"3.6\" />\n        <circle cx=\"702.1075000000001\" cy=\"62.447500000000005\" r=\"3.6\" />\n        <circle cx=\"693.4366666666666\" cy=\"67.28333333333333\" r=\"3.6\" />\n        <circle cx=\"668.595\" cy=\"81.77\" r=\"3.6\" />\n        <circle cx=\"602.245\" cy=\"81.78833333333334\" r=\"3.6\" />\n        <circle cx=\"593.9416666666667\" cy=\"76.93833333333333\" r=\"3.6\" />\n        <circle cx=\"585.64\" cy=\"72.10333333333332\" r=\"3.6\" />\n        <circle cx=\"577.3066666666667\" cy=\"67.26666666666667\" r=\"3.6\" />\n        <circle cx=\"618.8449999999999\" cy=\"81.77666666666666\" r=\"3.6\" />\n        <circle cx=\"627.1483333333333\" cy=\"86.60666666666667\" r=\"3.6\" />\n        <circle cx=\"610.495\" cy=\"76.95500000000001\" r=\"3.6\" />\n        <circle cx=\"635.4449999999999\" cy=\"81.77\" r=\"3.6\" />\n        <circle cx=\"718.3949999999999\" cy=\"62.446666666666665\" r=\"3.6\" />\n        <circle cx=\"818.015\" cy=\"72.115\" r=\"3.6\" />\n        <circle cx=\"826.3250000000002\" cy=\"67.28666666666668\" r=\"3.6\" />\n        <circle cx=\"809.6999999999999\" cy=\"67.28666666666666\" r=\"3.6\" />\n        <circle cx=\"834.63\" cy=\"72.125\" r=\"3.6\" />\n        <circle cx=\"859.5400000000001\" cy=\"67.28666666666666\" r=\"3.6\" />\n        <circle cx=\"801.4050000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"842.9049999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n        <circle cx=\"851.2550000000001\" cy=\"72.13666666666667\" r=\"3.6\" />\n        <circle cx=\"743.255\" cy=\"57.63\" r=\"3.6\" />\n        <circle cx=\"751.5900000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n        <circle cx=\"726.6983333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"793.0649999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n        <circle cx=\"759.8833333333332\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"734.9916666666667\" cy=\"52.79333333333333\" r=\"3.6\" />\n        <circle cx=\"784.7916666666666\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"776.4983333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n        <circle cx=\"768.1833333333334\" cy=\"62.446666666666665\" r=\"3.6\" />\n        <circle cx=\"536.765\" cy=\"120.46333333333332\" r=\"3.6\" />\n        <circle cx=\"560.7666666666668\" cy=\"299.33666666666664\" r=\"3.6\" />\n        <circle cx=\"560.7883333333333\" cy=\"309.00500000000005\" r=\"3.6\" />\n        <circle cx=\"560.81\" cy=\"318.67333333333335\" r=\"3.6\" />\n        <circle cx=\"552.495\" cy=\"323.50666666666666\" r=\"3.6\" />\n        <circle cx=\"536.865\" cy=\"255.82666666666668\" r=\"3.6\" />\n        <circle cx=\"552.465\" cy=\"275.15833333333336\" r=\"3.6\" />\n        <circle cx=\"560.7666666666668\" cy=\"289.6666666666667\" r=\"3.6\" />\n        <circle cx=\"545.035\" cy=\"260.6625\" r=\"3.6\" />\n        <circle cx=\"552.455\" cy=\"284.8333333333333\" r=\"3.6\" />\n        <circle cx=\"552.5\" cy=\"342.8433333333333\" r=\"3.6\" />\n        <circle cx=\"577.4816666666667\" cy=\"386.34666666666664\" r=\"3.6\" />\n        <circle cx=\"560.82\" cy=\"347.68\" r=\"3.6\" />\n        <circle cx=\"577.5016666666667\" cy=\"396.0133333333333\" r=\"3.6\" />\n        <circle cx=\"511.855\" cy=\"134.99666666666667\" r=\"3.6\" />\n        <circle cx=\"577.4616666666667\" cy=\"376.6766666666667\" r=\"3.6\" />\n        <circle cx=\"569.17\" cy=\"371.8516666666667\" r=\"3.6\" />\n        <circle cx=\"560.83\" cy=\"357.34666666666664\" r=\"3.6\" />\n        <circle cx=\"569.1700000000001\" cy=\"362.1816666666667\" r=\"3.6\" />\n        <circle cx=\"470.45\" cy=\"236.49666666666667\" r=\"3.6\" />\n        <circle cx=\"487.01\" cy=\"207.48333333333335\" r=\"3.6\" />\n        <circle cx=\"768.265\" cy=\"188.14499999999998\" r=\"3.6\" />\n        <circle cx=\"487.01\" cy=\"197.8133333333333\" r=\"3.6\" />\n        <circle cx=\"478.71\" cy=\"212.31833333333336\" r=\"3.6\" />\n        <circle cx=\"478.71000000000004\" cy=\"221.98833333333334\" r=\"3.6\" />\n        <circle cx=\"503.57666666666665\" cy=\"149.48166666666665\" r=\"3.6\" />\n        <circle cx=\"495.3066666666667\" cy=\"183.31000000000003\" r=\"3.6\" />\n        <circle cx=\"511.895\" cy=\"144.65\" r=\"3.6\" />\n        <circle cx=\"495.3066666666667\" cy=\"173.64333333333335\" r=\"3.6\" />\n        <circle cx=\"495.36666666666673\" cy=\"250.99666666666667\" r=\"3.6\" />\n        <circle cx=\"503.66\" cy=\"255.84166666666667\" r=\"3.6\" />\n        <circle cx=\"528.57\" cy=\"250.99666666666667\" r=\"3.6\" />\n        <circle cx=\"585.8\" cy=\"391.17333333333335\" r=\"3.6\" />\n        <circle cx=\"520.275\" cy=\"246.17166666666665\" r=\"3.6\" />\n        <circle cx=\"511.9350000000001\" cy=\"251.00666666666663\" r=\"3.6\" />\n        <circle cx=\"478.75333333333333\" cy=\"241.32666666666668\" r=\"3.6\" />\n        <circle cx=\"478.7533333333334\" cy=\"250.99666666666667\" r=\"3.6\" />\n        <circle cx=\"487.05\" cy=\"255.82666666666668\" r=\"3.6\" />\n        <circle cx=\"585.8000000000001\" cy=\"400.8433333333333\" r=\"3.6\" />\n        <circle cx=\"709.8325\" cy=\"173.64\" r=\"3.6\" />\n        <circle cx=\"718.4699999999999\" cy=\"178.47333333333333\" r=\"3.6\" />\n        <circle cx=\"726.7716666666666\" cy=\"183.31000000000003\" r=\"3.6\" />\n        <circle cx=\"702.1787499999999\" cy=\"178.47375\" r=\"3.6\" />\n        <circle cx=\"594.0816666666667\" cy=\"386.34499999999997\" r=\"3.6\" />\n        <circle cx=\"660.3899999999999\" cy=\"221.97\" r=\"3.6\" />\n        <circle cx=\"693.5099999999999\" cy=\"183.3066666666667\" r=\"3.6\" />\n        <circle cx=\"676.9633333333334\" cy=\"212.30333333333337\" r=\"3.6\" />\n        <circle cx=\"685.2399999999999\" cy=\"188.13833333333332\" r=\"3.6\" />\n        <circle cx=\"668.645\" cy=\"217.13333333333333\" r=\"3.6\" />\n        <circle cx=\"759.9783333333334\" cy=\"202.64833333333334\" r=\"3.6\" />\n        <circle cx=\"768.275\" cy=\"197.81333333333336\" r=\"3.6\" />\n        <circle cx=\"776.5816666666666\" cy=\"192.97833333333335\" r=\"3.6\" />\n        <circle cx=\"759.9783333333334\" cy=\"212.3183333333333\" r=\"3.6\" />\n        <circle cx=\"751.685\" cy=\"207.49333333333334\" r=\"3.6\" />\n        <circle cx=\"743.3449999999999\" cy=\"202.66333333333333\" r=\"3.6\" />\n        <circle cx=\"735.0799999999999\" cy=\"197.82666666666668\" r=\"3.6\" />\n        <circle cx=\"751.685\" cy=\"217.16333333333333\" r=\"3.6\" />\n        <circle cx=\"735.07\" cy=\"188.155\" r=\"3.6\" />\n        <circle cx=\"660.41\" cy=\"231.63833333333335\" r=\"3.6\" />\n        <circle cx=\"610.615\" cy=\"357.34666666666664\" r=\"3.6\" />\n        <circle cx=\"618.935\" cy=\"342.84666666666664\" r=\"3.6\" />\n        <circle cx=\"627.2283333333334\" cy=\"337.99833333333333\" r=\"3.6\" />\n        <circle cx=\"610.605\" cy=\"347.68\" r=\"3.6\" />\n        <circle cx=\"602.3649999999999\" cy=\"381.51500000000004\" r=\"3.6\" />\n        <circle cx=\"602.355\" cy=\"371.8516666666667\" r=\"3.6\" />\n        <circle cx=\"602.355\" cy=\"362.1816666666667\" r=\"3.6\" />\n        <circle cx=\"627.2366666666666\" cy=\"328.32166666666666\" r=\"3.6\" />\n        <circle cx=\"643.8266666666666\" cy=\"270.31666666666666\" r=\"3.6\" />\n        <circle cx=\"652.0833333333334\" cy=\"265.49\" r=\"3.6\" />\n        <circle cx=\"635.4833333333333\" cy=\"275.1466666666667\" r=\"3.6\" />\n        <circle cx=\"660.4150000000001\" cy=\"241.32833333333335\" r=\"3.6\" />\n        <circle cx=\"627.1850000000001\" cy=\"289.6566666666667\" r=\"3.6\" />\n        <circle cx=\"627.1850000000001\" cy=\"299.3233333333333\" r=\"3.6\" />\n        <circle cx=\"635.555\" cy=\"304.14833333333337\" r=\"3.6\" />\n        <circle cx=\"627.1850000000001\" cy=\"279.9866666666666\" r=\"3.6\" />\n        <circle cx=\"495.3166666666666\" cy=\"192.97833333333332\" r=\"3.6\" />\n        <circle cx=\"892.7550000000001\" cy=\"96.28166666666665\" r=\"3.6\" />\n        <circle cx=\"892.7333333333335\" cy=\"105.97333333333331\" r=\"3.6\" />\n        <circle cx=\"901.0099999999999\" cy=\"72.155\" r=\"3.6\" />\n        <circle cx=\"884.4683333333332\" cy=\"110.80499999999999\" r=\"3.6\" />\n        <circle cx=\"876.1616666666667\" cy=\"144.66833333333332\" r=\"3.6\" />\n        <circle cx=\"884.4633333333333\" cy=\"120.47166666666668\" r=\"3.6\" />\n        <circle cx=\"901.0300000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"876.1683333333334\" cy=\"134.96666666666667\" r=\"3.6\" />\n        <circle cx=\"884.4616666666666\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"892.6899999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n        <circle cx=\"851.245\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"867.9366666666668\" cy=\"159.11833333333334\" r=\"3.6\" />\n        <circle cx=\"859.5400000000001\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"834.62\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"842.9049999999999\" cy=\"57.63\" r=\"3.6\" />\n        <circle cx=\"520.17\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"876.1383333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"867.8350000000002\" cy=\"62.446666666666665\" r=\"3.6\" />\n        <circle cx=\"809.7700000000001\" cy=\"183.31000000000003\" r=\"3.6\" />\n        <circle cx=\"818.08\" cy=\"188.14499999999998\" r=\"3.6\" />\n        <circle cx=\"826.3250000000002\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"859.61\" cy=\"163.97666666666666\" r=\"3.6\" />\n        <circle cx=\"834.7066666666666\" cy=\"197.82666666666668\" r=\"3.6\" />\n        <circle cx=\"784.8633333333333\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"801.48\" cy=\"178.49\" r=\"3.6\" />\n        <circle cx=\"776.5699999999998\" cy=\"183.31000000000003\" r=\"3.6\" />\n        <circle cx=\"834.7116666666666\" cy=\"207.49333333333334\" r=\"3.6\" />\n        <circle cx=\"793.14\" cy=\"183.32666666666668\" r=\"3.6\" />\n        <circle cx=\"826.41\" cy=\"192.97833333333335\" r=\"3.6\" />\n        <circle cx=\"859.61\" cy=\"183.31000000000003\" r=\"3.6\" />\n        <circle cx=\"851.3249999999999\" cy=\"188.16\" r=\"3.6\" />\n        <circle cx=\"834.7116666666666\" cy=\"217.16333333333333\" r=\"3.6\" />\n        <circle cx=\"859.61\" cy=\"173.64333333333335\" r=\"3.6\" />\n        <circle cx=\"842.9899999999999\" cy=\"192.995\" r=\"3.6\" />\n        <circle cx=\"843.06\" cy=\"222.0033333333333\" r=\"3.6\" />\n        <circle cx=\"843\" cy=\"202.66333333333333\" r=\"3.6\" />\n        <circle cx=\"843.0300000000001\" cy=\"212.35166666666666\" r=\"3.6\" />\n        <circle cx=\"884.43\" cy=\"62.461666666666666\" r=\"3.6\" />\n        <circle cx=\"618.8249999999999\" cy=\"72.12\" r=\"3.6\" />\n        <circle cx=\"627.1283333333333\" cy=\"76.93833333333333\" r=\"3.6\" />\n        <circle cx=\"610.475\" cy=\"67.28333333333333\" r=\"3.6\" />\n        <circle cx=\"593.9216666666666\" cy=\"67.26833333333333\" r=\"3.6\" />\n        <circle cx=\"602.225\" cy=\"72.10666666666667\" r=\"3.6\" />\n        <circle cx=\"635.425\" cy=\"72.10333333333332\" r=\"3.6\" />\n        <circle cx=\"651.9983333333333\" cy=\"72.11\" r=\"3.6\" />\n        <circle cx=\"660.295\" cy=\"67.26833333333333\" r=\"3.6\" />\n        <circle cx=\"643.7433333333333\" cy=\"76.93833333333333\" r=\"3.6\" />\n        <circle cx=\"536.7683333333333\" cy=\"110.79333333333331\" r=\"3.6\" />\n        <circle cx=\"668.575\" cy=\"72.10499999999999\" r=\"3.6\" />\n        <circle cx=\"784.8683333333333\" cy=\"188.155\" r=\"3.6\" />\n        <circle cx=\"536.765\" cy=\"101.11833333333334\" r=\"3.6\" />\n        <circle cx=\"585.62\" cy=\"62.43333333333334\" r=\"3.6\" />\n        <circle cx=\"528.465\" cy=\"125.29833333333333\" r=\"3.6\" />\n        <circle cx=\"577.3166666666666\" cy=\"57.60166666666667\" r=\"3.6\" />\n        <circle cx=\"817.995\" cy=\"62.446666666666665\" r=\"3.6\" />\n        <circle cx=\"544.5485714285713\" cy=\"77.24285714285715\" r=\"3.6\" />\n        <circle cx=\"552.4083333333334\" cy=\"72.11\" r=\"3.6\" />\n        <circle cx=\"676.8683333333332\" cy=\"67.26833333333333\" r=\"3.6\" />\n        <circle cx=\"768.1833333333334\" cy=\"52.77666666666667\" r=\"3.6\" />\n        <circle cx=\"751.585\" cy=\"43.120000000000005\" r=\"3.6\" />\n        <circle cx=\"759.8833333333332\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"784.7916666666666\" cy=\"52.79333333333333\" r=\"3.6\" />\n        <circle cx=\"793.0649999999999\" cy=\"57.63\" r=\"3.6\" />\n        <circle cx=\"809.6999999999999\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"801.4050000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n        <circle cx=\"776.4983333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n        <circle cx=\"743.255\" cy=\"47.96333333333334\" r=\"3.6\" />\n        <circle cx=\"702.1075000000001\" cy=\"52.7775\" r=\"3.6\" />\n        <circle cx=\"685.1616666666667\" cy=\"62.443333333333335\" r=\"3.6\" />\n        <circle cx=\"709.75875\" cy=\"47.94375\" r=\"3.6\" />\n        <circle cx=\"693.4366666666666\" cy=\"57.613333333333344\" r=\"3.6\" />\n        <circle cx=\"718.3949999999999\" cy=\"52.77666666666667\" r=\"3.6\" />\n        <circle cx=\"734.9866666666667\" cy=\"43.12500000000001\" r=\"3.6\" />\n        <circle cx=\"726.6983333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n        <circle cx=\"876.1850000000001\" cy=\"289.65\" r=\"3.6\" />\n        <circle cx=\"876.1550000000001\" cy=\"279.99833333333333\" r=\"3.6\" />\n        <circle cx=\"884.5033333333334\" cy=\"275.16333333333336\" r=\"3.6\" />\n        <circle cx=\"884.4983333333333\" cy=\"304.2\" r=\"3.6\" />\n        <circle cx=\"867.9249999999998\" cy=\"304.19166666666666\" r=\"3.6\" />\n        <circle cx=\"884.5283333333333\" cy=\"284.84333333333336\" r=\"3.6\" />\n        <circle cx=\"867.895\" cy=\"294.50333333333333\" r=\"3.6\" />\n        <circle cx=\"884.5283333333333\" cy=\"294.5133333333334\" r=\"3.6\" />\n        <circle cx=\"876.215\" cy=\"299.3383333333333\" r=\"3.6\" />\n        <circle cx=\"859.6583333333333\" cy=\"318.6666666666667\" r=\"3.6\" />\n        <circle cx=\"868.0050000000001\" cy=\"323.51166666666666\" r=\"3.6\" />\n        <circle cx=\"851.3116666666666\" cy=\"323.52666666666664\" r=\"3.6\" />\n        <circle cx=\"892.8250000000002\" cy=\"212.33333333333334\" r=\"3.6\" />\n        <circle cx=\"892.8249999999999\" cy=\"202.66333333333333\" r=\"3.6\" />\n        <circle cx=\"892.805\" cy=\"231.65833333333333\" r=\"3.6\" />\n        <circle cx=\"909.4733333333334\" cy=\"251\" r=\"3.6\" />\n        <circle cx=\"901.1066666666666\" cy=\"246.16833333333332\" r=\"3.6\" />\n        <circle cx=\"901.1366666666667\" cy=\"236.51500000000001\" r=\"3.6\" />\n        <circle cx=\"892.8650000000001\" cy=\"260.6766666666667\" r=\"3.6\" />\n        <circle cx=\"901.0566666666667\" cy=\"294.52000000000004\" r=\"3.6\" />\n        <circle cx=\"901.0633333333334\" cy=\"304.18666666666667\" r=\"3.6\" />\n        <circle cx=\"909.41\" cy=\"289.66333333333336\" r=\"3.6\" />\n        <circle cx=\"892.8533333333334\" cy=\"328.3566666666666\" r=\"3.6\" />\n        <circle cx=\"925.9233333333333\" cy=\"134.97666666666666\" r=\"3.6\" />\n        <circle cx=\"934.2800000000001\" cy=\"130.14333333333335\" r=\"3.6\" />\n        <circle cx=\"925.9283333333333\" cy=\"125.28666666666665\" r=\"3.6\" />\n        <circle cx=\"917.7133333333335\" cy=\"168.81666666666666\" r=\"3.6\" />\n        <circle cx=\"909.39\" cy=\"173.645\" r=\"3.6\" />\n        <circle cx=\"925.9933333333335\" cy=\"163.96833333333333\" r=\"3.6\" />\n        <circle cx=\"934.2449999999999\" cy=\"149.48333333333332\" r=\"3.6\" />\n        <circle cx=\"934.305\" cy=\"159.14166666666668\" r=\"3.6\" />\n        <circle cx=\"917.7950000000001\" cy=\"265.49333333333334\" r=\"3.6\" />\n        <circle cx=\"917.7366666666667\" cy=\"304.17333333333335\" r=\"3.6\" />\n        <circle cx=\"909.4350000000001\" cy=\"328.34999999999997\" r=\"3.6\" />\n        <circle cx=\"917.79\" cy=\"323.5\" r=\"3.6\" />\n        <circle cx=\"934.2900000000001\" cy=\"294.51666666666665\" r=\"3.6\" />\n        <circle cx=\"942.685\" cy=\"454.07166666666666\" r=\"3.6\" />\n        <circle cx=\"950.9983333333333\" cy=\"449.2033333333333\" r=\"3.6\" />\n        <circle cx=\"967.5749999999999\" cy=\"323.52833333333336\" r=\"3.6\" />\n        <circle cx=\"959.2516666666667\" cy=\"309\" r=\"3.6\" />\n        <circle cx=\"992.5649999999999\" cy=\"328.34999999999997\" r=\"3.6\" />\n        <circle cx=\"976.3714285714285\" cy=\"318.94714285714286\" r=\"3.6\" />\n        <circle cx=\"983.7371428571429\" cy=\"323.2271428571429\" r=\"3.6\" />\n        <circle cx=\"967.585\" cy=\"313.82166666666666\" r=\"3.6\" />\n        <circle cx=\"959.2433333333333\" cy=\"318.67333333333335\" r=\"3.6\" />\n        <circle cx=\"1000.805\" cy=\"313.84\" r=\"3.6\" />\n        <circle cx=\"951.025\" cy=\"410.54333333333335\" r=\"3.6\" />\n        <circle cx=\"934.41\" cy=\"400.8733333333333\" r=\"3.6\" />\n        <circle cx=\"917.8000000000001\" cy=\"391.1933333333333\" r=\"3.6\" />\n        <circle cx=\"942.685\" cy=\"415.38000000000005\" r=\"3.6\" />\n        <circle cx=\"942.6850000000001\" cy=\"405.71333333333337\" r=\"3.6\" />\n        <circle cx=\"909.4816666666666\" cy=\"386.3583333333333\" r=\"3.6\" />\n        <circle cx=\"926.1166666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n        <circle cx=\"892.85\" cy=\"386.375\" r=\"3.6\" />\n        <circle cx=\"909.46\" cy=\"376.68833333333333\" r=\"3.6\" />\n        <circle cx=\"884.6\" cy=\"391.2083333333333\" r=\"3.6\" />\n        <circle cx=\"892.8699999999999\" cy=\"396.04333333333335\" r=\"3.6\" />\n        <circle cx=\"884.61\" cy=\"400.8733333333333\" r=\"3.6\" />\n        <circle cx=\"901.1999999999999\" cy=\"391.19666666666666\" r=\"3.6\" />\n        <circle cx=\"901.1783333333333\" cy=\"381.53999999999996\" r=\"3.6\" />\n        <circle cx=\"959.2783333333333\" cy=\"376.68833333333333\" r=\"3.6\" />\n        <circle cx=\"967.5749999999999\" cy=\"371.8533333333333\" r=\"3.6\" />\n        <circle cx=\"950.985\" cy=\"371.8633333333334\" r=\"3.6\" />\n        <circle cx=\"942.6750000000001\" cy=\"357.34833333333336\" r=\"3.6\" />\n        <circle cx=\"975.9249999999998\" cy=\"367.01666666666665\" r=\"3.6\" />\n        <circle cx=\"942.69\" cy=\"347.6933333333333\" r=\"3.6\" />\n        <circle cx=\"967.6150000000001\" cy=\"400.85999999999996\" r=\"3.6\" />\n        <circle cx=\"976.3914285714287\" cy=\"376.96000000000004\" r=\"3.6\" />\n        <circle cx=\"959.3183333333333\" cy=\"415.3666666666666\" r=\"3.6\" />\n        <circle cx=\"959.3183333333335\" cy=\"405.69666666666666\" r=\"3.6\" />\n        <circle cx=\"967.6149999999999\" cy=\"391.1933333333333\" r=\"3.6\" />\n        <circle cx=\"976.4171428571428\" cy=\"386.62857142857143\" r=\"3.6\" />\n        <circle cx=\"884.5916666666666\" cy=\"420.23499999999996\" r=\"3.6\" />\n        <circle cx=\"959.3000000000001\" cy=\"386.35833333333335\" r=\"3.6\" />\n        <circle cx=\"867.9949999999999\" cy=\"400.85999999999996\" r=\"3.6\" />\n        <circle cx=\"967.5949999999999\" cy=\"381.52500000000003\" r=\"3.6\" />\n        <circle cx=\"951.015\" cy=\"391.19666666666666\" r=\"3.6\" />\n        <circle cx=\"942.665\" cy=\"386.375\" r=\"3.6\" />\n        <circle cx=\"876.3183333333333\" cy=\"396.02833333333336\" r=\"3.6\" />\n        <circle cx=\"967.5949999999999\" cy=\"342.84666666666664\" r=\"3.6\" />\n        <circle cx=\"917.7600000000001\" cy=\"371.8533333333333\" r=\"3.6\" />\n        <circle cx=\"934.3650000000001\" cy=\"352.5333333333333\" r=\"3.6\" />\n        <circle cx=\"934.38\" cy=\"381.52833333333325\" r=\"3.6\" />\n        <circle cx=\"959.3133333333334\" cy=\"434.715\" r=\"3.6\" />\n        <circle cx=\"868.025\" cy=\"420.21333333333337\" r=\"3.6\" />\n        <circle cx=\"942.6750000000001\" cy=\"338.02000000000004\" r=\"3.6\" />\n        <circle cx=\"942.695\" cy=\"434.7383333333334\" r=\"3.6\" />\n        <circle cx=\"934.3699999999999\" cy=\"371.8633333333334\" r=\"3.6\" />\n        <circle cx=\"942.6449999999999\" cy=\"376.7033333333333\" r=\"3.6\" />\n        <circle cx=\"950.995\" cy=\"381.53999999999996\" r=\"3.6\" />\n        <circle cx=\"926.0766666666667\" cy=\"367.0183333333334\" r=\"3.6\" />\n        <circle cx=\"959.3183333333333\" cy=\"396.02833333333336\" r=\"3.6\" />\n        <circle cx=\"934.3699999999999\" cy=\"362.19666666666666\" r=\"3.6\" />\n        <circle cx=\"917.7800000000001\" cy=\"381.52500000000003\" r=\"3.6\" />\n        <circle cx=\"951.025\" cy=\"400.8733333333333\" r=\"3.6\" />\n        <circle cx=\"926.0766666666667\" cy=\"376.68833333333333\" r=\"3.6\" />\n        <circle cx=\"926.0966666666667\" cy=\"386.3583333333333\" r=\"3.6\" />\n        <circle cx=\"934.4\" cy=\"391.2083333333333\" r=\"3.6\" />\n        <circle cx=\"942.6850000000001\" cy=\"396.04333333333335\" r=\"3.6\" />\n        <circle cx=\"942.6449999999999\" cy=\"367.0333333333333\" r=\"3.6\" />\n        <circle cx=\"917.75\" cy=\"352.5083333333334\" r=\"3.6\" />\n        <circle cx=\"901.1383333333333\" cy=\"362.17833333333334\" r=\"3.6\" />\n        <circle cx=\"975.9249999999998\" cy=\"357.34666666666664\" r=\"3.6\" />\n        <circle cx=\"892.82\" cy=\"367.02833333333336\" r=\"3.6\" />\n        <circle cx=\"867.9649999999998\" cy=\"381.53000000000003\" r=\"3.6\" />\n        <circle cx=\"876.2466666666666\" cy=\"376.67\" r=\"3.6\" />\n        <circle cx=\"884.5466666666667\" cy=\"371.8500000000001\" r=\"3.6\" />\n        <circle cx=\"926.0416666666666\" cy=\"347.66833333333335\" r=\"3.6\" />\n        <circle cx=\"967.585\" cy=\"352.49666666666667\" r=\"3.6\" />\n        <circle cx=\"959.2783333333333\" cy=\"367.01833333333326\" r=\"3.6\" />\n        <circle cx=\"967.5650000000002\" cy=\"362.17833333333334\" r=\"3.6\" />\n        <circle cx=\"950.9899999999999\" cy=\"362.195\" r=\"3.6\" />\n        <circle cx=\"934.3400000000001\" cy=\"342.84833333333336\" r=\"3.6\" />\n        <circle cx=\"909.4499999999999\" cy=\"357.3433333333334\" r=\"3.6\" />\n        <circle cx=\"976.4357142857143\" cy=\"415.09\" r=\"3.6\" />\n        <circle cx=\"967.6650000000001\" cy=\"429.8666666666666\" r=\"3.6\" />\n        <circle cx=\"951.0183333333333\" cy=\"429.8833333333334\" r=\"3.6\" />\n        <circle cx=\"983.4525\" cy=\"400.86\" r=\"3.6\" />\n        <circle cx=\"934.3666666666667\" cy=\"429.88166666666666\" r=\"3.6\" />\n        <circle cx=\"983.4525000000001\" cy=\"410.52750000000003\" r=\"3.6\" />\n        <circle cx=\"926.0866666666666\" cy=\"415.38499999999993\" r=\"3.6\" />\n        <circle cx=\"892.9016666666666\" cy=\"415.3983333333333\" r=\"3.6\" />\n        <circle cx=\"901.2199999999999\" cy=\"410.5483333333334\" r=\"3.6\" />\n        <circle cx=\"876.3183333333333\" cy=\"415.3666666666666\" r=\"3.6\" />\n        <circle cx=\"909.5016666666667\" cy=\"405.6966666666667\" r=\"3.6\" />\n        <circle cx=\"917.79\" cy=\"410.5316666666667\" r=\"3.6\" />\n        <circle cx=\"967.6416666666668\" cy=\"420.215\" r=\"3.6\" />\n        <circle cx=\"876.3183333333333\" cy=\"405.6966666666667\" r=\"3.6\" />\n        <circle cx=\"909.5016666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n        <circle cx=\"884.61\" cy=\"410.54333333333335\" r=\"3.6\" />\n        <circle cx=\"867.995\" cy=\"410.5266666666667\" r=\"3.6\" />\n        <circle cx=\"892.8699999999999\" cy=\"405.71333333333337\" r=\"3.6\" />\n        <circle cx=\"901.21\" cy=\"400.8733333333333\" r=\"3.6\" />\n        <circle cx=\"867.9949999999999\" cy=\"391.1933333333333\" r=\"3.6\" />\n        <circle cx=\"909.46\" cy=\"367.01833333333326\" r=\"3.6\" />\n        <circle cx=\"876.2983333333333\" cy=\"386.35833333333335\" r=\"3.6\" />\n        <circle cx=\"917.7600000000001\" cy=\"362.18333333333334\" r=\"3.6\" />\n        <circle cx=\"901.1683333333334\" cy=\"371.8633333333334\" r=\"3.6\" />\n        <circle cx=\"884.58\" cy=\"381.52833333333325\" r=\"3.6\" />\n        <circle cx=\"892.83\" cy=\"376.7033333333333\" r=\"3.6\" />\n        <circle cx=\"959.3149999999999\" cy=\"425.03666666666663\" r=\"3.6\" />\n        <circle cx=\"967.6149999999999\" cy=\"410.52666666666664\" r=\"3.6\" />\n        <circle cx=\"926.0766666666667\" cy=\"357.3500000000001\" r=\"3.6\" />\n        <circle cx=\"976.785\" cy=\"405.69375\" r=\"3.6\" />\n        <circle cx=\"983.7742857142857\" cy=\"381.2442857142857\" r=\"3.6\" />\n        <circle cx=\"976.7850000000001\" cy=\"396.02625\" r=\"3.6\" />\n        <circle cx=\"983.4525000000001\" cy=\"391.19250000000005\" r=\"3.6\" />\n        <circle cx=\"917.8000000000001\" cy=\"400.85999999999996\" r=\"3.6\" />\n        <circle cx=\"934.41\" cy=\"410.54333333333335\" r=\"3.6\" />\n        <circle cx=\"926.1166666666667\" cy=\"405.6966666666667\" r=\"3.6\" />\n        <circle cx=\"934.39\" cy=\"420.22333333333336\" r=\"3.6\" />\n        <circle cx=\"951.0216666666666\" cy=\"420.21000000000004\" r=\"3.6\" />\n        <circle cx=\"942.68\" cy=\"425.0466666666667\" r=\"3.6\" />\n        <circle cx=\"1017.485\" cy=\"323.49333333333334\" r=\"3.6\" />\n        <circle cx=\"1009.2283333333334\" cy=\"463.70166666666665\" r=\"3.6\" />\n        <circle cx=\"1000.8916666666665\" cy=\"468.5466666666667\" r=\"3.6\" />\n        <circle cx=\"1017.525\" cy=\"458.8616666666667\" r=\"3.6\" />\n        <circle cx=\"1025.8149999999998\" cy=\"454.00666666666666\" r=\"3.6\" />\n        <circle cx=\"1034.0249999999999\" cy=\"371.8533333333333\" r=\"3.6\" />\n        <circle cx=\"1034.0449999999998\" cy=\"439.5416666666667\" r=\"3.6\" />\n        <circle cx=\"1042.4\" cy=\"434.6983333333333\" r=\"3.6\" />\n        <circle cx=\"1042.4\" cy=\"425.0333333333333\" r=\"3.6\" />\n        <circle cx=\"1075.54\" cy=\"357.3333333333333\" r=\"3.6\" />\n    </svg>\n</template>\n\n<script>\n\n    export default{\n\n    }\n\n</script>\n\n\n<style>\n\n    <style>\n\n        /* map styling */\n\n\n    svg .WebDollarNativeMap{\n\n        margin: auto;\n        opacity: 1;\n        transition: 1s opacity;\n\n        /* we have the map as background image such that we can display:none the hexagons\n        in the svg which greatly improves performance on firefox */\n\n        /*\n            SVG file!!!!!!!!!!!!\n         */\n        background-image: url('');\n    }\n\n\n    svg.WebDollarNativeMap.hide-circles circle {\n        fill: #26292b;\n    }\n\n    .peer-own {\n        display: block !important;\n        fill: white !important;\n        -webkit-animation: connected 1800ms ease 5;\n        animation: connected 1800ms ease 8;\n    }\n\n    .peer-connected-terminal {\n        display: block !important;\n        fill: #fec02c !important;\n        -webkit-animation: connected 1800ms ease 10;\n        animation: connected 1800ms ease 3;\n    }\n\n    .peer-connected-browser {\n        display: block !important;\n        fill: #ff0000 !important;\n        -webkit-animation: connected 1800ms ease 10;\n        animation: connected 1800ms ease 3;\n    }\n\n    .peer-own,\n    .peer-connected-terminal,\n    .peer-connected-browser {\n        will-change: opacity;\n    }\n\n\n    .link {\n        stroke: #dedede;\n        stroke-width: 1;\n        stroke-dasharray: 5 5;\n        opacity: 0.5;\n    }\n\n\n    @media  screen and  (max-width: 480px) {\n        svg.WebDollarNativeMap{\n            box-sizing: border-box;\n            transform: scale(1.15);\n        }\n    }\n\n    @media   screen and  (max-width: 800px) {\n\n        /* disable map animations when map is in background */\n        .peer-own,  .peer-connected-browser, .peer-connected-terminal {\n            -webkit-animation: none;\n            animation: none;\n            will-change: initial;\n        }\n\n        svg.WebDollarNativeMap{\n            box-sizing: border-box;\n            transform: scale(1.05);\n        }\n\n    }\n\n\n    /* Large Screen */\n\n    @media screen and (min-width: 1080px) {\n        svg.WebDollarNativeMap {\n            box-sizing: border-box;\n            transform: scale(0.9);\n        }\n    }\n\n    @media screen and (min-width: 1400px) {\n        svg.WebDollarNativeMap {\n            box-sizing: border-box;\n            transform: scale(0.8);\n        }\n    }\n\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      staticClass: "hide-circles WebDollarNativeMap",
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1082 502",
        preserveAspectRatio: "xMinYMin meet",
        "xml:space": "preserve"
      }
    },
    [
      _c("circle", {
        attrs: { cx: "909.4049999999999", cy: "270.32666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.5949999999999", cy: "309.0416666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.9049999999999", cy: "304.16833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "13.805", cy: "222.02166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "5.45", cy: "217.17833333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "46.903333333333336", cy: "105.98666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "55.245000000000005", cy: "101.14333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.06166666666667", cy: "23.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.38500000000005", cy: "18.933333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.75499999999994", cy: "18.93666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.21833333333333", cy: "212.3283333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.57500000000002", cy: "217.1716666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.49999999999994", cy: "221.98333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.14500000000004", cy: "226.83833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.39", cy: "236.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.76666666666665", cy: "9.238333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.4366666666666", cy: "14.103333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.7616666666667", cy: "18.965", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.66", cy: "14.141666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "378.97499999999997", cy: "9.268333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "387.32500000000005", cy: "4.428333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.365", cy: "9.261666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.0783333333333", cy: "14.121666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.98499999999996", cy: "483.0466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.53", cy: "260.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.725", cy: "188.17500000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.71", cy: "178.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.4983333333334", cy: "270.33666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.09333333333336", cy: "309.0083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.77", cy: "294.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.79333333333335", cy: "304.17499999999995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.77", cy: "275.16333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.71", cy: "168.83333333333331", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.77", cy: "284.8333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.41666666666666", cy: "163.98833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.47", cy: "120.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.76", cy: "134.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.135", cy: "115.65666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.76", cy: "125.31666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.1", cy: "159.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.76", cy: "144.65333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.77999999999997", cy: "154.32", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.11333333333334", cy: "318.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.93", cy: "101.13666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.97499999999997", cy: "304.18833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.00666666666666", cy: "323.5216666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.595", cy: "333.1766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.3", cy: "328.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.27000000000004", cy: "279.9916666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.965", cy: "294.5133333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "320.94", cy: "110.81", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "320.965", cy: "284.8433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.66666666666663", cy: "328.3566666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "163.14", cy: "105.99", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "321.00666666666666", cy: "333.19166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.4083333333333", cy: "323.5216666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.605", cy: "342.84499999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.3", cy: "338.01666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.31", cy: "347.68333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.0133333333334", cy: "342.8633333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.0233333333333", cy: "352.52666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.99666666666667", cy: "313.84666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.645", cy: "309.02500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.66666666666663", cy: "318.69", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.3983333333333", cy: "313.8583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.0733333333333", cy: "299.3383333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.37833333333333", cy: "304.17833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.625", cy: "299.3533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.625", cy: "280.0133333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.9833333333333", cy: "275.18333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.625", cy: "289.68333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.85", cy: "255.8016666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.55333333333337", cy: "188.165", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.21833333333333", cy: "183.34333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.56499999999997", cy: "197.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.905", cy: "178.49833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.9266666666667", cy: "120.47166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.07166666666666", cy: "289.66833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.07166666666666", cy: "279.99833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.10166666666663", cy: "270.33333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.50333333333333", cy: "81.81", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.885", cy: "91.47333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.955", cy: "96.32333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.58833333333334", cy: "96.30833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.67999999999998", cy: "91.48333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.29333333333332", cy: "91.48333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.58500000000004", cy: "115.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.38666666666668", cy: "96.30833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.76999999999998", cy: "96.30833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.06999999999996", cy: "91.47333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.48000000000002", cy: "91.48333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.58000000000004", cy: "86.63", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.59000000000003", cy: "96.30666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.59000000000003", cy: "105.97333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.54", cy: "76.97166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.875", cy: "72.11666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.14", cy: "96.32333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.835", cy: "86.61833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.21666666666667", cy: "86.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.47833333333335", cy: "149.50666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.3", cy: "318.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.595", cy: "323.50666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.28000000000003", cy: "309.0083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.91333333333324", cy: "338.0166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.91333333333324", cy: "328.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.615", cy: "284.8333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.22166666666664", cy: "96.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.23", cy: "105.96333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.26", cy: "289.66833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.26", cy: "299.3383333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.67833333333334", cy: "347.695", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.69", cy: "357.3666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.02833333333336", cy: "362.19666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.66666666666663", cy: "338.02666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.32", cy: "357.34999999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.32", cy: "367.0183333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.6166666666667", cy: "352.5133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.93", cy: "91.47000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.52", cy: "81.78666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.93500000000003", cy: "76.985", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.56666666666663", cy: "76.96833333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "221.26", cy: "72.15", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "196.365", cy: "76.96833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.64666666666665", cy: "72.13833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.4483333333333", cy: "72.15", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "163.12", cy: "76.985", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "179.75", cy: "76.96833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.04833333333332", cy: "72.135", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.845", cy: "76.93666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.22166666666664", cy: "86.62333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.5", cy: "62.468333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.16499999999996", cy: "57.613333333333344", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.4083333333333", cy: "333.19166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.795", cy: "67.31333333333332", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "237.865", cy: "72.135", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "246.17666666666665", cy: "67.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.47000000000003", cy: "62.46333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.92333333333335", cy: "347.6816666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.06999999999996", cy: "81.80333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.38666666666668", cy: "86.63833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.815", cy: "81.82166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.76999999999998", cy: "86.63833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.955", cy: "86.65333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.85166666666666", cy: "101.17", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.81833333333333", cy: "120.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.47000000000003", cy: "81.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.14", cy: "86.65333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.91999999999996", cy: "81.79666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.21999999999997", cy: "76.94500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.11333333333334", cy: "328.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.28166666666667", cy: "81.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.13", cy: "125.32666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.48166666666665", cy: "72.12833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.1966666666667", cy: "76.965", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.58833333333334", cy: "86.63833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.885", cy: "81.80333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "262.835", cy: "76.96", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "271.215", cy: "255.8216666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "271.195", cy: "275.185", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "271.22499999999997", cy: "265.5033333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.46833333333333", cy: "130.16166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.4733333333333", cy: "279.99833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.4733333333333", cy: "299.33833333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.815", cy: "323.50666666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "287.815", cy: "313.84", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "279.49499999999995", cy: "309.0083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.4733333333333", cy: "289.66833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.80166666666665", cy: "163.98833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.61833333333334", cy: "173.6583333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "171.5", cy: "159.16", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "171.46833333333333", cy: "139.83166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.41666666666666", cy: "173.6583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.41666666666666", cy: "183.32833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.4433333333333", cy: "193.00666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.1", cy: "168.82333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.66833333333332", cy: "81.81833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.28333333333333", cy: "130.16166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.57500000000002", cy: "134.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.50666666666666", cy: "120.47500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.20666666666668", cy: "125.31333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.875", cy: "130.14666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.57499999999996", cy: "144.65333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.89499999999998", cy: "149.48499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.94500000000002", cy: "134.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.28333333333333", cy: "139.83166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.50333333333333", cy: "139.81666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.135", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.50333333333333", cy: "130.14666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.20666666666668", cy: "134.98333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.43", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.795", cy: "134.98333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.795", cy: "125.31333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.22833333333332", cy: "154.315", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.20666666666668", cy: "144.65", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.875", cy: "139.81666666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.875", cy: "120.47666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.21", cy: "115.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.8", cy: "115.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.57500000000002", cy: "125.31666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.51166666666668", cy: "110.80833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.67166666666665", cy: "120.49166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.67", cy: "130.16166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.28666666666666", cy: "120.49333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.94500000000002", cy: "125.32666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.72499999999997", cy: "130.13", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.755", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.135", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.44", cy: "144.64333333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "262.795", cy: "144.65", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "279.43", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.0516666666667", cy: "134.98", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.1383333333333", cy: "120.47500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.51333333333332", cy: "149.47833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "121.65333333333332", cy: "62.47666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.13500000000002", cy: "28.60166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.63", cy: "43.126666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.41333333333333", cy: "43.12166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.04666666666665", cy: "43.10166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "129.945", cy: "57.633333333333326", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.76500000000004", cy: "304.1683333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.91", cy: "178.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "295.99499999999995", cy: "28.588333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.53999999999996", cy: "18.93666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.225", cy: "43.12166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "105.07333333333334", cy: "81.82166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "121.63166666666666", cy: "72.16833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.54333333333332", cy: "38.263333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.08", cy: "497.58500000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.92166666666665", cy: "197.86", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "105.01333333333334", cy: "52.80833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "80.14833333333333", cy: "86.63833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "71.80166666666666", cy: "91.49000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.725", cy: "425.0466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.85666666666665", cy: "91.46999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.67", cy: "139.83166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.805", cy: "265.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.82666666666665", cy: "110.82333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.3066666666667", cy: "91.45666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.375", cy: "275.1716666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.365", cy: "284.8433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.38", cy: "115.64666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.3666666666667", cy: "294.5133333333334", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "221.335", cy: "178.51", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "154.83833333333334", cy: "62.47666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.47", cy: "197.84333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.02833333333336", cy: "371.8633333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.545", cy: "57.63333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.84166666666664", cy: "33.43833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.72", cy: "434.7166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.03833333333336", cy: "381.53999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.06499999999997", cy: "110.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.67666666666665", cy: "110.82333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.885", cy: "101.13999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.45", cy: "105.95166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.72999999999996", cy: "110.79333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.0066666666667", cy: "105.94", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "295.97499999999997", cy: "96.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.21666666666667", cy: "96.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.51333333333332", cy: "91.47333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.805", cy: "96.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.15", cy: "91.46833333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "279.46", cy: "96.29", r: "3.6" } }),
      _c("circle", { attrs: { cx: "320.9", cy: "130.165", r: "3.6" } }),
      _c("circle", { attrs: { cx: "312.69", cy: "270.325", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "329.22999999999996", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.4166666666667", cy: "265.5133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.33000000000004", cy: "101.13666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.3283333333334", cy: "110.80499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.32166666666666", cy: "120.47166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.58000000000004", cy: "125.31333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.29333333333332", cy: "101.15333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.06000000000003", cy: "130.14666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.58833333333334", cy: "105.97666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.06000000000003", cy: "139.8166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.06000000000003", cy: "120.47666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.98499999999999", cy: "173.67333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.98499999999999", cy: "164.00333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.39666666666665", cy: "154.31833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.765", cy: "115.64666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.69999999999996", cy: "159.17333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.08", cy: "149.48499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.67999999999998", cy: "101.15333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.38666666666668", cy: "105.97666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "212.955", cy: "105.99", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "296.13", cy: "260.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.4766666666667", cy: "110.82000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.48000000000002", cy: "101.15333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.76999999999998", cy: "105.97666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.06999999999996", cy: "101.13999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.02833333333336", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.72499999999997", cy: "120.46333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.43499999999995", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.035", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.33", cy: "130.1483333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.94499999999996", cy: "144.66666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.51333333333332", cy: "101.13999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.14166666666665", cy: "110.80166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.805", cy: "105.97333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.145", cy: "101.13666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.59666666666666", cy: "154.31833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.21666666666667", cy: "105.97333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.915", cy: "159.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.25", cy: "163.98666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.29333333333332", cy: "149.50666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.5333333333334", cy: "159.16", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.145", cy: "149.48666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.81500000000005", cy: "154.315", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.41833333333335", cy: "255.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.5533333333333", cy: "168.83", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.32500000000002", cy: "168.83333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.965", cy: "154.33499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.61833333333334", cy: "163.98833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.31500000000003", cy: "159.16", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.915", cy: "168.82333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.8666666666667", cy: "164.00333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.18", cy: "159.14833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.88", cy: "110.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.56333333333336", cy: "178.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.25", cy: "173.65666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.29166666666666", cy: "110.82", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "213.01500000000001", cy: "183.36166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.95000000000002", cy: "115.65666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.58166666666668", cy: "115.64666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.37666666666667", cy: "144.65333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.37666666666667", cy: "125.31666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.67999999999998", cy: "149.49499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.37666666666667", cy: "134.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.81000000000003", cy: "72.16000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.1566666666667", cy: "386.35833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.82500000000005", cy: "362.19000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.135", cy: "376.68833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.81500000000005", cy: "371.8533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.855", cy: "391.1933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.46999999999997", cy: "458.87833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.46000000000004", cy: "449.21666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.16833333333335", cy: "434.70666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.845", cy: "429.8666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.55666666666664", cy: "304.18", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.885", cy: "328.3566666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.83500000000004", cy: "352.5133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.5816666666667", cy: "323.53000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.225", cy: "309.03000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.57833333333338", cy: "313.8616666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.52500000000003", cy: "347.68333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.22499999999997", cy: "342.8633333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.875", cy: "338.0316666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.13666666666666", cy: "444.39166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.24666666666667", cy: "381.53333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.50500000000005", cy: "367.0333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.2266666666667", cy: "371.8633333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.9549999999999", cy: "386.35833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "379.115", cy: "328.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "379.125", cy: "338.02333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.82500000000005", cy: "342.8633333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.83500000000004", cy: "352.52666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.84", cy: "362.19666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.69", cy: "410.54333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.65999999999997", cy: "400.86000000000007", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.36999999999995", cy: "434.70666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.47166666666664", cy: "478.23999999999995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.49", cy: "468.55833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.8233333333333", cy: "483.06333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.36499999999995", cy: "425.0433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.13666666666666", cy: "463.715", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.36", cy: "415.36666666666673", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.9766666666667", cy: "396.02833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.025", cy: "52.79666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.73", cy: "57.63333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.245", cy: "62.46333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.34333333333333", cy: "57.63333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.4383333333333", cy: "52.81166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.245", cy: "52.79666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.545", cy: "47.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.10000000000002", cy: "57.64666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.83833333333334", cy: "52.81166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.63666666666666", cy: "52.81166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.76500000000004", cy: "47.96333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.465", cy: "43.12833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.13666666666666", cy: "38.31166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.915", cy: "57.64666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.105", cy: "52.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.84333333333333", cy: "52.796666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.25", cy: "52.81166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.545", cy: "57.63333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.47", cy: "207.51166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.45833333333334", cy: "221.99499999999998", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "204.75", cy: "226.84", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "188.12", cy: "217.16666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.82166666666663", cy: "212.33666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.53833333333333", cy: "294.5116666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.69000000000003", cy: "241.34500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.29000000000005", cy: "260.68833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "213.025", cy: "231.68500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.545", cy: "67.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.38", cy: "236.51166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.48499999999999", cy: "188.1933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.59833333333333", cy: "154.31833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.295", cy: "159.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.255", cy: "139.81666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.57833333333335", cy: "144.65333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.61833333333334", cy: "163.98833333333334", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "163.16", cy: "183.35", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "146.58666666666667", cy: "173.67499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.8166666666667", cy: "222.01", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.68500000000003", cy: "251.005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.19333333333336", cy: "299.3533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "213.035", cy: "241.36166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.35500000000002", cy: "246.205", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.995", cy: "255.83333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.87", cy: "347.6983333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "271.205", cy: "352.545", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "254.57333333333335", cy: "333.1933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.23499999999999", cy: "318.69", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.47", cy: "217.18166666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.57833333333332", cy: "183.34166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.60666666666665", cy: "192.98", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.29500000000002", cy: "168.82333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.53", cy: "357.35166666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.74", cy: "236.53999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.42666666666665", cy: "231.69000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.4083333333333", cy: "57.623333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.12", cy: "226.84666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "379.155", cy: "367.0183333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.84999999999997", cy: "371.86999999999995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.26500000000001", cy: "149.49", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.535", cy: "376.72166666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.28999999999996", cy: "391.2033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.29", cy: "400.8733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "379.15500000000003", cy: "357.3500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "387.47333333333336", cy: "333.1766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "387.47333333333336", cy: "323.50666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "379.15000000000003", cy: "347.68", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.40000000000003", cy: "492.71166666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.44666666666666", cy: "487.8966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.14666666666665", cy: "473.37833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.105", cy: "454.03833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.845", cy: "439.5366666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.82500000000005", cy: "381.53000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.78166666666664", cy: "492.7183333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.7183333333333", cy: "420.19833333333327", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.9933333333334", cy: "405.70666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "105.01833333333333", cy: "62.471666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.01000000000005", cy: "38.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.51500000000004", cy: "38.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "320.8433333333333", cy: "23.796666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.65999999999997", cy: "33.446666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.105", cy: "43.116666666666674", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "262.785", cy: "38.275", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "254.465", cy: "33.446666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.265", cy: "72.15833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.80833333333337", cy: "33.46", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.17", cy: "28.60166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.18666666666667", cy: "304.1716666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.46166666666664", cy: "309.02500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.4983333333334", cy: "33.425000000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "387.47333333333336", cy: "313.84", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "379.1133333333333", cy: "308.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.81333333333333", cy: "38.26333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.10666666666674", cy: "43.123333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.15000000000003", cy: "101.13666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.4083333333333", cy: "47.94166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "96.70166666666667", cy: "67.27999999999999", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "88.395", cy: "72.14", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "379.1133333333334", cy: "318.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "88.46499999999999", cy: "81.81666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "113.31500000000001", cy: "57.64666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "129.945", cy: "67.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "113.31500000000001", cy: "67.31333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "105.04833333333333", cy: "72.14333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "96.75333333333333", cy: "76.96833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.34333333333333", cy: "47.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.73", cy: "47.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.10000000000002", cy: "47.97666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.55499999999998", cy: "47.961666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "121.62166666666666", cy: "52.79500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.915", cy: "47.97666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "129.935", cy: "47.96000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "138.235", cy: "43.120000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.84833333333333", cy: "43.13666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.82", cy: "333.19166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.91333333333336", cy: "318.6766666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "337.595", cy: "313.84", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "354.2066666666667", cy: "323.5216666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.48499999999996", cy: "328.3566666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.58500000000004", cy: "294.4866666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.52", cy: "101.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.7833333333333", cy: "115.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.07", cy: "400.8733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.52", cy: "91.45333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "337.575", cy: "304.175", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "337.6166666666667", cy: "371.8533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.32", cy: "376.68833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.34000000000003", cy: "386.3583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.06", cy: "391.19666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.22166666666664", cy: "352.53333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.21166666666664", cy: "342.85833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.935", cy: "357.34999999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.6166666666667", cy: "362.18333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.20666666666665", cy: "333.19166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "229.545", cy: "67.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.25", cy: "62.47666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "212.915", cy: "67.31333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "237.84333333333336", cy: "62.46333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "246.17666666666665", cy: "57.63", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "204.63666666666666", cy: "62.47666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.73", cy: "67.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.025", cy: "62.46333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.34333333333333", cy: "67.29833333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "345.875", cy: "86.62", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "246.14666666666665", cy: "47.94666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.47", cy: "52.771666666666675", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "295.96666666666664", cy: "57.63499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.81333333333333", cy: "57.626666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.28000000000003", cy: "62.47833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.4383333333333", cy: "62.47666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.115", cy: "62.46666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.76500000000004", cy: "57.63", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.47000000000003", cy: "52.79666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.89", cy: "260.66999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.29666666666665", cy: "217.18333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.47500000000002", cy: "202.66333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.12", cy: "197.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.17999999999995", cy: "284.84333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.18", cy: "294.5133333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.87666666666667", cy: "270.3433333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "188.11", cy: "188.16", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "262.83500000000004", cy: "280.0083333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.1", cy: "178.49333333333334", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "163.15", cy: "154.335", r: "3.6" } }),
      _c("circle", { attrs: { cx: "271.19", cy: "304.19", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "163.13", cy: "134.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.84666666666666", cy: "130.14666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.13", cy: "144.66666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.80166666666665", cy: "173.6583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.17", cy: "164.00333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.51", cy: "168.83333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.815", cy: "333.1766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.73", cy: "396.04333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.69", cy: "376.7033333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "312.71", cy: "386.375", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "304.46999999999997", cy: "410.5433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.47", cy: "400.8733333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.73", cy: "415.38000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.17833333333334", cy: "405.69666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.4683333333333", cy: "420.21333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.17833333333334", cy: "415.36666666666673", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.51500000000004", cy: "328.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.11333333333334", cy: "338.01666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.73", cy: "405.7133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.21", cy: "313.84666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.51499999999993", cy: "318.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.42333333333335", cy: "352.5333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.4133333333333", cy: "342.8583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.42833333333334", cy: "362.19666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.69", cy: "367.0333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.43833333333333", cy: "381.52833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.6383333333333", cy: "381.52500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.935", cy: "376.68833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.65999999999997", cy: "391.1933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.36", cy: "396.02833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.93499999999995", cy: "367.01833333333326", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.50500000000005", cy: "357.3666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.36", cy: "405.6966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.49499999999995", cy: "347.695", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.2266666666667", cy: "362.19666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.07000000000005", cy: "410.54333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.78", cy: "454.05333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.74999999999994", cy: "444.40333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.105", cy: "468.54999999999995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.7916666666667", cy: "473.41166666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.77", cy: "463.70666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.0683333333334", cy: "420.21000000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.0683333333333", cy: "439.5566666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "321.06", cy: "429.8833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "362.48499999999996", cy: "338.0266666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "329.16999999999996", cy: "38.276666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "337.47", cy: "43.11500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.7966666666667", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.85833333333335", cy: "96.27666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.10666666666674", cy: "52.79333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.29833333333335", cy: "52.798333333333325", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "295.995", cy: "47.913333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "312.57", cy: "47.97666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "320.895", cy: "43.125", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "362.48499999999996", cy: "318.69", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.8066666666667", cy: "105.97500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.525", cy: "96.30833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.82", cy: "323.52166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.1966666666667", cy: "313.85833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "370.81", cy: "313.84666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "354.1466666666667", cy: "110.80499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.10000000000002", cy: "67.31333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.89333333333326", cy: "299.32666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "345.89333333333326", cy: "309.0083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "196.47500000000002", cy: "212.33333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "188.12", cy: "207.49666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.82166666666663", cy: "202.66666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.8116666666667", cy: "192.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "221.32833333333335", cy: "226.83666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "238.02666666666667", cy: "236.4983333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.53", cy: "284.8466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.845", cy: "289.68333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "254.59500000000003", cy: "265.5183333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "179.80166666666665", cy: "183.32833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.87", cy: "139.83166666666665", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "154.88", cy: "149.495", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "154.9", cy: "159.17333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.46", cy: "439.5516666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "171.51", cy: "178.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.845", cy: "299.3533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "163.17", cy: "173.67333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "154.91", cy: "168.83333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "146.54666666666665", cy: "134.97", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.17833333333334", cy: "396.02833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.4283333333333", cy: "371.8633333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.4583333333333", cy: "391.2083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.695", cy: "52.776666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.855", cy: "400.85999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.855", cy: "410.52666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "304.46166666666664", cy: "429.87999999999994", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.175", cy: "425.0366666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.85333333333335", cy: "420.195", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.21999999999997", cy: "333.19166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.865", cy: "309.02500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "271.22", cy: "323.5216666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "279.51499999999993", cy: "338.01666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "262.885", cy: "318.69000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.135", cy: "367.0183333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.135", cy: "357.34999999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "296.125", cy: "347.6816666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "287.82500000000005", cy: "342.84499999999997", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "412.455", cy: "492.73", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "420.52500000000003", cy: "33.45666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "428.81500000000005", cy: "28.60833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "403.91499999999996", cy: "52.79333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "403.91", cy: "43.12499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "428.8149999999999", cy: "18.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "412.195", cy: "38.29333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "387.27500000000003", cy: "52.776666666666664", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "395.57", cy: "28.625", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "420.52", cy: "23.78333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "403.8933333333334", cy: "23.78333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "412.185", cy: "18.953333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "395.59", cy: "47.93000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "412.205", cy: "9.261666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "428.81333333333333", cy: "9.258333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "445.41166666666663", cy: "9.235", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "461.9866666666667", cy: "9.261666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "395.6000000000001", cy: "67.31", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "453.7033333333334", cy: "43.14833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "395.555", cy: "38.281666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "412.185", cy: "28.623333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "403.90000000000003", cy: "33.45", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "445.4116666666667", cy: "18.938333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "437.1133333333333", cy: "23.77333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "453.7050000000001", cy: "23.78333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "395.62000000000006", cy: "57.61666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "403.925", cy: "62.468333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "428.845", cy: "47.95333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "420.55", cy: "52.79833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "412.23499999999996", cy: "57.64666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "387.27500000000003", cy: "62.44666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "387.25500000000005", cy: "23.77333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "445.4216666666666", cy: "38.278333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.3200000000001", cy: "23.786666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.60999999999996", cy: "9.263333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "395.57", cy: "18.919999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "437.165", cy: "43.12833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "462.0316666666667", cy: "38.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "428.825", cy: "38.27666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "445.41166666666663", cy: "28.60833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "437.1233333333333", cy: "33.443333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "453.71166666666676", cy: "33.45", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "461.99666666666667", cy: "28.641666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "412.205", cy: "47.96333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "420.535", cy: "43.12", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "420.52", cy: "14.116666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "437.1133333333333", cy: "14.103333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "403.8833333333334", cy: "14.11166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "453.705", cy: "14.116666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "461.965", cy: "18.95333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.31500000000005", cy: "14.123333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.305", cy: "62.48500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "461.99666666666667", cy: "57.61166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.62999999999994", cy: "57.61166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "486.99999999999994", cy: "101.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.54999999999995", cy: "81.80333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.5416666666667", cy: "101.145", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.905", cy: "96.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.5416666666667", cy: "91.46833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.4785714285714", cy: "18.662857142857142", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.6916666666666", cy: "18.958333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.3666666666667", cy: "14.098333333333331", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "568.995", cy: "14.086666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4699999999999", cy: "159.13666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.495", cy: "9.266666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.0899999999999", cy: "9.253333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7216666666667", cy: "38.275", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.37", cy: "33.428333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "651.9716666666667", cy: "23.776666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.685", cy: "28.58666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.2633333333334", cy: "18.908333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4133333333333", cy: "357.325", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.11", cy: "381.5383333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.08", cy: "362.1816666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.7133333333333", cy: "342.83", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.745", cy: "352.4916666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.08", cy: "371.8516666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4533333333334", cy: "367.00666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4533333333334", cy: "376.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "710.5749999999999", cy: "9.26", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4266666666667", cy: "14.11", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0166666666668", cy: "23.773333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.58", cy: "105.95833333333336", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "859.58", cy: "96.29", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "859.5749999999999", cy: "115.62833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.58", cy: "86.62333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9350000000001", cy: "144.65", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.2783333333333", cy: "120.47500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6599999999999", cy: "149.475", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.275", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.275", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.2866666666667", cy: "91.47000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.11", cy: "86.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4383333333334", cy: "81.79666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7400000000001", cy: "86.62333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5283333333334", cy: "221.98833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.66", cy: "91.46999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0366666666667", cy: "91.45333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9466666666666", cy: "86.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3683333333333", cy: "86.62333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8216666666667", cy: "81.80833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6533333333333", cy: "159.14666666666668", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "743.305", cy: "154.315", r: "3.6" } }),
      _c("circle", { attrs: { cx: "735.035", cy: "149.475", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "759.9583333333334", cy: "163.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7283333333334", cy: "144.63666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.255", cy: "159.13666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.7887499999999", cy: "134.96375", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4266666666666", cy: "139.79666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5499999999998", cy: "154.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.07", cy: "159.13666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.75", cy: "154.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.4", cy: "163.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.69", cy: "168.82166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4466666666667", cy: "149.48666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.68", cy: "159.15833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8333333333334", cy: "149.475", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.1183333333333", cy: "154.315", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7333333333333", cy: "105.95666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7283333333334", cy: "115.62666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "702.13875", cy: "139.7975", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "552.4266666666666", cy: "139.79666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.725", cy: "96.28166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7133333333334", cy: "125.30166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.255", cy: "101.12166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3516666666666", cy: "86.60166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9633333333334", cy: "96.27666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.66", cy: "91.43666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.2133333333334", cy: "168.8216666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.235", cy: "207.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.895", cy: "212.33333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.235", cy: "217.16333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.1883333333334", cy: "159.13166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.23", cy: "197.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.515", cy: "96.28666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.2133333333334", cy: "178.49", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "520.22", cy: "188.16", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "718.44", cy: "81.78666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.225", cy: "81.78666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7199999999999", cy: "76.95666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "710.1442857142857", cy: "77.23285714285716", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "702.14125", cy: "81.78125", r: "3.6" } }),
      _c("circle", { attrs: { cx: "743.275", cy: "76.965", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "759.9050000000001", cy: "76.95666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.0016666666667", cy: "72.125", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6", cy: "72.13666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "693.48", cy: "86.62", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "685.2033333333334", cy: "91.45166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4449999999999", cy: "101.10666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3566666666667", cy: "144.63666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.855", cy: "101.12166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1483333333333", cy: "105.94666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7633333333333", cy: "105.94666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.91", cy: "96.27666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3383333333334", cy: "96.27666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.595", cy: "101.10666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.54", cy: "86.62333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.2033333333334", cy: "101.12166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "702.1487500000001", cy: "91.45375000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.48", cy: "96.28666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.91", cy: "105.94666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.0233333333332", cy: "81.80833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.59", cy: "110.77500000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7416666666667", cy: "86.62333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.295", cy: "86.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.7987499999999", cy: "86.62", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.44", cy: "91.45333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8516666666666", cy: "110.79", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.14", cy: "115.61833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.515", cy: "105.95666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2516666666667", cy: "110.79333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9616666666667", cy: "105.94666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4399999999999", cy: "110.77666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3383333333334", cy: "105.94666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.76", cy: "115.61666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "652.015", cy: "110.79", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "851.2866666666667", cy: "101.13666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9466666666666", cy: "96.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.66", cy: "101.13666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.2816666666666", cy: "110.80166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3683333333333", cy: "96.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9350000000001", cy: "134.98333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.65", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.935", cy: "125.31333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9416666666666", cy: "115.64333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.11", cy: "96.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.225", cy: "91.45333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0366666666667", cy: "101.12333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "776.54", cy: "96.29", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "759.9250000000001", cy: "86.62333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8316666666666", cy: "91.46999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7400000000001", cy: "96.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4483333333333", cy: "91.47000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.62", cy: "81.79666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3616666666667", cy: "96.27666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3483333333334", cy: "255.82333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.9499999999999", cy: "246.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.61", cy: "250.99333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.25", cy: "241.30166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.485", cy: "197.80166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4583333333333", cy: "250.97833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4583333333333", cy: "260.6466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.055", cy: "260.6466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.7299999999999", cy: "265.4733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0516666666666", cy: "168.79999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9200000000001", cy: "154.28833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.8033333333333", cy: "192.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.2033333333334", cy: "149.45833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3683333333333", cy: "163.95833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.625", cy: "159.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0616666666666", cy: "188.14", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4583333333334", cy: "241.3083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0516666666666", cy: "178.47", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5083333333334", cy: "173.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.0616666666666", cy: "120.46333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.0683333333333", cy: "110.78999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.0300000000001", cy: "130.145", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5083333333334", cy: "163.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.66", cy: "101.10666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.07", cy: "101.12166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.4699999999999", cy: "144.63333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1533333333333", cy: "236.47666666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "569.04", cy: "91.435", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "552.4833333333333", cy: "226.81333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.825", cy: "217.15333333333334", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "544.995", cy: "221.98625", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "560.8050000000001", cy: "231.655", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5083333333334", cy: "183.30999999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5183333333333", cy: "192.98", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5283333333334", cy: "202.64833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5283333333334", cy: "212.3183333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0200000000001", cy: "101.12", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4200000000001", cy: "101.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3366666666667", cy: "76.94166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4200000000001", cy: "110.79333333333334", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "585.66", cy: "81.77", r: "3.6" } }),
      _c("circle", { attrs: { cx: "610.515", cy: "86.62", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "618.855", cy: "91.45166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9616666666667", cy: "86.60666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "551.9371428571429", cy: "120.73571428571428", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.255", cy: "91.45166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1483333333333", cy: "96.27666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.895", cy: "202.66333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.5557142857143", cy: "135.25285714285715", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.88499999999993", cy: "192.995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.61999999999995", cy: "217.16333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.62000000000006", cy: "207.49333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.875", cy: "183.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.86499999999995", cy: "163.98", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.875", cy: "173.65666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3383333333334", cy: "86.60666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "734.9916666666667", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.255", cy: "67.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.6983333333333", cy: "67.28666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4183333333334", cy: "72.115", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.8833333333332", cy: "67.28666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.2049999999999", cy: "72.115", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4449999999999", cy: "91.43666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.52", cy: "76.95666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.75875", cy: "67.28375000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.5900000000001", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.595", cy: "91.43666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0200000000001", cy: "91.45", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.32666666666665", cy: "221.98833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7633333333333", cy: "96.27666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.4583333333334", cy: "76.95500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "701.7585714285715", cy: "71.84285714285714", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1916666666666", cy: "81.78833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.91", cy: "86.60666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5533333333334", cy: "289.6666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "618.92", cy: "313.83", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "610.595", cy: "328.3433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.44", cy: "337.99833333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "610.575", cy: "309.005", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "610.595", cy: "318.67333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4499999999999", cy: "347.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0516666666667", cy: "347.6683333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0416666666667", cy: "337.99833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.34666666666664", cy: "231.6583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5533333333334", cy: "299.33666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.895", cy: "250.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.2399999999999", cy: "260.6466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.5366666666667", cy: "255.81000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7833333333333", cy: "231.645", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8016666666666", cy: "72.125", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "618.935", cy: "265.485", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "610.5533333333334", cy: "279.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5866666666667", cy: "270.32666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.335", cy: "333.17333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.15", cy: "333.17333333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "545.035", cy: "241.32375", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "536.865", cy: "236.48666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.5133333333334", cy: "246.15666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "511.915", cy: "231.67", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "503.6499999999999", cy: "236.50833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.245", cy: "226.83833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.825", cy: "250.99333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5500000000001", cy: "231.65833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.845", cy: "226.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4399999999999", cy: "318.65833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4399999999999", cy: "328.3283333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.825", cy: "260.66333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4", cy: "299.3233333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4", cy: "289.6566666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1216666666668", cy: "275.17", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4", cy: "279.9866666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.42", cy: "308.9883333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.8133333333334", cy: "202.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.0883333333335", cy: "76.965", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.2399999999999", cy: "250.97833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.475", cy: "207.46666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.475", cy: "217.13333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3333333333334", cy: "265.50166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.9499999999999", cy: "255.82333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3016666666666", cy: "275.1566666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2916666666666", cy: "284.83166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.61", cy: "260.66333333333336", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "668.625", cy: "168.79", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "676.94", cy: "163.95833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.2233333333334", cy: "159.13833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0716666666667", cy: "197.81000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.4899999999999", cy: "154.305", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4033333333333", cy: "192.96333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3783333333334", cy: "183.3033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3683333333333", cy: "173.6266666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.165", cy: "246.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.6949999999999", cy: "284.81666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1516666666665", cy: "265.485", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "577.425", cy: "270.32", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "585.6949999999999", cy: "275.1466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1649999999998", cy: "255.82333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.6685714285715", cy: "231.9285714285714", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "701.7900000000001", cy: "149.19285714285715", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.5033333333334", cy: "236.49166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.825", cy: "241.32333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3233333333334", cy: "313.8433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.335", cy: "323.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0416666666666", cy: "328.3283333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2916666666666", cy: "294.50166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3016666666666", cy: "304.165", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.6949999999999", cy: "294.4866666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.7183333333334", cy: "304.155", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.74", cy: "323.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.74", cy: "313.8233333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.5666666666667", cy: "246.12666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.875", cy: "101.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.7887499999999", cy: "144.63375000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.87", cy: "110.79333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1816666666667", cy: "76.97166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.8750000000001", cy: "81.78666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.57", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.2866666666667", cy: "149.48666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.57", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9583333333334", cy: "154.315", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.8650000000001", cy: "120.46333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0366666666667", cy: "81.78666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3466666666667", cy: "76.95666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7199999999999", cy: "76.95666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4150000000001", cy: "72.13666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6500000000001", cy: "81.80833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.2766666666668", cy: "81.79666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.56", cy: "76.95666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9250000000001", cy: "76.965", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.2066666666666", cy: "96.27333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6633333333333", cy: "168.82166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5699999999998", cy: "163.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.98", cy: "163.98666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.255", cy: "168.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9583333333334", cy: "173.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4483333333333", cy: "149.465", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7516666666667", cy: "154.30833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.055", cy: "159.15833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.3250000000002", cy: "163.98666666666668", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "834.69", cy: "178.49", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "826.4", cy: "173.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.98", cy: "173.65666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8533333333334", cy: "159.15833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.07", cy: "168.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.14", cy: "163.98666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7700000000001", cy: "163.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4699999999999", cy: "159.14666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "710.147142857143", cy: "115.89999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.295", cy: "105.97333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.035", cy: "101.13666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7416666666667", cy: "105.95833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4333333333333", cy: "110.79333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9250000000001", cy: "105.95833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5333333333333", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.2199999999999", cy: "110.79333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.7987499999999", cy: "105.9575", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6300000000001", cy: "101.13666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9", cy: "125.28333333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "618.855", cy: "149.47", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "602.3083333333333", cy: "207.48166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.92", cy: "207.48333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.015", cy: "202.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1966666666666", cy: "120.46", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.475", cy: "115.62666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "701.7971428571428", cy: "110.51857142857143", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8299999999999", cy: "110.80499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3800000000001", cy: "154.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5299999999999", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.215", cy: "130.13000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.915", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8249999999999", cy: "120.47166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6199999999999", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.735", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.1033333333334", cy: "115.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.0266666666666", cy: "120.47166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.285", cy: "125.31333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.0966666666667", cy: "125.31333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.025", cy: "120.46333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.735", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.445", cy: "110.80166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3616666666667", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.44", cy: "120.47499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.73", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3566666666666", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0250000000001", cy: "130.13000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.105", cy: "188.14499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2916666666666", cy: "188.13833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3033333333333", cy: "197.81499999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2716666666666", cy: "178.45333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8266666666667", cy: "168.80333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.7149999999999", cy: "207.46666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3083333333333", cy: "217.14999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.015", cy: "212.30333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5966666666667", cy: "202.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5666666666667", cy: "212.3166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9216666666666", cy: "154.295", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4683333333334", cy: "197.8166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4583333333334", cy: "188.14166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.13", cy: "144.61333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.765", cy: "183.30666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.785", cy: "202.64666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4250000000001", cy: "139.77833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4", cy: "154.28666666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "569.07", cy: "178.455", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "618.8466666666667", cy: "159.145", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.705", cy: "188.12666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4150000000001", cy: "202.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.7233333333332", cy: "178.4383333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4033333333334", cy: "192.9666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2316666666667", cy: "149.44333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2566666666667", cy: "159.16166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.7149999999999", cy: "197.7966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2033333333334", cy: "139.79000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.535", cy: "144.61666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.775", cy: "192.9766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.0316666666666", cy: "110.80499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.115", cy: "197.80833333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3933333333334", cy: "183.29666666666665", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "610.525", cy: "154.305", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "593.9933333333332", cy: "183.29666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.005", cy: "192.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3950000000001", cy: "173.61666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0416666666667", cy: "318.65833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.005", cy: "43.10166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.64", cy: "43.086666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1350000000001", cy: "38.24333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.225", cy: "43.10666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3083333333334", cy: "38.251666666666665", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "784.77", cy: "33.435", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "859.5400000000001", cy: "38.266666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.1383333333333", cy: "47.93666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9149999999998", cy: "38.27", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.3650000000001", cy: "33.434999999999995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.29", cy: "115.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.62", cy: "52.77666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.23", cy: "52.79333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.3216666666667", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.5050000000001", cy: "57.629999999999995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.5050000000001", cy: "67.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.23", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.8449999999999", cy: "52.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0750000000002", cy: "159.165", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.5450000000001", cy: "23.76166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.60166666666674", cy: "275.19", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.1816666666665", cy: "212.35833333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "569.16", cy: "420.2", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "768.3649999999999", cy: "265.5", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.8699999999999", cy: "101.15833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "975.7583333333332", cy: "57.63166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.995", cy: "309.0416666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.7533333333332", cy: "135.00166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.8216666666666", cy: "420.20666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.2750000000001", cy: "47.905", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "710.1014285714285", cy: "28.874285714285715", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.01499999999993", cy: "275.18833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "734.9583333333334", cy: "23.763333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.8283333333334", cy: "38.25", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3216666666666", cy: "38.25166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.425", cy: "52.741666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.495", cy: "47.92166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "925.9366666666666", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0183333333333", cy: "308.9883333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.12", cy: "207.48166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9983333333333", cy: "299.3233333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "585.75", cy: "342.83", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "593.9983333333333", cy: "279.9866666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.62999999999994", cy: "226.82666666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.895", cy: "222.0033333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "876.23", cy: "86.62", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "867.8750000000001", cy: "91.45333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9983333333333", cy: "289.6566666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6233333333333", cy: "120.47500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9200000000001", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0266666666668", cy: "270.31666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6283333333334", cy: "110.80166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.215", cy: "120.46333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6566666666666", cy: "110.80499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9466666666667", cy: "105.97333333333331", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.915", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.74", cy: "333.16333333333336", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "826.415", cy: "260.655", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "909.3666666666667", cy: "76.95333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.4000000000001", cy: "241.32666666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.41", cy: "251.0016666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.045", cy: "280.0133333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "760.04", cy: "241.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9783333333334", cy: "221.98833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "760.0099999999999", cy: "231.66166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.7516666666667", cy: "246.1716666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.8000000000001", cy: "270.3266666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.76", cy: "362.1666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.76", cy: "352.49666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.5799999999999", cy: "144.64333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.7416666666667", cy: "236.50833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.7216666666667", cy: "226.82666666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.5133333333334", cy: "265.49666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.73333333333335", cy: "231.65833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.585", cy: "130.11333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3583333333332", cy: "115.61666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3533333333332", cy: "125.28333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569", cy: "139.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3616666666667", cy: "105.94666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3533333333332", cy: "134.94833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5416666666666", cy: "115.64499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.2483333333333", cy: "120.46", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1233333333333", cy: "125.28000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9549999999999", cy: "115.61666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.6566666666666", cy: "110.77666666666669", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.825", cy: "207.48333333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "544.995", cy: "212.31625", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "536.825", cy: "197.81333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4733333333334", cy: "217.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.855", cy: "159.13000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.835", cy: "168.78833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.815", cy: "188.14499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.8050000000001", cy: "178.47333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.7987499999999", cy: "96.2875", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.035", cy: "91.46999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.295", cy: "96.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7416666666667", cy: "96.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.785", cy: "221.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.44", cy: "101.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.225", cy: "101.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4350000000001", cy: "120.44666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.54", cy: "105.95833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9250000000001", cy: "96.29", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6300000000001", cy: "91.47000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3316666666666", cy: "115.61666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0083333333333", cy: "120.46", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7533333333333", cy: "125.28333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.585", cy: "120.44666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9066666666666", cy: "115.61666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.48", cy: "105.95666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "702.1487500000001", cy: "101.12375", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.2016666666667", cy: "110.79166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3466666666667", cy: "154.28833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7283333333334", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.025", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "743.285", cy: "144.65", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "718.4266666666666", cy: "130.13000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.7887499999999", cy: "125.29625", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6300000000001", cy: "149.48666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.4699999999999", cy: "134.96333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1933333333333", cy: "139.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.13", cy: "226.82333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.0966666666667", cy: "144.65", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4366666666666", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9000000000001", cy: "144.61833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.73", cy: "144.63666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0483333333332", cy: "149.465", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5299999999999", cy: "144.63666666666668", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "768.235", cy: "149.465", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "759.9366666666666", cy: "154.30666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8216666666667", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "702.13875", cy: "130.13", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "585.755", cy: "255.80999999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.605", cy: "149.45499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3483333333334", cy: "246.1533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.9399999999999", cy: "236.47666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.61", cy: "241.32333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4366666666666", cy: "231.63833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.755", cy: "246.1433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.755", cy: "236.47333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.055", cy: "250.97833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7933333333333", cy: "173.6266666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7933333333333", cy: "163.95833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0516666666666", cy: "159.13000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8316666666666", cy: "101.13666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.485", cy: "188.12666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "627.185", cy: "192.97", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "643.7933333333333", cy: "183.29666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.25", cy: "231.63333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7533333333333", cy: "134.94833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.97125", cy: "183.30749999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3566666666667", cy: "144.62666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.6214285714285", cy: "173.91428571428574", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.7133333333333", cy: "139.78333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4616666666666", cy: "178.46833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5566666666667", cy: "125.30166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.055", cy: "241.3083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.6533333333333", cy: "120.44666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.6833333333333", cy: "130.13166666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "569.12", cy: "217.15", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "585.735", cy: "226.80499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.425", cy: "130.11999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4150000000001", cy: "221.97", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.6357142857142", cy: "193.25142857142856", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.035", cy: "231.63833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.9950000000001", cy: "202.64625", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.785", cy: "212.3166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4733333333334", cy: "207.48333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.975", cy: "125.29666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.92", cy: "217.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.18", cy: "173.62666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5466666666666", cy: "183.30666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4150000000001", cy: "212.30333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5816666666666", cy: "192.99", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "594.015", cy: "221.97", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "585.7149999999999", cy: "217.13333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3183333333335", cy: "226.8116666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5666666666667", cy: "221.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8566666666667", cy: "178.455", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0083333333333", cy: "139.79", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3249999999999", cy: "125.28333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.325", cy: "134.94833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.18", cy: "163.95833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0083333333333", cy: "130.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.16", cy: "154.28833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.455", cy: "149.45499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7533333333333", cy: "144.61833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.475", cy: "178.45666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.215", cy: "139.79666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5299999999999", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8216666666667", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.0966666666667", cy: "134.98333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7283333333334", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.285", cy: "134.98333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.025", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6199999999999", cy: "139.81333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.915", cy: "144.63666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4366666666666", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0299999999999", cy: "110.79333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3383333333335", cy: "236.48833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3683333333333", cy: "105.95833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4483333333333", cy: "101.13666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3566666666666", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.65", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.0250000000001", cy: "139.79666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.73", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6533333333333", cy: "120.47166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4266666666666", cy: "120.46333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.18", cy: "183.2966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.11", cy: "105.97333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.475", cy: "159.12333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.5883333333334", cy: "231.655", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7733333333333", cy: "154.28833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.92", cy: "226.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8916666666667", cy: "188.145", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "635.475", cy: "168.79", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "693.4699999999999", cy: "125.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0300000000001", cy: "149.46166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7833333333333", cy: "221.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1933333333333", cy: "130.1266666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "702.14", cy: "120.46374999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9000000000001", cy: "134.94833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.325", cy: "144.61833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.585", cy: "139.78333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7400000000001", cy: "105.95833333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "544.9325", cy: "289.66625", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "544.9549999999999", cy: "280.01", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.455", cy: "294.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.465", cy: "304.1683333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.6414285714287", cy: "270.6114285714286", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.0157142857142", cy: "313.57142857142856", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.275", cy: "255.84166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.57", cy: "260.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.84", cy: "265.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.9350000000001", cy: "260.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.2100000000002", cy: "400.8566666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1800000000002", cy: "381.5266666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1999999999999", cy: "391.185", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.8516666666668", cy: "396.02666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.83", cy: "367.01666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.6342857142856", cy: "347.95714285714286", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.0414285714287", cy: "352.79", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.5566666666667", cy: "139.81333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.82", cy: "376.6916666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.71000000000004", cy: "202.64833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.6466666666667", cy: "265.5183333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487", cy: "188.14499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.42", cy: "207.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.2716666666666", cy: "154.33333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.2633333333333", cy: "144.63666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.42", cy: "217.16333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "486.98", cy: "178.46833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487", cy: "168.78833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.695", cy: "192.9766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.75333333333333", cy: "260.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.0266666666667", cy: "265.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.36666666666673", cy: "260.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.43", cy: "226.83833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.43000000000006", cy: "255.86", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "462.09", cy: "231.665", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "462.11999999999995", cy: "241.33666666666662", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.46000000000004", cy: "246.17166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.5166666666668", cy: "362.18333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.48", cy: "188.14499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4000000000001", cy: "260.63000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.2483333333333", cy: "207.46666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "709.8325", cy: "183.3075", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "693.505", cy: "192.98499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.715", cy: "236.49166666666665", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "685.265", cy: "217.155", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "668.665", cy: "226.80499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9633333333334", cy: "221.97", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "701.83", cy: "187.87000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.685", cy: "236.51333333333332", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "743.335", cy: "222.01", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "751.695", cy: "226.83833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6650000000001", cy: "246.17166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7616666666667", cy: "202.665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.3449999999999", cy: "212.33333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7816666666668", cy: "192.97833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.085", cy: "207.4933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4050000000001", cy: "270.32500000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.655", cy: "386.3666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.615", cy: "376.68666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.615", cy: "367.01666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.3850000000001", cy: "391.1966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.5016666666667", cy: "405.6783333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.9633333333334", cy: "362.18666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.8000000000001", cy: "410.5133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.1016666666667", cy: "396.0133333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "569.18", cy: "410.54", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "594.125", cy: "405.6933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4833333333332", cy: "284.81666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7983333333333", cy: "279.9866666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.5133333333332", cy: "294.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0550000000001", cy: "275.16", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.59", cy: "342.82666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.5849999999999", cy: "333.16333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.2383333333333", cy: "347.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.9483333333334", cy: "352.51", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.42", cy: "212.3183333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.6899999999999", cy: "57.63", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.4616666666666", cy: "139.8133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0300000000001", cy: "52.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.43", cy: "52.79333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.3316666666666", cy: "67.29333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0750000000002", cy: "101.135", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.7233333333334", cy: "125.31333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.7283333333334", cy: "115.64333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0683333333333", cy: "110.80166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1383333333333", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3250000000002", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.8350000000002", cy: "52.77666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.62", cy: "52.79333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.6999999999999", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "817.995", cy: "52.77666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9049999999999", cy: "47.96333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.5400000000001", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.245", cy: "52.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9166666666666", cy: "188.14499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.2599999999999", cy: "163.97333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.42", cy: "221.98833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.41", cy: "231.67499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.7566666666667", cy: "265.52", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7800000000001", cy: "192.98000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.42", cy: "202.6483333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.0300000000001", cy: "251.01166666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "801.485", cy: "188.16", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "818.09", cy: "197.81333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "760.0400000000001", cy: "250.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4000000000001", cy: "43.120000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.6199999999999", cy: "192.98000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9066666666668", cy: "178.47333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9066666666668", cy: "168.80666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.335", cy: "197.81999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.0500000000001", cy: "231.65166666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.04", cy: "241.33666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.3400000000001", cy: "207.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.47", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9216666666666", cy: "57.59833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.03", cy: "52.77333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3216666666667", cy: "47.928333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.215", cy: "62.443333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.62", cy: "52.76333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1083333333333", cy: "67.26833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.405", cy: "62.43333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8149999999999", cy: "62.443333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.475", cy: "57.613333333333344", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.4599999999999", cy: "76.965", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7233333333334", cy: "67.26833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.825", cy: "125.32000000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7233333333332", cy: "57.63166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.1733333333333", cy: "120.47500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.465", cy: "105.95333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.3866666666667", cy: "62.451666666666675", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.7516666666667", cy: "72.115", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.9012500000001", cy: "67.28375", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.3949999999999", cy: "43.10999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.5749999999999", cy: "33.45666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.2433333333333", cy: "38.29333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "734.9766666666666", cy: "33.45", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.8733333333333", cy: "38.276666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.1833333333334", cy: "43.10999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.785", cy: "43.12500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.6883333333334", cy: "38.27833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.4983333333333", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "702.10375", cy: "43.1075", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "676.8683333333332", cy: "57.59833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.5533333333334", cy: "62.43333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.295", cy: "57.598333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.0649999999999", cy: "47.96333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1616666666667", cy: "52.77333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "710.1085714285715", cy: "38.55142857142857", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "651.9783333333334", cy: "62.44", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.4366666666666", cy: "47.94333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.09", cy: "217.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.405", cy: "400.8616666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.155", cy: "415.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.715", cy: "396.02666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.5016666666667", cy: "415.3483333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.6385714285715", cy: "357.62142857142857", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.97", cy: "381.52333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.8516666666666", cy: "405.6933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9983333333333", cy: "231.64833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.82", cy: "386.3616666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.605", cy: "352.49666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.7366666666666", cy: "265.4816666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.39", cy: "279.9866666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.7366666666666", cy: "255.80499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.97", cy: "371.8533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0849999999999", cy: "284.8466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.8149999999999", cy: "289.665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.2566666666667", cy: "357.3433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.135", cy: "309.01166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.5166666666668", cy: "371.8533333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "544.9325", cy: "299.33625", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "462.05999999999995", cy: "222.0033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "462.06", cy: "202.66333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "453.7966666666667", cy: "236.51", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "486.94000000000005", cy: "149.47166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "453.8066666666667", cy: "246.17333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "486.9283333333333", cy: "139.79666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.39000000000004", cy: "197.80499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.675", cy: "183.30666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "462.05999999999995", cy: "212.33333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.5300000000001", cy: "270.33833333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.9550000000001", cy: "270.3683333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.2616666666667", cy: "265.50333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "536.8", cy: "275.17", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "470.385", cy: "265.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "462.1116666666667", cy: "251.01166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.7166666666667", cy: "270.33833333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.34", cy: "270.33333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.335", cy: "304.18666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.285", cy: "202.64666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.5266666666666", cy: "188.155", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9566666666666", cy: "207.50166666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.285", cy: "226.8116666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6733333333335", cy: "294.51666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.25499999999994", cy: "134.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.7433333333333", cy: "154.305", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.69", cy: "241.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.69", cy: "250.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.535", cy: "96.31166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.1483333333332", cy: "57.623333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.1583333333332", cy: "67.28666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.9000000000001", cy: "91.47333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.4650000000001", cy: "52.75833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3716666666666", cy: "280.01500000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.7216666666667", cy: "110.795", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.3716666666666", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.235", cy: "91.47333333333331", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.5216666666666", cy: "178.49", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7316666666667", cy: "212.31833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.0566666666667", cy: "217.17999999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.48", cy: "197.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6650000000001", cy: "255.84166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.335", cy: "231.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.5933333333332", cy: "212.31666666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "710.2014285714286", cy: "193.25428571428571", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "701.8199999999999", cy: "197.55285714285714", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8850000000001", cy: "207.4933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.775", cy: "221.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.785", cy: "212.3216666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.5", cy: "207.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.315", cy: "226.83166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.8166666666666", cy: "231.665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.63", cy: "221.98666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.085", cy: "275.14666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.6083333333332", cy: "212.3283333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "760.0233333333332", cy: "260.6616666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.07", cy: "130.14833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.7733333333334", cy: "144.655", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0616666666666", cy: "120.47500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.2366666666667", cy: "173.62666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.6300000000001", cy: "202.64833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.3666666666667", cy: "115.63333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9266666666666", cy: "197.81333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.2433333333333", cy: "192.99166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.2083333333334", cy: "183.30999999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.5766666666665", cy: "86.61833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.245", cy: "81.79833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.6349999999999", cy: "212.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.8233333333333", cy: "72.155", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.8449999999999", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.2199999999999", cy: "72.14999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.3716666666666", cy: "105.95166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.62", cy: "62.446666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "925.9066666666666", cy: "67.30499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.275", cy: "207.48333333333332", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "793.15", cy: "192.995", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "801.495", cy: "197.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.09", cy: "207.48333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.16", cy: "202.66333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.79", cy: "202.6483333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.88", cy: "197.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.275", cy: "217.15333333333334", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "942.535", cy: "47.945", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "776.5933333333332", cy: "202.6483333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6833333333333", cy: "284.8516666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.005", cy: "299.3433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.36", cy: "255.86499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.3800000000001", cy: "246.17166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.375", cy: "236.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.6350000000001", cy: "221.98666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6983333333333", cy: "275.1666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.1100000000001", cy: "226.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.0450000000001", cy: "289.68333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.415", cy: "38.26833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1083333333333", cy: "57.598333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.215", cy: "52.77333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8199999999999", cy: "52.77", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9499999999999", cy: "47.913333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "925.9366666666666", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.8383333333334", cy: "47.91", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7233333333334", cy: "57.59833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.6516666666666", cy: "43.076666666666675", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1566666666668", cy: "43.10999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "651.9616666666667", cy: "52.76166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.1483333333333", cy: "110.78333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.72", cy: "62.440000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.4166666666666", cy: "67.28333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.83", cy: "115.63833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.8787500000001", cy: "57.60125", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.6833333333333", cy: "47.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "568.9999999999999", cy: "43.089999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.3766666666667", cy: "52.77666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.5533333333334", cy: "52.76333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.8350000000002", cy: "43.10999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.2400000000001", cy: "43.120000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.5233333333333", cy: "120.47500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "817.995", cy: "43.10999999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.6899999999999", cy: "47.96333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.4399999999999", cy: "43.116666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.3216666666667", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7049999999999", cy: "38.26833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.6150000000001", cy: "43.12500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.6483333333332", cy: "28.59", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.2333333333332", cy: "28.623333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.3849999999999", cy: "33.443333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.055", cy: "38.29333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "701.71", cy: "33.15428571428571", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.8716666666666", cy: "28.60166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.4883333333333", cy: "38.27833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.2033333333333", cy: "33.425000000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.48", cy: "168.82166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4616666666667", cy: "367.00666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1166666666667", cy: "304.1766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1066666666667", cy: "284.83166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1066666666667", cy: "294.50166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7666666666668", cy: "279.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.57", cy: "241.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9683333333332", cy: "192.98000000000002", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "545.035", cy: "250.9925", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "536.865", cy: "246.15666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.5133333333334", cy: "255.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1650000000001", cy: "352.51000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1550000000001", cy: "342.84666666666664", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "569.14", cy: "313.83", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "577.4616666666667", cy: "357.33666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.81", cy: "338.0133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1500000000001", cy: "323.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.81", cy: "328.3433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.495", cy: "333.1766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.9350000000001", cy: "241.33666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.585", cy: "168.81166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.4699999999999", cy: "134.97666666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "503.605", cy: "188.155", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "503.59999999999997", cy: "178.49", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "536.765", cy: "130.13", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "544.5914285714287", cy: "96.56142857142856", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.9412500000001", cy: "105.95750000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.5828571428572", cy: "115.90142857142857", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.115", cy: "125.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.32666666666665", cy: "202.64833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.04999999999995", cy: "246.15666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.03", cy: "226.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.05", cy: "236.48666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.615", cy: "197.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.36666666666673", cy: "241.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.01", cy: "217.15333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.66", cy: "246.17166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.32666666666665", cy: "212.3183333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.2083333333334", cy: "270.32", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.6750000000001", cy: "207.4483333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.91", cy: "192.97833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.91", cy: "183.31500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.5099999999999", cy: "173.64", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.235", cy: "178.47166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0916666666667", cy: "236.49166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.39", cy: "212.30333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0916666666666", cy: "226.81499999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0716666666666", cy: "217.14666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "702.1787499999999", cy: "168.80625000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.3250000000002", cy: "183.32666666666668", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "735.065", cy: "178.49", r: "3.6" } }),
      _c("circle", { attrs: { cx: "743.335", cy: "192.995", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "751.68", cy: "197.82000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4699999999999", cy: "168.80666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7716666666666", cy: "173.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.8325", cy: "163.97250000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.8783333333332", cy: "260.635", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.76", cy: "371.83666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.35", cy: "352.51500000000004", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "602.34", cy: "342.84", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "594.0616666666667", cy: "357.33666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.93", cy: "333.17333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.595", cy: "338.0133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.78", cy: "381.50500000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0616666666667", cy: "367.00666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0616666666666", cy: "376.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.89", cy: "284.83166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.93", cy: "323.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.9050000000001", cy: "275.17", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.89", cy: "294.50166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.785", cy: "91.43666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.515", cy: "265.4733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.245", cy: "318.65833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.9", cy: "304.1766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "626.8042857142857", cy: "308.6142857142857", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.265", cy: "236.49666666666664", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "834.695", cy: "188.155", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "851.3100000000001", cy: "159.14666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.98", cy: "183.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.32", cy: "168.8216666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.14", cy: "173.65666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.8133333333334", cy: "212.3033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.4", cy: "183.31000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1383333333333", cy: "67.28666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.07", cy: "178.47333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "851.32", cy: "178.49", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "884.4716666666668", cy: "101.13666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1783333333333", cy: "105.95833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4399999999999", cy: "81.78666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1750000000001", cy: "115.62833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.8649999999999", cy: "130.13000000000002", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.8649999999999", cy: "139.79666666666665", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "859.61", cy: "154.295", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "876.1683333333334", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7700000000001", cy: "173.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.4699999999999", cy: "159.13666666666668", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "702.17125", cy: "159.13125", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "685.235", cy: "168.8033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "710.1757142857142", cy: "154.58285714285716", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.5099999999999", cy: "163.97333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4", cy: "202.63166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.94", cy: "173.62666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0716666666667", cy: "207.48", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.625", cy: "178.45666666666668", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "751.665", cy: "178.49", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "759.9583333333334", cy: "183.31000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.255", cy: "178.47333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7716666666666", cy: "163.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.6700000000001", cy: "188.16", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5699999999998", cy: "173.64333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.065", cy: "168.82166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8633333333333", cy: "168.82166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.3250000000002", cy: "173.65666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.4516666666667", cy: "72.13166666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "867.855", cy: "72.115", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "676.89", cy: "76.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3166666666667", cy: "76.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0200000000001", cy: "81.78", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1716666666666", cy: "72.10833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7633333333333", cy: "86.60666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "709.75875", cy: "57.613749999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "702.1075000000001", cy: "62.447500000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.4366666666666", cy: "67.28333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "668.595", cy: "81.77", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "602.245", cy: "81.78833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9416666666667", cy: "76.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.64", cy: "72.10333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3066666666667", cy: "67.26666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8449999999999", cy: "81.77666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1483333333333", cy: "86.60666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.495", cy: "76.95500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4449999999999", cy: "81.77", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.3949999999999", cy: "62.446666666666665", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "818.015", cy: "72.115", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "826.3250000000002", cy: "67.28666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.6999999999999", cy: "67.28666666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "834.63", cy: "72.125", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "859.5400000000001", cy: "67.28666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4050000000001", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9049999999999", cy: "67.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.2550000000001", cy: "72.13666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "743.255", cy: "57.63", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "751.5900000000001", cy: "52.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.6983333333333", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.0649999999999", cy: "67.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.8833333333332", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "734.9916666666667", cy: "52.79333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.7916666666666", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.4983333333333", cy: "67.28666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.1833333333334", cy: "62.446666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.765", cy: "120.46333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7666666666668", cy: "299.33666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7883333333333", cy: "309.00500000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.81", cy: "318.67333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.495", cy: "323.50666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.865", cy: "255.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.465", cy: "275.15833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.7666666666668", cy: "289.6666666666667", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "545.035", cy: "260.6625", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "552.455", cy: "284.8333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.5", cy: "342.8433333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4816666666667", cy: "386.34666666666664", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "560.82", cy: "347.68", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "577.5016666666667", cy: "396.0133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.855", cy: "134.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.4616666666667", cy: "376.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.17", cy: "371.8516666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "560.83", cy: "357.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "569.1700000000001", cy: "362.1816666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "470.45", cy: "236.49666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.01", cy: "207.48333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.265", cy: "188.14499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.01", cy: "197.8133333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.71", cy: "212.31833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.71000000000004", cy: "221.98833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.57666666666665", cy: "149.48166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.3066666666667", cy: "183.31000000000003", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "511.895", cy: "144.65", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "495.3066666666667", cy: "173.64333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.36666666666673", cy: "250.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "503.66", cy: "255.84166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.57", cy: "250.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.8", cy: "391.17333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.275", cy: "246.17166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "511.9350000000001", cy: "251.00666666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.75333333333333", cy: "241.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "478.7533333333334", cy: "250.99666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "487.05", cy: "255.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.8000000000001", cy: "400.8433333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "709.8325", cy: "173.64", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "718.4699999999999", cy: "178.47333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.7716666666666", cy: "183.31000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "702.1787499999999", cy: "178.47375", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "594.0816666666667", cy: "386.34499999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.3899999999999", cy: "221.97", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "693.5099999999999", cy: "183.3066666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.9633333333334", cy: "212.30333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.2399999999999", cy: "188.13833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.645", cy: "217.13333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9783333333334", cy: "202.64833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.275", cy: "197.81333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.5816666666666", cy: "192.97833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.9783333333334", cy: "212.3183333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.685", cy: "207.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.3449999999999", cy: "202.66333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "735.0799999999999", cy: "197.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.685", cy: "217.16333333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "735.07", cy: "188.155", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "660.41", cy: "231.63833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.615", cy: "357.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.935", cy: "342.84666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.2283333333334", cy: "337.99833333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "610.605", cy: "347.68", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "602.3649999999999", cy: "381.51500000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.355", cy: "371.8516666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.355", cy: "362.1816666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.2366666666666", cy: "328.32166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.8266666666666", cy: "270.31666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "652.0833333333334", cy: "265.49", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.4833333333333", cy: "275.1466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.4150000000001", cy: "241.32833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1850000000001", cy: "289.6566666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1850000000001", cy: "299.3233333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.555", cy: "304.14833333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1850000000001", cy: "279.9866666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "495.3166666666666", cy: "192.97833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.7550000000001", cy: "96.28166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.7333333333335", cy: "105.97333333333331", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0099999999999", cy: "72.155", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.4683333333332", cy: "110.80499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1616666666667", cy: "144.66833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.4633333333333", cy: "120.47166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0300000000001", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1683333333334", cy: "134.96666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.4616666666666", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.6899999999999", cy: "67.29666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.245", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9366666666668", cy: "159.11833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.5400000000001", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.62", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9049999999999", cy: "57.63", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "520.17", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1383333333333", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.8350000000002", cy: "62.446666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.7700000000001", cy: "183.31000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "818.08", cy: "188.14499999999998", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.3250000000002", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.61", cy: "163.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.7066666666666", cy: "197.82666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8633333333333", cy: "178.49", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "801.48", cy: "178.49", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "776.5699999999998", cy: "183.31000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.7116666666666", cy: "207.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.14", cy: "183.32666666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "826.41", cy: "192.97833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.61", cy: "183.31000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.3249999999999", cy: "188.16", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "834.7116666666666", cy: "217.16333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.61", cy: "173.64333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "842.9899999999999", cy: "192.995", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.06", cy: "222.0033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843", cy: "202.66333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "843.0300000000001", cy: "212.35166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.43", cy: "62.461666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "618.8249999999999", cy: "72.12", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "627.1283333333333", cy: "76.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "610.475", cy: "67.28333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "593.9216666666666", cy: "67.26833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "602.225", cy: "72.10666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "635.425", cy: "72.10333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "651.9983333333333", cy: "72.11", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "660.295", cy: "67.26833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "643.7433333333333", cy: "76.93833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.7683333333333", cy: "110.79333333333331", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "668.575", cy: "72.10499999999999", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.8683333333333", cy: "188.155", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "536.765", cy: "101.11833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "585.62", cy: "62.43333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "528.465", cy: "125.29833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "577.3166666666666", cy: "57.60166666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "817.995", cy: "62.446666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "544.5485714285713", cy: "77.24285714285715", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "552.4083333333334", cy: "72.11", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "676.8683333333332", cy: "67.26833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "768.1833333333334", cy: "52.77666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "751.585", cy: "43.120000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "759.8833333333332", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "784.7916666666666", cy: "52.79333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "793.0649999999999", cy: "57.63", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "809.6999999999999", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "801.4050000000001", cy: "52.79333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "776.4983333333333", cy: "57.616666666666674", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "743.255", cy: "47.96333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "702.1075000000001", cy: "52.7775", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "685.1616666666667", cy: "62.443333333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "709.75875", cy: "47.94375", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "693.4366666666666", cy: "57.613333333333344", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "718.3949999999999", cy: "52.77666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "734.9866666666667", cy: "43.12500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "726.6983333333333", cy: "47.946666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1850000000001", cy: "289.65", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.1550000000001", cy: "279.99833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.5033333333334", cy: "275.16333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.4983333333333", cy: "304.2", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9249999999998", cy: "304.19166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.5283333333333", cy: "284.84333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.895", cy: "294.50333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.5283333333333", cy: "294.5133333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.215", cy: "299.3383333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "859.6583333333333", cy: "318.6666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "868.0050000000001", cy: "323.51166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "851.3116666666666", cy: "323.52666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.8250000000002", cy: "212.33333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.8249999999999", cy: "202.66333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.805", cy: "231.65833333333333", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "909.4733333333334", cy: "251", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "901.1066666666666", cy: "246.16833333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.1366666666667", cy: "236.51500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.8650000000001", cy: "260.6766666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0566666666667", cy: "294.52000000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.0633333333334", cy: "304.18666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.41", cy: "289.66333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.8533333333334", cy: "328.3566666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "925.9233333333333", cy: "134.97666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.2800000000001", cy: "130.14333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "925.9283333333333", cy: "125.28666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.7133333333335", cy: "168.81666666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "909.39", cy: "173.645", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "925.9933333333335", cy: "163.96833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.2449999999999", cy: "149.48333333333332", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.305", cy: "159.14166666666668", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.7950000000001", cy: "265.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.7366666666667", cy: "304.17333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.4350000000001", cy: "328.34999999999997", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "917.79", cy: "323.5", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "934.2900000000001", cy: "294.51666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.685", cy: "454.07166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.9983333333333", cy: "449.2033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.5749999999999", cy: "323.52833333333336", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "959.2516666666667", cy: "309", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "992.5649999999999", cy: "328.34999999999997", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "976.3714285714285", cy: "318.94714285714286", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "983.7371428571429", cy: "323.2271428571429", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.585", cy: "313.82166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.2433333333333", cy: "318.67333333333335", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "1000.805", cy: "313.84", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "951.025", cy: "410.54333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.41", cy: "400.8733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.8000000000001", cy: "391.1933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.685", cy: "415.38000000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.6850000000001", cy: "405.71333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.4816666666666", cy: "386.3583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.1166666666667", cy: "396.02833333333336", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "892.85", cy: "386.375", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "909.46", cy: "376.68833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.6", cy: "391.2083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.8699999999999", cy: "396.04333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.61", cy: "400.8733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.1999999999999", cy: "391.19666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.1783333333333", cy: "381.53999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.2783333333333", cy: "376.68833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.5749999999999", cy: "371.8533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.985", cy: "371.8633333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.6750000000001", cy: "357.34833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "975.9249999999998", cy: "367.01666666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.69", cy: "347.6933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.6150000000001", cy: "400.85999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "976.3914285714287", cy: "376.96000000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.3183333333333", cy: "415.3666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.3183333333335", cy: "405.69666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.6149999999999", cy: "391.1933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "976.4171428571428", cy: "386.62857142857143", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.5916666666666", cy: "420.23499999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.3000000000001", cy: "386.35833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9949999999999", cy: "400.85999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.5949999999999", cy: "381.52500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "951.015", cy: "391.19666666666666", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "942.665", cy: "386.375", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "876.3183333333333", cy: "396.02833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.5949999999999", cy: "342.84666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.7600000000001", cy: "371.8533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.3650000000001", cy: "352.5333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.38", cy: "381.52833333333325", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.3133333333334", cy: "434.715", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "868.025", cy: "420.21333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.6750000000001", cy: "338.02000000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.695", cy: "434.7383333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.3699999999999", cy: "371.8633333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.6449999999999", cy: "376.7033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.995", cy: "381.53999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.0766666666667", cy: "367.0183333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.3183333333333", cy: "396.02833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.3699999999999", cy: "362.19666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.7800000000001", cy: "381.52500000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "951.025", cy: "400.8733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.0766666666667", cy: "376.68833333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.0966666666667", cy: "386.3583333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.4", cy: "391.2083333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.6850000000001", cy: "396.04333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.6449999999999", cy: "367.0333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.75", cy: "352.5083333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.1383333333333", cy: "362.17833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "975.9249999999998", cy: "357.34666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.82", cy: "367.02833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9649999999998", cy: "381.53000000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.2466666666666", cy: "376.67", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.5466666666667", cy: "371.8500000000001", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.0416666666666", cy: "347.66833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.585", cy: "352.49666666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.2783333333333", cy: "367.01833333333326", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.5650000000002", cy: "362.17833333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "950.9899999999999", cy: "362.195", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.3400000000001", cy: "342.84833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.4499999999999", cy: "357.3433333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "976.4357142857143", cy: "415.09", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.6650000000001", cy: "429.8666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "951.0183333333333", cy: "429.8833333333334", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "983.4525", cy: "400.86", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "934.3666666666667", cy: "429.88166666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "983.4525000000001", cy: "410.52750000000003", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.0866666666666", cy: "415.38499999999993", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.9016666666666", cy: "415.3983333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.2199999999999", cy: "410.5483333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.3183333333333", cy: "415.3666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.5016666666667", cy: "405.6966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.79", cy: "410.5316666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.6416666666668", cy: "420.215", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.3183333333333", cy: "405.6966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.5016666666667", cy: "396.02833333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.61", cy: "410.54333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.995", cy: "410.5266666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.8699999999999", cy: "405.71333333333337", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.21", cy: "400.8733333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "867.9949999999999", cy: "391.1933333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "909.46", cy: "367.01833333333326", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "876.2983333333333", cy: "386.35833333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.7600000000001", cy: "362.18333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "901.1683333333334", cy: "371.8633333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "884.58", cy: "381.52833333333325", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "892.83", cy: "376.7033333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "959.3149999999999", cy: "425.03666666666663", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "967.6149999999999", cy: "410.52666666666664", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.0766666666667", cy: "357.3500000000001", r: "3.6" }
      }),
      _c("circle", { attrs: { cx: "976.785", cy: "405.69375", r: "3.6" } }),
      _c("circle", {
        attrs: { cx: "983.7742857142857", cy: "381.2442857142857", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "976.7850000000001", cy: "396.02625", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "983.4525000000001", cy: "391.19250000000005", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "917.8000000000001", cy: "400.85999999999996", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.41", cy: "410.54333333333335", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "926.1166666666667", cy: "405.6966666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "934.39", cy: "420.22333333333336", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "951.0216666666666", cy: "420.21000000000004", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "942.68", cy: "425.0466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1017.485", cy: "323.49333333333334", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1009.2283333333334", cy: "463.70166666666665", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1000.8916666666665", cy: "468.5466666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1017.525", cy: "458.8616666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1025.8149999999998", cy: "454.00666666666666", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1034.0249999999999", cy: "371.8533333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1034.0449999999998", cy: "439.5416666666667", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1042.4", cy: "434.6983333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1042.4", cy: "425.0333333333333", r: "3.6" }
      }),
      _c("circle", {
        attrs: { cx: "1075.54", cy: "357.3333333333333", r: "3.6" }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-df567280", esExports)
  }
}

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_Dialog_vue__ = __webpack_require__(28);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_05fc5bd9_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_Dialog_vue__ = __webpack_require__(122);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(116)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_Dialog_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_05fc5bd9_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_Dialog_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/maps/Native-Map/res/dialog/Network-Native-Map-Dialog.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-05fc5bd9", Component.options)
  } else {
    hotAPI.reload("data-v-05fc5bd9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(117);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("09367389", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-05fc5bd9\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Network-Native-Map-Dialog.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-05fc5bd9\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Network-Native-Map-Dialog.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.map-dialog-description {\n    color: #ffc107;\n    height: auto;\n    max-height: 450px;\n    width: 300px;\n    margin: 0;\n    background-color: rgba(38, 41, 43, 0.66);\n    border-radius: 3px;\n    display: block;\n    padding: 8px;\n    opacity: 0;\n    will-change: opacity;\n    transition: 0.3s opacity;\n    text-align: center;\n    pointer-events: none;\n    position: relative;\n    margin-left: -100px;\n    left: 50%;\n    top: 100px;\n    z-index: 100;\n}\n@media (max-height: 800px) {\n.map-dialog-description {\n        top: 40px;\n}\n}\n.map-dialog {\n    position: fixed;\n    top: 50%;\n    -ms-transform: translateY(-50%);\n        transform: translateY(-50%);\n    width: 100%;\n    text-align: center;\n    pointer-events: none;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/maps/Native-Map/res/dialog/src/components/maps/Native-Map/res/dialog/Network-Native-Map-Dialog.vue"],"names":[],"mappings":";AA+DA;IACA,eAAA;IACA,aAAA;IACA,kBAAA;IACA,aAAA;IACA,UAAA;IACA,yCAAA;IACA,mBAAA;IACA,eAAA;IACA,aAAA;IACA,WAAA;IACA,qBAAA;IACA,yBAAA;IACA,mBAAA;IACA,qBAAA;IACA,mBAAA;IACA,oBAAA;IACA,UAAA;IACA,WAAA;IACA,aAAA;CACA;AAEA;AACA;QACA,UAAA;CACA;CACA;AAEA;IACA,gBAAA;IACA,SAAA;IACA,gCAAA;QAAA,4BAAA;IACA,YAAA;IACA,mBAAA;IACA,qBAAA;CACA","file":"Network-Native-Map-Dialog.vue","sourcesContent":["<template>\n    <!-- Popup Description -->\n    <div class=\"map-dialog \">\n\n        <div class=\"map-dialog-description\" ref=\"refDialogContainer\" :style=\"{opacity: this.display ? 1 : 0}\">\n\n            <NetworkNativeMapDialogElement v-for=\"desc in this.desc\"\n\n            :key=\"desc.uuid||desc.index\"\n            :address=\"desc.address\"\n            :status=\"desc.status\"\n            :country=\"desc.country\"\n            :city=\"desc.city\"\n            :nodeType=\"desc.nodeType\"\n\n            style=\"padding-bottom: 20px\"\n\n            >\n\n            </NetworkNativeMapDialogElement>\n\n        </div>\n    </div>\n</template>\n\n<script>\n\n    import NetworkNativeMapDialogElement from \"./Network-Native-Map-Dialog-Element.vue\"\n\n    export default{\n\n        components:{\n            \"NetworkNativeMapDialogElement\":NetworkNativeMapDialogElement,\n        },\n\n        data: () => {\n            return {\n\n                display: false,\n                desc: {},\n            }\n        },\n\n        methods: {\n\n            show(desc) {\n\n                this.desc = desc;\n\n                this.display = 1;\n            },\n\n            hide() {\n                this.display = 0;\n            },\n        }\n\n    }\n\n</script>\n\n\n\n<style>\n    .map-dialog-description {\n        color: #ffc107;\n        height: auto;\n        max-height: 450px;\n        width: 300px;\n        margin: 0;\n        background-color: rgba(38, 41, 43, 0.66);\n        border-radius: 3px;\n        display: block;\n        padding: 8px;\n        opacity: 0;\n        will-change: opacity;\n        transition: 0.3s opacity;\n        text-align: center;\n        pointer-events: none;\n        position: relative;\n        margin-left: -100px;\n        left: 50%;\n        top: 100px;\n        z-index: 100;\n    }\n\n    @media (max-height: 800px) {\n        .map-dialog-description {\n            top: 40px;\n        }\n    }\n\n    .map-dialog {\n        position: fixed;\n        top: 50%;\n        transform: translateY(-50%);\n        width: 100%;\n        text-align: center;\n        pointer-events: none;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_Dialog_Element_vue__ = __webpack_require__(29);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_094a8568_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_Dialog_Element_vue__ = __webpack_require__(121);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(119)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_selector_type_script_index_0_Network_Native_Map_Dialog_Element_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_094a8568_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Network_Native_Map_Dialog_Element_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/maps/Native-Map/res/dialog/Network-Native-Map-Dialog-Element.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-094a8568", Component.options)
  } else {
    hotAPI.reload("data-v-094a8568", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(120);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("78e099f6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-094a8568\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Network-Native-Map-Dialog-Element.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js?sourceMap!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-094a8568\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Network-Native-Map-Dialog-Element.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "\n.icon-connected{\n    filter: brightness(0) invert(1);\n}\n.network-dialog-icon {\n    width: 16px;\n    display: inline-block;\n}\n\n", "", {"version":3,"sources":["/home/alex/WebDollar/User-Interface-WebDollar/src/components/maps/Native-Map/res/dialog/src/components/maps/Native-Map/res/dialog/Network-Native-Map-Dialog-Element.vue"],"names":[],"mappings":";AAgDA;IAEA,gCAAA;CACA;AAEA;IACA,YAAA;IACA,sBAAA;CACA","file":"Network-Native-Map-Dialog-Element.vue","sourcesContent":["<template>\n\n    <div>\n        <div style=\"display: inline-block; padding-right: 10px\">\n            <img v-if=\"nodeType === 'myself' \" class=\"network-dialog-icon icon-myself\" src=\"https://forum.noxiousnet.com/plugins/nodebb-plugin-emoji-one/static/images/1f60e.png\">\n            <img v-if=\"nodeType === 'browser' \" class=\"network-dialog-icon icon-browser\" src=\"http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/48/Browser-icon.png\">\n            <img v-if=\"nodeType === 'terminal' \" class=\"network-dialog-icon icon-terminal\" src=\"http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/terminal-icon.png\">\n            <img class=\"icon-connected\" :src=\"this.connected === 'connected' ? 'http://icons.iconarchive.com/icons/icons8/windows-8/16/Network-Connected-icon.png' : 'http://icons.iconarchive.com/icons/icons8/windows-8/16/Network-Disconnected-icon.png' \">\n        </div>\n        <div ref=\"refText\" class=\"map-dialog-description-text\" style=\"display: inline-block;\">\n            <br>{{country}}, {{city}}<br>\n            <small>{{this.getAddress || '&nbsp;'}} </small>\n        </div>\n    </div>\n\n</template>\n\n<script>\n\n    export default{\n\n        props:{\n            nodeType:'',\n            status:'',\n            country:'',\n            city:'',\n            address:'',\n\n        },\n\n        computed:{\n\n            getAddress(){\n\n                if (typeof this.address ===\"string\") return this.address;\n                else\n                if (typeof this.address === \"object\" && typeof this.address.addressString === 'string') return this.address.addressString;\n                else return \"NOT DEFINED\";\n\n            }\n\n        }\n\n    }\n\n</script>\n\n<style>\n\n    .icon-connected{\n        -webkit-filter: brightness(0) invert(1);\n        filter: brightness(0) invert(1);\n    }\n\n    .network-dialog-icon {\n        width: 16px;\n        display: inline-block;\n    }\n\n</style>"],"sourceRoot":""}]);

// exports


/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "div",
      { staticStyle: { display: "inline-block", "padding-right": "10px" } },
      [
        _vm.nodeType === "myself"
          ? _c("img", {
              staticClass: "network-dialog-icon icon-myself",
              attrs: {
                src:
                  "https://forum.noxiousnet.com/plugins/nodebb-plugin-emoji-one/static/images/1f60e.png"
              }
            })
          : _vm._e(),
        _vm.nodeType === "browser"
          ? _c("img", {
              staticClass: "network-dialog-icon icon-browser",
              attrs: {
                src:
                  "http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/48/Browser-icon.png"
              }
            })
          : _vm._e(),
        _vm.nodeType === "terminal"
          ? _c("img", {
              staticClass: "network-dialog-icon icon-terminal",
              attrs: {
                src:
                  "http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/terminal-icon.png"
              }
            })
          : _vm._e(),
        _c("img", {
          staticClass: "icon-connected",
          attrs: {
            src:
              this.connected === "connected"
                ? "http://icons.iconarchive.com/icons/icons8/windows-8/16/Network-Connected-icon.png"
                : "http://icons.iconarchive.com/icons/icons8/windows-8/16/Network-Disconnected-icon.png"
          }
        })
      ]
    ),
    _c(
      "div",
      {
        ref: "refText",
        staticClass: "map-dialog-description-text",
        staticStyle: { display: "inline-block" }
      },
      [
        _c("br"),
        _vm._v(_vm._s(_vm.country) + ", " + _vm._s(_vm.city)),
        _c("br"),
        _c("small", [_vm._v(_vm._s(this.getAddress || " ") + " ")])
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-094a8568", esExports)
  }
}

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "map-dialog " }, [
    _c(
      "div",
      {
        ref: "refDialogContainer",
        staticClass: "map-dialog-description",
        style: { opacity: this.display ? 1 : 0 }
      },
      _vm._l(this.desc, function(desc) {
        return _c("NetworkNativeMapDialogElement", {
          key: desc.uuid || desc.index,
          staticStyle: { "padding-bottom": "20px" },
          attrs: {
            address: desc.address,
            status: desc.status,
            country: desc.country,
            city: desc.city,
            nodeType: desc.nodeType
          }
        })
      })
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-05fc5bd9", esExports)
  }
}

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("NetworkNativeMapCanvas"),
      _c("NetworkNativeMapDialog", { ref: "refDialog" })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6f992934", esExports)
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=WebDollar-User-Interface-bundle.js.map