
import { Typography, TextField, Box, AppBar, Grid, Button } from '@mui/material';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Detail from './Detail';
import DayCount from './DayCount';

export default function App() {
  return <div className="page">
    <AppBar position="static" color="transparent" elevation={0}>

      <Grid justifyContent="space-between">
        <Typography noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: "flex" } }}>
          <img src="../src/Logo.png" style={{ height: 80, }} />
          <DayCount />
        </Typography>
      </Grid>

    </AppBar>
    <Box textAlign="center">
      <Typography variant="h2" >Welcome <br />to <br />30 Days of Code 🔥</Typography><br />
      <Button variant="contained" sx={{ marginBottom: '16px' }}>Leader Board</Button><br />

      <Typography paragraph>Enter your GitHub ID</Typography>
      <TextField label="Github ID" sx={{
        backgroundColor: "whitesmoke",
        borderRadius: '8px',
        marginBottom: '16px',
      }}></TextField><br />

      <Typography paragraph>Enter your GitHub Repository Name</Typography>
      <TextField label="Github Repo Name"
        sx={{
          backgroundColor: "whitesmoke",
          borderRadius: '8px',
          marginBottom: '16px',
        }}></TextField><br />

      <Button variant="contained" sx={{ marginBottom: '16px' }} >Submit</Button><br />

      <Typography paragraph>Know More</Typography>

      <KeyboardDoubleArrowDownIcon />

    </Box>
    <Detail />
  </div>;
}



