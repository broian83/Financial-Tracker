import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X,
  Home,
  Moon,
  Sun,
  Download,
  Search,
  Calendar
} from 'lucide-react';

const CATEGORIES = {
  income: [
    { value: 'salary', label: 'Gaji' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investasi' },
    { value: 'other-income', label: 'Lainnya' }
  ],
  expense: [
    { value: 'food', label: 'Makanan & Minuman' },
    { value: 'transport', label: 'Transportasi' },
    { value: 'shopping', label: 'Belanja' },
    { value: 'bills', label: 'Tagihan' },
    { value: 'entertainment', label: 'Hiburan' },
    { value: 'health', label: 'Kesehatan' },
    { value: 'education', label: 'Pendidikan' },
    { value: 'other-expense', label: 'Lainnya' }
  ]
};

const FinanceApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');

  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    const savedDarkMode = localStorage.getItem('darkMode');
    if (saved) setTransactions(JSON.parse(saved));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [transactions, darkMode]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      id: Date.now(),
      text,
      amount: type === 'income' ? +amount : -amount,
      type,
      category,
      date: new Date().toISOString()
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
    setShowAddModal(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const balance = income - expense;

  const filteredTransactions = transactions.filter(t => 
    t.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (cat) => {
    const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];
    const found = allCategories.find(c => c.value === cat);
    return found ? found.label : cat;
  };

  const exportData = () => {
    const data = {
      transactions,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catatkeuangan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString('id-ID'),
      t.text,
      getCategoryLabel(t.category),
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.amount
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catatkeuangan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const theme = {
    bg: darkMode ? 'bg-gray-950' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-900' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-800' : 'border-gray-200',
    input: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200',
  };

  return (
    <div className={`min-h-screen ${theme.bg} pb-24 transition-colors duration-300`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} px-6 pt-6 pb-4 border-b ${theme.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${theme.text}`}>CatatKeuangan</h1>
            <p className={`text-sm ${theme.textSecondary}`}>Kelola keuangan dengan mudah</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <button 
              onClick={exportData}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Download size={20} className={theme.textSecondary} />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-blue-50'} rounded-2xl p-5 mb-4`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-blue-600'} mb-1`}>Total Saldo</p>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Rp {balance.toLocaleString('id-ID')}
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Pemasukan: Rp {income.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Pengeluaran: Rp {expense.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'home'
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'transactions'
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Transaksi
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'statistics'
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Statistik
          </button>
        </div>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowAddModal(true)}
                className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-col items-center justify-center hover:opacity-90 transition-opacity`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Plus size={24} className="text-blue-600" />
                </div>
                <span className={`text-sm font-medium ${theme.text}`}>Tambah Transaksi</span>
              </button>
              <button 
                onClick={exportCSV}
                className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-col items-center justify-center hover:opacity-90 transition-opacity`}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Download size={24} className="text-green-600" />
                </div>
                <span className={`text-sm font-medium ${theme.text}`}>Export CSV</span>
              </button>
            </div>

            {/* Recent Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${theme.text}`}>Transaksi Terbaru</h3>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className={`text-sm ${theme.textSecondary} hover:opacity-80`}
                >
                  Lihat semua
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).length === 0 ? (
                  <div className={`${theme.card} p-8 rounded-xl border ${theme.border} text-center`}>
                    <p className={`${theme.textSecondary} text-sm`}>Belum ada transaksi</p>
                    <p className={`text-xs ${theme.textSecondary} mt-1`}>Tap tombol + untuk menambah</p>
                  </div>
                ) : (
                  transactions.slice(0, 5).map(t => (
                    <div key={t.id} className={`${theme.card} p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          t.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {t.amount > 0 ? (
                            <ArrowDownLeft size={18} className="text-green-600" />
                          ) : (
                            <ArrowUpRight size={18} className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${theme.text} text-sm`}>{t.text}</p>
                          <p className={`text-xs ${theme.textSecondary}`}>{getCategoryLabel(t.category)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {t.amount > 0 ? '+' : '-'} Rp {Math.abs(t.amount).toLocaleString('id-ID')}
                        </p>
                        <p className={`text-xs ${theme.textSecondary}`}>
                          {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.textSecondary}`} size={20} />
              <input
                type="text"
                placeholder="Cari transaksi..."
                className={`w-full pl-12 pr-4 py-3 ${theme.input} border ${theme.border} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme.text}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className={`${theme.card} p-8 rounded-xl border ${theme.border} text-center`}>
                  <p className={`${theme.textSecondary} text-sm`}>Tidak ada transaksi ditemukan</p>
                </div>
              ) : (
                filteredTransactions.map(t => (
                  <div key={t.id} className={`${theme.card} p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        t.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {t.amount > 0 ? (
                          <ArrowDownLeft size={18} className="text-green-600" />
                        ) : (
                          <ArrowUpRight size={18} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${theme.text} text-sm`}>{t.text}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${theme.textSecondary}`}>{getCategoryLabel(t.category)}</span>
                          <span className={`text-xs ${theme.textSecondary}`}>•</span>
                          <span className={`text-xs ${theme.textSecondary}`}>
                            {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-bold text-sm ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {t.amount > 0 ? '+' : '-'} Rp {Math.abs(t.amount).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className={`${theme.textSecondary} hover:text-red-500 transition-colors`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`${theme.card} p-4 rounded-xl border ${theme.border} text-center`}>
                <p className={`text-xs ${theme.textSecondary} mb-1`}>Saldo</p>
                <p className={`text-lg font-bold ${theme.text}`}>Rp {(balance / 1000).toFixed(0)}k</p>
              </div>
              <div className={`${theme.card} p-4 rounded-xl border ${theme.border} text-center`}>
                <p className={`text-xs ${theme.textSecondary} mb-1`}>Masuk</p>
                <p className="text-lg font-bold text-green-600">Rp {(income / 1000).toFixed(0)}k</p>
              </div>
              <div className={`${theme.card} p-4 rounded-xl border ${theme.border} text-center`}>
                <p className={`text-xs ${theme.textSecondary} mb-1`}>Keluar</p>
                <p className="text-lg font-bold text-red-600">Rp {(expense / 1000).toFixed(0)}k</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className={`${theme.card} p-5 rounded-xl border ${theme.border}`}>
              <h3 className={`font-bold ${theme.text} mb-4`}>Pengeluaran per Kategori</h3>
              {CATEGORIES.expense.map(cat => {
                const total = transactions
                  .filter(t => t.amount < 0 && t.category === cat.value)
                  .reduce((acc, t) => acc + Math.abs(t.amount), 0);
                const percentage = expense > 0 ? (total / expense * 100).toFixed(1) : 0;
                
                if (total === 0) return null;
                
                return (
                  <div key={cat.value} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${theme.text}`}>{cat.label}</span>
                      <span className={`text-sm font-semibold ${theme.text}`}>
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs ${theme.textSecondary} mt-1`}>{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className={`${theme.card} w-full rounded-t-3xl p-6 animate-slide-up`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${theme.text}`}>Tambah Transaksi</h2>
              <button onClick={() => setShowAddModal(false)} className={`${theme.textSecondary} hover:opacity-70`}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={addTransaction} className="space-y-5">
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategory('salary');
                  }}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    type === 'income'
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <ArrowDownLeft className="mx-auto mb-2" size={24} />
                  Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategory('food');
                  }}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <ArrowUpRight className="mx-auto mb-2" size={24} />
                  Pengeluaran
                </button>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>Kategori</label>
                <select
                  className={`w-full px-4 py-3 ${theme.input} border ${theme.border} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme.text}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES[type].map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>Deskripsi</label>
                <input
                  type="text"
                  placeholder="Contoh: Makan siang"
                  className={`w-full px-4 py-3 ${theme.input} border ${theme.border} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none ${theme.text}`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>Jumlah</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.textSecondary} font-medium`}>Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    className={`w-full pl-12 pr-4 py-3 ${theme.input} border ${theme.border} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-semibold ${theme.text}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Submit */}
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Simpan Transaksi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'home' ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-medium">Beranda</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center -mt-6 shadow-lg"
          >
            <Plus size={28} className="text-white" />
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'transactions' ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs font-medium">Transaksi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceApp;
