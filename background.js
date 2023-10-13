let timeoutId;
let tabSettings = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startCycling") {
    stopCycling(); // Ensure no multiple timeouts
    console.log('startCycling', message.data);

    const tabs = message.data;
    let currentIndex = 0;

    const cycle = () => {
      currentIndex = (currentIndex + 1) % tabs.length;
      chrome.tabs.get(tabs[currentIndex].tabId).then(t => {
        if (tabs[currentIndex].refresh) {
          chrome.tabs.reload(tabs[currentIndex].tabId);
          timeoutId = setTimeout(() => {
            chrome.tabs.update(tabs[currentIndex].tabId, { active: true });
            timeoutId = setTimeout(cycle, tabs[currentIndex].interval * 1000 + 2000);
          }, 2000);
        } else {
          chrome.tabs.update(tabs[currentIndex].tabId, { active: true });
          timeoutId = setTimeout(cycle, tabs[currentIndex].interval * 1000);
        }
      }).catch(e => {
        console.log(e);
        timeoutId = setTimeout(cycle, 1000);
      });
    };
    timeoutId = setTimeout(cycle, tabs[currentIndex].interval);
  } else if (message.action === "stopCycling") {
    console.log("received stopCycling");
    stopCycling();
  }
});

function stopCycling() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}