import React, { useState } from 'react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      category: 'Membership',
      questions: [
        {
          question: 'How do I become an ISACA Silicon Valley member?',
          answer: 'To become a member, you can apply online through our membership portal. We offer different membership types including Professional, Student, and Corporate memberships. Each type has specific requirements and benefits tailored to your career stage and needs.'
        },
        {
          question: 'What are the membership benefits?',
          answer: 'Members enjoy exclusive access to training sessions, networking events, industry insights, certification discounts, career resources, and our extensive professional network. You\'ll also receive priority registration for events and access to member-only content.'
        },
        {
          question: 'How much does membership cost?',
          answer: 'Membership fees vary by type: Professional membership is $150/year, Student membership is $25/year, and Corporate packages start at $500/year for up to 5 employees. We also offer discounts for early renewal and group memberships.'
        }
      ]
    },
    {
      category: 'Events & Training',
      questions: [
        {
          question: 'How do I register for events?',
          answer: 'You can register for events through our website\'s events page. Members receive early access and discounted rates. Simply log in to your account, browse upcoming events, and complete the registration process online. Payment can be made via credit card or PayPal.'
        },
        {
          question: 'Are training sessions eligible for CPE credits?',
          answer: 'Yes! Most of our training sessions and webinars are pre-approved for CPE credits. The number of credits varies by session length and content. You\'ll receive a certificate of completion that you can submit to maintain your professional certifications.'
        },
        {
          question: 'Can I attend events virtually?',
          answer: 'Many of our events offer hybrid attendance options, allowing you to join both in-person and virtually. Virtual attendees receive the same materials and can participate in Q&A sessions. Check individual event listings for availability of virtual attendance.'
        }
      ]
    },
    {
      category: 'Certifications',
      questions: [
        {
          question: 'Which certifications does ISACA offer?',
          answer: 'ISACA offers several globally recognized certifications including CISA (Certified Information Systems Auditor), CISM (Certified Information Security Manager), CGEIT (Certified in Governance of Enterprise IT), CRISC (Certified in Risk and Information Systems Control), and CSX-P (Cybersecurity Nexus Practitioner).'
        },
        {
          question: 'How do I prepare for ISACA certifications?',
          answer: 'We offer comprehensive exam preparation courses, study groups, practice exams, and mentorship programs. Our training materials include official ISACA study guides, online courses, and hands-on workshops. We also provide exam scheduling assistance and continuing education support.'
        },
        {
          question: 'What is the certification maintenance requirement?',
          answer: 'All ISACA certifications require annual maintenance fees and continuing professional education (CPE) credits. Typically, you need 20 CPE hours annually and 120 hours over a 3-year period. We offer numerous CPE-eligible activities to help you maintain your certification.'
        }
      ]
    },
    {
      category: 'General',
      questions: [
        {
          question: 'What industries do your members work in?',
          answer: 'Our members represent diverse industries including technology, finance, healthcare, government, consulting, education, and manufacturing. This diversity creates rich networking opportunities and cross-industry knowledge sharing during our events and programs.'
        },
        {
          question: 'How can I volunteer or get involved?',
          answer: 'We welcome volunteers for various roles including event coordination, content creation, mentorship programs, and committee participation. Contact us to learn about current volunteer opportunities that match your interests and availability.'
        },
        {
          question: 'Do you offer corporate training programs?',
          answer: 'Yes, we provide customized corporate training programs for organizations looking to enhance their team\'s cybersecurity, risk management, and governance capabilities. Our programs can be delivered on-site or virtually, tailored to your specific business needs and compliance requirements.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const faqId = `${categoryIndex}-${questionIndex}`;
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  const categoryColors = {
    'Membership': 'blue',
    'Events & Training': 'purple',
    'Certifications': 'green',
    'General': 'orange'
  };

  return (
    <section className="py-8 lg:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about membership, events, certifications, and more.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Category Header */}
              <div className={`bg-gradient-to-r from-${categoryColors[category.category]}-500 to-${categoryColors[category.category]}-600 px-6 py-4`}>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <div className={`w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3`}>
                    {categoryIndex === 0 && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {categoryIndex === 1 && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {categoryIndex === 2 && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    )}
                    {categoryIndex === 3 && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  {category.category}
                  <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded-full">
                    {category.questions.length} questions
                  </span>
                </h3>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.questions.map((faq, questionIndex) => {
                  const faqId = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openFAQ === faqId;

                  return (
                    <div key={questionIndex} className="transition-all duration-200">
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
                                 transition-colors duration-200 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                            {faq.question}
                          </h4>
                          <div className={`flex-shrink-0 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-5">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-8 lg:mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our team is here to help you with any questions about ISACA Silicon Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact-form"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg 
                         shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us
              </a>
              <a
                href="mailto:info@isaca-sv.org"
                className="inline-flex items-center px-8 py-3 bg-white/10 text-white font-semibold rounded-lg 
                         border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;