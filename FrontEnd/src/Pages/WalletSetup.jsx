import React from 'react';
import Sidebar from '../Components/sidebar';

import positionData from '../data/positionData';
import { useNavigate } from 'react-router-dom';
import { Edit, Share2, ChevronLeft, Clock, ArrowUp, CreditCard } from 'lucide-react';

const Wallet = () => {
  const navigate = useNavigate();
  const balance = 4500.00;
  const totalEarnings = 7800.00;
  const pendingWithdrawals = 1200.00;

  const earningsByContest = [
    { id: 1, name: "Singing Competition", earnings: 1500.00, votes: 320 },
    { id: 2, name: "Dance Battle", earnings: 2200.00, votes: 450 },
    { id: 3, name: "Art Contest", earnings: 800.00, votes: 150 },
  ];

  const recentTransactions = [
    { id: 1, contest: "Singing Competition", voter: "user123", amount: 5.00, date: "2023-10-15" },
    { id: 2, contest: "Dance Battle", voter: "user456", amount: 5.00, date: "2023-10-14" },
    { id: 3, contest: "Art Contest", voter: "user789", amount: 5.00, date: "2023-10-14" },
  ];
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 w-full p-6 ml-20">
        {/* Header */}
        
        

      </div>
    </div>
  );
};

export default Wallet;
