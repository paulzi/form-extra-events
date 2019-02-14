# form-extra-events

[![NPM version](http://img.shields.io/npm/v/form-extra-events.svg?style=flat)](https://www.npmjs.org/package/form-extra-events)
[![Build Status](https://img.shields.io/travis/paulzi/form-extra-events/master.svg)](https://travis-ci.org/paulzi/form-extra-events)
[![Downloads](https://img.shields.io/npm/dt/form-extra-events.svg)](https://www.npmjs.org/package/form-extra-events)
![License](https://img.shields.io/npm/l/form-extra-events.svg)

Add extra events for submit html forms.

[Russian readme](https://github.com/paulzi/form-extra-events/blob/master/README.ru.md)

## Install

```sh
npm install form-extra-events
```

## Usage

This example implements adding the `loading` class for all forms during submission.

```javascript
import 'form-extra-events';

document.addEventListener('submitstart', function(e) {
    e.target.classList.add('loading');
});
document.addEventListener('submitend', function(e) {
    e.target.classList.remove('loading');
});
```

## Documentation

### Events

`form-extra-events` adds the following events for all forms:

- `submitlast` - triggered after executing **all** handlers of the standard `submit` event, here you can still cancel the standard browser behavior by calling `preventDefault()`, but this is recommended only to send a request in other ways, for example, via AJAX, that is, the request must be executed in any case;
- `submitbefore` - triggers before the form is submitted, here you can still modify the form, but you cannot cancel the standard browser behavior by calling `preventDefault()`, i.e. the event is guaranteed to be executed before being sent;
- `submitstart` - triggered after the form has been submitted, changes in the form will not change the request;
- `submitend` - triggered after the form has been submitted.

**Warning**: the `submitend` event is based on the `unload` event, with all its limitations.
For example, you cannot open a window by calling `window.open()`.
Also for many mobile browsers this event is not triggered.

### Event params

The event object contains additional parameters:

- `transport {string}` - for events `submitbefore`, `submitstart`, `submitend` passes the name of the transport with which the form is transmitted. More details below in the section [transports](#Transports).
- `activeButton {Element}` - for the events `submitlast`, `submitbefore` passes the button element with which the form was sent.

### Transports

The `submitlast` event is introduced specifically for the implementation of various transports.
In [form-plus](https://github.com/paulzi/form-plus/), this event is used to submit form via AJAX.
This AJAX transport also generates the events `submitbefore`,` submitstart`, `submitend`, but with a different parameter of the event `transport`.
If you need to capture the event of a regular browser-based form submission, you need to check the `transport === 'default'` parameter in the handler:

```javascript
document.addEventListener('submitbefore', function(e) {
    if (e.detail.transport === 'default') {
        let hidden = document.createElement('input');
        hidden.name  = 'isNoAjax';
        hidden.value = '1'; 
        e.target.appendChild(hidden);
    }
});
```

### Detect download state

By default, the script cannot catch the end of form submission, if the browser has switched to the file download state, so in this case it does not handle the `submitend` event.
Similarly, if you specify the attribute `target="_blank"` for the form.
To catch the `submitend` event in such cases, use the `catch-download` script from the [form-plus](https://github.com/paulzi/form-plus/) package.

### Import types

There are several entry points for importing a library:

- `import ExtraEvents from 'form-extra-events'` - similarly `register-with-shims`;
- `import ExtraEvents from 'form-extra-events/standard'` - easy import without polyfills for ie11, register is required;
- `import ExtraEvents from 'form-extra-events/with-shims'` - import with shims for ie11, register is required;
- `import ExtraEvents from 'form-extra-events/with-polyfills'` - import with polyfill for ie11, register is required;
- `import ExtraEvents from 'form-extra-events/register'` - import without polyfills for ie11, auto-register;
- `import ExtraEvents from 'form-extra-events/register-with-shims'` - import with shims for ie11, auto-register;
- `import ExtraEvents from 'form-extra-events/register-with-polifills'` - import with polyfill for ie11, auto-register.

Differences shims from polyfills you can read in [polyshim](https://github.com/paulzi/polyshim/) package.

When directly include the script from the `dist` folder to the browser, you can get an ExtraEvent instance via `window.FormExtraEvents.default`.

### Registration and name of events

When importing a package without register, you need to register it. When registering, you can replace the event names:

```javascript
import ExtraEvents from 'form-extra-events/with-shims';

ExtraEvents.register({
    eventLast: 'last',
})
```

### Methods

- `register([settings])` - register library
    - `settings {Object} [{}]` - [settings](#Settings)
    - `@return {Object}` - returns the current settings
- `unregister()` - unregister library
- `getSettings()` - returns the current settings
    - `@return {Object}`
- `getSendingForm()` - returns the current form being submitted
    - `@return {HTMLFormElement|null}` 
- `setShim([setClosest[, setObjectAssign[, setCustomEvent]]])` - sets shims for non-cross-browser methods
    - `setClosest {Function|null}` - shim for `Element.prototype.closest`
    - `setObjectAssign {Function|null}` - shim for `Object.assign`
    - `setCustomEvent {Function|null}` - shim for `new CustomEvent`

### Settings

- `eventLast {string} ['submitlast']` - name of event `submitlast` 
- `eventBefore {string} ['submitbefore']` - name of event `submitbefore` 
- `eventStart {string} ['submitstart']` - name of event `submitstart` 
- `eventEnd {string} ['submitend']` - name of event `submitend` 

## Testing

For tests, you need to install [selenium-drivers](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html) for browsers.
To run tests, use:

```sh
npm test
```

## Browsers support

- Internet Explorer 11+
- Other modern browsers

For old browsers use [version 1.x](https://github.com/paulzi/form-extra-events/tree/1.x).