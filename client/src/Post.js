import './Post.css';
import React, { forwardRef } from "react";
import Avatar from '@mui/material/Avatar';

const Post = forwardRef(({ displayName,username,pic,text,sharepic,file, personal,time,onClick }, ref) => {
  //console.log("Displaying Post:", { displayName, username, text, pic, sharepic, file, personal, time });

  return (
    <div className="post" ref={ref}>
      <div className="post__avatar">
       <Avatar style={{ width: "55px", height: "55px" }}
       src={`https://orange-delicate-lamprey-483.mypinata.cloud/ipfs/${pic}`}/>
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {displayName}
            </h3>
            <h6>{username}</h6>
            <p>{(new Date(Number(time))).toLocaleString()}</p>
          </div>
          <div className="post__headerDescription">
            <p>{text}</p>
          </div>
          <div className='file'>
            {file && file.startsWith('image/') ? (
              <img src={`https://orange-delicate-lamprey-483.mypinata.cloud/ipfs/${sharepic}`} alt="Profile Pic" />
            ) : file && file.startsWith('video/')? (
              <video controls controlsList='nodownload' autoPlay loop>
                <source src={`https://orange-delicate-lamprey-483.mypinata.cloud/ipfs/${sharepic}`} type={file} />
                Your browser does not support the video tag.
              </video>
            ):(<div></div>)} 
          </div>
        </div>
      </div>
    {personal ? <button id="delete" onClick={onClick}>Delete</button>:null}
    </div>
  );
});

export default Post;
