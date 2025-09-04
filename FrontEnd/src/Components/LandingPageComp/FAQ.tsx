import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import faqBatch from '../../assets/faq-batch.png';
import contactArrow from '../../assets/contact-arrow.png';
import arrowDown from '../../assets/arrow-down.png';

const faqs = [
  {
    question: 'Can I allow voters to vote more than once per position?',
    answer:
      'Yes! As an organizer, you can set voting limits, including allowing multiple votes per person for each position.',
  },
  {
    question: 'Can I create custom positions for my contest?',
    answer:
      "Yes. Zeecontest allows organizers to create custom positions or categories for each contest. Whether it's for school elections, talent shows, or brand campaigns, you can define positions like President, Best Dancer, Top Influencer, and more to suit the structure of your",
  },
  {
    question: 'How are votes tracked and secured?',
    answer:
      'Yes. Votes are tracked in real-time using a secure and transparent system. Zeecontest implements safeguards like: Unique voter tracking to prevent duplicate votes, Encrypted payment processing for paid votes, Server-side validation and anti-bot protection, Optional fraud-detection algorithms for organizers who enable it. This ensures voting integrity across all contests.',
  },
  {
    question: 'Can I see live results while the contest is ongoing?',
    answer:
      'Absolutely. Organizers have access to a live dashboard that shows the total votes per contestant, real-time voting trends, voter engagement metrics. You can choose to keep results public, private, or only visible at certain stages of the contest.',
  },
  {
    question: 'Do voters need to create an account to vote?',
    answer: 'No. Voters can cast their votes without creating a full account.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className='py-10 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32'>
      <div className='flex flex-col lg:flex-row justify-between gap-16'>
        {/* Left */}
        <div className='flex-1 space-y-6'>
          <div className='bg-gradient-to-b from-white to-[#DEEDFA] rounded-full px-4 py-2 flex items-center gap-2 w-fit shadow-sm'>
            <div className='p-1 bg-gradient-to-b from-[#43C6D1] to-[#034045] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66]'>
              <img src={faqBatch} alt='camera icon' className='w-4 h-4' />
            </div>
            <span className='text-[#034045] text-sm font-semibold'>FAQ</span>
          </div>

          <h1 className='text-[#1D1D1D] font-bold text-3xl md:text-4xl leading-snug'>
            Frequently Asked Questions
          </h1>
          <p className='text-[#667085] text-base md:text-lg'>
            Whether you're organizing your first contest or just curious about
            how voting works, our FAQ section covers it all.
          </p>

          <div className='p-2 rounded-2xl border-[#E0E7F5] shadow-sm'>
            <div className='rounded-2xl bg-gradient-to-b from-[#034045] to-[#D0F1F4] p-6 space-y-4'>
              <h3 className='text-white font-semibold text-2xl'>
                Still have questions?
              </h3>
              <p className='text-white'>
                Can&apos;t find the answer to your question? Send us an email
                and we&apos;ll get back to you as soon as possible!
              </p>
              <button className='rounded-full cursor-pointer flex items-center gap-2 px-5 py-2 bg-[#1D1D1D] w-fit'>
                <img src={contactArrow} alt='arrow icon' />
                <span className='text-white font-medium'>Contact Us</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className='flex-1 space-y-4'>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => toggle(idx)}
                className='bg-white border border-[#E0E7F5] rounded-2xl p-5 shadow-[0px_12px_30px_0px_#0A438026] space-y-3 cursor-pointer'
              >
                <div className='flex justify-between items-center'>
                  <p className='text-[#1D1D1D] font-medium text-base md:text-lg'>
                    {faq.question}
                  </p>
                  <img
                    src={arrowDown}
                    alt='arrow'
                    className={`transition-transform duration-300 w-8 h-8 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className='text-[#667085] text-sm md:text-base overflow-hidden'
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
