import { useState } from "react"
import { calcSinkingFund } from "../calcSinkingFund"

const PRESET_COLORS = [
    "#9ca98a", "#8fa882", "#8da8a0", "#c4b5a0",
    "#b8896a", "#a88566", "#96a9a0", "#d9cfc4",
]



export default function EnvelopeDetail({ envelope, transactions, onClose, onOpenModal, onSaveEdit, onDelete }) {
    const fund = calcSinkingFund(envelope.balance, envelope.targetAmount, envelope.dueDate)

    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(envelope.name)
    const [editColor, setEditColor] = useState(envelope.color)

    const envelopeTransactions = transactions.filter(t => t.envelopeId === envelope.id || t.toEnvelopeId === envelope.id).sort((a, b) => new Date(b.Date) - new Date(a.Date))

    const icons = {
        income: { label: "Income", color: "text-emerald-600", bg: "bg-emerald-50", sign: "+" },
        expense: { label: "Expense", color: "text-amber-600", bg: "bg-amber-50", sign: "-" },
        transfer: { label: "Transfer", color: "text-slate-600", bg: "bg-slate-100", sign: "⇄" },
    }

    function handleSaveEdit() {
        if (!editName.trim()) return
        onSaveEdit({
            ...envelope, name: editName.trim(), color: editColor
        })
        setIsEditing(false)
    }

    function handleDelete() {
        if (window.confirm(`Delete envelope "${envelope.name}"? This action cannot be undone.`)) {
            onDelete(envelope.id)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">

            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white">
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&larr;</button>
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: envelope.color }} />
                    <h2 className="font-bold text-slate-800 text-xl">{envelope.name}</h2>
                </div>
                <p className="font-bold text-slate-800 text-2xl">${envelope.balance.toFixed(2)}</p>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-slate-400 hover:text-slate-600 text-sm ml-2"
                >
                    ✎ Edit
                </button>
            </div>

            {/* Edit form — only shows when isEditing is true */}
            {isEditing && (
                <div className="p-4 border-b border-slate-200 flex flex-col gap-3 bg-slate-50">
                    <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                    <div className="flex gap-2 flex-wrap">
                        {PRESET_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => setEditColor(c)}
                                className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: c,
                                    outline: editColor === c ? `3px solid ${c}` : "none",
                                    outlineOffset: "2px",
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            className="flex-1 bg-slate-600 text-white font-medium py-2 rounded-xl hover:bg-slate-700 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-amber-50 text-amber-700 font-medium py-2 rounded-xl hover:bg-amber-100 transition-colors"
                        >
                            Delete Envelope
                        </button>
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 p-4 border-b border-slate-200">
                <button
                    onClick={() => onOpenModal({ type: "income", envelopeId: envelope.id })}
                    className="flex-1 bg-emerald-50 text-emerald-700 text-sm font-medium py-2 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                    + Income
                </button>
                <button
                    onClick={() => onOpenModal({ type: "expense", envelopeId: envelope.id })}
                    className="flex-1 bg-amber-50 text-amber-700 text-sm font-medium py-2 rounded-xl hover:bg-amber-100 transition-colors"
                >
                    − Expense
                </button>
                <button
                    onClick={() => onOpenModal({ type: "transfer", envelopeId: envelope.id })}
                    className="flex-1 bg-slate-100 text-slate-700 text-sm font-medium py-2 rounded-xl hover:bg-slate-200 transition-colors"
                >
                    ⇄ Transfer
                </button>
            </div>

            {fund && !fund.funded && !fund.overdue && (
                <div className="mx-4 mt-2 bg-blue-50 rounded-xl p-3 flex flex-col gap-1">
                    <p className="text-sm font-semibold text-blue-700">Sinking Fund Progress</p>
                    <p className="text-xs text-blue-600">
                        ${envelope.balance.toFixed(2)} saved of ${envelope.targetAmount.toFixed(2)} target
                    </p>
                    <div className="w-full bg-blue-100 rounded-full h-2 mt-1">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((envelope.balance / envelope.targetAmount) * 100, 100)}%` }}
                        />
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                        {fund.daysLeft} days left · save ${fund.perWeek}/week or ${fund.perMonth}/month
                    </p>
                </div>
            )}

            {fund?.funded && (
                <div className="mx-4 mt-2 bg-green-50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-green-700">Goal reached! ✓</p>
                    <p className="text-xs text-green-600">This envelope is fully funded.</p>
                </div>
            )}

            {fund?.overdue && (
                <div className="mx-4 mt-2 bg-red-50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-red-600">Due date passed</p>
                    <p className="text-xs text-red-500">Update the due date to resume tracking.</p>
                </div>
            )}

            {/* Transaction list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {envelopeTransactions.length === 0 ? (
                    <p className="text-center text-slate-400 mt-12">No transactions yet.</p>
                ) : (
                    envelopeTransactions.map(t => {
                        const style = icons[t.type]
                        const isTransferIn = t.type === "transfer" && t.toEnvelopeId === envelope.id
                        const displaySign = t.type === "transfer"
                            ? (isTransferIn ? "+" : "-")
                            : style.sign

                        return (
                            <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl ${style.bg}`}>
                                <div className={`text-lg font-bold w-6 text-center ${style.color}`}>
                                    {displaySign}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${style.color}`}>{style.label}</p>
                                    {t.note && <p className="text-xs text-slate-500">{t.note}</p>}
                                    <p className="text-xs text-slate-400">{t.date}</p>
                                </div>
                                <p className={`font-bold ${style.color}`}>${t.amount.toFixed(2)}</p>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}