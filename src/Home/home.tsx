import { Typography, TextField, Box, AppBar, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Detail from './Detail';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { collection, addDoc,getFirestore, query, where, getDocs } from "firebase/firestore";
import app from "../backend";
const db = getFirestore(app);
export default function Home(){
    const navigate = useNavigate();

    const [idError, setIdError] = useState(0); // 0 - no error, 1 - already exists error, 2 - invalid id error
    const [repoError, setRepoError] = useState(0); // 0 - no error, 1 - already exists error, 2 - invalid repo error

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
        
        const q = query(collection(db, "users"), where("id", "==", user.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
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

        navigate("/leaderboard");
        try {
            addDoc(collection(db, "users"), {
                id: user.id,
                repo: user.repo,
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
          <img src=".././public/Logo.png" className="mlsc-logo" style={{ height: 80, }} />
          <Typography sx={{marginLeft:"auto"}} >Day 0</Typography>
        </Typography>
      </Grid>

    </AppBar>
    <Box textAlign="center"><Typography variant="h2" >Welcome <br />to <br />30 Days of Code 🔥</Typography><br />
      <Button variant="contained" onClick={()=>navigate("/leaderboard")}>Leader Board</Button><br /><br />

      <Typography textAlign="center">Enter your GitHub ID</Typography><br />
      <TextField className="id-textfield" name='id' label="Github ID" sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }} value={user.id} onChange={getUserData} required></TextField><br /><br />

      <Typography textAlign="center" >Enter your GitHub Repository Name</Typography><br />
      <TextField label="Github Repo Link" name='repo' color="primary" 
      sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }} value={user.repo} onChange={getUserData} required></TextField><br /><br />
      {idError==1 && <><Typography textAlign="center" >User already exists</Typography><br /></>}
      {idError==2 && <><Typography textAlign="center" >Invalid GitHub ID</Typography><br /></>}
      {repoError==1 && <><Typography textAlign="center" >Repo already exists</Typography><br /></>}
      {repoError==2 && <><Typography textAlign="center" >Repo does not exists!</Typography><br /></>}
      {repoError==3 && <><Typography textAlign="center" >Some error occured, Please try again later :/</Typography><br /></>}
      <Button variant="contained" onClick={postData}>Submit</Button><br /><br />

      <Typography textAlign="center" >Know More</Typography><br />
      <KeyboardDoubleArrowDownIcon />
      
    </Box>
    <Detail />
  </div>;
}