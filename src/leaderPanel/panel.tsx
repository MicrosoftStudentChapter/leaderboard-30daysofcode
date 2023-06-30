import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './panel.css';
import app from '../backend';
import { collection, getFirestore, query, getDocs, updateDoc, where } from "firebase/firestore";
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
const db = getFirestore(app);

async function removeInactiveUsers() {
  const previousDay = new Date();
  previousDay.setDate(previousDay.getDate() - 1);
  previousDay.setHours(0, 0, 0, 0);
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  for (const document of querySnapshot.docs) {
    const id = document.get('id');
    const repo = document.get('repo');
    const response = await axios.get(`https://api.github.com/repos/${id}/${repo}/commits`);
    const mostRecentCommit = response.data[0]; // Get the first (most recent) commit from the response
    //console.log(mostRecentCommit);
    const latest = mostRecentCommit.commit.author.date;
    const timestamp = new Date(latest); // Create a Date object for the given timestamp

    if (previousDay < timestamp) {
      //console.log("Previous date is earlier than the timestamp.");
    } else if (previousDay > timestamp) {
      await updateDoc(document.ref, {
        disqualified: true,
      });
    } else {
      //console.log("Previous date is the same as the timestamp.");
    }
  }
}

function createData(
  rank: number,
  name: string,
  project: string,
  commits: number,
  issues: number,
  avgComm: number,
  score: number,
  strikes: number
) {
  return { rank, name, project, commits, issues, avgComm, score, strikes };
}


async function fetchCommits(owner: string, repo: string) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
    const n = response.data.length; // Return the number of commits
    return n;
  } catch (error) {
    throw new Error(`Failed to fetch commits: ${error}`);
  }
}

async function fetchIssues(owner: string, repo: string) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`);
    const closedIssues = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=closed`)
    const n = response.data.length + closedIssues.data.length; // Return the number of issues
    return n;
  } catch (error) {
    throw new Error(`Failed to fetch commits: ${error}`);
  }
}

async function calculateAverageCommits(owner: string, repo: string, days: number) {
  try {
    const commits = await fetchCommits(owner, repo);
    const averageCommits = commits / days;
    return averageCommits;
  } catch (error) {
    console.error(error);
  }
  return 0;
}



