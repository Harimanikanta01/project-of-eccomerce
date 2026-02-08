import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'

const SplashScreen = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [phase, setPhase] = useState(0) // 0: initial, 1: grow, 2: complete

  useEffect(() => {
    // Phase 1: Logo appears and scales up (0.8s)
    const timer1 = setTimeout(() => {
      setPhase(1)
    }, 100)

    // Phase 2: Logo bounces and text appears (1.5s)
    const timer2 = setTimeout(() => {
      setPhase(2)
    }, 1500)

    // Phase 3: Complete and fade out (2.5-3s)
    const timer3 = setTimeout(() => {
      setIsLoading(false)
      onComplete?.()
    }, 2800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center transition-opacity duration-700 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl transition-all duration-1000 ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
        ></div>
        <div
          className={`absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-tl from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transition-all duration-1000 delay-200 ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo Container */}
        <div
          className={`relative transition-all duration-700 transform ${
            phase === 0 ? 'scale-0 opacity-0' : phase === 1 ? 'scale-110 opacity-100' : 'scale-100 opacity-100'
          }`}
        >
          {/* Outer Rotating Ring */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 border-r-orange-500 ${
              phase >= 1 ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '2s' }}
          ></div>

          {/* Middle Pulsing Ring */}
          <div
            className={`absolute inset-2 rounded-full border-2 border-transparent border-b-blue-500 border-l-purple-500 transition-all duration-700 ${
              phase >= 2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            style={{
              animationDuration: '3s',
              animation: phase >= 2 ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
            }}
          ></div>

          {/* Main Logo */}
          <div
            className={`relative w-32 h-32 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${
              phase >= 1 ? 'scale-100' : 'scale-75'
            }`}
            style={{
              boxShadow: phase >= 1 ? '0 20px 60px rgba(239, 68, 68, 0.4)' : '0 0 0 rgba(0, 0, 0, 0)'
            }}
          >
            <FaShoppingCart className="text-white text-6xl" />
          </div>
        </div>

        {/* Brand Text */}
        <div
          className={`text-center transition-all duration-700 transform ${
            phase >= 2 ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-5xl font-bold text-white tracking-wider">HALVEN</h1>
          <p className="text-orange-400 text-sm mt-2 font-medium tracking-widest">PREMIUM SHOPPING</p>
        </div>

        {/* Loading Dots */}
        <div
          className={`flex gap-2 mt-8 transition-all duration-700 ${
            phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
              style={{
                animation: 'bounce 1.4s infinite',
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-15px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default SplashScreen
