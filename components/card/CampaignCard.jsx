"use client";

import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CrowdfundingContext } from '../../context/CrowdfundingContext';
import { FundCampaignPopup } from '../popup';

const CampaignCard = ({ 
  title = "Revolutionary DeFi Platform", 
  description = "Building the future of decentralized finance with cutting-edge blockchain technology", 
  currentAmount = "2.5", 
  targetAmount = "10.0", 
  daysLeft = "15", 
  category = "DeFi",
  backers = "127",
  image = "/images/example.png",
  owner = "0x123...abc",
  campaignAddress = null, // Address for blockchain campaigns
  context = "landing" // "landing" or "dashboard"
}) => {
  const router = useRouter();
  const { account, getCampaignDetails, getSelectedTiers } = useContext(CrowdfundingContext);
  
  // State for popup
  const [isFundPopupOpen, setIsFundPopupOpen] = useState(false);
  const [campaignFullData, setCampaignFullData] = useState(null);
  
  // Safely parse numerical values
  const safeCurrentAmount = parseFloat(currentAmount || 0);
  const safeTargetAmount = parseFloat(targetAmount || 1);
  const progressPercentage = (safeCurrentAmount / safeTargetAmount) * 100;

  // Format display values
  const displayCurrentAmount = safeCurrentAmount.toFixed(2);
  const displayTargetAmount = safeTargetAmount.toFixed(2);
  const displayDaysLeft = daysLeft || "0";

  // Determine if user owns this campaign
  const isOwner = account && owner && (
    owner.toLowerCase() === account.toLowerCase() ||
    owner === `${account.slice(0, 6)}...${account.slice(-4)}`
  );

  // Determine button text and action
  const getButtonConfig = () => {
    if (context === "dashboard" && isOwner && campaignAddress) {
      return {
        text: "Edit Campaign",
        action: () => router.push(`/campaign/${campaignAddress}`)
      };
    }
    return {
      text: "Fund Project",
      action: handleFundProject
    };
  };

  // Handle fund project click
  const handleFundProject = async () => {
    if (!campaignAddress) {
      console.log("Fund project clicked - Static campaign");
      return;
    }

    try {
      // Get full campaign details including tiers
      const fullData = await getCampaignDetails(campaignAddress);
      if (fullData) {
        // Get selected tiers with their original indexes
        const selectedTierIndexes = getSelectedTiers(campaignAddress);
        
        let tiersToShow;
        if (selectedTierIndexes.length > 0) {
          // Show only selected tiers if any are selected
          tiersToShow = selectedTierIndexes.map(index => ({
            ...fullData.tiers[index],
            originalIndex: index
          }));
        } else {
          // Show all tiers if none are selected (for new users/browsers)
          tiersToShow = fullData.tiers.map((tier, index) => ({
            ...tier,
            originalIndex: index
          }));
        }
        
        // Add tiers to campaign data
        const campaignWithTiers = {
          ...fullData,
          tiers: tiersToShow,
          allTiersCount: fullData.tiers.length,
          hasSelectedTiers: selectedTierIndexes.length > 0
        };
        
        setCampaignFullData(campaignWithTiers);
        setIsFundPopupOpen(true);
      }
    } catch (error) {
      console.error("Error loading campaign for funding:", error);
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="campaign-card-modern group">
      {/* Imagen header con overlay gradient */}
      <div className="card-image-container">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="card-overlay">
          <div className="category-badge">
            <span>{category}</span>
          </div>
          <div className="days-left-badge">
            <div className="days-number">{displayDaysLeft}</div>
            <div className="days-text">days left</div>
          </div>
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="card-content">
        {/* Owner info */}
        <div className="owner-info">
          <div className="owner-avatar">
            <div className="avatar-gradient"></div>
            <span className="avatar-text">{owner.slice(2, 4).toUpperCase()}</span>
          </div>
          <span className="owner-address">{owner}</span>
        </div>

        {/* Título y descripción */}
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>

        {/* Progress section */}
        <div className="progress-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{displayCurrentAmount} ETH</span>
              <span className="stat-label">Raised</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{displayTargetAmount} ETH</span>
              <span className="stat-label">Goal</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{backers}</span>
              <span className="stat-label">Backers</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button 
          className="card-action-button"
          onClick={buttonConfig.action}
        >
          <span className="button-text">{buttonConfig.text}</span>
          <div className="button-glow"></div>
          <svg className="button-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Animated border */}
      <div className="card-border-animation"></div>

      {/* Fund Campaign Popup */}
      <FundCampaignPopup
        isOpen={isFundPopupOpen}
        onClose={() => setIsFundPopupOpen(false)}
        campaign={campaignFullData}
      />
    </div>
  );
};

export default CampaignCard;
