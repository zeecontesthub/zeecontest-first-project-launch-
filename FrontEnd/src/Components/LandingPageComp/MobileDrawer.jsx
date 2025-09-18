import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

export default function MobileDrawer({ open, toggleDrawer }) {
  return (
    <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
      <div className='w-[250px] bg-white h-full text-black flex flex-col py-6'>
        {/* Close Button */}
        <div className='flex justify-end pr-4 mb-8'>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon className='text-gray-600 hover:text-[#E67347] transition-colors' />
          </IconButton>
        </div>

        {/* Navigation Links */}
        <nav className='flex flex-col items-center space-y-6 px-6 w-full'>
          <Link
            to='/vcontests'
            className='text-xl font-medium text-center py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors w-full'
            onClick={toggleDrawer(false)}
          >
            Contests
          </Link>
          <Link
            to='/contact'
            className='text-xl font-medium text-center py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors w-full'
            onClick={toggleDrawer(false)}
          >
            Contact
          </Link>

          <Link to='/login' className='w-full'>
            <button
              className='w-full bg-[#E67347] text-white py-3 px-6 rounded-full font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg'
              onClick={toggleDrawer(false)}
            >
              Login to your Organizer Account
            </button>
          </Link>
        </nav>
      </div>
    </Drawer>
  );
}
