let timeoutId;
let tabSettings = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startCycling") {
    stopCycling(); // Ensure no multiple timeouts
    console.log('startCycling', message.data);

    const { tabOrder, intervals, refreshFlags } = message.data;
    let currentIndex = 0;

    const cycle = () => {
      if (refreshFlags[tabOrder[currentIndex]]) {
        chrome.tabs.reload(tabOrder[currentIndex]);
        timeoutId = setTimeout(() => {
          chrome.tabs.update(tabOrder[currentIndex], { active: true }).catch(console.error);
          timeoutId = setTimeout(cycle, intervals[tabOrder[currentIndex]] + 2000);
          currentIndex = (currentIndex + 1) % tabOrder.length;
        }, 2000);
      } else {
        chrome.tabs.update(tabOrder[currentIndex], { active: true }).catch(console.error);
        timeoutId = setTimeout(cycle, intervals[tabOrder[currentIndex]]);
        currentIndex = (currentIndex + 1) % tabOrder.length;
      }
    };

    timeoutId = setTimeout(cycle, intervals[tabOrder[currentIndex]]);
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