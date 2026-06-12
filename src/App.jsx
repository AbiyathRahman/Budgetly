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

  const testEnvelopes = [{
    name: 'Groceries',
    amount: 500,
    spent: 200,
    remaining: 300
  }
    , {
    name: 'Entertainment',
    amount: 300,
    spent: 150,
    remaining: 150
  }]



  return (
    <div className="App">
      <Dashboard />
      <EnvelopeList envelopes={testEnvelopes} />
    </div>
  )
}

