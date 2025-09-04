import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/Logo.png';
import MobileDrawer from '../Components/LandingPageComp/MobileDrawer';

const Header = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => () => setOpen(state);

  return (
    <header className='w-full bg-white shadow-sm py-4 px-4 md:px-8 lg:px-20 flex items-center justify-between'>
      {/* Logo */}
      <div>
        <Link to='/'>
          <img
            src={logo}
            alt='ZeeContest Logo'
            className='w-[120px] h-[52px] sm:w-[150px] sm:h-[66px] lg:w-[190px] lg:h-[83px]'
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center space-x-8'>
        <ul className='flex items-center space-x-8'>
          <li className='relative text-gray-800 text-lg font-medium'>
            <Link to='/contests' className='flex items-center space-x-2 group'>
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
          <MenuIcon style={{ color: '#1D1D1D' }} />
        </IconButton>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer open={open} toggleDrawer={toggleDrawer} />
    </header>
  );
};

export default Header;
