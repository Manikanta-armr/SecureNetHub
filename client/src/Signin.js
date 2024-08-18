import './Signin.css';
import { ethers } from "ethers";
import Register from "./utils/Register.json";
import Home from './Home';
import {ContractAddress} from './assets';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Signin(){
    const [valid,setValid]=useState(false);
    const [uname,setUname]=useState('');
    const [password,setPassword]=useState('');
    const [errors,setErrors]=useState({});
    const [visiblePassword,setVisiblePassword]=useState(false);
    
    const checkCredential=async ()=>{
      const errors={};
        try{
            const { ethereum } = window;
            if(ethereum){
              const provider = new ethers.BrowserProvider(ethereum);
              await provider.send("eth_requestAccounts", []);
              const signer = await provider.getSigner();
              const Contract = new ethers.Contract(
                ContractAddress,
                Register.abi,
                signer
              );
              const profile=await Contract.gettingCredentials();
              //console.log(profile.username,profile.password);
              //console.log(localStorage.getItem('account'));
              if(profile.username===uname && profile.password===password){
                setValid(true);
                localStorage.setItem("Login",true);//Changing
                localStorage.setItem("Time",new Date().getTime());//Changing
              }
              else{
                setValid(false);
                errors.fail="Invalid username or password";
                errors.try="Please try again";
                setErrors(errors);
                //console.log(errors.fail);
              }
            }
          }catch(error){
            console.log(error);
          }
    }

    const togglePassword=()=>{
      setVisiblePassword(!visiblePassword);
    }

    return(
        <div className='login'>
            {!valid ?(
                <div class="Form">
                <h1 id="signin">Login</h1>
                <div>
                  <input id="user" type="text" placeholder="User Name" autoComplete="off" value={uname} onChange={(e) => setUname(e.target.value)}/><br />
                </div>
                <div>
                  <input id="pass" type={visiblePassword?"text":"password"} placeholder="Password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  {visiblePassword?<VisibilityIcon className='password-icon' onClick={togglePassword}/>:<VisibilityOffIcon className='password-icon' onClick={togglePassword}/>}<br />
                </div>
                {errors.fail && <small>{errors.fail}</small>}<br/>
                <button id="login" onClick={checkCredential}>Login</button>
            </div>
            ):(
                <div><Home/></div>
            )
            }
        </div>
    )
}

export default Signin;