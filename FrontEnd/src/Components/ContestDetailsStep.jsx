import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from "lucide-react";

// Mock DatePicker component since react-datepicker isn't available
const DatePicker = ({
  selected,
  onChange,
  minDate,
  dateFormat,
  className,
  placeholderText,
}) => {
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      onChange(new Date(value));
    } else {
      onChange(null);
    }
  };

  return (
    <input
      type='date'
      value={selected ? formatDate(selected) : ''}
      onChange={handleDateChange}
      min={minDate ? formatDate(minDate) : ''}
      className={className}
      placeholder={placeholderText}
    />
  );
};

const ContestDetailsStep = ({
  formData = {
    contestName: '',
    contestDescription: '',
    startDate: null,
    endDate: null,
    startTime: { startTimeHour: '', startTimeMinute: '', startTimeAmPm: 'AM' },
    endTime: { endTimeHour: '', endTimeMinute: '', endTimeAmPm: 'AM' },
    socialLinks: { instagram: '', x: '', website: '' },
  },
  onInputChange = () => { },
  setCreateContest = () => { },
  coverImage,
  logoImage,
  onFileUpload = () => { },
  isUploading = false,
}) => {
  const [showSocial, setShowSocial] = useState(false);

  const FileUploadArea = ({ type, title, file }) => (
    <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-6'>
      <h3 className='text-sm font-semibold text-gray-900 mb-4 lowercase first-letter:uppercase'>
        {title}
      </h3>

      <div
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all group ${isUploading ? 'border-orange-200 bg-orange-50/10' :
            file ? 'border-orange-400 bg-white' : 'border-gray-200 hover:border-orange-400 bg-white'
          }`}
        style={{ minHeight: '160px' }}
      >
        <input
          id={`file-input-${type}`}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => !isUploading && onFileUpload(e.target.files[0], type)}
        />

        {isUploading ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 animate-in fade-in'>
            <div className='w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3'></div>
            <p className='text-xs font-bold text-orange-600 animate-pulse'>Uploading Image...</p>
          </div>
        ) : file ? (
          <div className='relative w-full h-full min-h-[160px] group animate-in zoom-in-95 duration-300'>
            <img
              src={typeof file === 'string' ? file : URL.createObjectURL(file)}
              alt={title}
              className='w-full h-full object-cover max-h-[220px]'
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3'>
              <button
                onClick={() => document.getElementById(`file-input-${type}`).click()}
                className='px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold shadow-xl hover:bg-orange-50 transition-colors transform hover:scale-105 active:scale-95'
              >
                Replace Image
              </button>
            </div>
          </div>
        ) : (
          <div
            className='flex flex-col items-center justify-center p-8 cursor-pointer w-full h-full min-h-[160px]'
            onClick={() => document.getElementById(`file-input-${type}`).click()}
          >
            <div className='w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors'>
              <FileText className='h-6 w-6 text-orange-500' />
            </div>
            <p className='text-sm font-bold text-gray-900 mb-1'>Drag or tap to upload</p>
            <p className='text-xs text-gray-500 italic font-medium'>Only image files allowed</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      {/* Identity & Branding */}
      <div className='bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-xl shadow-sm border border-orange-50'>
        <h2 className='text-xl sm:text-2xl text-left font-bold text-gray-900 mb-6 flex items-center gap-2'>
          <span className='w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm'>1</span>
          Contest Identity
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            {/* Contest Name */}
            <div>
              <label className='block text-left text-sm font-bold text-gray-700 mb-2'>
                Contest Name
              </label>
              <input
                type='text'
                value={formData.contestName}
                onChange={(e) => {
                  onInputChange('contestName', e.target.value);
                  setCreateContest((prev) => ({ ...prev, title: e.target.value }));
                }}
                placeholder='e.g. Annual Student Election'
                className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all'
              />
            </div>

            {/* Contest Description */}
            <div>
              <label className='block text-sm text-left font-bold text-gray-700 mb-2'>
                Contest Description
              </label>
              <textarea
                value={formData.contestDescription}
                onChange={(e) => {
                  onInputChange('contestDescription', e.target.value);
                  setCreateContest((prev) => ({ ...prev, description: e.target.value }));
                }}
                placeholder='What is this contest about?'
                rows={5}
                className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none'
              />
            </div>
          </div>

          <div>
            <FileUploadArea type='cover' title='Cover Image (Banner)' file={coverImage} />
            <FileUploadArea type='logo' title='Contest Logo' file={logoImage} />
          </div>
        </div>
      </div>

      {/* Schedule & Timing */}
      <div className='bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 rounded-xl shadow-sm border border-orange-50'>
        <h2 className='text-xl text-left font-bold text-gray-900 mb-6 flex items-center gap-2'>
          <span className='w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm'>2</span>
          Contest Schedule
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Start Date/Time */}
          <div className='p-6 bg-white rounded-xl border border-gray-100'>
            <h3 className='text-sm font-bold text-orange-600 uppercase tracking-widest mb-4'>Start Details</h3>
            <div className='space-y-4'>
              <DatePicker
                selected={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(date) => onInputChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                minDate={new Date()}
                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
              />
              <div className='flex gap-2'>
                <select
                  className='flex-1 px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none'
                  value={formData?.startTime?.startTimeHour || ''}
                  onChange={(e) => onInputChange('startTime', { ...formData.startTime, startTimeHour: e.target.value })}
                >
                  <option value=''>HH</option>
                  {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                </select>
                <select
                  className='flex-1 px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none'
                  value={formData?.startTime?.startTimeMinute || ''}
                  onChange={(e) => onInputChange('startTime', { ...formData.startTime, startTimeMinute: e.target.value })}
                >
                  <option value=''>MM</option>
                  {[...Array(60)].map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                </select>
                <select
                  className='px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none'
                  value={formData?.startTime?.startTimeAmPm || 'AM'}
                  onChange={(e) => onInputChange('startTime', { ...formData.startTime, startTimeAmPm: e.target.value })}
                >
                  <option value='AM'>AM</option>
                  <option value='PM'>PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* End Date/Time */}
          <div className='p-6 bg-white rounded-xl border border-gray-100'>
            <h3 className='text-sm font-bold text-orange-600 uppercase tracking-widest mb-4'>End Details</h3>
            <div className='space-y-4'>
              <DatePicker
                selected={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(date) => onInputChange('endDate', date ? date.toISOString().split('T')[0] : '')}
                minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none'
              />
              <div className='flex gap-2'>
                <select
                  className='flex-1 px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none'
                  value={formData?.endTime?.endTimeHour || ''}
                  onChange={(e) => onInputChange('endTime', { ...formData.endTime, endTimeHour: e.target.value })}
                >
                  <option value=''>HH</option>
                  {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                </select>
                <select
                  className='flex-1 px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none'
                  value={formData?.endTime?.endTimeMinute || ''}
                  onChange={(e) => onInputChange('endTime', { ...formData.endTime, endTimeMinute: e.target.value })}
                >
                  <option value=''>MM</option>
                  {[...Array(60)].map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                </select>
                <select
                  className='px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none'
                  value={formData?.endTime?.endTimeAmPm || 'AM'}
                  onChange={(e) => onInputChange('endTime', { ...formData.endTime, endTimeAmPm: e.target.value })}
                >
                  <option value='AM'>AM</option>
                  <option value='PM'>PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Social Links (Collapsible) */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <button
          onClick={() => setShowSocial(!showSocial)}
          className='w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors'
        >
          <span className='font-bold text-gray-700'>Social Links (Optional)</span>
          {showSocial ? <ChevronUp /> : <ChevronDown />}
        </button>

        {showSocial && (
          <div className='p-6 bg-gray-50 border-t border-gray-100 space-y-4'>
            <input
              type='url'
              value={formData.socialLinks?.instagram || ''}
              onChange={(e) => onInputChange('socialLinks', { ...formData.socialLinks, instagram: e.target.value })}
              placeholder='Instagram Profile URL'
              className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg'
            />
            <input
              type='url'
              value={formData.socialLinks?.x || ''}
              onChange={(e) => onInputChange('socialLinks', { ...formData.socialLinks, x: e.target.value })}
              placeholder='X (Twitter) Profile URL'
              className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg'
            />
            <input
              type='url'
              value={formData.socialLinks?.website || ''}
              onChange={(e) => onInputChange('socialLinks', { ...formData.socialLinks, website: e.target.value })}
              placeholder='Official Website URL'
              className='w-full px-4 py-3 bg-white border border-gray-200 rounded-lg'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestDetailsStep;
