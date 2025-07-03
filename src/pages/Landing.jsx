import { Link } from 'react-router-dom'
import {motion} from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import computer from "../assets/computer.png"
import { useEffect } from 'react'
const Landing = () => {
  const navigate = useNavigate()
  const {user} = useAuth()
  useEffect(() => {
  if(user) navigate('/dashboard')
}, [user,navigate])
  return (
    <motion.main 
    initial={{ scale: 0 }} animate={{ scale: 1 , transition: { duration: 0.2 }}} 
    className=' min-h-screen bg-light-bg dark:bg-darkbg text-light-text-primary dark:text-dark-text-primary flex flex-col items-center justify-around px-4'>
      <section className="text-center mt-5 w-full max-w-4xl md:flex md:flex-row-reverse">
        
        <div className='flex flex-col md:items-start justify-center'>

        <h1 className="text-4xl text-shadow-2xs text-light-accent dark:text-dark-accent md:text-6xl font-bold mb-4 transition-all duration-150 ">
          CodeSync
        </h1>
        <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-6 text-light-text-secondary dark:text-dark-text-secondary md:text-start">
          Your personal dashboard to sync and visualize your entire coding journey.
        </p>
        <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        >
        <Link
         to="/dashboard"
         className="inline-block px-6 py-3 rounded-xl font-semibold bg-light-accent dark:bg-dark-accent text-white hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent transition duration-300 text-sm sm:text-base"
         >
        Get Started
        </Link>
</motion.div>
          </div>
          <img src={computer} className=' h-[300px] w-[500px] drop-shadow-md hover:drop-shadow-light-hover-accent dark:hover:drop-shadow-dark-hover-accent dark:drop-shadow-dark-accent  drop-shadow-light-accent' alt="" />
      </section>
      <section className=" flex flex-col gap-3 mt-5 mb-10 md:m-0 w-full max-w-6xl px-2 sm:px-4">
        <h1 className='text-light-accent dark:text-dark-accent text-4xl font-extrabold text-shadow-2xs'>Key features</h1>
        <p className='text-light-text-secondary dark:text-dark-text-secondary'>CodeSync offers a range of features designed to help you stay motivated and track your coding journey effectively.</p>
        <div className='grid md:grid-rows-1 md:grid-cols-3 grid-cols-1 gap-4'>
        {
          [
          {
            title: 'Track Your DSA Progress',
            desc: 'Connect with LeetCode, GFG, and others to visualize your daily problem-solving streaks.',
          },
          {
            title: 'GitHub Insights',
            desc: 'Monitor commits, repositories, and contributions in real time.',
          },
          {
            title: 'Custom Goals & Logs',
            desc: 'Plan milestones, log progress, and stay accountable.',
          },
        ].map((feat,idx)=>(
          <div key={idx}
          className="rounded-xl hover:shadow-light-hover-accent dark:hover:shadow-dark-hover-accent p-5 sm:p-6 shadow-md bg-light-surface  dark:bg-dark-surface border border-light-border dark:border-dark-border transition duration-300"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary">{feat.desc}</p>
          </div>
        ))
        }
        </div>
      </section>
      <footer className="mb-10 text-center px-4">
        <h2 className=' text-light-accent dark:text-dark-accent font-extrabold text-lg'>Ready to Sync your code journey?</h2>
        <p className="mb-4 text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary">Sign up for CodeSync today and start tracking your coding progress across platforms</p>
        <motion.div
                whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
        >
        <Link
                  to="/dashboard"
          className="px-5 py-3 text-sm sm:text-base text-white rounded-xl font-medium bg-light-accent dark:bg-dark-accent hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent transition duration-300"
        >
        Launch Dashboard
        </Link>
        </motion.div>
      </footer>
    </motion.main>
  )
}

export default Landing