// Initialize variables and create elements
let list = [];
let goalWatchTime = 0;
let points = 0;
let watchTime = 0;
let related;

const appDiv = createDiv("app-div");
const toDoListDiv = createDiv("to-do-list-div");
const toDoList = createDiv("to-do-list");
const pointsDiv = createDiv("points-div");
const shopDiv = createDiv("shop-div");
const watchTimeDiv = createDiv("watchTime-div");

// ShopItem Class
class ShopItem {
    constructor({ category, title, cost, minutes }) {
        this.category = category;
        this.title = title;
        this.cost = cost;
        this.minutes = minutes;
    }
}

// ListItem Class
class ListItem {
    constructor(id, task, type, completed = false) {
        this.id = id;
        this.task = task;
        this.type = type;
        this.completed = completed;
    }
}

// ListItemRepeat Class extends ListItem
class ListItemRepeat extends ListItem {
    constructor(id, task, type, completions = 0) {
        super(id, task, type);
        this.completions = completions;
    }
}

// Create a div with a class name
function createDiv(className) {
    const div = document.createElement("div");
    div.classList.add(className);
    return div;
}

// Initialize application after DOM is loaded
function afterDOMLoaded() {
    if (document.readyState === "complete" && !chrome.runtime.lastError) {
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

// Render all elements
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
    init();
}

// Delete task from list
function deleteTask(index) {
    list.splice(index, 1);
    saveData();
    init();
}

// Complete once task
function completeOnceTask(index) {
    list[index].completed = true;
    points++;
    saveData();
    init();
}

// Complete and increment task
function completeIncrementTask(index) {
    list[index].completions++;
    points++;
    saveData();
    init();
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
            const p = document.createElement("p");
            p.textContent = task.task;
            li.appendChild(p);
            const deleteButton = createButton(
                "DEL",
                () => deleteTask(index),
                "delete-button"
            );
            const completeButton = createButton(
                "DONE",
                () => completeOnceTask(index),
                "complete-button"
            );

            li.append(deleteButton, completeButton);
        } else {
            li.textContent = task.task;
            const deleteButton = createButton(
                "DEL",
                () => deleteTask(index),
                "delete-button"
            );
            const completeButton = createButton(
                "ADD",
                () => completeIncrementTask(index),
                "complete-button"
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
function createButton(text, onClick, css) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(css);
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

    const addButton = createButton(
        "Add",
        (e) => {
            e.preventDefault();
            if (taskInput.value) {
                addList(taskInput.value, typeSelect.value);
                taskInput.value = "";
            } else {
                alert("Please enter a task");
            }
        },
        "add_task"
    );

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
async function openYoutube(minutes) {
    setTimeout(() => {
        related.style.display = "block";
    }, minutes * 60 * 1000);
    related.style.display = "none";
}
// Render Shop
function renderShop() {
    shopDiv.innerHTML = "";
    const shopHeading = document.createElement("h2");
    shopHeading.textContent = "Shop";
    shopDiv.appendChild(shopHeading);

    const rewards = [
        new ShopItem({
            category: "youtube",
            title: "Watch YouTube Video (10 minutes)",
            cost: 7,
            minutes: 10,
        }),
    ];

    const shopList = document.createElement("ul");

    rewards.forEach((reward) => {
        const rewardLi = document.createElement("li");
        rewardLi.classList.add("shop_item");

        const rewardTitle = document.createElement("p");
        rewardTitle.textContent = `${reward.title} - ${reward.cost} Points`;
        rewardLi.appendChild(rewardTitle);

        const rewardButton = createButton(
            "BUY",
            () => {
                if (points >= reward.cost) {
                    points -= reward.cost;
                    renderPoints();
                    renderShop();
                    if (reward.category === "youtube") {
                        openYoutube(reward.category);
                    }
                } else {
                    alert("Not enough points");
                }
            },
            "shop_buy"
        );

        rewardLi.appendChild(rewardButton);
        shopList.appendChild(rewardLi);
    });

    shopDiv.appendChild(shopList);
    appDiv.appendChild(shopDiv);
}

// Render watch time
function renderWatchTime() {
    const hours = Math.floor(watchTime / (1000 * 60 * 60));
    const minutes = Math.floor((watchTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((watchTime % (1000 * 60)) / 1000);

    const goalHours = Math.floor(goalWatchTime / (1000 * 60 * 60));
    const goalMinutes = Math.floor(
        (goalWatchTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const goalSeconds = Math.floor((goalWatchTime % (1000 * 60)) / 1000);

    // Create elements for watch time
    const watchTimeParagraph = document.createElement("p");
    watchTimeParagraph.textContent = `Your watch time: ${hours}h, ${minutes}m, ${seconds}s`;

    // Create elements for goal watch time
    const goalWatchTimeParagraph = document.createElement("p");
    goalWatchTimeParagraph.textContent = `Your goal watch time: ${goalHours}h, ${goalMinutes}m, ${goalSeconds}s`;

    // Clear previous content
    watchTimeDiv.innerHTML = "";

    // Append new content

    const form = document.createElement("form");
    const goalWatchTimeInput = document.createElement("input");
    goalWatchTimeInput.setAttribute("type", "number");

    goalWatchTimeInput.placeholder = "Enter your goal watch time in minutes";
    goalWatchTimeInput.style.width = "100px";
    goalWatchTimeInput.style.padding = "10px";
    goalWatchTimeInput.style.borderRadius = "5px";
    goalWatchTimeInput.style.border = "1px solid #ccc";
    goalWatchTimeInput.style.fontSize = "16px";

    const submitButton = createButton(
        "Set goal watch time",
        () => {},
        "submit_button"
    );
    submitButton.style.width = "100px";
    submitButton.style.padding = "10px";
    submitButton.style.borderRadius = "5px";
    submitButton.style.border = "1px solid #ccc";
    submitButton.style.fontSize = "16px";
    submitButton.style.backgroundColor = "#4CAF50";
    submitButton.style.color = "#fff";
    submitButton.style.cursor = "pointer";
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        goalWatchTime = parseInt(goalWatchTimeInput.value) * 60 * 1000;
        saveData();
        init();
    });

    form.append(goalWatchTimeInput, submitButton);
    watchTimeDiv.appendChild(form);
    watchTimeDiv.appendChild(watchTimeParagraph);
    watchTimeDiv.appendChild(document.createElement("br")); // Add a line break
    watchTimeDiv.appendChild(goalWatchTimeParagraph);
    // Progress Bar
    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress-bar-container");
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar-container");
    progressBar.classList.add("progress-bar");

    const progress = (watchTime / goalWatchTime) * 100;
    progressBar.style.width = `${progress}%`;
    progressBarContainer.appendChild(progressBar);
    watchTimeDiv.appendChild(progressBarContainer);

    appDiv.appendChild(watchTimeDiv);
}

// Save data to Chrome storage
function saveData() {
    chrome.storage.local.set({ list, points, watchTime, goalWatchTime }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error saving data:", chrome.runtime.lastError);
        }
    });
}

// Load data from Chrome storage
async function loadData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(
            [
                "list",
                "points",
                "watchTime",
                "lastSavedDateStr",
                "goalWatchTime",
            ],
            (result) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                list = result.list || [];
                points = result.points || 0;
                watchTime = result.watchTime || 0;
                goalWatchTime = result.goalWatchTime || 0;
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
                            return reject(chrome.runtime.lastError);
                        }
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
                init();
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
                init();
            }
        });
    } else {
    }
}

// Check if DOM is ready and load after window load if necessary
if (document.readyState !== "complete") {
    window.addEventListener("load", afterDOMLoaded);
} else {
    afterDOMLoaded();
}

trackVideo();
