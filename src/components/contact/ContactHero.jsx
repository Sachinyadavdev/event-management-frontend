import React, { useState, useEffect, useRef } from 'react';

const ContactHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState([]);
  const containerRef = useRef(null);

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
        let sparkleCount = 1;
        
        if (speed > 2) {
          sparkleCount = Math.min(Math.floor(speed / 2) + 2, 8);
          
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
              opacity: Math.min(1, newLife * 1.2),
              rotation: sparkle.rotation + sparkle.rotationSpeed,
              velocity: {
                x: sparkle.velocity.x * 0.96,
                y: sparkle.velocity.y * 0.96 + 0.08,
              },
            };
          })
          .filter(sparkle => sparkle.life > 0.05)
      );
    };

    const interval = setInterval(animateSparkles, 12);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-20 lg:py-32 overflow-hidden"
    >
      {/* Sparkles Layer */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              opacity: sparkle.opacity,
              transform: `rotate(${sparkle.rotation}deg)`,
              background: `radial-gradient(circle, ${sparkle.color} 0%, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}40`,
              zIndex: 30,
            }}
          />
        ))}
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400/10 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-400/10 rounded-full animate-float animation-delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-pink-400/10 rounded-full animate-bounce animation-delay-1500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-8 animate-fadeIn">
            <span className="mr-2">💬</span>
            Get In Touch
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slideUp">
            Contact{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-textGlow">
              ISACA
            </span>
            <br />
            Silicon Valley
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-slideUp animation-delay-500">
            Ready to advance your cybersecurity career? Have questions about our events or membership? 
            We'd love to hear from you!
          </p>
          
          {/* Quick contact buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp animation-delay-1000">
            <a
              href="mailto:info@isaca-sv.org"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white font-semibold rounded-lg shadow-lg hover:shadow-xl 
                         transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              Send Email
            </a>
            
            <a
              href="tel:+1-650-555-0123"
              className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm 
                         text-white font-semibold rounded-lg border border-white/20 
                         hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              Call Us
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
    </section>
  );
};

export default ContactHero;