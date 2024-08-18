import { useState ,useEffect} from "react";
import Registerion from "./Registerion";
import Signin from "./Signin";
import { ethers } from "ethers";
import Home from "./Home";
import Register from './utils/Register.json';
import {ContractAddress} from './assets';

function Authenticate(){

    const [jump,setJump]=useState(false);
    const [login,setLogin]=useState(localStorage.getItem("Login") || false);

    const checking= async ()=>{
        try{
        const { ethereum } = window;
        if(ethereum){
            const provider = new ethers.BrowserProvider(ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer =await provider.getSigner();
            const Contract = new ethers.Contract(
            ContractAddress,
            Register.abi,
            signer
            );
            const tx=await Contract.isRegister();
            //console.log(tx);
            if(tx===false){
                setJump(false);
            }
            else{
                setJump(true);
            }
        }
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        checking();
        const session=localStorage.getItem("Time");
        //console.log(session);
        if(new Date().getTime()-session>=600000){
            localStorage.clear();
        }
      }, []);

    return(
        <div>
            {login?(
                <div><Home/></div>
            ):jump?(
                <Signin/>
            ):(
                <Registerion/>
            )}
        </div>
    )
}

export default Authenticate;