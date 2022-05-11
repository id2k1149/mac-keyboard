const p = document.createElement('h1');
p.classList.add('title');
p.innerHTML += 'Virtual Keyboard (macOS) for Chrome browser';
document.body.appendChild(p);

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
document.body.appendChild(textarea);
textarea.focus();

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    properties: {
        value: '',
        capsLock: false,
        shift: false,
        language: localStorage.getItem('language'),
    },

    init() {
        // createElement
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        // add
        this.elements.main.classList.add('keyboard');
        this.elements.keysContainer.classList.add('keyboard__keys');

        switch (this.properties.language) {
        case 'US':
            this.elements.keysContainer.appendChild(this.createKeys('US'));
            break;

        case 'RU':
            this.elements.keysContainer.appendChild(this.createKeys('RU'));
            break;

        default:
            this.properties.language = 'US';
            this.elements.keysContainer.appendChild(this.createKeys('US'));
            break;
        }

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        // appendChild
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll('.textarea').forEach((element) => {
            this.open(element.value, (currentValue) => {
                // eslint-disable-next-line no-param-reassign
                element.value = currentValue;
            });
        });
    },

    createKeys(language) {
        const fragment = document.createDocumentFragment();

        const layoutUS = [
            '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫',
            '⇥', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
            '⇪', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '⏎',
            '⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '↑', '⇧ ',
            '🌐', '⌃', '⌥', '⌘', 'space', '⌘', '⌥', '←', '↓', '→',
        ];
        const layoutShiftUS = [
            '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '⌫',
            '⇥', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|',
            '⇪', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '”', '⏎',
            '⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', '↑', '⇧ ',
            '🌐', '⌃', '⌥', '⌘', 'space', '⌘', '⌥', '←', '↓', '→',
        ];
        const layoutRU = [
            '>', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫',
            '⇥', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
            '⇪', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '⏎',
            '⇧', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '/', '↑', '⇧ ',
            '🌐', '⌃', '⌥', '⌘', 'space', '⌘', '⌥', '←', '↓', '→',
        ];
        const layoutShiftRU = [
            '<', '!', '”', '№', '%', ':', ',', '.', ';', '(', ')', '_', '+', '⌫',
            '⇥', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
            '⇪', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '⏎',
            '⇧', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '?', '↑', '⇧ ',
            '🌐', '⌃', '⌥', '⌘', 'space', '⌘', '⌥', '←', '↓', '→',
        ];

        let layout = [];

        // eslint-disable-next-line default-case
        switch (language) {
        case 'US':
            layout = this.properties.shift ? layoutShiftUS : layoutUS;
            break;

        case 'RU':
            layout = this.properties.shift ? layoutShiftRU : layoutRU;
            break;
        }

        layout.forEach((key) => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['⌫', '⏎', '⇧ ', '\\', '|'].indexOf(key) !== -1;

            // SetAttribute / add class
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key) {
            case '⌫':
                keyElement.textContent = key;
                keyElement.classList.add('keyboard__key--medium');
                keyElement.id = 'Backspace';

                keyElement.addEventListener('click', () => {
                    const valueHead = this.getValueHead();
                    const valueTail = this.getValueTail();
                    this.properties.value = this.properties.value.substring(0, valueHead.length - 1)
                    + valueTail;
                    this.triggerEvent('oninput');
                    this.moveLeft(valueTail.length);
                });

                break;

            // TAB = 4
            case '⇥':
                keyElement.textContent = key;
                keyElement.classList.add('keyboard__key--medium');
                keyElement.id = 'Tab';

                keyElement.addEventListener('click', () => {
                    textarea.focus();
                    const valueHead = this.getValueHead();
                    const valueTail = this.getValueTail();
                    this.properties.value = `${valueHead}    ${valueTail}`;
                    this.triggerEvent('oninput');
                    this.moveLeft(valueTail.length);
                });

                break;

            // CapsLock
            case '⇪':
                keyElement.textContent = key;
                keyElement.classList.add('keyboard__key--medium', 'keyboard__key--withDot');
                keyElement.id = 'CapsLock';

                if (this.properties.capsLock) {
                    keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                }

                keyElement.addEventListener('click', () => {
                    this.toggleCapsLock();
                    keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                });

                break;

            // left shift
            case '⇧':
                keyElement.textContent = key;
                keyElement.classList.add('keyboard__key--large');
                keyElement.id = 'Shift';

                keyElement.addEventListener('click', () => {
                    this.shift(language);
                });

                break;

            // right shift
            case '⇧ ':
                keyElement.textContent = key;
                keyElement.id = 'Shift';

                keyElement.addEventListener('click', () => {
                    this.shift(language);
                });

                break;

            // Enter
            case '⏎':
                keyElement.textContent = key;
                keyElement.classList.add('keyboard__key--medium');
                keyElement.id = 'Enter';

                keyElement.addEventListener('click', () => {
                    textarea.focus();
                    const valueHead = this.getValueHead();
                    const valueTail = this.getValueTail();
                    this.properties.value = `${valueHead}\n${valueTail}`;
                    this.triggerEvent('oninput');
                    this.moveLeft(valueTail.length);
                });

                break;

            // language change
            case '🌐':
                keyElement.textContent = key;
                keyElement.id = 'Globe';

                keyElement.addEventListener('click', () => {
                    this.languageChange(language);
                    textarea.focus();
                });

                break;

            // control key
            case '⌃':
                keyElement.textContent = key;
                keyElement.id = 'Control';

                keyElement.addEventListener('click', () => {
                });

                break;

            // option key
            case '⌥':
                keyElement.textContent = key;
                keyElement.id = 'Alt';

                keyElement.addEventListener('click', () => {
                });

                break;

            // command key
            case '⌘':
                keyElement.textContent = key;
                keyElement.id = 'Meta';

                keyElement.addEventListener('click', () => {
                });

                break;

            // space
            case 'space':
                keyElement.classList.add('keyboard__key--x_large');
                keyElement.id = ' ';

                keyElement.addEventListener('click', () => {
                    textarea.focus();
                    const valueHead = this.getValueHead();
                    const valueTail = this.getValueTail();
                    this.properties.value = `${valueHead} ${valueTail}`;
                    this.triggerEvent('oninput');
                    this.moveLeft(valueTail.length);
                });

                break;

            case '←':
                keyElement.textContent = key;
                keyElement.id = 'ArrowLeft';

                keyElement.addEventListener('click', () => {
                    this.moveLeft(1);
                });

                break;

            case '→':
                keyElement.textContent = key;
                keyElement.id = 'ArrowRight';

                keyElement.addEventListener('click', () => {
                    this.moveRight(1);
                });

                break;

            case '↑':
                keyElement.textContent = key;
                keyElement.id = 'ArrowUp';

                keyElement.addEventListener('click', () => {
                    this.moveUP();
                });

                break;

            case '↓':
                keyElement.textContent = key;
                keyElement.id = 'ArrowDown';

                keyElement.addEventListener('click', () => {
                    this.moveDown();
                });

                break;

            default:
                keyElement.textContent = (
                    // eslint-disable-next-line no-nested-ternary
                    this.properties.shift
                        ? key.toUpperCase()
                        : (this.properties.capsLock ? key.toUpperCase() : key.toLowerCase())
                );
                keyElement.id = key;

                keyElement.addEventListener('click', () => {
                    textarea.focus();
                    const valueHead = this.getValueHead();
                    const valueTail = this.getValueTail();
                    this.properties.value = this.properties.value.substring(0, valueHead.length - 1)
                    + valueTail;
                    this.triggerEvent('oninput');
                    this.moveLeft(valueTail.length);

                    this.properties.value = valueHead
                    // eslint-disable-next-line no-nested-ternary
                    + (this.properties.capsLock
                        ? key.toUpperCase()
                        : (this.properties.shift ? key.toUpperCase() : key.toLowerCase()))
                    + valueTail;

                    this.triggerEvent('oninput');
                    this.moveLeft(valueTail.length);
                    if (this.properties.shift) {
                        this.properties.shift = false;
                        this.close();
                        Keyboard.init();
                    }
                });

                break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    },

    triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] === 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        // eslint-disable-next-line no-restricted-syntax
        for (const key of this.elements.keys) {
            key.textContent = this.properties.capsLock
                ? key.textContent.toUpperCase()
                : key.textContent.toLowerCase();
        }
        textarea.focus();
    },

    languageChange(language) {
        this.close();
        this.triggerEvent('onclose');

        // eslint-disable-next-line default-case
        switch (language) {
        case 'US':
            this.properties.language = 'RU';
            localStorage.setItem('language', 'RU');
            this.properties.capsLock = false;
            Keyboard.init();
            break;

        case 'RU':
            this.properties.language = 'US';
            localStorage.setItem('language', 'US');
            this.properties.capsLock = false;
            Keyboard.init();
            break;
        }
    },

    shift() {
        this.properties.shift = !this.properties.shift;
        this.close();
        Keyboard.init();
        textarea.focus();
    },

    moveLeft(x) {
        let newPosition = this.getCursorPosition() - x;
        if (newPosition < 0) newPosition = 0;

        textarea.focus();
        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
    },

    moveUP() {
        const valueArr = this.properties.value.slice(0, this.getCursorPosition()).split('\n');
        const rowNumber = this.getCurrentRow();
        const columnNumber = this.getCurrentColumn();
        let newPosition = 0;

        if (rowNumber > 1) {
            for (let i = 0; i < rowNumber - 2; i += 1) {
                newPosition += valueArr[i].length + 1;
            }

            if (valueArr[rowNumber - 2].length > columnNumber) {
                newPosition += columnNumber;
            } else {
                newPosition += valueArr[rowNumber - 2].length;
            }
        }

        if (newPosition < 0) newPosition = 0;

        textarea.focus();
        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
    },

    moveRight(x) {
        let newPosition = this.getCursorPosition() + x;
        if (newPosition > this.properties.value.length) newPosition = this.properties.value.length;

        textarea.focus();
        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
    },

    moveDown() {
        const rowNumber = this.getCurrentRow();
        const columnNumber = this.getCurrentColumn();
        const valueArr = this.properties.value.split('\n');

        let newPosition = 0;

        if (rowNumber < valueArr.length) {
            for (let i = 0; i < rowNumber; i += 1) {
                newPosition += valueArr[i].length + 1;
            }

            if (columnNumber < valueArr[rowNumber].length) {
                newPosition += columnNumber;
            } else {
                newPosition += valueArr[rowNumber].length;
            }
        } else {
            newPosition = this.properties.value.length;
        }

        if (newPosition > this.properties.value.length) {
            newPosition = this.properties.value.length;
        }

        textarea.focus();
        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
    },

    getCursorPosition() {
        const cursorPosition = document.querySelector('textarea').selectionStart;
        return cursorPosition;
    },

    getCurrentColumn() {
        const textLines = this.properties.value.slice(0, this.getCursorPosition()).split('\n');
        const currentColumnIndex = textLines[textLines.length - 1].length;
        return currentColumnIndex;
    },

    getCurrentRow() {
        const textLines = this.properties.value.slice(0, this.getCursorPosition()).split('\n');
        return textLines.length;
    },

    getValueHead() {
        return this.properties.value.slice(0, this.getCursorPosition());
    },

    getValueTail() {
        return this.properties.value.slice(this.getCursorPosition(), this.properties.value.length);
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    },

    close() {
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    },

};

window.addEventListener('DOMContentLoaded', () => {
    Keyboard.init();

    window.addEventListener('keydown', (event) => {
        Keyboard.elements.keys.forEach((key) => {
            if (key.id === event.key) {
                key.classList.add('keyboard__key--realKey');
            }
        });
    });

    window.addEventListener('keyup', (event) => {
        Keyboard.elements.keys.forEach((key) => {
            if (key.id === event.key) {
                key.classList.remove('keyboard__key--realKey');
            }
        });
    });
});
