import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const [splashComplete, setSplashComplete] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  // ✅ Fetch user details using JWT
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.success) dispatch(setUserDetails(data.data));
    } catch (err) {
      console.error('fetchUserDetails error', err);
      dispatch(setUserDetails(null));
    }
  };

  // ✅ Fetch cart count using JWT
  const fetchUserAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setCartProductCount(data?.data?.count || 0);
    } catch (err) {
      console.error('fetchUserAddToCart error', err);
      setCartProductCount(0);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      await fetchUserDetails();
      await fetchUserAddToCart();
      setContentLoaded(true);
    };
    initApp();
  }, []);

  // ✅ Professional splash screen with loading
  if (!splashComplete) {
    return <SplashScreen onComplete={() => setSplashComplete(true)} />;
  }

  // ✅ Show content once splash is done and data is loaded
  return (
    <Context.Provider
      value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
      }}
    >
      {/* ✅ Smooth fade-in transition */}
      <div className="transition-opacity duration-700 opacity-100">
        <ToastContainer position="top-center" />
        <Header />
        <main className="min-h-[calc(100vh-120px)] pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </Context.Provider>
  );
}

export default App;
