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
                let currentVideoStartTimes = null;
                const videoElement = document.querySelector("video");

                if (videoElement) {
                    console.log("tracking...");

                    videoElement.addEventListener("play", () => {
                        currentVideoStartTimes = Date.now();
                        console.log("Video started playing");
                    });

                    videoElement.onpause = () => {
                        console.log("paused");
                        if (currentVideoStartTimes) {
                            const currentTime = Date.now();
                            const watchTime =
                                currentTime - currentVideoStartTimes;

                            const hour = watchTime / (1000 * 60 * 60);
                            const minutes = watchTime / (1000 * 60);
                            const seconds = watchTime / 1000;

                            chrome.runtime.sendMessage({
                                action: "updateTotalWatchTime",
                                watchTime,
                            });
                            currentVideoStartTimes = null;
                        }
                    };
                } else {
                    console.log("Video element not found");
                }
            },
        });
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateTotalWatchTime") {
        console.log("updating total watch time");
        totalWatchTime += message.watchTime;

        chrome.storage.local.set(
            {
                totalWatchTime: {
                    totalWatchTime: totalWatchTime,
                    lastSavedDateStr: new Date().toLocaleDateString(),
                },
            },
            () => {
                console.log("Total watch time updated:", totalWatchTime);
            }
        );
    }
});
