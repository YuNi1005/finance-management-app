import React, { useState } from 'react';
import type { Transaction, TransactionType } from '../types';

interface TransactionFormProps {
  addTransaction: (newTx: Omit<Transaction, 'id'>) => void;
}

// フォームの初期状態を定義
const initialFormState = {
  type: 'expense' as TransactionType,
  category: '',
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0], // 今日の日付を YYYY-MM-DD 形式で設定
};

const CATEGORIES = {
  income: ['Salary', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Rent', 'Bills', 'Entertainment', 'Other'],
};

const TransactionForm: React.FC<TransactionFormProps> = ({ addTransaction }) => {
  const [formData, setFormData] = useState(initialFormState);

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

    addTransaction({
      ...formData,
      amount: formData.amount, // float型であることを保証
    });

    // フォームをリセット
    setFormData(initialFormState);
  };

  const inputClass = "bg-gray-600 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition duration-150";
  const labelClass = "block mb-2 text-sm font-medium text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-700 rounded-lg shadow-inner mb-6 border border-gray-600">
      <h3 className="text-xl font-semibold mb-4 text-indigo-300">New Transaction</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
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
            value={formData.amount}
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
      </div>

      {/* Description (Full Width) */}
      <div className="mt-4">
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

      <button 
        type="submit"
        className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-150 w-full"
      >
        ➕ Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;