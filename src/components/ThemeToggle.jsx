import React, { useState } from 'react'
import { FaMoon } from "react-icons/fa";
import { HiSun } from 'react-icons/hi2';
import { useDarkMode } from '../context/ThemeContext';

const ThemeToggle = () => {
    const {darkMode,setDarkMode} = useDarkMode()
  return (
    <button onClick={()=>setDarkMode(!darkMode)} className='p-2 cursor-pointer rounded-lg border transition-colors duration- bg-light-accent dark:bg-dark-accent dark:text-dark-text-primary text-light-text-primary hover:bg-dark-hover-accent dark:hover:bg-light-hover-accent '>
        {darkMode ?(<FaMoon/>):(<HiSun/>)}
    </button>
  )
}

export default ThemeToggle