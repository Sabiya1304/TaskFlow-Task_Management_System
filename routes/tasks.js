const express = require("express");

const {
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
} = require("../controllers/taskController");

const router = express.Router();

// Task CRUD
router.post("/", createTask);

router.get("/", getTasks);

router.get("/review", getReviewTasks);

router.get("/:id", getTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

// Task actions
router.patch("/:id/status", updateStatus);

router.patch("/:id/reschedule", rescheduleTask);

// Subtask actions
router.post("/:id/subtasks", addSubtask);

router.put("/:id/subtasks/:subtaskId", updateSubtask);

router.delete("/:id/subtasks/:subtaskId", deleteSubtask);

// Recovery
router.post("/:id/recovery", recordRecovery);

module.exports = router;