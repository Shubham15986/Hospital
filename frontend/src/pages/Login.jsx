import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Login')
  const [isDoctor, setIsDoctor] = useState(false)
  const { setToken, token, backendUrl, setRole } = useContext(AppContext)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint = isDoctor ? '/api/doctor' : '/api/auth'
      
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + endpoint + '/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          localStorage.setItem('role', isDoctor ? 'doctor' : 'patient')
          setRole(isDoctor ? 'doctor' : 'patient')
          setToken(data.accessToken)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + endpoint + '/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          localStorage.setItem('role', isDoctor ? 'doctor' : 'patient')
          setRole(isDoctor ? 'doctor' : 'patient')
          setToken(data.accessToken)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false);
    }
  }

  const googleLoginHandler = async () => {
    try {
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      })
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      const endpoint = isDoctor ? '/api/doctor' : '/api/auth'

      const { data } = await axios.post(backendUrl + endpoint + '/google-login', {
        email: user.email,
        name: user.displayName
      })

      if (data.success) {
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('role', isDoctor ? 'doctor' : 'patient')
        setRole(isDoctor ? 'doctor' : 'patient')
        setToken(data.accessToken)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error('Google Login Error:', error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to {isDoctor ? 'manage appointments' : 'book an appointment'}</p>
        
        {
          state === 'Sign Up' && <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" required />
          </div>
        }

        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button disabled={loading} className='bg-primary text-white w-full py-2 rounded-md text-base disabled:bg-gray-400'>
          {loading ? 'Processing...' : state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <button type='button' onClick={googleLoginHandler} className='flex items-center justify-center gap-2 bg-white border border-zinc-300 text-zinc-600 w-full py-2 rounded-md text-base mt-2 hover:bg-gray-50 transition-colors'>
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" className="w-5" alt="Google logo" />
          Google
        </button>

        {
          state === 'Sign Up'
            ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
            : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }

        <div className='w-full flex justify-center mt-2'>
            <p onClick={() => setIsDoctor(!isDoctor)} className='text-primary cursor-pointer underline'>
                {isDoctor ? 'Login as User' : 'Login as Doctor'}
            </p>
        </div>

      </div>
    </form>
  )
}

export default Login