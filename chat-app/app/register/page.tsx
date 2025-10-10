"use client"
import { signup } from '@/server/user'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const RegisterPage = () => {
    const{register,handleSubmit}=useForm()
    const router=useRouter()
    const [error,setError]=useState('')
    const onSumbit=(data:any)=>{
        signup(data.email,data.password,data.name)
        .then(res=>router.push('/chat'))
        .catch(err=>setError(err.message))
    }
  return (
    <div className='min-h-screen mx-auto bg-gray-200 py-6 px-4 flex justify-center'>
        <div className='w-full h-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <h1 className='text-3xl font-bold mb-2'>Register</h1>
            <form onSubmit={handleSubmit(onSumbit)} className='flex flex-col gap-2'>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Name</label>
                    <input type="text" placeholder="Name" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    {...register('name',{required:"name is required"})}
                    />
                </div>
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
                {error && <p className='text-red-500'>{error}</p>}
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Register</button>
                <p className='mt-4 text-center'>Already have an account? <Link href={'/signin'} className='text-blue-500'>Signin</Link></p>
            </form>
        </div>
    </div>
  )
}

export default RegisterPage