import background from '../Assets/background.svg';
import Panel from '../leaderPanel/panel';
import logo from '../Assets/MLSC logo.png';
import './leaderboard.css';
import DayCount from '../Home/DayCount';

export default function LeaderboardPage(){
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
        <Panel />
        </div>
    );
    }