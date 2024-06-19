chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("background updated");
    if (
        changeInfo.status === "complete" &&
        tab.url.startsWith("https://www.youtube.com/")
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"],
        });
    }
});
