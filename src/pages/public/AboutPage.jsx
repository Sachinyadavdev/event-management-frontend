// About Us Page - Main Container
import React from 'react';
import PublicLayout from '../../components/public/PublicLayout.jsx';
import HeroSection from '../../components/about/HeroSection.jsx';
import MissionVisionSection from '../../components/about/MissionVisionSection.jsx';
import HistorySection from '../../components/about/HistorySection.jsx';
import TeamSection from '../../components/about/TeamSection.jsx';
import ValuesSection from '../../components/about/ValuesSection.jsx';
import AchievementsSection from '../../components/about/AchievementsSection.jsx';
import ContactSection from '../../components/about/ContactSection.jsx';

const AboutPage = () => {
  return (
    <PublicLayout>
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Mission & Vision */}
        <MissionVisionSection />
        
        {/* Our History */}
        <HistorySection />
        
        {/* Core Values */}
        <ValuesSection />
        
        {/* Achievements & Recognition */}
        <AchievementsSection />
        
        {/* Our Team */}
        <TeamSection />
        
        {/* Contact Information */}
        <ContactSection />
      </div>
    </PublicLayout>
  );
};

export default AboutPage;