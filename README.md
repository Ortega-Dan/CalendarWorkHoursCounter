# CalendarWorkHoursCounter              
### For Google Calendar, with **English (US)** language setting, in Week view, for events of less than 24 hours long
![logo](https://i.imgur.com/rvu0leX.png)


Just hit Alt + i\
and the extension will let you know how many hours you've actually worked up to your current time.\
(how many hours you have in your google calendar for the current day up to your current time)\
and how you are in comparison with an 8-hours-a-day work schedule. It will also show your estimated time to finish.

If you want to know a different day hit Alt + k\
and enter the day you want to check according to the instructions in the prompt presented\
or leave empty to calculate the entire visible week. This also computes time only up to your current time.

To calculate on the entire range of time queried without considering your current time (let's say you want to count how many hours are "recorded" on a given future day or week, or possibly the current day or week but count events that have not yet started or passed), you can add the Shift key to the previous commands.

To summarize:
- `Alt + i` counts the current day events that have already started or passed.
- but `Alt + Shift + i` counts all events in the current day, including those happening later.
- `Alt + k` counts the visible week or wanted day events that have already started or passed.
- but `Alt + Shift + k` counts all the events in the visible week or wanted day.


This program works in Week view of the calendar\
(switch to week view by hitting "w" key [that is google-calendar's native functionality])

It also helps automating insertion of activity prefixes using the extension's popup window.

![pref](popupimg.png)

<p>Icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">Freepik</a> from <a target="_blank" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a><br>https://www.flaticon.com/free-icon/calendar_833634</p>




Thanks to [@Jolmoz](https://github.com/jolmoz) for testing and bug reports, and [@danielrinconr](https://github.com/danielrinconr) for bug and typo fixes.


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
Here the contents of the launch.json to debug from chrome on vscode:

```jsonc
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
```
______________________________________________________

## Handy numbers about work time
Based on a review of the year 2020. Which is a leap year.\
The following **averages** result.

In a Monday-Friday 8-hours-a-day schedule, a **work month** has:\
4.366666 weeks.\
21.833333 work days.\
174.666666 work hours.
