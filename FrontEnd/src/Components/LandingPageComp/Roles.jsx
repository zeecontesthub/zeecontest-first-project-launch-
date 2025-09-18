import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import camera from '../../assets/camera.png';
import user from '../../assets/user.png';
import basket from '../../assets/basket.png';
import sendArrow from '../../assets/send-arrow.png';

const Roles = () => {
  const roles = [
    { label: 'Organizers', icon: user },
    { label: 'Cheerleaders', icon: user },
    { label: 'Contestants', icon: user },
  ];

  const cardData = [
    {
      title: 'Organizers',
      text: 'Create, manage, and launch contests with ease.',
    },
    {
      title: 'Cheerleaders',
      text: 'Support your favorites by voting for them.',
    },
    {
      title: 'Contestants',
      text: 'Stand out, compete fairly, and rise through the ranks.',
    },
  ];

  return (
    <div className='my-12 px-4 md:px-12 xl:px-32 md:mt-24'>
      <motion.div
        className='flex justify-center mb-6'
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className='bg-gradient-to-b from-white to-[#88F6FF] rounded-full px-4 py-2 flex items-center gap-2 w-fit shadow-sm'>
          <div className='p-1 bg-gradient-to-b from-[#43C6D1] to-[#034045] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66]'>
            <img src={camera} alt='camera icon' className='w-4 h-4' />
          </div>
          <span className='text-[#034045] text-sm font-semibold'>
            Easy to Use
          </span>
        </div>
      </motion.div>

      <motion.div
        className='flex flex-col items-center justify-center mb-10 text-center'
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p className='text-[#1D1D1D] font-semibold text-4xl md:text-5xl leading-tight mb-1 md:mb-2'>
          Everyone has a
        </p>
        <p className='text-[#1D1D1D] font-semibold text-4xl md:text-5xl leading-tight'>
          Role in <span className='text-[#034045]'>ZeeContest</span>
        </p>
      </motion.div>

      <motion.div
        className='bg-[#F9F9FA] border border-[#E0E7F5] p-4 flex flex-wrap justify-center gap-3 rounded-3xl w-fit mx-auto shadow-sm mb-12'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {roles.map((role) => (
          <div
            key={role.label}
            className='flex items-center gap-2 bg-white border border-[#E0E7F5] rounded-2xl px-2 md:px-4 py-2'
          >
            <div className='bg-[#CFFBFE] p-1 md:p-2 rounded-xl'>
              <img src={role.icon} alt={role.label} className='w-5 h-5' />
            </div>
            <p className='text-[#1D1D1D] italic text-xs md:text-sm'>
              {role.label}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        className='flex flex-col md:flex-row flex-wrap gap-6 justify-center'
        initial='hidden'
        whileInView='show'
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: true }}
      >
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            className='bg-white rounded-3xl border border-[#E0E7F5] shadow-md w-full max-w-md flex flex-col justify-between'
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className='bg-gradient-to-bl from-white via-white to-[#ABF0F6] p-6 rounded-t-3xl'>
              <div className='bg-gradient-to-b from-[#FFDACC] to-[#E67347] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66] p-3 w-fit mb-4'>
                <img src={basket} alt='basket' className='w-6 h-6' />
              </div>

              <h2 className='text-[#1D1D1D] text-2xl font-semibold mb-2'>
                {card.title}
              </h2>
              <p className='text-[#667085] text-sm leading-relaxed'>
                {card.text}
              </p>
            </div>

            <Link
              to='/login'
              className='w-full flex justify-end px-6 pt-8 pb-4 cursor-pointer'
            >
              <button className='border border-[#E0E7F5] bg-white rounded-xl px-4 py-2 flex items-center gap-2 hover:shadow-sm transition'>
                <div className='bg-gradient-to-b from-[#FFDACC] to-[#E67347] rounded-md shadow-[inset_4px_4px_12px_0px_#FDFDFF66] p-1'>
                  <img src={sendArrow} alt='arrow' className='w-4 h-4' />
                </div>
                <span className='text-[#1D1D1D] text-sm font-medium'>
                  Get Started
                </span>
              </button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Roles;
