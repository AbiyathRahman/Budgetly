import EnvelopeCard from "./EnvelopeCard"

const CATEGORIES = ["variable", "fixed", "savings"]

const CATEGORY_LABELS = {
    variable: "Variable",
    fixed: "Fixed",
    savings: "Savings",
}

export default function EnvelopeList({ envelopes, onOpenModal, onSelectEnvelope }) {
    if (envelopes.length === 0) {
        return (
            <p className="text-center text-gray-400 mt-12">
                No envelopes yet. Add one to get started.
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-8 mt-4">
            {CATEGORIES.map(cat => {
                const group = envelopes.filter(e => e.category === cat)
                if (group.length === 0) return null

                const total = group.reduce((sum, e) => sum + e.balance, 0)

                return (
                    <div key={cat}>
                        {/* Section header */}
                        <div className="flex items-baseline justify-between mb-3">
                            <h2 className="text-base font-semibold text-blue-500">
                                {CATEGORY_LABELS[cat]}
                            </h2>
                            <span className="text-sm text-gray-400">
                                ${total.toFixed(2)}
                            </span>
                        </div>

                        {/* 2-column grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {group.map(envelope => (
                                <EnvelopeCard
                                    key={envelope.id}
                                    envelope={envelope}
                                    onOpenModal={onOpenModal}
                                    onSelect={onSelectEnvelope}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}