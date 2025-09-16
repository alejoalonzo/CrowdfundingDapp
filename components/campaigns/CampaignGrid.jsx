"use client";

import React, { useContext, useEffect, useState } from 'react';
import { CampaignCard } from '../card';
import { CrowdfundingContext } from '../../context/CrowdfundingContext';

const CampaignGrid = () => {
  const { allCampaigns, loadAllCampaigns, campaignsLoading, isBlockchainAvailable } = useContext(CrowdfundingContext);
  const [mounted, setMounted] = useState(false);

  // Handle mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load campaigns when component mounts and blockchain is available
  useEffect(() => {
    if (mounted && isBlockchainAvailable && loadAllCampaigns) {
      loadAllCampaigns();
    }
  }, [mounted, isBlockchainAvailable, loadAllCampaigns]);
  // Datos de ejemplo para las campañas por defecto
  const defaultCampaigns = [
    {
      id: 1,
      title: "DeFi Revolution Platform",
      description: "Next-generation decentralized finance platform with innovative yield farming and staking mechanisms",
      currentAmount: "8.7",
      targetAmount: "15.0",
      daysLeft: "12",
      category: "DeFi",
      backers: "234",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // DeFi/Blockchain concept
      owner: "0x123...4567"
    },
    {
      id: 2,
      title: "Green Energy DAO",
      description: "Funding renewable energy projects through decentralized governance and community participation",
      currentAmount: "3.2",
      targetAmount: "8.5",
      daysLeft: "24",
      category: "Environment",
      backers: "156",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Wind turbines/renewable energy
      owner: "0x789...abcd"
    },
    {
      id: 3,
      title: "NFT Art Marketplace",
      description: "Revolutionary marketplace for digital artists with zero gas fees and instant transactions",
      currentAmount: "12.1",
      targetAmount: "20.0",
      daysLeft: "8",
      category: "Art & NFTs",
      backers: "445",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Digital art/NFT
      owner: "0xdef...1234"
    },
    {
      id: 4,
      title: "Web3 Education Hub",
      description: "Comprehensive blockchain education platform with hands-on courses and certification programs",
      currentAmount: "5.6",
      targetAmount: "12.0",
      daysLeft: "18",
      category: "Education",
      backers: "198",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Education/learning
      owner: "0x456...89ef"
    },
    {
      id: 5,
      title: "Metaverse Gaming Studio",
      description: "Building immersive play-to-earn games with cutting-edge graphics and blockchain integration",
      currentAmount: "9.8",
      targetAmount: "25.0",
      daysLeft: "30",
      category: "Gaming",
      backers: "567",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Gaming/VR
      owner: "0xabc...7890"
    },
    {
      id: 6,
      title: "Crypto Analytics Tool",
      description: "Advanced trading analytics and portfolio management for cryptocurrency investors and traders",
      currentAmount: "4.3",
      targetAmount: "7.5",
      daysLeft: "5",
      category: "Tools",
      backers: "123",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Analytics/charts
      owner: "0x654...cdef"
    }
  ];

  // Transform blockchain campaigns to match the expected format
  const transformBlockchainCampaign = (campaign, index) => ({
    id: `blockchain-${campaign.address}`,
    title: campaign.name,
    description: campaign.description,
    currentAmount: campaign.balance,
    targetAmount: campaign.goal,
    daysLeft: Math.max(0, Math.ceil((campaign.deadline - Date.now() / 1000) / (24 * 60 * 60))).toString(),
    category: "Community",
    backers: "--",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Blockchain/community default image
    owner: `${campaign.owner.slice(0, 6)}...${campaign.owner.slice(-4)}`
  });

  // Combine default campaigns with blockchain campaigns
  const getCombinedCampaigns = () => {
    if (!mounted) return [];
    
    const blockchainCampaigns = allCampaigns?.map(transformBlockchainCampaign) || [];
    
    // Combine and limit to show most recent campaigns first
    const combined = [...blockchainCampaigns, ...defaultCampaigns];
    
    // Show all campaigns but prioritize user-created ones
    return combined.slice(0, 12); // Limit to 12 campaigns for better performance
  };

  const displayCampaigns = getCombinedCampaigns();

  return (
    <section className="campaigns-section">
      <div className="campaigns-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="header-content">
            <span className="section-subtitle">Active Projects</span>
            <h2 className="section-title">
              <span className="title-gradient">Featured</span>{' '}
              <span className="title-normal">Campaigns</span>
            </h2>
            <p className="section-description">
              Discover innovative blockchain projects seeking community support. 
              Join the revolution and help bring groundbreaking ideas to life.
            </p>
          </div>
          
          {/* Stats bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Active Campaigns</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">2.4M ETH</div>
              <div className="stat-label">Total Raised</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">15K+</div>
              <div className="stat-label">Backers</div>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="campaigns-grid">
          {campaignsLoading ? (
            // Loading skeleton
            <div className="campaigns-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="campaign-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-description"></div>
                    <div className="skeleton-line skeleton-description short"></div>
                    <div className="skeleton-stats">
                      <div className="skeleton-line skeleton-stat"></div>
                      <div className="skeleton-line skeleton-stat"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayCampaigns.length > 0 ? (
            displayCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                title={campaign.title}
                description={campaign.description}
                currentAmount={campaign.currentAmount}
                targetAmount={campaign.targetAmount}
                daysLeft={campaign.daysLeft}
                category={campaign.category}
                backers={campaign.backers}
                image={campaign.image}
                owner={campaign.owner}
              />
            ))
          ) : (
            // Empty state when no campaigns
            <div className="empty-campaigns-state">
              <div className="empty-state-content">
                <h3>No Campaigns Available</h3>
                <p>Be the first to create a campaign and start your crowdfunding journey!</p>
              </div>
            </div>
          )}
        </div>

        {/* View More Button */}
        <div className="view-more-section">
          <button className="view-more-button">
            <span className="button-text">View All Campaigns</span>
            <div className="button-shine"></div>
            <svg className="button-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h10.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="decorative-elements">
          <div className="floating-card card-1"></div>
          <div className="floating-card card-2"></div>
          <div className="floating-card card-3"></div>
        </div>
      </div>
    </section>
  );
};

export default CampaignGrid;
