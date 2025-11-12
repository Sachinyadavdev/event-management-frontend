// Achievements & Recognition Section Component
import React, { useState, useEffect, useRef } from 'react';

const AchievementsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const achievements = [
    {
      title: 'Outstanding Chapter Award',
      year: '2023',
      organization: 'ISACA International',
      description: 'Recognized for exceptional member engagement and innovative programming.',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Excellence in Education',
      year: '2022',
      organization: 'ISACA International',
      description: 'Honored for delivering high-quality continuing education programs.',
      icon: '📚',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      title: 'Community Impact Award',
      year: '2021',
      organization: 'Silicon Valley Tech Council',
      description: 'Acknowledged for contributions to cybersecurity awareness and education.',
      icon: '🌟',
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Innovation in Virtual Events',
      year: '2020',
      organization: 'Professional Associations Network',
      description: 'Recognized for successfully adapting to virtual formats during COVID-19.',
      icon: '💻',
      color: 'from-green-400 to-teal-500'
    }
  ];

  const partnerships = [
    { name: 'Stanford University', logo: '🎓', type: 'Academic Partner' },
    { name: 'UC Berkeley', logo: '🏛️', type: 'Research Collaboration' },
    { name: 'Silicon Valley CISO Forum', logo: '🛡️', type: 'Strategic Alliance' },
    { name: 'Bay Area Security Professionals', logo: '🤝', type: 'Community Partner' },
    { name: 'Tech Industry Leaders', logo: '🏢', type: 'Industry Partnership' },
    { name: 'Cybersecurity Startups', logo: '🚀', type: 'Innovation Hub' }
  ];

  const stats = [
    { number: '25,000+', label: 'Training Hours Delivered', icon: '⏱️' },
    { number: '500+', label: 'Certified Professionals', icon: '📜' },
    { number: '150+', label: 'Expert Speakers', icon: '🎤' },
    { number: '95%', label: 'Member Retention Rate', icon: '💯' }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Achievements & Recognition
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Celebrating our milestones and the recognition we've earned for excellence
          </p>
        </div>

        {/* Awards Section */}
        <div className="mb-20">
          <h3 className={`text-3xl font-bold text-gray-900 dark:text-white text-center mb-12 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Awards & Honors
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`transform transition-all duration-1000 delay-${300 + index * 100} hover:scale-105 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600 h-full">
                  
                  {/* Icon and Year */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center`}>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{achievement.year}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Awarded</div>
                    </div>
                  </div>

                  {/* Content */}
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                    {achievement.organization}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className={`mb-20 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Impact by Numbers
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnerships */}
        <div className={`transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Strategic Partnerships
          </h3>
          
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerships.map((partner, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors duration-300">
                  <div className="text-3xl mr-4">{partner.logo}</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{partner.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{partner.type}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Building stronger communities through strategic collaborations and partnerships
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;