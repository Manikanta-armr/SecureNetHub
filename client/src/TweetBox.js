import React, { useState,useEffect } from 'react';
import './TweetBox.css';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/base';
import { ethers } from "ethers";
import axios from 'axios';
import Register from "./utils/Register.json";
import {pinataApiKey,pinataSecretApiKey,ContractAddress} from './assets';

function TweetBox() {
  const [tweetMessage,setTweetMessage]=useState("");
  const [file,setFile]=useState('');
  const [user,setUser]=useState('');
  const [profilename,setProfilename]=useState('');
  const [ipfspic,setIpfspic]=useState('');

  const handlepic=(e)=>{
    setFile(e.target.files[0]);
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

  const addTweet = async()=>{
    try{
      const { ethereum } = window;

      if (!ethereum) {
        console.error("Ethereum object doesn't exist!");
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer =await provider.getSigner();
        const Contract = new ethers.Contract(
        ContractAddress,
        Register.abi,
        signer
        );

      const tweetText = tweetMessage.trim();

      let ipfsHash="";
      let filetype="";
      if(file!==""){
        ipfsHash=await handleUploadFile();
        filetype=file.type;
      }

      if (tweetText.length === 0 && file==="") {
        console.warn("Tweet message and File input both cannot be empty!");
        alert("Tweet message and File input both cannot be empty!");
        return;
      }

      const tx = await Contract.addTweet(tweetText, ipfsHash, filetype, new Date().getTime(), false);
      console.log("Tweet transaction:", tx);

      // Clear input fields upon successful submission
      setTweetMessage("");
    } catch (error) {
      console.error("Error submitting new Tweet:", error);
    }
  };

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
        setIpfspic(profile.pic);
        setProfilename(profile.profilename);
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    setProfile();
  }, []);

  const sendTweet = (e) => {
    e.preventDefault();
    addTweet();
  }
  
  return (
    <div className="tweetBox">
      <form onSubmit={sendTweet}>
        <div className="tweetBox__input">
        <Avatar style={{ width: "90px", height: "90px" }}
        src={`https://ipfs.io/ipfs/${ipfspic}`}/>
        <div className='profile'>
          <h3>{profilename}</h3>
          <h6>{'@'+user}</h6>
        </div>
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="Typing..."
            type="text"
          />
        </div>
        <input type="file" onChange={handlepic}/>
        <Button type="submit" className="tweetBox__tweetButton">
          Post
        </Button>
      </form>
    </div>
  )
}

export default TweetBox;