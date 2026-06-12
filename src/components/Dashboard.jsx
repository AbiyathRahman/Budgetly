export default function Dashboard(props) {
    const totalBudget = props.envelopes.reduce((sum, env) => sum + env.amount, 0)
    const isNegative = totalBudget < 0

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <p className="text-sm text-grey-500 mb-1">Total Balance</p>
            <p className={`text-4xl font-bold ${isNegative ? "text-red-500" : "text-gray-900"}`}>
                ${totalBudget.toFixed(2)}
            </p>
        </div>
    )
}