console.log("popup.js loaded");

// Function to store values in Chrome storage
function storeElementValueToKey(element, key) {
    chrome.storage.sync.set({ [key]: element.value }, function () {
        console.log(`Setting ${key} to value ${element.value}`);
    });
}

// Function to retrieve values from Chrome storage and set them to elements
function getValueFromKeyAndSetToElement(key, element) {
    chrome.storage.sync.get([key], function (result) {
        element.value = result[key] || ""; // Default to empty string if no value is found
    });
}

window.onload = function () {

    // Define elements and their corresponding storage keys
    const elements = {
        first: document.getElementById("first"),
        second: document.getElementById("second"),
        third: document.getElementById("third"),
        fourth: document.getElementById("fourth"),
        fifth: document.getElementById("fifth"),
        sixth: document.getElementById("sixth"),
        dayHours: document.getElementById("dayHours"),
        weekHours: document.getElementById("weekHours"),
        pomoFocusMins: document.getElementById("pomoFocusMins")
    };

    // Set onchange handlers and retrieve stored values
    Object.keys(elements).forEach((key) => {
        const element = elements[key];
        element.onchange = () => storeElementValueToKey(element, key); // Set onchange to store the value
        getValueFromKeyAndSetToElement(key, element); // Retrieve and set the previously stored value
    });
};