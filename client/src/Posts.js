import React, { useState,useEffect } from 'react';
import './Feed.css';
import {ContractAddress} from './assets';
import Register from './utils/Register.json';
import FlipMove from "react-flip-move";
import { ethers } from "ethers";
import Post from './Post';

function Posts() {
  const [posts,setPosts]=useState([]);
  const [wallet,setWallet]=useState('');

  const getAllTweets =async()=>{
    try{
      const {ethereum}=window;
      if(ethereum){
        const provider = new ethers.BrowserProvider(ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer =await provider.getSigner();
        const Contract = new ethers.Contract(
        ContractAddress,
        Register.abi,
        signer
        ); 
      
      const allTweets=await Contract.getMyTweets();
      //console.log("Fetched Tweets:",allTweets);
      setWallet(ethereum.selectedAddress);
      setPosts(allTweets);
      //console.log("posts",posts);
      }
      else{
        console.log("Ethereum object doesn't exist");
      }
    }catch(error){
      console.log(error);
    }
  }

  const deleteTweet = (key) => async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer =await provider.getSigner();
        const Contract = new ethers.Contract(
        ContractAddress,
        Register.abi,
        signer
        );

        const tx = await Contract.deleteTweet(key, true);
        await tx.wait(); // Ensure the transaction completes

        // Re-fetch tweets to update state after deletion
        await getAllTweets();
      } else {
        console.error("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  useEffect(() => {
    getAllTweets();
  }, []);

  return (
    <div className="feed">
    <h3>My Posts</h3>
      <FlipMove>
        {posts.map((post) => (
          <Post
            key={post.id}
            displayName={post.profilename}
            username={'@'+post.username}
            pic={post.pic}
            text={post.tweetText}
            sharepic={post.ipfshash}
            file={post.filetype}
            time={post.timestamp}
            personal={post.wallet_address.toLowerCase()===wallet.toLowerCase()}
            onClick={deleteTweet(post.id)}
          />
        ))}
      </FlipMove>
    </div>
  );

}

export default Posts;