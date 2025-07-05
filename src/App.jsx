import {useAuth} from './context/AuthContext'
import ThemeToggle from './components/ThemeToggle'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'
import './App.css'
import {easeInOut, motion} from 'motion/react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  const { user } = useAuth();
  return (
    <div className="relative text-text dark:bg-darkbg transition-colors duration-300">
      {/* Sidebar (visible only if logged in) */}
      {user && <Sidebar />}

      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="fixed bottom-5 right-5">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <motion.main
        className={`min-h-screen overflow-y-auto px-4 bg-light-bg dark:bg-darkbg transition-all duration-300 ${
          user ? "md:ml-64" : ""
        }`}>
        <Outlet />
      </motion.main>
    </div>
  );
}

export default App
