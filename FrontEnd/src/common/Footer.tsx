import { FaTelegram, FaXTwitter } from 'react-icons/fa6';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import logo from '../assets/Logo.png';

const Footer = () => {
  return (
    <div className='bg-white py-8 px-4 space-y-6'>
      <div className='flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto'>
        <img src={logo} alt='ZeeContest Logo' className='w-32' />
        <h2 className='text-[#949AA9] text-sm leading-relaxed'>
          ZeeContest is a digital platform that lets event organizers create
          structured voting contests with multiple positions, where people can
          vote easily and track results in real time.
        </h2>

        <div className='flex items-center justify-center gap-3 mt-4'>
          <a
            href='https://www.instagram.com/zeecontest'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full p-2 bg-[#1D1D1D]'
          >
            <FaInstagram className='w-4 h-4 text-white' />
          </a>
          <a
            href='https://www.facebook.com/zeecontest'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full p-2 bg-[#1D1D1D]'
          >
            <FaFacebookF className='w-4 h-4 text-white' />
          </a>
          <a
            href='https://x.com/zeecontest'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full p-2 bg-[#1D1D1D]'
          >
            <FaXTwitter className='w-4 h-4 text-white' />
          </a>
          <a
            href='https://www.linkedin.com/company/zeecontest'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full p-2 bg-[#1D1D1D]'
          >
            <FaLinkedinIn className='w-4 h-4 text-white' />
          </a>
          <a
            href='https://t.me/zeecontest'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full p-2 bg-[#1D1D1D]'
          >
            <FaTelegram className='w-4 h-4 text-white' />
          </a>
        </div>
      </div>

      <div className='bg-[#F9F9FA] border border-[#E0E7F5] p-2 rounded-xl flex items-center justify-center w-full md:w-[70%] mx-auto'>
        <div className='bg-white border border-[#E0E7F5] rounded-xl px-4 py-2 flex items-center justify-between w-full'>
          <p className='text-[#949AA9] text-sm'>ZeeContest</p>
          <p className='text-[#949AA9] text-sm'>©2025 - ZeeContest</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
