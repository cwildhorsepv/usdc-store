import { useEffect, useState } from 'react'
import { API } from '@/api'
import type { Wallet } from '@/types/api'

export default function DashboardPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.Wallet.get('usr_carlos')
      .then((w) => setWallet(w))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <main className="p-6 text-gray-300">
        <p>Loading wallet...</p>
      </main>
    )

  if (!wallet)
    return (
      <main className="p-6 text-gray-300">
        <p>No wallet found.</p>
      </main>
    )

  return (
    <main className="p-8 text-gray-200 bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Wallet Dashboard</h1>

      {/* Wallet Summary */}
      <section className="bg-gray-900 rounded-xl p-5 mb-8 shadow-md border border-gray-800">
        <h2 className="text-xl font-semibold mb-2">Wallet Summary</h2>
        <p className="text-gray-500 text-sm">Wallet ID: {wallet.id}</p>
        <p className="text-lg mt-3">
          Total Balance:{' '}
          <span className="font-mono text-blue-400">
            {wallet.totalBalance.toFixed(2)}
          </span>
        </p>
      </section>

      {/* Viewports */}
      {wallet.viewports.map((viewport) => (
        <section
          key={viewport.id}
          className="bg-gray-900 rounded-xl p-5 mb-8 border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-3">{viewport.name}</h3>

          <div className="mb-5">
            <h4 className="text-md font-semibold m
