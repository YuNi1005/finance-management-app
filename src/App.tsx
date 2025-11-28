import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import type { Transaction, ViewMode } from './types';

import CLI from './components/CLI';
import GUIFull from './components/GUIFull';
import GUISummary from './components/GUISummary';

const STORAGE_KEY = 'finance_tracker_data';

const getTransactionsFromLocalStorage = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

function App() {
  // 初期値としてローカルストレージからデータをロード
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactionsFromLocalStorage());
  const [viewMode, setViewMode] = useState<ViewMode>('cli'); 


  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [transactions]); // transactionsが変更されるたびに実行される


  // 2. 共通のデータ操作関数
  const handleAddTransaction = useCallback((newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: uuidv4(), 
    };
    setTransactions(prev => [...prev, tx]);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // 3. 残高計算
  const getBalance = useCallback((): number => {
    return transactions.reduce((balance, t) => {
      return balance + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
  }, [transactions]);

  const handleUpdateTransaction = useCallback((updatedTx: Transaction) => {
    setTransactions(prev => 
      prev.map(t => (t.id === updatedTx.id ? updatedTx : t))
    );
  }, []);

  // 4. モード切り替え
  const toggleViewMode = () => {
    setViewMode(currentMode => (currentMode === 'cli' ? 'gui' : 'cli'));
  };
  
return (
    <div className="h-screen bg-gray-900 text-gray-100 p-6 font-mono overflow-auto">
      <header className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-indigo-400">
          $ Finance Tracker
        </h1>
        <button
          onClick={toggleViewMode}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition duration-150 shadow-md text-sm"
        >
          {viewMode === 'cli' ? '🖥️ GUIモードへ切り替え' : '💻 CLIモードへ切り替え'}
        </button>
      </header>

      <main className="h-[calc(100vh-8rem)]">
        {viewMode === 'cli' ? (
          // CLIモード: 左にサマリーGUI、右にCLIコンソール
          <div className="flex h-full">
            <div className="w-1/3 pr-4 h-full overflow-auto">
              <GUISummary transactions={transactions} getBalance={getBalance} />
            </div>
            <div className="w-2/3 border-l border-gray-700 pl-4 h-full">
              <CLI
                transactions={transactions}
                addTransaction={handleAddTransaction}
                deleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        ) : (
          // GUIモード: 全画面で詳細GUI
          <GUIFull
            transactions={transactions}
            addTransaction={handleAddTransaction}
            deleteTransaction={handleDeleteTransaction}
            updateTransaction={handleUpdateTransaction}
            getBalance={getBalance}
          />
        )}
      </main>
    </div>
  );
}

export default App;