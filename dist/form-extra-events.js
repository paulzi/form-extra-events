/**
 * Form extra events
 * @see https://github.com/paulzi/form-extra-events
 * @license MIT (https://github.com/paulzi/form-extra-events/blob/master/LICENSE)
 * @version 1.0.1
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root.jQuery);
  }
}(this, function ($) {

'use strict';

$(document).on('submit', 'form', function (e) {
    if (!e.isDefaultPrevented()) {
        var $form   = $(this),
            $window = $(window);
        $window.off('submit');
        $window.one('submit', function () {
            var event = $.Event("submitlast");
            $form.trigger(event);
            if (event.isDefaultPrevented()) {
                e.preventDefault();
            } else {
                $form.trigger({
                    type:      'submitbefore',
                    transport: 'default'
                });

                var timerProp = 'formExtraEvents';
                var processTimer = function () {
                    var timer = $form.data(timerProp);
                    if (timer) {
                        clearTimeout(timer);
                    }
                    if (timer !== false) {
                        $form.data(timerProp, false);
                        $form.trigger({
                            type:      'submitstart',
                            transport: 'default'
                        });
                    }
                };

                // beforeunload event polyfill
                $form.data(timerProp, setTimeout(processTimer, 100));

                // standard beforeunload
                $window.one('beforeunload', processTimer);

                $window.one('unload', function () {
                    processTimer();
                    $form.trigger({
                        type:      'submitend',
                        transport: 'default'
                    });
                });
            }
        });
    }
});

}));
