/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Sidebar from '../Components/sidebar';
import {
  Download,
  TrendingUp,
  Clock,
  Settings,
  DollarSign,
  Activity,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import PayoutSetting from '../Components/payoutsetting';
import Withdrawal from '../Components/withdrawal';

const Mywallet = () => {
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const handleNavigation = (path) => {
    console.log(`Navigate to: ${path}`);
  };

  const openPayoutSettings = () => {
    setIsPayoutOpen(true);
  };

  const closePayoutSettings = () => {
    setIsPayoutOpen(false);
  };

  // eslint-disable-next-line no-unused-vars
  const savePayoutSettings = (data) => {
    // For now, just close the popup and show a success toast
    setIsPayoutOpen(false);
    toast.success('Payout settings saved successfully!');
    // Additional logic to handle saved data can be added here
  };

  const openWithdrawal = () => {
    setIsWithdrawalOpen(true);
  };

  const closeWithdrawal = () => {
    setIsWithdrawalOpen(false);
  };

  const walletData = {
    availableBalance: 45750.0,
    totalEarnings: 127500.0,
    pendingWithdrawals: 2500.0,
    recentActivity: 15,
    thisMonthEarnings: 8450.0,
    lastWithdrawal: '2024-01-15',
  };

  const commissionBreakdown = [
    { source: 'Voter Fees', amount: 35400, percentage: 78.5 },
  ];

  const contestEarnings = [
    {
      id: 1,
      contestName: 'Student Union Elections 2024',
      totalVotes: 1250,
      revenue: 12500,
      status: 'completed',
      date: '2024-01-15',
      commission: 5.2,
    },
    {
      id: 2,
      contestName: 'Tech Club President',
      totalVotes: 890,
      revenue: 8900,
      status: 'Ongoing',
      date: '2024-01-10',
      commission: 5.2,
    },
    {
      id: 3,
      contestName: 'Department Head Selection',
      totalVotes: 2100,
      revenue: 21000,
      status: 'completed',
      date: '2024-01-08',
      commission: 5.2,
    },
    {
      id: 4,
      contestName: 'Sports Committee Elections',
      totalVotes: 567,
      revenue: 5670,
      status: 'upcoming',
      date: '2024-01-12',
      commission: 5.2,
    },
  ];

  const transactionHistory = [
    {
      id: 1,
      type: 'voter_payment',
      contestName: 'Student Union Elections 2024',
      amount: 10.0,
      timestamp: '2024-01-15 14:30:00',
      status: 'completed',
      voterName: 'John Doe',
    },
    {
      id: 2,
      type: 'voter_payment',
      contestName: 'Tech Club President',
      amount: 10.0,
      timestamp: '2024-01-15 13:15:00',
      status: 'completed',
      voterName: 'Jane Smith',
    },
    {
      id: 3,
      type: 'voter_payment',
      contestName: 'Tech Club President',
      amount: 10.0,
      timestamp: '2024-01-15 13:15:00',
      status: 'completed',
      voterName: 'Jane Smith',
    },
    {
      id: 4,
      type: 'voter_payment',
      contestName: 'Sports Committee Elections',
      amount: 10.0,
      timestamp: '2024-01-14 09:45:00',
      status: 'pending',
      voterName: 'Mike Johnson',
    },
    {
      id: 5,
      type: 'voter_payment',
      contestName: 'Student Union Elections 2024',
      amount: 10.0,
      timestamp: '2024-01-13 16:20:00',
      status: 'completed',
      voterName: 'Sarah Wilson',
    },
  ];

  const [selectedTab, setSelectedTab] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const notify = () => toast.success('This is a toast notification!');

  return (
    <div className='flex min-h-screen flex-col lg:flex-row lg:gap-[10rem]'>
      <Sidebar />

      <div className='flex-1 p-4 sm:p-6 md:ml-20'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6 sm:mb-8'>
          <h2 className='text-2xl sm:text-[30px] font-bold text-gray-900'>
            Wallet
          </h2>
        </div>

        {/* Wallet Overview Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8'>
          {/* Main Balance Card */}
          <div className='lg:col-span-2'>
            <div className='bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl'>
              <div className='flex items-center justify-between mb-4 sm:mb-6'>
                <div>
                  <p className='text-teal-100 text-xs sm:text-sm font-medium'>
                    Available Balance
                  </p>
                  <h2 className='text-3xl sm:text-5xl font-bold mt-2'>
                    {formatCurrency(walletData.availableBalance)}
                  </h2>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'>
                <button
                  onClick={openPayoutSettings}
                  className='bg-white text-teal-700 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base'
                >
                  <Settings className='w-4 h-4' />
                  Payout Settings
                </button>
                <button
                  onClick={openWithdrawal}
                  className='bg-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-orange-400 transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base'
                >
                  <Download className='w-4 h-4' />
                  Request Withdrawal
                </button>
              </div>
            </div>

            {/* Sub Stats Below Balance */}
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6'>
              <div className='bg-white rounded-xl sm:rounded-2xl p-4 shadow-lg border border-gray-200 flex-1'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-purple-100 rounded-xl'>
                    <TrendingUp className='w-5 h-5 text-purple-600' />
                  </div>
                  <div className='text-left'>
                    <p className='text-xs text-gray-600'>Earnings This Month</p>
                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                      {formatCurrency(walletData.thisMonthEarnings)}
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-xl sm:rounded-2xl p-4 shadow-lg border border-gray-200 flex-1'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-emerald-100 rounded-xl'>
                    <Download className='w-5 h-5 text-emerald-600' />
                  </div>
                  <div className='text-left'>
                    <p className='text-xs text-gray-600'>Last Withdrawal</p>
                    <p className='text-sm sm:text-base font-bold text-gray-900'>
                      Jan 15, 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className='space-y-4'>
            <div className='bg-white text-left rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200'>
              <div className='flex items-center gap-3 mb-4 sm:mb-6'>
                <div className='p-2 bg-green-100 rounded-xl'>
                  <TrendingUp className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-600'>Total Earnings</p>
                  <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                    {formatCurrency(walletData.totalEarnings)}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2 text-green-600'>
                <ArrowUpRight className='w-4 h-4' />
                <span className='text-xs sm:text-sm font-medium'>All time</span>
              </div>
            </div>

            <div className='bg-white text-left rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200'>
              <div className='flex items-center gap-3 mb-4 sm:mb-6'>
                <div className='p-2 bg-blue-100 rounded-xl'>
                  <Download className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-600'>Total Withdrawals</p>
                  <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                    {formatCurrency(50000)}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2 text-blue-600'>
                <Download className='w-4 h-4' />
                <span className='text-xs sm:text-sm font-medium'>All time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-xl sm:rounded-2xl p-2 shadow-lg border border-gray-200'>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-4'>
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              {
                id: 'contests',
                label: 'Earnings by Contest',
                icon: TrendingUp,
              },
              {
                id: 'transactions',
                label: 'Transaction History',
                icon: CreditCard,
              },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm md:text-base ${
                  selectedTab === id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className='w-4 h-4' />
                <span className='hidden sm:inline'>{label}</span>
                <span className='sm:hidden'>{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className='space-y-6 sm:space-y-8 mt-6'>
          {selectedTab === 'overview' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
              {/* Revenue Sources */}
              <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200'>
                <h3 className='text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2'>
                  <div className='w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full'></div>
                  Revenue Sources
                </h3>
                <div className='space-y-4'>
                  {commissionBreakdown.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-3 h-3 bg-teal-500 rounded-full'></div>
                        <span className='font-medium text-gray-900'>
                          {item.source}
                        </span>
                      </div>
                      <div className='text-right'>
                        <p className='font-bold text-gray-900'>
                          {formatCurrency(item.amount)}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200'>
                <h3 className='text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2'>
                  <div className='w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>
                  Summary Statistics
                </h3>
                <div className='space-y-4 sm:space-y-6'>
                  <div className='flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl'>
                    <div>
                      <p className='text-xs sm:text-sm text-gray-600'>
                        Average per Contest
                      </p>
                      <p className='text-lg sm:text-2xl font-bold text-gray-900'>
                        {formatCurrency(walletData.totalEarnings / 12)}
                      </p>
                    </div>
                    <TrendingUp className='w-6 sm:w-8 h-6 sm:h-8 text-green-600' />
                  </div>
                  <div className='flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl'>
                    <div>
                      <p className='text-xs sm:text-sm text-gray-600'>
                        Total Contests
                      </p>
                      <p className='text-lg sm:text-2xl font-bold text-gray-900'>
                        12
                      </p>
                    </div>
                    <Activity className='w-6 sm:w-8 h-6 sm:h-8 text-blue-600' />
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedTab === 'contests' && (
            <div className='bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200'>
              <div className='p-4 sm:p-6 border-b border-gray-200'>
                <h3 className='text-base sm:text-lg font-semibold flex items-center gap-2'>
                  <div className='w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full'></div>
                  Earnings by Contest
                </h3>
              </div>

              {/* Mobile Card View */}
              <div className='block md:hidden'>
                {contestEarnings.map((contest) => (
                  <div
                    key={contest.id}
                    className='p-4 border-b border-gray-100 last:border-b-0'
                  >
                    <div className='space-y-3'>
                      <div className='flex justify-between items-start'>
                        <h4 className='font-medium text-gray-900 text-sm pr-2'>
                          {contest.contestName}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            contest.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : contest.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {contest.status.charAt(0).toUpperCase() +
                            contest.status.slice(1)}
                        </span>
                      </div>

                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='text-gray-600 block'>
                            Total Votes
                          </span>
                          <span className='font-medium text-gray-900'>
                            {contest.totalVotes.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className='text-gray-600 block'>Revenue</span>
                          <span className='font-bold text-teal-600'>
                            {formatCurrency(contest.revenue)}
                          </span>
                        </div>
                      </div>

                      <div className='text-sm text-gray-600'>
                        {contest.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className='hidden md:block overflow-x-auto'>
                <div className='p-4 sm:p-6'>
                  <table className='w-full text-sm sm:text-base'>
                    <thead>
                      <tr className='text-left text-xs sm:text-sm text-gray-600 border-b border-gray-200'>
                        <th className='pb-3 sm:pb-4 font-semibold min-w-[200px]'>
                          Contest Name
                        </th>
                        <th className='pb-3 sm:pb-4 font-semibold min-w-[100px]'>
                          Total Votes
                        </th>
                        <th className='pb-3 sm:pb-4 font-semibold min-w-[100px]'>
                          Revenue
                        </th>
                        <th className='pb-3 sm:pb-4 font-semibold min-w-[100px]'>
                          Status
                        </th>
                        <th className='pb-3 sm:pb-4 font-semibold min-w-[100px]'>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y text-left divide-gray-100'>
                      {contestEarnings.map((contest) => (
                        <tr
                          key={contest.id}
                          className='hover:bg-gray-50 transition-colors'
                        >
                          <td className='py-3 sm:py-4'>
                            <p className='font-medium text-gray-900'>
                              {contest.contestName}
                            </p>
                          </td>
                          <td className='py-3 sm:py-4 font-medium text-gray-900'>
                            {contest.totalVotes.toLocaleString()}
                          </td>
                          <td className='py-3 sm:py-4 font-bold text-teal-600'>
                            {formatCurrency(contest.revenue)}
                          </td>
                          <td className='py-3 sm:py-4'>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                contest.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : contest.status === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {contest.status.charAt(0).toUpperCase() +
                                contest.status.slice(1)}
                            </span>
                          </td>
                          <td className='py-3 sm:py-4 text-gray-600'>
                            {contest.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'transactions' && (
            <div className='bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200'>
              <div className='p-4 sm:p-6 border-b border-gray-200'>
                <h3 className='text-base sm:text-lg font-semibold flex items-center gap-2'>
                  <div className='w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>
                  Transaction History
                </h3>
              </div>
              <div className='p-4 sm:p-6'>
                <div className='space-y-3 sm:space-y-4'>
                  {transactionHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
                    >
                      <div className='flex items-start sm:items-center gap-3 sm:gap-4 text-left'>
                        <div
                          className={`p-2 rounded-xl ${
                            transaction.type === 'voter_payment'
                              ? 'bg-green-100'
                              : 'bg-purple-100'
                          }`}
                        >
                          {transaction.type === 'voter_payment' ? (
                            <DollarSign className='w-5 h-5 text-green-600' />
                          ) : (
                            <CreditCard className='w-5 h-5 text-purple-600' />
                          )}
                        </div>
                        <div>
                          <p className='font-medium text-gray-900'>
                            {transaction.type === 'voter_payment'
                              ? 'Voter Payment'
                              : 'Other Transaction'}
                          </p>
                          <p className='text-xs sm:text-sm text-gray-600'>
                            {transaction.contestName}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {transaction.voterName} •{' '}
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className='text-left sm:text-right mt-2 sm:mt-0'>
                        <p className='font-bold text-gray-900'>
                          {formatCurrency(transaction.amount)}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'pending'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <PayoutSetting
        isOpen={isPayoutOpen}
        onClose={closePayoutSettings}
        onSave={savePayoutSettings}
      />
      {isWithdrawalOpen && <Withdrawal onClose={closeWithdrawal} />}
    </div>
  );
};

export default Mywallet;