// History Section Component - Enhanced with Advanced Animations
import React, { useState, useEffect, useRef } from 'react';

const HistorySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [progressWidth, setProgressWidth] = useState(0);
  const sectionRef = useRef(null);
  const timelineRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start progress bar animation
          setTimeout(() => setProgressWidth(100), 500);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Observe individual timeline items for staggered animation
  useEffect(() => {
    const itemObservers = timelineRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !visibleItems.includes(index)) {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, index]);
            }, index * 200); // Stagger animation
          }
        },
        { threshold: 0.3 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      itemObservers.forEach(observer => observer?.disconnect());
    };
  }, [visibleItems]);

  const milestones = [
    {
      year: '1995',
      title: 'Chapter Founded',
      description: 'ISACA Silicon Valley chapter established to serve the growing tech community with a vision for excellence.',
      icon: '🏗️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      achievements: ['First chapter in Silicon Valley', 'Founding members: 25 professionals']
    },
    {
      year: '2001',
      title: 'Digital Transformation',
      description: 'Led the industry in addressing Y2K challenges and pioneering early cybersecurity threat management.',
      icon: '💻',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      achievements: ['Y2K readiness program', 'First cybersecurity certifications']
    },
    {
      year: '2008',
      title: 'Risk Management Focus',
      description: 'Expanded programs to include comprehensive risk management and governance frameworks.',
      icon: '🛡️',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      achievements: ['Risk management certification', 'Governance best practices']
    },
    {
      year: '2015',
      title: '1000 Members Milestone',
      description: 'Reached over 1000 active members, becoming one of the largest and most influential ISACA chapters.',
      icon: '🎯',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      achievements: ['1000+ active members', 'Regional leadership recognition']
    },
    {
      year: '2020',
      title: 'Virtual Innovation',
      description: 'Successfully transitioned to hybrid events and digital transformation, reaching global audiences.',
      icon: '🌐',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
      achievements: ['Virtual event platform', 'Global audience reach']
    },
    {
      year: '2025',
      title: 'AI & Future Security',
      description: 'Leading cutting-edge initiatives in AI governance, quantum security, and next-generation cybersecurity.',
      icon: '🚀',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      achievements: ['AI governance framework', 'Quantum security research']
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Our Journey
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block text-2xl md:text-3xl font-medium mt-2">
              Through Excellence
            </span>
          </h2>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="mx-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Three decades of pioneering excellence in cybersecurity education, 
            professional development, and industry leadership
          </p>
          
          {/* Progress Indicator */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-2000 ease-out"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {progressWidth}% of our journey mapped
            </p>
          </div>
        </div>

        {/* Enhanced Timeline */}
        <div className="relative">
          {/* Animated Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
            <div className="w-full h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30"></div>
            <div 
              className="absolute top-0 w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-3000 ease-out"
              style={{ height: isVisible ? '100%' : '0%' }}
            ></div>
          </div>

          {/* Timeline Items with Enhanced Animations */}
          <div className="space-y-16">
            {milestones.map((milestone, index) => {
              const isItemVisible = visibleItems.includes(index);
              return (
                <div 
                  key={index}
                  ref={el => timelineRefs.current[index] = el}
                  className={`relative transform transition-all duration-1000 ${
                    isItemVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
                  }`}
                >
                  <div className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}>
                    
                    {/* Enhanced Content Card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className={`bg-gradient-to-br ${milestone.bgColor} backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-600/30 group hover:scale-105 hover:-translate-y-2`}>
                        
                        {/* Icon and Title */}
                        <div className={`flex items-center mb-6 ${
                          index % 2 === 0 ? 'justify-end' : 'justify-start'
                        }`}>
                          <div className={`text-4xl mr-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 ${
                            isItemVisible ? 'animate-bounce' : ''
                          }`} style={{ animationDelay: `${index * 200}ms` }}>
                            {milestone.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                              {milestone.title}
                            </h3>
                            <div className={`h-1 bg-gradient-to-r ${milestone.color} rounded-full transition-all duration-500 ${
                              isItemVisible ? 'w-16' : 'w-0'
                            }`}></div>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                          {milestone.description}
                        </p>

                        {/* Achievements */}
                        <div className="space-y-2">
                          {milestone.achievements.map((achievement, achievementIndex) => (
                            <div 
                              key={achievementIndex}
                              className={`flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'} transition-all duration-500`}
                              style={{ transitionDelay: `${(index * 200) + (achievementIndex * 100)}ms` }}
                            >
                              <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-2 h-2 bg-gradient-to-r ${milestone.color} rounded-full ${index % 2 === 0 ? 'ml-3' : 'mr-3'} animate-pulse`}></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  {achievement}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Year Badge */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-24 h-24 bg-gradient-to-r ${milestone.color} rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800 transition-all duration-500 hover:scale-110 group`}>
                        <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          {milestone.year}
                        </span>
                      </div>
                      
                      {/* Pulse Effect */}
                      {isItemVisible && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${milestone.color} rounded-full animate-ping opacity-20`}></div>
                      )}
                    </div>

                    {/* Empty Space */}
                    <div className="w-5/12"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className={`text-center mt-24 transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}>
          <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-3xl p-12 border border-blue-200/50 dark:border-gray-500/30 overflow-hidden group">
            
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse group-hover:animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Be Part of Our 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Next Chapter
                </span>
              </h3>
              
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join us as we continue to shape the future of cybersecurity and risk management 
                in Silicon Valley and beyond. Together, we'll write the next chapter of excellence.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mb-8 max-w-2xl mx-auto">
                {[
                  { number: '30+', label: 'Years of Excellence' },
                  { number: '1200+', label: 'Members Strong' },
                  { number: '∞', label: 'Future Possibilities' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <span className="flex items-center justify-center">
                    Join Our Community
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                
                <button className="group bg-transparent text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center justify-center">
                    Learn Our Story
                    <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;