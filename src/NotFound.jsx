import React from 'react'
import { useNavigate } from "react-router-dom";

const NotFound = () => {
      const navigate = useNavigate();
  return (

<div className="bg-[#003ec7] min-h-screen w-full flex flex-col justify-center items-center text-center">
  <h1 className="text-white text-9xl font-bold">
    4<span className="text-[#ffc31a]">0</span>4 
  </h1> 
  <h1 className="text-white text-5xl font-bold">Page Not Found</h1>
  <h1 className="text-[#bedbff] text-2xl font-bold mt-2">The Page you are looking for does not exist 
    or has been <br />moved</h1>
    <button onClick={() => navigate("/")} className='bg-[#ffc31a] p-5 mt-4 rounded-xl text-white font-bolder 
    text-xl'>Back to Home</button>
</div>



  )
}

export default NotFound