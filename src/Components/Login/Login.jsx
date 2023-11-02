import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
export default function Login({saveUserData}) {
    let [user,setUser]=useState({
        email:'',
        password:'',
    });
    let navigate=useNavigate();
    let [errorList,setErrorList]=useState([]);
    let [error,setError]=useState('');
    let [IsLoading,setIsLoading]=useState(false)
    let [alerm,setAlarm]=useState('')
    function getUserData(eventInfo){
        let myUser={...user};
        myUser[eventInfo.target.name]=eventInfo.target.value;
        setUser(myUser);
    
    }
    async function sendApiToServer(){
        let {data}=await axios.post('https://apiauth-670p.onrender.com/api/login',user) ;
        if(data.message=='success'){
            setIsLoading(false);
            localStorage.setItem("userToken",data.data.token);
            saveUserData();
            navigate('/')
        }else{
            setIsLoading(false)
            setError(data.message)
        }
  }
  function ValidateLoginForm(){
    let schema=Joi.object({
      email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password:Joi.string().required(),
    })
    return schema.validate(user,{abortEarly: false});
  }
  function submitData(e){
    e.preventDefault();
    setIsLoading(true)
    let resValidation=ValidateLoginForm();
    if(resValidation.error){
        setIsLoading(false)
        setErrorList(resValidation.error.details)
    }else{
        sendApiToServer();
    }
    
  }
  function handleCallBackResponse(response){
    if(response.credential){
        localStorage.setItem("userToken",response.credential)
        saveUserData();
        navigate('/')
    }
  }

  useEffect(()=>{
    // google.accounts.id.initialize({
    //   client_id:"768822304568-41ac6h6pgcprkmalt3b1am62hr8n3qcm.apps.googleusercontent.com",
    //   callback:handleCallBackResponse
    // })
    // google.accounts.id.renderButton(
    //   document.getElementById('signInDiv'),
    //   {theme:"outline", size:"large",}
    // )
    // google.accounts.id.prompt()
  },[])
    return (
        <div className='m-auto LoginAndSignUpStyle my-5  p-3 rounded-3' id="display" >
            <h2 className='text-center w-100 text-info  fw-bold'>Login</h2>
            {errorList.map((err,index)=>{
          if(err.context.label='password'){
              return <div key={index} className='alert alert-danger'>password Invalid</div>
          }else{
              return <div key={index} className='alert alert-danger'>{err.message}</div>}})}
              {error.length>0? <div className='alert alert-danger'>{error}</div>:''}
              <form className='my-2' onSubmit={submitData} autoComplete="off">
                  <label htmlFor='email'>email :</label>
                  <input onChange={getUserData} autoComplete="new-password"   type="text" name="email" id="email" className='form-control my-input mb-3 ' placeholder='Enter Email ....'/>
                  <label htmlFor='password'>password :</label>
                  <input onChange={getUserData} autoComplete="new-password"   type="password" name="password" id="password" className='form-control my-input mb-3' placeholder='Enter Your Password ....'/>
                  <button type="submit" className="btn btn-info">{IsLoading==true?<i className='fas fa-spinner fa-spin'></i>:"Login"}</button>
              </form>
            <div className='w-100'>
                <div className='d-flex justify-content-center align-items-center' id="display">
                    <div id='signInDiv' className=' my-3 px-5' ></div>
                </div>
            </div>
        
              <div className='w-100 text-center'>
                    <p className='m-auto'>Create An Account? <Link to="/register" className='fw-bolder'>Register</Link>  </p>
              </div>
        
        </div>
        
    )
}
