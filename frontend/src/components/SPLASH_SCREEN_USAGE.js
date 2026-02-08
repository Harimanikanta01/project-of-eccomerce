/**
 * SPLASH SCREEN USAGE GUIDE
 * 
 * This is a professional 2-3 second animated splash screen for your ecommerce app
 * Features:
 * - Animated rotating gradient circles
 * - Smooth scale and fade transitions
 * - Bouncing loading dots
 * - 3 phase animation sequence
 * - Perfect for app initialization
 * 
 * USAGE OPTIONS:
 */

// ============================================================================
// OPTION 1: Use in App.js (Recommended)
// ============================================================================

/*
import React, { useState } from 'react'
import SplashScreen from './components/SplashScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {/* Your app content */}
      <div className={`transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        {/* App Routes and Content */}
      </div>
    </>
  )
}

export default App
*/

// ============================================================================
// OPTION 2: Use as Loading Indicator
// ============================================================================

/*
import SplashScreen from './components/SplashScreen'

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadData = async () => {
    setIsLoading(true)
    // Fetch data...
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}
      <button onClick={handleLoadData}>Load Data</button>
    </>
  )
}
*/

// ============================================================================
// ANIMATION PHASES (2.8 seconds total):
// ============================================================================

/*
Phase 0 (0-100ms):   Initial state - everything hidden
Phase 1 (100-1500ms): Logo appears and scales up, rotating rings start, dots animate
Phase 2 (1500-2800ms): Text appears, pulsing ring animates
Complete (2800ms):   Screen fades out, onComplete callback fired
*/

// ============================================================================
// CUSTOMIZATION OPTIONS
// ============================================================================

/*
To customize the splash screen, edit these properties in SplashScreen.js:

1. Colors: 
   - from-red-600 to-orange-500  (Main logo gradient)
   - border-t-red-500, border-r-orange-500  (Rotating rings)
   - text-orange-400  (Subtitle text)

2. Brand Name:
   - Change "ShopHub" to your app name
   - Change "PREMIUM ECOMMERCE" to your tagline

3. Icon:
   - Replace FaShoppingBag with any icon from react-icons
   - Or replace with custom SVG/Image

4. Timing:
   - Phase 1: setTimeout(..., 100)  -> Change first animation start
   - Phase 2: setTimeout(..., 1500) -> Change text appearance time
   - Complete: setTimeout(..., 2800) -> Change total duration

5. Speed:
   - animationDuration: '2s'  -> Logo rotation speed
   - animationDuration: '3s'  -> Pulsing ring speed
   - duration-700  -> Transition duration
*/

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

// Example: App.js Integration
export const AppIntegration = `
import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import Router from './routes'

export default function App() {
  const [splashComplete, setSplashComplete] = useState(false)

  return (
    <>
      {!splashComplete && (
        <SplashScreen onComplete={() => setSplashComplete(true)} />
      )}
      
      <div className={splashComplete ? 'opacity-100' : 'opacity-0'}>
        <Router />
      </div>
    </>
  )
}
`

// Example: Custom variant with different colors and timing
export const CustomVariant = `
// Create a variant for different pages/sections
import SplashScreen from './components/SplashScreen'

export function CustomSplash() {
  return (
    <div>
      {/* Modify the component or create variations */}
      <SplashScreen 
        onComplete={() => console.log('Custom splash complete')}
      />
    </div>
  )
}
`
