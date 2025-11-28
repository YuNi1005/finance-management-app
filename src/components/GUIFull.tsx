import React, { useState } from 'react';
import type { Transaction } from '../types';
import TransactionForm from './TransactionForm';
import TransactionEditModal from './TransactionEditModal';

interface GUIFullProps {
  transactions: Transaction[];
  addTransaction: (newTx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (updatedTx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getBalance: () => number;
}

const GUIFull: React.FC<GUIFullProps> = ({ transactions, addTransaction, deleteTransaction,updateTransaction, getBalance }) => {
  const balance = getBalance();

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // 編集開始ハンドラ
  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
  };
  
  // 編集終了ハンドラ（モーダルを閉じる）
  const handleCloseModal = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl h-full flex flex-col">
      <h2 className="text-3xl font-bold text-indigo-300 mb-4">Full Graphical Interface</h2>
      
      {/* 簡易残高表示 */}
      <div className="mb-6 p-4 rounded-lg border border-gray-700 bg-gray-700">
        <span className="text-xl text-gray-300">Current Balance: </span>
        <span className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ${balance.toLocaleString()}
        </span>
      </div>

      {/* 💡 フォームの追加 */}
      <TransactionForm addTransaction={addTransaction} /> 
      
      {/* 簡易トランザクションリスト */}
      <div className="flex-grow overflow-y-auto pt-4"> {/* 上部にパディング追加 */}
        <h3 className="text-xl font-semibold mb-3 text-gray-300">Transaction History</h3>
        <div className="space-y-2">
          {transactions.slice().reverse().map((tx) => ( // 全件表示、降順
            <div 
              key={tx.id} 
              className="flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-150"
            >
              <div className="flex-1">
                <p className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.date} - {tx.type.toUpperCase()}: {tx.category}
                </p>
                <p className="text-sm text-gray-400">{tx.description.substring(0, 50)}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold">
                  {tx.type === 'income' ? '+' : '-'} ${tx.amount.toLocaleString()}
                </p>
                <button 
                  onClick={() => handleEdit(tx)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs"
                >
                  [Edit]
                </button>
                <button 
                  onClick={() => deleteTransaction(tx.id)}
                  className="text-red-500 hover:text-red-400 text-xs ml-4"
                >
                  [Delete]
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingTransaction && (
        <TransactionEditModal 
          transaction={editingTransaction}
          updateTransaction={updateTransaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default GUIFull;