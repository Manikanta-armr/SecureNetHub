import './App.css';
import {metamaskpic,sepoliaId} from './assets';
import { useState, useEffect } from "react";
import Authenticate from './Authenticate'

function App() {

  const [correctNetwork,setCorrectnetwork]=useState(false);
  const [currAccount,setCurrAccount]=useState(localStorage.getItem('account') || '');


  const connectWallet=async ()=>
    {
      try{
        const {ethereum}=window;
        if(!ethereum){
          console.log('Metamask not connected');
          return;
        }
        let chainId= await ethereum.request({method:'eth_chainId'});
        //console.log('ChainId',chainId);
        if(chainId!==sepoliaId){
          alert('Please Connect to Sepolia Test Net');
          return;
        }
        const accounts=await ethereum.request({method:'eth_requestAccounts'});
        //console.log('Account',accounts[0]);
        //console.log('cuur',currAccount);
        if(currAccount!==accounts[0]){
          console.log(1);
          localStorage.clear();
        }
        setCurrAccount(accounts[0]);
        localStorage.setItem('account',accounts[0]);
      }catch(error){
        console.log('While connecting to Metamask',error);
      }
    }

  const checkCurrentNetwork =async ()=>{
    try{
      const {ethereum}=window;
      let chainId= await ethereum.request({method:'eth_chainId'});
      //console.log('ChainId',chainId);

      if(chainId!==sepoliaId){
        setCorrectnetwork(false);
        alert('Connect to Sepolia Test Network');
      }
      else{
        setCorrectnetwork(true);
      }
    }catch(error){
      console.log('While connecting to Metamask',error);
    }
  }

  useEffect(()=>{
    connectWallet();
    checkCurrentNetwork();
  });
  return(
    <div className='appjs'>
      {currAccount===''? (
        <div class="Connect">
          <img id="image" src={metamaskpic} alt="Metamask pic"/><br/>
          <button id="metamakconnect" onClick={connectWallet}>Connect Metamask</button>
        </div>
      ):correctNetwork?(
        <div>
          <Authenticate/>
        </div>
      ):(
        <div>
          <p>Please Connect to Sepolia Test Network and reload the page</p>
        </div>
      )
      }
    </div>
  );
}

export default App;
