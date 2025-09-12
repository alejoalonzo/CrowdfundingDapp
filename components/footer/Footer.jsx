"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiHome, 
  HiCollection, 
  HiPlus, 
  HiInformationCircle, 
  HiMail,
  HiHeart,
  HiArrowUp
} from 'react-icons/hi';
import { 
  FaTwitter, 
  FaDiscord, 
  FaGithub, 
  FaTelegram,
  FaLinkedin
} from 'react-icons/fa';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setMounted(true);
  }, []);

  const navigationLinks = [
    { name: 'Home', href: '/', icon: HiHome },
    { name: 'Campaigns', href: '/campaigns', icon: HiCollection },
    { name: 'Create Campaign', href: '/create', icon: HiPlus },
    { name: 'About Us', href: '/about', icon: HiInformationCircle },
    { name: 'Contact', href: '/contact', icon: HiMail }
  ];

  const resourceLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Smart Contracts', href: '/contracts' },
    { name: 'Security Audit', href: '/security' },
    { name: 'Developer Portal', href: '/developers' }
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Compliance', href: '/compliance' }
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: FaTwitter, color: '#1DA1F2' },
    { name: 'Discord', href: 'https://discord.com', icon: FaDiscord, color: '#7289DA' },
    { name: 'GitHub', href: 'https://github.com', icon: FaGithub, color: '#333' },
    { name: 'Telegram', href: 'https://telegram.org', icon: FaTelegram, color: '#0088cc' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedin, color: '#0077B5' }
  ];

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter submission here
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer className={`footer-section ${mounted ? 'mounted' : ''}`}>
      {/* Decorative top border */}
      <div className="footer-top-border"></div>
      
      {/* Main footer content */}
      <div className="footer-container">
        <div className="footer-content">
          
          {/* Company section */}
          <div className="footer-column company-column">
            <div className="company-info">
              {/* Logo */}
              <div className="footer-logo">
                <div className="logo-icon">
                  <span className="logo-text">C</span>
                </div>
                <span className="logo-name">CrowdFund</span>
              </div>
              
              {/* Description */}
              <p className="company-description">
                The future of decentralized crowdfunding. Empowering creators and 
                innovators to bring their ideas to life through blockchain technology 
                and community support.
              </p>
              
              {/* Stats */}
              <div className="footer-stats">
                <div className="stat-item">
                  <span className="stat-number">1,234</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">$2.5M</span>
                  <span className="stat-label">Raised</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">15K+</span>
                  <span className="stat-label">Backers</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="footer-column">
            <h3 className="column-title">
              <HiHome className="title-icon" />
              Navigation
            </h3>
            <ul className="footer-links">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link">
                    <link.icon className="link-icon" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div className="footer-column">
            <h3 className="column-title">
              <HiCollection className="title-icon" />
              Resources
            </h3>
            <ul className="footer-links">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div className="footer-column">
            <h3 className="column-title">
              <HiInformationCircle className="title-icon" />
              Legal
            </h3>
            <ul className="footer-links">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="footer-column newsletter-column">
            <h3 className="column-title">
              <HiMail className="title-icon" />
              Stay Updated
            </h3>
            <p className="newsletter-description">
              Get the latest updates on new campaigns, platform features, and blockchain innovations.
            </p>
            
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </div>
            </form>
            
            <div className="newsletter-note">
              <p>We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
          
        </div>
        
        {/* Social Media & Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            
            {/* Social Links */}
            <div className="social-section">
              <h4 className="social-title">Connect With Us</h4>
              <div className="social-links">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      style={{ '--social-color': social.color }}
                    >
                      <IconComponent className="social-icon" />
                      <span className="social-tooltip">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
            
            {/* Back to Top Button */}
            <button 
              onClick={handleScrollToTop}
              className="back-to-top"
              aria-label="Back to top"
              type="button"
            >
              <HiArrowUp className="arrow-icon" />
            </button>
            
          </div>
        </div>
        
        {/* Copyright */}
        <div className="footer-copyright">
          <div className="copyright-content">
            <div className="copyright-left">
              <p>
                © {currentYear} CrowdFund. All rights reserved.
              </p>
              <p className="copyright-sub">
                Built with <HiHeart className="heart-icon" /> for the decentralized future
              </p>
            </div>
            
            <div className="copyright-right">
              <p>Powered by Blockchain Technology</p>
              <div className="tech-badges">
                <span className="tech-badge">Ethereum</span>
                <span className="tech-badge">Next.js</span>
                <span className="tech-badge">Web3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="footer-decorations">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
        <div className="decoration-line line-1"></div>
        <div className="decoration-line line-2"></div>
      </div>
    </footer>
  );
};

export default Footer;
