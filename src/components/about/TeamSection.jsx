// Team Section Component
import React, { useState, useEffect, useRef } from 'react';

const TeamSection = () => {
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

  const boardMembers = [
    {
      name: 'Dr. Sarah Chen',
      position: 'Chapter President',
      company: 'Cisco Systems',
      bio: 'Leading cybersecurity expert with 15+ years of experience in enterprise security architecture.',
      avatar: '👩‍💼',
      linkedIn: '#',
      email: 'president@isaca-sv.org',
      expertise: ['Risk Management', 'Cloud Security', 'Strategy']
    },
    {
      name: 'Michael Rodriguez',
      position: 'Vice President',
      company: 'Google',
      bio: 'Former CISO with extensive background in incident response and security operations.',
      avatar: '👨‍💻',
      linkedIn: '#',
      email: 'vp@isaca-sv.org',
      expertise: ['Incident Response', 'Security Operations', 'Compliance']
    },
    {
      name: 'Jennifer Kim',
      position: 'Treasurer',
      company: 'Apple',
      bio: 'Financial technology expert specializing in secure payment systems and fraud prevention.',
      avatar: '👩‍💻',
      linkedIn: '#',
      email: 'treasurer@isaca-sv.org',
      expertise: ['Financial Security', 'Fraud Prevention', 'Audit']
    },
    {
      name: 'David Thompson',
      position: 'Secretary',
      company: 'Meta',
      bio: 'Privacy and data protection specialist with deep expertise in regulatory compliance.',
      avatar: '👨‍💼',
      linkedIn: '#',
      email: 'secretary@isaca-sv.org',
      expertise: ['Privacy', 'Data Protection', 'GDPR Compliance']
    },
    {
      name: 'Lisa Park',
      position: 'Programs Director',
      company: 'Salesforce',
      bio: 'Education and training specialist focused on cybersecurity workforce development.',
      avatar: '👩‍🏫',
      linkedIn: '#',
      email: 'programs@isaca-sv.org',
      expertise: ['Education', 'Training', 'Certification']
    },
    {
      name: 'Ahmed Hassan',
      position: 'Membership Director',
      company: 'Intel',
      bio: 'Community building expert passionate about professional networking and mentorship.',
      avatar: '👨‍🤝‍👨',
      linkedIn: '#',
      email: 'membership@isaca-sv.org',
      expertise: ['Community Building', 'Mentorship', 'Networking']
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
            Meet Our Leadership Team
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Dedicated professionals committed to advancing cybersecurity excellence in Silicon Valley
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {boardMembers.map((member, index) => (
            <div 
              key={index}
              className={`group transform transition-all duration-1000 delay-${index * 100} hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600 h-full">
                
                {/* Avatar and Contact */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">{member.avatar}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <div className="text-blue-600 dark:text-blue-400 font-semibold mb-1">
                    {member.position}
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {member.company}
                  </div>

                  {/* Contact Links */}
                  <div className="flex justify-center space-x-3">
                    <a 
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-300"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                    </a>
                    <a 
                      href={member.linkedIn}
                      className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors duration-300"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Our Team Section */}
        <div className={`text-center transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-blue-200 dark:border-gray-600">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our Leadership Team
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're always looking for passionate professionals to help guide our chapter's future. 
              Board positions offer excellent opportunities for professional development, networking, 
              and making a meaningful impact in the cybersecurity community.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Leadership Development</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enhance your leadership skills in a professional environment</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Network Expansion</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect with industry leaders and decision makers</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Community Impact</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Make a difference in the cybersecurity profession</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Apply for Board Position
              </button>
              <button className="border-2 border-blue-500 text-blue-500 dark:text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all duration-300">
                Volunteer Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;