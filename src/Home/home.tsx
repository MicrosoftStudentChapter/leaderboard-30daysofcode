import { Typography, TextField, Box, AppBar, Grid, Button, Tooltip} from '@mui/material';
import { Link } from "react-scroll";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Detail from './Detail';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { collection, addDoc,getFirestore, query, where, getDocs } from "firebase/firestore";
import app from "../backend";
import DayCount,{date} from './DayCount';
import axios from 'axios';
import logo from '../Assets/MLSC logo.png';
const db = getFirestore(app);
export default function Home(){
    const navigate = useNavigate();

    const [idError, setIdError] = useState(0); // 0 - no error, 1 - already exists error, 2 - invalid id error, 3 - some error occured, 4 - already disqualified, 5 - empty
    const [repoError, setRepoError] = useState(0); // 0 - no error, 1 - already exists error, 2 - invalid repo error, 3 - some error occured, 4 - repo should be created today, 5 - empty
    const [emailError, setEmailError] = useState(0); // 0 - no error, 2 - invalid email, 3 - some error occured, 5 - empty

    const [user, setUser] = useState({
        id: "",
        repo: "",
        email: ""
    });

    const getUserData = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };
    
    function isValidEmail(email:string) {
      return /\S+@\S+\.\S+/.test(email);
    }
    async function postData (){
      setIdError(0);
      setRepoError(0);
      setEmailError(0);

        if(user.id==="" || user.repo==="" || user.email===""){
          if(user.id===""){
            setIdError(5);
          }
          if(user.repo===""){
            setRepoError(5);
          }
          if(user.email===""){
            setEmailError(5);
          }
          return;
        }

        if(!isValidEmail(user.email)){
          setEmailError(2);
          return;
        }
        
      const response = await fetch(`https://api.github.com/users/${user.id}`);
      if (response.status === 200) {
        // User exists
        setIdError(0);
      } else if (response.status === 404) {
        // User does not exist
        setIdError(2);
        return 2;
      } else {
        // Handle other status codes
        setRepoError(3);
        return 3;
      }

      const response1 = await fetch(`https://api.github.com/repos/${user.id}/${user.repo}`);
      if (response1.status === 200) {
        // Repo exists
        setRepoError(0);
      } else if (response1.status === 404) {
        // Repo does not exist
        setRepoError(2);
        return 2;
      } else {
        // Handle other status codes
        setRepoError(3);
        return 3;
      }

      const response2 = await axios.get(`https://api.github.com/repos/${user.id}/${user.repo}`);
      const data = response2.data;
      const created_at = new Date(data.created_at);
      const today = new Date(date);
      if (created_at.toDateString() !== today.toDateString()) {
        // Repo should be created today
        setRepoError(4);
        return 4;
      } else {
        // Repo created today
        setRepoError(0);
      }
        
        try {const q = query(collection(db, "users"), where("id", "==", user.id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const disq=await querySnapshot.docs[0].get('disqualified');
          if(disq){
            setIdError(4);
            return 4;
          }
          setIdError(1);
        }
        const q1 = query(collection(db, "users"), where("repo", "==", user.repo));
        const querySnapshot1 = await getDocs(q1);
        if (!querySnapshot1.empty) {
          setRepoError(1);
        }
        
        if(!querySnapshot.empty || !querySnapshot1.empty){
          return 1;
        }
      } catch (e) {return 3;}
        navigate("/leaderboard");
        try {
            addDoc(collection(db, "users"), {
                id: user.id,
                repo: user.repo,
                email: user.email,
                strike: 0,
                disqualified: false,
                lastStrikeSha:'',//sha of the last strike commit
                rank:0,
                totalCommits:0,
                issAndPrs:0,
                avgCommits:0,
                score:0,
            });
            
            const currentTime = new Date();
            const timeDiff = currentTime.getTime() - 35 * 60 * 1000;
            const date = new Date(timeDiff);
            localStorage.setItem("lastFetchTimestamp", date.toISOString());
            return 0;
          } catch (e) {
            console.error("Error adding document: ", e);
            setRepoError(3);
            return 3;
          }
        
    }

    const datte = new Date(date);
  return <div className="page">
    <div style={{height:'100vh'}}>
    <AppBar position="static" color="transparent" elevation={0}>
      
      <Grid justifyContent="space-between">
      <Typography noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: "flex" } }}>
          <img src={logo} style={{ height: 80, }} />
          <DayCount />
        </Typography>
      </Grid>

    </AppBar>
    <Box textAlign="center" ><Typography variant="h2" >Welcome to 30 Days of Code🔥</Typography><br />
    <div style={{display:'flex',gap:'5px',justifyContent:'center', marginTop:'0.5%'}}>
      <Button variant="contained" onClick={()=>navigate("/leaderboard")}>Leader Board</Button>
      <Button variant="contained" onClick={()=>navigate("/disqualified")}>Disqualified</Button>
    </div><br />
      <Typography>Enter your GitHub ID
        <Tooltip placement='right' title='For eg. - If your profile link is www.github.com/githubID/, Then your GitHub ID will be "githubID" part in the link.'>
          <InfoOutlinedIcon fontSize='small' style={{marginBottom:'-4px',marginLeft:'4px', opacity:'0.6'}}/>
        </Tooltip>
      </Typography>
      <TextField name='id' label="Github ID" error={idError!=0} sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }} value={user.id} onChange={getUserData} required></TextField><br /><br />

      <Typography>Enter your GitHub Repository Name
        <Tooltip placement='right' title='For eg. - If your Repository link is www.github.com/githubID/repoName, Then your Repository Name will be "repoName" part in the link.'>
          <InfoOutlinedIcon fontSize='small' style={{marginBottom:'-4px',marginLeft:'4px', opacity:'0.6'}}/>
        </Tooltip>
      </Typography>
      <TextField label="Github Repo Name" name='repo' color="primary" error={repoError!=0}
      sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }} value={user.repo} onChange={getUserData} required></TextField><br /><br />
      <Typography>Enter your email
        <Tooltip placement='right' title='The email is being collected to send reminder email to a participant of he/she forgets to do a commit till EOD'>
          <InfoOutlinedIcon fontSize='small' style={{marginBottom:'-4px',marginLeft:'4px', opacity:'0.6'}}/>
        </Tooltip>
      </Typography>
      <TextField label="Email ID" name='email' color="primary" inputMode='email' error={emailError!=0}
      sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }} value={user.email} onChange={getUserData} required></TextField><br /><br />
      <b>
      {idError==1 && <><Typography textAlign="center" >User already exists</Typography></>}
      {idError==2 && <><Typography textAlign="center" >Invalid GitHub ID</Typography></>}
      {idError==4 && <><Typography textAlign="center" >Already disqualified</Typography></>}
      {idError==5 && <><Typography textAlign="center" >Github ID can't be empty</Typography></>}
      {repoError==5 && <><Typography textAlign="center" >Repo can't be empty</Typography></>}
      {emailError==5 && <><Typography textAlign="center" >Email can't be empty</Typography></>}
      {emailError==2 && <><Typography textAlign="center" >Invalid Email</Typography></>}
      {repoError==4 && <><Typography textAlign="center" >Repo should be created on {datte.toDateString()}</Typography></>}
      {repoError==1 && <><Typography textAlign="center" >Repo already exists</Typography></>}
      {repoError==2 && <><Typography textAlign="center" >Repo does not exists!</Typography></>}
      {repoError==3 && <><Typography textAlign="center" >Some error occured, Please try again later</Typography></>}
      </b>
      <Button variant="contained" onClick={postData}>Submit</Button><br /><br />
      <Typography textAlign="center" style={{position:'absolute',bottom:0,left:0,right:0,marginLeft:'auto',marginRight:'auto'}}>Know More<br/>
      <Link to='detail' smooth={true}><KeyboardDoubleArrowDownIcon /></Link>
      </Typography>
    </Box>
    </div>
    <br />
    <div id='detail'>
      <Detail />
    </div>
  </div>;
}
