import React from 'react';

const ContestDetailsStep = ({ formData, onInputChange, positions, onAddPosition }) => {
    return (
        <div className="space-y-8">
            {/* Basic Content Information */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Content Information</h2>

                <div className="space-y-6">
                    {/* Contest Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contest Name
                        </label>
                        <input
                            type="text"
                            value={formData.contestName}
                            onChange={(e) => onInputChange('contestName', e.target.value)}
                            placeholder="Enter the Name of your Contest"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                        />
                    </div>

                    {/* Contest Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contest Description
                        </label>
                        <textarea
                            value={formData.contestDescription}
                            onChange={(e) => onInputChange('contestDescription', e.target.value)}
                            placeholder="Describe your contest"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => onInputChange('startDate', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => onInputChange('endDate', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Time Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => onInputChange('startTime', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => onInputChange('endTime', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Position Setup */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Position Setup</h2>
                    <button
                        onClick={onAddPosition}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
                    >
                        Add Position
                    </button>
                </div>

                {/* Position Table */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-100 font-medium text-gray-700 text-sm">
                        <div>Position Name</div>
                        <div>Description</div>
                        <div>Actions</div>
                    </div>

                    {positions.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            No positions added yet. Click "Add Position" to get started.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {positions.map((position, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 px-6 py-4 text-sm">
                                    <div className="text-gray-900">{position.name}</div>
                                    <div className="text-gray-600">{position.description}</div>
                                    <div>
                                        <button className="text-red-600 hover:text-red-800 text-sm">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContestDetailsStep;
