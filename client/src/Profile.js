import React, { useState,useEffect } from 'react';
import { ethers } from "ethers";
import Register from "./utils/Register.json";
import {ContractAddress,profilepic} from './assets';
import FlipMove from "react-flip-move";
import './Profile.css';

function Profile() {
  const [user,setUser]=useState('');
  const [profilename,setProfilename]=useState('');
  const [pic,setPic]=useState('');
  const [wallet,setWallet]=useState('');
  const [active_post,setActive_post]=useState(0);
  const [delete_post,setDelete_post]=useState(0);
  const [total_post,setTotal_post]=useState(0);

  const setProfile=async ()=>{
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
        const profile=await Contract.gettingCredentials();
        setUser(profile.username);
        setPic(profile.pic);
        console.log(profile.pic);
        setProfilename(profile.profilename);
        setWallet(profile.wallet);
        const active_count=await Contract.activeCount();
        setActive_post(Number(active_count));
        const delete_count=await Contract.deleteCount();
        setDelete_post(Number(delete_count));
        const total=Number(active_count)+Number(delete_count);
        setTotal_post(total);
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    setProfile();
  });

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <div className="profile-picture">
          {pic===""?<img src={profilepic}/>:<img src={`https://orange-delicate-lamprey-483.mypinata.cloud/ipfs/${pic}`}/>}
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-row">
          <h2>Profile Name:</h2>
          <h6>{profilename}</h6>
        </div>
        <div className="profile-row">
          <h2>User Name:</h2>
          <h6>{user}</h6>
        </div>
        <div className="profile-row">
          <h2>Wallet Address:</h2>
          <h6>{wallet}</h6>
        </div>
        <div className="profile-row">
          <h2>Active posts:</h2>
          <h6>{active_post}</h6>
        </div>
        <div className="profile-row">
          <h2>Deleted posts:</h2>
          <h6>{delete_post}</h6>
        </div>
        <div className="profile-row">
          <h2>Total posts:</h2>
          <h6>{total_post}</h6>
        </div>
      </div>
    </div>
  )
}

export default Profile

