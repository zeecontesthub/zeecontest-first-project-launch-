import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

const EditContestContestantList = ({
  contestants,
  positions,
  editingContestantId,
  tempContestantData,
  contestantImageUploading,
  contestantImageInputRef,
  setIsContestantPopupOpen,
  handleContestantImageClick,
  handleContestantImageChange,
  updateTempContestant,
  saveEditingContestant,
  cancelEditingContestant,
  startEditingContestant,
  deleteContestant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredContestants = contestants.filter(
    (contestant) =>
      contestant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contestant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contestant.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contestantsToShow = filteredContestants.slice(0, visibleCount);

  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
      <div className='p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <h2 className='text-lg font-semibold text-gray-900'>Contestant List</h2>
        <input
          type='text'
          placeholder='Search by name, email, or position...'
          className='w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto'
          onClick={() => setIsContestantPopupOpen(true)}
        >
          Add Contestant
        </button>
      </div>

      {/* Mobile Card View */}
      <div className='block sm:hidden'>
        {contestantsToShow.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            No contestants found.
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {contestantsToShow.map((contestant) => (
              <div key={contestant?._id} className='p-4 space-y-3'>
                <div className='flex items-start gap-4'>
                  {/* Image */}
                  <div className='relative w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden'>
                    {contestantImageUploading &&
                    editingContestantId === contestant._id ? (
                      <div className='flex items-center justify-center'>
                        <svg
                          className='w-6 h-6 animate-spin text-orange-500'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8v8H4z'
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      (editingContestantId === contestant._id
                        ? tempContestantData.image
                        : contestant?.image) && (
                        <img
                          src={
                            typeof (editingContestantId === contestant._id
                              ? tempContestantData.image
                              : contestant?.image) === 'string'
                              ? editingContestantId === contestant._id
                                ? tempContestantData.image
                                : contestant?.image
                              : URL.createObjectURL(
                                  editingContestantId === contestant._id
                                    ? tempContestantData.image
                                    : contestant?.image
                                )
                          }
                          alt={
                            editingContestantId === contestant._id
                              ? tempContestantData.name
                              : contestant?.name
                          }
                          className='w-full h-full object-cover'
                        />
                      )
                    )}
                    {!(
                      (editingContestantId === contestant._id
                        ? tempContestantData.image
                        : contestant?.image) &&
                      !contestantImageUploading &&
                      editingContestantId !== contestant._id
                    ) && (
                      <span className='text-gray-600 text-base font-medium'>
                        {(editingContestantId === contestant._id
                          ? tempContestantData.name
                          : contestant?.name
                        )?.charAt(0) || '?'}
                      </span>
                    )}
                    {/* Edit button for image */}
                    {editingContestantId === contestant._id && (
                      <button
                        onClick={handleContestantImageClick}
                        className='absolute bottom-0 right-0 w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-black bg-white hover:bg-gray-100 text-sm'
                        disabled={contestantImageUploading}
                      >
                        +
                      </button>
                    )}
                  </div>
                  {/* Name and Actions */}
                  <div className='flex-1 flex flex-col'>
                    <div className='flex items-center justify-between'>
                      <input
                        type='text'
                        value={
                          editingContestantId === contestant._id
                            ? tempContestantData.name
                            : contestant?.name
                        }
                        onChange={(e) => {
                          if (editingContestantId === contestant._id) {
                            console.log(`Updating name to: ${e.target.value}`);
                            updateTempContestant('name', e.target.value);
                          }
                        }}
                        className={`font-semibold text-gray-900 w-full text-sm transition-all duration-200 ${
                          editingContestantId === contestant._id
                            ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                            : 'border-transparent bg-transparent cursor-default'
                        }`}
                        readOnly={editingContestantId !== contestant._id}
                      />
                      {/* Actions */}
                      <div className='flex-shrink-0 flex space-x-2'>
                        {editingContestantId === contestant._id ? (
                          <>
                            <button
                              onClick={() => {
                                console.log('Saving contestant...');
                                saveEditingContestant();
                              }}
                              className='text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors'
                              title='Save changes'
                              disabled={contestantImageUploading}
                            >
                              <Check className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => {
                                console.log('Cancelling edit...');
                                cancelEditingContestant();
                              }}
                              className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                              title='Cancel editing'
                              disabled={contestantImageUploading}
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                              onClick={() => {
                                console.log(
                                  'Starting edit for contestant:',
                                  contestant._id
                                );
                                startEditingContestant(contestant);
                              }}
                              title='Edit contestant'
                            >
                              <Edit2 className='w-4 h-4' />
                            </button>
                            <button
                              className='text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors'
                              onClick={() => deleteContestant(contestant._id)}
                              title='Delete contestant'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden file input for image */}
                <input
                  type='file'
                  accept='image/*'
                  ref={contestantImageInputRef}
                  onChange={handleContestantImageChange}
                  className='hidden'
                  disabled={contestantImageUploading}
                />

                {/* Email Field */}
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={
                      editingContestantId === contestant._id
                        ? tempContestantData.email
                        : contestant?.email
                    }
                    onChange={(e) => {
                      if (editingContestantId === contestant._id) {
                        console.log(`Updating email to: ${e.target.value}`);
                        updateTempContestant('email', e.target.value);
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm transition-all duration-200 ${
                      editingContestantId === contestant._id
                        ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                        : 'border border-gray-200 rounded bg-gray-50 cursor-default'
                    }`}
                    readOnly={editingContestantId !== contestant._id}
                  />
                </div>

                {/* Position Field */}
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>
                    Position
                  </label>
                  {editingContestantId === contestant._id ? (
                    <select
                      value={tempContestantData.position}
                      onChange={(e) => {
                        console.log(`Updating position to: ${e.target.value}`);
                        updateTempContestant('position', e.target.value);
                      }}
                      className='w-full px-3 py-2 text-sm border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                    >
                      <option value=''>Select Position</option>
                      {positions.map((pos) => (
                        <option key={pos._id} value={pos.name}>
                          {pos.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className='w-full px-3 py-2 text-sm border border-gray-200 rounded bg-gray-50 truncate'>
                      {contestant?.position}
                    </div>
                  )}
                </div>

                {/* Bio Field */}
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>
                    Bio
                  </label>
                  <textarea
                    value={
                      editingContestantId === contestant._id
                        ? tempContestantData.bio
                        : contestant.bio
                    }
                    onChange={(e) => {
                      if (editingContestantId === contestant._id) {
                        console.log(`Updating bio to: ${e.target.value}`);
                        updateTempContestant('bio', e.target.value);
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm transition-all duration-200 resize-none ${
                      editingContestantId === contestant._id
                        ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                        : 'border border-gray-200 rounded bg-gray-50 cursor-default'
                    }`}
                    readOnly={editingContestantId !== contestant._id}
                    placeholder='Contestant bio'
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className='overflow-x-auto hidden sm:block'>
        <div className='inline-block min-w-full align-middle'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                  Image
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                  Position
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Bio
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {contestantsToShow.map((contestant) => (
                <tr key={contestant?._id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='relative w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0'>
                      {contestantImageUploading &&
                      editingContestantId === contestant._id ? (
                        <div className='flex items-center justify-center'>
                          <svg
                            className='w-4 h-4 animate-spin text-orange-500'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8v8H4z'
                            ></path>
                          </svg>
                        </div>
                      ) : (
                        (editingContestantId === contestant._id
                          ? tempContestantData.image
                          : contestant?.image) && (
                          <img
                            src={
                              typeof (editingContestantId === contestant._id
                                ? tempContestantData.image
                                : contestant?.image) === 'string'
                                ? editingContestantId === contestant._id
                                  ? tempContestantData.image
                                  : contestant?.image
                                : URL.createObjectURL(
                                    editingContestantId === contestant._id
                                      ? tempContestantData.image
                                      : contestant?.image
                                  )
                            }
                            alt={
                              editingContestantId === contestant._id
                                ? tempContestantData.name
                                : contestant?.name
                            }
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        )
                      )}
                      {!(
                        (editingContestantId === contestant._id
                          ? tempContestantData.image
                          : contestant?.image) &&
                        !contestantImageUploading &&
                        editingContestantId !== contestant._id
                      ) && (
                        <span className='text-gray-600 text-xs font-medium'>
                          {(editingContestantId === contestant._id
                            ? tempContestantData.name
                            : contestant?.name
                          )?.charAt(0) || '?'}
                        </span>
                      )}

                      {/* Edit button for image */}
                      {editingContestantId === contestant._id && (
                        <button
                          onClick={handleContestantImageClick}
                          className='absolute -bottom-1 w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-black bg-white hover:bg-gray-100 text-xs'
                          disabled={contestantImageUploading}
                        >
                          +
                        </button>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      type='file'
                      accept='image/*'
                      ref={contestantImageInputRef}
                      onChange={handleContestantImageChange}
                      className='hidden'
                      disabled={contestantImageUploading}
                    />
                  </td>
                  <td className='px-6 py-4 text-sm text-left font-medium text-gray-900 whitespace-nowrap'>
                    <input
                      type='text'
                      value={
                        editingContestantId === contestant._id
                          ? tempContestantData.name
                          : contestant?.name
                      }
                      onChange={(e) => {
                        if (editingContestantId === contestant._id) {
                          console.log(`Updating name to: ${e.target.value}`);
                          updateTempContestant('name', e.target.value);
                        }
                      }}
                      className={`w-full min-w-[120px] py-1 text-sm transition-all duration-200 ${
                        editingContestantId === contestant._id
                          ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                          : 'border-transparent bg-transparent cursor-default'
                      }`}
                      readOnly={editingContestantId !== contestant._id}
                    />
                  </td>
                  <td className='px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap'>
                    <input
                      type='email'
                      value={
                        editingContestantId === contestant._id
                          ? tempContestantData.email
                          : contestant?.email
                      }
                      onChange={(e) => {
                        if (editingContestantId === contestant._id) {
                          console.log(`Updating email to: ${e.target.value}`);
                          updateTempContestant('email', e.target.value);
                        }
                      }}
                      className={`w-full min-w-[120px] py-1 text-sm transition-all duration-200 ${
                        editingContestantId === contestant._id
                          ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                          : 'border-transparent bg-transparent cursor-default'
                      }`}
                      readOnly={editingContestantId !== contestant._id}
                    />
                  </td>
                  <td className='px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap'>
                    {editingContestantId === contestant._id ? (
                      <select
                        value={tempContestantData.position}
                        onChange={(e) => {
                          console.log(
                            `Updating position to: ${e.target.value}`
                          );
                          updateTempContestant('position', e.target.value);
                        }}
                        className='w-full min-w-[120px] py-1 text-sm border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                      >
                        <option value=''>Select Position</option>
                        {positions.map((pos) => (
                          <option key={pos._id} value={pos.name}>
                            {pos.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className='max-w-[120px] truncate'>
                        {contestant?.position}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4 text-sm text-left text-gray-500 whitespace-nowrap'>
                    <input
                      type='text'
                      value={
                        editingContestantId === contestant._id
                          ? tempContestantData.bio
                          : contestant.bio
                      }
                      onChange={(e) => {
                        if (editingContestantId === contestant._id) {
                          console.log(`Updating bio to: ${e.target.value}`);
                          updateTempContestant('bio', e.target.value);
                        }
                      }}
                      className={`w-full min-w-[150px] py-1 text-sm transition-all duration-200 ${
                        editingContestantId === contestant._id
                          ? 'border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white'
                          : 'border-transparent bg-transparent cursor-default'
                      }`}
                      readOnly={editingContestantId !== contestant._id}
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex text-left space-x-2'>
                      {editingContestantId === contestant._id ? (
                        <>
                          <button
                            onClick={() => {
                              console.log('Saving contestant...');
                              saveEditingContestant();
                            }}
                            className='text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors'
                            title='Save changes'
                            disabled={contestantImageUploading}
                          >
                            <Check className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => {
                              console.log('Cancelling edit...');
                              cancelEditingContestant();
                            }}
                            className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                            title='Cancel editing'
                            disabled={contestantImageUploading}
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className='text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors'
                            onClick={() => {
                              console.log(
                                'Starting edit for contestant:',
                                contestant._id
                              );
                              startEditingContestant(contestant);
                            }}
                            title='Edit contestant'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                          <button
                            className='text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors'
                            onClick={() => deleteContestant(contestant._id)}
                            title='Delete contestant'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contestantsToShow.length === 0 && (
            <div className='p-6 text-center text-gray-500'>
              No contestants found.
            </div>
          )}
        </div>
      </div>
      {filteredContestants.length > visibleCount && (
        <div className='p-4 text-center'>
          <button
            className='text-orange-500 hover:text-orange-600 font-medium'
            onClick={() => setVisibleCount((prevCount) => prevCount + 15)}
          >
            View More ({filteredContestants.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default EditContestContestantList;
