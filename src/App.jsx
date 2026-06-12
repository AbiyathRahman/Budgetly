import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Dashboard from './components/Dashboard'
import EnvelopeList from './components/EnvelopeList'

const storageKey = 'budget-app-data'

function loadData() {
  try {
    const data = localStorage.getItem(storageKey)
    return data ? JSON.parse(data) : { envelopes: [], transactions: [] }
  } catch {
    return { envelopes: [], transactions: [] }
  }

}

export default function App() {
  const [envelopes, setEnvelopes] = useState(() => loadData().envelopes)
  const [transactions, setTransactions] = useState(() => loadData().transactions)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ envelopes, transactions }))
  }, [envelopes, transactions])

  function handleTransaction({ type, amount, envelopeId, toEnvelopeId, note, date }) {
    // Build Transaction Record
    const transaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      envelopeId,
      toEnvelopeId,
      note,
      date
    }
    // Update envelope balances
    setEnvelopes(prev => prev.map(env => {
      if (env.id === envelopeId) {
        return {
          ...env,
          balance: type === 'income' ? env.balance + amount : env.balance - amount
        }
      }
      if (type === 'transfer' && env.id === toEnvelopeId) {
        return { ...env, balance: env.balance + amount }
      }
      return env
    }))

    setTransactions(prev => [...prev, transaction])
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Dashboard envelopes={envelopes} />
      <EnvelopeList
        envelopes={envelopes}
        onOpenModal={setModal}
      />
      {modal && (
        <TransactionModal
          modal={modal}
          envelopes={envelopes}
          onClose={() => setModal(null)}
          onSubmit={handleTransaction}
        />
      )}
    </div>
  )
}

