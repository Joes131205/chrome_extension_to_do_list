console.log("content");

// Create elements
const appDiv = document.createElement("div");
appDiv.style.color = "white";
appDiv.style.fontSize = "20px";

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
    ul.style.display = "flex";
    ul.style.gap = "20px";
    ul.style.flexWrap = "wrap";
    list.forEach((task, index) => {
        const li = document.createElement("li");
        li.style.listStyleType = "none";
        li.style.background = "cyan";
        li.style.padding = "1rem 2rem";
        li.style.borderRadius = "10px";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "1.5rem";
        li.style.justifyContent = "center";
        li.textContent = task;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "DEL";
        deleteButton.style.background = "red";
        deleteButton.style.color = "white";
        deleteButton.style.padding = "0.5rem 1rem";
        deleteButton.style.border = "none";
        deleteButton.style.borderRadius = "5px";
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("mouseover", () => {
            deleteButton.style.background = "darkred";
        });

        deleteButton.addEventListener("mouseout", () => {
            deleteButton.style.background = "red";
        });

        deleteButton.addEventListener("click", () => {
            deleteTask(index);
        });

        const completeButton = document.createElement("button");
        completeButton.textContent = "DONE";
        completeButton.style.background = "green";
        completeButton.style.color = "white";
        completeButton.style.padding = "0.5rem 1rem";
        completeButton.style.border = "none";
        completeButton.style.borderRadius = "5px";
        completeButton.style.cursor = "pointer";
        completeButton.addEventListener("mouseover", () => {
            completeButton.style.background = "darkgreen";
        });
        completeButton.addEventListener("mouseout", () => {
            completeButton.style.background = "green";
        });
        completeButton.addEventListener("click", () => {
            completeTask(index);
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
