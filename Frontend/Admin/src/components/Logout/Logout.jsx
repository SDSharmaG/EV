import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Logout.css'

const Logout = () => {
    const [message , setMessage] = useState('')
    const navigate = useNavigate()

    const handlelogout = async(e) =>{
        e.preventDefault();
        try{
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/Logout', {
                method : 'POST',
                credentials: 'include',
                // headers : {
                //     'Content-type' : 'application/json'
                // },
                // body: JSON.stringify({})
            })
            const data = await response.json()
            if(response.ok){
                setMessage("Logout Successfully")
                navigate('/')
            }else{
                setMessage(data.err || "Logout Failed")
            }
        }catch(err){
            console.error(err);
            setMessage("Server Error.. Try again later")
        }
        }
  return (
    <div>
      {message && <div className="alert alert-success">{message}</div>}
      <button onClick={handlelogout} className='btn btn-danger'id='Profilebtn'>Logout</button>
    </div>
  )
}

export default Logout
