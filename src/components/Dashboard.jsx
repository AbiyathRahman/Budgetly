export default function Dashboard(props) {
    const totalBudget = props.envelopes.reduce((sum, env) => sum + env.balance, 0)
    const isNegative = totalBudget < 0

    return (
        <>
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Hewwo Kelly!</h1>
                <p className="text-slate-600 text-base leading-relaxed">Here's a summary of your budget</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-amber-100">
                <p className="text-sm text-slate-500 mb-2 font-medium uppercase tracking-wide">Total Balance</p>
                <p className={`text-5xl font-bold ${isNegative ? "text-amber-600" : "text-slate-800"}`}>
                    ${totalBudget.toFixed(2)}
                </p>
            </div>
        </>
    )
}