import React, { useState } from 'react'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = (event) => {
    event.preventDefault();

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        {
          state === 'Sign Up' ?
            <>
              <p className='text-2xl font-semibold'>Create Account</p>
              <p>Please sign up to book an appointment</p>

              <div className='w-full '>
                <p>Full Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" required />
              </div>


              <div className='w-full '>
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required />
              </div>
              <div className='w-full '>
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" required />
              </div>
              <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Create Account</button>

              <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>

            </>
            :
            <>
              <p className='text-2xl font-semibold'>Login</p>
              <p>Please log in to book an appointment</p>




              <div className='w-full '>
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required />
              </div>
              <div className='w-full '>
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" required />
              </div>
              <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>

              <p>Create an new account ?<span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>

            </>


        }

      </div>
    </form>
  )
}

export default Login