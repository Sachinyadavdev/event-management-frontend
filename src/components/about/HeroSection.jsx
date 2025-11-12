// About Us Hero Section Component - Enhanced with Spectacular Animations
import React, { useState, useEffect, useRef } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState([]);
  const containerRef = useRef(null);

  const words = ['Innovation', 'Excellence', 'Security', 'Leadership', 'Community'];
  const fullText = "Empowering cybersecurity, risk management, and governance professionals in the heart of innovation since 1995.";

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 80; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 0.5,
          speed: Math.random() * 4 + 2,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
    
    // Animate particles continuously
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y > 100 ? -5 : particle.y + particle.speed * 0.05,
        }))
      );
    };
    
    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  // Mouse movement effect with sparkles
  useEffect(() => {
    let lastMousePos = { x: 0, y: 0 };
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const currentPos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        
        const newMousePos = {
          x: currentPos.x / rect.width,
          y: currentPos.y / rect.height,
        };
        setMousePosition(newMousePos);

        // Calculate movement speed
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        const distance = Math.sqrt(
          Math.pow(currentPos.x - lastMousePos.x, 2) + 
          Math.pow(currentPos.y - lastMousePos.y, 2)
        );
        const speed = distance / Math.max(deltaTime, 1);

        // Create sparkle effect based on movement speed
        const createSparkle = (offsetX = 0, offsetY = 0) => {
          const sparkle = {
            id: Date.now() + Math.random(),
            x: currentPos.x + offsetX,
            y: currentPos.y + offsetY,
            size: Math.random() * 8 + 3,
            opacity: 1,
            color: ['#60A5FA', '#A78BFA', '#FBBF24', '#F87171', '#34D399', '#FFFFFF'][Math.floor(Math.random() * 6)],
            velocity: {
              x: (Math.random() - 0.5) * 8 + (speed * 0.3 * Math.sign(currentPos.x - lastMousePos.x)),
              y: (Math.random() - 0.5) * 8 - 2 + (speed * 0.3 * Math.sign(currentPos.y - lastMousePos.y)),
            },
            life: 1,
            decay: 0.012,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
          };

          setSparkles(prev => [...prev.slice(-50), sparkle]);
        };

        // Create more sparkles for faster movement
        let sparkleCount = 1; // Base sparkle count
        
        if (speed > 2) {
          sparkleCount = Math.min(Math.floor(speed / 2) + 2, 8); // More sparkles for fast movement
          
          // Create trail effect for fast movement
          for (let i = 0; i < sparkleCount; i++) {
            const trailOffset = i / sparkleCount;
            const offsetX = (lastMousePos.x - currentPos.x) * trailOffset * 0.5;
            const offsetY = (lastMousePos.y - currentPos.y) * trailOffset * 0.5;
            
            setTimeout(() => createSparkle(offsetX, offsetY), i * 5);
          }
        } else {
          // Normal sparkle generation for slow movement
          sparkleCount = Math.random() < 0.8 ? Math.floor(Math.random() * 2) + 1 : 0;
          for (let i = 0; i < sparkleCount; i++) {
            createSparkle();
          }
        }

        lastMousePos = currentPos;
        lastTime = currentTime;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Animate sparkles
  useEffect(() => {
    const animateSparkles = () => {
      setSparkles(prevSparkles => 
        prevSparkles
          .map(sparkle => {
            const newLife = Math.max(0, sparkle.life - sparkle.decay);
            return {
              ...sparkle,
              x: sparkle.x + sparkle.velocity.x,
              y: sparkle.y + sparkle.velocity.y,
              life: newLife,
              opacity: Math.min(1, newLife * 1.2), // Slightly brighter opacity curve
              rotation: sparkle.rotation + sparkle.rotationSpeed,
              velocity: {
                x: sparkle.velocity.x * 0.96, // Less air resistance for better trails
                y: sparkle.velocity.y * 0.96 + 0.08, // Reduced gravity for longer visibility
              },
            };
          })
          .filter(sparkle => sparkle.life > 0.05) // Keep sparkles visible longer
      );
    };

    const interval = setInterval(animateSparkles, 12); // Slightly faster animation (83fps)
    return () => clearInterval(interval);
  }, []);

  // Initial animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for rotating words
  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isVisible, words.length]);

  // Animated text typing effect
  useEffect(() => {
    if (isVisible) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isVisible, fullText]);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 h-screen flex items-center"
    >
      {/* Dynamic Background with Mouse Interaction */}
      <div className="absolute inset-0">
        {/* Subtle Mouse Interactive Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          }}
        ></div>
        
        {/* Enhanced Large Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/25 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/15 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Additional Moving Orbs */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-2xl animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-yellow-500/15 rounded-full filter blur-2xl animate-pulse animation-delay-3000"></div>
        
        {/* Enhanced Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${particle.speed * 2}s`,
              animationDelay: `${particle.id * 0.1}s`,
              transform: `scale(${particle.size / 2})`,
            }}
          ></div>
        ))}

        {/* Enhanced Mouse Sparkle Effect */}
        {sparkles.map((sparkle) => (
          <div key={sparkle.id} className="absolute pointer-events-none z-30">
            {/* Main Sparkle */}
            <div
              className="absolute"
              style={{
                left: sparkle.x - sparkle.size / 2,
                top: sparkle.y - sparkle.size / 2,
                width: sparkle.size,
                height: sparkle.size,
                backgroundColor: sparkle.color,
                opacity: sparkle.opacity,
                borderRadius: '50%',
                boxShadow: `0 0 ${sparkle.size * 3}px ${sparkle.color}, 0 0 ${sparkle.size}px ${sparkle.color}`,
                transform: `rotate(${sparkle.rotation}deg) scale(${sparkle.life})`,
              }}
            />
            
            {/* Star Shape Effect */}
            <div
              className="absolute"
              style={{
                left: sparkle.x - 1,
                top: sparkle.y - sparkle.size,
                width: '2px',
                height: sparkle.size * 2,
                backgroundColor: sparkle.color,
                opacity: sparkle.opacity * 0.8,
                borderRadius: '1px',
                boxShadow: `0 0 ${sparkle.size}px ${sparkle.color}`,
                transform: `rotate(${sparkle.rotation}deg)`,
              }}
            />
            <div
              className="absolute"
              style={{
                left: sparkle.x - sparkle.size,
                top: sparkle.y - 1,
                width: sparkle.size * 2,
                height: '2px',
                backgroundColor: sparkle.color,
                opacity: sparkle.opacity * 0.8,
                borderRadius: '1px',
                boxShadow: `0 0 ${sparkle.size}px ${sparkle.color}`,
                transform: `rotate(${sparkle.rotation}deg)`,
              }}
            />
            
            {/* Glow Trail */}
            <div
              className="absolute"
              style={{
                left: sparkle.x - sparkle.size * 2,
                top: sparkle.y - sparkle.size * 2,
                width: sparkle.size * 4,
                height: sparkle.size * 4,
                background: `radial-gradient(circle, ${sparkle.color}15 0%, transparent 60%)`,
                borderRadius: '50%',
                opacity: sparkle.opacity * 0.4,
                transform: `scale(${sparkle.life})`,
              }}
            />
          </div>
        ))}
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                 backgroundSize: '50px 50px'
               }}>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-start pt-16 md:pt-20">
        <div className="text-center">
          {/* Spectacular Main Heading */}
          <div className={`mb-8 transform transition-all duration-1500 ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
          }`}>
            {/* Floating Badge */}
            <div className={`inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-white/90 text-sm font-medium">Since 1995 • Silicon Valley Chapter</span>
            </div>

            {/* Animated Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              <span className={`inline-block transform transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                About
              </span>
              <span className="mx-2 md:mx-3"></span>
              <span className={`inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transform transition-all duration-1000 delay-700 hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                ISACA
              </span>
              <span className="mx-2 md:mx-3"></span>
              <span className={`inline-block transform transition-all duration-1000 delay-900 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                Silicon Valley
              </span>
            </h1>
            
            {/* Animated Underline */}
            <div className="flex items-center justify-center mb-6">
              <div className={`h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-2000 delay-1000 ${
                isVisible ? 'w-24' : 'w-0'
              }`}></div>
              <div className="mx-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <div className={`h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-2000 delay-1200 ${
                isVisible ? 'w-24' : 'w-0'
              }`}></div>
            </div>

            {/* Rotating Words Display */}
            <div className={`mb-6 transform transition-all duration-1000 delay-1400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <p className="text-xl md:text-2xl text-blue-200 font-light mb-3">
                Driving{' '}
                <span className="relative inline-block">
                  <span 
                    key={currentWordIndex}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold animate-pulse"
                  >
                    {words[currentWordIndex]}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse"></span>
                </span>
                {' '}in Cybersecurity
              </p>
            </div>
            
            {/* Typewriter Description */}
            <div className={`mb-6 transform transition-all duration-1000 delay-1600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
                {typedText}
                <span className="animate-blink">|</span>
              </p>
            </div>
          </div>

          {/* Enhanced Key Statistics - Compact */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8 transform transition-all duration-1000 delay-1800 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            {[
              { number: '1,200+', label: 'Active Members', icon: '👥', color: 'from-blue-400 to-cyan-400' },
              { number: '30+', label: 'Years of Excellence', icon: '🏆', color: 'from-yellow-400 to-orange-400' },
              { number: '50+', label: 'Annual Events', icon: '📅', color: 'from-green-400 to-emerald-400' },
              { number: '100+', label: 'Industry Partners', icon: '🤝', color: 'from-purple-400 to-pink-400' },
            ].map((stat, index) => (
              <div 
                key={index}
                className={`group text-center transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${1800 + index * 200}ms` }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/25">
                  {/* Animated Icon */}
                  <div className="text-2xl mb-2 group-hover:animate-bounce">
                    {stat.icon}
                  </div>
                  
                  {/* Animated Number */}
                  <div className={`text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-blue-200 text-xs md:text-sm font-medium group-hover:text-white transition-colors duration-300">
                    {stat.label}
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300 blur-lg`}></div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-3000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="flex flex-col items-center group cursor-pointer">
          <div className="text-white/60 text-sm font-medium mb-3 group-hover:text-white transition-colors duration-300">
            Discover More
          </div>
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors duration-300">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce group-hover:bg-white transition-colors duration-300"></div>
          </div>
          <div className="mt-3 animate-bounce">
            <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;