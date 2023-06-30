// Setting a month conversion helper array
// const months = ['January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December']

// Single calendar event element container... css description string
const calEventElement = "div.ynRLnc"
const firstDayElement = "div.KSxb4d"
const monthsAndYearsOfViewElement = "div.rSoRzd"

// week and daily hours margins
const weeklyHoursMargin = 40
const dailyHoursMargin = 8

/** Function used with enterprise calendar to convert from Meridian time to Military time */
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

function getHoursDiffBetweenTwoDateObjs(startDateTime, endDateTime) {
    let minutesDiff = ((endDateTime - startDateTime) / 60000)
    minutesDiff = Math.floor(minutesDiff)

    return minutesDiff / 60
}


function convertDecimalHoursToTimeFormat(hoursInDecimalFormat) {
    return "" + parseInt(hoursInDecimalFormat) + ":" +
        ("" + parseInt((hoursInDecimalFormat - parseInt(hoursInDecimalFormat)) * 60)).padStart(2, "0")
}

function showHoursDiffTo(hoursSum, hoursThreshold, label, displayFinishingTime = false) {

    if ((hoursThreshold - hoursSum) < 0) {
        alert("[" + label + "]\n\n" + (displayFinishingTime ? "You've worked " : "You have ") +
            convertDecimalHoursToTimeFormat((hoursThreshold - hoursSum) * -1) + " extra hours")
    } else if ((hoursThreshold - hoursSum) == 0) {
        alert("[" + label + "]\n\nYou're done for " + (label.toLowerCase().includes("week") ? "the week" : "the day") + "!")
    } else {
        let timeDiffString = convertDecimalHoursToTimeFormat(hoursThreshold - hoursSum)

        let dateTime = new Date()

        dateTime.setHours(dateTime.getHours() + parseInt(timeDiffString.split(":")[0]))
        dateTime.setMinutes(dateTime.getMinutes() + parseInt(timeDiffString.split(":")[1]))

        let hours = dateTime.getHours()
        alert("[" + label + "]\n\n" + timeDiffString + " hours missing" +
            (displayFinishingTime ?
                "\n\n· Finishing by " + (hours == 12 ? hours : hours % 12) + ":" +
                ("" + dateTime.getMinutes()).padStart(2, "0") + (hours / 12 < 1.0 ? " am" : " pm") + " ·" : ""))

    }
}

// Listening to keypress events in the entire document
$("html").keydown(function (event) {

    // Running functionality con Ctrl + i or Ctrl + k (case insensitive)
    if (event.altKey === true &&
        (event.code === "KeyI" || event.code === "KeyK" || event.code === "KeyO" || event.code === "KeyM")) {

        // getting date of first day in view
        const firstDayInWeek = $(firstDayElement).first().text()
        // var firstDayInWeek = $(firstDayElement).first().attr("aria-label")
        let yearOfFirstDayInWeek = $(monthsAndYearsOfViewElement).first().text().split(" ")[1]
        if (isNaN(yearOfFirstDayInWeek)) {
            yearOfFirstDayInWeek = $(monthsAndYearsOfViewElement).first().text().split(" ")[3]
        }
        const monthOfFirstDayInWeek = $(monthsAndYearsOfViewElement).first().text().split(" ")[0]
        const dateOfFirstDayInView = new Date(monthOfFirstDayInWeek + " " + firstDayInWeek + ", " + yearOfFirstDayInWeek + " 00:00")

        event.preventDefault()
        event.stopPropagation()

        // Variable to hold query (entered or inferred)
        let requiredDayText
        let nowDateTime = new Date()

        const showFinishingTime = event.code === "KeyO"

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
        let calendarTimeAdder = 0
        let passedHoursAdder = 0

        let events = []

        $(calEventElement).each(function (index) {
            let text = $(this).text()

            if (text === "") { return }

            if (events.includes(text)) { return }

            events.push(text)

            const originalText = text
            text = text.toLowerCase()

            // getting current record calendar day number
            let textDay = getSingleDayStartingDayNumber(text)

            // ignoring "cal.ignore"s and external-calendar-without-details busy times
            if (isTrackableEvent(textDay, requiredDayText, text)) {

                console.log(++index + ") " + originalText)

                const splittedText = text.split(" ")

                let fromTime = splittedText[0]
                // ignoring events with no time span
                if (fromTime[fromTime.length - 1] == ',') {
                    console.log("Ignoring event with no time span.");
                    return;
                }
                let toTime = splittedText[2]

                let singleDateStart = splittedText.length - 3
                let singleDate = splittedText[singleDateStart] + " " + splittedText[singleDateStart + 1] + " " +
                    splittedText[singleDateStart + 2];

                let fromDate = singleDate
                let toDate = singleDate

                // getting time and date for single day events that start and end in different days
                if (/^[A-Za-z]{2,}$/.test(fromTime)) {
                    fromTime = splittedText[4]
                    toTime = splittedText[10]

                    fromDate = splittedText[0] + " " + splittedText[1] + " " +
                        splittedText[2];
                    toDate = splittedText[6] + " " + splittedText[7] + " " +
                        splittedText[8];
                }

                toTime = toTime.substring(0, toTime.length - 1)

                // converting to international time format
                fromTime = standardizeToInternationalTime(fromTime)
                toTime = standardizeToInternationalTime(toTime)

                // getting actual dates
                let startDateTime = new Date(fromDate + " " + fromTime);
                // not including and event that starts before the beginning of the first day in the current view
                if (startDateTime < dateOfFirstDayInView) {
                    return
                }
                let endDateTime = new Date(toDate + " " + toTime);

                let hoursLength = getHoursDiffBetweenTwoDateObjs(startDateTime, endDateTime)
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
            alert("[" + requiredDayText + "]\n\n" +
                convertDecimalHoursToTimeFormat(showFinishingTime ? passedHoursAdder : calendarTimeAdder) +
                " hours " + (showFinishingTime ? "worked" : "recorded"))

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
function getSingleDayStartingDayNumber(text) {
    let toIndex = text.lastIndexOf(",")
    let fromIndex = text.substring(0, toIndex).lastIndexOf(" ") + 1

    let numberSpaceText = text.substring(fromIndex, toIndex)

    if (!isNaN(numberSpaceText)) {
        return numberSpaceText
    } else {
        numberSpaceText = text.split(" ")[1].replace(",", "")
        return (!isNaN(numberSpaceText)) ? numberSpaceText : null
    }
}

function isTrackableEvent(textDay, requiredDayText, text) {
    return (textDay != null && ((textDay == requiredDayText || requiredDayText == "") &&
        !text.match(/\bcal.ignore\b/) && !text.match(/\bc.ig\b/) && !text.includes(", busy, calendar: ") &&
        !text.includes(", declined, ") && !text.includes(", tentative, ")))
}
