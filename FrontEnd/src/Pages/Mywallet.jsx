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
    ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const Mywallet = () => {
    const handleNavigation = (path) => {
        console.log(`Navigate to: ${path}`);
    };


    const walletData = {
        availableBalance: 45750.00,
        totalEarnings: 127500.00,
        pendingWithdrawals: 2500.00,
        recentActivity: 15,
        thisMonthEarnings: 8450.00,
        lastWithdrawal: "2024-01-15",
    };

    const commissionBreakdown = [
        { source: 'Voter Fees', amount: 35400, percentage: 78.5 }

    ];

    const contestEarnings = [
        {
            id: 1,
            contestName: 'Student Union Elections 2024',
            totalVotes: 1250,
            revenue: 12500,
            status: 'completed',
            date: '2024-01-15',
            commission: 5.2
        },
        {
            id: 2,
            contestName: 'Tech Club President',
            totalVotes: 890,
            revenue: 8900,
            status: 'Ongoing',
            date: '2024-01-10',
            commission: 5.2
        },
        {
            id: 3,
            contestName: 'Department Head Selection',
            totalVotes: 2100,
            revenue: 21000,
            status: 'completed',
            date: '2024-01-08',
            commission: 5.2
        },
        {
            id: 4,
            contestName: 'Sports Committee Elections',
            totalVotes: 567,
            revenue: 5670,
            status: 'upcoming',
            date: '2024-01-12',
            commission: 5.2
        }
    ];

    const transactionHistory = [
        {
            id: 1,
            type: 'voter_payment',
            contestName: 'Student Union Elections 2024',
            amount: 10.00,
            timestamp: '2024-01-15 14:30:00',
            status: 'completed',
            voterName: 'John Doe'
        },
        {
            id: 2,
            type: 'voter_payment',
            contestName: 'Tech Club President',
            amount: 10.00,
            timestamp: '2024-01-15 13:15:00',
            status: 'completed',
            voterName: 'Jane Smith'
        },
        {
            id: 3,
            type: 'voter_payment',
            contestName: 'Tech Club President',
            amount: 10.00,
            timestamp: '2024-01-15 13:15:00',
            status: 'completed',
            voterName: 'Jane Smith'
            
        },
        {
            id: 4,
            type: 'voter_payment',
            contestName: 'Sports Committee Elections',
            amount: 10.00,
            timestamp: '2024-01-14 09:45:00',
            status: 'pending',
            voterName: 'Mike Johnson'
        },
        {
            id: 5,
            type: 'voter_payment',
            contestName: 'Student Union Elections 2024',
            amount: 10.00,
            timestamp: '2024-01-13 16:20:00',
            status: 'completed',
            voterName: 'Sarah Wilson'
        }
    ];

    const [selectedTab, setSelectedTab] = useState('overview');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const notify = () => toast.success("This is a toast notification!");

    return (
        <div className='flex min-h-screen'>
            <Sidebar />
            <div className="flex-1 w-full p-6 ml-20">

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-[30px] text-left font-bold text-gray-900">Wallet</h2>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Balance Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 text-white shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-teal-100 text-sm font-medium">Available Balance</p>
                                    <h2 className="text-4xl lg:text-5xl font-bold mt-2">
                                        {formatCurrency(walletData.availableBalance)}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="bg-white text-teal-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
                                    <Settings className="w-4 h-4" />
                                    Payout Settings
                                </button>
                                <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-lg" onClick={notify}>
                                    <Download className="w-4 h-4" />
                                    Request Withdrawal
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-6 mt-6">
                            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-xl">
                                        <TrendingUp className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-600">Earnings This Month</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {formatCurrency(walletData.thisMonthEarnings)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-xl">
                                        <Download className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-600">Last Withdrawal</p>
                                        <p className="text-sm font-bold text-gray-900">Jan 15, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Quick Stats Card */}
                    <div className="space-y-4">
                        <div className="bg-white  text-left rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Total Earnings</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(walletData.totalEarnings)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm font-medium">All time</span>
                            </div>
                        </div>

                        <div className="bg-white text-left rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-100 rounded-xl">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Pending Withdrawals</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(walletData.pendingWithdrawals)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-orange-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">Processing</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="space-y-8">
                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                        <div className="flex justify-center space-x-2">
                            {[
                                { id: 'overview', label: 'Overview', icon: Activity },
                                { id: 'contests', label: 'Earnings by Contest', icon: TrendingUp },
                                { id: 'transactions', label: 'Transaction History', icon: CreditCard }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setSelectedTab(id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${selectedTab === id
                                        ? 'bg-teal-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>


                    {selectedTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Commission Breakdown */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
                                    Revenue Sources
                                </h3>
                                <div className="space-y-4">
                                    {commissionBreakdown.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                                                <span className="font-medium text-gray-900">{item.source}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                                                <p className="text-sm text-gray-600">{item.percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary Stats */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                                    Summary Statistics
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                        <div>
                                            <p className="text-sm text-gray-600">Average per Contest</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(walletData.totalEarnings / 12)}</p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-green-600" />
                                    </div>

                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Contests</p>
                                            <p className="text-2xl font-bold text-gray-900">12</p>
                                        </div>
                                        <Activity className="w-8 h-8 text-blue-600" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'contests' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
                                    Earnings by Contest
                                </h3>
                                <p className="text-sm text-left text-gray-600 mt-1">Revenue breakdown from all your contests</p>
                            </div>

                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                                                <th className="pb-4 font-semibold">Contest Name</th>
                                                <th className="pb-4 font-semibold">Total Votes</th>
                                                <th className="pb-4 font-semibold">Revenue</th>
                                                <th className="pb-4 font-semibold">Status</th>
                                                <th className="pb-4 font-semibold">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-left divide-gray-100">
                                            {contestEarnings.map((contest) => (
                                                <tr key={contest.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{contest.contestName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="font-medium text-gray-900">{contest.totalVotes.toLocaleString()}</span>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="font-bold text-teal-600">{formatCurrency(contest.revenue)}</span>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${contest.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            contest.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-orange-100 text-orange-800'
                                                            }`}>
                                                            {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-gray-600">{contest.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phase 5: Transaction History */}
                    {selectedTab === 'transactions' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                                    Transaction History
                                </h3>
                                <p className="text-sm text-left text-gray-600 mt-1">All voter payments and contest activities</p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {transactionHistory.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div className="flex text-left items-center gap-4">
                                                <div className={`p-2 rounded-xl ${transaction.type === 'voter_payment' ? 'bg-green-100' : 'bg-purple-100'}`}>
                                                    {transaction.type === 'voter_payment' ? (
                                                        <DollarSign className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <CreditCard className="w-5 h-5 text-purple-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {transaction.type === 'voter_payment' ? 'Voter Payment' : 'Other Transaction'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{transaction.contestName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {transaction.voterName} • {new Date(transaction.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    transaction.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
        </div>
    );
};

export default Mywallet;
