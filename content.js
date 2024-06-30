console.log("content");

// Create elements
const appDiv = createDiv("app-div");
const toDoListDiv = createDiv("to-do-list-div");
const toDoList = createDiv("to-do-list");
const pointsDiv = createDiv("points-div");
const shopDiv = createDiv("shop-div");
const watchTimeDiv = createDiv("watchTime-div");

// Initialize variables
let list = [];
let points = 0;
let watchTime = 0;

class ShopItem {
    constructor({ category, title, cost }) {
        this.category = category;
        this.title = title;
        this.cost = cost;
    }
}

class ListItem {
    constructor(id, task, type, completed = false) {
        this.id = id;
        this.task = task;
        this.type = type;
        this.completed = completed;
    }
}

class ListItemRepeat extends ListItem {
    constructor(id, task, type, completions = 0) {
        super(id, task, type);
        this.completions = completions;
    }
}

let related;

// Function to create a div with a class name
function createDiv(className) {
    const div = document.createElement("div");
    div.classList.add(className);
    return div;
}

// Function to check if DOM is ready
function afterDOMLoaded() {
    if (document.readyState === "complete" && !chrome.runtime.lastError) {
        console.log("loaded");
        related = document.getElementById("related");
        const secondaryInner = document.getElementById("secondary-inner");

        if (related && secondaryInner) {
            related.style.display = "none";
            init(secondaryInner);
        } else {
            setTimeout(afterDOMLoaded, 100);
        }
    }
}

// Initialize application
async function init(secondaryInner) {
    appDiv.innerHTML = "";
    try {
        await loadData();
        await renderElements();
        secondaryInner.insertAdjacentElement("beforebegin", appDiv);
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

async function renderElements() {
    await renderWatchTime();
    await renderToDoList();
    await renderPoints();
    await renderShop();
}

// Add task to list
function addList(task, type) {
    const id = Date.now();
    const newTask =
        type === "once"
            ? new ListItem(id, task, type)
            : new ListItemRepeat(id, task, type);
    list.push(newTask);
    saveData();
    renderTask();
}

// Delete task from list
function deleteTask(index) {
    list.splice(index, 1);
    saveData();
    renderTask();
}

// Complete task and increment points
function completeOnceTask(index) {
    list[index].completed = true;
    points++;
    saveData();
    renderPoints();
    renderTask();
}

function completeIncrementTask(index) {
    list[index].completions++;
    points++;
    saveData();
    renderPoints();
    renderTask();
}

// Render task list
function renderTask() {
    toDoList.innerHTML = "";
    const ul = document.createElement("ul");

    list.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");
        if (task.type === "once") {
            li.classList.toggle("completed", task.completed);
            li.textContent = task.task;

            const deleteButton = createButton("DEL", () => deleteTask(index));
            const completeButton = createButton("DONE", () =>
                completeOnceTask(index)
            );

            li.append(deleteButton, completeButton);
        } else {
            li.textContent = task.task;
            const deleteButton = createButton("DEL", () => deleteTask(index));
            const completeButton = createButton("ADD", () =>
                completeIncrementTask(index)
            );

            const completedText = document.createElement("p");
            completedText.textContent = `Completed: ${task.completions}`;
            li.append(deleteButton, completeButton, completedText);
        }
        ul.appendChild(li);
    });

    toDoList.appendChild(ul);
}

// Create button with text and click handler
function createButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
}

// Render to-do list
function renderToDoList() {
    toDoListDiv.innerHTML = "";

    const toDoListHeading = document.createElement("h2");
    toDoListHeading.textContent = "To Do List";
    toDoListDiv.appendChild(toDoListHeading);

    const form = document.createElement("form");
    const taskInput = document.createElement("input");
    taskInput.setAttribute("type", "text");
    taskInput.placeholder = "Add new task";

    const typeSelect = document.createElement("select");
    const onceOption = createOption("once", "Do once");
    const repeatOption = createOption("repeat", "Repeating / Incremental");
    typeSelect.append(onceOption, repeatOption);

    const addButton = createButton("Add", (e) => {
        e.preventDefault();
        if (taskInput.value) {
            addList(taskInput.value, typeSelect.value);
            taskInput.value = "";
        } else {
            alert("Please enter a task");
        }
    });

    form.append(taskInput, typeSelect, addButton);
    toDoListDiv.appendChild(form);

    renderTask();
    toDoListDiv.appendChild(toDoList);
    appDiv.appendChild(toDoListDiv);
}

// Create option element
function createOption(value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    return option;
}

// Render points
function renderPoints() {
    pointsDiv.innerHTML = "";
    const pointsEl = document.createElement("p");
    pointsEl.textContent = `Points: ${points}`;
    pointsDiv.appendChild(pointsEl);
    appDiv.appendChild(pointsDiv);
}

