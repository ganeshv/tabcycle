# Tab Cycle
This is a simple Chrome extension that allows you to cycle through your open tabs automatically. Useful for a TV display in a common area where you want to cycle through different dashboards.

(The real objective was to give Copilot and ChatGPT a spin)

## Installation
To install the extension, follow these steps:

* Download or clone the repository to your local machine.
* Open Google Chrome and navigate to the Extensions page (chrome://extensions/).
* Enable Developer mode by toggling the switch in the top right corner.
* Click the "Load unpacked" button and select the folder containing the extension files.

## Usage

Once the extension is installed, you can access it by clicking the extension icon in the Chrome toolbar. This will open a popup window with a list of your open tabs.

To start cycling through your tabs, click the "Cycle" button. The extension will cycle through your tabs in the order they appear in the list, waiting for the specified interval between each tab. Every time the popup is opened, cycling stops, and must be restarted by clicking "Cycle".

You can customize the interval for which each tab is kept in focus by clicking the interval input and entering a new value. You can also enable or disable automatic refreshing for each tab by clicking the refresh checkbox. This will cause the tab to be refreshed 2 seconds before it is made active. These preferences are remembered on a per-URL basis and will persist across browser crashes.

To wipe stored preferences and reset to defaults, click the "Reset" button.

## Files
The extension consists of two main files:

### popup.js
This file contains the code for the popup window that appears when you click the extension icon. It creates a list of your open tabs and allows you to start, stop, and reset the tab cycling.

### background.js
This file contains the background script that runs continuously in the background of Chrome. It listens for messages from the popup window and cycles through your tabs when instructed to do so.

## License
This extension is licensed under the MIT License. See the LICENSE file for more information.