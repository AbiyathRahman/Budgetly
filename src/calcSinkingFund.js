export function calcSinkingFund(balance, targetAmount, dueDate) {
    if (!targetAmount || !dueDate) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 0) return { overdue: true }

    const remaining = targetAmount - balance
    if (remaining <= 0) return { funded: true }

    const weeksLeft = Math.ceil(daysLeft / 7)
    const monthsLeft = Math.ceil(daysLeft / 30)

    return {
        overdue: false,
        funded: false,
        daysLeft,
        remaining: remaining.toFixed(2),
        perWeek: (remaining / weeksLeft).toFixed(2),
        perMonth: (remaining / monthsLeft).toFixed(2)
    }
}