import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CTABg from "../../assets/footer-background.jpg";

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
        Be the First to Launch Your Contest with ZeeContest
      </h2>
      <p className='text-center md:text-left text-sm md:text-lg text-white/80 w-full md:max-w-xl'>
        ZeeContest is almost ready, and you can be among the first to experience
        it. Join the waitlist today and get early access, exclusive updates, and
        priority support when we go live.
      </p>

      <div className='relative w-full md:max-w-xl'>
        <input
          type='email'
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className='w-full bg-white/20 placeholder-white/80 text-white py-4 pr-36 pl-6 rounded-full outline-none text-xs md:text-base'
          placeholder='Your email address'
        />
        <button
          disabled={loading}
          onClick={handleSubmit}
          className='absolute top-2 right-2 bottom-2 bg-[#E67347] text-white rounded-full px-5 shadow-[inset_4px_4px_12px_0px_#FDFDFF66] text-sm font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Sending...' : 'Join the waitlist'}
        </button>
      </div>
    </motion.div>
  );
};

export default CTA;
