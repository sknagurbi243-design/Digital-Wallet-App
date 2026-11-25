import { useState } from 'react'
import { WalletContext } from './walletContextValue'
import { mockTransactions } from '../data/mockTransactions'

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.error(`Unable to read ${key} from localStorage`, error)
    return fallback
  }
}

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(() => read('luma-balance', 8420.5))
  const [transactions, setTransactions] = useState(() => read('luma-transactions', mockTransactions))
  const [user, setUser] = useState(() => read('luma-user', { name: 'Olivia Rhye', email: 'olivia@example.com', phone: '+1 (415) 555-0132' }))
  const [authenticated, setAuthenticated] = useState(() => read('luma-auth', false))

  const persist = (key, value) => localStorage.setItem(key, JSON.stringify(value))
  const addTransaction = (transaction) => {
    const entry = {
      id: `DEMO-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      status: 'Completed',
      ...transaction,
    }
    const next = [entry, ...transactions]
    setTransactions(next)
    persist('luma-transactions', next)
    const updatedBalance = balance + (entry.kind === 'income' ? entry.amount : -entry.amount)
    setBalance(updatedBalance)
    persist('luma-balance', updatedBalance)
    return entry
  }
  const updateUser = (nextUser) => {
    setUser(nextUser)
    persist('luma-user', nextUser)
  }
  const login = (email, name, phone) => {
    const nextUser = { ...user, email, name: name || (email.split('@')[0] || 'Wallet user').replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()), ...(phone ? { phone } : {}) }
    updateUser(nextUser)
    setAuthenticated(true)
    persist('luma-auth', true)
  }
  const logout = () => {
    setAuthenticated(false)
    persist('luma-auth', false)
  }
  const value = { balance, transactions, user, authenticated, addTransaction, updateUser, login, logout }
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
