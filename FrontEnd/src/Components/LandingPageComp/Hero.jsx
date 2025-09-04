import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../assets/Logo.png';
import heroIcon1 from '../../assets/hero-icon-1.png';
import heroIcon2 from '../../assets/hero-icon-2.png';
import heroIcon3 from '../../assets/hero-icon-3.png';
import heroImage from '../../assets/Hero-image.jpg';
import heroBg from '../../assets/Hero-background.jpg';
import MobileDrawer from './MobileDrawer';

const Hero = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => () => setOpen(state);

  return (
    <div
      className='flex flex-col items-center justify-center bg-cover bg-center text-white md:min-h-screen mb-8'
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* NAVBAR */}
      <div className='z-50 py-4 px-4 md:px-8 lg:px-34 flex items-center justify-between w-full'>
        {/* Logo */}
        <div>
          <img
            src={logo}
            alt='logo'
            className='w-[120px] h-[52px] sm:w-[150px] sm:h-[66px] lg:w-[190px] lg:h-[83px]'
          />
        </div>

        {/* Desktop Nav */}
        <div className='hidden md:flex items-center space-x-8'>
          <ul className='flex items-center space-x-8'>
            <li className='relative text-white text-lg lg:text-xl font-medium'>
              <Link
                to='/contests'
                className='flex items-center space-x-2 group'
              >
                <span className='relative'>
                  Contests
                  <span className='absolute left-0 bottom-0 w-0 h-[2px] bg-[#E67347] group-hover:w-full transition-all duration-300'></span>
                </span>
              </Link>
            </li>
          </ul>
          <Link to='/login'>
            <button className='bg-[#E67347] rounded-full text-white py-3 px-6 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300'>
              Login
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon style={{ color: 'white' }} />
          </IconButton>
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer open={open} toggleDrawer={toggleDrawer} />
      </div>

      {/* MAIN HERO SECTION */}
      <main className='container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center'>
        {/* Feature Tags */}
        <motion.div
          className='grid items-center mb-6 sm:mb-8'
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className='flex items-center justify-center mb-3 sm:mb-4'>
            <div className='bg-[#FFFFFF33] rounded-full px-3 py-2 sm:px-4 flex items-center space-x-2'>
              <div className='p-1 bg-[#E67347] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66]'>
                <img src={heroIcon2} alt='' className='w-3 h-3 sm:w-4 sm:h-4' />
              </div>
              <span className='text-white text-sm font-semibold'>
                Transparency
              </span>
            </div>
          </div>

          <div className='flex items-center md:justify-around justify-center space-x-4 sm:space-x-8'>
            {[
              { icon: heroIcon1, label: 'Organize Contest' },
              { icon: heroIcon3, label: 'Easy Voting' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className='bg-[#FFFFFF33] rounded-full px-3 py-2 sm:px-4 flex items-center space-x-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
              >
                <div className='p-1 bg-[#E67347] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66]'>
                  <img
                    src={item.icon}
                    alt=''
                    className='w-3 h-3 sm:w-4 sm:h-4'
                  />
                </div>
                <span className='text-white text-sm font-semibold'>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero Heading & Description */}
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className='md:hidden block text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2'>
            Power Your Contests with Seamless Online Voting
          </div>
          <p className='hidden md:block text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2'>
            Power Your Contests with
            <br /> Seamless Online Voting
          </p>
          <p className='md:text-xl text-white/90 max-w-sm lg:max-w-2xl mx-auto leading-relaxed px-4'>
            Create, manage, and launch voting contests for elections, pageants,
            awards, and more, all in minutes. With ZeeContest, you're in full
            control.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className='flex items-center justify-center mt-2'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src={heroImage}
            alt='Interactive contest management interface'
            className='w-full md:w-[80%] rounded-tl-3xl rounded-tr-[44px] h-[150px] md:h-auto'
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Hero;
