const defaultSettings = {
    eventLast:   'submitlast',
    eventBefore: 'submitbefore',
    eventStart:  'submitstart',
    eventEnd:    'submitend',
};

// shorthands for uglify
const doc = document;
const win = doc.defaultView;

// can shim
let closest      = Element.prototype.closest;
let objectAssign = Object.assign;
let CustomEvent  = win.CustomEvent;

// data
let currentForm = null;
let activeBtn   = null;
let started     = false;
let settings    = null;
let eventEnd;

/**
 * @param {Event} e
 */
function clickHandler(e) {
    let target = e.target;
    target = target && closest.call(target, 'button,input');
    if (target && (target.type === 'submit' || target.type === 'image')) {
        activeBtn = target;
        setTimeout(() => {
            activeBtn = null;
        }, 1);
    }
}

/**
 */
function documentSubmitHandler() {
    currentForm = null;
    started     = false;
    win.removeEventListener('submit', lastHandler);
    win.addEventListener('submit', lastHandler);
}

/**
 * @param {String} eventName
 * @param {Boolean} [timeout]
 */
function makeEvent(eventName, timeout) {
    let detail = {transport: 'default'};
    if (eventName === settings.eventBefore) {
        detail.activeButton = activeBtn;
    }
    if (timeout !== undefined) {
        detail.timeout = timeout;
    }
    return new CustomEvent(eventName, {
        bubbles: true,
        cancelable: false,
        detail: detail,
    });
}

/**
 * @param {HTMLFormElement} form
 * @param {String} eventName
 * @param {Boolean} [timeout]
 */
function triggerEvent(form, eventName, timeout) {
    let event = makeEvent(eventName, timeout);
    form.dispatchEvent(event);
}

/**
 * @param {Event} e
 */
function lastHandler(e) {
    win.removeEventListener('submit', lastHandler);

    /** @var {HTMLFormElement} form */
    let form = e.target;
    let event = new CustomEvent(settings.eventLast, {
        bubbles: true,
        cancelable: true,
        detail: {
            activeButton: activeBtn,
        }
    });
    if (e.defaultPrevented) {
        event.preventDefault();
    }
    form.dispatchEvent(event);

    if (!event.defaultPrevented) {
        runDefaultTransport(form);
    } else {
        e.preventDefault();
    }
}

/**
 * @param {HTMLFormElement} form
 */
function runDefaultTransport(form) {
    currentForm = form;
    triggerEvent(form, settings.eventBefore);
}

/**
 */
function beforeUnloadHandler() {
    currentForm && !started && triggerEvent(currentForm, settings.eventStart);
    started = true;

    // ie/edge CustomEvent bugfix
    // @see: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/19861977/
    eventEnd = eventEnd || makeEvent(settings.eventEnd);
}

/**
 * @param {Boolean} timeout
 */
function triggerEnd(timeout) {
    if (currentForm) {
        if (eventEnd) {
            eventEnd.detail.timeout = timeout;
            currentForm.dispatchEvent(eventEnd);
        } else {
            triggerEvent(currentForm, settings.eventEnd, timeout);
        }
    }
    currentForm = null;
    started     = false;
}

/**
 */
function unloadHandler() {
    triggerEnd(false);
}

export default {
    /**
     * Set shims
     * @param {Function|null} [setClosest]
     * @param {Function|null} [setObjectAssign]
     * @param {Function|null} [setCustomEvent]
     */
    setShim: function(setClosest, setObjectAssign, setCustomEvent) {
        closest      = setClosest      || closest;
        objectAssign = setObjectAssign || objectAssign;
        CustomEvent  = setCustomEvent  || CustomEvent;
    },

    /**
     * Return current sending form
     * @returns {HTMLFormElement}
     */
    getSendingForm: () => {
        return currentForm;
    },

    /**
     * Force submitend event
     * @param {Boolean} timeout
     */
    forceSubmitEnd: (timeout) => {
        triggerEnd(timeout);
    },

    /**
     * Return current settings
     * @returns {{}}
     */
    getSettings: () => {
        return settings;
    },

    /**
     * Register plugin
     * @param {{}} [setSettings]
     * @returns {{}}
     */
    register: (setSettings) => {
        if (settings) {
            throw new Error('form-extra-events already registered');
        }
        settings = objectAssign({}, defaultSettings, setSettings || {});
        win.addEventListener('click',        clickHandler);
        doc.addEventListener('submit',       documentSubmitHandler);
        win.addEventListener('beforeunload', beforeUnloadHandler);
        win.addEventListener('unload',       unloadHandler);
        return settings;
    },

    /**
     * Unregister plugin
     */
    unregister: () => {
        settings = null;
        win.removeEventListener('click',        clickHandler);
        doc.removeEventListener('submit',       documentSubmitHandler);
        win.removeEventListener('beforeunload', beforeUnloadHandler);
        win.removeEventListener('unload',       unloadHandler);
    }
};