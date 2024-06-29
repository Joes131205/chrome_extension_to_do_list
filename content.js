console.log("content");

// Create elements
const appDiv = document.createElement("div");
appDiv.classList.add("app-div");

const toDoListDiv = document.createElement("div");
toDoListDiv.classList.add("to-do-list-div");

const toDoList = document.createElement("div");
toDoList.classList.add("to-do-list");

const toDoListForm = document.createElement("div");
toDoListForm.classList.add("to-do-list-form");

const pointsDiv = document.createElement("div");
pointsDiv.classList.add("points-div");

const shopDiv = document.createElement("div");
shopDiv.classList.add("shop-div");

const watchTimeDiv = document.createElement("div");
watchTimeDiv.classList.add("watchTime-div");

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
    constructor(id, task, type, completed) {
        this.id = id;
        this.task = task;
        this.type = type;
        this.completed = completed;
    }
}

class ListItemRepeat extends ListItem {
    constructor(id, task, type, completions) {
        super(id, task, type);
        this.completions = completions;
    }
}

let related;

// Function to check if DOM is ready
function afterDOMLoaded() {
    if (document.readyState === "complete" && !chrome.runtime.lastError) {
        console.log("loaded");
        related = document.getElementById("related");
        const secondaryInner = document.getElementById("secondary-inner");

        if (related && secondaryInner) {
            related.style.display = "none";

            init(related, secondaryInner);
        } else {
            setTimeout(afterDOMLoaded, 100);
        }
    }
}

// Initialize application
async function init(secondaryInner) {
    appDiv.innerHTML = "";
    await loadData();
    renderWatchTime();
    renderToDoList();
    renderPoints();
    renderShop();
    secondaryInner.insertAdjacentElement("beforebegin", appDiv);
}

// Add task to list
function addList(task, type) {
    let newTask;
    if (type === "once") {
        newTask = new ListItem(Date.now(), task, type, false);
    } else {
        newTask = new ListItemRepeat(Date.now(), task, type, 0);
    }
    list.push(newTask);
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
            li.classList.add(task.completed && "completed");
            li.textContent = task.task;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "DEL";
            deleteButton.classList.add("delete-button");

            deleteButton.addEventListener("click", () => {
                deleteTask(index);
            });

            const completeButton = document.createElement("button");
            completeButton.textContent = "DONE";
            completeButton.classList.add("complete-button");
            completeButton.addEventListener("click", () => {
                completeOnceTask(index);
                li.classList.add("completed");
            });

            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            ul.appendChild(li);
        } else {
            const li = document.createElement("li");
            li.classList.add("task");
            li.classList.add(task.completed && "completed");
            li.textContent = task.task;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "DEL";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => {
                deleteTask(index);
            });
            const completeButton = document.createElement("button");
            completeButton.textContent = "ADD";
            completeButton.classList.add("complete-button");
            completeButton.addEventListener("click", () => {
                completeIncrementTask(index);
            });
            const completedText = document.createElement("p");
            completedText.textContent = "Completed: " + task.completions;
            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            li.appendChild(completedText);
            ul.appendChild(li);
        }
    });
    toDoList.appendChild(ul);
}

