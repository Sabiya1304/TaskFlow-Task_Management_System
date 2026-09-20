const Task = require("../models/Task");
const calculateTaskHealth = require("../utils/taskHealth");

// Temporary user ID until JWT authentication is added
const getUserId = (req) => {
    return req.body?.userId || req.query.userId;
};


// ==================== CREATE TASK ====================

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority,
            status,
            subtasks
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            user: getUserId(req),
            title: title.trim(),
            description,
            dueDate,
            priority,
            status,
            subtasks
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Create Task Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create task"
        });
    }
};


// ==================== GET ALL TASKS ====================

const getTasks = async (req, res) => {
    try {
        const {
            search,
            status,
            priority,
            sort
        } = req.query;

        const filter = {
            user: getUserId(req)
        };

        // Search by title
        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by priority
        if (priority) {
            filter.priority = priority;
        }

        // Sorting
        let sortOption = {
            createdAt: -1
        };

        if (sort === "dueDate") {
            sortOption = {
                dueDate: 1
            };
        } else if (sort === "newest") {
            sortOption = {
                createdAt: -1
            };
        } else if (sort === "oldest") {
            sortOption = {
                createdAt: 1
            };
        } else if (sort === "priority") {
            sortOption = {
                priority: -1
            };
        }

        const tasks = await Task.find(filter).sort(sortOption);

        // Add dynamic health
        const tasksWithHealth = tasks.map(task => {
            const taskObject = task.toObject();

            taskObject.health = calculateTaskHealth(task);

            return taskObject;
        });

        res.status(200).json({
            success: true,
            data: {
                tasks: tasksWithHealth
            }
        });

    } catch (error) {
        console.error("Get Tasks Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get tasks"
        });
    }
};


// ==================== GET SINGLE TASK ====================

const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const taskObject = task.toObject();

        // Add dynamic health
        taskObject.health = calculateTaskHealth(task);

        res.status(200).json({
            success: true,
            data: {
                task: taskObject
            }
        });

    } catch (error) {
        console.error("Get Task Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get task"
        });
    }
};


// ==================== UPDATE TASK ====================

const updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority,
            status
        } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Task title cannot be empty"
                });
            }

            task.title = title.trim();
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (status !== undefined) {
            task.status = status;
        }

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Update Task Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
};


// ==================== DELETE TASK ====================

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete Task Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete task"
        });
    }
};


// ==================== UPDATE STATUS ====================

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        task.status = status;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Update Status Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update task status"
        });
    }
};


// ==================== RESCHEDULE TASK ====================

const rescheduleTask = async (req, res) => {
    try {
        const { dueDate } = req.body;

        if (!dueDate) {
            return res.status(400).json({
                success: false,
                message: "New due date is required"
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (task.dueDate) {
            task.rescheduleHistory.push({
                from: task.dueDate,
                to: dueDate,
                changedAt: new Date()
            });
        }

        task.dueDate = dueDate;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task rescheduled successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Reschedule Task Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reschedule task"
        });
    }
};


// ==================== ADD SUBTASK ====================

const addSubtask = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subtask title is required"
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        task.subtasks.push({
            title: title.trim()
        });

        await task.save();

        res.status(201).json({
            success: true,
            message: "Subtask added successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Add Subtask Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add subtask"
        });
    }
};


// ==================== UPDATE SUBTASK ====================

const updateSubtask = async (req, res) => {
    try {
        const { title, completed } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const subtask = task.subtasks.id(req.params.subtaskId);

        if (!subtask) {
            return res.status(404).json({
                success: false,
                message: "Subtask not found"
            });
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Subtask title cannot be empty"
                });
            }

            subtask.title = title.trim();
        }

        if (completed !== undefined) {
            subtask.completed = completed;
        }

        await task.save();

        res.status(200).json({
            success: true,
            message: "Subtask updated successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Update Subtask Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update subtask"
        });
    }
};


// ==================== DELETE SUBTASK ====================

const deleteSubtask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const subtask = task.subtasks.id(req.params.subtaskId);

        if (!subtask) {
            return res.status(404).json({
                success: false,
                message: "Subtask not found"
            });
        }

        subtask.deleteOne();

        await task.save();

        res.status(200).json({
            success: true,
            message: "Subtask deleted successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Delete Subtask Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete subtask"
        });
    }
};


// ==================== RECORD RECOVERY ====================

const recordRecovery = async (req, res) => {
    try {
        const { reason, note } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: "Recovery reason is required"
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: getUserId(req)
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        task.recovery = {
            reason,
            note,
            recordedAt: new Date()
        };

        await task.save();

        res.status(200).json({
            success: true,
            message: "Recovery information recorded successfully",
            data: {
                task
            }
        });

    } catch (error) {
        console.error("Record Recovery Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to record recovery information"
        });
    }
};


// ==================== REVIEW TASKS ====================

const getReviewTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: getUserId(req),
            status: {
                $ne: "Completed"
            }
        }).sort({
            dueDate: 1
        });

        const tasksWithHealth = tasks.map(task => {
            const taskObject = task.toObject();

            taskObject.health = calculateTaskHealth(task);

            return taskObject;
        });

        res.status(200).json({
            success: true,
            data: {
                tasks: tasksWithHealth
            }
        });

    } catch (error) {
        console.error("Get Review Tasks Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get review tasks"
        });
    }
};


// ==================== EXPORTS ====================

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    updateStatus,
    rescheduleTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    recordRecovery,
    getReviewTasks
};