// Setting a month conversion helper array
// const months = ['January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December']

// Single calendar event element container... css description string
const calEventElement = "div.ynRLnc"

// week and daily hours margins
const weeklyHoursMargin = 40
const dailyHoursMargin = 8

/** Function used with enterprise calendar to convert from Meridian time to Military time */
function standardizeToInternationalTime(receivedFormatTimeString) {

    // Extracting am or pm
    var isAmPm = receivedFormatTimeString.match("(am|pm)");
    if (isAmPm === null) {
        return receivedFormatTimeString;
    }

    var amOrPm = isAmPm[0];
    var isPostMeridiem = amOrPm === "pm";

    // Extracting the time
    var justTime = receivedFormatTimeString.replace(amOrPm, "");

    // Finding if it came with minutes and the hour
    var cameWithMinutes = justTime.includes(":");
    var hour = parseInt(cameWithMinutes ? justTime.split(":")[0] : justTime);

    // Converting the hour to a 24 hour standard
    hour = isPostMeridiem && hour !== 12 ? hour + 12 : hour;
    hour = hour === 12 && !isPostMeridiem ? 0 : hour;

    // Adding the minutes to the hour
    var finalTime = (cameWithMinutes ? ("" + hour) + ":" + justTime.split(":")[1] :
        ("" + hour) + ":00");

    // Padding to 2 digits in the hour
    finalTime = finalTime.padStart(5, "0");

    return finalTime;
}

function getHoursDiffBetweenTwoDateObjs(startDateTime, endDateTime) {
    var minutesDiff = ((endDateTime - startDateTime) / 60000)
    minutesDiff = Math.floor(minutesDiff)

    return minutesDiff / 60
}


function convertDecimalHoursToTimeFormat(hoursInDecimalFormat) {
    return "" + parseInt(hoursInDecimalFormat) + ":" + ("" + parseInt((hoursInDecimalFormat - parseInt(hoursInDecimalFormat)) * 60)).padStart(2, "0")
}

function showHoursDiffTo(hoursSum, hoursThreshold, label, displayFinishingTime = false) {

    if ((hoursThreshold - hoursSum) < 0) {
        alert("[" + label + "]\n\n" + (displayFinishingTime ? "You've worked " : "You have ") +
            convertDecimalHoursToTimeFormat((hoursThreshold - hoursSum) * -1) + " extra hours")
    } else if ((hoursThreshold - hoursSum) == 0) {
        alert("[" + label + "]\n\nYou're done for " + (label.toLowerCase().includes("week") ? "the week" : "the day") + "!")
    } else {
        var timeDiffString = convertDecimalHoursToTimeFormat(hoursThreshold - hoursSum)

        var dateTime = new Date()

        dateTime.setHours(dateTime.getHours() + parseInt(timeDiffString.split(":")[0]))
        dateTime.setMinutes(dateTime.getMinutes() + parseInt(timeDiffString.split(":")[1]))

        var hours = dateTime.getHours()
        alert("[" + label + "]\n\n" + timeDiffString + " hours missing" +
            (displayFinishingTime ?
                "\n\nFinishing by " + (hours == 12 ? hours : hours % 12) + ":" + ("" + dateTime.getMinutes()).padStart(2, "0") + (hours / 12 < 1.0 ? " am" : " pm") : ""))

    }

}

