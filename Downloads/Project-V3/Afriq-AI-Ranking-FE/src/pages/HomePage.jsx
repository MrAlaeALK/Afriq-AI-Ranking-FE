// pages/HomePage.jsx
import CallToAction from '../components/home/CallToAction';
import Criteria from '../components/home/Criteria';
import Hero from '../components/home/Hero';
import Partners from '../components/home/Partners';
import Testimonials from '../components/home/Testimonials';
import {DimensionContext} from '../context/DimensionContext';
import {useContext} from 'react'

function HomePage() {
  const {dimensions} = useContext(DimensionContext)

  return (
    <>
      <Hero />
      <Criteria dimensions={dimensions} />
      <Partners />
      <Testimonials />
      <CallToAction />
    </>
  );
}

export default HomePage;