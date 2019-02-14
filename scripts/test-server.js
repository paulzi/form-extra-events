const express = require('express');
const app = express();

app.use(express.static('dist'));

function template(script) {
    return `<!DOCTYPE html>
        <html lang="ru-RU">
        <head>
            <meta charset="UTF-8">
            <title>form-extra-events test</title>
        </head>
        <body>
            <form action="/response" id="form">
                <button id="button">Submit</button>
            </form>
            <script src="/form-extra-events-register-with-shims.js"></script>
            ${script}
        </body>
        </html>`;
}

app.get('/', (req, res) => {
    res.send('ok');
});

app.get('/lifecycle', (req, res) => {
    res.send(template(`
        <script>
        sessionStorage.clear();
        document.addEventListener('submitlast', function(e) {
            sessionStorage.setItem('testSubmitLast', Date.now());
            sessionStorage.setItem('testFormLast', e.target.id);
            sessionStorage.setItem('testActiveButtonLast', e.detail.activeButton.id);
        });
        document.addEventListener('submitbefore', function(e) {
            e.preventDefault(); // should not affect the result
            sessionStorage.setItem('testSubmitBefore', Date.now());
            sessionStorage.setItem('testFormBefore', e.target.id);
            sessionStorage.setItem('testActiveButtonBefore', e.detail.activeButton.id);
            sessionStorage.setItem('testTransportBefore', e.detail.transport);
        });
        document.addEventListener('submitstart', function(e) {
            sessionStorage.setItem('testSubmitStart', Date.now());
            sessionStorage.setItem('testFormStart', e.target.id);
            sessionStorage.setItem('testTransportStart', e.detail.transport);
            sessionStorage.setItem('testSendingForm', FormExtraEvents.default.getSendingForm().id);
        });
        document.addEventListener('submitend', function(e) {
            sessionStorage.setItem('testSubmitEnd', Date.now());
            sessionStorage.setItem('testFormEnd', e.target.id);
            sessionStorage.setItem('testTransportEnd', e.detail.transport);
        });
        </script>
    `));
});

app.get('/prevent-default', (req, res) => {
    res.send(template(`
        <script>
        sessionStorage.clear();
        document.addEventListener('submitlast', function(e) {
            e.preventDefault();
            sessionStorage.setItem('testSubmitLast', Date.now());
        });
        document.addEventListener('submitbefore', function() {
            sessionStorage.setItem('testSubmitBefore', Date.now());
        });
        document.addEventListener('submitstart', function() {
            sessionStorage.setItem('testSubmitStart', Date.now());
        });
        document.addEventListener('submitend', function() {
            sessionStorage.setItem('testSubmitEnd', Date.now());
        });
        </script>
    `));
});

app.get('/register-settings', (req, res) => {
    res.send(template(`
        <script>
        sessionStorage.clear();
        FormExtraEvents.default.unregister();
        FormExtraEvents.default.register({
            eventLast:   'testlast',
            eventBefore: 'testbefore',
            eventStart:  'teststart',
            eventEnd:    'testend',        
        });
        document.addEventListener('testlast', function() {
            sessionStorage.setItem('testSubmitLast', Date.now());
        });
        document.addEventListener('testbefore', function() {
            sessionStorage.setItem('testSubmitBefore', Date.now());
        });
        document.addEventListener('teststart', function() {
            sessionStorage.setItem('testSubmitStart', Date.now());
        });
        document.addEventListener('testend', function() {
            sessionStorage.setItem('testSubmitEnd', Date.now());
        });
        </script>
    `));
});

app.all('/response', (req, res) => {
    res.send(`<!DOCTYPE html>
        <html lang="ru-RU">
        <head>
            <meta charset="UTF-8">
            <title>response</title>
        </head>
        <body>
            <code></code>
        </body>
        </html>`);
});

app.listen(3003, () => console.log('Test server listening on port 3003!'));

