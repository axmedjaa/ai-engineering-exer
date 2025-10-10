"use client"
import { signIn } from '@/lib/auth-client'
import { signin } from '@/server/user'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'

import React from 'react'
import { useForm } from 'react-hook-form'
const SigninPage = () => {
    const{register,handleSubmit}=useForm()
    const router=useRouter()
    const onSumbit=(data:any)=>{
        signin(data.email,data.password)
        .then(res=>router.push('/chat'))
        .catch(err=>console.log(err))
    }
  return (
    <div className='min-h-screen mx-auto bg-gray-200 py-6 px-4 flex justify-center'>
        <div className='w-full h-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <h1 className='text-3xl font-bold mb-2'>Signin</h1>
            <form onSubmit={handleSubmit(onSumbit)} className='flex flex-col gap-2'>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                    <input type="email" placeholder="Email" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    {...register('email',{required:"email is required"})}
                    />
                </div>
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input type="password" placeholder="Password" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    {...register('password',{required:"password is required",minLength:{value:6,message:"password must be at least 6 characters"}}) }
                    />
                </div>
                <button
                onClick={()=>signIn.social({provider:"google"})}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>signin with google</button>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>Signin</button>
                <p className='text-center mt-4'>Don't have an account? <Link href={'/register'} className='text-blue-500'>Register</Link></p>
            </form>
        </div>
    </div>
  )
}

export default SigninPage