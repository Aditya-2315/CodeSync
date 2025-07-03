import {motion} from 'motion/react'
import { useAuth} from '../context/AuthContext'
import { useNavigate} from 'react-router-dom'
import { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form'
import google from '../assets/google.png'
import github from '../assets/github.png'
import { IoIosArrowBack } from "react-icons/io";
function SignUp() {
  const {signup,loginWithGitHub,loginWithGoogle,user,login} = useAuth()
  const [error,setError] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(false);
  const navigate = useNavigate()
  const  {register,handleSubmit,formState:{errors}} = useForm()

  useEffect(() => {
  if (user) {
    navigate('/dashboard');
  }
}, [user, navigate]);
  const onSubmit = async({email,password,name})=>{
    setError('')
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email,password,name)
      }
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    }

  }

  const handleProviderLogin = async(providerFn)=>{
    setError('')
    try {
      await providerFn()
      navigate('/dashboard')
    } catch (error) {
      console.error('OAuth login error:', error)
      setError(error.message)
    }
  }

  return (
    <motion.div
    initial={{ scale: 0 }} animate={{ scale: 1 , transition: { duration: 0.2 }}} 
    className='min-h-screen transition-colors duration-300 flex justify-center items-center px-4 bg-light-bg dark:bg-darkbg'
    >
      <button 
      onClick={()=> navigate('/')}
      className='fixed top-5 left-5 text-light-text-primary cursor-pointer dark:text-dark-text-primary'>
        <IoIosArrowBack />
      </button>
      <div className='w-full border border-light-border bg-light-surface dark:bg-dark-surface dark:border-dark-border md:max-w-md max-w-sm rounded-xl items-center py-5 flex flex-col justify-center shadow-xs hover:shadow-md transition-shadow duration-300 shadow-light-accent dark:shadow-dark-accent'>
      <h1 className=' mb-5 text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
        {isLoginMode ? 'Log in to Code Sync' : 'Sign Up for Code Sync'}
      </h1>
      {error && <p className="text-light-error dark:text-dark-error text-sm mb-4 text-center">{error}</p>}
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <div>
          <label className='block mb-1 text-md text-light-text-primary dark:text-dark-text-primary font-semibold'>Name</label>
          <input 
          type="text"
          className=' border rounded-lg w-full px-3 py-1 text-light-text-secondary dark:text-dark-text-secondary border-light-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary dark:border-dark-text-primary'
          {...register('name',{required:'Enter your name'})}
          placeholder='Enter your name'
          />
          <label className='block mb-1 text-md text-light-text-primary dark:text-dark-text-primary font-semibold'>Email</label>
          <input type="email"
          className=' border rounded-lg w-full px-3 py-1 text-light-text-secondary dark:text-dark-text-secondary border-light-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary dark:border-dark-text-primary'
          placeholder='Enter your email here'
          {...register('email',{required:'Email is required'})}
          />
           {errors.email && <p className="text-light-error dark:text-dark-error text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className='block mb-1 text-md  text-light-text-primary border-light-text-primary dark:text-dark-text-primary font-semibold'>Password</label>
          <input type="password"
          className=' border rounded-lg w-full text-light-text-secondary dark:text-dark-text-secondary px-3 py-1 placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary mb-2 dark:border-dark-text-primary'
          placeholder='Enter password here'
          {...register('password',{required:'password is required',minLength: { value: 6, message: 'Min 6 characters' }})}
          />
           {errors.email && <p className="text-light-error dark:text-dark-error text-xs mt-1">{errors.email.message}</p>}
        </div>
           <button type='submit' className='bg-light-accent self-center w-full my-2 dark:bg-dark-accent text-light-text-primary dark:text-dark-text-primary rounded-md hover:bg-light-hover-accent dark:hover:bg-dark-hover-accent px-2 py-1 border border-light-border dark:border-dark-border' >
              {isLoginMode ? 'Log In' : 'Sign Up'}
           </button>
    </form>
    <div className='mt-3'>
      <div className='flex flex-col gap-2'>
        <button
        onClick={()=> handleProviderLogin(loginWithGoogle)}
        className='flex items-center gap-2 text-light-text-primary cursor-pointer dark:text-dark-text-secondary  bg-light-bg border py-2 px-3 rounded-lg border-light-border dark:bg-dark-surface dark:border-dark-border'>
          <img src={google} className='h-[32px]' alt="" />
          Continue with Google</button>
        <button 
        onClick={()=> handleProviderLogin(loginWithGitHub)}
        className='flex items-center gap-2 text-light-text-primary hover:bg-light-surface dark:hover:bg-dark-surface cursor-pointer dark:text-dark-text-secondary py-2 px-3 border border-light-border rounded-lg dark:border-dark-border dark:bg-dark-surface'>
          <img src={github} className=' h-[32px] ' alt="" />Continue with Github</button>
      </div>
    </div>
    <p className="text-sm mt-4 text-light-text-primary dark:text-dark-text-primary">
      {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
      <button
        className="text-dark-accent cursor-pointer dark:text-light-accent underline ml-1"
        onClick={() => setIsLoginMode((prev) => !prev)}
      >
        {isLoginMode ? 'Sign up' : 'Log in'}
      </button>
    </p>
</div>
    </motion.div>
  )
}

export default SignUp
