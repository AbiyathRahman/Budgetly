import { useState } from "react"

export default function TransactionModal({ modal, envelopes, onClose, onSubmit }) {
    const [amount, setAmount] = useState("")
    const [note, setNote] = useState("")
    const [toEnvelopeId, setToEnvelopeId] = useState("")

    const sourceEnvelope = enevelopes.find(env => env.id === modal.envelopeId)
    const titles = {
        income: "Add Income",
        expense: "Add Expense",
        transfer: "Transfer Money"
    }
    const buttonStyles = {
        income: "bg-green500 hover:bg-green-600",
        expense: "bg-red-500 hover:bg-red-600",
        transfer: "bg-blue-500 hover:bg-blue-600"
    }

    function handleSubmit() {
        const parsed = parseFloat(amount)

        // Validation
        if (isNan(parsed) || parsed <= 0) return
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
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50" onClick={onClose}>
            {/* Modal */}
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">{titles[modal.type]}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">X</button>
                </div>
                {/* Source Envelope */}
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">
                        {modal.type === 'transfer' ? "From" : "Envelope"}
                    </p>
                    <p className="font-semibold text-gray-800">{sourceEnvelope.name}</p>
                    <p className="text-sm text-gray-500">${sourceEnvelope?.balance.toFixed(2)}</p>
                </div>
                {/* Transfer to destination */}
                {modal.type === 'transfer' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">To</label>
                        <select
                            value={toEnvelopeId}
                            onChange={e => setToEnvelopeId(e.target.value)}
                            className="border border-gray-200 rounded-xl p-3 text-gray-800 bg-white">
                            <option value="">Select envelope</option>
                            {envelopes.filter(e => e.id !== modal.envelopeId).map(e => (
                                <option key={e.id} value={e.id}>{e.name} (${e.balance.toFixed(2)})</option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Amount Input */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Note (optional)</label>
                    <input
                        type="text"
                        placeholder="What was this for?"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300" />
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