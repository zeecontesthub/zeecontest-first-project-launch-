import React, { useState, useRef } from 'react';
import Sidebar from '../Components/sidebar';
import { Edit2, Trash2, ChevronLeft, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
import PositionPopup from '../Components/PositionPopup';
import ContestantPopup from '../Components/contestantpopup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Editcontest = () => {
    const [contestName, setContestName] = useState('');
    const [contestDescription, setContestDescription] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTimeHour, setStartTimeHour] = useState('');
    const [startTimeMinute, setStartTimeMinute] = useState('');
    const [startTimeAmPm, setStartTimeAmPm] = useState('AM');
    const [endTimeHour, setEndTimeHour] = useState('');
    const [endTimeMinute, setEndTimeMinute] = useState('');
    const [endTimeAmPm, setEndTimeAmPm] = useState('AM');
    const [banner, setBanner] = useState(BannerImage);
    const [logo, setLogo] = useState(LogoImage);
    const [isPositionPopupOpen, setIsPositionPopupOpen] = useState(false);
    const [isContestantPopupOpen, setIsContestantPopupOpen] = useState(false);

    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);

    const [positions, setPositions] = useState([
        { id: 1, name: 'President', description: 'President of Nass' },
        { id: 2, name: 'Vice- President', description: 'Vice-President of Nass' },
        { id: 3, name: 'Sport Director', description: 'Sport Director of Nass' }
    ]);

    // Enhanced editing state management
    const [editingPositionId, setEditingPositionId] = useState(null);
    const [tempPositionName, setTempPositionName] = useState('');
    const [tempPositionDescription, setTempPositionDescription] = useState('');
    const [originalPositionData, setOriginalPositionData] = useState(null);

    const [contestants, setContestants] = useState([
        { id: 1, name: 'Jake Ayodeji', position: 'Social Director', bio: 'This is a bio bio...', image: '/api/placeholder/40/40' },
        { id: 2, name: 'Jake Ayodeji', position: 'Social Director', bio: 'This is a bio bio...', image: '/api/placeholder/40/40' },
        { id: 3, name: 'Jake Ayodeji', position: 'Social Director', bio: 'This is a bio bio...', image: '/api/placeholder/40/40' }
    ]);
    // Enhanced editing state management for contestants

    const addPosition = () => {
        const newPosition = {
            id: positions.length + 1,
            name: 'New Position',
            description: 'Description of position'
        };
        setPositions([...positions, newPosition]);
    };

    const deletePosition = (id) => {
        setPositions(positions.filter(pos => pos.id !== id));
    };

    // Start editing a position
    const startEditing = (position) => {
        setEditingPositionId(position.id);
        setTempPositionName(position.name);
        setTempPositionDescription(position.description);
        // Store original data for cancel functionality
        setOriginalPositionData({
            name: position.name,
            description: position.description
        });
    };

    // Cancel editing and restore original values
    const cancelEditing = () => {
        if (originalPositionData && editingPositionId) {
            // Restore original values
            setPositions(positions.map(pos =>
                pos.id === editingPositionId ? {
                    ...pos,
                    name: originalPositionData.name,
                    description: originalPositionData.description
                } : pos
            ));
        }

        // Reset editing state
        setEditingPositionId(null);
        setTempPositionName('');
        setTempPositionDescription('');
        setOriginalPositionData(null);
    };

    // Save the edited position
    const saveEditing = () => {
        setPositions(positions.map(pos =>
            pos.id === editingPositionId ? {
                ...pos,
                name: tempPositionName,
                description: tempPositionDescription
            } : pos
        ));

        // Reset editing state
        setEditingPositionId(null);
        setTempPositionName('');
        setTempPositionDescription('');
        setOriginalPositionData(null);
    };

    // Update temporary values while editing
    const updateTempPosition = (field, value) => {
        if (field === 'name') {
            setTempPositionName(value);
        } else if (field === 'description') {
            setTempPositionDescription(value);
        }
    };

    const navigate = useNavigate();

    // Start editing a contestant
    const startEditingContestant = (contestant) => { };
    const cancelEditingContestant = () => { };
    const saveEditingContestant = () => { };
    const updateTempContestant = (field, value) => { };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setBanner(imageUrl);
        }
    };

    const handleLogoClick = () => {
        logoInputRef.current.click();
    };

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLogo(imageUrl);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 w-full p-6 ml-20">
                {/* Header */}
                <div className="flex items-center mb-8 gap-4">
                    <button
                        onClick={() => navigate('/contest-details')}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Back to Contest Details"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-[30px] text-left font-bold text-gray-900">Edit Contest</h2>
                </div>

                <div className="min-h-screen p-6">
                    <div className="mx-auto space-y-8">

                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg text-left font-semibold text-gray-900">Edit Contest Banner</h2>
                            </div>

                            {/* Banner Upload Area */}
                            <div className="p-6">
                                <div
                                    className="relative h-40 rounded-lg overflow-hidden"
                                    style={{ backgroundImage: `url(${banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                >
                                    <div className="absolute inset-0 bg-[#000000]/50 flex flex-col items-center justify-center text-white">
                                        <p className="text-sm mb-3">Drag and Drop your Cover Image here</p>
                                        <p className="text-xs mb-4">Or</p>
                                        <button
                                            onClick={handleBrowseClick}
                                            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded text-sm font-medium transition-colors"
                                        >
                                            Browse
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logo Section */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg text-left font-semibold text-gray-900">Edit Contest Logo</h2>
                            </div>
                            <div className="p-6">
                                <div className="relative w-24 h-24">
                                    <div className="w-full h-full bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                                        <img src={logo} alt="Contest Logo" className="w-20 h-20 object-cover rounded-full" />
                                    </div>
                                    <button
                                        onClick={handleLogoClick}
                                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-black bg-white hover:bg-gray-200"
                                    >
                                        +
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={logoInputRef}
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Basic Contest Information */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg text-left font-semibold text-gray-900">Basic Contest Information</h2>
                            </div>
                            <div className="p-6 space-y-6">

                                {/* Contest Name */}
                                <div>
                                    <label className="block text-sm text-left font-medium text-gray-700 mb-2">Contest Name</label>
                                    <input
                                        type="text"
                                        value={contestName}
                                        onChange={(e) => setContestName(e.target.value)}
                                        placeholder="Enter the Name of your Contest"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Contest Description */}
                                <div>
                                    <label className="block text-sm text-left font-medium text-gray-700 mb-2">Contest Description</label>
                                    <textarea
                                        value={contestDescription}
                                        onChange={(e) => setContestDescription(e.target.value)}
                                        placeholder="Describe your contest"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Date and Time Fields */}
                                <div className="grid grid-cols-1 text-left md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-left text-gray-700 mb-2">Start Date</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            minDate={new Date()}
                                            dateFormat="yyyy-MM-dd"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholderText="Select start date"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-left text-gray-700 mb-2">End Date</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            minDate={startDate || new Date()}
                                            dateFormat="yyyy-MM-dd"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholderText="Select end date"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-left text-gray-700 mb-2">Start Time</label>
                                        <div className="flex space-x-2">
                                            <select
                                                value={startTimeHour}
                                                onChange={(e) => setStartTimeHour(e.target.value)}
                                                className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                            >
                                                <option value="">HH</option>
                                                {[...Array(12)].map((_, i) => {
                                                    const hour = i + 1;
                                                    return <option key={hour} value={hour}>{hour}</option>;
                                                })}
                                            </select>
                                            <span>:</span>
                                            <select
                                                value={startTimeMinute}
                                                onChange={(e) => setStartTimeMinute(e.target.value)}
                                                className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                            >
                                                <option value="">MM</option>
                                                {[...Array(60)].map((_, i) => {
                                                    const minute = i.toString().padStart(2, '0');
                                                    return <option key={minute} value={minute}>{minute}</option>;
                                                })}
                                            </select>
                                            <select
                                                value={startTimeAmPm}
                                                onChange={(e) => setStartTimeAmPm(e.target.value)}
                                                className="w-20 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                            >
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-left text-gray-700 mb-2">End Time</label>
                                        <div className="flex space-x-2">
                                            <select
                                                value={endTimeHour}
                                                onChange={(e) => setEndTimeHour(e.target.value)}
                                                className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                            >
                                                <option value="">HH</option>
                                                {[...Array(12)].map((_, i) => {
                                                    const hour = i + 1;
                                                    return <option key={hour} value={hour}>{hour}</option>;
                                                })}
                                            </select>
                                            <span>:</span>
                                            <select
                                                value={endTimeMinute}
                                                onChange={(e) => setEndTimeMinute(e.target.value)}
                                                className="w-16 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                            >
                                                <option value="">MM</option>
                                                {[...Array(60)].map((_, i) => {
                                                    const minute = i.toString().padStart(2, '0');
                                                    return <option key={minute} value={minute}>{minute}</option>;
                                                })}
                                            </select>
                                            <select
                                                value={endTimeAmPm}
                                                onChange={(e) => setEndTimeAmPm(e.target.value)}
                                                className="w-20 px-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                            >
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Position Setup */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Position Setup</h2>
                                <button
                                    onClick={() => setIsPositionPopupOpen(true)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Add Position
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {positions.map((position) => (
                                            <tr key={position.id}>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={editingPositionId === position.id ? tempPositionName : position.name}
                                                        onChange={(e) => editingPositionId === position.id ? updateTempPosition('name', e.target.value) : null}
                                                        className={`w-full px-2 py-1 text-sm transition-all duration-200 ${editingPositionId === position.id
                                                            ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                                                            : 'border-transparent bg-transparent cursor-default'
                                                            }`}
                                                        readOnly={editingPositionId !== position.id}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={editingPositionId === position.id ? tempPositionDescription : position.description}
                                                        onChange={(e) => editingPositionId === position.id ? updateTempPosition('description', e.target.value) : null}
                                                        className={`w-full px-2 py-1 text-sm transition-all duration-200 ${editingPositionId === position.id
                                                            ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                                                            : 'border-transparent bg-transparent cursor-default'
                                                            }`}
                                                        readOnly={editingPositionId !== position.id}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        {editingPositionId === position.id ? (
                                                            <>
                                                                {/* Save Button */}
                                                                <button
                                                                    onClick={saveEditing}
                                                                    className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                                                                    title="Save changes"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                {/* Cancel Button */}
                                                                <button
                                                                    onClick={cancelEditing}
                                                                    className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors"
                                                                    title="Cancel editing"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* Edit Button */}
                                                                <button
                                                                    className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors"
                                                                    onClick={() => startEditing(position)}
                                                                    title="Edit position"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={() => deletePosition(position.id)}
                                                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                                                                    title="Delete position"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <PositionPopup
                                isOpen={isPositionPopupOpen}
                                onClose={() => setIsPositionPopupOpen(false)}
                                onAddPosition={(position) => {
                                    const newPosition = {
                                        id: positions.length + 1,
                                        name: position.name,
                                        description: position.description
                                    };
                                    setPositions([...positions, newPosition]);
                                    setIsPositionPopupOpen(false);
                                }}
                            />
                        </div>

                        {/* Contestant List */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Contestant List</h2>
                                <button
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    onClick={() => setIsContestantPopupOpen(true)}
                                >
                                    Add Contestant
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contestants.map((contestant) => (
                                            <tr key={contestant.id}>
                                                <td className="px-6 py-4">
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                                        {contestant.image ? (
                                                            <img
                                                                src={typeof contestant.image === 'string' ? contestant.image : URL.createObjectURL(contestant.image)}
                                                                alt={contestant.name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-600 text-xs font-medium">
                                                                {contestant.name?.charAt(0) || '?'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-left font-medium text-gray-900">{contestant.name}</td>
                                                <td className="px-6 py-4 text-sm text-left text-gray-500">{contestant.position}</td>
                                                <td className="px-6 py-4 text-sm text-left text-gray-600 hover:text-blue-800 cursor-pointer">{contestant.bio}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex text-left space-x-2">
                                                        <button
                                                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                                                            onClick={() => setContestants(contestants.filter(c => c.id !== contestant.id))}
                                                            title="Delete contestant"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => navigate('/contest-details')}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-3 rounded-md font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-medium transition-colors">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ContestantPopup
                isOpen={isContestantPopupOpen}
                onClose={() => setIsContestantPopupOpen(false)}
                onAddContestant={(newContestant) => {
                    setContestants([...contestants, { id: contestants.length + 1, ...newContestant }]);
                    setIsContestantPopupOpen(false);
                }}
            />
        </div>
    );
};

export default Editcontest;