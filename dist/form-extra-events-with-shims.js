!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.FormExtraEvents=t():e.FormExtraEvents=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";var r,o={eventLast:"submitlast",eventBefore:"submitbefore",eventStart:"submitstart",eventEnd:"submitend"},u=document,i=u.defaultView,a=Element.prototype.closest,l=Object.assign,c=i.CustomEvent,s=null,f=null,v=!1,d=null;function b(e){var t=e.target;!(t=t&&a.call(t,"button,input"))||"submit"!==t.type&&"image"!==t.type||(f=t,setTimeout(function(){f=null},1))}function m(){s=null,v=!1,i.removeEventListener("submit",y),i.addEventListener("submit",y)}function p(e,t){var n={transport:"default"};return e===d.eventBefore&&(n.activeButton=f),void 0!==t&&(n.timeout=t),new c(e,{bubbles:!0,cancelable:!1,detail:n})}function E(e,t,n){var r=p(t,n);e.dispatchEvent(r)}function y(e){i.removeEventListener("submit",y);var t=e.target,n=new c(d.eventLast,{bubbles:!0,cancelable:!0,detail:{activeButton:f}});e.defaultPrevented&&n.preventDefault(),t.dispatchEvent(n),n.defaultPrevented?e.preventDefault():E(s=t,d.eventBefore)}function g(){s&&!v&&E(s,d.eventStart),v=!0,r=r||p(d.eventEnd)}function h(e){s&&(r?(r.detail.timeout=e,s.dispatchEvent(r)):E(s,d.eventEnd,e)),s=null,v=!1}function j(){h(!1)}t.a={setShim:function(e,t,n){a=e||a,l=t||l,c=n||c},getSendingForm:function(){return s},forceSubmitEnd:function(e){h(e)},getSettings:function(){return d},register:function(e){if(d)throw new Error("form-extra-events already registered");return d=l({},o,e||{}),i.addEventListener("click",b),u.addEventListener("submit",m),i.addEventListener("beforeunload",g),i.addEventListener("unload",j),d},unregister:function(){d=null,i.removeEventListener("click",b),u.removeEventListener("submit",m),i.removeEventListener("beforeunload",g),i.removeEventListener("unload",j)}}},function(e,t,n){"use strict";n.r(t);var r,o,u=(o=Element.prototype,r=o.matches||o.matchesSelector||o.webkitMatchesSelector||o.mozMatchesSelector||o.msMatchesSelector||o.oMatchesSelector,Element.prototype.closest||function(e){for(var t=this;t;){if(r.call(t,e))return t;t=t.parentElement}return null});var i,a,l=Object.assign||function(e){if(null==e)throw new TypeError("Cannot convert first argument to object");for(var t=Object(e),n=0;n<(arguments.length<=1?0:arguments.length-1);n++){var r=n+1<1||arguments.length<=n+1?void 0:arguments[n+1];if(null!=r)for(var o=Object.keys(Object(r)),u=0,i=o.length;u<i;u++){var a=o[u],l=Object.getOwnPropertyDescriptor(r,a);void 0!==l&&l.enumerable&&(t[a]=r[a])}}return t},c=(i=CustomEvent.prototype,"function"!=typeof(a=CustomEvent)&&((a=function(e,t){t=t||{bubbles:!1,cancelable:!1};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n.preventDefault=function(){if(i.preventDefault.apply(this),this.cancelable)try{Object.defineProperty(this,"defaultPrevented",{configurable:!0,get:function(){return!0}})}catch(e){}},n}).prototype=i),a),s=n(0);s.a.setShim(u,l,c),t.default=s.a}])});