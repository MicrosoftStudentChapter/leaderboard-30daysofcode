import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './panel.css';

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

var rows = [createData(1, 'John', 'Project 1', 100, 10, 10, 100),
];

export default function Panel() {
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
            <TableRow>
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