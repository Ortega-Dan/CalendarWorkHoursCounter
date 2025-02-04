console.log("popupjs loaded");
// THIS DEFINITELY NEEDS TO BE IMPROVED/MODULARIZED

// prefix elements
var FIRST
var SECOND
var THIRD
var FOURTH
var FIFTH
var SIXTH

var DAY_HOURS
var WEEK_HOURS

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

// fifth prefix setter
function storeFifth() {
    chrome.storage.sync.set({ "fifth": FIFTH.value }, function () {
        console.log("setting fifth to value " + FIFTH.value);
    });
}

// sixth prefix setter
function storeSixth() {
    chrome.storage.sync.set({ "sixth": SIXTH.value }, function () {
        console.log("setting sixth to value " + SIXTH.value);
    });
}

// day hours value setter
function storeDayHours() {
    chrome.storage.sync.set({ "dayHours": DAY_HOURS.value }, function () {
        console.log("setting dayHours to value " + DAY_HOURS.value);
    });
}

// week hours value setter
function storeWeekHours() {
    chrome.storage.sync.set({ "weekHours": WEEK_HOURS.value }, function () {
        console.log("setting weekHours to value " + WEEK_HOURS.value);
    });
}


window.onload = function () {

    // setting elements
    FIRST = document.getElementById("first")
    SECOND = document.getElementById("second")
    THIRD = document.getElementById("third")
    FOURTH = document.getElementById("fourth")
    FIFTH = document.getElementById("fifth")
    SIXTH = document.getElementById("sixth")

    DAY_HOURS = document.getElementById("dayHours")
    WEEK_HOURS = document.getElementById("weekHours")

    // defining onchange functions
    FIRST.onchange = storeFirst;
    SECOND.onchange = storeSecond;
    THIRD.onchange = storeThird;
    FOURTH.onchange = storeFourth;
    FIFTH.onchange = storeFifth;
    SIXTH.onchange = storeSixth;
    
    DAY_HOURS.onchange = storeDayHours;
    WEEK_HOURS.onchange = storeWeekHours;

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
    chrome.storage.sync.get(["fifth"], function (result) {
        FIFTH.value = result["fifth"]
    });
    chrome.storage.sync.get(["sixth"], function (result) {
        SIXTH.value = result["sixth"]
    });


    chrome.storage.sync.get(["dayHours"], function (result) {
        DAY_HOURS.value = result["dayHours"]
    });
    chrome.storage.sync.get(["weekHours"], function (result) {
        WEEK_HOURS.value = result["weekHours"]
    });
}