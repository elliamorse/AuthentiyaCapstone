V1 
This chrome extension functions as a keystroke data logging tool, capturing user input in real-time. It enables users to save the recorded data for various sessions and export them as json files. It's important to note that all user data remains stored locally within the browser, with no transmission to external servers.

We capture the following data points:

- Type of event (keydown, keyup)
- Key (e.g. "a", "Enter", "Shift")
- Timestamp (in milliseconds)
- Input id (element's id attribute)
- Input name (element's name attribute)