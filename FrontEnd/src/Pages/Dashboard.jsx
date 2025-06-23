import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/sidebar';
import ContestCard from '../Components/ContestCard';
import { Bell, Target, ChevronDown } from 'lucide-react';
import Image1 from '../assets/Rectangle 333.png';
import Image2 from '../assets/22222.png';
import Image3 from '../assets/33333.png';
import { useNavigate, useLocation} from 'react-router-dom';

const ContestTypeOption = ({ icon, title, onClick }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      <div className="bg-orange-500 rounded-full p-4 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-white mt-2">{title}</p>
    </div>
  );
};


const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const ongoingContests = [
    {
      id: 1,
      title: 'Imaginarium Contest',
      image: Image1,
      votes: 10,
      contestants: 10
    },
    {
      id: 2,
      title: 'Magic Carpet Contest',
      image: Image2,
      votes: 10,
      contestants: 10
    },
    {
      id: 3,
      title: 'Lolllllllla Contest',
      image: Image3,
      votes: 10,
      contestants: 10
    }
  ];

  const completedContests = [
    {
      id: 1,
      title: 'Imaginarium Contest',
      image: Image1,
      votes: 10,
      contestants: 10
    },
    {
      id: 2,
      title: 'Magic Carpet Contest',
      image: Image2,
      votes: 10,
      contestants: 10
    },
    {
      id: 3,
      title: 'Lola Contest',
      image: Image3,
      votes: 10,
      contestants: 10
    }
  ];

  const handleSpotlightClick = () => {
    navigate('/create-spotlight-contest');
  };

  return (
    <div className="flex bg-white">
      <Sidebar />
      <div className="flex-1 w-full p-6">
        {/* Menu Area Section */}
        <div className="w-full bg-teal-900 rounded-lg p-6 mb-8">
          {/* Top right notification bell */}
          <div className="flex justify-end">
            <button className="bg-gray-200 p-2 rounded-full">
              <Bell size={20} />
            </button>
          </div>
          
          {/* Title and description */}
          <div className="text-center mt-6 mb-8">
            <h className="text-white text-3xl font-bold">What contest are you creating today?</h>
            <p className="text-white mt-2">Create your contest in a few easy steps!</p>
          </div>
          
          {/* Contest type options */}
          <div className="flex justify-center gap-16">
            <ContestTypeOption 
              icon={ <Target className="h-8 w-8 text-white" /> }
              title="Spotlight" 
              onClick={handleSpotlightClick}
            />
          </div>
        </div>
        
        {/* Ongoing Contests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold ml-2">Ongoing Contest</h2>
            </div>
            <a href="#" className="text-teal-600 hover:underline">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingContests.map(contest => (
              <ContestCard 
                key={contest.id}
                title={contest.title}
                image={contest.image}
                votes={contest.votes}
                contestants={contest.contestants}
              />
            ))}
          </div>
        </div>

        {/*Completed Contests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold ml-2">Completed Contest</h2>
            </div>
            <a href="#" className="text-teal-600 hover:underline">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedContests.map(contest => (
              <ContestCard 
                key={contest.id}
                title={contest.title}
                image={contest.image}
                votes={contest.votes}
                contestants={contest.contestants}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
