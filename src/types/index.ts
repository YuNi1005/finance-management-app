/** 収支のタイプ */
export type TransactionType = 'income' | 'expense';
export type ViewMode = 'gui' | 'cli';

/** 収支の記録の構造 */
export interface Transaction {
  id: string; 
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
}