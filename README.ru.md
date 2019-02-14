# form-extra-events

[![NPM version](http://img.shields.io/npm/v/form-extra-events.svg?style=flat)](https://www.npmjs.org/package/form-extra-events)
[![Build Status](https://img.shields.io/travis/paulzi/form-extra-events/master.svg)](https://travis-ci.org/paulzi/form-extra-events)
[![Downloads](https://img.shields.io/npm/dt/form-extra-events.svg)](https://www.npmjs.org/package/form-extra-events)
![License](https://img.shields.io/npm/l/form-extra-events.svg)

Добавляет дополнительные события при отправке форм.

[English readme](https://github.com/paulzi/form-extra-events/)

## Установка

```sh
npm install form-extra-events
```

## Использование

Данный пример реализует добавление класса `loading` для всех форм во время отправки.

```javascript
import 'form-extra-events';

document.addEventListener('submitstart', function(e) {
    e.target.classList.add('loading');
});
document.addEventListener('submitend', function(e) {
    e.target.classList.remove('loading');
});
```

## Документация

### События

`form-extra-events` добавляет для всех форм следующие события:

- `submitlast` - срабатывает после выполнения **всех** стандартных обработчиков события `submit`, здесь вы всё ещё можете отменить стандартное поведение браузера вызовом `preventDefault()`, но делать это рекомендуется только для того, чтобы отправить запрос иными способами, например, через AJAX, то есть запрос должен быть выполнен в любом случае;
- `submitbefore` - срабатывает до начала отправки формы, здесь вы всё ещё можете модифицировать форму, но вы не можете отменить стандартное поведение браузера вызовом `preventDefault()`, т. е. событие гарантированно выполнится перед отправкой;
- `submitstart` - срабатывает после начала отправки формы, изменения в форме не изменят запрос;
- `submitend` - срабатывает после окончания отправки формы.

**Внимание**: событие `submitend` основан на событии `unload`, со всеми его ограничениями.
Например, вы не сможете открыть окно вызовом `window.open()`.
Также для многих мобильных браузеров данное событие не вызывается.

### Параметры событий

Объект события содержит дополнительные параметры:

- `transport {string}` - для событий `submitbefore`, `submitstart`, `submitend` передаёт название транспорта, с помощью которого передаётся форма. Подробнее ниже в разделе [транспорты](#Транспорты).
- `activeButton {Element}` - для событий `submitlast`, `submitbefore` передаёт элемент кнопки, с помощью которой была отправлена форма.

### Транспорты

Событие `submitlast` введён специально для реализации различных транспортов.
В [form-plus](https://github.com/paulzi/form-plus/) данное событие используется для отправки формы через AJAX.
Данный AJAX транспорт также генерирует события `submitbefore`, `submitstart`, `submitend`, но с другим параметром события `transport`.
Если вам нужно захватить событие именно штатной браузерной отправки формы, вам нужно проверить параметр `transport === 'default'` в обработчике:

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

### Обнаружение перехода в состояние загрузки

По-умолчанию, скрипт не может отловить окончание отправки формы, если браузер перешёл в состояние загрузки файла, поэтому в данном случае не отрабатывает событие `submitend`.
Аналогично происходит, если указать атрибут `target="_blank"` для формы. 
Чтобы отлавливать событие `submitend` в таких случаях, используйте скрипт `catch-download` из пакета [form-plus](https://github.com/paulzi/form-plus/).

### Варианты импорта

Есть несколько входных точек для импорта библиотеки:

- `import ExtraEvents from 'form-extra-events'` - аналогично `register-with-shims`;
- `import ExtraEvents from 'form-extra-events/standard'` - простой импорт без полифилов для ie11, требуется регистрация;
- `import ExtraEvents from 'form-extra-events/with-shims'` - импорт с прокладками для ie11, требуется регистрация;
- `import ExtraEvents from 'form-extra-events/with-polyfills'` - импорт с полифилами для ie11, требуется регистрация;
- `import ExtraEvents from 'form-extra-events/register'` - импорт без полифилов для ie11, авто-регистрация;
- `import ExtraEvents from 'form-extra-events/register-with-shims'` - импорт с прокладками для ie11, авто-регистрация;
- `import ExtraEvents from 'form-extra-events/register-with-polifills'` - импорт с полифилами для ie11, авто-регистрация.

Отличия прокладок от полифилов можете прочитать в [polyshim](https://github.com/paulzi/polyshim/).

При прямом подключении скрипта из папки `dist` в браузер, получить экземпляр ExtraEvent можно через `window.FormExtraEvents.default`.

### Регистрация и наименование событий

При импорте пакета без регистрации, требуется зарегистрировать его. При регистрации можно заменить наименования событий:

```javascript
import ExtraEvents from 'form-extra-events/with-shims';

ExtraEvents.register({
    eventLast: 'last',
})
```

### Методы 

- `register([settings])` - регистрирует библиотеку
    - `settings {Object} [{}]` - задать [параметры](#Параметры)
    - `@return {Object}` - возвращает действующие настройки
- `unregister()` - отменяет регистрацию библиотеки
- `getSettings()` - возвращает действующие настройки
    - `@return {Object}`
- `getSendingForm()` - возвращает текущую отправляемую форму
    - `@return {HTMLFormElement|null}` 
- `setShim([setClosest[, setObjectAssign[, setCustomEvent]]])` - задаёт прокладки для некроссбраузерных методов
    - `setClosest {Function|null}` - прокладка для `Element.prototype.closest`
    - `setObjectAssign {Function|null}` - прокладка для `Object.assign`
    - `setCustomEvent {Function|null}` - прокладка для `new CustomEvent`

### Параметры

- `eventLast {string} ['submitlast']` - наименование события `submitlast` 
- `eventBefore {string} ['submitbefore']` - наименование события `submitbefore` 
- `eventStart {string} ['submitstart']` - наименование события `submitstart` 
- `eventEnd {string} ['submitend']` - наименование события `submitend` 

## Тестирование

Для тестов необходимо установить [selenium-драйверы](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html) для браузеров.
Для запуска тестов используйте:

```sh
npm test
```

## Поддержка браузерами

- Internet Explorer 11+
- Другие современные браузеры

Для старых браузеров используйте [версию 1.x](https://github.com/paulzi/form-extra-events/tree/1.x).