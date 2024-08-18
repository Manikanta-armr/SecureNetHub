import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import {ContractAddress} from './assets';
import Register from './utils/Register.json';
import { ethers } from "ethers";


function Users() {
  const [profiles,setProfiles]=useState([]);

  const getAllProfiles =async()=>{
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
      
      const allProfile=await Contract.getAllProfiles();
      //console.log("Fetched Profiles:",allProfile);
      setProfiles(allProfile);
      }
      else{
        console.log("Ethereum object doesn't exist");
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    getAllProfiles();
  }, []);

  return (
    <div>
        <h3 style={{margin:'10px'}}>Users</h3>
        <List>
        {profiles.map((user)=>(
            <ListItem>
            <ListItemAvatar>
            <Avatar src={`https://ipfs.io/ipfs/${user.pic}`}/>
            </ListItemAvatar>
            <ListItemText primary={user.profilename} secondary={'@'+user.username} />
        </ListItem>
        ))}
        </List>
    </div>
  );
}

export default Users;