import React, { useState } from 'react';
import type { Transaction, TransactionType } from '../types';

interface TransactionEditModalProps {
  transaction: Transaction;
  updateTransaction: (updatedTx: Transaction) => void;
  onClose: () => void;
}

const CATEGORIES = {
  income: ['Salary', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Rent', 'Bills', 'Entertainment', 'Other'],
};

const TransactionEditModal: React.FC<TransactionEditModalProps> = ({ transaction, updateTransaction, onClose }) => {
  // 編集中のトランザクションデータで初期化
  const [formData, setFormData] = useState<Transaction>({
    ...transaction,
    // amountは文字列として扱うフォームもあるため、数値型を明示的にキャスト
    amount: transaction.amount 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };
  
  // 収支タイプ (income/expense) が切り替わったらカテゴリをリセット
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value as TransactionType,
      category: '', // カテゴリをリセット
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0 || !formData.category || formData.date === '') {
      alert('金額、カテゴリ、日付を入力してください。');
      return;
    }

    // 💡 App.tsxから渡された更新関数を呼び出す
    updateTransaction(formData);
    
    // モーダルを閉じる
    onClose();
  };

  const inputClass = "bg-gray-600 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition duration-150";
  const labelClass = "block mb-2 text-sm font-medium text-gray-300";

  return (
    // モーダルの背景（オーバーレイ）
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center">
      {/* モーダル本体 */}
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3 shadow-2xl border border-gray-700 animate-fadeIn">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-300 border-b border-gray-700 pb-2">Edit Transaction</h3>
        
        <form onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 gap-4">
            
            {/* Type */}
            <div>
              <label htmlFor="type" className={labelClass}>Type</label>
              <select 
                id="type"
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                className={inputClass}
              >
                <option value="income">Income (収入)</option>
                <option value="expense">Expense (支出)</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className={labelClass}>Amount ($)</label>
              <input 
                type="number"
                id="amount"
                name="amount"
                // number型のinputに設定するため、文字列に変換
                value={formData.amount.toString()} 
                onChange={handleChange}
                className={inputClass}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className={labelClass}>Date</label>
              <input 
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className={labelClass}>Category</label>
              <select 
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="" disabled>Select Category</option>
                {CATEGORIES[formData.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Description */}
            <div className="col-span-1">
              <label htmlFor="description" className={labelClass}>Description</label>
              <input 
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={inputClass}
                placeholder="Optional notes for the transaction..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition duration-150"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-150"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionEditModal;