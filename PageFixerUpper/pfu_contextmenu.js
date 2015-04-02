/**
 * @fileoverview Background script containing code to create a context menu,
 * as the content script does not have access to the chrome.contextMenus API.
 * @author matt@houglumdev.com (Matt Houglum)
 */
 
var contextEntryId = 'toggleEnabled';
// IMPORTANT: These should be kept in sync with "content_scripts" -> "matches"
// in the manifest.
var matches = [
  '*://dayzdb.com/*'
];

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
      'title': 'Toggle Page Fixer Upper for this site',
      'id': contextEntryId,
      'documentUrlPatterns': matches,
      'contexts': ['all']
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == contextEntryId ) {
    // This gets the second-level domain (regex found via StackOverflow).
    var siteName = tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1].split('.').slice(-2).join('.');
    // If siteName is not found, it's never been disabled, so use true as the
    // default value.
    var enabledDict = {};
    enabledDict[siteName] = true;
    chrome.storage.sync.get(enabledDict, function(enabledStatus) {
      enabledDict[siteName] = !enabledStatus[siteName];
      chrome.storage.sync.set(enabledDict, function() {});
    });
  }
});