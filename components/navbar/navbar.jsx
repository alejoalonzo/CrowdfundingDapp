"use client";

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiHome, 
  HiCollection, 
  HiPlus, 
  HiInformationCircle, 
  HiMail,
  HiMenuAlt3,
  HiX,
  HiCreditCard,
  HiCheckCircle,
  HiLogout
} from 'react-icons/hi';
import { CrowdfundingContext } from '../../context/CrowdfundingContext';
import { WalletPopup } from '../popup';
import { ClientOnly } from '../../hooks/useHydration';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const { account, loading, disconnectWallet } = useContext(CrowdfundingContext);

  // Determine if we're on dashboard page
  const isDashboard = pathname === '/dashboard';

  // Handle mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleWalletPopup = () => {
    setIsWalletPopupOpen(!isWalletPopupOpen);
  };

  const closeWalletPopup = () => {
    setIsWalletPopupOpen(false);
  };

  const handleDisconnectClick = () => {
    // Abrir popup para mostrar opciones de desconectar
    setIsWalletPopupOpen(true);
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

  const baseNavLinks = [
    { name: 'Home', href: '#home', icon: HiHome },
    { name: 'Campaigns', href: '#campaigns', icon: HiCollection },
    { name: 'About', href: '#about', icon: HiInformationCircle },
    { name: 'Contact', href: '#contact', icon: HiMail }
  ];

  // Always render base links to avoid hydration mismatch
  // Dashboard link visibility is controlled by CSS opacity
  const allNavLinks = [
    ...baseNavLinks.slice(0, 2), // Home y Campaigns
    { name: 'Dashboard', href: '/dashboard', icon: HiPlus, requiresWallet: true },
    ...baseNavLinks.slice(2) // About y Contact
  ];

  return (
    <nav className={`${
      isDashboard 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
        : 'bg-transparent border-b border-white border-opacity-30 backdrop-blur-sm'
    } fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <div className={`flex items-center transition-opacity duration-300 ${isMenuOpen ? 'md:flex opacity-0 md:opacity-100' : 'opacity-100'}`}>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#19d8f7'}}>
                <span className="text-white font-bold text-lg md:text-xl">C</span>
              </div>
              <span className={`font-bold text-xl md:text-2xl ${
                isDashboard ? 'text-gray-800' : 'text-white'
              } transition-colors duration-300`}>
                CrowdFund
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {allNavLinks.map((link) => {
              // Hide dashboard link if wallet not connected, but always render
              if (link.requiresWallet && !account) {
                return null;
              }
              
              return link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link ${isDashboard ? 'dashboard-link' : ''} px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-all duration-300 relative cursor-pointer ${
                    isDashboard 
                      ? '!text-gray-800 hover:!text-purple-600 hover:bg-purple-50' 
                      : 'text-white hover:text-cyan-300'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={`nav-link ${isDashboard ? 'dashboard-link' : ''} px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-all duration-300 relative cursor-pointer ${
                    isDashboard 
                      ? '!text-gray-800 hover:!text-purple-600 hover:bg-purple-50' 
                      : 'text-white hover:text-cyan-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isDashboard) {
                      // Si estamos en dashboard, navegar a la página principal con el hash
                      window.location.href = `/${link.href}`;
                    } else {
                      // Si estamos en la página principal, hacer scroll suave
                      const element = document.querySelector(link.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Desktop Connect Wallet Button */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Botón principal - Solo clickable si no está conectado */}
            <button 
              onClick={account ? null : toggleWalletPopup} // Solo clickable si no hay account
              disabled={loading}
              className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 overflow-hidden group ${
                account ? 'cursor-default' : 'cursor-pointer hover:scale-105 hover:shadow-lg'
              }`}
              style={{
                background: account 
                  ? (isDashboard ? '#000000' : '#000000')
                  : 'linear-gradient(135deg, #51256b, #19d8f7)',
                color: 'white',
                border: 'none'
              }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : account ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                    <span>{formatAddress(account)}</span>
                  </>
                ) : (
                  <>
                    <HiCreditCard className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </span>
              
              {/* Glow effect */}
              {!account && (
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%]"></div>
              )}
            </button>
            
            {/* Disconnect Button - Solo visible cuando está conectado */}
            {account && !loading && (
              <button 
                onClick={handleDisconnectClick}
                className="relative w-10 h-10 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center justify-center overflow-hidden group hover:shadow-lg p-0.5"
                style={{
                  background: isDashboard 
                    ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' 
                    : 'linear-gradient(135deg, #51256b, #3d1c52, #2a1338)',
                  color: isDashboard ? '#7c3aed' : '#51256b'
                }}
                title="Disconnect Wallet"
              >
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    background: '#ffffff'
                  }}
                >
                  <span className="relative z-10">
                    <HiLogout className="h-4 w-4" />
                  </span>
                </div>
                
                {/* Glow effect */}
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%] rounded-full"></div>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`focus:outline-none transition-colors duration-200 p-2 ${
                isDashboard 
                  ? 'text-gray-700 hover:text-purple-600' 
                  : 'text-white hover:text-cyan-300'
              }`}
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
              {allNavLinks.map((link) => {
                // Hide dashboard link if wallet not connected, but always render structure
                if (link.requiresWallet && !account) {
                  return null;
                }
                
                const IconComponent = link.icon;
                return link.href.startsWith('/') ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 transition-all duration-300 group cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'rgba(25, 216, 247, 0.1)', border: '1px solid rgba(25, 216, 247, 0.2)'}}>
                      <IconComponent className="h-6 w-6" style={{color: '#19d8f7'}} />
                    </div>
                    <span className="text-lg font-medium uppercase tracking-wide group-hover:translate-x-1 transition-transform duration-300" style={{color: '#51256b'}}>
                      {link.name}
                    </span>
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 transition-all duration-300 group cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isDashboard) {
                        // Si estamos en dashboard, navegar a la página principal con el hash
                        window.location.href = `/${link.href}`;
                      } else {
                        // Si estamos en la página principal, hacer scroll suave
                        const element = document.querySelector(link.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                      setIsMenuOpen(false);
                    }}
                  >
                    <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'rgba(25, 216, 247, 0.1)', border: '1px solid rgba(25, 216, 247, 0.2)'}}>
                      <IconComponent className="h-6 w-6" style={{color: '#19d8f7'}} />
                    </div>
                    <span className="text-lg font-medium uppercase tracking-wide group-hover:translate-x-1 transition-transform duration-300" style={{color: '#51256b'}}>
                      {link.name}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Connect Wallet Button */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  if (!account) toggleWalletPopup();
                  else handleDisconnectClick();
                }}
                disabled={loading}
                className="relative w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
                style={{
                  background: account 
                    ? '#000000' 
                    : 'linear-gradient(135deg, #51256b, #19d8f7)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <span className="relative z-10 flex items-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : account ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                      <span>{formatAddress(account)}</span>
                    </>
                  ) : (
                    <>
                      <HiCreditCard className="h-5 w-5" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </span>
                
                {/* Glow effect */}
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%]"></div>
              </button>

              {/* Disconnect Button Mobile - Solo visible cuando está conectado */}
              {account && !loading && (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleDisconnectClick();
                  }}
                  className="relative w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #51256b, #19d8f7)',
                    color: 'white',
                    border: 'none'
                  }}
                  title="Disconnect Wallet"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <HiLogout className="h-5 w-5" />
                    <span>Disconnect Wallet</span>
                  </span>
                  
                  {/* Glow effect */}
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-600 group-hover:left-[100%] rounded-full"></div>
                </button>
              )}
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

      {/* Wallet Popup */}
      <WalletPopup 
        isOpen={isWalletPopupOpen} 
        onClose={closeWalletPopup}
      />
    </nav>
  );
};

export default Navbar;