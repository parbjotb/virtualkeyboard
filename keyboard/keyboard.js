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
        //oninput is what is triggered when we hit any key except done
        oninput: null,
        // onClose is triggered when we hit the done button
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
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        
        // this creates the keyboard_keys class
        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        // this makes everything in the keysContainer get stored in a keys array
        // querySelectorAll takes everything from keyboard_key and puts it into keys array
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key");

        // Add to DOM
        // this will append the keys container to main
        // this will append main to the html body
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //Brings up the keyboard for elements with "use-keyboard-input" class
        // the text area has this class
        //for each input that has that input class, when we focus on that input it will open up the keyboard
        // open() has a few parameters, but if we don't give it a value, it reverts to an empty string
        // the value of the text area will be set to the currentValue of the keyboard
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
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
                    keyElement.classList.add("keyboard_key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    // when you press the backspace button, it will remove the last character from the string
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        // now because the input has changed, we will call the oninput methods
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard_key--wide", "keyboard_key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    // when you press the caps button, we need to toggle caps lock
                    // keyboard_key--active is what controls the light on the caps button
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard_key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard_key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    // when you press the enter button, we need to add a line
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        // the input has changed, call oninput
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard_key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

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
        // is a function specified as the value of one of the event properties (oninput or onclose)
        // if there is a function specified, if the user has specified a function for the handler then we can fire it off
        // we are passing the current value of the keyboard to the code that is using the keyboard
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        // toggles the caps lock
        // by setting the caps lock property to be the opposite of what it is
        // it will flip the current value of the caps lock
        this.properties.capsLock = !this.properties.capsLock;

        // when the caps lock gets turned on/off
        // we want the keyboard icons (the text content) to switch as well
        // this makes it so depending on the status of caps lock, the keys will be upper or lowercase
        // this.elements.keys is an array made in the init() method, this says for each key in that array
        // key.childElementCount checks for if there are any icons like spacebar, if there are 0 icons on a key, then the caps lock can change the key
        // e.g. backspace is a key, but the icon on it is an element, therefore the key has 1 child element and the method doesn't affect it
        // meanwhile letters do not have any child elements, just their own text content
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                // if the caps lock is on, go to uppercase, otherwise go to lowercase
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        // if a value was provided, use it, or pass an empty string instead
        // this resets the value of the keyboard
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        // when we open the keyboard, it is no longer going to be hidden
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        // upon closing the keyboard it resets to an empty string
        this.properties.value = "";
        // also reset the eventHandlers
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        // when we hit the done button, it will hide the keyboard
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function ()  {
    Keyboard.init();
    // so when the page loads, call the init method of the keyboard object
    // // also open the keyboard when the page loads, it will load the text "parbjot" on page load
    // // the open method has three parameters (initialValue, oninput, onclose)
    // //initialValue is parbjot, the functions are the other parameters
    // Keyboard.open("parbjot", function (currentValue) {
    //     console.log("value changed! here it is: " + currentValue);
    // }, function (currentValue) {
    //     console.log("keyboard closed! Finishing value: " + currentValue);
    // });
});