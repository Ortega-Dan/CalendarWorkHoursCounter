console.log("popupjs loaded");

// first and second prefix elements
var FIRST
var SECOND

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


window.onload = function () {

    // setting elements
    FIRST = document.getElementById("first")
    SECOND = document.getElementById("second")

    // defining onchange functions
    FIRST.onchange = storeFirst;
    SECOND.onchange = storeSecond;

    // setting previously saved results
    chrome.storage.sync.get(["first"], function (result) {
        FIRST.value = result["first"]
    });
    chrome.storage.sync.get(["second"], function (result) {
        SECOND.value = result["second"]
    });
}