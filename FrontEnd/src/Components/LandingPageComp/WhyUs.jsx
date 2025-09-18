import { motion } from 'framer-motion';
import camera from '../../assets/camera.png';
import coin from '../../assets/coin-img.png';
import whyUsImage from '../../assets/why-choose-us.png';
import { Link } from 'react-router-dom';
// main code
const features = [
  {
    title: 'Secure Voting',
    description:
      "Whether it's one vote or many, ZeeContest gives organizers the power to set the rules. Our system enforces voting limits per position, per user — exactly how you configure it.",
    icon: coin,
  },
  {
    title: 'Live Leaderboard',
    description:
      'Stay in the loop as the votes roll in. ZeeContest’s dynamic leaderboard updates in real-time, showing clear rankings for each position.',
    icon: coin,
  },
  {
    title: 'Shareable Voting Links',
    description:
      'Voting should be simple — and with ZeeContest, it is. Every contest comes with a unique link you can share via social media, SMS, email, or anywhere else.',
    icon: coin,
  },
  {
    title: 'Multiple Positions',
    description:
      'Design your contest the way you need it. With ZeeContest, organizers can create multiple roles — like President, Vice President, Treasurer, or any custom title.',
    icon: coin,
  },
];

const WhyUs = () => {
  return (
    <section className='py-10 px-6 md:px-34 lg:px-56 bg-white'>
      <motion.div
        className='flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-12'
        initial='hidden'
        whileInView='show'
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          className='flex flex-col gap-6 max-w-2xl'
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          <div className='bg-gradient-to-b from-white to-[#88F6FF] rounded-full px-4 py-2 flex items-center gap-2 w-fit shadow-sm'>
            <div className='p-1 bg-gradient-to-b from-[#43C6D1] to-[#034045] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66]'>
              <img src={camera} alt='camera icon' className='w-4 h-4' />
            </div>
            <span className='text-[#034045] text-sm font-semibold'>
              Why ZeeContest
            </span>
          </div>

          <p className='text-[#1D1D1D] font-bold text-3xl md:text-4xl leading-snug'>
            Built for Transparency, Speed & Simplicity
          </p>
          <p className='text-[#667085] text-base md:text-lg'>
            ZeeContest is designed to eliminate the stress, confusion, and bias
            that often come with organizing vote-based competitions.
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            show: { opacity: 1, scale: 1 },
          }}
          initial='hidden'
          animate='show'
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link to='/login'>
            <button className='text-white bg-[#E67347] rounded-full py-3 px-6 shadow-[inset_4px_4px_12px_0px_#FDFDFF66] text-sm font-medium hover:opacity-90 transition focus:outline-none focus:ring-0'>
              Get Started
            </button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-6'
        initial='hidden'
        whileInView='show'
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className='bg-[#F9F9FA] border border-[#E0E7F5] rounded-2xl p-6 shadow-sm space-y-4'
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <div className='flex items-center gap-3 bg-white border border-[#E0E7F5] px-4 py-3 rounded-xl w-fit'>
              <div className='p-2 bg-[#034045] rounded-md'>
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className='w-5 h-5 object-contain'
                />
              </div>
              <h3 className='text-[#1D1D1D] text-base font-semibold'>
                {feature.title}
              </h3>
            </div>
            <p className='text-[#667085] text-sm leading-relaxed'>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className='mt-16 flex items-center justify-center'
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img
          src={whyUsImage}
          alt='Why Us Illustration'
          className='w-full max-w-[1000px] h-auto object-contain'
        />
      </motion.div>
    </section>
  );
};

export default WhyUs;
