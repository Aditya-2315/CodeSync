import {useAuth} from './context/AuthContext'
import ThemeToggle from './components/ThemeToggle'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'
import './App.css'
import {easeInOut, motion} from 'motion/react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStreakUpdater from './hooks/useStreakUpdater';



function App() {
  const { user } = useAuth();
  useStreakUpdater()
  return (
    <div className="relative text-text dark:bg-darkbg transition-colors duration-300">
      <div className="md:flex">
        {user && 
            <Sidebar />
         }

        <motion.main
          className={`h-screen overflow-y-auto px-4 bg-light-bg dark:bg-darkbg flex-1 ${user ? "md:ml-0" : "w-screen"}`}>
          <Outlet />
        </motion.main>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="fixed bottom-5 right-5">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default App
