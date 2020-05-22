function convertToMilitaryTime(timeInAmPmFormatString) {

    var amOrPm = timeInAmPmFormatString.match("(am|pm)")[0];
    var justTime = timeInAmPmFormatString.replace(amOrPm, "");

    var cameWithMinutes = justTime.includes(":");
    var hour = parseInt(cameWithMinutes ? justTime.split(":")[0] : justTime);

    var isPostMeridiem = amOrPm === "pm";
    hour = isPostMeridiem ? hour + 12 : hour;

    var finalTime = (cameWithMinutes ? ("" + hour) + ":" + justTime.split(":")[1] :
        ("" + hour) + ":00");

    finalTime = finalTime.padStart(5, "0");

    return finalTime;
}


var test;
test = "8am";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
test = "8pm";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
test = "8:05am";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
test = "8:05pm";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
test = "11am";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
test = "11pm";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
test = "11:05am";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
test = "11:05pm";
console.log("Test: " + test + ".  Result: " + convertToMilitaryTime(test));
