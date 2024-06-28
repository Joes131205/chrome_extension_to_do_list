let currentTotalWatchTime = 0;

console.log("background loaded");

chrome.storage.local.get("totalWatchTime", (data) => {
    if (data.totalWatchTime) {
        currentTotalWatchTime = data.totalWatchTime.totalWatchTime;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateTotalWatchTime") {
        console.log("updating total watch time");
        currentTotalWatchTime += request.watchTime;
        console.log(currentTotalWatchTime);

        chrome.storage.local.set({
            totalWatchTime: {
                totalWatchTime: currentTotalWatchTime,
                lastSavedDateStr: new Date().toLocaleDateString(),
            },
        });
    }
});
