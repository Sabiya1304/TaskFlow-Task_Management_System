const Task = require("../models/Task");

// Temporary user ID until JWT authentication is added
const getUserId = (req) => {
    return req.query.userId;
};

// Get Dashboard Data
const getDashboard = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const tasks = await Task.find({
            user: userId
        }).sort({
            dueDate: 1
        });

        const today = new Date();

        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const endOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );

        // Total Tasks
        const totalTasks = tasks.length;

        // Completed Tasks
        const completedTasks = tasks.filter(
            task => task.status === "Completed"
        ).length;

        // Pending Tasks
        const pendingTasks = tasks.filter(
            task => task.status !== "Completed"
        ).length;

        // Overdue Tasks
        const overdueTasks = tasks.filter(task => {
            return (
                task.status !== "Completed" &&
                task.dueDate &&
                new Date(task.dueDate) < startOfToday
            );
        });

        // Today's Tasks
        const todayTasks = tasks.filter(task => {
            if (!task.dueDate) {
                return false;
            }

            const dueDate = new Date(task.dueDate);

            return (
                dueDate >= startOfToday &&
                dueDate < endOfToday
            );
        });

        // Needs Attention
        const needsAttentionTasks = tasks.filter(task => {
            if (task.status === "Completed") {
                return false;
            }

            const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < startOfToday;

            const isBlocked =
                task.status === "Blocked";

            const hasRecovery =
                task.recovery !== null;

            return (
                isOverdue ||
                isBlocked ||
                hasRecovery
            );
        });

        // Start Here
        // First pending task that needs attention.
        // If none exists, use the first pending task.
        let startHere = needsAttentionTasks[0] || null;

        if (!startHere) {
            startHere =
                tasks.find(
                    task => task.status !== "Completed"
                ) || null;
        }

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalTasks,
                    pendingTasks,
                    completedTasks,
                    overdueTasks: overdueTasks.length
                },

                todayTasks,

                overdueTasks,

                needsAttentionTasks,

                startHere
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get dashboard data"
        });
    }
};

module.exports = {
    getDashboard
};