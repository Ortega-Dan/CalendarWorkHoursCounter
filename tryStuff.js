function standardizeToInternationalTime(timeInAmPmFormatString) {

    let amOrPm = timeInAmPmFormatString.match("(am|pm)")[0];
    let justTime = timeInAmPmFormatString.replace(amOrPm, "");

    let cameWithMinutes = justTime.includes(":");
    let hour = parseInt(cameWithMinutes ? justTime.split(":")[0] : justTime);

    let isPostMeridiem = amOrPm === "pm";

    hour = isPostMeridiem && hour !== 12 ? hour + 12 : hour;
    hour = hour === 12 && !isPostMeridiem ? 0 : hour;

    let finalTime = (cameWithMinutes ? ("" + hour) + ":" + justTime.split(":")[1] :
        ("" + hour) + ":00");

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
