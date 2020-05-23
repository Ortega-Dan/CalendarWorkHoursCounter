// Finding if it is Google Calendar, or Enterprise (Google-Calendar based).
var calendarType = document.getElementsByTagName("html")[0].getAttribute("data-base-title")
// var calendarType = $("html").getAttribute("data-base-title")
var enterpriseCalendar = !calendarType.includes("Google")

// Setting a month conversion helper array
var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

// Single calendar event element container... css description string
var calEventElement = "div.ynRLnc"

/** Function used with enterprise calendar to convert from Meridiam time to Military time */
function convertToMilitaryTime(timeInAmPmFormatString) {

    // Extracting am or pm
    var amOrPm = timeInAmPmFormatString.match("(am|pm)")[0];
    var isPostMeridiem = amOrPm === "pm";

    // Extracting the time
    var justTime = timeInAmPmFormatString.replace(amOrPm, "");

    // Finding if it came with minuts and the hour
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

// Listening to keypress events in the entire document
$("html").keypress(function (event) {

    // Running functionality con Ctrl + i or Ctrl + k (case insensitive)
    if (event.ctrlKey === true && (event.key === "i" | event.key === "I"
        | event.key === "k" | event.key === "K")) {

        // Variable to hold query (entered or inferred)
        var requiredDayText

        // Set the query for the current day
        if (event.key === "i" | event.key === "I") {

            var todaysDate = new Date()

            // Enterprise Calendar format
            if (enterpriseCalendar) {
                requiredDayText = todaysDate.getDate() + " " + months[todaysDate.getMonth()] +
                    " " + todaysDate.getFullYear()
            }
            // Google Calendar format
            else {
                requiredDayText = months[todaysDate.getMonth()] + " " + todaysDate.getDate() +
                    ", " + todaysDate.getFullYear()
            }
        }

        // Prompting for the query when user requested
        if (event.key === "k" | event.key === "K") {
            // Enterprise query should be Day and Month, whereas Google Calendar should be Month and Day
            requiredDayText = prompt("What " + (enterpriseCalendar ? "Day and Month" : "Month and Day") +
                " do you want to check ?\n[From the week on screen and in the format: " +
                (enterpriseCalendar ? "day# Month" : "Month day#") + "]\n\n" +
                "Or leave empty to check the entire week.")
        }

        // Logging the query (entered or inferred)
        console.log("Checking " + (requiredDayText == "" ? "the week displayed" : requiredDayText) + ".")

        // Converting the query to lower case for later case insensitive matching
        requiredDayText = requiredDayText.toLowerCase()

        // Initializing variable to add times
        var calendarTimeAdder = 0

        // Function implementation for Enterprise calendar
        if (!enterpriseCalendar)
            $(calEventElement).each(function (index) {

                var texto = $(this).text()

                if (texto === "") { return }

                originalText = texto
                texto = texto.toLowerCase()

                if (texto.includes(requiredDayText) && !texto.includes("Lunch,") &&
                    !texto.includes("busy,") && !texto.includes("cal.ignore")) {

                    console.log(++index + ") " + originalText)

                    var startDateTime = new Date("01/01/2000 " + texto.substring(0, 5));
                    var endDateTime = new Date("01/01/2000 " + texto.substring(9, 14));


                    var startMinute = (startDateTime.getHours() * 60) + startDateTime.getMinutes()
                    var endMinute = (endDateTime.getHours() * 60) + endDateTime.getMinutes()


                    // console.log(startMinute)
                    // console.log(endMinute)

                    var hoursLength = (endMinute - startMinute) / 60
                    console.log("Hours: " + hoursLength)
                    calendarTimeAdder += hoursLength

                }
            })

        // Function implementation for Google Calendar
        else
            $(calEventElement).each(function (index) {
                var texto = $(this).text()

                if (texto === "") { return }

                originalText = texto
                texto = texto.toLowerCase()

                if (texto.includes(requiredDayText) && !texto.includes("Lunch,") &&
                    !texto.includes("busy,") && !texto.includes("cal.ignore")) {

                    console.log(++index + ") " + originalText)

                    var fromTime = texto.split(" ")[0]
                    var toTime = texto.split(" ")[2]
                    toTime = toTime.substring(0, toTime.length - 1)

                    fromTime = convertToMilitaryTime(fromTime)
                    toTime = convertToMilitaryTime(toTime)

                    var startDateTime = new Date("01/01/2000 " + fromTime);
                    var endDateTime = new Date("01/01/2000 " + toTime);


                    var startMinute = (startDateTime.getHours() * 60) + startDateTime.getMinutes()
                    var endMinute = (endDateTime.getHours() * 60) + endDateTime.getMinutes()


                    // console.log(startMinute)
                    // console.log(endMinute)

                    var hoursLength = (endMinute - startMinute) / 60
                    console.log("Hours: " + hoursLength)
                    calendarTimeAdder += hoursLength

                }
            })

        console.log("Total time: " + calendarTimeAdder + " hours.");

        // Showing results
        if (calendarTimeAdder === 0) {
            alert("No times found for filter [" + requiredDayText + "]")
        } else {
            alert("[" + requiredDayText + "]\n\n" + calendarTimeAdder + " hours worked")

            // Only show missing hours for single day queries (not for entire week)
            if (requiredDayText != "") {

                if ((8 - calendarTimeAdder) < 0) {
                    alert("[" + requiredDayText + "]\n\nYou've worked " +
                        (8 - calendarTimeAdder) * -1 + " extra hours")
                } else {
                    alert("[" + requiredDayText + "]\n\nOnly " + (8 - calendarTimeAdder) + " hours missing")
                }

            }
        }

        console.log("Done ******\n\n\n")
    }

})