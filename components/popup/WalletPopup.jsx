"use client";

import React, { useContext, useEffect } from 'react';
import { 
  HiX, 
  HiCreditCard, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiClipboardCopy,
  HiLogout
} from 'react-icons/hi';
import { CrowdfundingContext } from '../../context/CrowdfundingContext';

const WalletPopup = ({ isOpen, onClose }) => {
  const {
    account,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    setError,
    isBlockchainAvailable
  } = useContext(CrowdfundingContext);

  // Close popup on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Clear error when popup opens
  useEffect(() => {
    if (isOpen && error) {
      setError('');
    }
  }, [isOpen, error, setError]);

  // Handle connect wallet
  const handleConnect = async () => {
    try {
      await connectWallet();
      if (account) {
        onClose();
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
    }
  };

  // Handle disconnect wallet
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      onClose();
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  // Copy address to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay con mejor blur y gradiente - CENTRADO VERTICALMENTE */}
      <div 
        className="fixed inset-0 z-[100] transition-all duration-300 flex items-center justify-center p-4"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'radial-gradient(circle at center, rgba(25, 216, 247, 0.15) 0%, rgba(81, 37, 107, 0.25) 50%, rgba(0, 0, 0, 0.4) 100%)',
          minHeight: '100vh',
          minHeight: '100dvh', // Dynamic viewport height para móviles
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        {/* Popup Container - Más compacto y responsive */}
        <div 
          className="relative w-full max-w-md sm:max-w-lg mx-auto my-auto transform transition-all duration-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
            borderRadius: '24px', // Reducido de 32px a 24px
            maxHeight: 'calc(100vh - 1rem)', // Reducido margen
            maxHeight: 'calc(100dvh - 1rem)', // Para móviles
            overflowY: 'auto', // Scroll si es necesario
            boxShadow: `
              0 20px 40px -8px rgba(0, 0, 0, 0.35),
              0 0 0 1px rgba(25, 216, 247, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
            border: '2px solid rgba(25, 216, 247, 0.15)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header más compacto */}
          <div 
            className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gradient"
            style={{
              background: 'linear-gradient(135deg, rgba(25, 216, 247, 0.1) 0%, rgba(81, 37, 107, 0.05) 100%)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              borderBottom: '1px solid rgba(25, 216, 247, 0.1)'
            }}
          >
            {/* Elementos decorativos más pequeños */}
            <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 opacity-20">
              <div 
                className="w-full h-full rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(25, 216, 247, 0.6) 0%, transparent 70%)',
                  filter: 'blur(15px)'
                }}
              />
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="relative w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(145deg, #19d8f7 0%, #0ea5e9 100%)',
                    boxShadow: '0 6px 20px rgba(25, 216, 247, 0.4)'
                  }}
                >
                  <HiCreditCard className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-white ring-opacity-20" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {account ? 'Wallet Connected' : 'Connect Wallet'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {account ? 'Manage connection' : 'Connect to start using the platform'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 group hover:scale-110 cursor-pointer"
                style={{backgroundColor: 'rgba(148, 163, 184, 0.1)'}}
              >
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <HiX className="h-5 sm:h-6 w-5 sm:w-6 text-slate-400 group-hover:text-slate-800 transition-colors duration-300 relative z-10" />
              </button>
            </div>
          </div>

          {/* Content más compacto */}
          <div className="p-4 sm:p-6 pt-3 sm:pt-4">
            {/* Blockchain not available warning - más compacto */}
            {!isBlockchainAvailable && (
              <div className="mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl relative overflow-hidden" style={{backgroundColor: 'rgba(251, 146, 60, 0.08)', border: '1.5px solid rgba(251, 146, 60, 0.2)'}}>
                <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                  <div 
                    className="w-full h-full rounded-full"
                    style={{background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'}}
                  />
                </div>
                <div className="relative flex items-start space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl" style={{backgroundColor: 'rgba(251, 146, 60, 0.2)'}}>
                    <HiExclamationCircle className="h-4 sm:h-5 w-4 sm:w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-orange-800 mb-0.5">Demo Mode</h4>
                    <p className="text-xs sm:text-sm text-orange-700 leading-relaxed">
                      Blockchain functionality not available.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error message más compacto */}
            {error && (
              <div className="mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl relative overflow-hidden" style={{backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1.5px solid rgba(239, 68, 68, 0.2)'}}>
                <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                  <div 
                    className="w-full h-full rounded-full"
                    style={{background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)'}}
                  />
                </div>
                <div className="relative flex items-start space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)'}}>
                    <HiExclamationCircle className="h-4 sm:h-5 w-4 sm:w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 mb-0.5">Error</h4>
                    <p className="text-xs sm:text-sm text-red-700 leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Connected State más compacto */}
            {account ? (
              <div className="space-y-4">
                {/* Success indicator compacto */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl relative overflow-hidden" style={{backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1.5px solid rgba(34, 197, 94, 0.2)'}}>
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                    <div 
                      className="w-full h-full rounded-full"
                      style={{background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)'}}
                    />
                  </div>
                  <div className="relative flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl" style={{backgroundColor: 'rgba(34, 197, 94, 0.2)'}}>
                      <HiCheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-green-800">Wallet Connected</h4>
                      <p className="text-xs sm:text-sm text-green-700">Ready to interact</p>
                    </div>
                  </div>
                </div>

                {/* Account info más compacto */}
                <div 
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(25, 216, 247, 0.05)', 
                    border: '1.5px solid rgba(25, 216, 247, 0.2)',
                    background: 'linear-gradient(135deg, rgba(25, 216, 247, 0.05) 0%, rgba(81, 37, 107, 0.02) 100%)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                    <div 
                      className="w-full h-full rounded-full"
                      style={{background: 'radial-gradient(circle, #19d8f7 0%, transparent 70%)'}}
                    />
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-slate-600 mb-1.5 font-medium">Connected Account</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                        <p className="font-mono text-sm sm:text-base font-semibold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                          {formatAddress(account)}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono truncate">{account}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account)}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 group hover:scale-110 ml-2"
                      style={{backgroundColor: 'rgba(148, 163, 184, 0.1)'}}
                      title="Copy full address"
                    >
                      <HiClipboardCopy className="h-4 sm:h-5 w-4 sm:w-5 text-slate-500 group-hover:text-slate-700 transition-colors duration-300" />
                    </button>
                  </div>
                </div>

                {/* Disconnect button más compacto */}
                <button
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 border-2 text-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2 sm:space-x-3">
                    <HiLogout className="h-4 sm:h-5 w-4 sm:w-5" />
                    <span className="text-sm sm:text-base">Disconnect</span>
                  </div>
                </button>
              </div>
            ) : (
              /* Disconnected State más compacto */
              <div className="space-y-4">
                {/* MetaMask connect más compacto */}
                <div 
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.01] relative overflow-hidden group"
                  style={{
                    backgroundColor: 'rgba(25, 216, 247, 0.05)', 
                    border: '1.5px solid rgba(25, 216, 247, 0.2)',
                    background: 'linear-gradient(135deg, rgba(25, 216, 247, 0.05) 0%, rgba(81, 37, 107, 0.02) 100%)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <div 
                      className="w-full h-full rounded-full"
                      style={{background: 'radial-gradient(circle, #19d8f7 0%, transparent 70%)'}}
                    />
                  </div>
                  
                  <div className="relative flex items-center space-x-3 mb-3 sm:mb-4">
                    <div 
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg relative"
                      style={{
                        background: 'linear-gradient(145deg, #f97316 0%, #ea580c 100%)',
                        boxShadow: '0 6px 20px rgba(249, 115, 22, 0.3)'
                      }}
                    >
                      <span className="text-white font-bold text-lg sm:text-xl">M</span>
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-white ring-opacity-20" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        MetaMask
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">Connect using browser wallet</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleConnect}
                    disabled={loading || !isBlockchainAvailable}
                    className="w-full px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2 sm:space-x-3 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(145deg, #19d8f7 0%, #0ea5e9 100%)',
                      boxShadow: '0 6px 20px rgba(25, 216, 247, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center space-x-2 sm:space-x-3">
                      {loading ? (
                        <>
                          <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm sm:text-base">Connecting...</span>
                        </>
                      ) : (
                        <>
                          <HiCreditCard className="h-4 sm:h-5 w-4 sm:w-5" />
                          <span className="text-sm sm:text-base">Connect MetaMask</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Info section más compacta */}
                <div 
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.05)', 
                    border: '1.5px solid rgba(99, 102, 241, 0.15)',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.03) 100%)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <div 
                      className="w-full h-full rounded-full"
                      style={{background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)'}}
                    />
                  </div>
                  <div className="relative">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                      <div 
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                        style={{backgroundColor: 'rgba(99, 102, 241, 0.2)'}}
                      >
                        <HiCheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-600" />
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Why connect?
                      </h4>
                    </div>
                    <div className="space-y-2 ml-10 sm:ml-13">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        <span className="text-xs sm:text-sm text-slate-600">Create and fund campaigns</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                        <span className="text-xs sm:text-sm text-slate-600">Track contributions</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                        <span className="text-xs sm:text-sm text-slate-600">Secure transactions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer más compacto */}
          <div 
            className="px-4 sm:px-6 py-3 sm:py-4 border-t text-center relative"
            style={{
              borderTop: '1px solid rgba(25, 216, 247, 0.1)',
              background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.5) 100%)',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px'
            }}
          >
            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              <p className="text-xs sm:text-sm font-medium">
                Secured by Ethereum blockchain
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletPopup;