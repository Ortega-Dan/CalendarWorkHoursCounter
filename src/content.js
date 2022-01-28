// Setting a month conversion helper array
var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

// Single calendar event element container... css description string
var calEventElement = "div.ynRLnc"

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


function convertDecimalHoursToTimeFormat(hoursInDecimalFormat) {
    return "" + parseInt(hoursInDecimalFormat) + ":" + ("" + parseInt((hoursInDecimalFormat - parseInt(hoursInDecimalFormat)) * 60)).padStart(2, "0")
}

function showHoursDiffTo(hoursSum, hoursThreshold, label) {

    if ((hoursThreshold - hoursSum) < 0) {
        alert("[" + label + "]\n\nYou've worked " +
            convertDecimalHoursToTimeFormat((hoursThreshold - hoursSum) * -1) + " extra hours")
    } else {
        alert("[" + label + "]\n\nOnly " + convertDecimalHoursToTimeFormat(hoursThreshold - hoursSum) + " hours missing")
    }

}

// Listening to keypress events in the entire document
$("html").keydown(function (event) {

    // Running functionality con Ctrl + i or Ctrl + k (case insensitive)
    if (event.altKey === true && (event.code === "KeyI" | event.code === "KeyK")) {

        event.preventDefault()
        event.stopPropagation()

        // Variable to hold query (entered or inferred)
        var requiredDayText

        // Set the query for the current day
        if (event.code === "KeyI") {

            var todaysDate = new Date()

            // Google Calendar format
            requiredDayText = months[todaysDate.getMonth()] + " " + todaysDate.getDate() +
                ", " + todaysDate.getFullYear()

        }

        // Prompting for the query when user requested
        if (event.code === "KeyK") {
            // Enterprise query should be Day and Month, whereas Google Calendar should be Month and Day
            requiredDayText = prompt("What Month and Day do you want to check ?\n[From the week on screen and in the format: Month day#]\n\n" +
                "Or leave empty to check the entire week.")
        }

        // Logging the query (entered or inferred)
        console.log("Checking " + (requiredDayText == "" ? "the week displayed" : requiredDayText) + ".")

        // Converting the query to lower case for later case insensitive matching
        requiredDayText = requiredDayText == null ? "" : requiredDayText.toLowerCase()

        // Initializing variable to add times
        var calendarTimeAdder = 0

        var events = []

        $(calEventElement).each(function (index) {
            var text = $(this).text()

            if (text === "") { return }

            if (events.includes(text)) { return }

            events.push(text)

            originalText = text
            text = text.toLowerCase()

            // ignoring "cal.ignore"s and external-calendar-without-details busy times
            if (text.includes(requiredDayText) && !text.includes("cal.ignore") && !text.includes(", busy, calendar: ")) {

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


                var minutesDiff = ((endDateTime - startDateTime) / 60000)
                minutesDiff = Math.floor(minutesDiff)

                var hoursLength = minutesDiff / 60
                console.log("Hours: " + hoursLength)
                calendarTimeAdder += hoursLength

            }
        })

        console.log("Total time: " + convertDecimalHoursToTimeFormat(calendarTimeAdder) + " hours.");

        if (requiredDayText == "") {
            requiredDayText = "Entire Week"
        }

        // Showing results
        if (calendarTimeAdder === 0) {
            alert("No times found for filter [" + requiredDayText + "]")
        } else {
            alert("[" + requiredDayText + "]\n\n" + convertDecimalHoursToTimeFormat(calendarTimeAdder) + " hours worked")

            if (requiredDayText == "Entire Week") {
                // show hours diff for week query
                showHoursDiffTo(calendarTimeAdder, 40, requiredDayText)
            } else {
                // Show hours diff for single day query
                showHoursDiffTo(calendarTimeAdder, 8, requiredDayText)
            }
        }

        console.log("Done ******\n\n\n")

    }

    // insert first prefix
    if (event.altKey === true && event.code === "KeyJ") {
        chrome.storage.sync.get(["first"], function (result) {
            // console.log('first value is ' + result["first"]);
            document.activeElement.nextSibling.textContent = ""
            document.activeElement.value = result["first"]
        });
    }

    // insert second prefix
    if (event.altKey === true && event.code === "KeyL") {
        chrome.storage.sync.get(["second"], function (result) {
            // console.log('second value is ' + result["second"]);
            document.activeElement.nextSibling.textContent = ""
            document.activeElement.value = result["second"]
        });
    }

})