var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var now = new Date();
console.log("" + now)

var adder = 0

var todaysTextDate = months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear()
console.log(todaysTextDate)


$("body").keypress(function (event) {

    if (event.ctrlKey === true && event.key === "i") {

        $("div.ynRLnc").each(function (index) {


            var texto = $(this).text()

            if (texto.includes(todaysTextDate) && !texto.includes("Lunch")) {
                console.log(index + ") " + texto)

                var startDateTime = new Date("01/01/2000 " + texto.substring(0, 5));
                var endDateTime = new Date("01/01/2000 " + texto.substring(9, 14));


                var startMinute = (startDateTime.getHours() * 60) + startDateTime.getMinutes()
                var endMinute = (endDateTime.getHours() * 60) + endDateTime.getMinutes()


                console.log(startMinute)
                console.log(endMinute)

                hoursLength = (endMinute - startMinute) / 60

                adder += hoursLength

            }
        })

        var message = "" + adder + " hours worked today"

        alert(message)
        if ((8 - adder) < 0) {
            alert("You've worked " + (8 - adder) * -1 + " extra hours")
        } else {
            alert("\nOnly " + (8 - adder) + " hours missing")
        }
        adder = 0

        console.log("Done ******\n\n")
    }


})