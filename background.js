
// declare array
const mostRecentTabs = {};

chrome.tabs.query({}, function(tabs) {
  tabs.forEach(tab => {
    if (!mostRecentTabs.hasOwnProperty(tab.windowId)) {
    
      mostRecentTabs[tab.windowId] = [];
      console.log("assigning array", mostRecentTabs)
    }
    console.log(tab.windowId)
  });
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

  // since only one tab should be active and in the current window at once
  // the return variable should only have one entry
  let activeTab = tabs[0];
  let activeTabId = activeTab.id; // or do whatever you need
  let windowId = activeTab.windowId;

  mostRecentTabs[windowId].push(activeTabId);
  console.log("added initial tab", activeTabId);
  console.log(activeTab)
});

// track most recent tabs
chrome.tabs.onActivated.addListener((tab) => {
  // create array/object to store a tab each time it's activate
  console.log(`hello tab: ${tab.tabId}`);

  let currentMostRecentTabs = mostRecentTabs[tab.windowId];

  // remove tab from array if it already exist
  if (currentMostRecentTabs.includes(tab.tabId) === true) {
    const index = currentMostRecentTabs.indexOf(tab.tabId);
    if (index > -1) {
      currentMostRecentTabs.splice(index, 1);
    }
  }

  // push most recent active tab to the end
  currentMostRecentTabs.push(tab.tabId);

  // remove oldest tab from the begining
  // only if length is greater than 5
  if (currentMostRecentTabs.length > 5) {
    currentMostRecentTabs.shift();
  }

  // mostRecentTabs[tab.windowId] = currentMostRecentTabs;

  console.log(tab.windowId, mostRecentTabs[tab.windowId]);
});


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    let currentMostRecentTabs = mostRecentTabs[tabs[0].windowId];
    // filter out mostRecentTabs
    const tabsToClose = tabs.filter((x) => !currentMostRecentTabs.includes(x.id));

    console.log(tabsToClose);

    chrome.tabs.remove(tabsToClose.map((x) => x.id));
  });
});

// For Saturday
// add current tab by defualt (done)
// track the window (done)
