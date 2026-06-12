import { useState } from "react"

export default function TransactionModal({ modal, envelopes, onClose, onSubmit }) {
    const [amount, setAmount] = useState("")
    const [note, setNote] = useState("")
    const [toEnvelopeId, setToEnvelopeId] = useState("")

    const sourceEnvelope = envelopes.find(env => env.id === modal.envelopeId)
    const titles = {
        income: "Add Income",
        expense: "Add Expense",
        transfer: "Transfer Money"
    }
    const buttonStyles = {
        income: "bg-emerald-600 hover:bg-emerald-700",
        expense: "bg-amber-600 hover:bg-amber-700",
        transfer: "bg-slate-600 hover:bg-slate-700"
    }

    function handleSubmit() {
        const parsed = parseFloat(amount)

        // Validation
        if (isNaN(parsed) || parsed <= 0) return
        if (modal.type === 'transfer' && !toEnvelopeId) return
        if (modal.type === 'transfer' && toEnvelopeId === modal.envelopeId) return

        onSubmit({
            type: modal.type,
            amount: parsed,
            envelopeId: modal.envelopeId,
            toEnvelopeId: modal.type === 'transfer' ? toEnvelopeId : null,
            note,
            date: new Date().toISOString().split("T")[0],
        })
        onClose()
    }
    return (
        // Backdrop
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-60" onClick={onClose}>
            {/* Modal */}
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">{titles[modal.type]}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">X</button>
                </div>
                {/* Source Envelope */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {modal.type === 'transfer' ? "From" : "Envelope"}
                    </p>
                    <p className="font-semibold text-slate-800">{sourceEnvelope.name}</p>
                    <p className="text-sm text-slate-500">${sourceEnvelope?.balance.toFixed(2)}</p>
                </div>
                {/* Transfer to destination */}
                {modal.type === 'transfer' && (
                    <div className="flex flex-col gap-2">
                        <label className="text-base font-semibold text-slate-700">To</label>
                        <select
                            value={toEnvelopeId}
                            onChange={e => setToEnvelopeId(e.target.value)}
                            className="border border-slate-200 rounded-xl p-3 text-slate-700 bg-white">
                            <option value="">Select envelope</option>
                            {envelopes.filter(e => e.id !== modal.envelopeId).map(e => (
                                <option key={e.id} value={e.id}>{e.name} (${e.balance.toFixed(2)})</option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Amount Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-slate-700">Amount</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        autoFocus
                    />
                </div>

                {/* Note Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-slate-700">Note (optional)</label>
                    <input
                        type="text"
                        placeholder="What was this for?"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                </div>
                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className={`w-full text-white font-semibold py-3 rounded-xl transition-colors ${buttonStyles[modal.type]}`}>
                    {titles[modal.type]}
                </button>
            </div>
        </div>

    )
}