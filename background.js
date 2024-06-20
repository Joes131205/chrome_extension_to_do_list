let currentVideoStartTime;
let totalWatchTime = 0;
console.log("background loaded");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("background updated");
    if (
        changeInfo.status === "complete" &&
        tab.url.indexOf("youtube.com/watch?v=") !== -1
    ) {
        currentVideoStartTime = Date.now();
    } else if (
        changeInfo.status === "complete" ||
        changeInfo.status === "paused"
    ) {
        if (currentVideoStartTime) {
            const videoWatchTime = Date.now() - currentVideoStartTime;
            totalWatchTime += videoWatchTime;
            currentVideoStartTime = undefined;
            chrome.storage.local.set({ totalWatchTime });
            console.log(totalWatchTime);
        }
    }
});

chrome.storage.local.get("totalWatchTime", (data) => {
    if (data.totalWatchTime) {
        totalWatchTime = data.totalWatchTime;
    }
});
