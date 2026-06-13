import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Dashboard from './components/Dashboard'
import EnvelopeList from './components/EnvelopeList'
import TransactionModal from './components/TransactionModal'
import AddEnvelopeModal from './components/AddEnvelopeModal'
import EnvelopeDetail from './components/EnvelopeDetail'

const storageKey = 'budget-app-data'

function loadData() {
  try {
    const data = localStorage.getItem(storageKey)
    const parsed = data ? JSON.parse(data) : { envelopes: [], transactions: [] }
    const envelopes = parsed.envelopes.map(env => ({
      ...env,
      category: env.category ?? "variable"
    }))
    return { envelopes, transactions: parsed.transactions }
  } catch {
    return { envelopes: [], transactions: [] }
  }

}

export default function App() {
  const [envelopes, setEnvelopes] = useState(() => loadData().envelopes)
  const [transactions, setTransactions] = useState(() => loadData().transactions)
  const [modal, setModal] = useState(null)
  const [showAddEnvelope, setShowAddEnvelope] = useState(false)
  const [selectedEnvelope, setSelectedEnvelope] = useState(null)

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

  function handleAddEnvelope(envelope) {
    setEnvelopes(prev => [...prev, envelope])
  }

  function handleEditEnvelope(updatedEnvelope) {
    setEnvelopes(prev => prev.map(env => env.id === updatedEnvelope.id ? updatedEnvelope : env))
    setSelectedEnvelope(updatedEnvelope)
  }
  function handleDeleteEnvelope(envelopeId) {
    setEnvelopes(prev => prev.filter(env => env.id !== envelopeId))
    setTransactions(prev => prev.filter(t => t.envelopeId !== envelopeId && t.toEnvelopeId !== envelopeId))

  }
  return (
    <div className="min-h-screen bg-amber-50 p-4 max-w-md mx-auto">
      <Dashboard envelopes={envelopes} />
      <EnvelopeList
        envelopes={envelopes}
        onOpenModal={setModal}
        onSelectEnvelope={setSelectedEnvelope}
      />
      <button
        onClick={() => setShowAddEnvelope(true)}
        className="fixed bottom-6 right-6 bg-slate-600 text-white w-14 h-14 rounded-full text-2xl shadow-lg hover:bg-slate-700 transition-colors">+</button>

      {modal && (
        <TransactionModal
          modal={modal}
          envelopes={envelopes}
          onClose={() => setModal(null)}
          onSubmit={handleTransaction}
        />
      )}
      {showAddEnvelope && (
        <AddEnvelopeModal
          onClose={() => setShowAddEnvelope(false)}
          onSubmit={handleAddEnvelope}
        />
      )}
      {selectedEnvelope && (
        <EnvelopeDetail
          envelope={envelopes.find(env => env.id === selectedEnvelope.id)}
          transactions={transactions}
          onClose={() => setSelectedEnvelope(null)}
          onOpenModal={setModal}
          onSaveEdit={handleEditEnvelope}
          onDelete={handleDeleteEnvelope}
        />
      )}
    </div>
  )
}

