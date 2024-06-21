let currentVideoStartTimeef;
let totalWatchTime = 0;
console.log("background loaded");

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (
        changeInfo.url &&
        changeInfo.url.startsWith("https://www.youtube.com/watch")
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            file: "./track.js",
        });
    }
});

chrome.storage.local.get("totalWatchTime", (data) => {
    if (data.totalWatchTime) {
        totalWatchTime = data.totalWatchTime;
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateTotalWatchTime") {
        totalWatchTime += message.watchTime;
        chrome.storage.local.set({ totalWatchTime: totalWatchTime }, () => {
            console.log("Total watch time updated:", totalWatchTime);
        });
    }
});
