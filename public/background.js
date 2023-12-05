/* eslint-disable no-extend-native */
/*global chrome*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.action === "startBlocking" && Array.isArray(message.websites)) {
    const rules = message.websites.map((url) => ({
      id: url.hashCode(),
      action: { type: "block" },
      condition: { urlFilter: url + "/*" },
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
    });
  } else if (
    message.action === "stopBlocking" &&
    Array.isArray(message.websites)
  ) {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: message.websites.map((url) => url.hashCode()),
    });
  }
});

String.prototype.hashCode = function () {
  let hash = 0,
    i,
    chr;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash &= hash; // Ensure hash is a 32-bit positive integer
  }
  return Math.abs(hash);
};
