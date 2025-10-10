"use client"
import { signOut } from "@/lib/auth-client"

const Logout = () => {
  const handleOut=async()=>{
    await signOut()
    document.location.reload()
  }
  return (
     <button onClick={handleOut} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
            logout
        </button>
  )
}

export default Logout