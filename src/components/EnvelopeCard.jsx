export default function EnvelopeCard({ envelope, onOpenModal }) {
    const { id, name, balance, color } = envelope;
    const isNegative = balance < 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">

            {/* Envelope header */}
            <div className="flex items-center gap-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                />
                <h2 className="font-semibold text-gray-800 text-sm">{name}</h2>
            </div>

            {/* Balance */}
            <p className={`text-2xl font-bold ${isNegative ? "text-red-500" : "text-gray-900"}`}>
                ${balance.toFixed(2)}
            </p>

            {/* Action buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onOpenModal({ type: "income", envelopeId: id })}
                    className="flex-1 bg-green-100 text-green-700 text-sm font-medium py-1.5 rounded-xl hover:bg-green-200 transition-colors"
                >
                    + Income
                </button>
                <button
                    onClick={() => onOpenModal({ type: "expense", envelopeId: id })}
                    className="flex-1 bg-red-100 text-red-700 text-sm font-medium py-1.5 rounded-xl hover:bg-red-200 transition-colors"
                >
                    − Expense
                </button>
                <button
                    onClick={() => onOpenModal({ type: "transfer", envelopeId: id })}
                    className="flex-1 bg-blue-100 text-blue-700 text-sm font-medium py-1.5 rounded-xl hover:bg-blue-200 transition-colors"
                >
                    ⇄ Transfer
                </button>
            </div>

        </div>
    )
}