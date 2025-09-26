"use client"
import React, { useState } from 'react'
const UerPage = () => {
    const [user,setUser]=useState({
        name:'',
        email:'',
        age:0,
        favorite_genre:''
    })
    const handleChage=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const{name,value}=e.target
       setUser(prev=>({...prev,[name]:value}))
    }
    const handleUser=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
            const res=await fetch('/api/user',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(user)
            })
            const data=await res.json()
            alert("user added")
            setUser({
                name:'',
                email:'',
                age:0,
                favorite_genre:''
            })
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="max-w-md mx-auto ">
        <h1>inter user info</h1>
        <form onSubmit={handleUser} className='flex flex-col gap-2 bg-gray-300'>
            <input name='name' type="text" placeholder='name' value={user.name} onChange={handleChage}/>
            <input name='email' type="text" placeholder='email' value={user.email} onChange={handleChage}/>
            <input name='age' type="number" placeholder='age' value={user.age} onChange={handleChage}/>
            <input name='favorite_genre' type="text" placeholder='favorite genre' value={user.favorite_genre} onChange={handleChage} />
            <button type='submit'>submit</button>
        </form>
    </div>
  )
}

export default UerPage