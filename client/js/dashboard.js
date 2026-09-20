// ==================== GET USER ====================

const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");


// ==================== CHECK LOGIN ====================

if (!userId) {
    window.location.href = "../index.html";
}


// ==================== DISPLAY USER NAME ====================

document.getElementById("userName").textContent =
    userName || "User";


// ==================== DASHBOARD ====================

async function loadDashboard() {

    try {

        const data = await apiRequest(
            `/dashboard?userId=${userId}`
        );

        const dashboard = data.data;

        const summary = dashboard.summary;


        // ==================== SUMMARY ====================

        document.getElementById("totalTasks").textContent =
            summary.totalTasks;

        document.getElementById("pendingTasks").textContent =
            summary.pendingTasks;

        document.getElementById("completedTasks").textContent =
            summary.completedTasks;

        document.getElementById("overdueTasks").textContent =
            summary.overdueTasks;


        // ==================== START HERE ====================

        displayStartHere(dashboard.startHere);


        // ==================== TODAY'S TASKS ====================

        displayTodayTasks(dashboard.todayTasks);


        // ==================== NEEDS ATTENTION ====================

        displayNeedsAttention(
            dashboard.needsAttentionTasks
        );


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        alert(error.message);

    }
}


// ==================== START HERE ====================

function displayStartHere(task) {

    const container =
        document.getElementById("startHereContainer");


    if (!task) {

        container.innerHTML = `
            <p class="empty-message">
                No task to start right now.
            </p>
        `;

        return;
    }


    container.innerHTML = createTaskCard(task);
}


// ==================== TODAY'S TASKS ====================

function displayTodayTasks(tasks) {

    const container =
        document.getElementById("todayTasksContainer");


    if (!tasks || tasks.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No tasks for today.
            </p>
        `;

        return;
    }


    container.innerHTML =
        tasks.map(task => createTaskCard(task)).join("");
}


// ==================== NEEDS ATTENTION ====================

function displayNeedsAttention(tasks) {

    const container =
        document.getElementById(
            "needsAttentionContainer"
        );


    if (!tasks || tasks.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No tasks need attention.
            </p>
        `;

        return;
    }


    container.innerHTML =
        tasks.map(task => createTaskCard(task)).join("");
}


// ==================== TASK CARD ====================

function createTaskCard(task) {

    const dueDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "No due date";


    const health = task.health
        ? task.health.replace("_", " ")
        : "ON TRACK";


    return `
        <div class="dashboard-task-card">

            <h3>
                ${task.title}
            </h3>

            ${
                task.description
                    ? `<p>${task.description}</p>`
                    : ""
            }

            <div class="task-meta">

                <span class="task-badge">
                    ${task.priority}
                </span>

                <span class="task-badge">
                    ${task.status}
                </span>

                <span class="task-badge">
                    ${dueDate}
                </span>

                <span class="task-badge">
                    ${health}
                </span>

            </div>

        </div>
    `;
}


// ==================== LOGOUT ====================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        window.location.href = "../index.html";

    });


// ==================== LOAD DASHBOARD ====================

loadDashboard();

