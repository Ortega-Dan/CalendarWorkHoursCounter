// HTML needed constants:
const DATA_HOLDING_CAL_EVENT_ELEMENT = "div.XuJrye"
// Has each event's time, date, and text. 
// It is usually a div on top of the element tree that has the event text only.
// It can be in two formats:
// - January 4, 2024 at 10pm to January 5, 2024 at 1:15am, The event text, Time Tracking, No location, 
// - 7pm to 10:15pm, The event text, Time Tracking, No location, January 4, 2024
// Used to calculate time spent in events. Both formats are supported.

const FIRST_DAY_ELEMENT = "div.nSCxEf"
// Contains just the number for the calendar day of the very first day in the view (usually Sunday).
// Used to avoid calendar events that started before the current week view.

const MONTHS_AND_YEARS_OF_VIEW_ELEMENT = "div.UyW9db"
// Contains the month and year of the week view.
// Could be one of the following 3 formats: "February 2024" or "Jan – Feb 2024" or "Dec 2023 – Jan 2024"
// Also used to avoid calendar events that started before the current week view.

const CURRENT_TIME_INDICATOR_ELEMENT = "div.LvQ60d"
// and indicator of the current time that only shows when looking at the present day, either in day or custom days, or week view.
// It is used to know we are looking at the present and determine if we want to calculate so-far reports.


// Week and daily hours margins to compare against
const WEEKLY_HOURS_BASE = 40
const DAILY_HOURS_MARGIN = 8

const ACTION_KEY_TO_ENTRY = {
    "KeyJ": "first",
    "KeyL": "second",
    "KeyU": "third",
    "KeyH": "fourth",
    "KeyN": "fifth",
    "KeyM": "sixth",
};
const ACTION_KEYS_LIST = Object.keys(ACTION_KEY_TO_ENTRY);

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

function showHoursDiffTo(hoursSum, hoursThreshold, label, isRealHoursReport, displayFinishingTime) {

    if ((hoursThreshold - hoursSum) < 0) {
        alert("[" + label + "]\n\n" + (isRealHoursReport ? "You've worked " : "You have ") +
            convertDecimalHoursToTimeFormat((hoursThreshold - hoursSum) * -1) + " extra hours")
    } else if ((hoursThreshold - hoursSum) == 0) {
        alert("[" + label + "]\n\nYou're done for " + (label.toLowerCase().includes("week") ? "the week" : "the day") + ((label.toLowerCase().includes("so far") && !label.toLowerCase().includes("week")) ? " so far" : "") + "!")
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

function hoursCountingFlow(event) {
    let weeklyHoursMargin = WEEKLY_HOURS_BASE

    // getting date of first day in view
    const firstDayInWeek = $(FIRST_DAY_ELEMENT).first().text()
    // var firstDayInWeek = $(firstDayElement).first().attr("aria-label")
    let yearOfFirstDayInWeek = $(MONTHS_AND_YEARS_OF_VIEW_ELEMENT).first().text().split(" ")[1]
    if (isNaN(yearOfFirstDayInWeek)) {
        yearOfFirstDayInWeek = $(MONTHS_AND_YEARS_OF_VIEW_ELEMENT).first().text().split(" ")[3]
    }
    const monthOfFirstDayInWeek = $(MONTHS_AND_YEARS_OF_VIEW_ELEMENT).first().text().split(" ")[0]
    const dateOfFirstDayInView = new Date(monthOfFirstDayInWeek + " " + firstDayInWeek + ", " + yearOfFirstDayInWeek + " 00:00")

    console.log("First day in week view: '" + dateOfFirstDayInView + "'")

    event.preventDefault()
    event.stopPropagation()

    // Variable to hold query (entered or inferred)
    let requiredDayText
    const nowDateTime = new Date()
    const currentDayNumber = nowDateTime.getDay()


    // Set the query for the current day
    let isCurrentDayReport = false
    if (event.code === "KeyI") {

        // Google Calendar format
        requiredDayText = "" + nowDateTime.getDate()
        isCurrentDayReport = true
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

    $(DATA_HOLDING_CAL_EVENT_ELEMENT).each(function (index) {
        let text = $(this).text()

        if (text === "") { return }

        if (events.includes(text)) { return }

        events.push(text)

        const originalText = text
        text = text.toLowerCase()

        // getting current record calendar day number
        let textDay = getSingleDayStartingDayNumber(text)

        // ignoring "cal.ignore"s and external-calendars
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

    // default partial week report for current week view
    const isCurrentWeekView = ($(CURRENT_TIME_INDICATOR_ELEMENT).length > 0)
    let isPartialWeekReport = isCurrentWeekView

    // check if modifier keys are pressed
    let isRealHoursReport = !event.shiftKey

    if (requiredDayText == "") {
        requiredDayText = "Entire Week"
        isPartialWeekReport = isPartialWeekReport && !event.ctrlKey && isRealHoursReport
        if (isPartialWeekReport) {
            weeklyHoursMargin = getWantedHoursSoFar(currentDayNumber)
        }
    }

    // Showing results
    // if (calendarTimeAdder === 0) {
    //     alert("No active events found for filter [" + requiredDayText + "]")
    //     // alert("No events owned, confirmed, or pending confirmation found for filter [" + requiredDayText + "]")
    // }

    // Showing results
    alert("[" + requiredDayText + (isPartialWeekReport && requiredDayText == "Entire Week" ? " So Far" : "") + "]\n\n" +
        convertDecimalHoursToTimeFormat(isRealHoursReport ? passedHoursAdder : calendarTimeAdder) +
        " hours " + (isRealHoursReport ? "worked" : "recorded"))

    if (requiredDayText == "Entire Week") {
        // show hours diff for week query
        showHoursDiffTo(isRealHoursReport ? passedHoursAdder : calendarTimeAdder, weeklyHoursMargin, requiredDayText + (isPartialWeekReport ? " So Far" : "")
            , isRealHoursReport, isPartialWeekReport)
    } else {
        // Show hours diff for single day query
        if (isRealHoursReport) {
            showHoursDiffTo(passedHoursAdder, DAILY_HOURS_MARGIN, requiredDayText, isRealHoursReport, (isRealHoursReport && isCurrentDayReport))
        } else {
            showHoursDiffTo(calendarTimeAdder, DAILY_HOURS_MARGIN, requiredDayText, isRealHoursReport, false)
        }
    }

    console.log("Done ******\n\n\n")
}

function getWantedHoursSoFar(currentDayNumber) {
    return currentDayNumber > 4 ? WEEKLY_HOURS_BASE : DAILY_HOURS_MARGIN * currentDayNumber
}

function prefixInsertionFlow(event) {
    if (event.altKey === true && ACTION_KEYS_LIST.includes(event.code)) {

        const entry = ACTION_KEY_TO_ENTRY[event.code]

        chrome.storage.sync.get([entry], function (result) {
            document.activeElement.value = result[entry]
        });

    }
}

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
    // ", calendar: " is the identifier for external calendar events
    return (textDay != null && ((textDay == requiredDayText || requiredDayText == "") &&
        !text.match(/\bcal.ignore\b/) && !text.match(/\bc.ig\b/) && !text.includes(", calendar: ") &&
        !text.includes(", declined, ") && !text.includes(", tentative, ")))
}

// Listening to keypress events in the entire document
$("html").keydown(function (event) {
    if (event.altKey === false) { return }

    // Running functionality with Ctrl + i or Ctrl + k (case insensitive)
    if (event.altKey === true &&
        (event.code === "KeyI" || event.code === "KeyK")) {
        hoursCountingFlow(event)
    } else {
        prefixInsertionFlow(event)
    }
})