// Render Shop
function renderShop() {
    shopDiv.innerHTML = "";
    const shopHeading = document.createElement("h2");
    shopHeading.textContent = "Shop";
    shopDiv.appendChild(shopHeading);

    const rewards = [
        new ShopItem({
            category: "gaming",
            title: "Gaming Session (20 minutes)",
            cost: 15,
        }),
        new ShopItem({
            category: "youtube",
            title: "Watch YouTube Video (10 minutes)",
            cost: 7,
        }),
    ];

    const shopList = document.createElement("ul");

    rewards.forEach((reward) => {
        const rewardLi = document.createElement("li");
        rewardLi.classList.add("shop_item");

        const rewardTitle = document.createElement("p");
        rewardTitle.textContent = `${reward.title} - ${reward.cost} Points`;
        rewardLi.appendChild(rewardTitle);

        const rewardButton = createButton("BUY", () => {
            if (points >= reward.cost) {
                points -= reward.cost;
                renderPoints();
                if (reward.title.includes("Watch YouTube Video")) {
                    related.style.display = "block";
                }
            } else {
                alert("Not enough points");
            }
        });

        rewardLi.appendChild(rewardButton);
        shopList.appendChild(rewardLi);
    });

    shopDiv.appendChild(shopList);
    appDiv.appendChild(shopDiv);
}

// Check if DOM is ready
if (document.readyState !== "complete") {
    window.addEventListener("load", afterDOMLoaded);
} else {
    afterDOMLoaded();
}

// Render watch time
function renderWatchTime() {
    const hours = Math.floor(watchTime / (1000 * 60 * 60));
    const minutes = Math.floor((watchTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((watchTime % (1000 * 60)) / 1000);
    watchTimeDiv.textContent = `Your watch time: ${hours}h, ${minutes}m, ${seconds}s`;
    appDiv.appendChild(watchTimeDiv);
}

// Save data to Chrome storage
function saveData() {
    chrome.storage.local.set({ list, points, watchTime }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error saving data:", chrome.runtime.lastError);
        } else {
            console.log("Data saved to local storage");
        }
    });
}
// Load data from Chrome storage
async function loadData() {
    return new Promise((resolve, reject) => {
        console.log("loading data...");
        chrome.storage.local.get(
            ["list", "points", "watchTime", "lastSavedDateStr"],
            (result) => {
                if (chrome.runtime.lastError) {
                    console.error(
                        "Error loading data:",
                        chrome.runtime.lastError
                    );
                    return reject(chrome.runtime.lastError);
                }

                list = result.list || [];
                points = result.points || 0;
                watchTime = result.watchTime || 0;

                const lastSavedDate = result.lastSavedDateStr
                    ? new Date(result.lastSavedDateStr)
                    : null;
                const currentDate = new Date();

                if (
                    lastSavedDate &&
                    currentDate.getDate() !== lastSavedDate.getDate()
                ) {
                    list.forEach((task) => {
                        if (task.type === "repeat") {
                            task.completions = 0;
                        } else {
                            task.completed = false;
                        }
                    });
                    points = 0;
                    watchTime = 0;
                }

                chrome.storage.local.set(
                    { lastSavedDateStr: currentDate.toISOString() },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error(
                                "Error saving date:",
                                chrome.runtime.lastError
                            );
                            return reject(chrome.runtime.lastError);
                        }
                        console.log("Date saved to local storage");
                        resolve();
                    }
                );
            }
        );
    });
}

// Track video watch time
function trackVideo() {
    const videoElement = document.querySelector("video");

    if (videoElement) {
        let currentVideoStartTimes;

        videoElement.addEventListener("play", () => {
            currentVideoStartTimes = Date.now();
            console.log("Video started playing");
        });
        videoElement.addEventListener("pause", () => {
            if (currentVideoStartTimes) {
                const currentTime = Date.now();
                const watchDuration = currentTime - currentVideoStartTimes;
                watchTime += watchDuration;

                chrome.runtime.sendMessage({
                    action: "updateTotalWatchTime",
                    watchTime,
                });

                saveData();
                renderWatchTime();
            }
        });

        videoElement.addEventListener("ended", () => {
            if (currentVideoStartTimes) {
                const currentTime = Date.now();
                const watchDuration = currentTime - currentVideoStartTimes;
                watchTime += watchDuration;

                chrome.runtime.sendMessage({
                    action: "updateTotalWatchTime",
                    watchTime,
                });

                saveData();
                renderWatchTime();
            }
        });
    } else {
        console.log("Video element not found");
    }
}

trackVideo();
