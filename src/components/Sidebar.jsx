import {Link,useLocation,useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { CiMenuBurger } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

const navItems = [
  {label:'Dashboard',path:'/dashboard'},
  {label:'Stats',path:'/stats'},
  {label:'Log History',path:'/log-history'},
  {label:'Setting',path:'/setting'},
]

const Sidebar = () => {
  const {logout} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open,setOpen] = useState(false)

  const handleLogout = async()=>{
    await logout()
    setOpen(false)
    navigate('/')
  }

  const isActive = (path)=> location.pathname === path
  return (
    <>
    <button
        className="md:hidden fixed top-4 left-4 z-50 text-light-text-primary dark:text-dark-text-primary"
        onClick={() => setOpen(true)}
      >
        <CiMenuBurger/>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-50 bg-light-surface dark:bg-dark-surface
          border-r border-light-border dark:border-dark-border
          transform transition-transform duration-300 ease-in-out justify-evenly flex flex-col
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${!open ? 'pointer-events-none' : 'pointer-events-auto'} 
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex justify-end text-light-text-primary dark:text-dark-text-primary p-4">
          <button onClick={() => setOpen(false)} aria-label="Close sidebar">
            <RxCross1 />
          </button>
        </div>

        {/* App Logo */}
        <div className="text-4xl font-extrabold px-6 py-4 drop-shadow-md text-light-accent dark:text-dark-accent">
          CodeSync
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-4 px-4">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)} // ✅ only on click, avoids infinite re-renders
              className={`px-4 py-2 text-xl rounded-md transition ${
                isActive(path)
                  ? 'bg-light-accent  text-white dark:bg-dark-accent'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-darkbg'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="mt-auto px-4 py-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar