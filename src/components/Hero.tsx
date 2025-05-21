
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-dsfl-dark h-screen flex items-center">
      <div className="dsfl-container flex flex-col lg:flex-row items-center">
        <div 
          className={`w-full lg:w-1/2 text-left transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <span className="inline-block text-dsfl-primary mb-4 animate-pulse">Compete for Glory</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join Our Inter <br />House Fantasy <br />Games
          </h1>
          <p className="text-gray-300 mb-8 max-w-lg">
            Welcome to our Inter House Fantasy Games! Our fantasy
            league lets you draft your own dream team and compete
            for glory. Whether you're a sports fan or just looking for a fun
            way to connect with your housemates, our games are the
            perfect way to get involved. Sign up today and
            dominate the competition!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/signup" 
              className="dsfl-btn relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-0 bg-dsfl-secondary group-hover:w-full transition-all duration-300 ease-out"></span>
              <span className="relative">Play For Free</span>
            </Link>
            <Link 
              to="/points-system" 
              className="dsfl-btn-outline flex items-center group"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transform group-hover:translate-x-1 transition-transform">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Learn To Play</span>
            </Link>
          </div>
        </div>
        <div 
          className={`w-full lg:w-1/2 mt-10 lg:mt-0 transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-dsfl-primary/30 to-transparent rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative">
              <svg viewBox="0 0 24 24" className="w-full h-full max-w-md mx-auto" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10" stroke="#085285" strokeWidth="1" className="animate-[pulse_4s_infinite]" />
                <path d="M2,12 L22,12" stroke="#085285" strokeWidth="0.5" />
                <path d="M12,2 L12,22" stroke="#085285" strokeWidth="0.5" />
                
                {/* Soccer players silhouettes with subtle animation */}
                <g fill="#00BFFF" opacity="0.7" className="animate-[pulse_3s_infinite]">
                  <circle cx="12" cy="7" r="2" />
                  <circle cx="8" cy="10" r="2" />
                  <circle cx="16" cy="10" r="2" />
                  <circle cx="7" cy="14" r="2" />
                  <circle cx="12" cy="14" r="2" />
                  <circle cx="17" cy="14" r="2" />
                  <circle cx="9" cy="18" r="2" />
                  <circle cx="15" cy="18" r="2" />
                </g>
                
                <circle cx="12" cy="12" r="3" stroke="#00BFFF" strokeWidth="1" fill="none" className="animate-[ping_3s_infinite]" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-dsfl-primary/10 rounded-full blur-2xl animate-[pulse_10s_infinite]"></div>
      <div className="absolute top-20 -right-20 w-60 h-60 bg-dsfl-primary/5 rounded-full blur-3xl animate-[pulse_15s_infinite_1s]"></div>
    </div>
  );
};

export default Hero;
