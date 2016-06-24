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

### Обнаружение перехода в состояние загрузки

По-умолчанию, скрипт не может отловить окончание отправки формы, если браузер перешёл в состояние загрузки файла, поэтому в данном случае не отрабатывает событие `submitend`.
Аналогично происходит, если указать атрибут `target="_blank"` для формы. 
Чтобы скрипт генерировал событие `submitend` в таких случаях, потребуются дополнительные действия на серверной стороне и указать дополнительные настройки.

Для этого укажите атрибут `data-catch-download="true"` в форме, тогда в процессе отправки формы скрипт добавить параметр `_requestId` с идентификатором запроса, и будет ожидать появления Cookie с именем и значением `_requestId{%id}=1` - это будет являться сигналом того, что ответ был получен. Либо событие сгенерируется по таймауту.

Пример:

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

На сервере:

```php
header('Content-Disposition: attachment; filename=test.html');
if (!empty($_REQUEST['_requestId'])) {
    setcookie('_requestId' . $_REQUEST['_requestId'], 1, time() + 60, '/');
}
echo '<html></html>';
```

В качестве значения атрибута `data-catch-download` можно указать JSON, и переопределить в нём настройки:

```html
<form action="action.php" method="post" data-catch-download='{"timeout": 10000}'>
    <button type="submit">Submit</button>
</form>
```

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

### Глобальные опции

Вы можете изменить настроки библиотеки, путём изменения объекта `window.FormExtraEvents` (в любое время, как до, так и после подключения скрипта).

Пример:

```javascript
window.FormExtraEvents = $.extend(true, window.FormExtraEvents || {}, {
    catchDefault:  true,
    timeout: 10000
});
```

Опции:

- `catchDefault` *(bool) по-умолчанию: false* - включить обнаружение перехода в состояние загрузки файлов по-умолчанию для всех форм
- `dataAttribute` *(string) по-умолчанию: 'catchDownload'* - имя `data-` атрибута в camelCase
- `param` *(string) по-умолчанию: '_requestId'* - имя пармаметра и cookie
- `interval` *(integer) по-умолчанию: 100* - интервал проверки обнаружения перехода в состояние загрузки в миллисекундах
- `timeout` *(integer) по-умолчанию: 60000* - время таймаута проверки обнаружение перехода в состояние загрузки в миллисекундах

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
