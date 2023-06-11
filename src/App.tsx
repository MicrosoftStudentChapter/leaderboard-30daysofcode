import { Typography, TextField, Box } from '@mui/material';
import Button from '@mui/material/Button';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Detail from './Detail';



export default function App() {
  return <div className="page">
    <Box textAlign="center"><Typography variant="h2" >Welcome <br />to <br />30 Days of Code 🔥</Typography><br />
    <Button variant="contained">Leader Board</Button><br /><br />
      <Typography textAlign="center">Enter your GitHub ID</Typography><br />
      <TextField className="id-textfield" label="Github ID" color="primary"></TextField><br /><br />

      <Typography textAlign="center" >Enter your GitHub Repository Link</Typography><br />
      <TextField label="Github Repo Link" color="primary" ></TextField><br /><br />

      <Button variant="contained" >Submit</Button><br /><br />

      <Typography textAlign="center" >Know More</Typography><br />
      <KeyboardDoubleArrowDownIcon />
    </Box>
    <Detail />
  </div>;
}


