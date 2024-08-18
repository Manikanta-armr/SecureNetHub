import { useState } from 'react';
import './Registerion.css';
import { ethers } from "ethers";
import axios from 'axios';
import Home from './Home';
import Register from "./utils/Register.json";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {pinataApiKey,pinataSecretApiKey,ContractAddress} from './assets';

function Registration(){
    const [valid,setValid]=useState(false);
    const [pname,setPname]=useState('');
    const [uname,setUname]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [file,setFile]=useState('');
    const [errors,setErrors]=useState({});
    const [visiblePassword,setVisiblePassword]=useState(false);
    const [visibleConfirm,setVisibleConfirm]=useState(false);

    const handlepic=(e)=>{
      setFile(e.target.files[0]);
    }

    const isPasswordSecure = (password) => {
      const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      return re.test(password);
    }

    const validate=()=>{
      const errors={};
      if(!pname){
        errors.pname="Profile Name cannot be empty";
      }
      if(!uname){
        errors.uname="User Name cannot be empty";
      }
      if(!password){
        errors.password="Password cannot be empty";
      }else if(!isPasswordSecure(password)){
        errors.password="Password must have at least 8 characters that includes at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character";
      }
      if(!confirmPassword){
        errors.confirmPassword="Please enter the password again";
      }else if(password!==confirmPassword){
        errors.confirmPassword="Password doesn't match";
      }
      setErrors(errors);
      return Object.keys(errors).length===0;
    }

    const handleUploadFile= async () =>{
      try{
        const data=new FormData();
        data.append('file',file);
        const bridge=await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS',data,{
          headers:{
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey,
            'Content-Type': 'multipart/form-data'
          },
        });
        const ipfsHash = bridge.data.IpfsHash;
        //console.log(ipfsHash);
        return ipfsHash;
      }catch(error){
        console.log(error);
      }
    }

    const registerProfile=async ()=>{
      if (!validate()) return;
      try{
        let ipfsHash="";
        if(file!==""){
          ipfsHash=await handleUploadFile();
        }
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
          await Contract.addProfile(pname, uname,password, ipfsHash);
          setValid(true);
          localStorage.setItem("Login",true);//Changing
          localStorage.setItem("Time",new Date().getTime());//Changing
        }
      }catch(error){
        console.log(error);
      }
    }

    const togglePassword=()=>{
      setVisiblePassword(!visiblePassword);
    }

    const toggleConfirm=()=>{
      setVisibleConfirm(!visibleConfirm);
    }
    
    return(
      <div className='register'>
        {!valid?
        (<div class="Form">
          <h1 id="regist">Create Account</h1>
          <div>
            <input id="prof" type="text" placeholder="Profile Name" autoComplete="off" value={pname} onChange={(e) => setPname(e.target.value)} /><br />
            {errors.pname && <small>{errors.pname}</small>}
          </div>
          <div>
            <input id="user" type="text" placeholder="User Name" autoComplete="off" value={uname} onChange={(e) => setUname(e.target.value)}/><br />
            {errors.uname && <small>{errors.uname}</small>}
          </div>
          <div>
            <input id="pass" type={visiblePassword?"text":"password"} placeholder="Password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)}/>
            {visiblePassword?<VisibilityIcon className='password-icon' onClick={togglePassword}/>:<VisibilityOffIcon className='password-icon' onClick={togglePassword}/>}<br />
            {errors.password && <small>{errors.password}</small>}
          </div>
          <div>
            <input id="pass" type={visibleConfirm?"text":"password"} placeholder="Confirm Password" autoComplete="off" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            {visibleConfirm?<VisibilityIcon className='password-icon' onClick={toggleConfirm}/>:<VisibilityOffIcon className='password-icon' onClick={toggleConfirm}/>}<br />
            {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
          </div>
          <input id="file" type="file" onChange={handlepic}/>
          <button id="submit" onClick={registerProfile}>Register</button>
        </div>):(
          <div><Home/></div>

      )}
      </div>
    )
}

export default Registration;