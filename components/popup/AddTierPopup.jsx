"use client";

import React, { useState, useEffect, useContext } from 'react';
import { HiX, HiPlus } from 'react-icons/hi';
import { CrowdfundingContext } from '../../context/CrowdfundingContext';

const AddTierPopup = ({ isOpen, onClose, campaignAddress, onTierAdded }) => {
  const { account, loading, error, setError, addTier } = useContext(CrowdfundingContext);
  
  const [formData, setFormData] = useState({
    name: '',
    cost: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close popup on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', cost: '' });
      setError('');
    }
  }, [isOpen, setError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cost') {
      // Allow only numbers and one decimal point
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Tier name is required');
      return;
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      setError('Tier cost must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Add tier to blockchain
      const success = await addTier(campaignAddress, formData.name, formData.cost);
      
      if (success) {
        // Close popup and notify parent
        onClose();
        if (onTierAdded) {
          onTierAdded();
        }
      }
    } catch (err) {
      console.error('Error adding tier:', err);
      setError(err.message || 'Failed to add tier');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Create a Funding Tier
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <HiX className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tier Name */}
            <div>
              <label 
                htmlFor="tierName" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tier Name *
              </label>
              <input
                id="tierName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Bronze Supporter, Silver Backer"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#51256b] focus:border-[#51256b] focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Tier Cost */}
            <div>
              <label 
                htmlFor="tierCost" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tier Cost (ETH) *
              </label>
              <div className="relative">
                <input
                  id="tierCost"
                  type="text"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  required
                  placeholder="0.01"
                  className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#51256b] focus:border-[#51256b] focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                  disabled={isSubmitting}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-500 font-medium">Ξ</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 0.001 ETH
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.cost}
                className="w-full bg-gradient-to-r from-[#51256b] to-[#19d8f7] hover:from-[#4a2357] hover:to-[#17c3e8] disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Adding Tier...</span>
                  </>
                ) : (
                  <>
                    <HiPlus className="h-5 w-5" />
                    <span>Add Tier</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTierPopup;