let currentTotalWatchTime = 0;

console.log("background loaded");

chrome.storage.local.get("totalWatchTime", (data) => {
    if (data.totalWatchTime) {
        currentTotalWatchTime = data.totalWatchTime;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateTotalWatchTime") {
        currentTotalWatchTime += request.watchTime;

        chrome.storage.local.set({
            totalWatchTime: currentTotalWatchTime,
        });
    }
});
