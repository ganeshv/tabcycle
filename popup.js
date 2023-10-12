document.addEventListener("DOMContentLoaded", function() {
  // Load tab settings from localStorage  
  chrome.runtime.sendMessage({ action: "stopCycling" });
  console.log("FOMO");
  let tabSettings = JSON.parse(localStorage.getItem("tabSettings")) || {},
    currentTabs = {};
  
  // Fetch all tabs and create UI for each
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    const container = document.getElementById("tabs-container");

    for (let t in tabs) {
      let tab = tabs[t];

      const div = document.createElement("div");

      // Display tab title
      const titleLabel = document.createElement("span");
      titleLabel.textContent = tab.title;
      console.log(tab, tab.title);
      div.appendChild(titleLabel);

      const timeInput = document.createElement("input");
      timeInput.type = "number";
      timeInput.min = "1";
      timeInput.value = "5"; // default 5 seconds
      timeInput.style.marginLeft = "10px";  // Add some spacing for better UI

      const refreshCheckbox = document.createElement("input");
      refreshCheckbox.type = "checkbox";
      refreshCheckbox.style.marginLeft = "10px";  // Add some spacing for better UI

      div.appendChild(timeInput);
      div.appendChild(refreshCheckbox);
      container.appendChild(div);

      if (tabSettings[tab.url]) {
        timeInput.value = tabSettings[tab.url].interval;
        refreshCheckbox.checked = tabSettings[tab.url].refresh;
        currentTabs[tab.id] = {
          interval: tabSettings[tab.url].interval * 1000,
          refresh: tabSettings[tab.url].refresh
        }
      } else {
        currentTabs[tab.id] = {
          interval: 5000,
          refresh: false
        }
        tabSettings[tab.url] = {
          interval: 5,
          refresh: false
        }
        localStorage.setItem("tabSettings", JSON.stringify(tabSettings));
      }

      timeInput.addEventListener("change", () => {
        currentTabs[tab.id].interval = parseInt(timeInput.value) * 1000;
        tabSettings[tab.url].interval = parseInt(timeInput.value);
        localStorage.setItem("tabSettings", JSON.stringify(tabSettings));
      });

      refreshCheckbox.addEventListener("change", () => {
        currentTabs[tab.id].refresh = refreshCheckbox.checked;
        tabSettings[tab.url].refresh = refreshCheckbox.checked;
        localStorage.setItem("tabSettings", JSON.stringify(tabSettings));
      });
    }
  });

  document.getElementById("start").addEventListener("click", function() {
    const tabOrder = Object.keys(currentTabs).map(x => parseInt(x));
    const intervals = {};
    const refreshFlags = {};

    for (let tabId in currentTabs) {
      intervals[tabId] = currentTabs[tabId].interval;
      refreshFlags[tabId] = currentTabs[tabId].refresh;
    }

    chrome.runtime.sendMessage({
      action: "startCycling",
      data: {
        tabOrder,
        intervals,
        refreshFlags
      }
    }).then(() => {
      window.close();
    });

  });

  document.getElementById("stop").addEventListener("click", function() {
    chrome.runtime.sendMessage({ action: "stopCycling" }).then(() => {
      window.close();
    });
  });

  document.getElementById("reset").addEventListener("click", function() {
    localStorage.removeItem("tabSettings");
    chrome.runtime.sendMessage({ action: "stopCycling" }).then(() => {
      window.close();
    });
  });
});

