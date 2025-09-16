"use client";

import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { CrowdfundingContext } from "../../../context/CrowdfundingContext";
import { AddTierPopup } from "../../../components/popup";
import {
  HiPlus,
  HiCollection,
  HiClock,
  HiTrendingUp,
  HiCog,
  HiArrowLeft,
  HiTrash,
  HiCheckCircle,
} from "react-icons/hi";

const CampaignDetails = () => {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id;

  const { account, getCampaignDetails, removeTier, loading, error } =
    useContext(CrowdfundingContext);

  const [campaignData, setCampaignData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [isAddTierPopupOpen, setIsAddTierPopupOpen] = useState(false);

  // Handle mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load campaign details
  useEffect(() => {
    const loadCampaignData = async () => {
      if (mounted && campaignId && getCampaignDetails) {
        setLoadingCampaign(true);
        const data = await getCampaignDetails(campaignId);
        if (data) {
          setCampaignData(data);
        }
        setLoadingCampaign(false);
      }
    };

    loadCampaignData();
  }, [mounted, campaignId, getCampaignDetails]);

  // Redirect to home if not connected (only after mounting)
  useEffect(() => {
    if (mounted && !account) {
      window.location.href = "/";
    }
  }, [account, mounted]);

  // Show loading while mounting
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
              Please connect your wallet to access campaign details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = campaignData
    ? (parseFloat(campaignData.balance) / parseFloat(campaignData.goal)) * 100
    : 0;

  // Format deadline
  const formatDeadline = timestamp => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days left
  const getDaysLeft = deadline => {
    if (!deadline) return 0;
    const now = Date.now() / 1000;
    const daysLeft = Math.max(0, Math.ceil((deadline - now) / (24 * 60 * 60)));
    return daysLeft;
  };

  // Handle add tier popup
  const handleOpenAddTierPopup = () => {
    setIsAddTierPopupOpen(true);
  };

  const handleCloseAddTierPopup = () => {
    setIsAddTierPopupOpen(false);
  };

  const handleTierAdded = async () => {
    // Reload campaign data to show the new tier
    if (campaignId && getCampaignDetails) {
      setLoadingCampaign(true);
      const data = await getCampaignDetails(campaignId);
      setCampaignData(data);
      setLoadingCampaign(false);
    }
  };

  const handleRemoveTier = async tierIndex => {
    if (
      window.confirm(
        "Are you sure you want to remove this tier? This action cannot be undone."
      )
    ) {
      const success = await removeTier(campaignId, tierIndex);
      if (success) {
        // Reload campaign data to update the tiers list
        handleTierAdded(); // Reusing the same reload function
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#19d8f7]/5 pt-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-20 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#51256b] to-[#19d8f7] bg-clip-text text-transparent">
                Campaign Details
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
                  {campaignData ? getDaysLeft(campaignData.deadline) : "--"}
                </div>
                <div className="text-white/80 text-xs md:text-sm font-medium">
                  Days Left
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#51256b] transition-colors duration-200 group"
          >
            <HiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {loadingCampaign ? (
          // Loading State
          <div className="text-center py-16">
            <div className="relative inline-flex">
              <div className="w-16 h-16 border-4 border-[#19d8f7]/20 border-t-[#51256b] rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg">
              Loading campaign details...
            </p>
          </div>
        ) : campaignData ? (
          <div className="max-w-4xl mx-auto">
            {/* Campaign Info */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {campaignData.name}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {campaignData.description}
                  </p>
                </div>
                <div className="ml-6">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      campaignData.state === 0
                        ? "bg-green-100 text-green-800"
                        : campaignData.state === 1
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {campaignData.state === 0
                      ? "Active"
                      : campaignData.state === 1
                      ? "Successful"
                      : "Failed"}
                  </span>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center mb-6">
                <HiClock className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Campaign Deadline</p>
                  <p className="font-semibold text-gray-900">
                    {formatDeadline(campaignData.deadline)}
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Funding Progress
                  </h3>
                  <span className="text-lg font-bold text-[#51256b]">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container mb-6">
                  <div
                    className="progress-bar"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  >
                    <div className="progress-glow"></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <HiTrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-green-600 font-medium">
                          Amount Raised
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          {parseFloat(campaignData.balance).toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <HiCollection className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-blue-600 font-medium">
                          Funding Goal
                        </p>
                        <p className="text-2xl font-bold text-blue-800">
                          {parseFloat(campaignData.goal).toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiers Section */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Campaign Tiers
                </h3>
                <button
                  onClick={handleOpenAddTierPopup}
                  className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] hover:from-[#4a2357] hover:to-[#17c3e8] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <HiPlus className="h-5 w-5" />
                  <span>Add Tier</span>
                </button>
              </div>

              {/* Tiers List */}
              {campaignData.tiers && campaignData.tiers.length > 0 ? (
                <div className="space-y-4">
                  {campaignData.tiers.map((tier, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            {tier.name}
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Support this campaign with {tier.amount} ETH
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#51256b]">
                            {tier.amount} ETH
                          </p>
                          <p className="text-sm text-gray-500">
                            {tier.backers} backers
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleRemoveTier(index)}
                          disabled={loading}
                          className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-100 disabled:from-gray-50 disabled:to-gray-50 disabled:border-gray-200 text-red-700 disabled:text-gray-400 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                        >
                          <HiTrash className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-[#51256b]/10 to-[#19d8f7]/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <HiCog className="h-12 w-12 text-[#51256b]" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    No Tiers Yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Create funding tiers to give backers different support
                    options.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Error State
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Campaign Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The campaign you&apos;re looking for doesn&apos;t exist or
              couldn&apos;t be loaded.
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-gradient-to-r from-[#51256b] to-[#19d8f7] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Add Tier Popup */}
      <AddTierPopup
        isOpen={isAddTierPopupOpen}
        onClose={handleCloseAddTierPopup}
        campaignAddress={campaignId}
        onTierAdded={handleTierAdded}
      />
    </div>
  );
};

export default CampaignDetails;
