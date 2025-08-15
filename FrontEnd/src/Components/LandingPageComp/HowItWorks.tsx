import { motion } from 'framer-motion';
import sendArrow from '../../assets/send-arrow.png';
import howItWorks1 from '../../assets/how-it-works-1.png';
import howItWorks2 from '../../assets/how-it-works-2.png';

const steps = [
  {
    id: 1,
    title: 'Organizers',
    text: 'Create, manage, and launch contests with ease.',
    image: howItWorks1,
  },
  {
    id: 2,
    title: 'Cheerleaders',
    text: 'Support your favorite contestants and promote contests.',
    image: howItWorks2,
  },
  {
    id: 3,
    title: 'Contestants',
    text: 'Participate and win with votes from your audience.',
    image: howItWorks2,
  },
];

const HowItWorks = () => {
  return (
    <div className='my-8 px-4 md:px-20 md:mt-24'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-[#1D1D1D] font-semibold text-4xl md:text-5xl leading-tight mb-2'>
          How it Works
        </h1>
        <h2 className='text-[#515151] text-2xl md:text-3xl text-center mb-10'>
          Running a vote-based contest has never been easier.
        </h2>

        <div className='relative w-full max-w-5xl'>
          <div className='hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-gray-200 z-0'></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex flex-col ${
                index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              } items-center justify-between gap-10 md:gap-24 mb-12`}
            >
              <div className='bg-white rounded-3xl border border-[#E0E7F5] shadow-md w-full max-w-md z-10'>
                <div className='bg-gradient-to-bl from-white via-white to-[#ABF0F6] p-6 rounded-t-3xl'>
                  <div className='bg-gradient-to-b from-[#FFDACC] to-[#E67347] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66] px-4 py-2 w-fit mb-4'>
                    <p className='text-4xl'>{step.id}</p>
                  </div>

                  <h2 className='text-[#1D1D1D] text-2xl font-semibold mb-2'>
                    {step.title}
                  </h2>
                  <p className='text-[#667085] text-sm leading-relaxed'>
                    {step.text}
                  </p>
                </div>
                <a
                  href='https://t.me/zeecontest'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full flex justify-end px-6 pt-8 pb-4 cursor-pointer'
                >
                  <button className='border border-[#E0E7F5] bg-white rounded-xl px-4 py-2 flex items-center gap-2 hover:shadow-sm transition'>
                    <div className='bg-gradient-to-b from-[#FFDACC] to-[#E67347] rounded-md shadow-[inset_4px_4px_12px_0px_#FDFDFF66] p-1'>
                      <img src={sendArrow} alt='arrow' className='w-4 h-4' />
                    </div>
                    <span className='text-[#1D1D1D] text-sm font-medium'>
                      Join Waitlist
                    </span>
                  </button>
                </a>
              </div>

              <div className='p-2 bg-[#0340454A] rounded-3xl flex items-center justify-center z-10'>
                <img
                  src={step.image}
                  alt={step.title}
                  className='max-w-full h-auto rounded-xl'
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
