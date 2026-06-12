export default function EnvelopeCard(props) {
    return (
        <div>
            <h2>{props.name}</h2>
            <p>Amount: ${props.amount.toFixed(2)}</p>
            <p>Spent: ${props.spent.toFixed(2)}</p>
            <p>Remaining: ${props.remaining.toFixed(2)}</p>
        </div>
    )
}