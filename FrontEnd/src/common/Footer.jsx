import { FaTelegram, FaXTwitter } from 'react-icons/fa6';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className='bg-white py-12 px-4 sm:px-6 md:px-12 lg:px-24 space-y-10'>
      <div className='flex flex-col lg:flex-row justify-between items-start text-center lg:text-left gap-10'>
        {/* Logo and Description */}
        <div className='flex flex-col items-center lg:items-start space-y-4 max-w-sm'>
          <img src={logo} alt='ZeeContest Logo' className='w-32 h-auto' />
          <p className='text-[#949AA9] text-sm leading-relaxed'>
            ZeeContest is a digital platform that lets event organizers create
            structured voting contests with multiple positions, where people can
            vote easily and track results in real time.
          </p>
          {/* Social Icons */}
          <div className='flex items-center justify-center gap-3 pt-2'>
            <a
              href='https://www.instagram.com/zeecontest'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full p-2 bg-[#1D1D1D] hover:bg-gray-700 transition-colors'
            >
              <FaInstagram className='w-4 h-4 text-white' />
            </a>
            <a
              href='https://www.facebook.com/zeecontest'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full p-2 bg-[#1D1D1D] hover:bg-gray-700 transition-colors'
            >
              <FaFacebookF className='w-4 h-4 text-white' />
            </a>
            <a
              href='https://x.com/zeecontest'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full p-2 bg-[#1D1D1D] hover:bg-gray-700 transition-colors'
            >
              <FaXTwitter className='w-4 h-4 text-white' />
            </a>
            <a
              href='https://www.linkedin.com/company/zeecontest'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full p-2 bg-[#1D1D1D] hover:bg-gray-700 transition-colors'
            >
              <FaLinkedinIn className='w-4 h-4 text-white' />
            </a>
            <a
              href='https://t.me/zeecontest'
              target='_blank'
              rel='noopener noreferrer'
              className='rounded-full p-2 bg-[#1D1D1D] hover:bg-gray-700 transition-colors'
            >
              <FaTelegram className='w-4 h-4 text-white' />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className='flex flex-col items-center lg:items-start text-center lg:text-left space-y-6'>
          <h4 className='text-lg font-bold text-gray-800'>Quick Links</h4>
          <ul className='space-y-3'>
            <li>
              <Link
                to='/contests'
                className='text-[#949AA9] hover:text-[#E67347] transition-colors'
              >
                Contests
              </Link>
            </li>
            <li>
              <Link
                to='/contact'
                className='text-[#949AA9] hover:text-[#E67347] transition-colors'
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to='/login'
                className='text-[#949AA9] hover:text-[#E67347] transition-colors'
              >
                Create an Account
              </Link>
            </li>
            <li>
              <Link
                to='/login'
                className='text-[#949AA9] hover:text-[#E67347] transition-colors'
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div className='flex flex-col items-center lg:items-start text-center lg:text-left space-y-6'>
          <h4 className='text-lg font-bold text-gray-800'>Get in Touch</h4>{' '}
          <ul className='space-y-3'>
            <li className='flex items-center gap-2'>
              <a
                href='mailto:support@zeecontest.com'
                className='text-[#949AA9] hover:text-[#E67347] transition-colors text-sm'
              >
                support@zeecontest.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='pt-8 border-t border-gray-200'>
        <div className='bg-[#F9F9FA] border border-[#E0E7F5] p-2 rounded-xl flex items-center justify-center w-full md:w-[70%] mx-auto'>
          <div className='bg-white border border-[#E0E7F5] rounded-xl px-4 py-2 flex items-center justify-between w-full'>
            <p className='text-[#949AA9] text-sm'>ZeeContest</p>
            <p className='text-[#949AA9] text-sm'>
              ©{currentYear} - All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
