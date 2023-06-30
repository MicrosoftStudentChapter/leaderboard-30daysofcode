import background from '../Assets/background.svg';
import {Typography, Table, TableBody ,TableCell,TableContainer,TableHead,TableRow,Paper} from '@mui/material';
import logo from '../Assets/MLSC logo.png';
import './disqboard.css';
import DayCount,{dayCounter} from '../Home/DayCount';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import app from '../backend';
import { collection, getFirestore, query, getDocs, where } from "firebase/firestore";
const db = getFirestore(app);
function createData(
name: string,
project: string,
commits: number,
issues: number,
avgComm: number,
score: number,
) {
return { name, project, commits, issues, avgComm, score };
}

async function fetchCommits(owner:string, repo:string) {
try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
    const n = response.data.length; // Return the number of commits
    return n;
} catch (error) {
    throw new Error(`Failed to fetch commits: ${error}`);
}
}

async function fetchIssues(owner:string, repo:string) {
try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`);
    const closedIssues= await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=closed`)
    const n= response.data.length+closedIssues.data.length; // Return the number of issues
    return n;
} catch (error) {
    throw new Error(`Failed to fetch commits: ${error}`);
}
}

async function calculateAverageCommits(owner:string, repo:string, days:number) {
try {
    const commits = await fetchCommits(owner, repo);
    const averageCommits = commits / days;
    return averageCommits;
} catch (error) {
    console.error(error);
}
return 0;
}

export default function DisqualifiedPage(){
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
            <DisqPanel/>
        </div>
    );
}

function DisqPanel() {

    type RowType = {
        name: string;
        project: string;
        commits: number;
        issues: number;
        avgComm: number;
        score: number;
      };
    const [rows,setRows] = useState<Array<RowType>>([]);

    function sortAccordingToCommits(){
        rows.sort((a,b)=>b.commits-a.commits);
        setRows([...rows]);
      }
      
      function sortAccordingToIssues(){
        rows.sort((a,b)=>b.issues-a.issues);
        setRows([...rows]);
      }
    
      function sortAccordingToAvgComm(){
        rows.sort((a,b)=>b.avgComm-a.avgComm);
        setRows([...rows]);
      }
    
      function sortAccordingToScore(){
        rows.sort((a,b)=>b.score-a.score);
        setRows([...rows]);
      }
      
    const days=dayCounter();
    async function users() {
    const q = query(collection(db, "users"),where("disqualified", "==", true));
    const querySnapshot = await getDocs(q);
    const updatedRows = [];
    for (const doc of querySnapshot.docs) {
        const id= await doc.get('id');
        const repo= await doc.get('repo');
        const commits = await fetchCommits(id, repo);
        const issues = await fetchIssues(id, repo);
        const avgCom = await calculateAverageCommits(id, repo, days);
            updatedRows.push(
                createData(
                    id,
                    repo,
                    commits,
                    issues,
                    avgCom,
                    0.8 * commits + 0.5 * issues + avgCom
                )
                );
        }

    setRows(updatedRows);
    }
    useEffect(() => {
        users();
    }, []);
    if(rows.length===0) return <><br/><br/><Typography variant="h4" align="center">Loading...</Typography></>
    return <><div className='table'>
    <Typography variant='h5' align='center'>Disqualified Participants</Typography><br />
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center" >Name</TableCell>
                    <TableCell align="center">Project</TableCell>
                    <TableCell align="center" onClick={sortAccordingToCommits}>Total Commits</TableCell>
                    <TableCell align="center" onClick={sortAccordingToIssues}>Issues and Pull Requests</TableCell>
                    <TableCell align="center"onClick={sortAccordingToAvgComm} title='Total commits divided by number of days passed'>Average Commits per Day</TableCell>
                    <TableCell align="center"onClick={sortAccordingToScore} title='0.8*Commits + 0.5*issues + average commits'>Total Score</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow>
                    <TableCell  align="center"><Link  style={{textDecoration:"none",color: "black" }} to={`https://github.com/${row.name}`} target="_blank">{row.name}</Link></TableCell>
                    <TableCell align="center"><Link style={{textDecoration:"none" ,color: "black"  }} to={`https://github.com/${row.name}/${row.project}`} target="_blank" >{row.project} </Link></TableCell>
                    <TableCell align="center">{row.commits.toFixed(2)}</TableCell>
                    <TableCell align="center">{row.issues.toFixed(2)}</TableCell>
                    <TableCell align="center">{row.avgComm.toFixed(2)}</TableCell>
                    <TableCell align="center">{row.score.toFixed(2)}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </TableContainer>
</div>
</>;
}