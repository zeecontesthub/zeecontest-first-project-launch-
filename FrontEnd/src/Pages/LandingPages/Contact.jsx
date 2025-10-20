import { useState } from 'react';
import { Send, Mail, Phone, MessageSquare, Calendar, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import contactArrow from '../../assets/contact-arrow.png';

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

  const [contactFormData, setContactFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactWhatsapp: '',
    contactReason: '',
    contactPreferred: '',
  });

  const [contactErrors, setContactErrors] = useState({});
  const [isContactLoading, setIsContactLoading] = useState(false);

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

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (contactErrors[name]) {
      setContactErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateContactField = (name, value) => {
    let error = '';

    switch (name) {
      case 'contactName':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'contactEmail':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'contactWhatsapp':
        if (!value.trim()) {
          error = 'WhatsApp number is required';
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
          error = 'Please enter a valid WhatsApp number';
        }
        break;
      case 'contactReason':
        if (!value.trim()) error = 'Reason for reaching out is required';
        break;
      case 'contactPreferred':
        if (!value) error = 'Please select a preferred means of communication';
        break;
      default:
        break;
    }
    return error;
  };

  const validateContactForm = () => {
    const newErrors = {};

    ['contactName', 'contactEmail', 'contactWhatsapp', 'contactReason', 'contactPreferred'].forEach(
      (field) => {
        const error = validateContactField(field, contactFormData[field]);
        if (error) newErrors[field] = error;
      }
    );

    setContactErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    if (validateContactForm()) {
      setIsContactLoading(true);

      try {
        const response = await fetch(URL, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactFormData),
        });

        toast.success('Your contact request has been submitted!');
      } catch (error) {
        console.error('Contact submission failed:', error);
        toast.error('Contact submission failed. Please try again later.');
      } finally {
        setIsContactLoading(false);
      }
    } else {
      toast.warn('Please fill in all required fields.', {
        position: 'top-center',
        autoClose: 3000,
      });
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
              Want to Host your Contest on ZeeContest?
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
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="min-h-screen  py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-slate-800 mb-4">
                  Let's Start a Conversation
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Got questions? We're all ears! Our team is ready to help you create an amazing contest experience.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Form Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-slate-100">
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all outline-none text-slate-800"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all outline-none text-slate-800"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        WhatsApp Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          name="contactWhatsapp"
                          value={formData.contactWhatsapp}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all outline-none text-slate-800"
                          placeholder="+234 xxx xxxx xxx"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        How can we help you?
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <textarea
                          name="contactReason"
                          value={formData.contactReason}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all resize-none outline-none text-slate-800"
                          placeholder="Tell us about your contest idea..."
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                        <select
                          name="contactPreferred"
                          value={formData.contactPreferred}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all appearance-none outline-none text-slate-800"
                        >
                          <option value="">Choose your preference</option>
                          <option value="phone">Phone/WhatsApp Call</option>
                          <option value="email">Email</option>
                          <option value="whatsapp">WhatsApp Messaging</option>
                          <option value="meet">Google Meet</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-teal-700 to-teal-600 text-white font-bold py-5 px-8 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-lg">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          <span className="text-lg">Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3D Illustration Section */}
                <div className="relative flex items-center justify-center">
                  <div className="relative w-full max-w-lg">
                    {/* Floating elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-300 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute top-32 right-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-20 left-16 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-2xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>

                    {/* Main illustration */}
                    <div className="relative z-10 bg-gradient-to-br from-white to-slate-100 rounded-3xl p-12 shadow-2xl border border-slate-200">
                      <div className="space-y-8">
                        {/* Envelope Icon */}
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-teal-700 to-teal-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
                              <Mail className="w-16 h-16 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">!</span>
                            </div>
                          </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="space-y-4">
                          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-amber-400 hover:scale-105 transition-transform">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Phone className="w-6 h-6 text-amber-500" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">Quick Response</h4>
                                <p className="text-sm text-slate-600">We reply within 24 hours</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:scale-105 transition-transform">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-500" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">Expert Support</h4>
                                <p className="text-sm text-slate-600">Dedicated team assistance</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:scale-105 transition-transform">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">Flexible Scheduling</h4>
                                <p className="text-sm text-slate-600">Book a call anytime</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-3xl -z-10 transform rotate-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;
