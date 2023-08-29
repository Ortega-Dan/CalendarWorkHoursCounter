console.log("popupjs loaded");

// prefix elements
var FIRST
var SECOND
var THIRD
var FOURTH

// first prefix setter
function storeFirst() {
    chrome.storage.sync.set({ "first": FIRST.value }, function () {
        console.log("setting first to value " + FIRST.value);
    });
}

// second prefix setter
function storeSecond() {
    chrome.storage.sync.set({ "second": SECOND.value }, function () {
        console.log("setting second to value " + SECOND.value);
    });
}

// third prefix setter
function storeThird() {
    chrome.storage.sync.set({ "third": THIRD.value }, function () {
        console.log("setting third to value " + THIRD.value);
    });
}

// fourth prefix setter
function storeFourth() {
    chrome.storage.sync.set({ "fourth": FOURTH.value }, function () {
        console.log("setting fourth to value " + FOURTH.value);
    });
}


window.onload = function () {

    // setting elements
    FIRST = document.getElementById("first")
    SECOND = document.getElementById("second")
    THIRD = document.getElementById("third")
    FOURTH = document.getElementById("fourth")

    // defining onchange functions
    FIRST.onchange = storeFirst;
    SECOND.onchange = storeSecond;
    THIRD.onchange = storeThird;
    FOURTH.onchange = storeFourth;

    // setting previously saved results
    chrome.storage.sync.get(["first"], function (result) {
        FIRST.value = result["first"]
    });
    chrome.storage.sync.get(["second"], function (result) {
        SECOND.value = result["second"]
    });
    chrome.storage.sync.get(["third"], function (result) {
        THIRD.value = result["third"]
    });
    chrome.storage.sync.get(["fourth"], function (result) {
        FOURTH.value = result["fourth"]
    });
}