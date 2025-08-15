import { Search } from 'lucide-react';
import logo from '../../assets/Logo.png';
import ContestListing from '../../Components/LandingPageComp/contest/ContestListing';

const Contest = () => {
  return (
    <>

      <nav className='bg-white px-4 md:px-12 lg:px-30 py-4'>
        <div>
          <img
            src={logo}
            alt='ZeeContest'
            className='w-[120px] h-[52px] sm:w-[150px] sm:h-[66px] lg:w-[190px] lg:h-[83px]'
          />
        </div>
      </nav>
      <section className='w-full'>
        <div className='bg-gradient-to-br from-[#034045] to-[#0a5a60] min-h-[400px] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden'>
          <div className='max-w-4xl w-full text-center relative z-10'>
            <h1 className='text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
              Vote in Live Contests
            </h1>

            <p className='text-white/90 text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto px-4'>
              Participate in Contest across different institutions,
              organizations and Contest. Your voice matters.
            </p>

            <div className='w-full mx-auto relative'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-50' />
                <input
                  type='text'
                  placeholder='Search Contests...'
                  className='w-full pl-12 pr-4 py-4 bg-[#D9D9D9] backdrop-blur-sm rounded-xl border-0 shadow-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#034045]/30 focus:bg-white transition-all duration-300 text-base'
                />
              </div>

              <button className='md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#034045] text-white p-2 rounded-lg cursor-pointer'>
                <Search className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        <ContestListing />
      </section>
    </>
  );
};

export default Contest;
