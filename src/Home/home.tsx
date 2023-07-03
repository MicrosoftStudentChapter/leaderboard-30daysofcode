import { Typography, TextField, Box, AppBar, Grid, Button} from '@mui/material';
import { Link } from "react-scroll";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Detail from './Detail';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { collection, addDoc,getFirestore, query, where, getDocs } from "firebase/firestore";
import app from "../backend";
import DayCount,{date} from './DayCount';
import axios from 'axios';
const db = getFirestore(app);
export default function Home(){
    const navigate = useNavigate();

    const [idError, setIdError] = useState(0); // 0 - no error, 1 - already exists error, 2 - invalid id error, 3 - some error occured, 4 - already disqualified
    const [repoError, setRepoError] = useState(0); // 0 - no error, 1 - already exists error, 2 - invalid repo error, 3 - some error occured, 4 - repo should be created today

    const [user, setUser] = useState({
        id: "",
        repo: "",
    });

    const getUserData = (e: any) => {
        console.log(e.target.value);
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };
    

    async function postData (){
        if(user.id==="" || user.repo==="") return;
        
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
      if (created_at.getDate() !== today.getDate()) {
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
                strike: 0,
                disqualified: false,
                lastStrikeSha:''//sha of the last strike commit
            });
            return 0;
          } catch (e) {
            console.error("Error adding document: ", e);
            setRepoError(3);
            return 3;
          }
        
    }

  return <div className="page">
    <AppBar position="static" color="transparent" elevation={0}>
      
      <Grid justifyContent="space-between">
      <Typography noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: "flex" } }}>
          <img src={logo} style={{ height: 80, }} />
          <DayCount />
        </Typography>
      </Grid>

    </AppBar>
    <Box textAlign="center" ><Typography variant="h2" >Welcome to 30 Days of Code🔥</Typography><br />
    <div style={{display:'flex',gap:'5px',justifyContent:'center'}}>
      <Button variant="contained" onClick={()=>navigate("/leaderboard")}>Leader Board</Button>
      <Button variant="contained" onClick={()=>navigate("/disqualified")}>Disqualified</Button>
    </div><br /><br />
      <Typography>Enter your GitHub ID</Typography><br />
      <TextField name='id' label="Github ID" sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }} value={user.id} onChange={getUserData} required></TextField><br /><br />

      <Typography>Enter your GitHub Repository Name</Typography><br />
      <TextField label="Github Repo Name" name='repo' color="primary" 
      sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }} value={user.repo} onChange={getUserData} required></TextField><br /><br />
      {idError==1 && <><Typography textAlign="center" >User already exists</Typography><br /></>}
      {idError==2 && <><Typography textAlign="center" >Invalid GitHub ID</Typography><br /></>}
      {idError==4 && <><Typography textAlign="center" >Already disqualified</Typography><br /></>}
      {repoError==4 && <><Typography textAlign="center" >Repo should be created today</Typography><br /></>}
      {repoError==1 && <><Typography textAlign="center" >Repo already exists</Typography><br /></>}
      {repoError==2 && <><Typography textAlign="center" >Repo does not exists!</Typography><br /></>}
      {repoError==3 && <><Typography textAlign="center" >Some error occured, Please try again later :/</Typography><br /></>}
      <Button variant="contained" onClick={postData}>Submit</Button><br /><br />

      <Typography textAlign="center" >Know More</Typography>
      <Link to='detail' smooth={true}><KeyboardDoubleArrowDownIcon /></Link>
      
    </Box>
    <br />
    <div id='detail'>
      <Detail />
    </div>
  </div>;
}
