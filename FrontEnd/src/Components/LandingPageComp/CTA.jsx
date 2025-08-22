import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CTABg from '../../assets/footer-background.jpg';

const CTA = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('Email', email.trim().toLowerCase());

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbw_scjmXqPw8kXFAVFqGUTTarjNY-mPL8q9iCk3DwqLAhn8v7o_ioCNjGx7CzHcSw/exec',
        {
          method: 'POST',
          body: formData,
        }
      );
      toast.success('Email submitted successfully!');
      setEmail('');
    } catch (err) {
      console.log(err);
      toast.error('Failed to submit. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
      className='flex flex-col items-center justify-center m-4 md:m-8 bg-center rounded-3xl p-6 md:p-12 text-white space-y-6'
      style={{ backgroundImage: `url(${CTABg})` }}
    >
      <h2 className='text-2xl md:text-3xl font-bold text-center md:text-left w-full md:max-w-xl'>
        Stay Updated with ZeeContest
      </h2>
      <p className='text-center md:text-left text-sm md:text-lg text-white/80 w-full md:max-w-xl'>
        ZeeContest is launching soon. Subscribe to our newsletter to get the
        latest updates, tips for running successful contests, and exclusive
        announcements straight to your inbox.
      </p>

      <div className='relative w-full md:max-w-xl'>
        <div className='relative w-full max-w-md md:max-w-xl mx-auto'>
          <input
            type='email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className='w-full bg-white/20 placeholder-white/80 text-white py-3 md:py-4 pr-28 md:pr-36 pl-5 md:pl-6 rounded-full outline-none text-sm md:text-base'
            placeholder='Your email address'
          />
          <button
            disabled={loading}
            onClick={handleSubmit}
            className='absolute top-1.5 md:top-2 right-1.5 md:right-2 bottom-1.5 md:bottom-2 bg-[#E67347] text-white rounded-full py-2 px-4 md:px-5 shadow-[inset_4px_4px_12px_0px_#FDFDFF66] text-xs md:text-sm font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {loading ? 'Sending...' : 'Subscribe'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CTA;
