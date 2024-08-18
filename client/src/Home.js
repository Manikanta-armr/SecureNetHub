import './Home.css';
import { useState } from 'react';
import SidebarOptions from './SidebarOptions';
import Profile from './Profile';
import Feed from './Feed';
import Posts from './Posts';
import Chatbot from './Chatbot';
import Users from './Users';
import SecurityIcon from '@mui/icons-material/Security';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TelegramIcon from '@mui/icons-material/Telegram';
import LogoutIcon from '@mui/icons-material/Logout';
import App from './App';
function Home() {
  const [option, setOption] = useState("Home");
  const [exit,setExit]=useState(false);
  
  const logout=()=>{
    localStorage.clear();
    setExit(true);
  }

  return (
    <>
    {!exit?(
    <div className='App'>
      <div className='Sidebar'>
        <div className='WebsiteName'>
          <SecurityIcon className="Icon_App"/>
          <h2>SecureNetHub</h2>
        </div>
        <SidebarOptions onClick={() => setOption("Home")} Icon={HomeIcon} text={"Home"} />
        <SidebarOptions onClick={() => setOption("Posts")} Icon={TelegramIcon} text={"Posts"} />
        <SidebarOptions onClick={() => setOption("Profile")} Icon={PersonIcon} text={"Profile"} />
        <div className='logout' onClick={logout}>
          <LogoutIcon className='logoutIcon'/>
          <h2>Logout</h2>
        </div>
        </div>
      <div className='Feed'>
      {option === "Home" ? (
        <div><Feed/></div>
      ) : option === "Profile" ? (
        <div><Profile/></div>
      ) : (
        <div><Posts/></div>
      )}
      </div>
      <Users/>
      <Chatbot/>
    </div>):(
      <App/>
    )
    }
  </>
  );
}

export default Home;
