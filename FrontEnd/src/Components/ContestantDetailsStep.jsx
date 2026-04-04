import React, { useState } from 'react';
import { FileText, Loader2, User, Mail, MapPin, FileImage, Plus, Trash2, Edit3, CheckCircle, Info } from 'lucide-react';
import convertGoogleDriveUrl from '../actions/convertGoogleDriveUrl';

const ContestantDetailsStep = ({
  contestantForm = {
    name: '',
    bio: '',
    position: '',
    email: '',
    image: null,
  },
  onContestantInputChange = () => { },
  onContestantImageUpload = () => { },
  onAddContestant = () => { },
  onRemoveContestant = () => { },
  onEditContestant = () => { },
  onCancelEdit = () => { },
  editingId = null,
  contestants = [],
  onBulkUpload = () => { },
  handleDragOver = (e) => e.preventDefault(),
  handleDrop = () => { },
  positions = [],
  isUploading = false,
  onAddPosition = () => { },
  onRemovePosition = () => { },
  onUpdatePosition = () => { },
}) => {
  const [editPosIndex, setEditPosIndex] = useState(null);

  const isFormValid =
    contestantForm.name.trim() !== '' && contestantForm.position.trim() !== '';

  const isAddButtonDisabled = isUploading || !isFormValid;

  return (
    <div className='relative space-y-8 animate-in fade-in duration-500'>

      {/* 1. Position Setup Section */}
      <div className='bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-xl shadow-sm border border-orange-50'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
          <h2 className='text-xl sm:text-2xl text-left font-bold text-gray-900 flex items-center gap-2'>
            <span className='w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm'>1</span>
            Positions
          </h2>
          <button
            onClick={onAddPosition}
            className='flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md'
          >
            <Plus size={18} /> Add New Position
          </button>
        </div>

        {positions.length === 0 ? (
          <div className='bg-white border-2 border-dashed border-gray-200 rounded-xl p-10 text-center'>
            <Info className='mx-auto h-10 w-10 text-gray-300 mb-3' />
            <p className='text-gray-500 font-medium'>No positions created yet. Start by adding a position like "President" or "Senator".</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {positions.map((pos, index) => (
              <div key={index} className='bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group'>
                {editPosIndex === index ? (
                  <div className='space-y-3'>
                    <input
                      type='text'
                      value={pos.name}
                      onChange={(e) => onUpdatePosition(index, 'name', e.target.value)}
                      className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold'
                      autoFocus
                    />
                    <input
                      type='text'
                      value={pos.description}
                      onChange={(e) => onUpdatePosition(index, 'description', e.target.value)}
                      placeholder='Description (optional)'
                      className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none text-xs'
                    />
                    <button onClick={() => setEditPosIndex(null)} className='w-full py-1.5 bg-green-500 text-white rounded text-xs font-bold'>Save</button>
                  </div>
                ) : (
                  <>
                    <div className='pr-16'>
                      <h4 className='font-bold text-gray-900 truncate'>{pos.name}</h4>
                      <p className='text-xs text-gray-500 truncate mt-1'>{pos.description || 'No description'}</p>
                    </div>
                    <div className='absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button onClick={() => setEditPosIndex(index)} className='p-1.5 text-gray-400 hover:text-blue-500'><Edit3 size={16} /></button>
                      <button onClick={() => onRemovePosition(index)} className='p-1.5 text-gray-400 hover:text-red-500'><Trash2 size={16} /></button>
                    </div>
                    <div className='mt-4 flex items-center gap-2'>
                      <span className='px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold uppercase'>
                        {contestants.filter(c => c.position === pos.name).length} Contestants
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Participants Section */}
      <div className='bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-xl shadow-sm border border-orange-50'>
        <div className='flex flex-col lg:flex-row gap-10'>

          {/* Left Side: Manual Entry & Bulk Upload Toggle */}
          <div className='lg:w-1/2 space-y-8'>
            <div className={`p-6 rounded-xl border transition-all ${editingId ? 'bg-orange-50 border-orange-200' : 'bg-white border-transparent'}`}>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl text-left font-bold text-gray-900 flex items-center gap-2'>
                  <span className='w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm'>2</span>
                  {editingId ? 'Edit Participant' : 'Add Participants'}
                </h2>
                {editingId && (
                  <button onClick={onCancelEdit} className='text-xs font-bold text-orange-600 hover:underline'>CANCEL EDIT</button>
                )}
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-left text-sm font-bold text-gray-700 mb-2'>Contestant Name *</label>
                  <input
                    type='text'
                    value={contestantForm.name || ''}
                    onChange={(e) => onContestantInputChange('name', e.target.value)}
                    placeholder='Full Name'
                    className='w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-left text-sm font-bold text-gray-700 mb-2'>Position *</label>
                    <select
                      value={contestantForm.position || ''}
                      onChange={(e) => onContestantInputChange('position', e.target.value)}
                      className='w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all'
                    >
                      <option value=''>Select...</option>
                      {positions.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className='block text-left text-sm font-bold text-gray-700 mb-2'>Email (Optional)</label>
                    <input
                      type='email'
                      value={contestantForm.email || ''}
                      onChange={(e) => onContestantInputChange('email', e.target.value)}
                      placeholder='email@example.com'
                      className='w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-left text-sm font-bold text-gray-700 mb-3'>Avatar / Profile Photo</label>
                  <div className='flex items-center gap-5 p-4 bg-gray-50/50 border border-gray-100 rounded-xl'>
                    <div className='relative group'>
                      <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-inner transition-all flex items-center justify-center bg-white ${isUploading ? 'border-orange-300' : 'border-gray-200'}`}>
                        {isUploading ? (
                          <div className='absolute inset-0 bg-white/60 flex items-center justify-center animate-in fade-in'>
                            <Loader2 className='h-6 w-6 text-orange-500 animate-spin' />
                          </div>
                        ) : contestantForm.image ? (
                          <img
                            src={typeof contestantForm.image === 'string' ? convertGoogleDriveUrl(contestantForm.image) : URL.createObjectURL(contestantForm.image)}
                            className='w-full h-full object-cover animate-in zoom-in-90'
                            alt='Preview'
                          />
                        ) : (
                          <User className='h-8 w-8 text-gray-300' />
                        )}
                      </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                      <button
                        type="button"
                        onClick={() => !isUploading && document.getElementById('contestant-image-input').click()}
                        disabled={isUploading}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                            contestantForm.image ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' : 'bg-teal-600 text-white hover:bg-teal-700'
                          }`}
                      >
                        {isUploading ? 'Uploading...' : contestantForm.image ? 'Change Photo' : 'Add Photo'}
                      </button>
                      <p className='text-[10px] text-gray-400 font-medium px-1'>
                        {isUploading ? 'Securing image to server...' : contestantForm.image ? 'Image ready' : 'JPG, PNG or GIF allowed'}
                      </p>
                    </div>
                    <input id='contestant-image-input' type='file' accept='image/*' className='hidden' onChange={(e) => !isUploading && onContestantImageUpload(e.target.files[0])} />
                  </div>
                </div>

                <button
                  onClick={onAddContestant}
                  disabled={isAddButtonDisabled}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${isAddButtonDisabled ? 'bg-gray-200 text-gray-400' : 'bg-orange-500 text-white active:scale-95 shadow-md shadow-orange-200'}`}
                >
                  {editingId ? 'Update Participant' : 'Add to List'}
                </button>
              </div>
            </div>

            {!editingId && (
              <div className='pt-8 border-t border-gray-200'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-bold text-gray-900'>Want to save time?</h3>
                  <span className='px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase'>Recommended</span>
                </div>
                <div
                  className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer'
                  onClick={() => document.getElementById('bulk-upload-input').click()}
                >
                  <FileText className='mx-auto h-10 w-10 text-orange-400 mb-3' />
                  <p className='text-sm font-bold text-gray-700'>Bulk Upload Contestants</p>
                  <p className='text-xs text-gray-500 mt-1 italic'>Upload CSV with Name, Position, Bio, and Email</p>
                  <input id='bulk-upload-input' type='file' accept='.csv' className='hidden' onChange={(e) => onBulkUpload(e.target.files[0])} />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Live List */}
          <div className='lg:w-1/2'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden min-h-full'>
              <div className='bg-gray-900 p-4 text-white flex justify-between items-center'>
                <h3 className='font-bold flex items-center gap-2'><User size={18} /> Participant List</h3>
                <span className='bg-orange-500 px-2 py-0.5 rounded text-xs font-bold'>{contestants.length}</span>
              </div>

              <div className='max-h-[500px] overflow-y-auto divide-y divide-gray-50'>
                {contestants.length === 0 ? (
                  <div className='p-20 text-center'>
                    <User className='mx-auto h-12 w-12 text-gray-100 mb-4' />
                    <p className='text-gray-400 text-sm'>No participants added yet.</p>
                  </div>
                ) : (
                  contestants.map((c, i) => (
                    <div key={i} className={`p-4 hover:bg-gray-50 flex items-center gap-4 group ${editingId === c.dateId ? 'bg-orange-50 border-orange-200' : ''}`}>
                      <img
                        src={typeof c.image === 'string' ? convertGoogleDriveUrl(c.image) : (c.image ? URL.createObjectURL(c.image) : 'https://via.placeholder.com/150')}
                        className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm'
                        alt=''
                      />
                      <div className='flex-1 min-w-0'>
                        <h5 className='font-bold text-gray-900 truncate'>{c.name}</h5>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase'>{c.position}</span>
                          {c.email && <span className='text-[10px] text-gray-400 truncate'>{c.email}</span>}
                        </div>
                      </div>
                      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all'>
                        <button
                          onClick={() => onEditContestant(c)}
                          className='p-1.5 text-gray-400 hover:text-blue-500'
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => onRemoveContestant(c.position, c.dateId)}
                          className='p-1.5 text-gray-300 hover:text-red-500'
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContestantDetailsStep;
