const calculateTaskHealth = (task) => {
    // Completed tasks are not at risk
    if (task.status === "Completed") {
        return "ON_TRACK";
    }

    // Overdue task
    if (task.dueDate) {
        const today = new Date();

        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const dueDate = new Date(task.dueDate);

        if (dueDate < startOfToday) {
            return "AT_RISK";
        }
    }

    // Repeatedly postponed task
    if (
        task.rescheduleHistory &&
        task.rescheduleHistory.length >= 2
    ) {
        return "AT_RISK";
    }

    // Blocked or waiting task
    if (
        task.status === "Blocked" ||
        task.status === "Waiting"
    ) {
        return "NEEDS_ATTENTION";
    }

    // Recovery information exists
    if (task.recovery) {
        return "NEEDS_ATTENTION";
    }

    // Due date is approaching
    if (task.dueDate) {
        const today = new Date();

        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const dueDate = new Date(task.dueDate);

        const differenceInTime =
            dueDate.getTime() - startOfToday.getTime();

        const differenceInDays =
            differenceInTime / (1000 * 60 * 60 * 24);

        if (differenceInDays <= 2) {
            return "NEEDS_ATTENTION";
        }
    }

    // Normal task
    return "ON_TRACK";
};


module.exports = calculateTaskHealth;