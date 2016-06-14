# Form Extra Events

[![NPM version](http://img.shields.io/npm/v/form-extra-events.svg?style=flat)](https://www.npmjs.org/package/form-extra-events)
![Bower version](http://img.shields.io/bower/v/form-extra-events.svg?style=flat)

Добавляет дополнительные события при отправке форм.

[English readme](https://github.com/paulzi/form-extra-events/)

## Установка

Установка через NPM
```sh
npm install form-extra-events
```

Установка через Bower
```sh
bower install form-extra-events
```

Или установите вручную.

## Использование

Подключите библиотеку на страницу после jQuery:

```html
<script src="/bower_components/jquery/dist/jquery.min.js">
<script src="/bower_components/form-extra-events/dist/form-extra-events.min.js">
```

Добавьте обработчики событий используя jQuery:
```javacript
$(document).on('submitstart', '#my-form', function () { $(this).addClass('form-loading'); });
$(document).on('submitend',   '#my-form', function () { $(this).removeClass('form-loading'); });
```

## Документация

### События

- `submitlast` - срабатывает после выполнения **всех** стандартных обработчиков события `submit`, здесь вы всё ещё можете отменить стандартное поведение браузера вызовом `preventDefault()`, но делать это рекомендуется только для того, чтобы отправить запрос иными способами, например, через AJAX, то есть запрос должен быть выполнен в любом случае;
- `submitbefore` - срабатывает до начала отправки формы, здесь вы всё ещё можете модифицировать форму, но вы не можете отменить стандартное поведение браузера вызовом `preventDefault`, т. е. событие гарантированно выполнится перед отправкой;
- `submitstart` - срабатывает после начала отправки формы, изменения в форме не изменят запрос;
- `submitend` - срабатывает после окончания отправки формы.

**Внимание**: событие `submitend` основан на событии `unload`, со всеми его ограничениями. Например, вы не сможете открыть окно вызовом `window.open()`. Также во многих мобильных браузеров данное событие не вызывается.

### Транспорты и универсальная привязка к событиям

Событие `submitlast` введён специально для реализации различных транспортов. Например, в [paulzi-form](https://github.com/paulzi/paulzi-form/) данное событие используется для отправки формы через AJAX. Данный AJAX транспорт также генерирует события `submitbefore`, `submitstart`, `submitend`, но с другим параметром события `transport`. Если вам нужно захватить событие именно штатной браузерной отправки формы, вам нужно проверить параметр `transport` в обработчике:

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

## Требования

- jQuery 1.7+

## Поддержка браузерами

Поддержка была протестирована в следующих браузерах:

- Internet Explorer 7+
- Chrome 7+
- Firefox 3+
- Opera 15+
- Safari 5+
- Android Browser 2.2+
- iOS Safari ?