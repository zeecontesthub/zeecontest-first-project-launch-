import React, { useState } from 'react';
import { uploadToCloudinary } from '../actions/cloudinaryAction';
import { X } from 'lucide-react';

const ContestantPopup = ({ isOpen, onClose, onAddContestant, positions }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && position) {
      onAddContestant({ name, position, bio, image: imageFile, email });
      setName('');
      setPosition('');
      setBio('');
      setImageFile(null);
      setEmail('');
      onClose();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const imgURL = await uploadToCloudinary(file);
        setImageFile(imgURL);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-[#000000]/50 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96 relative'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors'
          aria-label='Close'
        >
          <X size={24} />
        </button>
        <h2 className='text-xl font-semibold mb-6'>Add Contestant</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium mb-1 text-gray-700'
            >
              Name
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
              required
              disabled={isUploading}
            />
          </div>
          <div>
            <label
              htmlFor='position'
              className='block text-sm font-medium mb-1 text-gray-700'
            >
              Position
            </label>
            <select
              id='position'
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
              required
              disabled={isUploading}
            >
              <option value=''>Select position</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.name}>
                  {pos.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor='bio'
              className='block text-sm font-medium mb-1 text-gray-700'
            >
              Bio
            </label>
            <textarea
              id='bio'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
              rows={3}
              disabled={isUploading}
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium mb-1 text-gray-700'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none'
              disabled={isUploading}
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1 text-gray-700'>
              Upload Image
            </label>
            <div className='relative'>
              <input
                type='text'
                readOnly
                value={
                  isUploading
                    ? 'Uploading...'
                    : imageFile
                    ? 'Image uploaded' // Simpler display
                    : ''
                }
                placeholder='No file chosen'
                className={`w-full border border-gray-300 rounded-md px-3 py-3 pr-28 ${
                  isUploading ? 'text-gray-400 italic' : ''
                } outline-none`}
              />
              <button
                type='button'
                onClick={() =>
                  !isUploading &&
                  document.getElementById('image-upload-input').click()
                }
                disabled={isUploading}
                className={`absolute right-1 top-1 bottom-1 px-4 py-2 rounded-md font-medium text-sm ${
                  isUploading
                    ? 'bg-orange-300 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                } transition-colors`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <input
                id='image-upload-input'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
              />
            </div>
          </div>
          <div className='flex justify-end space-x-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={isUploading}
              className={`px-6 py-2 rounded-md font-medium text-gray-700 transition-colors ${
                isUploading
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isUploading}
              className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
                isUploading
                  ? 'bg-orange-300 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isUploading ? 'Please wait...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContestantPopup;
