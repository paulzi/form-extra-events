!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.FormExtraEvents=t():e.FormExtraEvents=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";var r,o={eventLast:"submitlast",eventBefore:"submitbefore",eventStart:"submitstart",eventEnd:"submitend"},u=document,i=u.defaultView,a=Element.prototype.closest,f=Object.assign,l=i.CustomEvent,s=null,c=null,d=!1,v=null;function b(e){var t=e.target;!(t=t&&a.call(t,"button,input"))||"submit"!==t.type&&"image"!==t.type||(c=t,setTimeout(function(){c=null},1))}function m(){s=null,d=!1,i.removeEventListener("submit",y),i.addEventListener("submit",y)}function p(e,t){var n={transport:"default"};return e===v.eventBefore&&(n.activeButton=c),void 0!==t&&(n.timeout=t),new l(e,{bubbles:!0,cancelable:!1,detail:n})}function E(e,t,n){var r=p(t,n);e.dispatchEvent(r)}function y(e){i.removeEventListener("submit",y);var t=e.target,n=new l(v.eventLast,{bubbles:!0,cancelable:!0,detail:{activeButton:c}});e.defaultPrevented&&n.preventDefault(),t.dispatchEvent(n),n.defaultPrevented?e.preventDefault():E(s=t,v.eventBefore)}function g(){s&&!d&&E(s,v.eventStart),d=!0,r=r||p(v.eventEnd)}function L(e){s&&(r?(r.detail.timeout=e,s.dispatchEvent(r)):E(s,v.eventEnd,e)),s=null,d=!1}function x(){L(!1)}t.a={setShim:function(e,t,n){a=e||a,f=t||f,l=n||l},getSendingForm:function(){return s},forceSubmitEnd:function(e){L(e)},getSettings:function(){return v},register:function(e){if(v)throw new Error("form-extra-events already registered");return v=f({},o,e||{}),i.addEventListener("click",b),u.addEventListener("submit",m),i.addEventListener("beforeunload",g),i.addEventListener("unload",x),v},unregister:function(){v=null,i.removeEventListener("click",b),u.removeEventListener("submit",m),i.removeEventListener("beforeunload",g),i.removeEventListener("unload",x)}}},,,function(e,t,n){"use strict";n.r(t);var r=n(0);r.a.register(),t.default=r.a}])});