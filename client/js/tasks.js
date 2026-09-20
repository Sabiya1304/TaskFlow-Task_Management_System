const userId = localStorage.getItem("userId");


// ==================== CHECK LOGIN ====================

if (!userId) {
    window.location.href = "../index.html";
}


// ==================== ELEMENTS ====================

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const healthFilter = document.getElementById("healthFilter");
const sortFilter = document.getElementById("sortFilter");

const statusTabs =
    document.querySelectorAll(".status-tab");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskModal =
    document.getElementById("taskModal");

const closeTaskModal =
    document.getElementById("closeTaskModal");

const taskForm =
    document.getElementById("taskForm");

const addSubtaskInputBtn =
    document.getElementById("addSubtaskInput");

const subtaskInputs =
    document.getElementById("subtaskInputs");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==================== LOAD TASKS ====================

async function loadTasks() {

    try {

        const params = new URLSearchParams();

        params.append("userId", userId);


        // Search

        if (searchInput.value.trim()) {
            params.append(
                "search",
                searchInput.value.trim()
            );
        }


        // Status

        if (statusFilter.value) {
            params.append(
                "status",
                statusFilter.value
            );
        }


        // Priority

        if (priorityFilter.value) {
            params.append(
                "priority",
                priorityFilter.value
            );
        }


        // Sort

        if (sortFilter.value) {
            params.append(
                "sort",
                sortFilter.value
            );
        }


        const data = await apiRequest(
            `/tasks?${params.toString()}`
        );


        let tasks = data.data.tasks;


        // ==================== HEALTH FILTER ====================

        if (healthFilter.value) {

            tasks = tasks.filter(
                task => task.health === healthFilter.value
            );

        }


        displayTasks(tasks);


    } catch (error) {

        console.error(
            "Load Tasks Error:",
            error
        );

        taskList.innerHTML = `
            <p class="empty-message">
                Failed to load tasks.
            </p>
        `;

    }
}


// ==================== DISPLAY TASKS ====================

function displayTasks(tasks) {

    if (!tasks || tasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                No tasks found.
            </p>
        `;

        return;
    }


    taskList.innerHTML =
        tasks
            .map(task => createTaskCard(task))
            .join("");
}


// ==================== CREATE TASK CARD ====================

function createTaskCard(task) {

    const dueDate = task.dueDate
        ? new Date(task.dueDate)
            .toLocaleDateString()
        : "No due date";


    const healthClass =
        task.health
            .toLowerCase()
            .replace("_", "-");


    const priorityClass =
        `priority-${task.priority.toLowerCase()}`;


    let subtasksHTML = "";


    if (
        task.subtasks &&
        task.subtasks.length > 0
    ) {

        subtasksHTML = `

            <div class="subtask-preview">

                <h4>
                    Subtasks
                </h4>

                ${task.subtasks.map(subtask => `

                    <div
                        class="subtask-item
                        ${subtask.completed ? "completed" : ""}"
                    >

                        <input
                            type="checkbox"
                            ${subtask.completed ? "checked" : ""}
                            onchange="
                                toggleSubtask(
                                    '${task._id}',
                                    '${subtask._id}',
                                    this.checked
                                )
                            "
                        >

                        <span>
                            ${subtask.title}
                        </span>

                    </div>

                `).join("")}

            </div>
        `;
    }


    return `

        <article class="task-card">

            <div class="task-card-header">

                <div>

                    <h3>
                        ${task.title}
                    </h3>

                </div>

            </div>


            ${
                task.description
                    ? `
                        <p class="task-card-description">
                            ${task.description}
                        </p>
                    `
                    : ""
            }


            <div class="task-info">

                <span class="task-badge ${priorityClass}">
                    ${task.priority}
                </span>

                <span class="task-badge">
                    ${task.status}
                </span>

                <span class="task-badge">
                    Due: ${dueDate}
                </span>

                <span
                    class="task-badge health-${healthClass}"
                >
                    ${formatHealth(task.health)}
                </span>

            </div>


            ${subtasksHTML}


            <div class="task-actions">

                ${
                    task.status === "Completed"

                    ? `
                        <button
                            class="task-action-btn"
                            onclick="
                                reopenTask('${task._id}')
                            "
                        >
                            Reopen
                        </button>
                    `

                    : `
                        <button
                            class="task-action-btn"
                            onclick="
                                completeTask('${task._id}')
                            "
                        >
                            Complete
                        </button>
                    `
                }


                <button
                    class="task-action-btn"
                    onclick="
                        editTask('${task._id}')
                    "
                >
                    Edit
                </button>


                <button
                    class="task-action-btn"
                    onclick="
                        deleteTask('${task._id}')
                    "
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


// ==================== HEALTH TEXT ====================

function formatHealth(health) {

    if (health === "ON_TRACK") {
        return "On Track";
    }

    if (health === "NEEDS_ATTENTION") {
        return "Needs Attention";
    }

    if (health === "AT_RISK") {
        return "At Risk";
    }

    return health;
}


// ==================== OPEN ADD TASK ====================

addTaskBtn.addEventListener(
    "click",
    () => {

        taskForm.reset();

        document.getElementById(
            "taskModalTitle"
        ).textContent = "Add Task";

        taskModal.style.display = "flex";

    }
);


// ==================== CLOSE TASK MODAL ====================

closeTaskModal.addEventListener(
    "click",
    () => {

        taskModal.style.display = "none";

    }
);


// ==================== CLOSE OUTSIDE MODAL ====================

window.addEventListener(
    "click",
    (event) => {

        if (event.target === taskModal) {

            taskModal.style.display = "none";

        }

    }
);


// ==================== ADD SUBTASK INPUT ====================

addSubtaskInputBtn.addEventListener(
    "click",
    () => {

        const row =
            document.createElement("div");

        row.className =
            "subtask-input-row";


        row.innerHTML = `

            <input
                type="text"
                class="subtask-input"
                placeholder="Enter subtask"
            >

        `;


        subtaskInputs.appendChild(row);

    }
);


// ==================== CREATE TASK ====================

taskForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const title =
            document
                .getElementById("taskTitle")
                .value
                .trim();


        const description =
            document
                .getElementById("taskDescription")
                .value
                .trim();


        const dueDate =
            document
                .getElementById("taskDueDate")
                .value;


        const priority =
            document
                .getElementById("taskPriority")
                .value;


        const status =
            document
                .getElementById("taskStatus")
                .value;


        const subtaskElements =
            document.querySelectorAll(
                ".subtask-input"
            );


        const subtasks = [];


        subtaskElements.forEach(input => {

            const value = input.value.trim();

            if (value) {

                subtasks.push({
                    title: value
                });

            }

        });


        try {

            await apiRequest("/tasks", {

                method: "POST",

                body: JSON.stringify({

                    userId,

                    title,

                    description,

                    dueDate: dueDate || undefined,

                    priority,

                    status,

                    subtasks

                })

            });


            alert(
                "Task created successfully"
            );


            taskModal.style.display = "none";

            taskForm.reset();


            // Keep one subtask input

            subtaskInputs.innerHTML = `

                <div class="subtask-input-row">

                    <input
                        type="text"
                        class="subtask-input"
                        placeholder="Enter subtask"
                    >

                </div>

            `;


            loadTasks();


        } catch (error) {

            alert(error.message);

        }

    }
);


