import React, { useState } from 'react';
import Sidebar from '../Components/sidebar';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
import { Edit, Share2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import positionData from '../data/positionData';
import ContestantCard from '../Components/ContestantCard';

const Contestant = () => {
    const [selectedPosition, setSelectedPosition] = useState('All');
    const totalGlobalVotes = Object.values(positionData).reduce((acc, pos) => acc + pos.votersCount, 0);
    const totalContestants = Object.values(positionData).reduce((acc, pos) => acc + pos.contestants.length, 0);
    const navigate = useNavigate();

    // Flatten all contestants from all positions into one array
    const allContestants = Object.entries(positionData).flatMap(([position, data]) =>
        data.contestants.map(contestant => ({
            name: contestant.name,
            image: '', // no image url, will use avatar emoji as fallback
            avatar: contestant.avatar,
            votes: 0, // no individual votes data, set to 0
            position,
        }))
    );

    // Get unique positions for filter buttons
    const positions = ['All', ...Object.keys(positionData)];

    // Filter contestants based on selected position
    const filteredContestants = selectedPosition === 'All'
        ? allContestants
        : allContestants.filter(contestant => contestant.position === selectedPosition);

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 w-full p-6 ml-20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/contest-details')}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Back to Contest Details"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-[30px] text-left font-bold text-gray-900 mb-0">Contestant</h2>
                </div>

                <div>
                    <img
                        src={BannerImage}
                        alt="Contest Banner"
                        className='w-full'
                    />
                </div>
                <div className="relative z-10  backdrop-blur-sm rounded-3xl p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left Section - Logo and Content */}
                        <div className="flex items-center gap-6">
                            {/* Logo */}
                            <div className=" rounded-full flex items-center justify-center border-4 border-black overflow-hidden -mt-5 ml-5">
                                <img src={LogoImage} alt="Logo" className="w-full h-full object-cover" />
                            </div>

                            {/* Content */}
                            <div>
                                <h2 className="text-[32px] lg:text-[32px] text-left font-bold text-gray-900 mb-2">
                                    Imaginarium Contest
                                </h2>
                                <p className="text-gray-600 max-w-lg text-left text-sm lg:text-base">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-8 mt-4">
                                    <div>
                                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">{totalGlobalVotes}</span>
                                        <span className="text-gray-600 ml-2 text-sm">Total Votes</span>
                                    </div>
                                    <div>
                                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">{totalContestants}</span>
                                        <span className="text-gray-600 ml-2 text-sm">Contestant</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Action Buttons */}
                        <div className="flex flex-col gap-3 min-w-fit">
                            <button
                                onClick={() => navigate('/edit-contest')}
                                className="flex items-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium"
                            >
                                <Edit size={16} />
                                Edit Contest
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium">
                                <Share2 size={16} />
                                Share Voters Link
                            </button>
                        </div>
                    </div>

                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 mb-8 mt-7">
                    {positions.map((pos) => (
                        <button
                            key={pos}
                            onClick={() => setSelectedPosition(pos)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedPosition === pos
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-teal-800 text-white hover:bg-teal-700'
                                }`}
                        >
                            {pos}
                        </button>
                    ))}
                </div>

                {/* Contestants List */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 text-left md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredContestants.map((contestant, index) => (
                        <ContestantCard
                            key={index}
                            name={contestant.name}
                            image={contestant.avatar} // using avatar emoji as image fallback
                            votes={contestant.votes}
                            position={contestant.position}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contestant;
