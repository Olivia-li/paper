chrome.action.onClicked.addListener(function(tab) {
  var url = "chrome://newtab"
  chrome.tabs.create({ url: url });
});