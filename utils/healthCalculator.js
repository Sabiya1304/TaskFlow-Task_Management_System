const calculateTaskHealth = (task) => {
    if (task.status === 'Completed') return 'ON_TRACK';

    const today = new Date();
    const dueDate = new Date(task.dueDate);
    
    // Reset hours to compare purely by calendar date
    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);

    // Rule 1: Overdue tasks or high postponement count are At Risk
    if (dueDate < today || task.postponeCount >= 3) {
        return 'AT_RISK';
    }

    // Rule 2: Explicitly Blocked statuses or high reschedule rates need attention
    if (task.status === 'Blocked' || task.postponeCount > 0) {
        return 'NEEDS_ATTENTION';
    }

    // Rule 3: Due date approaching within the next 24 hours
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysDiff <= 1 && task.status === 'Not Started') {
        return 'NEEDS_ATTENTION';
    }

    return 'ON_TRACK';
};

module.exports = { calculateTaskHealth };
