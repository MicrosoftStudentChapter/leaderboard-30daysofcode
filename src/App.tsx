import { Typography ,TextField } from '@mui/material';
import Button from '@mui/material/Button';


export default function App() {
  return <div>
    <Typography variant="h2"
    align="center">Welcome <br/>to <br/>30 Days of Code 🔥</Typography>
  <Button variant="contained">Leader Board</Button>
  <TextField label="Github ID" color="primary"></TextField>
  <TextField label="Github Repo Link" color="primary"></TextField>
</div>;
}


