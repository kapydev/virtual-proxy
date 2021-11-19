"use strict";
const target = {
    msg1: "Hello",
    msg2: "World",
    yourMotherFunc() {
        console.log("Yo mama");
    }
};
const proxy = new Proxy(target, {});
proxy.yourMotherFunc();
