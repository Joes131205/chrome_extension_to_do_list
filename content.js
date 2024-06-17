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

// Initialize variables
let list = [];
let points = 0;
class ShopItem {
    constructor({ title, cost }) {
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
    console.log("loaded");
    related = document.getElementById("related");
    const secondaryInner = document.getElementById("secondary-inner");

    if (related && secondaryInner) {
        init(related, secondaryInner);
    } else {
        setTimeout(afterDOMLoaded, 100);
    }
}

// Initialize application
function init(related, secondaryInner) {
    related.style.display = "none";
    renderToDoList();
    renderPoints();
    renderShop();
    appDiv.appendChild(toDoListDiv);
    appDiv.appendChild(pointsDiv);
    appDiv.appendChild(shopDiv);
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
    renderTask();
}

// Complete task and increment points
function completeOnceTask(index) {
    list[index].completed = true;
    points++;
    renderPoints();
}
function completeIncrementTask(index) {
    list[index].completions++;
    points++;
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
}

// Render points
function renderPoints() {
    pointsDiv.innerHTML = "";
    const pointsEl = document.createElement("p");
    pointsEl.textContent = `Points: ${points}`;
    pointsDiv.appendChild(pointsEl);
}

// Render Shop
function renderShop() {
    const shopHeading = document.createElement("h2");
    shopHeading.textContent = "Shop";
    shopDiv.appendChild(shopHeading);
    const rewards = [
        new ShopItem({
            title: "Short Break (5 minutes)",
            cost: 3,
        }),
        new ShopItem({
            title: "Medium Break (15 minutes)",
            cost: 10,
        }),
        new ShopItem({
            title: "Long Break (30 minutes)",
            cost: 20,
        }),
        new ShopItem({
            title: "Gaming Session (20 minutes)",
            cost: 15,
        }),
        new ShopItem({
            title: "Watch Video (10 minutes)",
            cost: 7,
        }),
        new ShopItem({
            title: "Stretching Exercise (10 minutes)",
            cost: 6,
        }),
    ];
    const shopList = document.createElement("ul");
    rewards.forEach((reward) => {
        const rewardLi = document.createElement("li");
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
}

// Check if DOM is ready
if (document.readyState !== "complete") {
    window.addEventListener("load", afterDOMLoaded);
} else {
    afterDOMLoaded();
}