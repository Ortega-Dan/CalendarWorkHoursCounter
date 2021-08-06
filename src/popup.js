console.log("popupjs loaded");

function store() {

    chrome.storage.sync.set({ "hola": "quetal" }, function () {

        console.log("setting");

    });

}

function read() {

    chrome.storage.sync.get(["hola"], function (result) {

        console.log('hola value is ' + result["hola"]);

    });

}

window.onload = function () {
    document.getElementById("store").onclick = store;
    document.getElementById("read").onclick = read;
}