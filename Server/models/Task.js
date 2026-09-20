const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: true
    }
);

const rescheduleSchema = new mongoose.Schema(
    {
        from: {
            type: Date,
            required: true
        },

        to: {
            type: Date,
            required: true
        },

        changedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const recoverySchema = new mongoose.Schema(
    {
        reason: {
            type: String,
            enum: [
                "too_difficult",
                "too_much_work",
                "dont_know_where_to_start",
                "waiting_for_someone",
                "blocked",
                "no_longer_needed",
                "other"
            ]
        },

        note: {
            type: String,
            trim: true,
            maxlength: 500
        },

        recordedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        dueDate: {
            type: Date
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Not Started",
                "In Progress",
                "Waiting",
                "Blocked",
                "Completed"
            ],
            default: "Not Started"
        },

        subtasks: {
            type: [subtaskSchema],
            default: []
        },

        rescheduleHistory: {
            type: [rescheduleSchema],
            default: []
        },

        recovery: {
            type: recoverySchema,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);