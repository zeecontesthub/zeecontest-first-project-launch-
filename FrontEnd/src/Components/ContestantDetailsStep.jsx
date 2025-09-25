import React, { useState } from 'react';
import { FileText, Mail, MapPin, X } from 'lucide-react';

const ContestantDetailsStep = ({
  contestantForm = {
    name: '',
    bio: '',
    position: '',
    email: '',
    image: null,
  },
  onContestantInputChange = () => {},
  onContestantImageUpload = () => {},
  onAddContestant = () => {},
  positions = [],
}) => {
  // Local state for managing contestants, uploads, and the mapping dialog
  const [contestants, setContestants] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [csvPreview, setCsvPreview] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [bulkImages, setBulkImages] = useState([]);

  // Helper function to update the main contestant list
  const updateContestantList = (newContestants) => {
    setContestants((prevContestants) => [
      ...prevContestants,
      ...newContestants,
    ]);
  };

  // Function to remove a contestant by their unique ID
  const handleRemoveContestant = (contestantId) => {
    setContestants(
      contestants.filter((contestant) => contestant.dateId !== contestantId)
    );
  };

  // Parses CSV content into an object with headers and rows
  const parseCSV = (content) => {
    const lines = content.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return null;

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map((line) => {
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/"/g, ''));
      return values;
    });

    return {
      headers,
      rows: rows.filter((row) => row.some((cell) => cell.trim())),
    };
  };

  // Automatically detects column mapping based on common header names
  const detectColumnMapping = (headers) => {
    const mapping = {};
    headers.forEach((header, index) => {
      const lowerHeader = header.toLowerCase().trim();
      if (
        lowerHeader.includes('name') ||
        lowerHeader === 'contestant' ||
        lowerHeader === 'full name'
      ) {
        mapping.name = index;
      } else if (
        lowerHeader.includes('position') ||
        lowerHeader.includes('title') ||
        lowerHeader.includes('role')
      ) {
        mapping.position = index;
      } else if (
        lowerHeader.includes('bio') ||
        lowerHeader.includes('description') ||
        lowerHeader.includes('about')
      ) {
        mapping.bio = index;
      } else if (
        lowerHeader.includes('email') ||
        lowerHeader.includes('mail')
      ) {
        mapping.email = index;
      } else if (
        lowerHeader.includes('image') ||
        lowerHeader.includes('photo') ||
        lowerHeader.includes('picture')
      ) {
        mapping.image = index;
      }
    });
    return mapping;
  };

  // Main handler for CSV file upload
  const handleCSVUpload = (file) => {
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        if (!parsed) {
          alert(
            'Invalid CSV format. Please ensure your file has headers and data rows.'
          );
          setIsUploading(false);
          return;
        }

        const autoMapping = detectColumnMapping(parsed.headers);

        if (
          autoMapping.name !== undefined &&
          autoMapping.position !== undefined
        ) {
          processBulkData(parsed.rows, autoMapping);
        } else {
          setCsvData(parsed.rows);
          setCsvPreview(parsed);
          setColumnMapping(autoMapping);
          setShowMappingDialog(true);
        }
        setIsUploading(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format and try again.');
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file.');
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  // Processes bulk data with a confirmed column mapping
  const processBulkData = (rows, mapping) => {
    const processedContestants = rows
      .map((row, index) => {
        const contestant = {
          name: mapping.name !== undefined ? row[mapping.name] || '' : '',
          position:
            mapping.position !== undefined ? row[mapping.position] || '' : '',
          bio: mapping.bio !== undefined ? row[mapping.bio] || '' : '',
          email: mapping.email !== undefined ? row[mapping.email] || '' : '',
          image: null,
          dateId: `bulk-${Date.now()}-${index}`,
        };

        if (mapping.image !== undefined && row[mapping.image]) {
          const imageName = row[mapping.image].trim();
          const matchingImage = bulkImages.find(
            (img) =>
              img.name.toLowerCase().includes(imageName.toLowerCase()) ||
              imageName
                .toLowerCase()
                .includes(img.name.toLowerCase().split('.')[0])
          );
          if (matchingImage) {
            contestant.image = matchingImage;
          }
        }
        return contestant;
      })
      .filter((c) => c.name && c.position);

    updateContestantList(processedContestants);

    // Reset state after successful import
    setCsvPreview(null);
    setShowMappingDialog(false);
    setColumnMapping({});
    setCsvData([]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (isUploading) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleCSVUpload(files[0]);
    }
  };

  const handleMappingConfirm = () => {
    if (
      columnMapping.name === undefined ||
      columnMapping.position === undefined
    ) {
      alert('Please map at least Name and Position columns.');
      return;
    }
    processBulkData(csvData, columnMapping);
  };

  return (
    <div className='relative space-y-6 sm:space-y-8 bg-[#FBF7F7] p-4 sm:p-6 lg:p-10'>
      {/* Manual Contestant Entry */}
      <div>
        <h2 className='text-lg sm:text-xl text-left font-semibold text-gray-900 mb-4 sm:mb-6'>
          Manual Contestant Entry
        </h2>
        <div className='space-y-4 sm:space-y-6'>
          {/* Contestant Name */}
          <div>
            <label className='block text-left text-sm font-medium text-gray-700 mb-2'>
              Contestant Name
            </label>
            <input
              type='text'
              value={contestantForm.name || ''}
              onChange={(e) => onContestantInputChange('name', e.target.value)}
              placeholder='Enter Contestant Name'
              disabled={isUploading}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md outline-none transition-colors text-sm sm:text-base ${
                isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              }`}
            />
          </div>

          {/* Short Bio */}
          <div>
            <label className='block text-sm text-left font-medium text-gray-700 mb-2'>
              Short Bio
            </label>
            <textarea
              value={contestantForm.bio || ''}
              onChange={(e) => onContestantInputChange('bio', e.target.value)}
              placeholder='Enter Contest Bio'
              rows={4}
              disabled={isUploading}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md outline-none transition-colors resize-none text-sm sm:text-base ${
                isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              }`}
            />
          </div>

          {/* Position & Email - Side by side on larger screens */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
            {/* Position */}
            <div>
              <label className='block text-sm text-left font-medium text-gray-700 mb-2'>
                Position
              </label>
              <select
                value={contestantForm.position || ''}
                onChange={(e) =>
                  onContestantInputChange('position', e.target.value)
                }
                disabled={isUploading}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md outline-none transition-colors appearance-none text-sm sm:text-base ${
                  isUploading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                }`}
              >
                <option value=''>Select Position</option>
                {positions.map((position, idx) => (
                  <option key={idx} value={position.name}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm text-left font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={contestantForm.email || ''}
                onChange={(e) =>
                  onContestantInputChange('email', e.target.value)
                }
                placeholder='Enter Contestant Email'
                disabled={isUploading}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md outline-none transition-colors text-sm sm:text-base ${
                  isUploading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                }`}
              />
            </div>
          </div>

          {/* Contestant Image */}
          <div>
            <label className='block text-sm text-left font-medium text-gray-700 mb-2'>
              Contestant Image
            </label>
            <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4'>
              <div className='flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-500 truncate flex items-center justify-center min-h-[44px]'>
                {isUploading ? (
                  <div className='flex items-center space-x-2 text-gray-400 animate-pulse'>
                    <svg
                      className='w-4 h-4 sm:w-5 sm:h-5 animate-spin text-gray-400'
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
                    <span className='text-sm'>Uploading...</span>
                  </div>
                ) : (
                  <span className='text-sm'>
                    {contestantForm.image?.name ||
                      (typeof contestantForm.image === 'string'
                        ? contestantForm.image.split('/').pop()
                        : 'No file selected')}
                  </span>
                )}
              </div>

              <button
                type='button'
                disabled={isUploading}
                onClick={() =>
                  !isUploading &&
                  document.getElementById('contestant-image-input').click()
                }
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base w-full sm:w-auto ${
                  isUploading
                    ? 'bg-teal-600 text-white opacity-50 cursor-not-allowed'
                    : 'bg-teal-700 hover:bg-teal-800 text-white'
                }`}
              >
                Browse
              </button>
              <input
                id='contestant-image-input'
                type='file'
                accept='image/*'
                onChange={(e) =>
                  !isUploading && onContestantImageUpload(e.target.files[0])
                }
                className='hidden'
              />
            </div>
          </div>

          {/* Add Contestant Button */}
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onAddContestant}
              disabled={isUploading}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base w-full sm:w-auto ${
                isUploading
                  ? 'bg-orange-400 text-white opacity-50 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              Add Contestant
            </button>
          </div>
        </div>
      </div>
      {/* Bulk Upload */}
      <div>
        <h2 className='text-lg sm:text-xl font-semibold text-left text-gray-900 mb-4 sm:mb-6'>
          Bulk Upload
        </h2>

        {/* CSV Upload */}
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8'>
          <div
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 lg:p-12 text-center transition-colors cursor-pointer ${
              isUploading
                ? 'border-gray-300 cursor-not-allowed opacity-50'
                : 'hover:border-orange-400 border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() =>
              !isUploading &&
              document.getElementById('bulk-upload-input').click()
            }
          >
            <FileText className='mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 sm:mb-4' />
            <div className='space-y-2 sm:space-y-1'>
              <p className='text-sm sm:text-base text-gray-600'>
                <span className='hidden sm:inline'>
                  Drag and Drop your CSV file here
                </span>
                <span className='sm:hidden'>Tap to select CSV file</span>
              </p>
              <p className='text-xs sm:text-sm text-gray-500 hidden sm:block'>
                Or
              </p>
            </div>
            <button
              type='button'
              disabled={isUploading}
              className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base w-full sm:w-auto ${
                isUploading
                  ? 'bg-orange-400 text-white opacity-50 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                !isUploading &&
                  document.getElementById('bulk-upload-input').click();
              }}
            >
              Browse Files
            </button>
            <div className='text-xs text-gray-500 mt-3 sm:mt-4 space-y-1'>
              <p>CSV should include: Name, Position, Bio (required)</p>
              <p>Optional: Email, Image filename</p>
              <p>
                Column order doesn't matter - we'll auto-detect or let you map
                them
              </p>
            </div>
            <input
              id='bulk-upload-input'
              type='file'
              accept='.csv'
              onChange={(e) =>
                !isUploading && handleCSVUpload(e.target.files[0])
              }
              className='hidden'
            />
          </div>
        </div>
      </div>
      {/* Column Mapping Dialog */}
      {showMappingDialog && csvPreview && (
        <div className='fixed inset-0 bg-[#000000]/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Map CSV Columns
              </h3>
              <button
                onClick={() => setShowMappingDialog(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <p className='text-sm text-gray-600 mb-4'>
              Please map your CSV columns to the required fields. We've made our
              best guess, but please verify:
            </p>

            <div className='space-y-4'>
              {['name', 'position', 'bio', 'email', 'image'].map((field) => (
                <div key={field} className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2 w-20'>
                    <label
                      className={`text-sm font-medium capitalize ${
                        field === 'name' || field === 'position'
                          ? 'text-red-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {field}
                    </label>
                    {(field === 'name' || field === 'position') && (
                      <span className='text-red-500 text-xs'>*</span>
                    )}
                  </div>
                  <select
                    value={
                      columnMapping[field] !== undefined
                        ? columnMapping[field]
                        : ''
                    }
                    onChange={(e) =>
                      setColumnMapping((prev) => ({
                        ...prev,
                        [field]:
                          e.target.value === ''
                            ? undefined
                            : parseInt(e.target.value),
                      }))
                    }
                    className='flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  >
                    <option value=''>-- Select Column --</option>
                    {csvPreview.headers.map((header, index) => (
                      <option key={index} value={index}>
                        {header} (Column {index + 1})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className='mt-6'>
              <h4 className='text-md font-medium text-gray-700 mb-2'>
                Preview (first 3 rows):
              </h4>
              <div className='overflow-x-auto border border-gray-200 rounded-md'>
                <table className='min-w-full text-sm'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {csvPreview.headers.map((header, index) => (
                        <th
                          key={index}
                          className='px-3 py-2 text-left font-medium text-gray-600 border-r'
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {csvPreview.rows.slice(0, 3).map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className='px-3 py-2 text-gray-900 border-r truncate max-w-[150px]'
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className='flex justify-end space-x-3 mt-6'>
              <button
                onClick={() => setShowMappingDialog(false)}
                className='px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleMappingConfirm}
                disabled={
                  columnMapping.name === undefined ||
                  columnMapping.position === undefined
                }
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  columnMapping.name === undefined ||
                  columnMapping.position === undefined
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                Import Contestants
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Contestant List */}
      <div>
        <h2 className='text-lg sm:text-xl font-semibold text-left text-gray-900 mb-4 sm:mb-6'>
          Contestant List
        </h2>
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
          {/* Desktop Table Header - Hidden on mobile */}
          <div
            className={`hidden lg:grid ${
              columnMapping.email !== undefined ? 'grid-cols-6' : 'grid-cols-5'
            } gap-4 px-6 py-4 bg-gray-50 font-medium text-gray-700 text-sm border-b border-gray-200`}
          >
            <div>Image</div>
            <div>Name</div>
            <div>Position</div>
            {columnMapping.email !== undefined && <div>Email</div>}
            <div>Bio</div>
            <div>Actions</div>
          </div>
          {isUploading ? (
            <div className='px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base'>
              <div className='flex items-center justify-center space-x-2'>
                <svg
                  className='w-6 h-6 animate-spin text-gray-400'
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
                <p>Loading contestants...</p>
              </div>
            </div>
          ) : contestants.length === 0 ? (
            <div className='px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base'>
              No contestants added yet.
            </div>
          ) : (
            <div className='divide-y divide-gray-200'>
              {contestants.map((contestant) => (
                <div key={contestant?.dateId} className='p-4 sm:p-6'>
                  {/* Mobile Card Layout */}
                  <div className='lg:hidden'>
                    <div className='flex items-start space-x-4'>
                      {/* Avatar */}
                      <div className='flex-shrink-0'>
                        <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden'>
                          {contestant.image ? (
                            <img
                              src={
                                typeof contestant.image === 'string'
                                  ? contestant.image
                                  : URL.createObjectURL(contestant.image)
                              }
                              alt={contestant.name}
                              className='w-full h-full rounded-full object-cover'
                            />
                          ) : (
                            <span className='text-gray-600 text-sm sm:text-base font-medium'>
                              {contestant.name?.charAt(0) || 'J'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1 min-w-0'>
                            <h3 className='text-base sm:text-lg font-semibold text-gray-900 truncate'>
                              {contestant.name}
                            </h3>
                            <div className='flex items-center mt-1 text-sm text-gray-500'>
                              <MapPin className='w-4 h-4 mr-1' />
                              <span className='truncate'>
                                {contestant.position}
                              </span>
                            </div>
                            {contestant.email && (
                              <div className='flex items-center mt-1 text-sm text-gray-500'>
                                <Mail className='w-4 h-4 mr-1' />
                                <span className='truncate'>
                                  {contestant.email}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className='flex-shrink-0 ml-4'>
                            <button
                              type='button'
                              disabled={isUploading}
                              onClick={() =>
                                handleRemoveContestant(contestant.dateId)
                              }
                              className={`p-2 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 ${
                                isUploading
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
                            >
                              <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Bio */}
                        {contestant.bio && (
                          <div className='mt-3'>
                            <p className='text-sm text-gray-600 line-clamp-2'>
                              {contestant.bio}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div
                    className={`hidden lg:grid ${
                      columnMapping.email !== undefined
                        ? 'grid-cols-6'
                        : 'grid-cols-5'
                    } gap-4 items-center text-sm`}
                  >
                    <div>
                      <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden'>
                        {contestant.image ? (
                          <img
                            src={
                              typeof contestant.image === 'string'
                                ? contestant.image
                                : URL.createObjectURL(contestant.image)
                            }
                            alt={contestant.name}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        ) : (
                          <span className='text-gray-600 text-xs font-medium'>
                            {contestant.name?.charAt(0) || 'J'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-gray-900 font-medium'>
                      {contestant.name}
                    </div>
                    {columnMapping.email !== undefined && (
                      <div className='text-gray-600 truncate'>
                        {contestant.email}
                      </div>
                    )}
                    <div className='text-gray-600'>{contestant.position}</div>
                    <div className='text-gray-600 truncate'>
                      {contestant.bio}
                    </div>
                    <div className='flex items-center space-x-2'>
                      <button
                        type='button'
                        disabled={isUploading}
                        onClick={() =>
                          handleRemoveContestant(contestant.dateId)
                        }
                        className={`text-red-400 hover:text-red-600 transition-colors ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </button>
                    </div>
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

export default ContestantDetailsStep;
