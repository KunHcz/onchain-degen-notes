import { useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { useTradesStore } from '../../stores';
import type { Trade } from '../../data/notes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

function AddTradeModal({
  isOpen,
  onClose,
  onAdd
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trade: Omit<Trade, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    token: '',
    chain: 'solana' as Trade['chain'],
    contract: '',
    buyPrice: '',
    amount: '',
    notes: '',
    emotion: 'neutral' as Trade['emotion'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      date: Date.now(),
      token: formData.token,
      chain: formData.chain,
      contract: formData.contract,
      buyPrice: parseFloat(formData.buyPrice),
      amount: parseFloat(formData.amount),
      status: 'open',
      notes: formData.notes,
      emotion: formData.emotion,
    });
    setFormData({
      token: '',
      chain: 'solana',
      contract: '',
      buyPrice: '',
      amount: '',
      notes: '',
      emotion: 'neutral',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-nebula border border-plasma-blue/30 rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="font-space text-xl text-starlight mb-4">Add Trade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-starlight/50 block mb-1">Token Name</label>
            <input
              type="text"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              className="w-full bg-void border border-plasma-blue/30 rounded-lg px-3 py-2 text-starlight font-mono focus:border-plasma-blue outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-starlight/50 block mb-1">Chain</label>
              <select
                value={formData.chain}
                onChange={(e) => setFormData({ ...formData, chain: e.target.value as Trade['chain'] })}
                className="w-full bg-void border border-plasma-blue/30 rounded-lg px-3 py-2 text-starlight font-mono focus:border-plasma-blue outline-none"
              >
                <option value="solana">Solana</option>
                <option value="bsc">BSC</option>
                <option value="base">Base</option>
                <option value="eth">Ethereum</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-starlight/50 block mb-1">Emotion</label>
              <select
                value={formData.emotion}
                onChange={(e) => setFormData({ ...formData, emotion: e.target.value as Trade['emotion'] })}
                className="w-full bg-void border border-plasma-blue/30 rounded-lg px-3 py-2 text-starlight font-mono focus:border-plasma-blue outline-none"
              >
                <option value="confident">Confident</option>
                <option value="neutral">Neutral</option>
                <option value="fomo">FOMO</option>
                <option value="fear">Fear</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-starlight/50 block mb-1">Buy Price ($)</label>
              <input
                type="number"
                step="0.000001"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                className="w-full bg-void border border-plasma-blue/30 rounded-lg px-3 py-2 text-starlight font-mono focus:border-plasma-blue outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs text-starlight/50 block mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-void border border-plasma-blue/30 rounded-lg px-3 py-2 text-starlight font-mono focus:border-plasma-blue outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-starlight/50 block mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-void border border-plasma-blue/30 rounded-lg px-3 py-2 text-starlight font-mono focus:border-plasma-blue outline-none h-20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-starlight/30 rounded-lg text-starlight/70 hover:text-starlight hover:border-starlight/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-plasma-blue/20 border border-plasma-blue rounded-lg text-plasma-blue hover:bg-plasma-blue/30 transition-all"
            >
              Add Trade
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function TradingDashboard() {
  const { trades, addTrade, closeTrade, getTradeStats } = useTradesStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const stats = getTradeStats();

  // Prepare chart data
  const closedTrades = trades.filter(t => t.status === 'closed');
  const cumulativePnl = closedTrades.reduce((acc: number[], trade) => {
    const lastValue = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(lastValue + (trade.pnl || 0));
    return acc;
  }, []);

  const pnlChartData = {
    labels: closedTrades.map((_, i) => `Trade ${i + 1}`),
    datasets: [
      {
        label: 'Cumulative P&L',
        data: cumulativePnl,
        borderColor: cumulativePnl[cumulativePnl.length - 1] >= 0 ? '#00ff88' : '#ff6b9d',
        backgroundColor: cumulativePnl[cumulativePnl.length - 1] >= 0
          ? 'rgba(0, 255, 136, 0.1)'
          : 'rgba(255, 107, 157, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chainDistribution = {
    labels: ['Solana', 'BSC', 'Base', 'ETH'],
    datasets: [
      {
        data: [
          trades.filter(t => t.chain === 'solana').length,
          trades.filter(t => t.chain === 'bsc').length,
          trades.filter(t => t.chain === 'base').length,
          trades.filter(t => t.chain === 'eth').length,
        ],
        backgroundColor: ['#00d4ff', '#ffd700', '#00ff88', '#ff6b9d'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 212, 255, 0.1)' },
        ticks: { color: 'rgba(234, 234, 234, 0.5)' },
      },
      y: {
        grid: { color: 'rgba(0, 212, 255, 0.1)' },
        ticks: { color: 'rgba(234, 234, 234, 0.5)' },
      },
    },
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="font-space text-3xl gradient-text mb-2">Trading Dashboard</h1>
          <p className="text-starlight/50 font-mono text-sm">
            Track your trades and analyze performance
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-plasma-blue/20 border border-plasma-blue rounded-lg font-space text-plasma-blue hover:bg-plasma-blue/30 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>+</span> Add Trade
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Trades', value: stats.totalTrades, color: 'plasma-blue', icon: '📊' },
          { label: 'Open Trades', value: stats.openTrades, color: 'solar-gold', icon: '📈' },
          { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%`, color: 'matrix-green', icon: '🎯' },
          {
            label: 'Total P&L',
            value: `$${stats.totalPnl.toFixed(2)}`,
            color: stats.totalPnl >= 0 ? 'matrix-green' : 'nova-pink',
            icon: stats.totalPnl >= 0 ? '💰' : '📉'
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-xs text-starlight/50">{stat.label}</span>
            </div>
            <div className={`font-orbitron text-2xl text-${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* P&L Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-xl p-4"
        >
          <h3 className="font-space text-sm text-starlight mb-4">Cumulative P&L</h3>
          <div className="h-64">
            {closedTrades.length > 0 ? (
              <Line data={pnlChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-starlight/30">
                No closed trades yet
              </div>
            )}
          </div>
        </motion.div>

        {/* Chain Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-4"
        >
          <h3 className="font-space text-sm text-starlight mb-4">Chain Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {trades.length > 0 ? (
              <Doughnut
                data={chainDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: 'rgba(234, 234, 234, 0.7)' }
                    }
                  }
                }}
              />
            ) : (
              <div className="text-starlight/30">No trades yet</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Trade List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-plasma-blue/20">
          <h3 className="font-space text-sm text-starlight">Recent Trades</h3>
        </div>

        {trades.length === 0 ? (
          <div className="p-8 text-center text-starlight/30">
            <span className="text-4xl block mb-2">📝</span>
            No trades recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-starlight/50 border-b border-plasma-blue/20">
                  <th className="text-left p-3">Token</th>
                  <th className="text-left p-3">Chain</th>
                  <th className="text-left p-3">Buy Price</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">P&L</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice().reverse().map((trade) => (
                  <tr key={trade.id} className="border-b border-plasma-blue/10 hover:bg-plasma-blue/5">
                    <td className="p-3">
                      <div className="font-mono text-starlight">{trade.token}</div>
                      <div className="text-xs text-starlight/50">
                        {new Date(trade.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.chain === 'solana' ? 'bg-plasma-blue/20 text-plasma-blue' :
                        trade.chain === 'bsc' ? 'bg-solar-gold/20 text-solar-gold' :
                        'bg-matrix-green/20 text-matrix-green'
                      }`}>
                        {trade.chain.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-starlight">${trade.buyPrice}</td>
                    <td className="p-3 font-mono text-starlight">${trade.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.status === 'open'
                          ? 'bg-solar-gold/20 text-solar-gold'
                          : 'bg-starlight/10 text-starlight/50'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {trade.pnl !== undefined ? (
                        <span className={`font-orbitron ${
                          trade.pnl >= 0 ? 'text-matrix-green' : 'text-nova-pink'
                        }`}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                          <span className="text-xs ml-1">
                            ({trade.pnlPercent?.toFixed(1)}%)
                          </span>
                        </span>
                      ) : (
                        <span className="text-starlight/30">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {trade.status === 'open' && (
                        <button
                          onClick={() => {
                            const sellPrice = prompt('Enter sell price:');
                            if (sellPrice) {
                              closeTrade(trade.id, parseFloat(sellPrice));
                            }
                          }}
                          className="px-2 py-1 text-xs bg-nova-pink/20 text-nova-pink rounded hover:bg-nova-pink/30 transition-all"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add Trade Modal */}
      <AddTradeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTrade}
      />
    </div>
  );
}
