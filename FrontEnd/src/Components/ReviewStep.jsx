<<<<<<< HEAD
import React from 'react';

const ReviewStep = ({ coverImage, logoImage, formData, contestants, onEditStep, onPublish }) => {
    return (
        <div className="space-y-8 bg-[#FBF7F7] p-10">
            {/* Cover Image Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Cover Images</h2>
                    <button 
                        className="text-teal-600 hover:text-black"
                        onClick={() => onEditStep(1)}
                    >
                        Edit
                    </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {coverImage ? (
                        <img 
                            src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)} 
                            alt="Cover" 
                            className="max-h-64 mx-auto rounded"
                        />
                    ) : (
                        <p className="text-gray-500 mb-2">No cover image uploaded</p>
                    )}
                </div>
            </div>

            {/* Contest Logo Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Contest Logo Image</h2>
                    <button 
                        className="text-teal-600 hover:text-black"
                        onClick={() => onEditStep(1)}
                    >
                        Edit
                    </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {logoImage ? (
                        <img 
                            src={typeof logoImage === 'string' ? logoImage : URL.createObjectURL(logoImage)} 
                            alt="Logo" 
                            className="max-h-32 mx-auto rounded"
                        />
                    ) : (
                        <p className="text-gray-500 mb-2">No logo image uploaded</p>
                    )}
                </div>
            </div>

            {/* Basic Contest Information */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Basic Contest Information</h2>
                    <button 
                        className="text-teal-600 hover:text-black"
                        onClick={() => onEditStep(2)}
                    >
                        Edit
                    </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                        <label className="block text-sm text-left font-medium text-gray-700 mb-1">Contest Name</label>
                        <p className="bg-white p-2 rounded border border-gray-200">{formData.contestName || 'Not specified'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-left font-medium text-gray-700 mb-1">Contest Description</label>
                        <p className="bg-white p-2 rounded border border-gray-200">{formData.contestDescription || 'Not specified'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-left font-medium text-gray-700 mb-1">Start Date</label>
                            <p className="bg-white p-2 rounded border border-gray-200">{formData.startDate || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-left font-medium text-gray-700 mb-1">End Date</label>
                            <p className="bg-white p-2 rounded border border-gray-200">{formData.endDate || 'Not specified'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm text-left font-medium text-gray-700 mb-1">Start Time</label>
                            <p className="bg-white p-2  rounded border border-gray-200">{formData.startTime || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-left font-medium text-gray-700 mb-1">End Time</label>
                            <p className="bg-white p-2 rounded border border-gray-200">{formData.endTime || 'Not specified'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contestant List */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Contestant List</h2>
                    <button 
                        className="text-teal-600 hover:text-black"
                        onClick={() => onEditStep(3)}
                    >
                        Edit
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Position</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Bio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contestants.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                                        No contestants added yet
                                    </td>
                                </tr>
                            ) : (
                                contestants.map((contestant, index) => (
                                    <tr key={contestant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-2 border-t border-gray-200">
                                            {contestant.image ? (
                                                <img 
                                                    src={typeof contestant.image === 'string' ? contestant.image : URL.createObjectURL(contestant.image)} 
                                                    alt={contestant.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-medium">
                                                        {contestant.name?.charAt(0) || '?'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border-t border-gray-200">{contestant.name}</td>
                                        <td className="px-4 py-2 border-t border-gray-200">{contestant.position}</td>
                                        <td className="px-4 py-2 border-t border-gray-200">{contestant.bio}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

           
        </div>
    );
=======
import {
  Edit,
  Calendar,
  Clock,
  DollarSign,
  Users,
  ImageIcon,
} from 'lucide-react';

const ReviewStep = ({
  coverImage,
  logoImage,
  formData = {
    contestName: '',
    contestDescription: '',
    startDate: '',
    endDate: '',
    startTime: { startTimeHour: '', startTimeMinute: '', startTimeAmPm: 'AM' },
    endTime: { endTimeHour: '', endTimeMinute: '', endTimeAmPm: 'AM' },
    payment: { isPaid: false, amount: '' },
    allowMultipleVotes: false,
  },
  contestants = [],
  onEditStep = () => {},
  onPublish = () => {},
}) => {
  const formatTime = (timeObj) => {
    if (!timeObj) return 'Not specified';
    return `${timeObj.startTimeHour || timeObj.endTimeHour || '--'}:${
      timeObj.startTimeMinute || timeObj.endTimeMinute || '--'
    } ${timeObj.startTimeAmPm || timeObj.endTimeAmPm || 'AM'}`;
  };

  const ReviewSection = ({ title, children, onEdit, stepIndex }) => (
    <div className='mb-6 sm:mb-8'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0'>
        <h2 className='text-base sm:text-lg font-semibold text-gray-900'>
          {title}
        </h2>
        <button
          className='text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center space-x-1 self-start sm:self-auto'
          onClick={() => onEdit(stepIndex)}
        >
          <Edit className='w-4 h-4' />
          <span>Edit</span>
        </button>
      </div>
      {children}
    </div>
  );

  const InfoField = ({ label, value, icon: Icon }) => (
    <div className='mb-3 sm:mb-4'>
      <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
        {Icon && <Icon className='w-4 h-4 inline mr-1' />}
        {label}
      </label>
      <div className='bg-white p-2 sm:p-3 rounded border border-gray-200 text-sm sm:text-base'>
        {value || 'Not specified'}
      </div>
    </div>
  );

  return (
    <div className='space-y-6 sm:space-y-8 bg-[#FBF7F7] p-4 sm:p-6 lg:p-10'>
      {/* Page Header - Mobile */}
      <div className='sm:hidden mb-6'>
        <h1 className='text-xl font-bold text-gray-900 mb-2'>Review Contest</h1>
        <p className='text-sm text-gray-600'>
          Review all contest details before publishing
        </p>
      </div>

      {/* Cover Image Section */}
      <ReviewSection title='Cover Image' onEdit={onEditStep} stepIndex={1}>
        <div className='border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center bg-white'>
          {coverImage ? (
            <div className='relative'>
              <img
                src={
                  typeof coverImage === 'string'
                    ? coverImage
                    : URL.createObjectURL(coverImage)
                }
                alt='Cover'
                className='max-h-32 sm:max-h-48 lg:max-h-64 w-full object-contain mx-auto rounded'
              />
              <div className='absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                ✓ Uploaded
              </div>
            </div>
          ) : (
            <div className='py-8 sm:py-12'>
              <ImageIcon className='w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2' />
              <p className='text-gray-500 text-sm sm:text-base'>
                No cover image uploaded
              </p>
            </div>
          )}
        </div>
      </ReviewSection>

      {/* Contest Logo Section */}
      <ReviewSection title='Contest Logo' onEdit={onEditStep} stepIndex={1}>
        <div className='border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center bg-white'>
          {logoImage ? (
            <div className='relative'>
              <img
                src={
                  typeof logoImage === 'string'
                    ? logoImage
                    : URL.createObjectURL(logoImage)
                }
                alt='Logo'
                className='max-h-20 sm:max-h-24 lg:max-h-32 mx-auto rounded'
              />
              <div className='absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                ✓ Uploaded
              </div>
            </div>
          ) : (
            <div className='py-6 sm:py-8'>
              <ImageIcon className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2' />
              <p className='text-gray-500 text-sm'>No logo image uploaded</p>
            </div>
          )}
        </div>
      </ReviewSection>

      {/* Basic Contest Information */}
      <ReviewSection
        title='Basic Contest Information'
        onEdit={onEditStep}
        stepIndex={0}
      >
        <div className='bg-gray-50 p-3 sm:p-4 rounded-lg'>
          <InfoField label='Contest Name' value={formData.contestName} />
          <InfoField
            label='Contest Description'
            value={formData.contestDescription}
          />

          {/* Date and Time - Responsive Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <InfoField
              label='Start Date'
              value={formData.startDate}
              icon={Calendar}
            />
            <InfoField
              label='End Date'
              value={formData.endDate}
              icon={Calendar}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            <InfoField
              label='Start Time'
              value={formatTime(formData.startTime)}
              icon={Clock}
            />
            <InfoField
              label='End Time'
              value={formatTime(formData.endTime)}
              icon={Clock}
            />
          </div>

          {/* Payment Setup */}
          <InfoField
            label='Is this a paid contest?'
            value={
              formData?.payment?.isPaid === true
                ? 'Yes'
                : formData?.payment?.isPaid === false
                ? 'No'
                : 'Not specified'
            }
            icon={DollarSign}
          />

          {formData?.payment?.isPaid === true && (
            <InfoField
              label='Amount each voter should pay'
              value={
                formData?.payment?.amount
                  ? `$${formData.payment.amount}`
                  : 'Not specified'
              }
              icon={DollarSign}
            />
          )}

          {/* Voters Setting */}
          <InfoField
            label='Allow multiple votes'
            value={
              formData.allowMultipleVotes === true
                ? 'Yes'
                : formData.allowMultipleVotes === false
                ? 'No'
                : 'Not specified'
            }
            icon={Users}
          />
        </div>
      </ReviewSection>

      {/* Contestant List */}
      <ReviewSection title='Contestant List' onEdit={onEditStep} stepIndex={2}>
        {contestants.length === 0 ? (
          <div className='bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center'>
            <Users className='w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3' />
            <p className='text-gray-500 text-sm sm:text-base'>
              No contestants added yet
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: Card Layout */}
            <div className='lg:hidden space-y-3'>
              {contestants.map((contestant, index) => (
                <div
                  key={contestant.id}
                  className='bg-white border border-gray-200 rounded-lg p-4'
                >
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0'>
                      {contestant.image ? (
                        <img
                          src={
                            typeof contestant.image === 'string'
                              ? contestant.image
                              : URL.createObjectURL(contestant.image)
                          }
                          alt={contestant.name}
                          className='w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover'
                        />
                      ) : (
                        <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center'>
                          <span className='text-sm sm:text-base font-medium text-gray-600'>
                            {contestant.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-gray-900 text-sm sm:text-base'>
                        {contestant.name}
                      </h3>
                      <p className='text-xs sm:text-sm text-teal-600 font-medium'>
                        {contestant.position}
                      </p>
                      {contestant.bio && (
                        <p className='text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2'>
                          {contestant.bio}
                        </p>
                      )}
                    </div>
                    <div className='flex-shrink-0'>
                      <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table Layout */}
            <div className='hidden lg:block overflow-x-auto'>
              <table className='min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                      Image
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                      Name
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                      Position
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                      Bio
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {contestants.map((contestant, index) => (
                    <tr
                      key={contestant.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className='px-4 py-3'>
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
                          <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
                            <span className='text-xs font-medium text-gray-600'>
                              {contestant.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className='px-4 py-3 font-medium text-gray-900'>
                        {contestant.name}
                      </td>
                      <td className='px-4 py-3 text-teal-600 font-medium'>
                        {contestant.position}
                      </td>
                      <td className='px-4 py-3 text-gray-600 max-w-xs truncate'>
                        {contestant.bio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-blue-800 font-medium'>
                  Total Contestants: {contestants.length}
                </span>
                <span className='text-blue-600'>Ready to publish ✓</span>
              </div>
            </div>
          </>
        )}
      </ReviewSection>

      {/* Mobile Action Bar */}
      <div className='sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <button
          onClick={onPublish}
          className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md font-medium transition-colors'
        >
          Publish Contest
        </button>
      </div>

      {/* Desktop Action Area */}
      <div className='hidden sm:block text-center pt-6'>
        <button
          onClick={onPublish}
          className='bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md font-medium transition-colors text-lg'
        >
          Publish Contest
        </button>
      </div>

      {/* Mobile spacing for fixed button */}
      <div className='sm:hidden h-20'></div>
    </div>
  );
>>>>>>> oscar-branch
};

export default ReviewStep;