export default function Panel() {
  type RowType = {
    rank: number;
    name: string;
    project: string;
    commits: number;
    issues: number;
    avgComm: number;
    score: number;
    strikes: number;
  };
  const [rows, setRows] = useState<Array<RowType>>([]);
  const rank = 1;

  async function users() {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const updatedRows = [];
    for (const doc of querySnapshot.docs) {
      const id = doc.get('id');
      const repo = doc.get('repo');
      const commits = await fetchCommits(id, repo);
      const issues = await fetchIssues(id, repo);
      const avgCom = await calculateAverageCommits(id, repo, 7);
      const strikes = await striker(id, repo);
      if (strikes > 3) {
        await updateDoc(doc.ref, {
          disqualified: true
        });
      }
      if (strikes <= 3 && strikes != -1) {
        updatedRows.push(
          createData(
            rank,
            id,
            repo,
            commits,
            issues,
            avgCom,
            0.8 * commits + 0.5 * issues + avgCom,
            strikes
          )
        );
      }

    }


    updatedRows.sort((a, b) => b.score - a.score);

    // Assign ranks based on the sorted order
    updatedRows.forEach((row, index) => {
      row.rank = index + 1;
    });

    setRows(updatedRows);
  }

  function sortAccordingToCommits() {
    rows.sort((a, b) => b.commits - a.commits);
    setRows([...rows]);
  }

  function sortAccordingToIssues() {
    rows.sort((a, b) => b.issues - a.issues);
    setRows([...rows]);
  }

  function sortAccordingToAvgComm() {
    rows.sort((a, b) => b.avgComm - a.avgComm);
    setRows([...rows]);
  }

  function sortAccordingToScore() {
    rows.sort((a, b) => b.score - a.score);
    setRows([...rows]);
  }
  function sortAccordingToStrikes() {
    rows.sort((a, b) => b.strikes - a.strikes);
    setRows([...rows]);
  }


  async function striker(owner: string, repo: string) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
      const mostRecentCommit = response.data[0]; // Get the first (most recent) commit from the response
      const sha = mostRecentCommit.sha;
      const commitResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`);
      const commit = commitResponse.data;
      const q = query(collection(db, "users"), where("id", "==", owner));
      const querySnapshot = await getDocs(q);
      const laststrikeSHA = await querySnapshot.docs[0].get('lastStrikeSha');
      const strike = querySnapshot.docs[0].get('strike').empty ? 0 : querySnapshot.docs[0].get('strike');
      if (laststrikeSHA != sha) {


        // Check if the files property exists and is an array
        if (commit.files && Array.isArray(commit.files)) {
          let linesChanged = 0;

          for (const file of commit.files) {
            linesChanged += file.changes;
          }

          const dis = await querySnapshot.docs[0].get('disqualified')
          if (dis) return -1;

          if (owner != mostRecentCommit.author.login) {
            try {
              querySnapshot.docs.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                  strike: strike + 1,
                  lastStrikeSha: sha
                });
              })
              return strike + 1;
            } catch (e) {
              console.error("Error adding document: ", e);
              return -1;
            }
          }

          if (linesChanged < 3) {
            try {
              querySnapshot.docs.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                  strike: strike + 1,
                  lastStrikeSha: sha
                });
              })
              return strike + 1;
            } catch (e) {
              console.error("Error adding document: ", e);
              return -1;
            }
          }
          return 0;
        }
      } else {
        return strike;
      }
    } catch (error) {
      console.error(`Failed to fetch commit details: ${error}`);
      return -1;
    }
    return -1;
  }

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<RowType[]>([]);


  const handleSearch = () => {
    const filteredResults = rows.filter((row) => {
      const usernameMatch = row.name.toLowerCase().includes(searchInput.toLowerCase());
      const projectMatch = row.project.toLowerCase().includes(searchInput.toLowerCase());
      return usernameMatch || projectMatch;
    });
    setSearchResults(filteredResults);
  };

  removeInactiveUsers();

  useEffect(() => {
    users();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  


  if (rows.length === 0) return <><br /><br /><Typography variant="h4" align="center">Loading...</Typography></>
  return (
    <div className='table'>
      <Paper className='searchBar' sx={{ marginLeft: "auto" , backgroundColor:"grey"}}>
        <Stack direction="row">
          
          <TextField 
          sx={{color: "black"}}
          inputProps={{className:"textfield_input"}}
          label="Search by username or project name" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} variant="standard" />

          <Button variant="text" sx={{ margin: "auto" }} onClick={handleSearch}><SearchIcon sx={{ color: "whitesmoke" }} /></Button>
        </Stack>
      </Paper>
      <br />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={sortAccordingToScore}>Rank</TableCell>
              <TableCell align="center" >Name</TableCell>
              <TableCell align="center">Project</TableCell>
              <TableCell align="center" onClick={sortAccordingToCommits}>Total Commits</TableCell>
              <TableCell align="center" onClick={sortAccordingToIssues}>Issues and Pull Requests</TableCell>
              <TableCell align="center" onClick={sortAccordingToAvgComm} title='Total commits divided by number of days passed'>Average Commits per Day</TableCell>
              <TableCell align="center" onClick={sortAccordingToScore} title='0.8*Commits + 0.5*issues + average commits'>Total Score</TableCell>
              <TableCell align="center" onClick={sortAccordingToStrikes} >Strikes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(searchResults.length > 0 ? searchResults : rows).map((row) => (
              <TableRow key={row.rank}>
                <TableCell component="th" scope="row">{row.rank}</TableCell>
                <TableCell align="center"><Link style={{ textDecoration: "none", color: "black" }} to={`https://github.com/${row.name}`} target="_blank">{row.name}</Link></TableCell>
                <TableCell align="center"><Link style={{ textDecoration: "none", color: "black" }} to={`https://github.com/${row.name}/${row.project}`} target="_blank" >{row.project} </Link></TableCell>
                <TableCell align="center">{row.commits.toFixed(2)}</TableCell>
                <TableCell align="center">{row.issues.toFixed(2)}</TableCell>
                <TableCell align="center">{row.avgComm.toFixed(2)}</TableCell>
                <TableCell align="center">{row.score.toFixed(2)}</TableCell>
                <TableCell align="center">{row.strikes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}