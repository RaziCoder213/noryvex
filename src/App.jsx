import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import LiveDemo from './pages/LiveDemo';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [toasts, setToasts] = useState([]);

  // URL routing handler
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      
      if (path === '/admin' || hash === 'admin') {
        setActivePage('admin');
      } else if (['solutions', 'live-demo', 'about', 'contact', 'home'].includes(hash)) {
        setActivePage(hash);
      } else {
        // Fallback for default
        setActivePage('home');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    
    // Run initially
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Helper to change page and push history state if necessary
  const changePage = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Notification System
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Render active page
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={changePage} />;
      case 'solutions':
        return <Solutions setActivePage={changePage} />;
      case 'live-demo':
        return <LiveDemo />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact addToast={addToast} />;
      case 'admin':
        return <Admin addToast={addToast} />;
      default:
        return <Home setActivePage={changePage} />;
    }
  };

  return (
    <>
      <Navbar activePage={activePage} setActivePage={changePage} />
      
      <main style={{ flexGrow: 1, paddingBottom: '60px' }}>
        {renderPage()}
      </main>

      <Footer setActivePage={changePage} />

      {/* Toast Alert Portal */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="toast"
            style={{
              borderLeftColor: toast.type === 'error' ? '#ef4444' : '#C7FF3D'
            }}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        main {
          margin-top: 80px; /* offset for the fixed navbar */
        }
      `}</style>
    </>
  );
}
