import EnvelopeCard from "./EnvelopeCard"

export default function EnvelopeList(props) {
    return (
        <div>
            <h1>Envelope List</h1>
            {props.envelopes.map(envelope => (
                <EnvelopeCard key={envelope.name} {...envelope} />
            ))}
        </div>
    )
}