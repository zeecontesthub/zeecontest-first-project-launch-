import { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../../common/Header';
import Footer from '../../common/Footer';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    organizerType: '',
    fullName: '',
    schoolName: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    faculty: '',
    department: '',
    role: '',
    contestType: '',
    customContestType: '',
    startDate: '',
    expectedContestants: '',
    extraInfo: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const contestTypes = [
    'School Election',
    'Departmental Contest',
    'Faculty Contest',
    'Music/Talent Show',
    'Awards/Nominations',
    'Pageant/Model Contest',
    'Other',
  ];

  const roles = [
    'Manager',
    'CEO',
    'PR Representative',
    'Event Coordinator',
    'Producer',
    'Director',
    'Other',
  ];

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        break;
      case 'schoolName':
        if (formData.organizerType === 'school' && !value.trim()) {
          error = 'School name is required';
        }
        break;
      case 'companyName':
        if (formData.organizerType === 'entertainment' && !value.trim()) {
          error = 'Company name is required';
        }
        break;
      case 'phoneNumber':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'email':
        if (formData.organizerType === 'entertainment' && !value.trim()) {
          error = 'Email is required for entertainment organizers';
        } else if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'faculty':
        if (formData.organizerType === 'school' && !value.trim()) {
          error = 'Faculty is required';
        }
        break;
      case 'department':
        if (formData.organizerType === 'school' && !value.trim()) {
          error = 'Department is required';
        }
        break;
      case 'contestType':
        if (!value.trim()) error = 'Contest type is required';
        break;
      case 'customContestType':
        if (formData.contestType === 'Other' && !value.trim()) {
          error = 'Please specify the contest type';
        }
        break;
      case 'organizerType':
        if (!value) error = 'Please select organizer type';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    ['organizerType', 'fullName', 'phoneNumber', 'contestType'].forEach(
      (field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    );

    if (formData.organizerType === 'school') {
      ['schoolName', 'faculty', 'department'].forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });
    }

    if (formData.organizerType === 'entertainment') {
      ['companyName', 'email'].forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });
    }

    if (formData.email) {
      const emailError = validateField('email', formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (formData.contestType === 'Other') {
      const customError = validateField(
        'customContestType',
        formData.customContestType
      );
      if (customError) newErrors.customContestType = customError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const URL =
    'https://script.google.com/macros/s/AKfycbysXgCAYvUAm0Ljf-kvEr25GdEvMjALujviUN37VS7DOb56AYjZkk5OyS7dy0vypeUrrg/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await fetch(URL, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        setIsSubmitted(true);
        toast.success('Your waitlist entry has been submitted!');
      } catch (error) {
        console.error('Submission failed:', error);
        toast.error('Submission failed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn('Please fill in all required fields.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <div className='min-h-screen flex items-center justify-center px-4'>
          <div className='bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-gray-200'>
            <div className='mb-6'>
              <div className='w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-4'>
                <Send className='w-8 h-8 text-[#FFB703]' />
              </div>
              <h2 className='text-2xl font-bold text-[#343A40] mb-2'>
                Thank you!
              </h2>
              <p className='text-gray-600'>
                You're now on the Zeecontest Launch Waitlist. We'll contact you
                soon with updates and early access.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className='bg-[#034045] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#045a60] transition-colors'
            >
              Submit Another Entry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='min-h-screen font-inter py-12 px-4'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-10'>
            <h1 className='text-[#343A40] text-4xl font-bold mb-3 tracking-tight'>
              Join the Zeecontest Waitlist
            </h1>
            <p className='text-gray-600 text-lg'>
              Be among the first to organize contests on our platform!
            </p>
          </div>

          <div className='bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200'>
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Step 1 */}
              <div>
                <h2 className='text-xl font-bold text-[#343A40] mb-6'>
                  Who are you registering as?
                </h2>
                <div className='grid md:grid-cols-2 gap-4'>
                  <label className='flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-[#FFB703] has-[:checked]:border-2 has-[:checked]:border-[#FFB703] has-[:checked]:bg-[#FFB703]/10'>
                    <input
                      type='radio'
                      name='organizerType'
                      value='school'
                      checked={formData.organizerType === 'school'}
                      onChange={handleChange}
                      className='w-5 h-5 text-[#FFB703] border-gray-300 focus:ring-0 focus:ring-offset-0'
                    />
                    <span className='ml-3 text-gray-700 font-medium'>
                      School Organizer
                    </span>
                  </label>
                  <label className='flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-[#FFB703] has-[:checked]:border-2 has-[:checked]:border-[#FFB703] has-[:checked]:bg-[#FFB703]/10'>
                    <input
                      type='radio'
                      name='organizerType'
                      value='entertainment'
                      checked={formData.organizerType === 'entertainment'}
                      onChange={handleChange}
                      className='w-5 h-5 text-[#FFB703] border-gray-300 focus:ring-0 focus:ring-offset-0'
                    />
                    <span className='ml-3 text-gray-700 font-medium'>
                      Entertainment Organizer
                    </span>
                  </label>
                </div>
                {errors.organizerType && (
                  <p className='text-red-500 text-sm mt-2'>
                    {errors.organizerType}
                  </p>
                )}
              </div>

              {/* Separator */}
              {formData.organizerType && <hr className='border-gray-200' />}

              {/* Step 2 */}
              {formData.organizerType && (
                <div>
                  <h2 className='text-xl font-bold text-[#343A40] mb-6'>
                    Your Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleChange}
                        className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                        placeholder='Enter your full name'
                      />
                      {errors.fullName && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {formData.organizerType === 'school' && (
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          School Name *
                        </label>
                        <input
                          type='text'
                          name='schoolName'
                          value={formData.schoolName}
                          onChange={handleChange}
                          className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                          placeholder='Enter your school name'
                        />
                        {errors.schoolName && (
                          <p className='text-red-500 text-sm mt-1'>
                            {errors.schoolName}
                          </p>
                        )}
                      </div>
                    )}

                    {formData.organizerType === 'entertainment' && (
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Company/Organization Name *
                        </label>
                        <input
                          type='text'
                          name='companyName'
                          value={formData.companyName}
                          onChange={handleChange}
                          className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                          placeholder='Enter company/organization name'
                        />
                        {errors.companyName && (
                          <p className='text-red-500 text-sm mt-1'>
                            {errors.companyName}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Phone Number *
                      </label>
                      <input
                        type='tel'
                        name='phoneNumber'
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                        placeholder='Enter your phone number'
                      />
                      {errors.phoneNumber && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email Address{' '}
                        {formData.organizerType === 'entertainment' && '*'}
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                        placeholder='Enter your email address'
                      />
                      {errors.email && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {formData.organizerType === 'school' && (
                      <>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Faculty *
                          </label>
                          <input
                            type='text'
                            name='faculty'
                            value={formData.faculty}
                            onChange={handleChange}
                            className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                            placeholder='e.g., Engineering, Arts'
                          />
                          {errors.faculty && (
                            <p className='text-red-500 text-sm mt-1'>
                              {errors.faculty}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Department *
                          </label>
                          <input
                            type='text'
                            name='department'
                            value={formData.department}
                            onChange={handleChange}
                            className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                            placeholder='e.g., Computer Science, English'
                          />
                          {errors.department && (
                            <p className='text-red-500 text-sm mt-1'>
                              {errors.department}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {formData.organizerType === 'entertainment' && (
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Role/Position
                        </label>
                        <div className='relative'>
                          <select
                            name='role'
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors appearance-none shadow-sm'
                          >
                            <option value=''>
                              Select your role (optional)
                            </option>
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Separator */}
              {formData.organizerType && <hr className='border-gray-200' />}

              {/* Step 3 */}
              {formData.organizerType && (
                <div>
                  <h2 className='text-xl font-bold text-[#343A40] mb-6'>
                    <span className='text-gray-400 font-normal mr-2'>
                      Step 3:
                    </span>{' '}
                    Contest Details
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Type of Contest You Want to Run *
                      </label>
                      <div className='relative'>
                        <select
                          name='contestType'
                          value={formData.contestType}
                          onChange={handleChange}
                          className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors appearance-none shadow-sm'
                        >
                          <option value=''>Select contest type</option>
                          {contestTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
                      </div>
                      {errors.contestType && (
                        <p className='text-red-500 text-sm mt-1'>
                          {errors.contestType}
                        </p>
                      )}
                    </div>

                    {formData.contestType === 'Other' && (
                      <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Please specify the contest type *
                        </label>
                        <input
                          type='text'
                          name='customContestType'
                          value={formData.customContestType}
                          onChange={handleChange}
                          className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                          placeholder='Describe your contest type'
                        />
                        {errors.customContestType && (
                          <p className='text-red-500 text-sm mt-1'>
                            {errors.customContestType}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Estimated Start Date
                      </label>
                      <div className='relative'>
                        <input
                          type='date'
                          name='startDate'
                          value={formData.startDate}
                          onChange={handleChange}
                          className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Expected Contestants
                      </label>
                      <div className='relative'>
                        <input
                          type='number'
                          name='expectedContestants'
                          value={formData.expectedContestants}
                          onChange={handleChange}
                          className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors shadow-sm'
                          placeholder='e.g., 50'
                          min='1'
                        />
                      </div>
                    </div>

                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Any Extra Information
                      </label>
                      <textarea
                        name='extraInfo'
                        value={formData.extraInfo}
                        onChange={handleChange}
                        rows={4}
                        className='w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB703] focus:border-[#FFB703] transition-colors resize-none shadow-sm'
                        placeholder='Tell us anything else about your contest plans...'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Separator */}
              {formData.organizerType && <hr className='border-gray-200' />}

              {/* Submit Button */}
              {formData.organizerType && (
                <div className='pt-2'>
                  <button
                    type='submit'
                    className='w-full bg-[#034045] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#045a60] transition-colors duration-200 shadow-lg flex items-center justify-center space-x-2'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className='flex items-center space-x-2'>
                        <svg
                          className='animate-spin h-5 w-5 text-white'
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
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        <Send className='w-5 h-5' />
                        <span>Join Waitlist</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className='text-center mt-8'>
            <p className='text-gray-500 text-sm'>
              By joining, you'll be notified as soon as Zeecontest launches.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;
