"use client";

import { useState } from "react";

export default function Home() {
  const[email,setEmail]=useState('');
  const handleData=async()=>{
    const res=await fetch('/api/data',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        name:'data/proccess',
        data:{users:['Alice','Bob','Charlie']}
      })
    })
    console.log(res)
    alert('data proccesed successfully')
  }
  const handleEmail=async()=>{
    const res=await fetch('/api/email',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        name:'email/send',
        data:{
          emails:[email]
        }
      })
    })
    alert('emails sent successfully')
  }
  const handleWork=async()=>{
    const res=await fetch('/api/workStart',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        name:'workflow/start',
        data:{
          requestId:'REQ-12345',
          action:'approve',
        }
      })
    })
    alert('workflow started successfully') 
  }
  const handleAprove=async()=>{
    const res=await fetch('/api/workAprove',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
         name: "workflow/approval",
        data: { requestId: 'REQ-12345', approved: true },
      })
    })
    alert('workflow approved successfully') 
  }
  return (
   <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleData}>data procceser</button>
    <div>
      <input type="text" className="border border-gray-300 rounded-md p-2" onChange={(e)=>setEmail(e.target.value)} value={email} />
      <button onClick={handleEmail} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">Send Email</button>
    </div>
    <button onClick={handleWork} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4">Start Approval Workflow</button>
    <button onClick={handleAprove} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4">aprove workflow</button>
   </div>
  );
}
