import { Box } from '@mui/material';
import  logo  from '../Assets/MLSC logo.png'
import './detail.css'
export default function Detail() {
    return <div className="detailed">
        <img src={logo} className="imglogo" />
        <Box className="boxo" >
            <div className="flexo">
                <h3 className="hero" >

                    What is 30 Days of Code?</h3>
                <p className="lists" ><ul><li>It is a coding challenge for students to enhance there coding knowledge and boost their contribution activity on GitHub.</li></ul></p>
                <h3 className="hero" >How to Participate?</h3>


                <ul className="lists">
                    <li>
                        Enter your Github ID.
                    </li>

                    <li>
                        Enter the name of the repository of your projects where will you be sumbitting your commits<br />
                        (Note: Please ensure that the repository must be created on the day  of start of challenge. )
                    </li>

                </ul>


                <h3 className="hero">Benefits</h3>


                <ul className="lists">
                    <li>
                        Enhance your coding skills by developing a great project on your own.
                    </li>

                    <li>
                        Boost your Open-Source contribution on GitHub.
                    </li>

                    <li>
                        Have a chance to win exciting prizes on top ranks.
                    </li>
                </ul>
                <h3 className="hero">Rules</h3>


                <ul className="lists">
                    <li>
                        There must be at least 1 commit daily. If a user fails to commit on any given day, the user will be disqualified.
                    </li>

                    <li>
                        There should be no more than one contributor to a single project. Having multiple contributors will result in a strike.
                    </li>

                    <li>
                        Repositories can be randomly checked for spam commits, spam issues, or spam pull requests. Attempting any of these actions will result in a strike.
                    </li>
                    <li>
                        If a user accumulates more than 3 strikes, the user will be disqualified.
                    </li>
                    <li>
                        There are points awarded for commits, issues, and pull requests in the repository.
                    </li>
                    <li>
                        Scoring System: <br /> Total Score = 0.8 * Number of Commits + 0.5 * (Number of Issues and Pull Requests) + Number of Average Commits per day
                    </li>
                </ul>
            </div>
        </Box>

    </div>
}