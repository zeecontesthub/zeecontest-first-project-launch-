import React, { useState } from 'react';
import Sidebar from '../Components/sidebar';
import ContestCard from '../Components/ContestCard';
import Image1 from '../assets/Rectangle 333.png';
import Image2 from '../assets/22222.png';
import Image3 from '../assets/33333.png';

const Contest = () => {
  const [activeTab, setActiveTab] = useState('All');

  const stats = [
    { label: 'Total Contests', value: '25' },
    { label: 'Ongoing Contest', value: '15' },
    { label: 'Completed Contest', value: '5' },
    { label: 'Drafts', value: '5' }
  ];

  const tabs = ['All', 'Ongoing', 'Completed', 'Drafts'];

  const contests = [
    {
      id: 1,
      title: 'Imaginarium Contest',
      image: Image1,
      votes: 50,
      contestants: 10,
      status: 'Ongoing',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      id: 2,
      title: 'Magic Carpet Contest',
      image: Image2,
      votes: 10,
      contestants: 10,
      status: 'Completed',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      id: 3,
      title: 'Lola Contest',
      image: Image3,
      votes: 10,
      contestants: 10,
      status: 'Drafts',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 4,
      title: 'Imaginarium Contest',
      image: Image1,
      votes: 10,
      contestants: 10,
      status: 'Ongoing',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      id: 5,
      title: 'Magic Carpet Contest',
      image: Image2,
      votes: 10,
      contestants: 10,
      status: 'Completed',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      id: 6,
      title: 'Lola Contest',
      image: Image3,
      votes: 10,
      contestants: 10,
      status: 'Drafts',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Header */}
        <h2 className="text-[30px] text-left font-bold text-gray-900 mb-8">Contest</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-200 text-left rounded-xl p-5">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-teal-800 text-white hover:bg-teal-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests
            .filter((contest) => activeTab === 'All' || contest.status === activeTab)
            .map((contest) => (
              <ContestCard key={contest.id} {...contest} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Contest;
