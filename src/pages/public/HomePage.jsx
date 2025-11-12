// Home page component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout.jsx';
import Button from '../../components/shared/ui/Button.jsx';
import EventCard from '../../components/shared/ui/EventCard.jsx';
import { IsacaLogo } from '../../assets';
import { eventsAPI } from '../../services/apiEndpoints';

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming events from API
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await eventsAPI.getAll({ 
          status: 'upcoming',
          limit: 3 // Get only 3 events for homepage
        });
        
        // Transform backend data to frontend format
        const transformedEvents = (response.data || []).map(event => ({
          id: event.id,
          slug: event.event_slug || event.id,
          title: event.event_title,
          hostedBy: event.hosted_by || 'ISACA Silicon Valley',
          date: event.event_date?.split('T')[0] || event.event_date,
          time: event.start_time || '00:00',
          duration: `${event.duration_hours || 2} hours`,
          venue: event.is_virtual ? 'Online Platform' : (event.venue_name || 'TBA'),
          location: event.is_virtual ? 'Virtual Event' : (event.venue_name || 'TBA'),
          address: event.venue_address || '',
          mode: event.is_virtual ? 'Virtual' : 'In-Person',
          price: { 
            member: event.member_price || 0, 
            nonMember: event.non_member_price || 0 
          },
          maxAttendees: event.max_attendees || 100,
          currentAttendees: event.registered_count || 0,
          image: event.media?.banner_image || event.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
          bannerImage: event.media?.banner_image || event.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
          level: event.difficulty_level || 'All Levels',
          cpe: event.cpe_hours || 0,
          virtual: event.is_virtual || false,
          description: event.event_description || '',
          speakers: event.speakers || [],
          sponsors: event.sponsors || [],
          tags: event.event_tags || [],
          category: event.event_category || 'Event',
          status: event.event_status || 'upcoming'
        }));
        
        setUpcomingEvents(transformedEvents);
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Custom CSS animations
  const customStyles = `
    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px) translateX(0px);
      }
      25% {
        transform: translateY(-30px) translateX(20px);
      }
      50% {
        transform: translateY(-15px) translateX(-10px);
      }
      75% {
        transform: translateY(-40px) translateX(15px);
      }
    }
    
    @keyframes floatDiagonal {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(50px, -30px) rotate(90deg);
      }
      50% {
        transform: translate(-20px, -60px) rotate(180deg);
      }
      75% {
        transform: translate(30px, -40px) rotate(270deg);
      }
    }
    
    @keyframes sparkle {
      0%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }
    
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
      }
      50% {
        box-shadow: 0 0 40px rgba(147, 51, 234, 0.8);
      }
    }
    
    .animate-fade-in-up {
      animation: fade-in-up 1s ease-out forwards;
      opacity: 0;
    }
    
    .animate-float {
      animation: float 8s ease-in-out infinite;
    }
    
    .animate-float-diagonal {
      animation: floatDiagonal 12s ease-in-out infinite;
    }
    
    .animate-sparkle {
      animation: sparkle 3s ease-in-out infinite;
    }
    
    .animate-glow {
      animation: glow 3s ease-in-out infinite;
    }
    
    /* Mouse cursor trail effect */
    .hero-cursor-trail {
      position: absolute;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: screen;
      animation: cursorFade 1s ease-out forwards;
    }
    
    @keyframes cursorFade {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.5);
      }
    }
    
    /* Background floating animation */
    @keyframes backgroundFloat {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      33% {
        transform: translate(30px, -30px) rotate(120deg);
      }
      66% {
        transform: translate(-20px, 20px) rotate(240deg);
      }
    }
  `;

  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    // Mouse cursor trail effect
    const heroSection = document.querySelector('.hero-section');
    let mouseTrails = [];
    
    const createCursorTrail = (e) => {
      if (!heroSection) return;
      
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const trail = document.createElement('div');
      trail.className = 'hero-cursor-trail';
      trail.style.left = `${x - 10}px`;
      trail.style.top = `${y - 10}px`;
      
      heroSection.appendChild(trail);
      mouseTrails.push(trail);
      
      // Remove trail after animation
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
        mouseTrails = mouseTrails.filter(t => t !== trail);
      }, 1000);
      
      // Limit number of trails
      if (mouseTrails.length > 15) {
        const oldTrail = mouseTrails.shift();
        if (oldTrail.parentNode) {
          oldTrail.parentNode.removeChild(oldTrail);
        }
      }
    };
    
    if (heroSection) {
      heroSection.addEventListener('mousemove', createCursorTrail);
    }
    
    return () => {
      if (heroSection) {
        heroSection.removeEventListener('mousemove', createCursorTrail);
      }
      // Clean up remaining trails
      mouseTrails.forEach(trail => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      });
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <PublicLayout>
      {/* Hero Section with Background Banner */}
      <section className="hero-section relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 animate-pulse"></div>
        
        {/* Enhanced Floating Particles Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large floating particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-300 rounded-full opacity-80 animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-1/6 right-1/3 w-3 h-3 bg-white rounded-full opacity-70 animate-float-diagonal" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/5 w-5 h-5 bg-blue-200 rounded-full opacity-60 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-indigo-300 rounded-full opacity-90 animate-sparkle" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 right-1/6 w-3 h-3 bg-purple-300 rounded-full opacity-75 animate-float" style={{animationDelay: '1.5s'}}></div>
          
          {/* Medium particles */}
          <div className="absolute top-1/5 left-1/2 w-2 h-2 bg-cyan-300 rounded-full opacity-60 animate-float-diagonal" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/5 right-1/2 w-1 h-1 bg-blue-100 rounded-full opacity-80 animate-sparkle" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute top-3/4 left-1/6 w-3 h-3 bg-indigo-200 rounded-full opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-purple-200 rounded-full opacity-65 animate-float-diagonal" style={{animationDelay: '3.5s'}}></div>
          
          {/* Small sparkle particles */}
          <div className="absolute top-1/8 left-3/4 w-1 h-1 bg-white rounded-full opacity-90 animate-sparkle" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-3/8 left-1/8 w-1 h-1 bg-blue-100 rounded-full opacity-85 animate-sparkle" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/8 left-2/3 w-1 h-1 bg-cyan-200 rounded-full opacity-80 animate-sparkle" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-5/8 right-1/8 w-1 h-1 bg-indigo-100 rounded-full opacity-75 animate-sparkle" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-3/8 right-3/4 w-1 h-1 bg-purple-100 rounded-full opacity-70 animate-sparkle" style={{animationDelay: '5s'}}></div>
          
          {/* Additional floating elements */}
          <div className="absolute top-1/2 left-1/8 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-float" style={{animationDelay: '6s'}}></div>
          <div className="absolute bottom-1/6 left-3/4 w-3 h-3 bg-cyan-300 rounded-full opacity-60 animate-float-diagonal" style={{animationDelay: '7s'}}></div>
          <div className="absolute top-5/6 right-2/3 w-1 h-1 bg-white rounded-full opacity-80 animate-sparkle" style={{animationDelay: '8s'}}></div>
          <div className="absolute top-1/12 right-1/12 w-2 h-2 bg-indigo-400 rounded-full opacity-70 animate-float" style={{animationDelay: '9s'}}></div>
        </div>
        
        {/* Moving Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Ccircle cx='25' cy='25' r='1'/%3E%3Ccircle cx='75' cy='75' r='1'/%3E%3Ccircle cx='25' cy='75' r='1.5'/%3E%3Ccircle cx='75' cy='25' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float 20s ease-in-out infinite'
        }}></div>
        
        {/* Geometric shapes animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
          <div className="absolute -bottom-8 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s', animationDuration: '6s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '1s', animationDuration: '5s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 z-10">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                {/* <img 
                  src={IsacaLogo} 
                  alt="ISACA Silicon Valley" 
                  className="relative h-20 sm:h-24 lg:h-28 w-auto filter brightness-0 invert transform hover:scale-110 transition-all duration-500 animate-fade-in-up"
                /> */}
              </div>
            </div>
            
            {/* Animated Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Empowering{'  '}
              </span>
              <span className="text-blue-300 inline-block animate-fade-in-up hover:text-blue-200 transition-colors duration-300" style={{animationDelay: '0.4s'}}>
                 Cybersecurity
              </span>
              <br />
              <span className="text-blue-200 inline-block animate-fade-in-up hover:text-blue-100 transition-colors duration-300" style={{animationDelay: '0.6s'}}>
                Professionals
              </span>
            </h1>
            
            {/* Animated Subtitle */}
            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in-up opacity-90 hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.8s'}}>
              Join Silicon Valley's premier community of cybersecurity, governance, and risk management professionals
            </p>
            
            {/* Enhanced Animated CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{animationDelay: '1s'}}>
              {/* Primary Button - Become a Member */}
              <Link to="/register">
                <div className="group relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-white via-blue-100 to-purple-100 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:duration-200 animate-pulse"></div>
                  
                  <Button 
                    size="md" 
                    className="relative bg-white text-blue-900 hover:bg-gradient-to-r hover:from-white hover:to-blue-50 border-2 border-white px-8 py-3 text-base font-bold rounded-2xl transform hover:scale-110 transition-all duration-500 hover:shadow-2xl overflow-hidden group"
                  >
                    {/* Animated background shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    
                    {/* Icon */}
                    <svg className="w-6 h-6 mr-3 relative z-10 text-white group-hover:text-blue-600 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    
                    <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      Become a Member
                    </span>
                    
                    {/* Floating particles */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-full group-hover:h-full transition-all duration-500">
                      <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                      <div className="absolute bottom-3 right-6 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute top-4 right-8 w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </Button>
                </div>
              </Link>

              {/* Secondary Button - Explore Events */}
              <Link to="/events">
                <div className="group relative">
                  {/* Animated border glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-2xl opacity-30 group-hover:opacity-70 blur-sm transition-all duration-500 animate-pulse"></div>
                  
                  <Button 
                    variant="outline" 
                    size="md" 
                    className="relative bg-transparent border-2 border-white/70 text-white hover:bg-white hover:text-blue-900 hover:border-transparent px-8 py-3 text-base font-bold rounded-2xl transform hover:scale-110 transition-all duration-500 hover:shadow-2xl backdrop-blur-sm overflow-hidden group"
                  >
                    {/* Animated background fill */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-purple-50 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                    
                    {/* Ripple effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100"></div>
                    
                    {/* Icon */}
                    <svg className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-12 group-hover:text-blue-600 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    
                    <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      Explore Events
                    </span>

                    {/* Sparkle effects */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-2 left-3 text-yellow-400 animate-ping">✨</div>
                      <div className="absolute bottom-2 right-4 text-blue-400 animate-ping" style={{animationDelay: '0.3s'}}>⭐</div>
                      <div className="absolute top-3 right-3 text-purple-400 animate-ping" style={{animationDelay: '0.6s'}}>✦</div>
                    </div>
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't miss out on our latest workshops, webinars, and networking opportunities
            </p>
          </div>  

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {upcomingEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  userType="guest"
                  context="home"
                  showSpeakers={true}
                  showSponsors={true}
                  showTags={true}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/events">
              <Button variant="outline" size="lg" className="px-8">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Useful Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Member Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access exclusive resources and tools to advance your cybersecurity career
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Materials</h3>
              <p className="text-gray-600 text-sm">
                Access comprehensive study guides for CISA, CISM, and other certifications
              </p>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Networking Hub</h3>
              <p className="text-gray-600 text-sm">
                Connect with cybersecurity professionals in Silicon Valley and beyond
              </p>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Resources</h3>
              <p className="text-gray-600 text-sm">
                Job board, salary guides, and career development opportunities
              </p>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Knowledge Base</h3>
              <p className="text-gray-600 text-sm">
                Research papers, whitepapers, and industry best practices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Advance Your Cybersecurity Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the ISACA Silicon Valley Chapter and connect with industry leaders, 
            access exclusive resources, and stay ahead of the latest trends in cybersecurity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
              Join Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;