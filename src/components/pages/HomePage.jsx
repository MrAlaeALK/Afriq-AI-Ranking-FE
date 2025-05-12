// pages/HomePage.jsx
import React from 'react';
import Hero from '../Hero';
import Criteria from '../Criteria';
import Partners from '../Partners';
import Testimonials from '../Testimonials';
import CallToAction from '../CallToAction';

function HomePage({indicators}) {
  console.log("home page rendered")
  return (
    <>
      <Hero />
      <Criteria indicators = {indicators}/>
      <Partners />
      <Testimonials />
      <CallToAction />
    </>
  );
}

export default HomePage;