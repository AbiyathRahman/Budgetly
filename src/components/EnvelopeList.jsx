import EnvelopeCard from "./EnvelopeCard"

export default function EnvelopeList({ envelopes, onOpenModal, onOpenEnvelopeDetail }) {
    if (envelopes.length === 0) {
        return (
            <p className="text-center text-slate-400 mt-12">No envelopes yet. Start by creating one!</p>
        )
    }
    return (
        <div className="grid grid cols-1 gap-4 mt-4">
            {envelopes.map(env => (
                <EnvelopeCard key={env.id} envelope={env} onOpenModal={onOpenModal} onSelect={onOpenEnvelopeDetail} />
            ))}
        </div>
    )
}