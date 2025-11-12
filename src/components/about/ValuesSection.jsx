// Core Values Section Component
import React, { useState, useEffect, useRef } from 'react';

const ValuesSection = () => {
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

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, from our educational programs to member services.',
      icon: '⭐',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700'
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and methodologies to stay at the forefront of cybersecurity and risk management.',
      icon: '💡',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700'
    },
    {
      title: 'Integrity',
      description: 'We maintain the highest ethical standards and transparency in all our professional activities and relationships.',
      icon: '🤝',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700'
    },
    {
      title: 'Collaboration',
      description: 'We foster a community of sharing knowledge, experiences, and best practices among our diverse membership.',
      icon: '🌟',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700'
    },
    {
      title: 'Inclusivity',
      description: 'We welcome professionals from all backgrounds and career stages, promoting diversity and equal opportunities.',
      icon: '🌈',
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700'
    },
    {
      title: 'Growth',
      description: 'We are committed to continuous learning and professional development for all our members and stakeholders.',
      icon: '📈',
      color: 'from-teal-400 to-blue-500',
      bgColor: 'from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Core Values
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The principles that guide our mission and shape our community
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className={`group transform transition-all duration-1000 delay-${index * 100} hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className={`bg-gradient-to-br ${value.bgColor} rounded-2xl p-8 h-full border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-shadow duration-300`}>
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{value.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>

                {/* Decorative Element */}
                <div className={`w-full h-1 bg-gradient-to-r ${value.color} rounded-full mt-6 opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={`mt-16 text-center transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Values in Action
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              These values aren't just words on a page—they're the foundation of every program we create, 
              every event we host, and every interaction we have with our members and the broader community.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Member Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Diverse Speakers Annually</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ethical Standards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;