"use client";

import React from 'react';
import Image from 'next/image';

const Home = () => {
  return (
    <section className="hero-gradient hero-clip-path min-h-screen flex items-center justify-center relative pt-20 md:pt-24">
      {/* Main content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold md:font-black text-white mb-6 fade-in-up leading-tight mt-16 md:mt-12 md:leading-tight lg:leading-tight" style={{lineHeight: '1.1'}}>
          <span className="block md:inline">Crowdfunding</span>
          <span className="block md:inline md:ml-4">
            <span className="text-white-80">of the Future</span>
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-white-80 mb-8 max-w-4xl mx-auto fade-in-down leading-relaxed">
          Decentralized platform where your ideas come to life through the power of community
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-4 fade-in-left">
          <button 
            className="group bg-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer hover:bg-transparent hover:text-white" 
            style={{color: '#51256b'}}
          >
            Create Campaign
            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
          
          <button 
            className="explore-btn group bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white transition-all duration-300 transform hover:scale-105 cursor-pointer hover:bg-white"
            onClick={() => {
              const campaignsSection = document.querySelector('#campaigns');
              if (campaignsSection) {
                campaignsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Explore Projects
            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
        
        {/* Treasure chest image */}
        <div className="flex justify-center mt-2 md:mt-2 lg:mt-2">
          <div className="relative w-96 h-96 md:w-[30rem] md:h-[30rem] lg:w-[36rem] lg:h-[36rem]">
            <Image
              src="/images/chest.png"
              alt="Treasure Chest"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce z-30">
        <div className="w-6 h-10 border-2 border-gray-600 bg-white bg-opacity-90 rounded-full flex justify-center opacity-75">
          <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Home;