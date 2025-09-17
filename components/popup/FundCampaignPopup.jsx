"use client";

import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { HiX, HiClock, HiTrendingUp, HiCollection, HiCurrencyDollar } from 'react-icons/hi';
import { CrowdfundingContext } from '../../context/CrowdfundingContext';

const FundCampaignPopup = ({ isOpen, onClose, campaign }) => {
  const { account, loading, error, setError, fundCampaign } = useContext(CrowdfundingContext);
  
  const [selectedTier, setSelectedTier] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Reset state when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTier(null);
      setError('');
    }
  }, [isOpen, setError]);

  // Calculate progress percentage
  const progressPercentage = campaign ? 
    (parseFloat(campaign.balance) / parseFloat(campaign.goal)) * 100 : 0;

  // Format deadline
  const formatDeadline = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days left
  const getDaysLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline * 1000);
    const timeDiff = deadlineDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    // No need to set custom amount anymore since we use tier amount directly
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTier) {
      setError('Please select a funding tier');
      return;
    }

    if (!campaign?.address) {
      setError('Campaign address not found');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Fund using selected tier with original index
      const tierIndex = selectedTier.originalIndex;
      if (tierIndex === undefined) {
        setError('Tier index not found');
        return;
      }
      
      const amount = selectedTier.cost || selectedTier.amount;
      const success = await fundCampaign(campaign.address, tierIndex, amount);
      
      if (success) {
        console.log('Campaign funded successfully!');
        onClose();
      }
    } catch (err) {
      console.error('Error donating:', err);
      setError(err.message || 'Failed to process donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked, closing popup');
      onClose();
    }
  };

  // Prevent content clicks from closing popup
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen || !campaign || !mounted) return null;

  // Filter selected tiers (for now, we'll show all tiers as we need to implement the selection logic)
  const selectedTiers = campaign.tiers || [];

  const popupContent = (
    <div 
      className="popup-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        onClick={handleContentClick}
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Fund Campaign
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <HiX className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="p-6">
          {/* Campaign Info */}
          <div className="mb-8">
            {/* Campaign Title & Status */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {campaign.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {campaign.description}
                </p>
              </div>
              <div className="ml-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.state === 0
                      ? "bg-green-100 text-green-800"
                      : campaign.state === 1
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {campaign.state === 0
                    ? "Active"
                    : campaign.state === 1
                    ? "Successful"
                    : "Failed"}
                </span>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center mb-6">
              <HiClock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Campaign Deadline</p>
                <p className="font-semibold text-gray-900">
                  {formatDeadline(campaign.deadline)} ({getDaysLeft(campaign.deadline)} days left)
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Funding Progress
                </h4>
                <span className="text-lg font-bold text-[#51256b]">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] h-3 rounded-full transition-all duration-500 relative"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <HiTrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-green-600 font-medium text-sm">
                        Amount Raised
                      </p>
                      <p className="text-lg font-bold text-green-800">
                        {parseFloat(campaign.balance || 0).toFixed(4)} ETH
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <HiCollection className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium text-sm">
                        Funding Goal
                      </p>
                      <p className="text-lg font-bold text-blue-800">
                        {parseFloat(campaign.goal || 0).toFixed(4)} ETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Tiers Section */}
          {selectedTiers.length > 0 ? (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {campaign.hasSelectedTiers ? 'Selected Funding Tiers' : 'All Available Funding Tiers'}
                </h4>
                {!campaign.hasSelectedTiers && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Showing all tiers
                  </span>
                )}
              </div>
              {!campaign.hasSelectedTiers && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 The campaign owner hasn't selected specific tiers yet, so all available tiers are shown.
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {selectedTiers.map((tier, index) => (
                  <div
                    key={index}
                    onClick={() => handleTierSelect(tier)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedTier === tier
                        ? 'border-[#51256b] bg-gradient-to-r from-[#51256b]/5 to-[#19d8f7]/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-semibold text-gray-900">{tier.name}</h5>
                        <p className="text-sm text-gray-600">Contribution level</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#51256b]">
                          {parseFloat(tier.cost || tier.amount).toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                  No Funding Tiers Available
                </h4>
                <p className="text-yellow-700 text-sm">
                  The campaign owner hasn't selected any funding tiers yet. Please check back later or contact the campaign owner.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedTier && (
            <div className="bg-gradient-to-r from-[#51256b]/5 to-[#19d8f7]/5 p-4 rounded-xl border border-[#51256b]/20 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Tier:</p>
                  <p className="font-semibold text-gray-900">{selectedTier.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Amount:</p>
                  <p className="text-2xl font-bold text-[#51256b]">
                    {parseFloat(selectedTier.cost || selectedTier.amount).toFixed(4)} ETH
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !selectedTier}
                className="w-full bg-gradient-to-r from-[#51256b] to-[#19d8f7] hover:from-[#4a2357] hover:to-[#17c3e8] disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : selectedTier ? (
                  <>
                    <HiCurrencyDollar className="h-5 w-5" />
                    <span>Fund with {parseFloat(selectedTier.cost || selectedTier.amount).toFixed(4)} ETH</span>
                  </>
                ) : (
                  <>
                    <span>Please select a tier</span>
                  </>
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
};

export default FundCampaignPopup;