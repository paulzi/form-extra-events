/**
 * Form extra events
 * @see https://github.com/paulzi/form-extra-events
 * @license MIT (https://github.com/paulzi/form-extra-events/blob/master/LICENSE)
 * @version 1.1.1
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (root['FormExtraEvents'] = factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    root['FormExtraEvents'] = factory(root.jQuery);
  }
}(this, function ($) {

'use strict';

var $window = $(window);

var FormExtraEvents = $.extend({
    catchDefault:  false,
    dataAttribute: 'catchDownload',
    param:         '_requestId',
    interval:      100,
    timeout:       60000
}, window.FormExtraEvents || {});

var submitLastHandler = function (e) {
    if (!e.isDefaultPrevented()) {
        var $form   = $(e.target),
            event   = $.Event('submitlast');
        $form.trigger(event);
        if (event.isDefaultPrevented()) {
            e.preventDefault();
        } else {

            var beforeUnloadTimer, catchTimer, catchTimeoutTimer, requestId, $requestInput;

            var trigger = function (type) {
                $form.trigger({
                    type:      type,
                    transport: 'default'
                });
            };

            var beforeUnloadCheck = function () {
                if (beforeUnloadTimer) {
                    clearTimeout(beforeUnloadTimer);
                }
                if (beforeUnloadTimer !== false) {
                    beforeUnloadTimer = false;
                    if ($requestInput) {
                        $requestInput.remove();
                        $requestInput = null;
                    }
                    $window.off('beforeunload', beforeUnloadCheck);
                    trigger('submitstart');
                }
            };

            var submitEnd = function () {
                $window.off('unload', submitEnd);
                beforeUnloadCheck();
                if (catchTimer) {
                    clearInterval(catchTimer);
                }
                if (catchTimeoutTimer) {
                    clearTimeout(catchTimeoutTimer);
                }
                if (requestId) {
                    document.cookie = catchData.param + requestId + '=; expires=' + new Date(0).toUTCString() + '; path=/';
                }
                trigger('submitend');
            };

            trigger('submitbefore');

            // catch download
            var catchData = $form.data(FormExtraEvents.dataAttribute);
            catchData = catchData ? (typeof catchData === 'object' ? $.extend(FormExtraEvents, catchData) : FormExtraEvents) : false;
            if (catchData) {
                requestId = $.now();
                $requestInput = $('<input>').attr({
                    type:  'hidden',
                    name:  catchData.param,
                    value: requestId
                }).appendTo($form);

                catchTimer = setInterval(function () {
                    if (document.cookie.indexOf(requestId + '=1') !== -1) {
                        submitEnd();
                    }
                }, catchData.interval);

                if (catchData.timeout) {
                    catchTimeoutTimer = setTimeout(function () {
                        submitEnd();
                    }, catchData.timeout);
                }
            }

            beforeUnloadTimer = setTimeout(beforeUnloadCheck, 100);
            $window.one('beforeunload', beforeUnloadCheck);
            $window.one('unload',       submitEnd);
        }
    }
};

$(document).on('submit', function (e) {
    if (!e.isDefaultPrevented()) {
        var eventName = 'submit.last';
        $window.off(eventName);
        $window.one(eventName, submitLastHandler);
    }
});
return FormExtraEvents;

}));
