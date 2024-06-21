let currentVideoStartTime;

function updateTotalWatchTime(watchTime) {
    chrome.storage.local.set({ totalWatchTime: watchTime }, () => {
        console.log("Total watch time updated:", watchTime);
    });
}

document.querySelector("video").addEventListener("play", () => {
    currentVideoStartTime = Date.now();
    console.log("Video started playing");
});

document.querySelector("video").addEventListener("ended pause seeking", () => {
    if (currentVideoStartTime) {
        const currentTime = Date.now();
        const watchTime =
            (currentTime - currentVideoStartTime) / (1000 * 60 * 60); // Convert milliseconds to hours
        totalWatchTime += watchTime;
        updateTotalWatchTime(totalWatchTime);
        currentVideoStartTime = null;
        console.log("Video watch time:", watchTime, "hours");
    }
});
