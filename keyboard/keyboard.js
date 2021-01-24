// first define an object
// this object will be the entire keyboard
// contain all methods and properties inside this object

const Keyboard = {
    // this needs to keep track of main keyboard
    // needs to keep track of keys
    // needs to keep track of buttons
    elements: {
        // main refers to main keyboard element
        main: null,
        // keysContainer refers to the keys container
        keysContainer: null,
        // keys is an array for the key buttons
        keys: []
    },

    eventHandlers: {
        // when the other code says open keyboard
        // they're gonna hit the eventHandlers
        oninput: null,
        onclose: null
    },

    properties: {
        // contains values for current state of keyboard
        // value represents current value of keyboard
        // capsLock is a true/false whether we are currently in caps lock mode
        value: "",
        capsLock: false
    },

    init() {
        // init runs when the page first loads
        // it runs all the elements
        // create main element div
        this.elements.main = document.createElement("div");
        // create keysContainer div
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements, this creates classes and adds the keys
        this.elements.main.classList.add("keyboard", "1keyboard--hidden");
        
        // this creates the keyboard_keys class
        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key");

        // Add to DOM
        // this will append the keys container to main
        // this will append main to the html body
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    },

    _createKeys() {
        // the underscore is naming convention for private methods
        // this method creates the HTML for each of the keys
        // returns document fragments, which are little virtual elements you can append to other elements
        const fragment = document.createDocumentFragment();
        // keyLayout will contain all keys and buttons and numbers
        // we will loop through the keys and create elements for each one
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        // a function which creates the HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        // looping through keys making button elements for each one
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            // for the lines on the keyboard between backspace and enter and stuff
            // saying if the key we are looping through is not in the array, then return -1 false and don't insert line break
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;


            // add attributes/classes
            // makes each key element a button
            // modifies those buttons according to keyboard_key class css
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            // we need to do dif things depending on which key we loop through
            // starting with backspace which has a wide key
            // the createIcon method is what adds the icon picture based on the name
            switch (key) {
                case "backspace":
                    keyElement.classList.add("keybboard_key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    // when you press the backspace button, it will remove the last character from the string
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        // now because the input has changed, we will call the oninput methods
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keybboard_key--wide", "keyboard_key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    // when you press the caps button, we need to toggle caps lock
                    // keyboard_key--active is what controls the light on the caps button
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard_key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keybboard_key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    // when you press the enter button, we need to add a line
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        // the input has changed, call oninput
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keybboard_key--extra-wide");
                    keyElement.innerHTML = createIconHTML("spacebar");

                    // when you press the enter button, we need to add a space
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        // the input has changed, call oninput
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keybboard_key--wide", "keyboard_key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    // when you press the enter button, we need to add a line
                    keyElement.addEventListener("click", () => {
                        this.close();
                        // the input is done, call onclose
                        this._triggerEvent("onclose");
                    });

                    break;

                default:
                    // for standard keys we just want the lowercase version of letter
                    // or if its in capslock mode we hit toUpperCase
                    keyElement.textContent = key.toLowerCase();

                    // when you press the enter button, we need to add a line
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        // the input has changed, call oninput
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            // adds the key to the fragment container
            fragment.appendChild(keyElement);

            // if we need to insert a linebreak, add the br element
            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        // triggers one of the two events in eventHandler
        console.log("Event triggered! Event Name: " + handlerName);
    },

    _toggleCapsLock() {
        // toggles the caps lock
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {

    },

    close() {

    }
};

window.addEventListener("DOMContentLoaded", function ()  {
    Keyboard.init();
    // so when the page loads, call the init method of the keyboard object
});