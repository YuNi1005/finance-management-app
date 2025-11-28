import React from 'react';
import type { Transaction } from '../types';

interface GUISummaryProps {
  transactions: Transaction[];
  getBalance: () => number;
}

const GUISummary: React.FC<GUISummaryProps> = ({ transactions, getBalance }) => {
  const balance = getBalance();
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const cardClass = "bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700 mb-4";

  return (
    <div className="space-y-4 h-full">
      <div className={cardClass}>
        <h3 className="text-xl font-bold text-indigo-400 mb-2">💰 NET BALANCE</h3>
        <p className={`text-4xl font-extrabold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          ${balance.toLocaleString()}
        </p>
      </div>
      
      <div className={cardClass}>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">INCOME</h3>
        <p className="text-3xl font-bold text-green-400">
          +${totalIncome.toLocaleString()}
        </p>
      </div>

      <div className={cardClass}>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">EXPENSE</h3>
        <p className="text-3xl font-bold text-red-400">
          -${totalExpense.toLocaleString()}
        </p>
      </div>

      <p className="text-xs text-gray-500 pt-2">Use the CLI to add/list transactions.</p>
    </div>
  );
};

export default GUISummary;