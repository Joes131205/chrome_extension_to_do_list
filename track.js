console.log("track loaded");
function updateTotalWatchTime(watchTime) {
    chrome.storage.local.set({ totalWatchTime: watchTime }, () => {
        console.log("Total watch time updated:", watchTime);
    });
}

let currentVideoStartTimes = null;

document.querySelector("video").addEventListener("play", () => {
    currentVideoStartTimes = Date.now();
    console.log("Video started playing");
});

document.querySelector("video").addEventListener("ended pause seeking", () => {
    if (currentVideoStartTimes) {
        const currentTime = Date.now();
        const watchTime =
            (currentTime - currentVideoStartTimes) / (1000 * 60 * 60); // Convert milliseconds to hours
        totalWatchTime += watchTime;
        updateTotalWatchTime(totalWatchTime);
        currentVideoStartTimes = null;
        console.log("Video watch time:", watchTime, "hours");
    }
});
