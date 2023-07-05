import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './panel.css';
import app from '../backend';
import { collection, getFirestore, query, getDocs } from "firebase/firestore";
const db = getFirestore(app);

export default function Panel(forDisqualified: boolean) {

  function createDataDisq(

    name: string,
    project: string,
    commits: number,
    issues: number,
    avgComm: number,
    score: number,
  ) {
    return { name, project, commits, issues, avgComm, score };
  }

  function createDataNotDisq(
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

  type RowTypeNotDisq = {
    rank: number;
    name: string;
    project: string;
    commits: number;
    issues: number;
    avgComm: number;
    score: number;
    strikes: number;
  };
  type RowTypeDisq = {
    name: string;
    project: string;
    commits: number;
    issues: number;
    avgComm: number;
    score: number;
  };

  const [rows, setRows] = useState<Array<RowTypeNotDisq>>([]);
  const [rowsDisq, setRowsDisq] = useState<Array<RowTypeDisq>>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Array<RowTypeNotDisq>>([]);
  const [searchResultsDisq, setSearchResultsDisq] = useState<Array<RowTypeDisq>>([]);
  const [searchExists, setSearchExists] = useState(true);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<string | null>(null);

  async function users() {
    try{
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    const updatedRowsNotDisq = [];
    const updatedRowsDisq = [];
    // for (const doc of querySnapshot.docs) {
    //   const id = doc.get('id');
    //   const repo = doc.get('repo');
    //   const commits = await fetchCommits(id, repo);
    //   const issues = await fetchIssues(id, repo);

      //   const avgCom = await calculateAverageCommits(id, repo, days);
      //   const strikes = await striker(id, repo);
      //   if (strikes > 3) {

      //     await updateDoc(doc.ref, {
      //       disqualified: true
      //     });
      //   }
      //   if (strikes <= 3 && strikes != -1) {
      //     updatedRows.push(
      //       createData(
      //         rank,
      //         id,
      //         repo,
      //         commits,
      //         issues,
      //         avgCom,
      //         0.8 * commits + 0.5 * issues + avgCom,
      //         strikes
      //       )
      //     );
      //   }


      // }

      const currentTime = new Date();
      setLastFetchTimestamp(currentTime.toISOString());
      const storedTimestamp = lastFetchTimestamp ? new Date(lastFetchTimestamp) : null;
      const timeDifference = storedTimestamp ? currentTime.getTime() - storedTimestamp.getTime() : undefined;
      const shouldUpdateLocalStorage = !storedTimestamp || timeDifference === undefined || timeDifference > 35 * 60 * 1000; // 35 minutes in milliseconds

      if (!shouldUpdateLocalStorage) {
        const storedData = localStorage.getItem('querySnapshot');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Update the state with the retrieved data
          setRows(parsedData.rows);
          // ...
          return; // Exit the function since data is retrieved from local storage
        }
      }

      for (const doc of querySnapshot.docs) {
        if(doc.get('disqualified')===false){
          const id = doc.get('id');
          const repo = doc.get('repo');
          const commits=doc.get('totalCommits');
          const issues=doc.get('issAndPrs');
          const avgCom=doc.get('avgCommits');
          const rank=doc.get('rank');
          const strikes=doc.get('strike');
          const score=doc.get('score');
          updatedRowsNotDisq.push(
            createDataNotDisq(
              rank,
              id,
              repo,
              commits,
              issues,
              avgCom,
              score,
              strikes
            )
          );
        }else{
          const id = doc.get('id');
          const repo = doc.get('repo');
          const commits=doc.get('totalCommits');
          const issues=doc.get('issAndPrs');
          const avgCom=doc.get('avgCommits');
          const score=doc.get('score');
          updatedRowsDisq.push(
            createDataDisq(
              id,
              repo,
              commits,
              issues,
              avgCom,
              score
            )
          );
        }
  }
    updatedRowsNotDisq.sort((a, b) => b.score - a.score);
    setRows(updatedRowsNotDisq);
    updatedRowsDisq.sort((a, b) => b.score - a.score);
    setRowsDisq(updatedRowsDisq);
  
  }catch (error) {
    console.error("Failed to fetch user data:", error);
    setError(true);
  } finally {
    setLoading(false);
  }
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

  // const [searchInput, setSearchInput] = useState('');
  // const [searchResults, setSearchResults] = useState<Array<RowTypeNotDisq>>([]);
  // const [searchResultsDisq, setSearchResultsDisq] = useState<Array<RowTypeDisq>>([]);
  // const [searchExists, setSearchExists] = useState(true);

  function handleSearch(val: string) {
    if (!forDisqualified) {
      setSearchInput(val);
      const filteredResults = rows.filter((row) => {
        const usernameMatch = row.name.toLowerCase().includes(searchInput.toLowerCase());
        const projectMatch = row.project.toLowerCase().includes(searchInput.toLowerCase());
        return usernameMatch || projectMatch;
      });

      if (filteredResults.length === 0) { setSearchExists(false) } else if (searchInput.length < 2) { setSearchExists(true); setSearchResults(rows) } else { setSearchExists(true); setSearchResults(filteredResults) }
    } else {
      setSearchInput(val);
      const filteredResults = rowsDisq.filter((row) => {
        const usernameMatch = row.name.toLowerCase().includes(searchInput.toLowerCase());
        const projectMatch = row.project.toLowerCase().includes(searchInput.toLowerCase());
        return usernameMatch || projectMatch;
      });

      if (filteredResults.length === 0) { setSearchExists(false) } else if (searchInput.length < 2) { setSearchExists(true); setSearchResultsDisq(rowsDisq) } else { setSearchExists(true); setSearchResultsDisq(filteredResults) }
    }
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem('leaderboardData');
    const storedTimestamp = localStorage.getItem('lastFetchTimestamp');

    // Calculate time difference
    const currentTime = new Date();
    const timeDifference = storedTimestamp ? currentTime.getTime() - new Date(storedTimestamp).getTime() : undefined;
    const shouldUpdateLocalStorage = !storedTimestamp || timeDifference === undefined || timeDifference > 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check if stored data exists and should be updated
    if (storedData && !shouldUpdateLocalStorage) {
      // Use stored data
      setRows(JSON.parse(storedData));
    } else {
      // Fetch data from Firestore
      users();
    }
  }, []);

  // useEffect(() => {
  //   users();
  // }, []);


  if (loading) {
    return (
      <>
        <br />
        <br />
        <Typography variant="h4" align="center">Loading...</Typography>
      </>
    );
  }

  if (error) {
    return (
      <>
        <br />
        <br />
        <Typography variant="h4" align="center">Error occurred. Please try again later.</Typography>
      </>
    );
  }

  if (!forDisqualified) {
    return (
      <div className='table' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontSize: '2vw' }}>Leaderboard</p>
        <TextField
          variant='outlined'
          sx={{ alignContent: "center", display: 'flex', justifyItems: 'center', width: '50%' }}
          inputProps={{ className: "textfield_input" }}
          label="Search by username or project name"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          color='primary'

          InputProps={{
            style: {
              backgroundColor: 'white',
            }
          }}
          InputLabelProps={{
            style: {
              color: 'grey',
            }
          }}
        />
        {!searchExists && <><Typography variant="h6" align="center">Search Not Found</Typography></>}
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
  } else {
    return (

      <div className='table' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontSize: '2vw' }}>Disqualified Participants</p>
        <TextField
          variant='outlined'
          sx={{ alignContent: "center", display: 'flex', justifyItems: 'center', width: '50%' }}
          inputProps={{ className: "textfield_input" }}
          label="Search by username or project name"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          color='primary'

          InputProps={{
            style: {
              backgroundColor: 'white',
            }
          }}
          InputLabelProps={{
            style: {
              color: 'grey',
            }
          }}
        />
        {!searchExists && <><Typography variant="h6" align="center">Search Not Found</Typography></>}
        <br />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" >Name</TableCell>
                <TableCell align="center">Project</TableCell>
                <TableCell align="center" onClick={sortAccordingToCommits}>Total Commits</TableCell>
                <TableCell align="center" onClick={sortAccordingToIssues}>Issues and Pull Requests</TableCell>
                <TableCell align="center" onClick={sortAccordingToAvgComm} title='Total commits divided by number of days passed'>Average Commits per Day</TableCell>
                <TableCell align="center" onClick={sortAccordingToScore} title='0.8*Commits + 0.5*issues + average commits'>Total Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(searchResultsDisq.length > 0 ? searchResultsDisq : rowsDisq).map((row) => (
                <TableRow>
                  <TableCell align="center"><Link style={{ textDecoration: "none", color: "black" }} to={`https://github.com/${row.name}`} target="_blank">{row.name}</Link></TableCell>
                  <TableCell align="center"><Link style={{ textDecoration: "none", color: "black" }} to={`https://github.com/${row.name}/${row.project}`} target="_blank" >{row.project} </Link></TableCell>
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
    );
  }
}