"use client";

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        projectType: 'general'
      });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our team",
      value: "24/7 Support",
      action: "Start Chat"
    },
    {
      icon: "📧",
      title: "Email",
      description: "Send us a message",
      value: "hello@crowdchain.io",
      action: "Send Email"
    },
    {
      icon: "📱",
      title: "Discord",
      description: "Join our community",
      value: "discord.gg/crowdchain",
      action: "Discord"
    },
    {
      icon: "🐦",
      title: "Twitter",
      description: "Follow for updates",
      value: "@CrowdChainDeFi",
      action: "Follow Us"
    }
  ];

  const offices = [
    {
      city: "San Francisco",
      country: "USA",
      address: "123 Blockchain Ave, SF 94105",
      timezone: "PST",
      type: "HQ"
    },
    {
      city: "London",
      country: "UK",
      address: "45 DeFi Street, London EC1A 1BB",
      timezone: "GMT",
      type: "EU Office"
    },
    {
      city: "Singapore",
      country: "SG",
      address: "88 Crypto Boulevard, Singapore 018956",
      timezone: "SGT",
      type: "APAC Office"
    }
  ];

  const faqs = [
    {
      question: "How do I start a campaign?",
      answer: "Connect your wallet, click 'Create Campaign', fill the details, and deploy your smart contract. It's that simple!"
    },
    {
      question: "What are the platform fees?",
      answer: "We charge a competitive 2.5% platform fee on successfully funded campaigns, plus standard gas fees."
    },
    {
      question: "Is my investment secure?",
      answer: "All funds are secured by audited smart contracts on the Ethereum blockchain. Your investments are protected by cryptographic security."
    }
  ];

  return (
    <section className="contact-section">
      <div className="contact-container">
        
        {/* Contact Hero */}
        <div className="contact-hero">
          <span className="contact-subtitle">Get In Touch</span>
          <h2 className="contact-title">
            Let's Build the <span className="title-highlight">Future</span> Together
          </h2>
          <p className="contact-description">
            Have questions about our platform? Want to discuss a partnership? 
            Or ready to launch your next big idea? We'd love to hear from you.
          </p>
        </div>

        {/* Main Contact Content */}
        <div className="contact-content">
          
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h3 className="form-title">Send us a Message</h3>
              <p className="form-subtitle">We'll get back to you within 24 hours</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <input
                    type="text"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="General Inquiry"
                    required
                  />
                </div>
                
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Tell us more about your project or question..."
                  rows={6}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`form-submit ${isSubmitting ? 'submitting' : ''} ${submitStatus ? 'success' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="submit-spinner"></span>
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <span className="submit-icon">✓</span>
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="submit-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Methods */}
          <div className="contact-methods-section">
            <div className="methods-header">
              <h3 className="methods-title">Other Ways to Reach Us</h3>
            </div>
            
            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-method">
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-content">
                    <h4 className="method-title">{method.title}</h4>
                    <p className="method-description">{method.description}</p>
                    <span className="method-value">{method.value}</span>
                  </div>
                  <button className="method-action">
                    {method.action}
                  </button>
                  <div className="method-glow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Offices */}
        <div className="offices-section">
          <h3 className="section-heading">Our Global Presence</h3>
          <div className="offices-grid">
            {offices.map((office, index) => (
              <div key={index} className="office-card">
                <div className="office-header">
                  <div className="office-badge">{office.type}</div>
                  <h4 className="office-city">{office.city}</h4>
                  <span className="office-country">{office.country}</span>
                </div>
                <p className="office-address">{office.address}</p>
                <div className="office-timezone">
                  <span className="timezone-label">Timezone:</span>
                  <span className="timezone-value">{office.timezone}</span>
                </div>
                <div className="office-glow"></div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h3 className="section-heading">Frequently Asked Questions</h3>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
                <div className="faq-border"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="contact-cta">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Launch Your Project?</h3>
            <p className="cta-description">
              Join thousands of innovators already building on CrowdChain
            </p>
            <div className="cta-buttons">
              <button className="cta-primary">
                Create Campaign
                <span className="button-shine"></span>
              </button>
              <button className="cta-secondary">
                Explore Platform
              </button>
            </div>
          </div>
          <div className="cta-glow"></div>
        </div>

        {/* Decorative Elements */}
        <div className="contact-decorations">
          {/* <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div> */}
          <div className="contact-grid-pattern"></div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
