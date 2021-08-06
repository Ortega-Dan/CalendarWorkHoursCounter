console.log("popupjs loaded");

var FIRST
var SECOND


function storeFirst() {

    chrome.storage.sync.set({ "first": FIRST.value }, function () {

        console.log("setting first to value " + FIRST.value);

    });

}
function storeSecond() {

    chrome.storage.sync.set({ "second": SECOND.value }, function () {

        console.log("setting second to value " + SECOND.value);

    });

}


window.onload = function () {

    FIRST = document.getElementById("first")
    SECOND = document.getElementById("second")

    FIRST.onchange = storeFirst;
    SECOND.onchange = storeSecond;

    chrome.storage.sync.get(["first"], function (result) {
        FIRST.value = result["first"]
    });

    chrome.storage.sync.get(["second"], function (result) {
        SECOND.value = result["second"]
    });
}