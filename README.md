# Form Extra Events

[![NPM version](http://img.shields.io/npm/v/form-extra-events.svg?style=flat)](https://www.npmjs.org/package/form-extra-events)
![Bower version](http://img.shields.io/bower/v/form-extra-events.svg?style=flat)

Add extra events for html forms.

[Russian readme](https://github.com/paulzi/form-extra-events/blob/master/README.ru.md)

## Install

Install via NPM
```sh
npm install form-extra-events
```

Install via Bower
```sh
bower install form-extra-events
```

Or install manually.

## Usage

Include library on page after jQuery:

```html
<script src="/bower_components/jquery/dist/jquery.min.js">
<script src="/bower_components/form-extra-events/dist/form-extra-events.min.js">
```

Add event handler by jQuery:
```javacript
$(document).on('submitstart.default', '#my-form', function () { $(this).addClass('form-loading'); });
$(document).on('submitend.default',   '#my-form', function () { $(this).removeClass('form-loading'); });
```

## Documentation

### Events

- `submitlast` - triggered after **all** standard `submit` event handlers executed, you can still abort the default behavior by `preventDefault()`, but to do so is only recommended in cases where the request will be sent by other methods, such as AJAX, that is, the request itself must be handed over;
- `submitbefore.default` - triggered before standard submit started, here you can still modify the form, but you can not cancel the default behavior by `preventDefault()`, that is, an event guaranteed to be executed before the standard submitting;
- `submitstart.default` - triggered after start standard submit, changes in form will not change request;
- `submitend.default` - triggered after end standard submit.

**Note**: `submitend.default` event based on the `unload` event, with all its limitations. For example, you can not open a window by `window.open()`. Also, in many mobile browsers, this event does not triggered.

### Transport and universal events handling

`eventlast` event is written specifically for implementation of various transports. For example, in the library [paulzi-form](https://github.com/paulzi/paulzi-form/), this event is used to submit the form via AJAX. This AJAX transport will also generate events `submitbefore.ajax`, `submitstart.ajax`, `submitend.ajax`, but with a other namespace `.ajax`. So if you need to be capture event, but you do not care which way the form is submitted, you should add listener to events without namespace:

```javascript
$(document).on('submitstart', '#my-form', function () { $(this).addClass('form-loading'); });
$(document).on('submitend',   '#my-form', function () { $(this).removeClass('form-loading'); });
```

## Requirements

- jQuery 1.7+

## Browser support

Tested with browsers:

- Internet Explorer 7+
- Chrome 7+
- Firefox 3+
- Opera 15+
- Safari 5+
- Android Browser 2.2+
- iOS Safari ?