// ==================== COMPLETE TASK ====================

async function completeTask(taskId) {

    try {

        await apiRequest(
            `/tasks/${taskId}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    userId,
                    status: "Completed"
                })
            }
        );


        loadTasks();


    } catch (error) {

        alert(error.message);

    }
}


// ==================== REOPEN TASK ====================

async function reopenTask(taskId) {

    try {

        await apiRequest(
            `/tasks/${taskId}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    userId,
                    status: "In Progress"
                })
            }
        );


        loadTasks();


    } catch (error) {

        alert(error.message);

    }
}


// ==================== DELETE TASK ====================

async function deleteTask(taskId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await apiRequest(
            `/tasks/${taskId}?userId=${userId}`,
            {
                method: "DELETE"
            }
        );


        loadTasks();


    } catch (error) {

        alert(error.message);

    }
}


// ==================== EDIT TASK ====================

async function editTask(taskId) {

    try {

        const data = await apiRequest(
            `/tasks/${taskId}?userId=${userId}`
        );


        const task = data.data.task;


        document.getElementById(
            "taskTitle"
        ).value = task.title;


        document.getElementById(
            "taskDescription"
        ).value = task.description || "";


        document.getElementById(
            "taskDueDate"
        ).value = task.dueDate
            ? task.dueDate.split("T")[0]
            : "";


        document.getElementById(
            "taskPriority"
        ).value = task.priority;


        document.getElementById(
            "taskStatus"
        ).value = task.status;


        subtaskInputs.innerHTML = "";


        task.subtasks.forEach(subtask => {

            const row =
                document.createElement("div");

            row.className =
                "subtask-input-row";


            row.innerHTML = `

                <input
                    type="text"
                    class="subtask-input"
                    value="${subtask.title}"
                >

            `;


            subtaskInputs.appendChild(row);

        });


        document.getElementById(
            "taskModalTitle"
        ).textContent = "Edit Task";


        taskModal.style.display = "flex";


        // Change form submit temporarily

        taskForm.onsubmit = async (event) => {

            event.preventDefault();


            const updatedTask = {

                userId,

                title:
                    document
                        .getElementById("taskTitle")
                        .value
                        .trim(),

                description:
                    document
                        .getElementById("taskDescription")
                        .value
                        .trim(),

                dueDate:
                    document
                        .getElementById("taskDueDate")
                        .value || null,

                priority:
                    document
                        .getElementById("taskPriority")
                        .value,

                status:
                    document
                        .getElementById("taskStatus")
                        .value

            };


            try {

                await apiRequest(
                    `/tasks/${taskId}`,
                    {
                        method: "PUT",

                        body: JSON.stringify(
                            updatedTask
                        )
                    }
                );


                alert(
                    "Task updated successfully"
                );


                taskModal.style.display =
                    "none";


                taskForm.onsubmit = null;


                loadTasks();


            } catch (error) {

                alert(error.message);

            }

        };


    } catch (error) {

        alert(error.message);

    }

}


// ==================== TOGGLE SUBTASK ====================

async function toggleSubtask(
    taskId,
    subtaskId,
    completed
) {

    try {

        await apiRequest(
            `/tasks/${taskId}/subtasks/${subtaskId}`,
            {
                method: "PUT",

                body: JSON.stringify({
                    userId,
                    completed
                })
            }
        );


        loadTasks();


    } catch (error) {

        alert(error.message);

        loadTasks();

    }

}


// ==================== STATUS TABS ====================

statusTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            statusTabs.forEach(item => {
                item.classList.remove("active");
            });


            tab.classList.add("active");


            statusFilter.value =
                tab.dataset.status;


            loadTasks();

        }
    );

});


// ==================== FILTER EVENTS ====================

searchInput.addEventListener(
    "input",
    loadTasks
);

statusFilter.addEventListener(
    "change",
    loadTasks
);

priorityFilter.addEventListener(
    "change",
    loadTasks
);

healthFilter.addEventListener(
    "change",
    loadTasks
);

sortFilter.addEventListener(
    "change",
    loadTasks
);


// ==================== LOGOUT ====================

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        window.location.href =
            "../index.html";

    }
);


// ==================== INITIAL LOAD ====================

loadTasks();