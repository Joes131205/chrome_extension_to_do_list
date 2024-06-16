console.log("content");

// Create elements
const appDiv = document.createElement("div");
appDiv.classList.add("app-div");

const toDoListDiv = document.createElement("div");
const toDoList = document.createElement("div");
const toDoListForm = document.createElement("div");
const pointsDiv = document.createElement("div");

// Initialize variables
let list = [];
let points = 0;

// Function to check if DOM is ready
function afterDOMLoaded() {
    console.log("loaded");
    const related = document.getElementById("related");
    const secondaryInner = document.getElementById("secondary-inner");

    if (related && secondaryInner) {
        init(related, secondaryInner);
    } else {
        setTimeout(afterDOMLoaded, 100);
    }
}

// Initialize application
function init(related, secondaryInner) {
    related.innerHTML = "";
    renderToDoList();
    renderPoints();
    appDiv.appendChild(toDoListDiv);
    appDiv.appendChild(pointsDiv);
    secondaryInner.insertAdjacentElement("beforeend", appDiv);
}

// Add task to list
function addList(task) {
    list.push(task);
}

// Delete task from list
function deleteTask(index) {
    list.splice(index, 1);
    renderTask();
}

// Complete task and increment points
function completeTask(index) {
    points++;
    renderPoints();
}

// Render task list
function renderTask() {
    toDoList.innerHTML = "";
    const ul = document.createElement("ul");
    list.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");
        li.textContent = task;

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
            completeTask(index);
            li.classList.add("completed");
        });

        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        ul.appendChild(li);
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
    const button = document.createElement("input");
    button.setAttribute("type", "submit");
    button.value = "Add";
    form.appendChild(taskInput);
    form.appendChild(button);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (taskInput.value) {
            addList(taskInput.value);
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

// Check if DOM is ready
if (document.readyState !== "complete") {
    window.addEventListener("load", afterDOMLoaded);
} else {
    afterDOMLoaded();
}
