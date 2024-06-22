let totalWatchTime = 0;
console.log("background loaded");

chrome.storage.local.get("totalWatchTime", (data) => {
    if (data.totalWatchTime) {
        totalWatchTime = data.totalWatchTime;
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (
        changeInfo.url &&
        changeInfo.url.startsWith("https://www.youtube.com/watch")
    ) {
        console.log("youtube found");
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                console.log("tracking...");
                let currentVideoStartTimes = null;

                document.querySelector("video").addEventListener("play", () => {
                    currentVideoStartTimes = Date.now();
                    console.log("Video started playing");
                });

                document
                    .querySelector("video")
                    .addEventListener("ended pause seeking", () => {
                        if (currentVideoStartTimes) {
                            const currentTime = Date.now();
                            const watchTime =
                                (currentTime - currentVideoStartTimes) /
                                (1000 * 60 * 60); // Convert milliseconds to hours
                            chrome.runtime.sendMessage({
                                action: "updateTotalWatchTime",
                                watchTime: watchTime,
                            });
                            currentVideoStartTimes = null;
                            console.log(
                                "Video watch time:",
                                watchTime,
                                "hours"
                            );
                        }
                    });
            },
        });
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
