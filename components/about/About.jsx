import React from 'react';
import Image from 'next/image';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Blockchain Architect",
      image: "/images/image1.png",
      bio: "10+ years in distributed systems"
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Smart Contract Developer",
      image: "/images/image5.png",
      bio: "DeFi protocols specialist"
    },
    {
      id: 3,
      name: "Marcus Johnson",
      role: "UI/UX Designer",
      image: "/images/image10.png",
      bio: "Web3 interface expert"
    },
    {
      id: 4,
      name: "Elena Rodriguez",
      role: "Community Manager",
      image: "/images/image11.png",
      bio: "Building decentralized communities"
    }
  ];

  const features = [
    {
      icon: "🔒",
      title: "Secure",
      description: "Military-grade encryption and smart contract audits"
    },
    {
      icon: "🌍",
      title: "Decentralized",
      description: "No central authority, powered by community governance"
    },
    
    {
      icon: "🎯",
      title: "Transparent",
      description: "Every transaction recorded on immutable blockchain"
    }
  ];

  const stats = [
    { number: "10M+", label: "ETH Raised", suffix: "" },
    { number: "50K+", label: "Projects Funded", suffix: "" },
    { number: "200+", label: "Countries", suffix: "" },
    { number: "99.9%", label: "Uptime", suffix: "" }
  ];

  return (
    <section className="about-section">
      <div className="about-container">
        
        {/* Hero About */}
        <div className="about-hero">
          <div className="hero-content">
            <span className="about-subtitle">About CrowdChain</span>
            <h2 className="about-title">
              Revolutionizing <span className="title-highlight">Crowdfunding</span> 
              <br />with Blockchain Technology
            </h2>
            <p className="about-description">
              We're building the future of decentralized fundraising. Our platform combines 
              the power of blockchain technology with intuitive design to create a transparent, 
              secure, and global crowdfunding ecosystem where anyone can turn their ideas into reality.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-glow"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-section">
          <h3 className="section-heading">Why Choose CrowdChain?</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-border"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <div className="team-header">
            <h3 className="section-heading">Meet Our Team</h3>
            <p className="team-subtitle">
              Passionate builders creating the decentralized future
            </p>
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="team-card">
                <div className="member-image-container">
                  <div className="image-wrapper">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="member-image"
                    />
                  </div>
                  <div className="image-overlay"></div>
                  <div className="image-border"></div>
                </div>
                
                <div className="member-info">
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                </div>

                <div className="card-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mission-section">
          <div className="mission-card">
            <div className="mission-content">
              <div className="mission-icon">🚀</div>
              <h3 className="mission-title">Our Mission</h3>
              <p className="mission-text">
                To democratize access to funding by leveraging blockchain technology, 
                creating a transparent, efficient, and inclusive platform where 
                innovation thrives without barriers.
              </p>
              <div className="mission-features">
                <div className="mission-point">
                  <span className="point-icon">✨</span>
                  <span>Global accessibility</span>
                </div>
                <div className="mission-point">
                  <span className="point-icon">🔐</span>
                  <span>Complete transparency</span>
                </div>
                <div className="mission-point">
                  <span className="point-icon">🌱</span>
                  <span>Sustainable growth</span>
                </div>
              </div>
            </div>
            <div className="mission-glow"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="about-decorations">
          {/* <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div> */}
          <div className="grid-pattern"></div>
        </div>

      </div>
    </section>
  );
};

export default About;
