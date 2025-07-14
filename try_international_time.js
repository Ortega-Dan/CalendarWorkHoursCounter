function standardizeToInternationalTime(receivedFormatTimeString) {

    // Extracting am or pm
    let isAmPm = receivedFormatTimeString.match("(am|pm)");
    if (isAmPm === null) {
        return receivedFormatTimeString;
    }

    let amOrPm = isAmPm[0];
    let isPostMeridiem = amOrPm === "pm";

    // Extracting the time
    let justTime = receivedFormatTimeString.replace(amOrPm, "");

    // Finding if it came with minutes and the hour
    let cameWithMinutes = justTime.includes(":");
    let hour = parseInt(cameWithMinutes ? justTime.split(":")[0] : justTime);

    // Converting the hour to a 24 hour standard
    hour = isPostMeridiem && hour !== 12 ? hour + 12 : hour;
    hour = hour === 12 && !isPostMeridiem ? 0 : hour;

    // Adding the minutes to the hour
    let finalTime = (cameWithMinutes ? ("" + hour) + ":" + justTime.split(":")[1] :
        ("" + hour) + ":00");

    // Padding to 2 digits in the hour
    finalTime = finalTime.padStart(5, "0");

    return finalTime;
}


let test;
test = "8am";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "8pm";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "8:05am";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "8:05pm";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));

console.log("");

test = "11am";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "11pm";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "11:05am";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "11:05pm";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));

console.log("");

test = "12am";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "12pm";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "12:05am";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
test = "12:05pm";
console.log("Test: " + test + ".  Result: " + standardizeToInternationalTime(test));
