import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import MenuSection from '../components/landing/MenuSection';
import ReservaForm from '../components/landing/ReservaForm';
import ResenaSection from '../components/landing/ResenaSection';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MenuSection />
        <ReservaForm />
        <ResenaSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
