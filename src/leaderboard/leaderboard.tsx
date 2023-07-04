import background from '../Assets/background.svg';
import Panel from '../leaderPanel/panel';
import logo from '../Assets/MLSC logo.png';
import './leaderboard.css';
import DayCount from '../Home/DayCount';
import { Button} from '@mui/material';
import { useNavigate } from "react-router-dom";
export default function LeaderboardPage(){
    const navigate = useNavigate();
    return (
        <div style={{ backgroundImage: `url(${background})`, backgroundSize:'cover', height: '100vh' }}>
            <div className='logoAndDay'>
                <img src={logo} alt="MLSC Logo" className='logo'/>
                <div className='headingBox'>
                    <p className='heading'>30 Days of Code🔥</p>
                </div>
                {/* <p className='days'>Day 1</p> */}
                <div className='days'>
                <DayCount />
                </div>
            </div>
            <div style={{display:'flex',gap:'5px',justifyContent:'center'}}>
                <Button variant="contained" onClick={()=>navigate("/disqualified")}>Disqualified</Button>
                <Button variant="contained" onClick={()=>navigate("/")} style={{width:'8%'}}>Home</Button>
            </div>
        {Panel(false)}
        </div>
    );
    }