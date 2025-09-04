<<<<<<< HEAD
import React, { useState } from 'react';
import { X } from 'lucide-react';

const PositionPopup = ({ isOpen, onClose, onAddPosition }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleAddPosition = () => {
        if (name.trim() === '') {
            alert('Position name is required');
            return;
        }
        onAddPosition({ name, description });
        setName('');
        setDescription('');
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#000000]/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close popup"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add Position</h2>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter position name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter position description"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                        />
                    </div>
                </div>

                {/* Add Position Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleAddPosition}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                    >
                        Add Position
                    </button>
                </div>
            </div>
        </div>
    );
=======
import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const PositionPopup = ({ isOpen, onClose, onAddPosition }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleAddPosition = () => {
    if (name.trim() === "") {
      toast.error("Position name is required");
      return;
    }
    onAddPosition({ name, description });
    setName("");
    setDescription("");
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Position</h2>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter position name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter position description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Add Position Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddPosition}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Add Position
          </button>
        </div>
      </div>
    </div>
  );
>>>>>>> oscar-branch
};

export default PositionPopup;
