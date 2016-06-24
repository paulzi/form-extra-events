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
$(document).on('submitstart', '#my-form', function () { $(this).addClass('form-loading'); });
$(document).on('submitend',   '#my-form', function () { $(this).removeClass('form-loading'); });
```

## Documentation

### Events

- `submitlast` - triggered after **all** standard `submit` event handlers executed, you can still abort the default behavior by `preventDefault()`, but to do so is only recommended in cases where the request will be sent by other methods, such as AJAX, that is, the request itself must be handed over;
- `submitbefore` - triggered before submit started, here you can still modify the form, but you can not cancel the default behavior by `preventDefault()`, that is, an event guaranteed to be executed before the submitting;
- `submitstart` - triggered after start submit, changes in form will not change request;
- `submitend` - triggered after end submit.

**Note**: `submitend` event based on the `unload` event, with all its limitations. For example, you can not open a window by `window.open()`. Also, in many mobile browsers, this event does not triggered.

### Detect when browser file download and other target

By default, the script can not catch the event when the browser goes in the file download mode, because that does not work out `submitend` events.
Similarly, the script can not catch the end of submit when the attribute `target` is set to `_blank`.
To keep track of this kind of action, you will need additional configuration on the server side of your application and need to change the options.

If you specify the attribute `data-catch-download="true"` in the form, the script will add to the form the `_requestId` parameter with the request identifier, and will keep track of cookies, until `_requestId{%id}=1` appears in them - it will be a signal that the request has been successfully worked out. Alternatively, upon the occurrence of a timeout.

Example:

```html
<form action="action.php" method="post" data-catch-download="true">
    <button type="submit">Submit</button>
</form>
<script>
$(document).on('submitbefore', function () {
    $('button').prop('disabled', true);
});
$(document).on('submitend', function () {
    $('button').prop('disabled', false);
});
</script>
```

Server side:

```php
header('Content-Disposition: attachment; filename=test.html');
if (!empty($_REQUEST['_requestId'])) {
    setcookie('_requestId' . $_REQUEST['_requestId'], 1, time() + 60, '/');
}
echo '<html></html>';
```

The value of the attribute `data-catch-download` can be passed JSON, in which the options is override:

```html
<form action="action.php" method="post" data-catch-download='{"timeout": 10000}'>
    <button type="submit">Submit</button>
</form>
```

### Transport and universal events handling

`submitlast` event is written specifically for implementation of various transports. For example, in the library [paulzi-form](https://github.com/paulzi/paulzi-form/), this event is used to submit the form via AJAX. This AJAX transport will also generate events `submitbefore`, `submitstart`, `submitend`, but with a other event parameter `transport`. If you need to capture the standard browser submit, check the parameter `transport` in handler:

```javascript
$(document).on('submitstart', '#my-form', function (e) {
    if (e.transport === 'default') {
        $(this).addClass('form-loading');
    }
});
$(document).on('submitend', '#my-form', function (e) {
    if (e.transport === 'default') {
        $(this).removeClass('form-loading');
    }
});
```

### Global options

You can change the settings by changing the properties of the global object `window.FormExtraEvents` (at any time, both before and after the include of the script).

Example:

```javascript
window.FormExtraEvents = $.extend(true, window.FormExtraEvents || {}, {
    catchDefault:  true,
    timeout: 10000
});
```

Options:

- `catchDefault` *(bool) default: false* - enable of catching file download on all forms by default
- `dataAttribute` *(string) default: 'catchDownload'* - name of `data-` attribute in camelCase
- `param` *(string) default: '_requestId'* - name of input and cookie parameter
- `interval` *(integer) default: 100* - check cookie interval in millisecond
- `timeout` *(integer) default: 60000* - timeout period in millisecond

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