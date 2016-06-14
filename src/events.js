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