const {By, until, Browser} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const test = require('selenium-webdriver/testing');
const chai   = require('chai');
const assert = chai.assert;

test.suite(env => {
    describe('extra-events tests', function() {
        let driver, cap;

        before(async function() {
            let chromeOptions = new chrome.Options().headless().addArguments('no-sandbox');
            let firefoxOptions = new firefox.Options().headless();
            driver = await env.builder()
                .setChromeOptions(chromeOptions)
                .setFirefoxOptions(firefoxOptions)
                .build();
            cap = await driver.getCapabilities();
        });

        after(() => driver.quit());

        it('Check events basic lifecycle', async function() {
            await driver.get('http://localhost:3003/lifecycle');
            await driver.findElement(By.id('button')).click();
            await driver.wait(until.urlContains('/response'), 1000);
            await driver.wait(until.elementLocated(By.css('code')), 300);
            let data = await driver.executeScript(function() {
                return {
                    submitLast:         sessionStorage.getItem('testSubmitLast'),
                    submitBefore:       sessionStorage.getItem('testSubmitBefore'),
                    submitStart:        sessionStorage.getItem('testSubmitStart'),
                    submitEnd:          sessionStorage.getItem('testSubmitEnd'),
                    formLast:           sessionStorage.getItem('testFormLast'),
                    formBefore:         sessionStorage.getItem('testFormBefore'),
                    formStart:          sessionStorage.getItem('testFormStart'),
                    formEnd:            sessionStorage.getItem('testFormEnd'),
                    activeButtonLast:   sessionStorage.getItem('testActiveButtonLast'),
                    activeButtonBefore: sessionStorage.getItem('testActiveButtonBefore'),
                    transportBefore:    sessionStorage.getItem('testTransportBefore'),
                    transportStart:     sessionStorage.getItem('testTransportStart'),
                    transportEnd:       sessionStorage.getItem('testTransportEnd'),
                    sendingForm:        sessionStorage.getItem('testSendingForm'),
                };
            });
            assert.exists(data.submitLast);
            assert.exists(data.submitBefore);
            assert.exists(data.submitStart);
            assert.isTrue(data.submitLast <= data.submitBefore);
            assert.isTrue(data.submitBefore <= data.submitStart);
            assert.strictEqual(data.formLast,           'form');
            assert.strictEqual(data.formBefore,         'form');
            assert.strictEqual(data.formStart,          'form');
            assert.strictEqual(data.activeButtonLast,   'button');
            assert.strictEqual(data.activeButtonBefore, 'button');
            assert.strictEqual(data.transportBefore,    'default');
            assert.strictEqual(data.transportStart,     'default');
            assert.strictEqual(data.sendingForm,        'form');
            if (cap.getBrowserName() !== Browser.SAFARI) { // safari not run code on unload event
                assert.exists(data.submitEnd);
                assert.isTrue(data.submitStart <= data.submitEnd);
                assert.strictEqual(data.formEnd,      'form');
                assert.strictEqual(data.transportEnd, 'default');
            }
        });

        it('Check submitlast preventDefault()', async function() {
            await driver.get('http://localhost:3003/prevent-default');
            await driver.findElement(By.id('button')).click();
            await driver.sleep(200);
            assert.strictEqual(await driver.getCurrentUrl(), 'http://localhost:3003/prevent-default');
            let data = await driver.executeScript(function() {
                return {
                    submitLast:   sessionStorage.getItem('testSubmitLast'),
                    submitBefore: sessionStorage.getItem('testSubmitBefore'),
                    submitStart:  sessionStorage.getItem('testSubmitStart'),
                    submitEnd:    sessionStorage.getItem('testSubmitEnd'),
                };
            });
            assert.exists(data.submitLast);
            assert.notExists(data.submitBefore);
            assert.notExists(data.submitStart);
            assert.notExists(data.submitEnd);
        });

        it('Check register and settings', async function() {
            await driver.get('http://localhost:3003/register-settings');
            await driver.findElement(By.id('button')).click();
            await driver.wait(until.urlContains('/response'), 1000);
            await driver.wait(until.elementLocated(By.css('code')), 300);
            let data = await driver.executeScript(function() {
                return {
                    submitLast:         sessionStorage.getItem('testSubmitLast'),
                    submitBefore:       sessionStorage.getItem('testSubmitBefore'),
                    submitStart:        sessionStorage.getItem('testSubmitStart'),
                    submitEnd:          sessionStorage.getItem('testSubmitEnd'),
                };
            });
            assert.exists(data.submitLast);
            assert.exists(data.submitBefore);
            assert.exists(data.submitStart);
            assert.isTrue(data.submitLast <= data.submitBefore);
            assert.isTrue(data.submitBefore <= data.submitStart);

            if (cap.getBrowserName() !== Browser.SAFARI) { // safari not run code on unload event
                assert.exists(data.submitEnd);
                assert.isTrue(data.submitStart <= data.submitEnd);
            }
        });
    });
});