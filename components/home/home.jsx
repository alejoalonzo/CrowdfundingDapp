import React from 'react';
import Image from 'next/image';

const Home = () => {
  return (
    <section className="hero-gradient hero-clip-path min-h-screen flex items-start justify-center relative pt-8 md:pt-12">
      {/* Main content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold md:font-black text-white mb-6 fade-in-up leading-tight">
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
          <button className="group bg-white text-purple px-8 py-4 rounded-full text-lg font-semibold hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 transform hover:scale-105 shadow-lg">
            Create Campaign
            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
          
          <button className="group bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-purple transition-all duration-300 transform hover:scale-105">
            Explore Projects
            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
        
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-white rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-12 h-12 border-2 rounded-full opacity-40 animate-bounce" style={{borderColor: 'rgba(34, 211, 238, 0.3)'}}></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border-2 border-white rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-60 right-10 w-8 h-8 rounded-full opacity-60 animate-bounce" style={{backgroundColor: 'rgba(34, 211, 238, 0.2)'}}></div>
      <div className="absolute top-60 left-1/3 w-6 h-6 bg-white rounded-full opacity-45 animate-ping"></div>
      <div className="absolute bottom-32 right-1/3 w-10 h-10 border border-white rounded-full opacity-20"></div>
      <div className="absolute top-32 right-1/4 w-4 h-4 rounded-full opacity-25 animate-pulse" style={{backgroundColor: 'rgba(34, 211, 238, 0.2)'}}></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce z-30">
        <div className="w-6 h-10 border-2 border-gray-600 bg-white bg-opacity-90 rounded-full flex justify-center opacity-75">
          <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Treasure chest image */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-50 xl:translate-y-5 z-10">
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
    </section>
  );
};

export default Home;