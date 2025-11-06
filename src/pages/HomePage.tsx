import { useState, useEffect } from 'react';
import { apiService, Balance, Transaction } from '../utils/api';
import StatusBar from '../components/StatusBar';

export default function HomePage() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [balanceData, transactionsData] = await Promise.all([
        apiService.getBalance(),
        apiService.getTransactions(),
      ]);

      setBalance(balanceData);
      setTransactions(transactionsData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      // Set mock data for demo if API fails
      setBalance({
        user_id_string: 'demo_user',
        balance: 4322,
      });
      setTransactions([
        {
          id: '1',
          store: 'Korzinka - Amore',
          date: '14 October 17:51',
          amount: 59248,
          bonuses: 592,
        },
        {
          id: '2',
          store: 'Korzinka - Amore',
          date: '13 October 14:33',
          amount: 25970,
          bonuses: 259,
        },
        {
          id: '3',
          store: 'Korzinka - Amore',
          date: '9 October 13:22',
          amount: 18980,
          bonuses: 189,
        },
        {
          id: '4',
          store: 'Korzinka - Beruniy',
          date: '5 October 20:31',
          amount: 12160,
          bonuses: 91,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US').replace(/,/g, ' ');
  };

  const groupTransactionsByMonth = () => {
    const grouped: { [key: string]: Transaction[] } = {};
    
    transactions.forEach((transaction) => {
      const month = transaction.date.split(' ')[1]; // Extract month
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(transaction);
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const groupedTransactions = groupTransactionsByMonth();

  return (
    <>
      <StatusBar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">🌱 Bush Wallet</h1>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Your eco-friendly rewards balance
          </p>
        </div>

        {balance && (
          <div className="balance-card" style={{ background: 'linear-gradient(135deg, #34A853 0%, #0F9D58 100%)' }}>
            <div className="card-header">
              <div className="card-title" style={{ color: 'white' }}>🌿 BasketPoints Balance</div>
              <div className="card-number" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                User ID: {balance.user_id_string.substring(0, 12)}...
              </div>
            </div>
            
            <div className="balance-amount" style={{ color: 'white', fontSize: '48px' }}>
              {formatAmount(balance.balance)}
            </div>
            
            <div className="balance-details" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <div className="balance-row">
                <div className="balance-label" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Available for Redemption
                </div>
                <div className="balance-value" style={{ color: 'white', fontWeight: '700' }}>
                  {formatAmount(balance.balance)} pts
                </div>
              </div>
              <div className="balance-row">
                <div className="balance-label" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px' }}>
                  ✨ Redeem for eco-friendly products only
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="transactions-section">
          <h2 className="section-title">🌍 Eco-Friendly Purchases</h2>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '-8px', marginBottom: '16px' }}>
            Earn BasketPoints for every purchase
          </p>
          
          {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
            <div key={month}>
              <div className="month-separator">{month} 2025</div>
              {monthTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon" style={{ background: 'linear-gradient(135deg, #34A853 0%, #0F9D58 100%)' }}>
                    🌱
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-store">{transaction.store}</div>
                    <div className="transaction-date">{transaction.date}</div>
                  </div>
                  <div className="transaction-amounts">
                    <div className="transaction-amount">{formatAmount(transaction.amount)} soum</div>
                    <div className="transaction-bonus" style={{ color: '#34A853', fontWeight: '600' }}>
                      + {transaction.bonuses} BasketPoints
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <div className="empty-state-text">No transactions yet</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
