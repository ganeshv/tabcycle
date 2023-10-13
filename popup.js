document.addEventListener("DOMContentLoaded", function() {
  // Load tab settings from localStorage  
  chrome.runtime.sendMessage({ action: "stopCycling" });
  console.log("FOMO");
  let tabSettings = JSON.parse(localStorage.getItem("tabSettings")) || {},
    currentTabs = [];
  
  // Fetch all tabs and create UI for each
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    const container = document.getElementById("tabs-container");

    tabs = tabs.sort((a, b) => a.index - b.index);

    tabs.forEach(tab => {
   
      if (tabSettings[tab.url]) {
        currentTabs.push({
          interval: tabSettings[tab.url].interval,
          refresh: tabSettings[tab.url].refresh,
          tabId: tab.id,
          title: tab.title,
          url: tab.url
        });
      } else {
        currentTabs.push({
          interval: 5,
          refresh: false,
          tabId: tab.id,
          title: tab.title,
          url: tab.url
        });
        tabSettings[tab.url] = {
          interval: 5,
          refresh: false
        };
        localStorage.setItem("tabSettings", JSON.stringify(tabSettings));
      }
    });
    renderTabEntries(currentTabs);
  });

  document.getElementById("start").addEventListener("click", function() {
    chrome.runtime.sendMessage({
      action: "startCycling",
      data: currentTabs
    }).then(() => {
      window.close();
    });

  });
/*
  document.getElementById("stop").addEventListener("click", function() {
    chrome.runtime.sendMessage({ action: "stopCycling" }).then(() => {
      window.close();
    });
  });
*/
  document.getElementById("reset").addEventListener("click", function() {
    localStorage.removeItem("tabSettings");
    chrome.runtime.sendMessage({ action: "stopCycling" }).then(() => {
      window.close();
    });
  });

  const createTabEntry = (tab) => {
    const tr = document.createElement("tr");
    const titleTd = document.createElement("td");
    const refreshTd = document.createElement("td");
    const intervalTd = document.createElement("td");
    refreshTd.classList.add("refresh");
    intervalTd.classList.add("interval");
    titleTd.classList.add("title");
  
    const title = document.createTextNode(tab.title);
    const refreshLabel = document.createElement("label");
    const refreshCheckbox = document.createElement("input");
    refreshCheckbox.type = "checkbox";
    refreshCheckbox.checked = tab.refresh;
    refreshCheckbox.addEventListener("change", () => {
      tab.refresh = refreshCheckbox.checked;
      tabSettings[tab.url].refresh = refreshCheckbox.checked;
      localStorage.setItem("tabSettings", JSON.stringify(tabSettings));
    });
    const refreshLabelText = document.createTextNode("Refresh");
    refreshLabel.appendChild(refreshCheckbox);
    //refreshLabel.appendChild(refreshLabelText);
  
    const intervalInput = document.createElement("input");
    intervalInput.type = "number";
    intervalInput.min = 1;
    intervalInput.max = 9999;
    intervalInput.value = tab.interval;
    intervalInput.addEventListener("change", () => {
      tab.interval = parseInt(intervalInput.value);
      tabSettings[tab.url].interval = tab.interval;
      localStorage.setItem("tabSettings", JSON.stringify(tabSettings));
    });
  
    titleTd.appendChild(title);
    intervalTd.appendChild(intervalInput);
    refreshTd.appendChild(refreshLabel);
  
    tr.appendChild(titleTd);
    tr.appendChild(intervalTd);
    tr.appendChild(refreshTd);
  
    return tr;
  };
  
  const renderTabEntries = (tabs) => {
    const tabsContainer = document.getElementById("tabs-container");
    tabsContainer.innerHTML = "";
  
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    const th3 = document.createElement("th");
    th3.classList.add("refresh");
    th2.classList.add("interval");
    th1.classList.add("title");
  
    const titleText = document.createTextNode("Title");
    const refreshText = document.createTextNode("Refresh");
    const intervalText = document.createTextNode("Interval (s)");
  
    th1.appendChild(titleText);
    th2.appendChild(intervalText);
    th3.appendChild(refreshText);
  
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
  
    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
  
    tabsContainer.appendChild(table);
  
    for (const tab of tabs) {
      const tabEntry = createTabEntry(tab);
      tbody.appendChild(tabEntry);
    }
  };
});

