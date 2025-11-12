// Contact Us Page - Main Container
import React from 'react';
import PublicLayout from '../../components/public/PublicLayout.jsx';
import ContactHero from '../../components/contact/ContactHero.jsx';
import ContactForm from '../../components/contact/ContactForm.jsx';
import ContactInfo from '../../components/contact/ContactInfo.jsx';
import LocationMap from '../../components/contact/LocationMap.jsx';
import FAQSection from '../../components/contact/FAQSection.jsx';

const ContactPage = () => {
  return (
    <PublicLayout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <ContactHero />
        
        {/* Contact Form & Info Section */}
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </div>
        
        {/* Location Map */}
        <LocationMap />
        
        {/* FAQ Section */}
        <FAQSection />
      </div>
    </PublicLayout>
  );
};

export default ContactPage;