"use client";

import React, { useState, useEffect, useContext, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CrowdfundingContext } from "../../context/CrowdfundingContext";
import { HiPlus, HiCollection, HiCube, HiTrendingUp } from "react-icons/hi";
import { CampaignCard } from "../../components/card";

// Loading component for Suspense boundary
const DashboardLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#19d8f7]/5 pt-24">
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#51256b] mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    </div>
  </div>
);

// Dashboard content component that uses useSearchParams
const DashboardContent = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("my-campaigns");
  const [mounted, setMounted] = useState(false);

  const {
    account,
    userCampaigns,
    campaignsLoading,
    createCampaign,
    loading,
    error,
    loadUserCampaigns,
  } = useContext(CrowdfundingContext);

  // Form state for Create Campaign
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goalInEth: "",
    durationInDays: "",
  });

  // Handle mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);

    // Check URL parameters for tab selection
    const tab = searchParams.get("tab");
    if (tab === "create-campaign") {
      setActiveTab("create-campaign");
    }
  }, [searchParams]);

  // Redirect to home if not connected (only after mounting)
  useEffect(() => {
    if (mounted && !account) {
      window.location.href = "/";
    }
  }, [account, mounted]);

  // Load user campaigns on mount
  useEffect(() => {
    if (account && mounted) {
      loadUserCampaigns();
    }
  }, [account, mounted, loadUserCampaigns]);

  const handleCreateCampaign = async e => {
    e.preventDefault();
    const success = await createCampaign(formData);
    if (success) {
      setFormData({
        name: "",
        description: "",
        goalInEth: "",
        durationInDays: "",
      });
      setActiveTab("my-campaigns"); // Switch to My Campaigns after creation
    }
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Show loading while mounting or while checking account
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#19d8f7]/5 pt-24">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#51256b] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#19d8f7]/5 pt-24">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Please connect your wallet to access the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#19d8f7]/5 pt-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-20 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#51256b] to-[#19d8f7] bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-lg">
                Welcome back,{" "}
                <span className="font-medium text-[#51256b]">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] text-white px-4 py-3 md:px-8 md:py-6 rounded-xl md:rounded-2xl shadow-lg self-start md:self-auto">
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold">
                  {userCampaigns?.length || 0}
                </div>
                <div className="text-white/80 text-xs md:text-sm font-medium">
                  My Campaigns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-100">
          <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              onClick={() => setActiveTab("my-campaigns")}
              className={`px-4 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 ${
                activeTab === "my-campaigns"
                  ? "bg-gradient-to-r from-[#51256b] to-[#19d8f7] text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-600 hover:text-[#51256b] hover:bg-[#51256b]/10"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <HiCollection className="h-4 w-4 md:h-5 md:w-5" />
                <span>My Campaigns</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("create-campaign")}
              className={`px-4 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 ${
                activeTab === "create-campaign"
                  ? "bg-gradient-to-r from-[#51256b] to-[#19d8f7] text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-600 hover:text-[#51256b] hover:bg-[#51256b]/10"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <HiPlus className="h-4 w-4 md:h-5 md:w-5" />
                <span>Create Campaign</span>
              </div>
            </button>
          </nav>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-6 pb-10">
        {/* My Campaigns Tab */}
        {activeTab === "my-campaigns" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#51256b] to-[#19d8f7] bg-clip-text text-transparent">
                My Campaigns
              </h2>
              {/* <button
                onClick={() => setActiveTab("create-campaign")}
                className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] hover:from-[#4a2357] hover:to-[#17c3e8] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <HiPlus className="h-5 w-5" />
                <span>New Campaign</span>
              </button> */}
            </div>

            {/* Loading State */}
            {campaignsLoading ? (
              <div className="text-center py-16">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 border-4 border-[#19d8f7]/20 border-t-[#51256b] rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 mt-6 text-lg">
                  Loading your campaigns...
                </p>
              </div>
            ) : userCampaigns?.length > 0 ? (
              /* Campaigns Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userCampaigns.map((campaign, index) => (
                  <CampaignCard
                    key={campaign.address || index}
                    title={campaign.name}
                    description={campaign.description}
                    currentAmount={campaign.balance}
                    targetAmount={campaign.goal}
                    daysLeft={Math.max(
                      0,
                      Math.ceil(
                        (campaign.deadline - Date.now() / 1000) / (24 * 60 * 60)
                      )
                    )}
                    category="My Campaign"
                    backers="--"
                    owner={account}
                    image="/images/example.png"
                    campaignAddress={campaign.address}
                    context="dashboard"
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-[#51256b]/10 to-[#19d8f7]/10 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                  <HiCube className="h-16 w-16 text-[#51256b]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No campaigns yet
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Ready to bring your ideas to life? Create your first campaign
                  and start raising funds today.
                </p>
                <button
                  onClick={() => setActiveTab("create-campaign")}
                  className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] hover:from-[#4a2357] hover:to-[#17c3e8] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 mx-auto text-lg"
                >
                  <HiPlus className="h-6 w-6" />
                  <span>Create Your First Campaign</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Campaign Tab */}
        {activeTab === "create-campaign" && (
          <div>
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#51256b] to-[#19d8f7] bg-clip-text text-transparent mb-4">
                  Create New Campaign
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Launch your crowdfunding campaign and bring your ideas to
                  life. Share your vision with the world and get the support you
                  need.
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Campaign Creation Form */}
              <form onSubmit={handleCreateCampaign} className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="space-y-6">
                    {/* Campaign Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Campaign Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#51256b] focus:border-[#51256b] focus:bg-white transition-all duration-200"
                        placeholder="Enter a compelling campaign name"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Campaign Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#51256b] focus:border-[#51256b] focus:bg-white transition-all duration-200 resize-none"
                        placeholder="Describe your campaign, its goals, and how funds will be used..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Be specific and engaging to attract backers
                      </p>
                    </div>

                    {/* Goal and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Funding Goal (ETH) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="goalInEth"
                            value={formData.goalInEth}
                            onChange={e => {
                              const value = e.target.value;
                              // Allow only numbers and one decimal point
                              if (/^\d*\.?\d*$/.test(value)) {
                                handleInputChange(e);
                              }
                            }}
                            required
                            className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#51256b] focus:border-[#51256b] focus:bg-white transition-all duration-200"
                            placeholder="10.00"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-gray-500 font-medium">Ξ</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum 0.01 ETH
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Campaign Duration (Days) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="durationInDays"
                            value={formData.durationInDays}
                            onChange={e => {
                              const value = e.target.value;
                              // Allow only integers
                              if (
                                /^\d*$/.test(value) &&
                                (value === "" ||
                                  (parseInt(value) >= 1 &&
                                    parseInt(value) <= 365))
                              ) {
                                handleInputChange(e);
                              }
                            }}
                            required
                            className="w-full px-4 py-3 pr-16 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#51256b] focus:border-[#51256b] focus:bg-white transition-all duration-200"
                            placeholder="30"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-gray-500 text-sm">days</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Between 1-365 days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("my-campaigns")}
                    className="px-8 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-[#51256b] to-[#19d8f7] hover:from-[#4a2357] hover:to-[#17c3e8] disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-3 min-w-[180px] justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <HiPlus className="h-5 w-5" />
                        <span>Create Campaign</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard component wrapped with Suspense
const Dashboard = () => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
