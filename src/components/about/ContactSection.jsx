// Contact Section Component - Enhanced with Advanced Newsletter
import React, { useState, useEffect, useRef } from 'react';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(validateEmail(value) || value === '');
    setSubscriptionStatus('');
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      setEmailValid(false);
      return;
    }

    setIsSubscribing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubscriptionStatus('success');
      setEmail('');
    } catch (error) {
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const contactInfo = [
    {
      title: 'General Inquiries',
      email: 'info@isaca-sv.org',
      description: 'Questions about membership, events, or general information',
      icon: '📧',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Membership',
      email: 'membership@isaca-sv.org',
      description: 'Join our chapter or update your membership information',
      icon: '👥',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Events & Programs',
      email: 'programs@isaca-sv.org',
      description: 'Information about upcoming events and educational programs',
      icon: '📅',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Partnerships',
      email: 'partnerships@isaca-sv.org',
      description: 'Corporate partnerships and sponsorship opportunities',
      icon: '🤝',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/isaca-silicon-valley',
      icon: '💼',
      description: 'Professional updates and networking'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/isacasv',
      icon: '🐦',
      description: 'Latest news and industry insights'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@isacasiliconvalley',
      icon: '📺',
      description: 'Event recordings and educational content'
    },
    {
      name: 'Meetup',
      url: 'https://meetup.com/isaca-silicon-valley',
      icon: '👋',
      description: 'Local events and meetups'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with us and become part of Silicon Valley's premier cybersecurity community
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className={`transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Contact Information
            </h3>
            
            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                      <span className="text-xl">{contact.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {contact.title}
                      </h4>
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-2 block transition-colors duration-300"
                      >
                        {contact.email}
                      </a>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Information */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-blue-200 dark:border-gray-500">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="text-xl mr-3">📍</span>
                Chapter Location
              </h4>
              <div className="text-gray-600 dark:text-gray-300">
                <p className="mb-2">Silicon Valley, California</p>
                <p className="mb-2">Events held throughout the Bay Area</p>
                <p className="text-sm">
                  <strong>Meeting Schedule:</strong> Monthly events (typically second Thursday)
                </p>
                <p className="text-sm">
                  <strong>Format:</strong> In-person, virtual, and hybrid options available
                </p>
              </div>
            </div>
          </div>

          {/* Social Media & Additional Info */}
          <div className={`transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            
            {/* Social Media */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Follow Us
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {social.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {social.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {social.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Newsletter Signup */}
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-10 text-white overflow-hidden">
              {/* Subtle Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
              
              <div className="relative z-10">
                {/* Clean Header */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold">Stay Updated</h3>
                </div>

                <p className="text-lg mb-10 opacity-90 leading-relaxed max-w-lg">
                  Subscribe to our newsletter for the latest cybersecurity insights, 
                  event announcements, and professional development opportunities.
                </p>

                {/* Newsletter Benefits - Cleaner Design */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  {[
                    { icon: '🔐', text: 'Security Insights' },
                    { icon: '📅', text: 'Event Updates' },
                    { icon: '🎓', text: 'Learning Resources' }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-2xl mr-3">{benefit.icon}</span>
                      <span className="font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Subscription Form */}
                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email address"
                        className={`w-full px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-base font-medium ${
                          !emailValid ? 'ring-2 ring-red-300 bg-white border-2 border-red-300' : 'bg-white shadow-lg'
                        }`}
                        disabled={isSubscribing}
                        autoComplete="email"
                      />
                      {!emailValid && (
                        <div className="absolute -bottom-6 left-2 text-red-200 text-sm flex items-center animate-fadeIn">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Please enter a valid email address
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubscribing || !email || !emailValid}
                      className="bg-gray-800/80 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group min-w-[140px] shadow-lg"
                    >
                      {isSubscribing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Status Messages */}
                {subscriptionStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl flex items-center animate-fadeIn">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-100 font-medium">Successfully subscribed! Welcome to our community.</span>
                  </div>
                )}

                {subscriptionStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center animate-fadeIn">
                    <svg className="w-5 h-5 text-red-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-100 font-medium">Something went wrong. Please try again.</span>
                  </div>
                )}

                {/* Clean Privacy Notice */}
                <div className="mt-8 flex items-start">
                  <svg className="w-5 h-5 text-white/80 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-white/80">
                    <span className="font-semibold text-white">We respect your privacy.</span> Unsubscribe at any time. 
                    Your email will only be used for ISACA Silicon Valley communications.
                  </p>
                </div>

                {/* Newsletter Stats - Cleaner Layout */}
                <div className="mt-10 grid grid-cols-3 gap-8 pt-8 border-t border-white/30">
                  {[
                    { number: '2,500+', label: 'Subscribers' },
                    { number: 'Monthly', label: 'Frequency' },
                    { number: '95%', label: 'Satisfaction' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Join Us', url: '/membership' },
                  { name: 'Events', url: '/events' },
                  { name: 'Resources', url: '/resources' },
                  { name: 'Certifications', url: '/certifications' },
                  { name: 'Volunteer', url: '/volunteer' },
                  { name: 'Sponsor', url: '/sponsorship' }
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-300"
                  >
                    {link.name} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`mt-16 text-center transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Take the next step in your cybersecurity career. Join ISACA Silicon Valley 
              and connect with the best minds in the industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Become a Member
              </button>
              <button className="border-2 border-blue-500 text-blue-500 dark:text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300">
                Attend an Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;