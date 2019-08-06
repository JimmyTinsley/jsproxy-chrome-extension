/*
____ ____ _  _ ___ ____ _  _ ___    _  _ ____ _  _ _  _    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
|    |  | |\ |  |  |___  \/   |     |\/| |___ |\ | |  |    |___ |  | |\ | |     |  | |  | |\ | [__
|___ |__| | \|  |  |___ _/\_  |     |  | |___ | \| |__|    |    |__| | \| |___  |  | |__| | \| ___]

*/
/*
Create the context menu items.
*/
chrome.contextMenus.create({
  id: "open-with-proxy",
  title: chrome.i18n.getMessage("menuItemOpenWithProxy"),
  contexts: ["link"]
}, onContextMenuItemCreated);

chrome.contextMenus.create({
  id: "search-with-proxy",
  title: chrome.i18n.getMessage("menuItemSearchWithProxy"),
  contexts: ["selection"]
}, onContextMenuItemCreated);

chrome.contextMenus.create({
  id: "open-image-with-proxy",
  title: chrome.i18n.getMessage("menuItemOpenImageWithProxy"),
  contexts: ["image"]
}, onContextMenuItemCreated);

/*
The click event listener for menus. 
*/
chrome.contextMenus.onClicked.addListener(function(info) {
  chrome.storage.sync.get(['jsproxy_sandbox_url'], function(item){ 
    contextMenuClickHandler(info, item.jsproxy_sandbox_url);
  });
});

/*
Click handler, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
function contextMenuClickHandler(info, jsproxy_prefix) {
  var postfix;
  switch (info.menuItemId) {
    case "open-with-proxy":
      postfix = info.linkUrl;
      break;
    case "search-with-proxy":
      postfix = info.selectionText
      break;
    case "open-image-with-proxy":
      postfix = info.srcUrl
  }
  chrome.tabs.create({
     url: jsproxy_prefix + "-----" + postfix
  }, function(tab){ onTabCreated(tab);});
}


/*
___  ____ ____ ____    ____ ____ ___ _ ____ _  _    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
|__] |__| | __ |___    |__| |     |  | |  | |\ |    |___ |  | |\ | |     |  | |  | |\ | [__
|    |  | |__] |___    |  | |___  |  | |__| | \|    |    |__| | \| |___  |  | |__| | \| ___]

*/

/*
Each time a tab is updated, reset the page action for that tab.
*/
chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

function protocolIsApplicable(url) {
  var anchor =  document.createElement('a');
  anchor.href = url;
  return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (protocolIsApplicable(tab.url)) {
    chrome.pageAction.setIcon({tabId: tab.id, path: "icons/page-16.png"});
    chrome.pageAction.setTitle({tabId: tab.id, title: chrome.i18n.getMessage("pageAction")});
    chrome.pageAction.show(tab.id);
  }
}

/*
Page action click event listener.
*/
chrome.pageAction.onClicked.addListener(async function(tab) {
  chrome.storage.sync.get(['jsproxy_sandbox_url'], function(item){ 
    pageActionClickHandler(tab, item.jsproxy_sandbox_url);
  });
});

/*
Handle the page action click and reopen current tab page.
*/
function pageActionClickHandler(tab, jsproxy_prefix) {
  if (tab.url.slice(0, jsproxy_prefix.length) == jsproxy_prefix) {
    chrome.tabs.update({url: tab.url.substring(jsproxy_prefix.length+5, tab.url.length)}, function(tab){onTabUpdated(tab);});
  } else {
    chrome.tabs.update({url: jsproxy_prefix + "-----" + tab.url}, function(tab){onTabUpdated(tab);});
  }
}

/*
___  ____ ___  _  _ ____ ____ _ _  _ ____    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
|  \ |___ |__] |  | | __ | __ | |\ | | __    |___ |  | |\ | |     |  | |  | |\ | [__
|__/ |___ |__] |__| |__] |__] | | \| |__]    |    |__| | \| |___  |  | |__| | \| ___]

*/
/*
Called when the tab page has been updated.
*/
function onTabUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

/*
Called when a new tab page has been created.
*/
function onTabCreated(tab) {
  console.log(`Created tab: ${tab.id}`);
}

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onContextMenuItemCreated() {
  if (chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
  } else {
    console.log("Context menu item created successfully");
  }
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}