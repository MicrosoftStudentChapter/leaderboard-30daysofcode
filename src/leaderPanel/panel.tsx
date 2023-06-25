import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './panel.css';
import app from '../backend';
import { collection,getFirestore, query, getDocs } from "firebase/firestore";
import axios from 'axios';
import {useState,useEffect} from 'react';
const db = getFirestore(app);
function createData(
  rank: number,
  name: string,
  project: string,
  commits: number,
  issues: number,
  avgComm: number,
  score: number,
) {
  return {rank, name, project, commits, issues, avgComm, score };
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
    const n= response.data.length; // Return the number of issues
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




// async function users() {
//   const q = query(collection(db, "users"));
//   const querySnapshot = await getDocs(q);
  
//   querySnapshot.forEach(async (doc) => {
//     var commits=await fetchCommits(doc.get('id'),doc.get('repo'));
//     var issues=await fetchIssues(doc.get('id'),doc.get('repo'));
//     var avgCom=await calculateAverageCommits(doc.get('id'),doc.get('repo'),7);
//     setRows([{rank:rank,name:doc.get('id'),project:doc.get('repo'),commits:commits,issues:issues,avgComm:avgCom,score:0.8*commits+0.5*issues+avgCom}]);
//   });
// }

export default function Panel() {
  var [rows,setRows] = useState([createData(0, 'John', 'Project 1', 100, 10, 10, 100),]);
  var [rank, setRank] = useState(1);

  useEffect(() => {
    async function users() {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
    
      querySnapshot.forEach(async (doc) => {
        var commits = await fetchCommits(doc.get('id'), doc.get('repo'));
        var issues = await fetchIssues(doc.get('id'), doc.get('repo'));
        var avgCom = await calculateAverageCommits(doc.get('id'), doc.get('repo'), 7);
        setRows((prevRows) => [
          ...prevRows,
          createData(
            rank,
            doc.get('id'),
            doc.get('repo'),
            commits,
            issues,
            avgCom,
            0.8 * commits + 0.5 * issues + avgCom
          ),
        ]);
        console.log(rows);
        setRank((prevRank) => prevRank + 1);
      });
    }
    users();
  }, []);
  return (
    <div className='table'>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Project</TableCell>
            <TableCell align="center">Total Commits</TableCell>
            <TableCell align="center">Issues</TableCell>
            <TableCell align="center">Average Commits per Day</TableCell>
            <TableCell align="center">Total Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.rank}>
              <TableCell component="th" scope="row">
                {row.rank}
              </TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.project}</TableCell>
              <TableCell align="center">{row.commits}</TableCell>
              <TableCell align="center">{row.issues}</TableCell>
              <TableCell align="center">{row.avgComm}</TableCell>
              <TableCell align="center">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
</div>
  );
}