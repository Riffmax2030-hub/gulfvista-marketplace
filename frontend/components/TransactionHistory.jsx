import React, { useState, useEffect } from 'react';

export default function TransactionHistory({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const pageSize = 5;

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        skip: (page - 1) * pageSize,
        limit: pageSize,
      });

      if (statusFilter) {
        params.append('status_filter', statusFilter);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/payments/transactions?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-900/20', border: 'border-yellow-700', text: 'text-yellow-400', label: '⏳ Pending' },
      completed: { bg: 'bg-green-900/20', border: 'border-green-700', text: 'text-green-400', label: '✓ Completed' },
      failed: { bg: 'bg-red-900/20', border: 'border-red-700', text: 'text-red-400', label: '✕ Failed' },
      refunded: { bg: 'bg-gray-900/20', border: 'border-gray-700', text: 'text-gray-400', label: '↩️ Refunded' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded text-xs font-semibold ${config.bg} border ${config.border} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-400">⏳ Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-400">❌ {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Filter by Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
        >
          <option value="">All Transactions</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center">
          <span className="text-4xl mb-4">💳</span>
          <h3 className="text-xl font-bold text-white mb-2">No Transactions</h3>
          <p className="text-gray-400">You haven't made any payments yet.</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {transaction.transaction_type.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-500">
                      {formatAmount(transaction.amount_cents)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {transaction.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 border-b border-slate-700 hover:bg-slate-700/30 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-300">{formatDate(transaction.created_at)}</span>
                  {getStatusBadge(transaction.status)}
                </div>
                <p className="text-white font-semibold mb-1">
                  {transaction.transaction_type.replace('_', ' ').toUpperCase()}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-amber-500 font-bold">
                    {formatAmount(transaction.amount_cents)}
                  </span>
                  <span className="text-xs text-gray-500">ID: {transaction.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 transition"
          >
            ← Previous
          </button>
          <span className="text-gray-400">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={transactions.length < pageSize}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