// Render to-do list
function renderToDoList() {
    // Render heading
    toDoListDiv.innerHTML = "";

    const toDoListHeading = document.createElement("h2");
    toDoListHeading.textContent = "To Do List";
    toDoListDiv.appendChild(toDoListHeading);

    // Set up form for inputting task
    const form = document.createElement("form");
    const taskInput = document.createElement("input");
    taskInput.setAttribute("type", "text");
    taskInput.placeholder = "Add new task";
    taskInput.id = "input";

    const typeSelect = document.createElement("select");
    typeSelect.id = "type";
    const onceOption = document.createElement("option");
    onceOption.value = "once";
    onceOption.textContent = "Do once";
    const repeatOption = document.createElement("option");
    repeatOption.value = "repeat";
    repeatOption.textContent = "Repeating / Incremental";
    typeSelect.appendChild(onceOption);
    typeSelect.appendChild(repeatOption);

    const addButton = document.createElement("input");
    addButton.setAttribute("type", "submit");
    addButton.value = "Add";

    form.appendChild(taskInput);
    form.appendChild(typeSelect);
    form.appendChild(addButton);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (taskInput.value) {
            const type = typeSelect.value;
            addList(taskInput.value, type);
            taskInput.value = "";
            renderTask();
        } else {
            alert("Please enter an task");
        }
    });
    toDoListDiv.appendChild(form);

    // Render task list
    toDoList.innerHTML = "";
    renderTask();
    toDoListDiv.appendChild(toDoList);
    appDiv.appendChild(toDoListDiv);
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
        const rewardButton = document.createElement("button");

        const rewardTitle = document.createElement("p");
        rewardTitle.textContent = `${reward.title} - ${reward.cost} Points`;
        rewardLi.appendChild(rewardTitle);

        rewardButton.textContent = "BUY";
        rewardButton.addEventListener("click", () => {
            if (points >= reward.cost) {
                points -= reward.cost;
                if (reward.title === "Watch Video (10 minutes)") {
                    related.style.display = "block";
                }
                renderPoints();
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

function renderWatchTime() {
    const hours = Math.floor(watchTime / (1000 * 60 * 60));
    const minutes = Math.floor((watchTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((watchTime % (1000 * 60)) / 1000);
    const watchTimeDiv = document.createElement("div");
    watchTimeDiv.textContent = `Your watch time: ${hours}h, ${minutes}m, ${seconds}s`;
    appDiv.appendChild(watchTimeDiv);
}

function saveData() {
    chrome.storage.local.set({ list, points, watchTime }, function () {
        console.log("Data saved to local storage");
    });
}

async function loadData() {
    console.log("loading data...");
    await chrome.storage.local.get(
        ["list", "points", "totalWatchTime"],
        function (result) {
            console.log(result);
            list = result.list || [];
            points = result.points || 0;
            watchTime = result.totalWatchTime || 0;
            console.log("Data loaded from local storage");

            // Move the code that depends on the loaded data inside the callback function
            let lastSavedDateStr = result.lastSavedDateStr;
            let lastSavedDate = lastSavedDateStr
                ? new Date(lastSavedDateStr)
                : null;
            const currentDate = new Date();
            if (
                lastSavedDate &&
                currentDate.getDate() !== lastSavedDate.getDate()
            ) {
                list.forEach((list) => {
                    if (list.type === "repeat") {
                        list.completions = 0;
                    } else {
                        list.completed = false;
                    }
                });
                points = 0;
                watchTime = 0;
            }

            list = list.map((task) => {
                if (task.type === "once") {
                    return new ListItem(
                        task.id,
                        task.title,
                        task.type,
                        task.difficulty,
                        task.points,
                        task.completed
                    );
                } else {
                    return new ListItemRepeat(
                        task.id,
                        task.title,
                        task.type,
                        task.difficulty,
                        task.points,
                        task.completions
                    );
                }
            });
            lastSavedDate = currentDate;
            chrome.storage.local.set(
                { lastSavedDateStr: JSON.stringify(lastSavedDate) },
                function () {
                    console.log("Date saved to local storage");
                }
            );
        }
    );
}
function trackVideo() {
    const videoElement = document.querySelector("video");

    if (videoElement) {
        console.log("tracking...");
        chrome.storage.local.get(
            ["totalWatchTime", "lastSavedDateStr"],
            function (result) {
                console.log(result);
            }
        );
        videoElement.addEventListener("play", () => {
            const currentVideoStartTimes = Date.now();
            console.log("Video started playing");

            videoElement.addEventListener("pause", () => {
                console.log("paused");
                const currentTime = Date.now();
                const watchTime = currentTime - currentVideoStartTimes;
                console.log(watchTime);
                chrome.runtime.sendMessage({
                    action: "updateTotalWatchTime",
                    watchTime,
                });
                loadData();
            });
        });
    } else {
        console.log("Video element not found");
    }
}
trackVideo();
