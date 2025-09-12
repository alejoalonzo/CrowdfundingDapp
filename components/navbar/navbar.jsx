"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiHome, 
  HiCollection, 
  HiPlus, 
  HiInformationCircle, 
  HiMail,
  HiMenuAlt3,
  HiX,
  HiCreditCard
} from 'react-icons/hi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: HiHome },
    { name: 'Campaigns', href: '/campaigns', icon: HiCollection },
    { name: 'Create', href: '/create', icon: HiPlus },
    { name: 'About', href: '/about', icon: HiInformationCircle },
    { name: 'Contact', href: '/contact', icon: HiMail }
  ];

  return (
    <nav className="bg-transparent border-b border-white border-opacity-30 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <div className={`flex items-center transition-opacity duration-300 ${isMenuOpen ? 'md:flex opacity-0 md:opacity-100' : 'opacity-100'}`}>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#19d8f7'}}>
                <span className="text-white font-bold text-lg md:text-xl">C</span>
              </div>
              <span className="font-bold text-xl md:text-2xl text-white">
                CrowdFund
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="nav-link text-white px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-all duration-300 relative"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Connect Wallet Button */}
          <div className="hidden md:flex items-center">
            <button className="px-6 py-2 rounded-full text-white font-semibold border-2 transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black" style={{backgroundColor: '#000000', borderColor: '#000000'}}>
              Connect Wallet
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-cyan-300 focus:outline-none transition-colors duration-200 p-2"
            >
              {isMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenuAlt3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 z-40 md:hidden transition-all duration-300"
            style={{
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)'
            }}
            onClick={toggleMenu}
          />
        )}

        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-screen min-h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`} style={{backgroundColor: '#ffffff', height: '100vh', minHeight: '100vh'}}>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100" style={{backgroundColor: '#ffffff'}}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#19d8f7'}}>
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl" style={{color: '#51256b'}}>
                CrowdFund
              </span>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <HiX className="h-6 w-6" style={{color: '#51256b'}} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="px-6 py-8" style={{backgroundColor: '#ffffff'}}>
            {/* Navigation Links */}
            <div className="space-y-2 mb-8">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'rgba(25, 216, 247, 0.1)', border: '1px solid rgba(25, 216, 247, 0.2)'}}>
                      <IconComponent className="h-6 w-6" style={{color: '#19d8f7'}} />
                    </div>
                    <span className="text-lg font-medium uppercase tracking-wide group-hover:translate-x-1 transition-transform duration-300" style={{color: '#51256b'}}>
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Connect Wallet Button */}
            <div className="pt-4 border-t border-gray-100">
              <button 
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                style={{backgroundColor: '#19d8f7'}}
                onClick={() => setIsMenuOpen(false)}
              >
                <HiCreditCard className="h-5 w-5" />
                <span>Connect Wallet</span>
              </button>
            </div>

            {/* Footer */}
            <div className="pt-8 text-center">
              <p className="text-sm text-gray-500">
                Decentralized Crowdfunding Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;