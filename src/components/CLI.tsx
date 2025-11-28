import React, { useState, useRef, useEffect } from 'react';
import type { Transaction, TransactionType } from '../types';

interface CLIProps {
  transactions: Transaction[];
  addTransaction: (newTx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const formatList = (txs: Transaction[], filter: 'all' | TransactionType): React.ReactNode => {
  const filteredTxs = txs.filter(t => filter === 'all' || t.type === filter);
  
  if (filteredTxs.length === 0) {
    return <span className="text-yellow-400">No transactions found for type: {filter}.</span>;
  }

  // Tailwind Gridを使用して整形
  const formatAmount = (amount: number, type: TransactionType) => (
      <span className={type === 'income' ? 'text-green-400' : 'text-red-400'}>
          {type === 'income' ? '+' : '-'} ${amount.toLocaleString()}
      </span>
  );

  return (
    <div className="font-mono text-xs md:text-sm overflow-x-auto border border-gray-700 rounded p-2">
      <div className="grid grid-cols-[60px_1fr_100px_100px_2fr] font-bold border-b border-gray-600 pb-1 mb-1 text-gray-400">
        <span>ID</span>
        <span>DATE</span>
        <span>TYPE</span>
        <span>AMOUNT</span>
        <span>CATEGORY</span>
      </div>
      {filteredTxs.slice(-10).reverse().map((tx) => ( // 最新の10件を表示
        <div key={tx.id} className="grid grid-cols-[60px_1fr_100px_100px_2fr] border-b border-gray-800 py-0.5">
          <span className="text-gray-500">{tx.id.slice(0, 4)}...</span>
          <span>{tx.date}</span>
          <span>{tx.type.toUpperCase()}</span>
          {formatAmount(tx.amount, tx.type)}
          <span className="text-gray-300 truncate">{tx.category}</span>
        </div>
      ))}
      <div className="mt-2 text-gray-500 text-xs">Showing latest {filteredTxs.length > 10 ? 10 : filteredTxs.length} records.</div>
    </div>
  );
};

// CLIコンポーネント本体
const CLI: React.FC<CLIProps> = ({ transactions, addTransaction, deleteTransaction }) => {
  const [history, setHistory] = useState<string[]>([]); // 入力履歴 ($ コマンド)
  const [output, setOutput] = useState<React.ReactNode[]>([]); // コマンドの出力結果
  const [input, setInput] = useState<string>('');
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 常に最下部にスクロール
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, output]);

  const processCommand = (command: string) => {
    // 履歴に追加 ($ コマンド)
    setHistory(prev => [...prev, `$ ${command}`]);
    let newOutput: React.ReactNode = null;
    const parts = command.trim().toLowerCase().split(/\s+/);
    const action = parts[0];

    try {
      switch (action) {
        case 'add':
          // 構文: add <type> <amount> <category> [-d <description>]
          const [, type, amountStr, category, ...rest] = parts;
          const amount = parseFloat(amountStr);
          // '-d'フラグを検出し、残りを説明文として取得
          const descIndex = rest.findIndex(p => p === '-d');
          const descriptionParts = descIndex !== -1 ? rest.slice(descIndex + 1) : [];
          const description = descriptionParts.length > 0 ? descriptionParts.join(' ') : 'No description';


          if (!['income', 'expense'].includes(type) || isNaN(amount) || amount <= 0 || !category) {
            newOutput = <span className="text-red-400">Error: Invalid 'add' format. Use 'add [income|expense] &lt;amount&gt; &lt;category&gt; [-d &lt;desc&gt;]'.</span>;
            break;
          }
          
          addTransaction({
            date: new Date().toISOString().split('T')[0],
            type: type as TransactionType,
            category: category,
            amount: amount,
            description: description,
          });

          newOutput = <span className="text-green-400">Transaction added: {type.toUpperCase()} ${amount.toLocaleString()} ({category}).</span>;
          break;
        
        case 'list':
          // 構文: list [all|income|expense]
          const filter = parts[1] || 'all';
          if (!['all', 'income', 'expense'].includes(filter)) {
            newOutput = <span className="text-red-400">Error: Invalid 'list' filter. Use 'list [all|income|expense]'.</span>;
            break;
          }
          newOutput = formatList(transactions, filter as 'all' | TransactionType);
          break;

        case 'clear':
          setHistory([]);
          setOutput([]);
          break;
        
        case 'balance': // balanceコマンドはGUIサマリーで確認できるが、CLI風にメッセージも出す
          newOutput = <span className="text-indigo-400">Current Balance: Check the left panel for real-time balance.</span>;
          break;


        case 'help':
          newOutput = (
            <div className="text-gray-300">
              <p className="font-bold mb-1 text-indigo-300">Available Commands:</p>
              <p className="ml-2">- <span className="text-yellow-400">add [income|expense] &lt;amount&gt; &lt;category&gt; [-d &lt;desc&gt;]</span>: Add a new transaction.</p>
              <p className="ml-2">- <span className="text-yellow-400">list [all|income|expense]</span>: Show transactions (latest 10).</p>
              <p className="ml-2">- <span className="text-yellow-400">balance</span>: Show current balance. (Info on left panel).</p>
              <p className="ml-2">- <span className="text-yellow-400">clear</span>: Clear the terminal history.</p>
            </div>
          );
          break;
        
        default:
          newOutput = <span className="text-yellow-400">Unknown command: {action}. Type 'help' for a list of commands.</span>;
      }
    } catch (e) {
      console.error(e);
      newOutput = <span className="text-red-400">An unexpected error occurred.</span>;
    }
    
    // コマンドの出力があれば追加
    if (newOutput) {
      setOutput(prev => [...prev, newOutput]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      if (command) {
        processCommand(command);
      } else {
        // コマンドが空でもプロンプトを履歴に残す
        setHistory(prev => [...prev, '$']);
      }
      setInput(''); 
      inputRef.current?.focus(); // フォーカスを維持
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-lg shadow-2xl p-3 border border-gray-700">
      <div className="flex-grow overflow-y-auto whitespace-pre-wrap text-sm" onClick={() => inputRef.current?.focus()}>
        {/* 履歴と出力の表示エリア */}
        <div className="text-green-400 mb-2">
          $ Welcome to CLI Finance Tracker. Type 'help' for commands.
        </div>
        
        {/* historyとoutputを対応させて表示 */}
        {history.map((hist, index) => (
          <React.Fragment key={index}>
            <div className="text-gray-400">{hist}</div>
            {/* $ から始まるコマンドに対応する出力を表示 */}
            {hist.startsWith('$') && output[history.filter(h => h.startsWith('$')).indexOf(hist)] && (
              <div className="mt-1 mb-2">
                {output[history.filter(h => h.startsWith('$')).indexOf(hist)]}
              </div>
            )}
          </React.Fragment>
        ))}
        
        <div ref={endOfTerminalRef} />
      </div>
      
      {/* 入力プロンプト */}
      <div className="flex items-center pt-2 mt-auto border-t border-gray-700">
        <span className="text-green-400 font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none focus:outline-none p-2 ml-2 font-mono text-gray-100 placeholder-gray-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck="false"
          placeholder="Type command here..."
        />
      </div>
    </div>
  );
};

export default CLI;