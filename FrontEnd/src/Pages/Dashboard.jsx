import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/sidebar';
import ContestCard from '../Components/ContestCard';
import { Bell, Target, ChevronDown } from 'lucide-react';
import Image1 from '../assets/Rectangle_333.png';
import Image2 from '../assets/22222.png';
import Image3 from '../assets/33333.png';
import Image4 from '../assets/44444.jpg';
import Image5 from '../assets/55555.jpg';
import Image6 from '../assets/66666.jpg';
import Image7 from '../assets/77777.jpg';
import Image8 from '../assets/88888.jpg';
import Image9 from '../assets/99999.jpg';

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

  const upcomingContests = [
    {
      id: 1,
      title: 'Trad Contest',
      image: Image1,
      votes: 0,
      contestants: 10
    },
    {
      id: 2,
      title: 'Dynamicc Contest',
      image: Image2,
      votes: 0,
      contestants: 10
    },
    {
      id: 3,
      title: 'Forever Contest',
      image: Image3,
      votes: 0,
      contestants: 10
    }
  ];

  const ongoingContests = [
    {
      id: 4,
      title: 'Main Contest',
      image: Image4,
      votes: 10,
      contestants: 10
    },
    {
      id: 5,
      title: 'Trust Contest',
      image: Image5,
      votes: 10,
      contestants: 10
    },
    {
      id: 6,
      title: 'Beatiful Contest',
      image: Image6,
      votes: 10,
      contestants: 10
    }
  ];

  const completedContests = [
    {
      id: 7,
      title: 'Softwork Contest',
      image: Image7,
      votes: 10,
      contestants: 10
    },
    {
      id: 8,
      title: 'Khrien Contest',
      image: Image8,
      votes: 10,
      contestants: 10
    },
    {
      id: 9,
      title: 'Church Contest',
      image: Image9,
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
      <div className="flex-1 w-full p-6 ml-20">
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
        
        {/* Upcoming Contests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold ml-2">Upcoming Contest</h2>
            </div>
            <a href="#" className="text-teal-600 hover:underline">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingContests.map(contest => (
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
