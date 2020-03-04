var calendarTimeAdder = 0

$("body").keypress(function (event) {

    if (event.ctrlKey === true && (event.key === "i" | event.key === "I" | event.key === "k" | event.key === "K")) {

        var requiredDayText

        if (event.key === "i" | event.key === "I") {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var todaysDate = new Date();
            console.log("" + todaysDate)
            requiredDayText = months[todaysDate.getMonth()] + " " + todaysDate.getDate() + ", " + todaysDate.getFullYear()
        }

        if (event.key === "k" | event.key === "K") {
            requiredDayText = prompt("What Month and Day do you want to check ?\n[From the week on screen and in the format Month day#]")
        }

        console.log(requiredDayText)


        $("div.ynRLnc").each(function (index) {


            var texto = $(this).text()

            if (texto.includes(requiredDayText) && !texto.includes("Lunch")) {
                console.log(index + ") " + texto)

                var startDateTime = new Date("01/01/2000 " + texto.substring(0, 5));
                var endDateTime = new Date("01/01/2000 " + texto.substring(9, 14));


                var startMinute = (startDateTime.getHours() * 60) + startDateTime.getMinutes()
                var endMinute = (endDateTime.getHours() * 60) + endDateTime.getMinutes()


                console.log(startMinute)
                console.log(endMinute)

                hoursLength = (endMinute - startMinute) / 60

                calendarTimeAdder += hoursLength

            }
        })

        alert("[" + requiredDayText + "]\n\n" + calendarTimeAdder + " hours worked")

        if ((8 - calendarTimeAdder) < 0) {
            alert("[" + requiredDayText + "]\n\nYou've worked " + (8 - calendarTimeAdder) * -1 + " extra hours")
        } else {
            alert("[" + requiredDayText + "]\n\nOnly " + (8 - calendarTimeAdder) + " hours missing")
        }
        calendarTimeAdder = 0

        console.log("Done ******\n\n")
    }

})