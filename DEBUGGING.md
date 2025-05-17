## Debug to Chrome original information
```jsonc
"url": "https://calendar.google.com/*" //<-- this url must ...
            // ... match exactly the one in the address bar of the browser ...
            // or have a '*' as suffix to match any url with that prefix ...
            // AND ALSO CONFIGURE THE tasks.json TO LAUNCH THE BROWSER WITH THE WANTED URL !!!
            //
            // https://stackoverflow.com/questions/42025962/debug-chrome-extensions-with-visual-studio-code
            // make sure you have deployed your extension in your chrome browser ... source deployed 
            // ... and here in vscode must be the same for debug breakpoints to match and fall in 
            // ... the right place
            // 
            // In sumary ... just open chrome with:
            // google-chrome --remote-debugging-port=9222 https://calendar.google.com/
            //
            // Or you can launch a specific app configured like:
            // google-chrome --remote-debugging-port=9222 "--profile-directory=Profile 1" --app-id=kjbdgfilnfhdoflbpgamdcdgpehopbep
            // before debugging with this option
            // 
            // TO APPLY CHANGES ONLY CLOSE THE BROWSER AND LAUNCH IT AGAIN
```