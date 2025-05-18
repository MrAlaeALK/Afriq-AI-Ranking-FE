// pages/HomePage.jsx
import CallToAction from '../components/home/CallToAction';
import Criteria from '../components/home/Criteria';
import Hero from '../components/home/Hero';
import Partners from '../components/home/Partners';
import Testimonials from '../components/home/Testimonials';
import {IndicatorContext} from '../context/IndicatorContext';
import {useContext} from 'react'

function HomePage() {
  const {defaultIndicators} = useContext(IndicatorContext)

  return (
    <>
      <Hero />
      <Criteria defaultIndicators={defaultIndicators} />
      <Partners />
      <Testimonials />
      <CallToAction />
    </>
  );
}

export default HomePage;