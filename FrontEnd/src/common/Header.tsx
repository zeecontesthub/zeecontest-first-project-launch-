import logo from '../../assets/logo.png';
const Header = () => {
  return (
    <div className='absolute top-0 left-0 w-full z-50 py-4 px-20 flex items-center justify-between'>
      <div>
        <img src={logo} alt='logo' className='w-[190px] h-[83px]' />
      </div>
      <ul>
        <li className='text-white'>
          <a href='#'>Contests</a>
        </li>
      </ul>
      <button className='text-white bg-[#E67347] rounded-[100px] py-3 px-5 shadow-[inset_4px_4px_12px_0px_#FDFDFF66]'>
        Join the waitlist
      </button>
    </div>
  );
};

export default Header;
