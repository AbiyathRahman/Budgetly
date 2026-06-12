import { useState } from 'react';

const PRESET_COLORS = [
    "#9ca98a", // sage green
    "#8fa882", // muted green
    "#8da8a0", // muted teal
    "#c4b5a0", // warm beige
    "#b8896a", // warm terracotta
    "#a88566", // muted terracotta
    "#96a9a0", // soft blue-green
    "#d9cfc4", // soft taupe
]

export default function AddEnvelopeModal({ onClose, onSubmit }) {
    const [name, setName] = useState('')
    const [balance, setBalance] = useState('')
    const [color, setColor] = useState(PRESET_COLORS[0])
    const [targetAmount, setTargetAmount] = useState('')
    const [dueDate, setDueDate] = useState('')

    function handleSubmit() {
        if (!name.trim()) return

        onSubmit({
            id: crypto.randomUUID(),
            name: name.trim(),
            balance: parseFloat(balance) || 0,
            color,
            targetAmount: parseFloat(targetAmount) || null,
            dueDate: dueDate || null,
        })
        onClose()
    }
    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">New Envelope</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">\u2715</button>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-slate-700">Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Groceries, Rent, Fun"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        autoFocus
                    />
                </div>

                {/* Starting balance */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold text-slate-700">Starting Balance (optional)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={balance}
                        onChange={e => setBalance(e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                </div>

                {/* Sinking fund section */}
                <div className="border border-gray-100 rounded-xl p-3 flex flex-col gap-3">
                    <p className="text-sm font-semibold text-gray-700">Sinking Fund (optional)</p>
                    <p className="text-xs text-gray-400">Set a target and due date to see how much to save per period.</p>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Target Amount</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g. 600.00"
                            value={targetAmount}
                            onChange={e => setTargetAmount(e.target.value)}
                            className="border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            className="border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                </div>

                {/* Color picker */}
                <div className="flex flex-col gap-3">
                    <label className="text-base font-semibold text-slate-700">Color</label>
                    <div className="flex gap-2 flex-wrap">
                        {PRESET_COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: c,
                                    outline: color === c ? `3px solid ${c}` : "none",
                                    outlineOffset: "2px",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2 border border-slate-200">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="font-semibold text-slate-800 text-base">
                        {name.trim() || "Envelope name"}
                    </p>
                    <p className="ml-auto text-sm text-slate-500">
                        ${parseFloat(balance || 0).toFixed(2)}
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-slate-600 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition-colors"
                >
                    Create Envelope
                </button>
            </div>
        </div>
    )
}