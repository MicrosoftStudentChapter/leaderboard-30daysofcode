
import { Typography, TextField, Box, AppBar, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Detail from './Detail';




export default function App() {
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
      <Button variant="contained">Leader Board</Button><br /><br />

      <Typography textAlign="center">Enter your GitHub ID</Typography><br />
      <TextField className="id-textfield" label="Github ID" sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }}></TextField><br /><br />

      <Typography textAlign="center" >Enter your GitHub Repository Link</Typography><br />
      <TextField label="Github Repo Link" color="primary" 
      sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px' ,
      }}></TextField><br /><br />

      <Button variant="contained" >Submit</Button><br /><br />

      <Typography textAlign="center" >Know More</Typography><br />
      <KeyboardDoubleArrowDownIcon />
      
    </Box>
    <Detail />
  </div>;
  
}



