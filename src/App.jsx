import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Diet from './pages/Diet';
import BMR from './pages/BMR';
import AIChat from './pages/AIChat';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.25, ease: 'easeInOut' };

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/diet" element={<AnimatedPage><Diet /></AnimatedPage>} />
          <Route path="/bmr" element={<AnimatedPage><BMR /></AnimatedPage>} />
          <Route path="/ai" element={<AnimatedPage><AIChat /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-black text-brand-offwhite flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-brand-black text-brand-offwhite border border-brand-white/10',
            style: { borderRadius: '0.75rem' },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;