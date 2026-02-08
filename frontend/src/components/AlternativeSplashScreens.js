import React, { useEffect, useState } from 'react'
import { FaRocket, FaFireAlt, FaShoppingCart } from 'react-icons/fa'

/**
 * MODERN SPLASH SCREEN - Minimalist Design
 * Perfect for sleek, professional brands
 */
export const ModernSplash = ({ onComplete }) => {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 300)
    const timer2 = setTimeout(() => setPhase(2), 1800)
    const timer3 = setTimeout(() => onComplete?.(), 2800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon with pulse */}
        <div
          className={`mx-auto mb-8 transition-all duration-1000 ${
            phase >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <div
            className="inline-block p-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl"
            style={{
              animation: phase >= 2 ? 'pulse 2s infinite' : 'none'
            }}
          >
            <FaShoppingCart className="text-white text-6xl" />
          </div>
        </div>

        {/* Text */}
        <div
          className={`transition-all duration-700 transform ${
            phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">HALVEN</h1>
          <p className="text-slate-600 text-lg mt-3 font-light">Premium Shopping Experience</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
        }
      `}</style>
    </div>
  )
}

/**
 * ENERGETIC SPLASH SCREEN - Dynamic Design
 * For modern, youthful brands
 */
export const EnergeticSplash = ({ onComplete }) => {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 200)
    const timer2 = setTimeout(() => setPhase(2), 1600)
    const timer3 = setTimeout(() => onComplete?.(), 2700)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div
          className={`absolute w-96 h-96 bg-violet-500/30 rounded-full blur-3xl transition-all duration-1000 ${
            phase >= 1 ? 'top-0 left-0' : '-top-48 -left-48'
          }`}
        ></div>
        <div
          className={`absolute w-96 h-96 bg-pink-500/30 rounded-full blur-3xl transition-all duration-1000 ${
            phase >= 1 ? 'bottom-0 right-0' : '-bottom-48 -right-48'
          }`}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Animated icon */}
        <div
          className={`mx-auto mb-8 transition-all duration-700 transform ${
            phase >= 1 ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-45'
          }`}
        >
          <div className="text-8xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
            <FaFireAlt />
          </div>
        </div>

        {/* Text with stagger */}
        <div
          className={`transition-all duration-500 delay-200 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-6xl font-black text-white tracking-tighter">HALVEN</h1>
          <p className="text-violet-300 text-xl mt-4 font-semibold">Premium Shopping Experience</p>
        </div>
      </div>
    </div>
  )
}

/**
 * LUXURY SPLASH SCREEN - Elegant Design
 * For premium, upscale brands
 */
export const LuxurySplash = ({ onComplete }) => {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 400)
    const timer2 = setTimeout(() => setPhase(2), 1700)
    const timer3 = setTimeout(() => onComplete?.(), 2800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-yellow-500 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon with elegant animation */}
        <div
          className={`mx-auto mb-12 transition-all duration-1000 ${
            phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="w-28 h-28 border-2 border-yellow-500 rounded-full flex items-center justify-center">
            <FaShoppingCart className="text-4xl text-yellow-500" />
          </div>
        </div>

        {/* Premium text */}
        <div
          className={`transition-all duration-700 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-yellow-500 text-sm tracking-[0.3em] font-light mb-4">LUXURY COLLECTION</div>
          <h1 className="text-5xl font-light text-white tracking-widest mb-2">HALVEN</h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-6"></div>
        </div>
      </div>
    </div>
  )
}

export default { ModernSplash, EnergeticSplash, LuxurySplash }
