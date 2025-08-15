import { useEffect, useState } from 'react';

import testimonialBatch from '../../assets/testimonial-batch.png';
import previous from '../../assets/previous-slide.png';
import next from '../../assets/next-slide.png';
import person from '../../assets/person.png';

const testimonials = [
  {
    title: 'Highly recommend!',
    message:
      'We need several funding platforms, but this one is by far the best. The automated onboarding process has helped us build a solid portfolio, without even thinking about it. Highly recommend!',
    name: 'Emily R.',
    role: 'Entrepreneur',
    isLower: true,
  },
  {
    title: 'Excellence!',
    message:
      "As a small business owner, keeping track of expenses used to be a nightmare. This platform has streamlined everything for me, from invoicing to managing cash flow. It's a must-have tool for anyone serious about their business!",
    name: 'James D.',
    role: 'Business Owner',
    isLower: false,
  },
  {
    title: 'Impressive!',
    message:
      "The platform has been a game-changer for my team. We can track our website data and make data-driven goals. Team Reporting, and clear for the future with ease. It's made the customer relationships that drove results.",
    name: 'David P.',
    role: 'Tech Professional',
    isLower: true,
  },
  {
    title: 'Amazing work',
    message:
      'This platform has completely transformed how we manage our finances. The intuitive interface and powerful analytics have streamlined our entire workflow. I can now track every expense with ease.',
    name: 'David Gilmour',
    role: 'Finance Director',
    isLower: false,
  },
  {
    title: 'Outstanding!',
    message:
      'Simple, intuitive, and powerful. I love how easy it is to get insights and make quick decisions with this platform. The reporting features are exactly what our team needed.',
    name: 'Sarah T.',
    role: 'Startup Founder',
    isLower: true,
  },
  {
    title: 'Incredible results!',
    message:
      'Managing tasks and deadlines used to overwhelm my team. This tool changed that entirely. It keeps us organized and efficient, and the collaboration features are top-notch.',
    name: 'Michael Chen',
    role: 'Project Manager',
    isLower: false,
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsPerView(1);
      else if (width < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + cardsPerView >= testimonials.length ? 0 : prev + cardsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? Math.max(0, testimonials.length - cardsPerView)
        : prev - cardsPerView
    );
  };

  return (
    <section className='py-8 md:py-16 px-4 md:px-10 lg:px-24 bg-white overflow-hidden'>
      <div className='text-left mb-4 md:mb-10 space-y-4'>
        <div className='bg-gradient-to-b from-white to-[#DEEDFA] rounded-full px-4 py-2 flex items-center gap-2 w-fit shadow-sm mx-0'>
          <div className='p-2 bg-gradient-to-b from-[#43C6D1] to-[#034045] rounded-full shadow-[inset_4px_4px_12px_0px_#FDFDFF66]'>
            <img src={testimonialBatch} alt='camera icon' className='w-4 h-4' />
          </div>
          <span className='text-[#034045] text-sm font-semibold'>
            Testimonials
          </span>
        </div>
        <h2 className='flex md:flex-row flex-col items-start text-[#1D1D1D] font-bold text-3xl md:text-4xl leading-snug gap-2'>
          <span>What People</span>
          <span className='text-[#034045]'>Say About Us</span>
        </h2>
      </div>

      <div className='flex justify-end mb-6 mt-2 gap-4'>
        <button
          onClick={prevSlide}
          className='hover:opacity-80 transition-opacity'
          aria-label='Previous testimonial'
        >
          <img
            src={previous}
            alt='Previous testimonial'
            className='w-10 h-10'
          />
        </button>
        <button
          onClick={nextSlide}
          className='hover:opacity-80 transition-opacity'
          aria-label='Next testimonial'
        >
          <img src={next} alt='Next testimonial' className='w-10 h-10' />
        </button>
      </div>

      <div className='relative w-full overflow-y-hidden overflow-x-auto scrollbar-hidden'>
        <div
          className='flex md:gap-3 transition-transform duration-500 ease-in-out'
          style={{
            transform: `translateX(-${
              (currentIndex / testimonials.length) * 100
            }%)`,
            width: `${(testimonials.length / cardsPerView) * 100}%`,
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 bg-[#F9F9FA] border border-[#E0E7F5] shadow-[0px_34px_34px_0px_#0A438026] rounded-3xl p-3 flex flex-col justify-between transition-all duration-300 h-[300px] ${
                testimonial.isLower ? 'mt-16' : 'mt-0'
              }`}
              style={{ width: `${100 / testimonials.length}%` }}
            >
              <div className='border border-[#E0E7F5] bg-[linear-gradient(224.22deg,_#FFFFFF_40%,_#DEEDFA_100%)] rounded-2xl p-4 space-y-3 flex-grow'>
                <h3 className='text-[#1D1D1D] font-semibold text-lg'>
                  {testimonial.title}
                </h3>
                <p className='text-[#667085] text-sm leading-relaxed'>
                  {testimonial.message}
                </p>
              </div>

              <div className='border border-[#E0E7F5] mt-4 p-3 rounded-2xl flex items-center justify-between bg-white'>
                <div className='flex items-center gap-3'>
                  <img src={person} alt='user avatar' className='w-10 h-10' />
                  <p className='text-[#1D1D1D] font-medium'>
                    {testimonial.name}
                  </p>
                </div>
                <p className='italic text-[#949AA9] text-sm'>
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-center mt-8 gap-2'>
        {Array.from({
          length: Math.ceil(testimonials.length / cardsPerView),
        }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx * cardsPerView)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / cardsPerView) === idx
                ? 'bg-[#034045]'
                : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
