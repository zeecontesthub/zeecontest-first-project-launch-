import React, { useState } from 'react';
import Sidebar from '../Components/sidebar';
import {
    Download,
    TrendingUp,
    Clock,
    Settings,
    ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const Mywallet = () => {
    const handleNavigation = (path) => {
        console.log(`Navigate to: ${path}`);
    };

    // Sample data - you'll replace this with real data from your API
    const walletData = {
        availableBalance: 45750.00,
        totalEarnings: 127500.00,
        pendingWithdrawals: 2500.00,
        recentActivity: 15,
        thisMonthEarnings: 8450.00,
        lastWithdrawal: "2024-01-15",
        commission: 5.2 // percentage
    };

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
                {/* Phase 1: Header & Navigation */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-[30px] text-left font-bold text-gray-900">Wallet</h2>
                        </div>
                    </div>
                </div>

                {/* Phase 2: Balance Card & Quick Stats */}
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

                {/* Placeholder for upcoming phases */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                    
                </div>
            </div>
        </div>
    );
};

export default Mywallet;
