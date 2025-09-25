import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

const EditContestPositionSetup = ({
  positions,
  editingPositionId,
  tempPositionName,
  tempPositionDescription,
  setIsPositionPopupOpen,
  startEditing,
  saveEditing,
  cancelEditing,
  deletePosition,
  updateTempPosition,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredPositions = positions.filter(
    (position) =>
      position.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const positionsToShow = filteredPositions.slice(0, visibleCount);

  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <h2 className='text-base sm:text-lg font-semibold text-gray-900'>
          Position Setup
        </h2>
        <input
          type='text'
          placeholder='Search positions...'
          className='w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setIsPositionPopupOpen(true)}
          className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto'
        >
          Add Position
        </button>
      </div>

      {/* Mobile Card View */}
      <div className='block sm:hidden'>
        {positionsToShow.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            {searchQuery ? 'No positions found.' : 'No positions added yet'}
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {positionsToShow.map((position) => (
              <div key={position._id} className='p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-medium text-gray-900'>Position</h3>
                  <div className='flex space-x-2'>
                    {editingPositionId === position._id ? (
                      <>
                        <button
                          onClick={saveEditing}
                          className='text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors'
                          title='Save changes'
                        >
                          <Check className='w-4 h-4' />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                          title='Cancel editing'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                          onClick={() => startEditing(position)}
                          title='Edit position'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => deletePosition(position._id)}
                          className='text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors'
                          title='Delete position'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    type='text'
                    value={
                      editingPositionId === position._id
                        ? tempPositionName
                        : position?.name
                    }
                    onChange={(e) =>
                      editingPositionId === position._id
                        ? updateTempPosition('name', e.target.value)
                        : null
                    }
                    className={`w-full px-3 py-2 text-sm transition-all duration-200 ${
                      editingPositionId === position._id
                        ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                        : 'border border-gray-200 rounded bg-gray-50 cursor-default'
                    }`}
                    readOnly={editingPositionId !== position._id}
                    placeholder='Position name'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>
                    Description
                  </label>
                  <textarea
                    value={
                      editingPositionId === position._id
                        ? tempPositionDescription
                        : position.description
                    }
                    onChange={(e) =>
                      editingPositionId === position._id
                        ? updateTempPosition('description', e.target.value)
                        : null
                    }
                    className={`w-full px-3 py-2 text-sm transition-all duration-200 resize-none ${
                      editingPositionId === position._id
                        ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                        : 'border border-gray-200 rounded bg-gray-50 cursor-default'
                    }`}
                    readOnly={editingPositionId !== position._id}
                    placeholder='Position description'
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className='hidden sm:block overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Position
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Description
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {positionsToShow.length === 0 ? (
              <tr>
                <td colSpan='3' className='px-6 py-4 text-center text-gray-500'>
                  {searchQuery
                    ? 'No positions found.'
                    : 'No positions added yet'}
                </td>
              </tr>
            ) : (
              positionsToShow.map((position) => (
                <tr key={position._id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <input
                      type='text'
                      value={
                        editingPositionId === position._id
                          ? tempPositionName
                          : position?.name
                      }
                      onChange={(e) =>
                        editingPositionId === position._id
                          ? updateTempPosition('name', e.target.value)
                          : null
                      }
                      className={`w-full px-2 py-1 text-sm transition-all duration-200 ${
                        editingPositionId === position._id
                          ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                          : 'border-transparent bg-transparent cursor-default'
                      }`}
                      readOnly={editingPositionId !== position._id}
                    />
                  </td>
                  <td className='px-6 py-4'>
                    <input
                      type='text'
                      value={
                        editingPositionId === position._id
                          ? tempPositionDescription
                          : position.description
                      }
                      onChange={(e) =>
                        editingPositionId === position._id
                          ? updateTempPosition('description', e.target.value)
                          : null
                      }
                      className={`w-full px-2 py-1 text-sm transition-all duration-200 ${
                        editingPositionId === position._id
                          ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                          : 'border-transparent bg-transparent cursor-default'
                      }`}
                      readOnly={editingPositionId !== position._id}
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex space-x-2'>
                      {editingPositionId === position._id ? (
                        <>
                          <button
                            onClick={saveEditing}
                            className='text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors'
                            title='Save changes'
                          >
                            <Check className='w-4 h-4' />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                            title='Cancel editing'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                            onClick={() => startEditing(position)}
                            title='Edit position'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => deletePosition(position._id)}
                            className='text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors'
                            title='Delete position'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredPositions.length > visibleCount && (
        <div className='p-4 text-center'>
          <button
            className='text-orange-500 hover:text-orange-600 font-medium'
            onClick={() => setVisibleCount((prevCount) => prevCount + 15)}
          >
            View More ({filteredPositions.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default EditContestPositionSetup;