// Listening to keypress events in the entire document
$("html").keydown(function (event) {

    // Running functionality con Ctrl + i or Ctrl + k (case insensitive)
    if (event.altKey === true && (event.code === "KeyI" || event.code === "KeyK" || event.code === "KeyO")) {

        event.preventDefault()
        event.stopPropagation()

        // Variable to hold query (entered or inferred)
        var requiredDayText
        var nowDateTime = new Date()

        var showFinishingTime = event.code === "KeyO"

        // Set the query for the current day
        if (event.code === "KeyI" || event.code === "KeyO") {

            // Google Calendar format
            requiredDayText = "" + nowDateTime.getDate()
            // requiredDayText = months[nowDateTime.getMonth()] + " " + nowDateTime.getDate() +
            //     ", " + nowDateTime.getFullYear()
        }

        // Prompting for the query when user requested
        if (event.code === "KeyK") {
            // Enterprise query should be Day and Month, whereas Google Calendar should be Month and Day
            requiredDayText = prompt("What Day Number do you want to check ?\n[From the week on screen]\n\n" +
                "Or leave empty to check the entire week.").trim()
        }

        // Logging the query (entered or inferred)
        console.log("Checking " + (requiredDayText == "" ? "the week displayed" : requiredDayText) + ".")

        // Converting the query to lower case for later case insensitive matching
        requiredDayText = requiredDayText == null ? "" : requiredDayText.toLowerCase()

        // Initializing variable to add times
        var calendarTimeAdder = 0
        var passedHoursAdder = 0

        var events = []

        $(calEventElement).each(function (index) {
            var text = $(this).text()

            if (text === "") { return }

            if (events.includes(text)) { return }

            events.push(text)

            originalText = text
            text = text.toLowerCase()

            // getting current record calendar day number
            let textDay = getSingleDayRecordDayNumber(text)

            // ignoring "cal.ignore"s and external-calendar-without-details busy times
            if (textDay != null && ((textDay == requiredDayText || requiredDayText == "") && !text.includes("cal.ignore") && !text.includes(", busy, calendar: ") && !text.includes(", declined, ") && !text.includes(", tentative, "))) {

                console.log(++index + ") " + originalText)

                var splittedText = text.split(" ")

                var fromTime = splittedText[0]
                // ignoring events with no time span
                if (fromTime[fromTime.length - 1] == ',') {
                    console.log("Ignoring event with no time span.");
                    return;
                }
                var toTime = splittedText[2]

                var singleDateStart = splittedText.length - 3
                var singleDate = splittedText[singleDateStart] + " " + splittedText[singleDateStart + 1] + " " +
                    splittedText[singleDateStart + 2];

                var fromDate = singleDate
                var toDate = singleDate

                if (/^[A-Za-z]{2,}$/.test(fromTime)) {
                    fromTime = splittedText[4]
                    toTime = splittedText[10]

                    fromDate = splittedText[0] + " " + splittedText[1] + " " +
                        splittedText[2];
                    toDate = splittedText[6] + " " + splittedText[7] + " " +
                        splittedText[8];
                }

                toTime = toTime.substring(0, toTime.length - 1)

                // Function implementation for Enterprise calendar

                fromTime = standardizeToInternationalTime(fromTime)
                toTime = standardizeToInternationalTime(toTime)

                var startDateTime = new Date(fromDate + " " + fromTime);
                var endDateTime = new Date(toDate + " " + toTime);

                var hoursLength = getHoursDiffBetweenTwoDateObjs(startDateTime, endDateTime)
                console.log("Hours: " + hoursLength)
                calendarTimeAdder += hoursLength

                // checking how many minutes or hours have actually passed
                // (for now only used in current day finish estimation with KeyO)
                if (startDateTime < nowDateTime) {
                    if (endDateTime < nowDateTime) {
                        passedHoursAdder += hoursLength
                    } else {
                        passedHoursAdder += getHoursDiffBetweenTwoDateObjs(startDateTime, nowDateTime)
                    }
                }

            }
        })

        console.log("Total time: " + convertDecimalHoursToTimeFormat(calendarTimeAdder) + " hours.");

        if (requiredDayText == "") {
            requiredDayText = "Entire Week"
        }

        // Showing results
        if (calendarTimeAdder === 0) {
            alert("No active events found for filter [" + requiredDayText + "]")
            // alert("No events owned, confirmed, or pending confirmation found for filter [" + requiredDayText + "]")
        } else {
            alert("[" + requiredDayText + "]\n\n" + convertDecimalHoursToTimeFormat(showFinishingTime ? passedHoursAdder : calendarTimeAdder) + " hours " + (showFinishingTime ? "worked" : "recorded"))

            if (requiredDayText == "Entire Week") {
                // show hours diff for week query
                showHoursDiffTo(calendarTimeAdder, weeklyHoursMargin, requiredDayText)
            } else {
                // Show hours diff for single day query
                if (showFinishingTime) {
                    showHoursDiffTo(passedHoursAdder, dailyHoursMargin, requiredDayText, true)
                } else {
                    showHoursDiffTo(calendarTimeAdder, dailyHoursMargin, requiredDayText)
                }
            }
        }

        console.log("Done ******\n\n\n")

    }

    // insert first prefix
    if (event.altKey === true && event.code === "KeyH") {
        chrome.storage.sync.get(["first"], function (result) {
            // console.log('first value is ' + result["first"]);
            document.activeElement.nextSibling.textContent = ""
            document.activeElement.value = result["first"]
        });
    }

    // insert first prefix
    if (event.altKey === true && event.code === "KeyJ") {
        chrome.storage.sync.get(["second"], function (result) {
            // console.log('first value is ' + result["first"]);
            document.activeElement.nextSibling.textContent = ""
            document.activeElement.value = result["second"]
        });
    }

    // insert second prefix
    if (event.altKey === true && event.code === "KeyL") {
        chrome.storage.sync.get(["third"], function (result) {
            // console.log('second value is ' + result["second"]);
            document.activeElement.nextSibling.textContent = ""
            document.activeElement.value = result["third"]
        });
    }

})

// returns null if record doesn't meet the standard format for single day records
function getSingleDayRecordDayNumber(text) {
    let toIndex = text.lastIndexOf(",")
    let fromIndex = text.substring(0, toIndex).lastIndexOf(" ") + 1

    numberSpaceText = text.substring(fromIndex, toIndex)

    return isNaN(numberSpaceText) == false ? numberSpaceText : null
}
