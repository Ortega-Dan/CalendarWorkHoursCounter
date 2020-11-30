# CalendarWorkHoursCounter              
### For Google Calendar, with **English (US)** language setting, for events of less than 24 hours long
![logo](https://i.imgur.com/rvu0leX.png)


Just hit Ctrl + i\
and the extension will let you know how many hours you've worked\
(how many hours you have in your google calendar for the current day)\
and how you are in comparison with an 8-hours-a-day work schedule


If you want to know a different day hit Ctrl + Shift + k\
and enter the day you want to check according to the instructions in the prompt presented\
or leave empty to calculate the entire visible week.


This program works in Week view of the calendar\
(switch to week view by hitting "w" key [that is google-calendar's native functionality])

<p>Icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">Freepik</a> from <a target="_blank" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a><br>https://www.flaticon.com/free-icon/calendar_833634</p>




Thanks to [@Jolmoz](https://github.com/jolmoz) for testing and bug reports.


______________________________________________________
## Chrome/Chromium Deployment
Download and unzip\
Then...

Navigate to chrome://extensions/\
![ext](https://i.imgur.com/SvH24jl.png)


Enable developer mode\
![dev](https://i.imgur.com/INuY53o.png)


Click on Load Unpacked\
![load](https://i.imgur.com/LQxZXyJ.png)


Add the src folder of this project\
![test](https://i.imgur.com/G53upoE.png)

______________________________________________________
#### Debugging
\
Here the contents of the launch.json to debug from chrome on vscode (read better from raw README.md file):
\
\
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Method Testing",
            "program": "${workspaceFolder}/testing.js",
            "skipFiles": [
                "<node_internals>/**"
            ]
        },
        {
            "type": "chrome",
            "request": "attach",
            "name": "Attach to Chrome",
            "port": 9222,
            "webRoot": "${workspaceFolder}/src",
            "url": "https://calendar.google.com/calendar/r" //<-- this url must ...
            // ... match exactly the one in the address bar of the browser
            //
            // https://stackoverflow.com/questions/42025962/debug-chrome-extensions-with-visual-studio-code
            // make sure you have deployed your extension in your chrome browser ... source deployed 
            // ... and here in vscode must be the same for debug breakpoints to match and fall in 
            // ... the right place
            // 
            // In sumary ... just open chrome with:
            // google-chrome --remote-debugging-port=9222 https://calendar.google.com/
            // before debugging with this option
        }
    ]
}

______________________________________________________

## Interesting Info
Based on an analysis of the year 2020. Which is a leap year.

We've got the following **averages** for general usage.

In a Monday-Friday 8-hours-a-day schedule:\
A working month is 4.366666 working weeks.\
A working month is 21.833333 working days.\
A working month is 174.666666 working hours.
